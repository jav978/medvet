import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { Application, HookContext } from '../../declarations'

export interface GroomingRecord {
  id: string
  pet_id: string
  stylist_id?: string
  service_name: string
  appointment_date: string
  start_time?: string
  coat_condition?: 'normal' | 'enredado' | 'nudos_severos' | 'dermatitis' | 'ectoparasitos'
  temperament?: 'docil' | 'nervioso' | 'agresivo' | 'anciano'
  special_shampoo?: string
  haircut_style?: string
  status: 'waiting' | 'in_bath' | 'drying_cutting' | 'ready' | 'delivered' | 'cancelled'
  price_usd?: number
  special_instructions?: string
  notes?: string
  created_at?: string
  updated_at?: string
  // Virtual
  pet?: any
  stylist?: any
}

export interface GroomingRecordData extends Partial<GroomingRecord> {}

export interface GroomingRecordParams extends KnexAdapterParams<any> {}

export class GroomingRecordService<ServiceParams extends GroomingRecordParams = GroomingRecordParams>
  extends KnexService<GroomingRecord, GroomingRecordData, GroomingRecordParams> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: false,
    Model: app.get('postgresqlClient'),
    name: 'grooming_records',
    multi: ['patch']
  }
}

const enrichGroomingRecord = async (context: HookContext) => {
  const db = context.app.get('postgresqlClient')
  const populateRecord = async (record: any) => {
    if (!record) return record

    // Get Pet & Owner
    if (record.pet_id) {
      const pet = await db('pets').where({ id: record.pet_id }).first()
      if (pet) {
        if (pet.user_id) {
          const owner = await db('users').where({ id: pet.user_id }).first()
          pet.owner = owner ? { id: owner.id, name: owner.name, email: owner.email, phone: owner.phone } : null
        }
        record.pet = pet
      }
    }

    // Get Stylist
    if (record.stylist_id) {
      const stylist = await db('professionals').where({ id: record.stylist_id }).first()
      if (stylist) {
        const user = stylist.user_id ? await db('users').where({ id: stylist.user_id }).first() : null
        record.stylist = {
          ...stylist,
          name: user ? user.name : 'Estilista Canino',
          email: user?.email
        }
      }
    }

    return record
  }

  if (Array.isArray(context.result)) {
    context.result = await Promise.all(context.result.map(populateRecord))
  } else if (context.result?.data && Array.isArray(context.result.data)) {
    context.result.data = await Promise.all(context.result.data.map(populateRecord))
  } else if (context.result) {
    context.result = await populateRecord(context.result)
  }

  return context
}

export const groomingRecords = (app: Application) => {
  app.use('grooming-records', new GroomingRecordService(getOptions(app)), {
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    events: []
  })

  app.service('grooming-records').hooks({
    around: {
      all: []
    },
    before: {
      all: [],
      find: [
        async (context: HookContext) => {
          if (!context.params.query?.$sort) {
            context.params.query = context.params.query || {}
            context.params.query.$sort = { created_at: -1 }
          }
          return context
        }
      ],
      get: [],
      create: [
        async (context: HookContext) => {
          context.data.created_at = new Date()
          context.data.updated_at = new Date()
          return context
        }
      ],
      patch: [
        async (context: HookContext) => {
          context.data.updated_at = new Date()
          return context
        }
      ],
      remove: []
    },
    after: {
      all: [enrichGroomingRecord]
    },
    error: {
      all: []
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    'grooming-records': GroomingRecordService
  }
}
