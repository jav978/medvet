import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { Application } from '../../declarations'

export interface ClinicalAttachment {
  id: string
  pet_id: string
  medical_record_id?: string
  category: 'radiografia' | 'ecografia' | 'sangre' | 'orina' | 'biopsia' | 'informe_escaneado' | 'otro'
  title: string
  findings?: string
  file_url: string
  thumbnail_url?: string
  file_type?: string
  file_size?: number
  study_date?: string
  created_at: Date
}

export interface ClinicalAttachmentData extends Omit<ClinicalAttachment, 'id' | 'created_at'> {}

export interface ClinicalAttachmentParams extends KnexAdapterParams<ClinicalAttachment> {}

export class ClinicalAttachmentService extends KnexService<ClinicalAttachment, ClinicalAttachmentData, ClinicalAttachmentParams> {}

export const clinicalAttachments = (app: Application) => {
  const options: KnexAdapterOptions = {
    paginate: app.get('paginate'),
    Model: app.get('knexClient'),
    name: 'clinical_attachments'
  }

  app.use('clinical-attachments', new ClinicalAttachmentService(options), {
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove']
  })
}
