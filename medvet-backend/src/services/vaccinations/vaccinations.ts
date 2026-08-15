import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { Application } from '../../declarations'

export interface Vaccination {
  id: string
  pet_id: string
  professional_id?: string
  vaccine_name: string
  type: 'vacuna' | 'desparasitacion' | 'refuerzo' | 'otro'
  batch_number?: string
  manufacturer?: string
  applied_date: string
  next_due_date?: string
  status: 'aplicada' | 'pendiente' | 'vencida' | 'cancelada'
  notes?: string
  created_at: Date
}

export interface VaccinationData extends Omit<Vaccination, 'id' | 'created_at'> {}

export interface VaccinationParams extends KnexAdapterParams<Vaccination> {}

export class VaccinationService extends KnexService<Vaccination, VaccinationData, VaccinationParams> {}

export const vaccinations = (app: Application) => {
  const options: KnexAdapterOptions = {
    paginate: app.get('paginate'),
    Model: app.get('knexClient'),
    name: 'vaccinations'
  }

  app.use('vaccinations', new VaccinationService(options), {
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove']
  })
}
