import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import { requireAuth, requireRole } from '../../hooks/security'
import type { Application } from '../../declarations'

export interface MedicalRecord {
  id: string
  pet_id: string
  professional_id?: string
  appointment_id?: string
  record_type: 'consulta' | 'urgencia' | 'control' | 'hospitalizacion' | 'procedimiento'
  reason_for_visit?: string
  weight_kg?: number
  temperature?: number
  heart_rate?: number
  respiratory_rate?: number
  mucous_membranes?: string
  capillary_refill_time?: string
  anamnesis?: string
  physical_exam_findings?: string
  presumptive_diagnosis?: string
  definitive_diagnosis?: string
  treatment_plan?: string
  medical_prescription?: string
  patient_status: 'estable' | 'observacion' | 'critico' | 'alta' | 'hospitalizado' | 'prequirurgico' | 'postquirurgico'
  notes?: string
  created_at: Date
  updated_at: Date
}

export interface MedicalRecordData extends Omit<MedicalRecord, 'id' | 'created_at' | 'updated_at'> {}

export interface MedicalRecordParams extends KnexAdapterParams<MedicalRecord> {}

export class MedicalRecordService extends KnexService<MedicalRecord, MedicalRecordData, MedicalRecordParams> {}

export const medicalRecords = (app: Application) => {
  const options: KnexAdapterOptions = {
    paginate: app.get('paginate'),
    Model: app.get('knexClient'),
    name: 'medical_records'
  }

  app.use('medical-records', new MedicalRecordService(options), {
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove']
  })

  app.service('medical-records').hooks({
    around: {
      all: []
    },
    before: {
      all: [requireAuth],
      create: [requireRole(['admin', 'veterinarian'])],
      update: [requireRole(['admin', 'veterinarian'])],
      patch: [requireRole(['admin', 'veterinarian'])],
      remove: [requireRole(['admin'])]
    },
    after: {
      all: []
    }
  })
}

