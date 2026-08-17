import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const hasGrooming = await knex.schema.hasTable('grooming_records')
  if (!hasGrooming) {
    await knex.schema.createTable('grooming_records', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.uuid('pet_id').references('id').inTable('pets').onDelete('CASCADE').notNullable()
      table.uuid('stylist_id').references('id').inTable('professionals').onDelete('SET NULL')
      table.string('service_name', 150).notNullable() // Baño Estético, Baño Medicado, Corte de Raza, Deslanado, Spa Ozono
      table.date('appointment_date').notNullable().defaultTo(knex.raw('CURRENT_DATE'))
      table.string('start_time', 20).defaultTo('09:00')
      table.string('coat_condition', 50).defaultTo('normal') // normal, enredado, nudos_severos, dermatitis, ectoparasitos
      table.string('temperament', 50).defaultTo('docil') // docil, nervioso, agresivo, anciano
      table.string('special_shampoo', 100).defaultTo('Hipoalergénico')
      table.string('haircut_style', 100) // Corte Cachorro, Corte Schnauzer, Deslanado, Higiénico
      table.string('status', 50).defaultTo('waiting') // waiting, in_bath, drying_cutting, ready, delivered, cancelled
      table.decimal('price_usd', 10, 2).defaultTo(20.00)
      table.text('special_instructions')
      table.text('notes')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })

    await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_grooming_records_pet_id ON grooming_records(pet_id)')
    await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_grooming_records_status ON grooming_records(status)')
    await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_grooming_records_date ON grooming_records(appointment_date)')
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('grooming_records')
}
