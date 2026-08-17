import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import { requireAuth, restrictToOwner } from '../../hooks/security'
import type { Application } from '../../declarations'

export interface Pet {
  id: string
  user_id: string
  name: string
  species: string
  breed?: string
  age?: number
  weight?: number
  photo?: string
  created_at: Date
}

export interface PetData extends Omit<Pet, 'id' | 'created_at'> {}

export interface PetParams extends KnexAdapterParams<Pet> {}

export class PetService extends KnexService<Pet, PetData, PetParams> {}

export const pets = (app: Application) => {
  const options: KnexAdapterOptions = {
    paginate: app.get('paginate'),
    Model: app.get('knexClient'),
    name: 'pets'
  }

  app.use('pets', new PetService(options), {
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove']
  })

  app.service('pets').hooks({
    around: {
      all: []
    },
    before: {
      all: [requireAuth],
      find: [restrictToOwner('user_id')],
      get: [restrictToOwner('user_id')],
      create: [restrictToOwner('user_id')],
      patch: [restrictToOwner('user_id')],
      remove: [restrictToOwner('user_id')]
    },
    after: {
      all: []
    }
  })
}

