import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { HookContext } from '@feathersjs/feathers'
import type { Application } from '../../declarations'

export interface Schedule {
  id: string
  professional_id: string
  day_of_week: number
  start_time: string
  end_time: string
  active: boolean
}

export interface ScheduleData extends Omit<Schedule, 'id'> {}

export interface ScheduleParams extends KnexAdapterParams<Schedule> {}

export class ScheduleService extends KnexService<Schedule, ScheduleData, ScheduleParams> {}

const handleIncludes = async (context: HookContext) => {
  if (context.params.query?.$include) {
    const rawIncludes = context.params.query.$include
    context.params._includes = Array.isArray(rawIncludes) ? rawIncludes : [rawIncludes]
    delete context.params.query.$include
  }
  return context
}

const enrichSchedule = async (context: HookContext) => {
  const includes: string[] = context.params._includes || []
  const db = context.app.get('knexClient')

  const populateRecord = async (record: any) => {
    if (!record) return record

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

export const schedules = (app: Application) => {
  const options: KnexAdapterOptions = {
    paginate: app.get('paginate'),
    Model: app.get('knexClient'),
    name: 'schedules',
    whitelist: ['$include']
  }

  app.use('schedules', new ScheduleService(options), {
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove']
  })

  app.service('schedules').hooks({
    before: {
      all: [],
      find: [handleIncludes],
      get: [handleIncludes]
    },
    after: {
      all: [enrichSchedule]
    }
  })
}
