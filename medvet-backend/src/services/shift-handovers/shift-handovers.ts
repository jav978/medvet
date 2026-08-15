import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { Application } from '../../declarations'

export interface ShiftHandover {
  id: string
  outgoing_vet_id?: string
  incoming_vet_id?: string
  shift_type: 'manana' | 'tarde' | 'noche' | 'guardia_24h'
  shift_date: string
  admitted_patients_count: number
  surgeries_count: number
  emergencies_count: number
  discharges_count: number
  critical_patients_notes?: string
  pending_tasks?: string
  shift_summary?: string
  created_at: Date
}

export interface ShiftHandoverData extends Omit<ShiftHandover, 'id' | 'created_at'> {}

export interface ShiftHandoverParams extends KnexAdapterParams<ShiftHandover> {}

export class ShiftHandoverService extends KnexService<ShiftHandover, ShiftHandoverData, ShiftHandoverParams> {}

export const shiftHandovers = (app: Application) => {
  const options: KnexAdapterOptions = {
    paginate: app.get('paginate'),
    Model: app.get('knexClient'),
    name: 'shift_handovers'
  }

  app.use('shift-handovers', new ShiftHandoverService(options), {
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove']
  })
}
