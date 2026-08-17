import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // 1. Create notification_templates table
  const hasTemplates = await knex.schema.hasTable('notification_templates')
  if (!hasTemplates) {
    await knex.schema.createTable('notification_templates', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.string('code', 50).notNullable().unique()
      table.string('channel', 20).defaultTo('whatsapp') // whatsapp, email, all
      table.string('title', 150).notNullable()
      table.string('subject', 200)
      table.text('template_body').notNullable()
      table.text('description')
      table.boolean('active').defaultTo(true)
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
  }

  // 2. Create notifications_log table
  const hasLog = await knex.schema.hasTable('notifications_log')
  if (!hasLog) {
    await knex.schema.createTable('notifications_log', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL')
      table.uuid('pet_id').references('id').inTable('pets').onDelete('SET NULL')
      table.string('recipient_name')
      table.string('recipient_phone', 50)
      table.string('recipient_email', 150)
      table.string('channel', 20).defaultTo('whatsapp') // whatsapp, email
      table.string('type', 50).defaultTo('appointment_reminder')
      table.string('subject', 200)
      table.text('message_body').notNullable()
      table.string('status', 30).defaultTo('sent') // sent, pending, delivered, failed
      table.timestamp('sent_at').defaultTo(knex.fn.now())
      table.text('error_message')
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })

    await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_notifications_log_channel ON notifications_log(channel)')
    await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_notifications_log_status ON notifications_log(status)')
    await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_notifications_log_created_at ON notifications_log(created_at)')
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('notifications_log')
  await knex.schema.dropTableIfExists('notification_templates')
}
