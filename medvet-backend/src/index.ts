import { app } from './app'
import { logger } from './logger'
import { ensureDatabaseSchema } from './knex'

const port = process.env.PORT || app.get('port') || 3030
const host = process.env.HOST || app.get('host') || '0.0.0.0'

async function start() {
  const knexClient = app.get('knexClient')
  if (knexClient && (process.env.DATABASE_URL || process.env.DB_HOST || process.env.PGHOST)) {
    try {
      await ensureDatabaseSchema(knexClient)
    } catch (err: any) {
      logger.error('⚠️ Database initialization error:', err.message)
    }
  }

  await app.listen(port)
  logger.info(`MedVet API listening on http://${host}:${port}`)
}

start().catch((err) => {
  logger.error('Fatal startup error:', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
})
