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
import configuration from '@feathersjs/configuration'
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
app.configure(configuration())
app.configure(configurationValidator)
app.configure(configureKnex)
app.configure(redis)

// Set up libraries and middleware
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001']
  : ['http://localhost:3000', 'http://localhost:3001', '*']

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))
app.use(json({ limit: '10mb' }))
app.use(urlencoded({ extended: true }))
app.use(serveStatic(app.get('public')))
app.configure(rest())
app.configure(socketio({
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
}))

// Health check middleware
app.use((req: any, res: any, next: any) => {
  if (req.path === '/' && req.method === 'GET') {
    return res.json({
      status: 'ok',
      name: 'MedVet 24/7 API',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    })
  }
  if (req.path === '/health' && req.method === 'GET') {
    return res.json({ status: 'healthy' })
  }
  next()
})

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
