import knex from 'knex'
import type { Application } from './declarations'

export const knex = (app: Application) => {
  const knexConfig = app.get('knex')
  const db = knex(knexConfig)

  app.set('knexClient', db)
}
