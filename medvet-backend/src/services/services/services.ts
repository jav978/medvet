import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { Application } from '../../declarations'

export interface VeterinaryService {
  id: string
  name: string
  description?: string
  duration: number
  price?: number
  category: 'consulta' | 'vacuna' | 'cirugia' | 'emergencia' | 'estetica' | 'laboratorio'
  active: boolean
  created_at: Date
}

export interface VeterinaryServiceData extends Omit<VeterinaryService, 'id' | 'created_at'> {}

export interface VeterinaryServiceParams extends KnexAdapterParams<VeterinaryService> {}

export class VeterinaryServiceService extends KnexService<VeterinaryService, VeterinaryServiceData, VeterinaryServiceParams> {}

export const services = (app: Application) => {
  const options: KnexAdapterOptions = {
    paginate: app.get('paginate'),
    Model: app.get('knexClient'),
    name: 'services'
  }

  app.use('services', new VeterinaryServiceService(options), {
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove']
  })
}
