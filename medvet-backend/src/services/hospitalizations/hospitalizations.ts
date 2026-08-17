import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { Application, HookContext } from '../../declarations'

export interface Hospitalization {
  id: string
  pet_id: string
  box_id?: string
  vet_id?: string
  admission_date: string
  discharge_date?: string
  status: 'active' | 'critical' | 'stable' | 'pre_op' | 'post_op' | 'discharged' | 'transferred'
  reason_for_admission?: string
  presumptive_diagnosis?: string
  definitive_diagnosis?: string
  diet_instructions?: string
  fluid_therapy_plan?: string
  medication_schedule?: string
  daily_cost_usd?: number
  discharge_summary?: string
  notes?: string
  created_at?: string
  updated_at?: string
  // Virtual / joined fields
  pet?: any
  box?: any
  vet?: any
}

export interface HospitalizationData extends Partial<Hospitalization> {}

export interface HospitalizationParams extends KnexAdapterParams<any> {}

export class HospitalizationService<ServiceParams extends HospitalizationParams = HospitalizationParams>
  extends KnexService<Hospitalization, HospitalizationData, HospitalizationParams> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: false,
    Model: app.get('knexClient'),
    name: 'hospitalizations',
    multi: ['patch']
  }
}

// Hook to enrich hospitalizations with pet, owner, box and vet details
const enrichHospitalization = async (context: HookContext) => {
  const db = context.app.get('knexClient')
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

    // Get Box
    if (record.box_id) {
      const box = await db('hospitalization_boxes').where({ id: record.box_id }).first()
      record.box = box || null
    }

    // Get Vet
    if (record.vet_id) {
      const vet = await db('professionals').where({ id: record.vet_id }).first()
      if (vet) {
        const vetUser = vet.user_id ? await db('users').where({ id: vet.user_id }).first() : null
        record.vet = {
          ...vet,
          name: vetUser ? vetUser.name : 'Dr. Veterinario',
          email: vetUser?.email
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

export const hospitalizations = (app: Application) => {
  app.use('hospitalizations', new HospitalizationService(getOptions(app)), {
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    events: []
  })

  app.service('hospitalizations').hooks({
    around: {
      all: []
    },
    before: {
      all: [],
      find: [],
      get: [],
      create: [
        async (context: HookContext) => {
          context.data.created_at = new Date()
          context.data.updated_at = new Date()
          if (!context.data.admission_date) {
            context.data.admission_date = new Date()
          }
          return context
        }
      ],
      patch: [
        async (context: HookContext) => {
          context.data.updated_at = new Date()
          if (context.data.status === 'discharged' && !context.data.discharge_date) {
            context.data.discharge_date = new Date()
          }
          return context
        }
      ],
      remove: []
    },
    after: {
      all: [enrichHospitalization],
      create: [
        async (context: HookContext) => {
          const db = context.app.get('knexClient')
          const hosp = context.result
          if (hosp?.box_id && hosp.status !== 'discharged') {
            await db('hospitalization_boxes')
              .where({ id: hosp.box_id })
              .update({
                status: 'occupied',
                current_hospitalization_id: hosp.id,
                updated_at: new Date()
              })
          }
          return context
        }
      ],
      patch: [
        async (context: HookContext) => {
          const db = context.app.get('knexClient')
          const hosp = context.result
          if (hosp?.box_id) {
            if (hosp.status === 'discharged') {
              await db('hospitalization_boxes')
                .where({ id: hosp.box_id })
                .update({
                  status: 'available',
                  current_hospitalization_id: null,
                  updated_at: new Date()
                })
            } else {
              await db('hospitalization_boxes')
                .where({ id: hosp.box_id })
                .update({
                  status: 'occupied',
                  current_hospitalization_id: hosp.id,
                  updated_at: new Date()
                })
            }
          }
          return context
        }
      ]
    },
    error: {
      all: []
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    hospitalizations: HospitalizationService
  }
}
