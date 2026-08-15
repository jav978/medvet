import knex from 'knex'
import type { Application } from './declarations'
import { config } from 'dotenv'

config()

export const configureKnex = (app: Application) => {
  const knexConfig = app.get('knex') || {}
  const dbUrl = process.env.DATABASE_URL

  let connection: any = dbUrl || knexConfig.connection
  if (dbUrl) {
    connection = {
      connectionString: dbUrl,
      ssl: dbUrl.includes('sslmode=disable')
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


