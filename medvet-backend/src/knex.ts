import knex from 'knex'
import type { Application } from './declarations'
import { config } from 'dotenv'

config()

export const configureKnex = (app: Application) => {
  const knexConfig = app.get('knex') || {}
  const connection = process.env.DATABASE_URL || knexConfig.connection
  const db = knex({
    client: 'pg',
    ...knexConfig,
    connection
  })

  app.set('knexClient', db)
}

