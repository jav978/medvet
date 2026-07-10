import { Knex } from 'knex'

export interface ServiceTypes {
  [key: string]: any
}

export interface Configuration {
  host: string
  port: number
  public: string
  origins: string[]
  knex: Knex.Config
  redis: {
    host: string
    port: number
    db: number
  }
  authentication: {
    entity: string
    service: string
    secret: string
    strategies: string[]
    jwtOptions: {
      expiresIn: string
    }
  }
  pagination: {
    default: number
    max: number
  }
}

export type Application = any
