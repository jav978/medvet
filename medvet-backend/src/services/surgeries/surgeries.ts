import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { Application } from '../../declarations'

export interface Surgery {
  id: string
  pet_id: string
  professional_id?: string
  medical_record_id?: string
  surgery_name: string
  surgery_type: 'programada' | 'urgencia' | 'ambulatoria' | 'mayor'
  pre_op_evaluation?: string
  anesthesia_protocol?: string
  surgical_technique?: string
  post_op_orders?: string
  status: 'programada' | 'en_quirofano' | 'recuperacion' | 'completada' | 'cancelada'
  surgery_date: string
  created_at: Date
  updated_at: Date
}

export interface SurgeryData extends Omit<Surgery, 'id' | 'created_at' | 'updated_at'> {}

export interface SurgeryParams extends KnexAdapterParams<Surgery> {}

export class SurgeryService extends KnexService<Surgery, SurgeryData, SurgeryParams> {}

export const surgeries = (app: Application) => {
  const options: KnexAdapterOptions = {
    paginate: app.get('paginate'),
    Model: app.get('knexClient'),
    name: 'surgeries'
  }

  app.use('surgeries', new SurgeryService(options), {
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove']
  })
}
