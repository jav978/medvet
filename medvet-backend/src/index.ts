import { app } from './app'
import { logger } from './logger'

const port = process.env.PORT || app.get('port') || 3030
const host = process.env.HOST || app.get('host') || '0.0.0.0'

app.listen(port).then(() => {
  logger.info(`MedVet API listening on http://${host}:${port}`)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
})
