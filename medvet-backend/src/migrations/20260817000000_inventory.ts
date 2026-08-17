import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // 1. Create inventory_items table
  await knex.schema.createTable('inventory_items', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('sku', 100).unique()
    table.string('name', 255).notNullable()
    table.string('category', 100).defaultTo('medicamentos') // medicamentos, vacunas, insumos_clinicos, alimentos_especiales, anestesia
    table.string('presentation', 100).defaultTo('Unidad')
    table.integer('stock_current').defaultTo(0)
    table.integer('stock_min').defaultTo(5)
    table.decimal('cost_price', 10, 2).defaultTo(0.0)
    table.decimal('sale_price', 10, 2).defaultTo(0.0)
    table.string('lot_number', 100)
    table.date('expiry_date')
    table.string('location', 100).defaultTo('Farmacia Central')
    table.boolean('requires_prescription').defaultTo(false)
    table.text('description')
    table.boolean('active').defaultTo(true)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  // 2. Create inventory_movements table
  await knex.schema.createTable('inventory_movements', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('item_id').references('id').inTable('inventory_items').onDelete('CASCADE').notNullable()
    table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL')
    table.string('type', 50).notNullable() // in_purchase, out_clinical_use, out_sale, adjustment, expired_loss
    table.integer('quantity').notNullable()
    table.integer('previous_stock').notNullable()
    table.integer('new_stock').notNullable()
    table.text('reason')
    table.string('reference_id', 100)
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('inventory_movements')
  await knex.schema.dropTableIfExists('inventory_items')
}
