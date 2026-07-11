import { feathers } from '@feathersjs/feathers'
import express, {
  rest,
  json,
  urlencoded,
  cors,
  serveStatic,
  notFound,
  errorHandler
} from '@feathersjs/express'
import socketio from '@feathersjs/socketio'
import { configurationValidator } from './configuration'
import { configureServices } from './services'
import { authentication } from './authentication'
import { channels } from './channels'
import { configureKnex } from './knex'
import { redis } from './redis'
import { hooks } from './hooks'

import type { Application } from './declarations'

const app: Application = express(feathers())

// Load app configuration
app.configure(configurationValidator)
app.configure(configureKnex)
app.configure(redis)

// Set up libraries and middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}))
app.use(json({ limit: '10mb' }))
app.use(urlencoded({ extended: true }))
app.use(serveStatic(app.get('public')))
app.use(rest())
app.configure(socketio({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
  }
}))

// Set up services
app.configure(authentication)
app.configure(configureServices)
app.configure(channels)

// Error handling
app.use(notFound())
app.use(errorHandler({ logger: console }))

// Register hooks
app.hooks(hooks)

export { app }
