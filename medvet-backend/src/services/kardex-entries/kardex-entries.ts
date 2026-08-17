import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { Application, HookContext } from '../../declarations'

export interface KardexEntry {
  id: string
  hospitalization_id: string
  professional_id?: string
  recorded_at: string
  entry_type: 'vitals' | 'medication' | 'fluids' | 'feeding_elimination' | 'evolution_note' | 'procedure'
  temperature?: number
  heart_rate?: number
  respiratory_rate?: number
  blood_pressure_sys?: number
  blood_pressure_dia?: number
  capillary_refill_time?: string
  mucous_membranes?: string
  pain_score?: number
  medication_name?: string
  dose_given?: string
  route?: string
  fluid_rate_ml_hr?: number
  fluid_volume_infused_ml?: number
  urination?: string
  defecation?: string
  appetite?: string
  vomit_episodes?: number
  notes?: string
  created_at?: string
  // Joined
  professional?: any
}

export interface KardexEntryData extends Partial<KardexEntry> {}

export interface KardexEntryParams extends KnexAdapterParams<any> {}

export class KardexEntryService<ServiceParams extends KardexEntryParams = KardexEntryParams>
  extends KnexService<KardexEntry, KardexEntryData, KardexEntryParams> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: false,
    Model: app.get('postgresqlClient'),
    name: 'kardex_entries',
    multi: ['patch']
  }
}

const enrichKardexEntry = async (context: HookContext) => {
  const db = context.app.get('postgresqlClient')
  const populateRecord = async (record: any) => {
    if (!record) return record

    if (record.professional_id) {
      const vet = await db('professionals').where({ id: record.professional_id }).first()
      if (vet) {
        const vetUser = vet.user_id ? await db('users').where({ id: vet.user_id }).first() : null
        record.professional = {
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

export const kardexEntries = (app: Application) => {
  app.use('kardex-entries', new KardexEntryService(getOptions(app)), {
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    events: []
  })

  app.service('kardex-entries').hooks({
    around: {
      all: []
    },
    before: {
      all: [],
      find: [
        async (context: HookContext) => {
          // Default order by recorded_at DESC
          if (!context.params.query?.$sort) {
            context.params.query = context.params.query || {}
            context.params.query.$sort = { recorded_at: -1 }
          }
          return context
        }
      ],
      get: [],
      create: [
        async (context: HookContext) => {
          context.data.created_at = new Date()
          if (!context.data.recorded_at) {
            context.data.recorded_at = new Date()
          }
          return context
        }
      ],
      patch: [],
      remove: []
    },
    after: {
      all: [enrichKardexEntry]
    },
    error: {
      all: []
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    'kardex-entries': KardexEntryService
  }
}
