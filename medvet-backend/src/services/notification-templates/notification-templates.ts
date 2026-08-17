import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { Application, HookContext } from '../../declarations'

export interface NotificationTemplate {
  id: string
  code: string
  channel: 'whatsapp' | 'email' | 'all'
  title: string
  subject?: string
  template_body: string
  description?: string
  active: boolean
  created_at?: string
  updated_at?: string
}

export interface NotificationTemplateData extends Partial<NotificationTemplate> {}

export interface NotificationTemplateParams extends KnexAdapterParams<any> {}

export class NotificationTemplateService<ServiceParams extends NotificationTemplateParams = NotificationTemplateParams>
  extends KnexService<NotificationTemplate, NotificationTemplateData, NotificationTemplateParams> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: false,
    Model: app.get('postgresqlClient'),
    name: 'notification_templates',
    multi: ['patch']
  }
}

export const notificationTemplates = (app: Application) => {
  app.use('notification-templates', new NotificationTemplateService(getOptions(app)), {
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    events: []
  })

  app.service('notification-templates').hooks({
    around: {
      all: []
    },
    before: {
      all: [],
      find: [],
      get: [],
      create: [
        async (context: HookContext) => {
          context.data.created_at = new Date()
          context.data.updated_at = new Date()
          return context
        }
      ],
      patch: [
        async (context: HookContext) => {
          context.data.updated_at = new Date()
          return context
        }
      ],
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
    'notification-templates': NotificationTemplateService
  }
}
