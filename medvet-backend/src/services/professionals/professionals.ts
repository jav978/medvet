import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
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

export const professionals = (app: Application) => {
  const options: KnexAdapterOptions = {
    paginate: app.get('paginate'),
    Model: app.get('knexClient'),
    name: 'professionals'
  }

  app.use('professionals', new ProfessionalService(options), {
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove']
  })
}
