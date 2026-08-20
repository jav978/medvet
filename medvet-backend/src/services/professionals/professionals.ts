import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { HookContext } from '@feathersjs/feathers'
import type { Application } from '../../declarations'

export interface Professional {
  id: string
  user_id: string
  specialty: string
  active: boolean
  created_at: Date
}

export interface ProfessionalData extends Omit<Professional, 'id' | 'created_at'> {}

export interface ProfessionalParams extends KnexAdapterParams<Professional> {}

export class ProfessionalService extends KnexService<Professional, ProfessionalData, ProfessionalParams> {}

const handleIncludes = async (context: HookContext) => {
  if (context.params.query?.$include) {
    const rawIncludes = context.params.query.$include
    context.params._includes = Array.isArray(rawIncludes) ? rawIncludes : [rawIncludes]
    delete context.params.query.$include
  }
  return context
}

const enrichProfessional = async (context: HookContext) => {
  const includes: string[] = context.params._includes || []
  const db = context.app.get('knexClient')

  const populateRecord = async (record: any) => {
    if (!record) return record

    if (!includes.length || includes.includes('user')) {
      if (record.user_id) {
        const u = await db('users').where({ id: record.user_id }).first()
        record.user = u ? { id: u.id, name: u.name, email: u.email, phone: u.phone } : null
        if (u) {
          record.name = u.name
          record.email = u.email
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

export const professionals = (app: Application) => {
  const options: KnexAdapterOptions = {
    paginate: app.get('paginate'),
    Model: app.get('knexClient'),
    name: 'professionals',
    whitelist: ['$include']
  }

  app.use('professionals', new ProfessionalService(options), {
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove']
  })

  app.service('professionals').hooks({
    before: {
      all: [],
      find: [handleIncludes],
      get: [handleIncludes]
    },
    after: {
      all: [enrichProfessional]
    }
  })
}
