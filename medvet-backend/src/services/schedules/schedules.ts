import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
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

export const schedules = (app: Application) => {
  const options: KnexAdapterOptions = {
    paginate: app.get('paginate'),
    Model: app.get('knexClient'),
    name: 'schedules'
  }

  app.use('schedules', new ScheduleService(options), {
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove']
  })
}
