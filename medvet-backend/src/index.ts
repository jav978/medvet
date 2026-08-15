import { app } from './app'
import { logger } from './logger'
import path from 'path'

const port = process.env.PORT || app.get('port') || 3030
const host = process.env.HOST || app.get('host') || '0.0.0.0'

async function start() {
  const knexClient = app.get('knexClient')
  if (knexClient && (process.env.DATABASE_URL || process.env.DB_HOST || process.env.PGHOST)) {
    try {
      logger.info('🔄 Checking and executing database migrations...')
      const migrationsDir = path.join(__dirname, 'migrations')
      const [batchNo, log] = await knexClient.migrate.latest({
        directory: migrationsDir,
        loadExtensions: ['.js', '.ts']
      })
      if (log.length > 0) {
        logger.info(`✅ Successfully executed ${log.length} migration(s) [Batch #${batchNo}]:`)
        log.forEach((f: string) => logger.info(`   - ${f}`))
      } else {
        logger.info('✅ Database schema is up to date.')
      }
    } catch (err: any) {
      logger.error('⚠️ Migration execution error:', err.message)
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
