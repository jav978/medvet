import knex from 'knex'
import type { Application } from './declarations'

export const configureKnex = (app: Application) => {
  const knexConfig = app.get('knex')
  const db = knex(knexConfig)

  app.set('knexClient', db)
}
