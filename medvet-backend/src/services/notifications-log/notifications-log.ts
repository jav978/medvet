import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { Application, HookContext } from '../../declarations'

export interface NotificationLog {
  id: string
  user_id?: string
  pet_id?: string
  recipient_name?: string
  recipient_phone?: string
  recipient_email?: string
  channel: 'whatsapp' | 'email'
  type: string
  subject?: string
  message_body: string
  status: 'sent' | 'pending' | 'delivered' | 'failed'
  sent_at?: string
  error_message?: string
  created_at?: string
}

export interface NotificationLogData extends Partial<NotificationLog> {}

export interface NotificationLogParams extends KnexAdapterParams<any> {}

export class NotificationLogService<ServiceParams extends NotificationLogParams = NotificationLogParams>
  extends KnexService<NotificationLog, NotificationLogData, NotificationLogParams> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: false,
    Model: app.get('knexClient'),
    name: 'notifications_log',
    multi: ['patch']
  }
}

export const notificationsLog = (app: Application) => {
  app.use('notifications-log', new NotificationLogService(getOptions(app)), {
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    events: []
  })

  app.service('notifications-log').hooks({
    around: {
      all: []
    },
    before: {
      all: [],
      find: [
        async (context: HookContext) => {
          if (!context.params.query?.$sort) {
            context.params.query = context.params.query || {}
            context.params.query.$sort = { created_at: -1 }
          }
          return context
        }
      ],
      get: [],
      create: [
        async (context: HookContext) => {
          context.data.created_at = new Date()
          if (!context.data.sent_at) {
            context.data.sent_at = new Date()
          }
          return context
        }
      ],
      patch: [],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    'notifications-log': NotificationLogService
  }
}
