import type { Knex } from 'knex'
import { config } from 'dotenv'

config()

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'medvet_admin',
      password: process.env.DB_PASSWORD || 'medvet_secret_2026',
      database: process.env.DB_DATABASE || 'medvet'
    },
    pool: {
      min: 0,
      max: 10
    },
    migrations: {
      directory: './src/migrations',
      extension: 'ts'
    },
    seeds: {
      directory: './src/seeds',
      extension: 'ts'
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/migrations'
    }
  }
}

export default knexConfig
