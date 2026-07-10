import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import { hashPassword, protect } from '@feathersjs/authentication-local'
import type { Application } from '../../declarations'

export interface User {
  id: string
  email: string
  password: string
  name: string
  phone?: string
  role: 'admin' | 'receptionist' | 'veterinarian' | 'client'
  active: boolean
  created_at: Date
  updated_at: Date
}

export interface UserData extends Omit<User, 'id' | 'created_at' | 'updated_at'> {}

export interface UserParams extends KnexAdapterParams<User> {}

export class UserService extends KnexService<User, UserData, UserParams> {
  async create(data: UserData, params?: UserParams) {
    const password = await hashPassword(data.password)
    return super.create({ ...data, password }, params)
  }
}

export const users = (app: Application) => {
  const options: KnexAdapterOptions = {
    paginate: app.get('paginate'),
    Model: app.get('knexClient'),
    name: 'users'
  }

  app.use('users', new UserService(options), {
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove']
  })

  app.service('users').hooks({
    around: {
      all: []
    },
    before: {
      all: [],
      create: [],
      patch: []
    },
    after: {
      all: [
        protect('password')
      ]
    }
  })
}
