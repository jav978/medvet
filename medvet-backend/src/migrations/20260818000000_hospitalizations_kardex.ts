import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // 1. Create hospitalization_boxes table
  const hasBoxes = await knex.schema.hasTable('hospitalization_boxes')
  if (!hasBoxes) {
    await knex.schema.createTable('hospitalization_boxes', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.string('code', 50).notNullable().unique()
      table.string('name', 150).notNullable()
      table.string('type', 50).defaultTo('standard') // icu, standard, isolation, post_op, feline, canine
      table.string('status', 50).defaultTo('available') // available, occupied, maintenance, cleaning
      table.uuid('current_hospitalization_id')
      table.string('size', 50).defaultTo('Mediano')
      table.text('features') // Oxygen, Infusion pump, Heating pad, etc.
      table.decimal('daily_rate_usd', 10, 2).defaultTo(25.00)
      table.boolean('active').defaultTo(true)
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
  }

  // 2. Create hospitalizations table
  const hasHospitalizations = await knex.schema.hasTable('hospitalizations')
  if (!hasHospitalizations) {
    await knex.schema.createTable('hospitalizations', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.uuid('pet_id').references('id').inTable('pets').onDelete('CASCADE').notNullable()
      table.uuid('box_id').references('id').inTable('hospitalization_boxes').onDelete('SET NULL')
      table.uuid('vet_id').references('id').inTable('professionals').onDelete('SET NULL')
      table.timestamp('admission_date').notNullable().defaultTo(knex.fn.now())
      table.timestamp('discharge_date')
      table.string('status', 50).defaultTo('active') // active, critical, stable, pre_op, post_op, discharged, transferred
      table.text('reason_for_admission')
      table.text('presumptive_diagnosis')
      table.text('definitive_diagnosis')
      table.text('diet_instructions')
      table.text('fluid_therapy_plan')
      table.text('medication_schedule')
      table.decimal('daily_cost_usd', 10, 2).defaultTo(25.00)
      table.text('discharge_summary')
      table.text('notes')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
  }

  // 3. Create kardex_entries table
  const hasKardex = await knex.schema.hasTable('kardex_entries')
  if (!hasKardex) {
    await knex.schema.createTable('kardex_entries', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.uuid('hospitalization_id').references('id').inTable('hospitalizations').onDelete('CASCADE').notNullable()
      table.uuid('professional_id').references('id').inTable('professionals').onDelete('SET NULL')
      table.timestamp('recorded_at').notNullable().defaultTo(knex.fn.now())
      table.string('entry_type', 50).defaultTo('vitals') // vitals, medication, fluids, feeding_elimination, evolution_note, procedure

      // Vital Signs
      table.decimal('temperature', 4, 2)
      table.integer('heart_rate')
      table.integer('respiratory_rate')
      table.integer('blood_pressure_sys')
      table.integer('blood_pressure_dia')
      table.string('capillary_refill_time', 20)
      table.string('mucous_membranes', 50)
      table.integer('pain_score').defaultTo(0)

      // Medication & Fluids
      table.string('medication_name')
      table.string('dose_given')
      table.string('route', 50)
      table.decimal('fluid_rate_ml_hr', 6, 2)
      table.decimal('fluid_volume_infused_ml', 8, 2)

      // Physiology & Eliminations
      table.string('urination', 50)
      table.string('defecation', 50)
      table.string('appetite', 50)
      table.integer('vomit_episodes').defaultTo(0)

      // Notes
      table.text('notes')
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })

    await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_hospitalization_boxes_status ON hospitalization_boxes(status)')
    await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_hospitalizations_pet_id ON hospitalizations(pet_id)')
    await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_hospitalizations_status ON hospitalizations(status)')
    await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_kardex_entries_hospitalization_id ON kardex_entries(hospitalization_id)')
    await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_kardex_entries_recorded_at ON kardex_entries(recorded_at)')
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('kardex_entries')
  await knex.schema.dropTableIfExists('hospitalizations')
  await knex.schema.dropTableIfExists('hospitalization_boxes')
}
