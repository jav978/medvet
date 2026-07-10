import type { Application } from '../declarations'

export const channels = (app: Application) => {
  app.on('connection', (connection: any) => {
    app.channel('anonymous').join(connection)
  })

  app.on('login', (authResult: any, { connection }: any) => {
    if (connection) {
      app.channel('anonymous').leave(connection)
      app.channel('authenticated').join(connection)

      const user = authResult.user
      if (user) {
        app.channel(`user/${user.id}`).join(connection)

        if (user.role === 'admin') {
          app.channel('admins').join(connection)
        }
      }
    }
  })

  app.publish((data: any, hook: any) => {
    return app.channel('authenticated')
  })
}
