import knex from 'knex'
import type { Knex } from 'knex'
import type { Application } from './declarations'
import { config } from 'dotenv'
import { up as initialMigration } from './migrations/20260710000000_initial'
import { up as ehrMigration } from './migrations/20260815000000_clinical_ehr'

config()

export async function ensureDatabaseSchema(db: Knex) {
  try {
    const hasUsers = await db.schema.hasTable('users')
    if (!hasUsers) {
      console.log('🔄 Initializing base database schema (users, pets, services, appointments)...')
      await initialMigration(db)
      console.log('✅ Base database schema initialized.')
    } else {
      // Check for first_name & last_name columns
      const hasFirstName = await db.schema.hasColumn('users', 'first_name')
      if (!hasFirstName) {
        await db.schema.alterTable('users', (table) => {
          table.string('first_name')
          table.string('last_name')
        })
        console.log('✅ Added first_name and last_name columns to users table.')
      }
    }

    const hasRecords = await db.schema.hasTable('medical_records')
    if (!hasRecords) {
      console.log('🔄 Initializing clinical EHR database schema...')
      await ehrMigration(db)
      console.log('✅ Clinical EHR database schema initialized.')
    }

    // Ensure concurrency anti-double-booking unique index exists on PostgreSQL
    try {
      await db.raw(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_slot 
        ON appointments(professional_id, date, start_time) 
        WHERE status != 'cancelled';
      `)
      console.log('✅ Concurrency slot isolation index verified (idx_unique_active_slot).')
    } catch (e: any) {
      // Ignore if database does not support partial unique index or already exists
    }
  } catch (err: any) {
    console.error('⚠️ Error ensuring database schema:', err.message)
    throw err
  }
}


export const configureKnex = (app: Application) => {
  const knexConfig = app.get('knex') || {}
  const dbUrl = process.env.DATABASE_URL

  let connection: any = dbUrl || knexConfig.connection
  if (dbUrl) {
    const isLocal = dbUrl.includes('sslmode=disable') || dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')
    connection = {
      connectionString: dbUrl,
      ssl: isLocal
        ? false
        : { rejectUnauthorized: false }
    }
  }

  const db = knex({
    client: 'pg',
    ...knexConfig,
    connection,
    pool: { min: 0, max: 10 }
  })

  app.set('knexClient', db)
}


