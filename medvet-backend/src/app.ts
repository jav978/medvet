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
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    // Allow localhost, vercel deployments, and custom frontends
    if (
      origin.includes('localhost') ||
      origin.includes('vercel.app') ||
      origin.includes('onrender.com') ||
      (process.env.FRONTEND_URL && origin.startsWith(process.env.FRONTEND_URL))
    ) {
      return callback(null, true)
    }
    return callback(null, true)
  },
  credentials: true
}))
app.use(json({ limit: '10mb' }))
app.use(urlencoded({ extended: true }))
app.use(serveStatic(app.get('public')))
app.configure(rest())
app.configure(socketio({
  cors: {
    origin: '*',
    credentials: true
  }
}))

// Health check & DB setup middleware
app.use(async (req: any, res: any, next: any) => {
  if (req.path === '/api/setup-database') {
    try {
      const knexClient = app.get('knexClient')
      if (!knexClient) throw new Error('Database client not initialized')
      const { ensureDatabaseSchema } = await import('./knex')
      await ensureDatabaseSchema(knexClient)
      const tables = await knexClient('information_schema.tables')
        .select('table_name')
        .where('table_schema', 'public')
      return res.json({
        success: true,
        message: 'Database schema ensured and verified',
        tables: tables.map((t: any) => t.table_name)
      })
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message })
    }
  }

  if (req.path === '/' && req.method === 'GET') {
    let dbConnected = false
    let dbDetails = 'No database configured'
    try {
      const knexClient = app.get('knexClient')
      if (knexClient) {
        await knexClient.raw('SELECT 1')
        dbConnected = true
        dbDetails = 'PostgreSQL connected and operational'
      }
    } catch (err: any) {
      dbConnected = false
      dbDetails = err.message || 'Database connection failed'
    }

    return res.json({
      status: 'ok',
      name: 'MedVet 24/7 API',
      version: '1.0.0',
      database: {
        connected: dbConnected,
        configured: Boolean(process.env.DATABASE_URL || process.env.DB_HOST),
        status: dbDetails
      },
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
