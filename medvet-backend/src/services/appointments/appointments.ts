import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { HookContext } from '@feathersjs/feathers'
import { requireAuth, restrictToOwner, checkSlotAvailability } from '../../hooks/security'
import type { Application } from '../../declarations'

export interface Appointment {
  id: string
  user_id: string
  pet_id: string
  professional_id: string
  service_id: string
  date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  created_at: Date
  updated_at: Date
}

export interface AppointmentData extends Omit<Appointment, 'id' | 'created_at' | 'updated_at'> {}

export interface AppointmentParams extends KnexAdapterParams<Appointment> {}

export class AppointmentService extends KnexService<Appointment, AppointmentData, AppointmentParams> {}

// Hook to handle $include parameter in query safely
const handleIncludes = async (context: HookContext) => {
  if (context.params.query?.$include) {
    const rawIncludes = context.params.query.$include
    context.params._includes = Array.isArray(rawIncludes) ? rawIncludes : [rawIncludes]
    delete context.params.query.$include
  }
  return context
}

// Hook to enrich appointments with related models (pet, service, professional, user)
const enrichAppointment = async (context: HookContext) => {
  const includes: string[] = context.params._includes || []
  const db = context.app.get('knexClient')

  const populateRecord = async (record: any) => {
    if (!record) return record

    if (!includes.length || includes.includes('pet') || includes.some(i => i.startsWith('pet'))) {
      if (record.pet_id) {
        const pet = await db('pets').where({ id: record.pet_id }).first()
        if (pet && pet.user_id) {
          const owner = await db('users').where({ id: pet.user_id }).first()
          pet.owner = owner ? { id: owner.id, name: owner.name, email: owner.email, phone: owner.phone } : null
        }
        record.pet = pet || null
      }
    }

    if (!includes.length || includes.includes('service')) {
      if (record.service_id) {
        const service = await db('services').where({ id: record.service_id }).first()
        record.service = service || null
      }
    }

    if (!includes.length || includes.includes('professional') || includes.some(i => i.startsWith('professional'))) {
      if (record.professional_id) {
        const pro = await db('professionals').where({ id: record.professional_id }).first()
        if (pro) {
          if (pro.user_id) {
            const u = await db('users').where({ id: pro.user_id }).first()
            pro.user = u ? { id: u.id, name: u.name, email: u.email, phone: u.phone } : null
          }
          record.professional = pro
        } else {
          record.professional = null
        }
      }
    }

    if (includes.includes('user')) {
      if (record.user_id) {
        const user = await db('users').where({ id: record.user_id }).first()
        record.user = user ? { id: user.id, name: user.name, email: user.email, phone: user.phone } : null
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

export const appointments = (app: Application) => {
  const options: KnexAdapterOptions = {
    paginate: app.get('paginate'),
    Model: app.get('knexClient'),
    name: 'appointments',
    whitelist: ['$include']
  }

  app.use('appointments', new AppointmentService(options), {
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove']
  })

  app.service('appointments').hooks({
    around: {
      all: []
    },
    before: {
      all: [requireAuth],
      find: [handleIncludes, restrictToOwner('user_id')],
      get: [handleIncludes, restrictToOwner('user_id')],
      create: [restrictToOwner('user_id'), checkSlotAvailability],
      patch: [restrictToOwner('user_id')],
      remove: [restrictToOwner('user_id')]
    },
    after: {
      all: [enrichAppointment]
    }
  })
}
