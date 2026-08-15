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
    }
    const hasRecords = await db.schema.hasTable('medical_records')
    if (!hasRecords) {
      console.log('🔄 Initializing clinical EHR database schema...')
      await ehrMigration(db)
      console.log('✅ Clinical EHR database schema initialized.')
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


