import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { Application, HookContext } from '../../declarations'

export interface HospitalizationBox {
  id: string
  code: string
  name: string
  type: 'icu' | 'standard' | 'isolation' | 'post_op' | 'feline' | 'canine'
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning'
  current_hospitalization_id?: string
  size?: string
  features?: string
  daily_rate_usd?: number
  active: boolean
  created_at?: string
  updated_at?: string
}

export interface HospitalizationBoxData extends Partial<HospitalizationBox> {}

export interface HospitalizationBoxParams extends KnexAdapterParams<any> {}

export class HospitalizationBoxService<ServiceParams extends HospitalizationBoxParams = HospitalizationBoxParams>
  extends KnexService<HospitalizationBox, HospitalizationBoxData, HospitalizationBoxParams> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: false,
    Model: app.get('knexClient'),
    name: 'hospitalization_boxes',
    multi: ['patch']
  }
}

export const hospitalizationBoxes = (app: Application) => {
  app.use('hospitalization-boxes', new HospitalizationBoxService(getOptions(app)), {
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    events: []
  })

  app.service('hospitalization-boxes').hooks({
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
      all: []
    },
    error: {
      all: []
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    'hospitalization-boxes': HospitalizationBoxService
  }
}
