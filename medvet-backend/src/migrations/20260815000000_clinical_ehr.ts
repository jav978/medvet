import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // 1. Create medical_records table
  await knex.schema.createTable('medical_records', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('pet_id').references('id').inTable('pets').onDelete('CASCADE').notNullable()
    table.uuid('professional_id').references('id').inTable('professionals').onDelete('SET NULL')
    table.uuid('appointment_id').references('id').inTable('appointments').onDelete('SET NULL')
    table.string('record_type', 50).defaultTo('consulta') // consulta, urgencia, control, hospitalizacion, procedimiento
    table.text('reason_for_visit')
    table.decimal('weight_kg', 5, 2)
    table.decimal('temperature', 4, 2)
    table.integer('heart_rate') // bpm
    table.integer('respiratory_rate') // rpm
    table.string('mucous_membranes', 50)
    table.string('capillary_refill_time', 20)
    table.text('anamnesis')
    table.text('physical_exam_findings')
    table.text('presumptive_diagnosis')
    table.text('definitive_diagnosis')
    table.text('treatment_plan')
    table.text('medical_prescription')
    table.string('patient_status', 50).defaultTo('estable') // estable, observacion, critico, alta, hospitalizado, prequirurgico, postquirurgico
    table.text('notes')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  // 2. Create clinical_attachments table (X-rays, ultrasounds, blood work, scans)
  await knex.schema.createTable('clinical_attachments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('pet_id').references('id').inTable('pets').onDelete('CASCADE').notNullable()
    table.uuid('medical_record_id').references('id').inTable('medical_records').onDelete('SET NULL')
    table.string('category', 50).notNullable() // radiografia, ecografia, sangre, orina, biopsia, informe_escaneado, otro
    table.string('title').notNullable()
    table.text('findings')
    table.text('file_url').notNullable()
    table.text('thumbnail_url')
    table.string('file_type', 100)
    table.integer('file_size')
    table.date('study_date').defaultTo(knex.raw('CURRENT_DATE'))
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })

  // 3. Create vaccinations table
  await knex.schema.createTable('vaccinations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('pet_id').references('id').inTable('pets').onDelete('CASCADE').notNullable()
    table.uuid('professional_id').references('id').inTable('professionals').onDelete('SET NULL')
    table.string('vaccine_name').notNullable()
    table.string('type', 50).defaultTo('vacuna') // vacuna, desparasitacion, refuerzo, otro
    table.string('batch_number', 100)
    table.string('manufacturer', 100)
    table.date('applied_date').notNullable()
    table.date('next_due_date')
    table.string('status', 50).defaultTo('aplicada') // aplicada, pendiente, vencida, cancelada
    table.text('notes')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })

  // 4. Create surgeries table
  await knex.schema.createTable('surgeries', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('pet_id').references('id').inTable('pets').onDelete('CASCADE').notNullable()
    table.uuid('professional_id').references('id').inTable('professionals').onDelete('SET NULL')
    table.uuid('medical_record_id').references('id').inTable('medical_records').onDelete('SET NULL')
    table.string('surgery_name').notNullable()
    table.string('surgery_type', 50).defaultTo('programada') // programada, urgencia, ambulatoria, mayor
    table.text('pre_op_evaluation')
    table.text('anesthesia_protocol')
    table.text('surgical_technique')
    table.text('post_op_orders')
    table.string('status', 50).defaultTo('programada') // programada, en_quirofano, recuperacion, completada, cancelada
    table.timestamp('surgery_date').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  // 5. Create shift_handovers table
  await knex.schema.createTable('shift_handovers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('outgoing_vet_id').references('id').inTable('professionals').onDelete('SET NULL')
    table.uuid('incoming_vet_id').references('id').inTable('professionals').onDelete('SET NULL')
    table.string('shift_type', 50).notNullable() // manana, tarde, noche, guardia_24h
    table.date('shift_date').notNullable()
    table.integer('admitted_patients_count').defaultTo(0)
    table.integer('surgeries_count').defaultTo(0)
    table.integer('emergencies_count').defaultTo(0)
    table.integer('discharges_count').defaultTo(0)
    table.text('critical_patients_notes')
    table.text('pending_tasks')
    table.text('shift_summary')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })

  // Create indexes for high-frequency queries
  await knex.schema.raw('CREATE INDEX idx_medical_records_pet_id ON medical_records(pet_id)')
  await knex.schema.raw('CREATE INDEX idx_medical_records_professional_id ON medical_records(professional_id)')
  await knex.schema.raw('CREATE INDEX idx_medical_records_patient_status ON medical_records(patient_status)')
  await knex.schema.raw('CREATE INDEX idx_clinical_attachments_pet_id ON clinical_attachments(pet_id)')
  await knex.schema.raw('CREATE INDEX idx_clinical_attachments_category ON clinical_attachments(category)')
  await knex.schema.raw('CREATE INDEX idx_vaccinations_pet_id ON vaccinations(pet_id)')
  await knex.schema.raw('CREATE INDEX idx_vaccinations_next_due_date ON vaccinations(next_due_date)')
  await knex.schema.raw('CREATE INDEX idx_surgeries_pet_id ON surgeries(pet_id)')
  await knex.schema.raw('CREATE INDEX idx_surgeries_status ON surgeries(status)')
  await knex.schema.raw('CREATE INDEX idx_shift_handovers_shift_date ON shift_handovers(shift_date)')
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('shift_handovers')
  await knex.schema.dropTableIfExists('surgeries')
  await knex.schema.dropTableIfExists('vaccinations')
  await knex.schema.dropTableIfExists('clinical_attachments')
  await knex.schema.dropTableIfExists('medical_records')
}
