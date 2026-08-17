import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Create users table
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('email').notNullable().unique()
    table.string('password').notNullable()
    table.string('name').notNullable()
    table.string('first_name')
    table.string('last_name')
    table.string('phone')
    table.enum('role', ['admin', 'receptionist', 'veterinarian', 'client']).defaultTo('client')
    table.boolean('active').defaultTo(true)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  // Create pets table
  await knex.schema.createTable('pets', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.string('name').notNullable()
    table.string('species').notNullable()
    table.string('breed')
    table.integer('age')
    table.decimal('weight', 5, 2)
    table.string('photo')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })

  // Create services table
  await knex.schema.createTable('services', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('name').notNullable()
    table.text('description')
    table.integer('duration').notNullable()
    table.decimal('price', 10, 2)
    table.enum('category', ['consulta', 'vacuna', 'cirugia', 'emergencia', 'estetica', 'laboratorio']).notNullable()
    table.boolean('active').defaultTo(true)
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })

  // Create professionals table
  await knex.schema.createTable('professionals', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').unique()
    table.string('specialty').notNullable()
    table.boolean('active').defaultTo(true)
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })

  // Create schedules table
  await knex.schema.createTable('schedules', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('professional_id').references('id').inTable('professionals').onDelete('CASCADE')
    table.integer('day_of_week').notNullable()
    table.time('start_time').notNullable()
    table.time('end_time').notNullable()
    table.boolean('active').defaultTo(true)
  })

  // Create appointments table
  await knex.schema.createTable('appointments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.uuid('pet_id').references('id').inTable('pets').onDelete('CASCADE')
    table.uuid('professional_id').references('id').inTable('professionals').onDelete('CASCADE')
    table.uuid('service_id').references('id').inTable('services').onDelete('CASCADE')
    table.date('date').notNullable()
    table.time('start_time').notNullable()
    table.time('end_time').notNullable()
    table.enum('status', ['pending', 'confirmed', 'completed', 'cancelled']).defaultTo('pending')
    table.text('notes')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  // Create indexes
  await knex.schema.raw('CREATE INDEX idx_pets_user_id ON pets(user_id)')
  await knex.schema.raw('CREATE INDEX idx_professionals_user_id ON professionals(user_id)')
  await knex.schema.raw('CREATE INDEX idx_schedules_professional_id ON schedules(professional_id)')
  await knex.schema.raw('CREATE INDEX idx_appointments_user_id ON appointments(user_id)')
  await knex.schema.raw('CREATE INDEX idx_appointments_professional_id ON appointments(professional_id)')
  await knex.schema.raw('CREATE INDEX idx_appointments_date ON appointments(date)')
  await knex.schema.raw('CREATE INDEX idx_appointments_status ON appointments(status)')
  await knex.schema.raw('CREATE UNIQUE INDEX idx_unique_active_slot ON appointments(professional_id, date, start_time) WHERE status != \'cancelled\'')

}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('appointments')
  await knex.schema.dropTableIfExists('schedules')
  await knex.schema.dropTableIfExists('professionals')
  await knex.schema.dropTableIfExists('services')
  await knex.schema.dropTableIfExists('pets')
  await knex.schema.dropTableIfExists('users')
}
