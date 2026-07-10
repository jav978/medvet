import { feathers } from '@feathersjs/feathers'
import socketioClient from '@feathersjs/socketio-client'
import authenticationClient from '@feathersjs/authentication-client'
import io from 'socket.io-client'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const socket = io(config.public.apiURL, {
    transports: ['websocket']
  })

  const client = feathers()

  client.configure(socketioClient(socket))
  client.configure(authenticationClient({
    storage: window.localStorage
  }))

  return {
    provide: {
      feathers: client
    }
  }
})
