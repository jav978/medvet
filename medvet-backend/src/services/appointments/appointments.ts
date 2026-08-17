import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
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

export const appointments = (app: Application) => {
  const options: KnexAdapterOptions = {
    paginate: app.get('paginate'),
    Model: app.get('knexClient'),
    name: 'appointments'
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
      find: [restrictToOwner('user_id')],
      get: [restrictToOwner('user_id')],
      create: [restrictToOwner('user_id'), checkSlotAvailability],
      patch: [restrictToOwner('user_id')],
      remove: [restrictToOwner('user_id')]
    },
    after: {
      all: []
    }
  })
}

