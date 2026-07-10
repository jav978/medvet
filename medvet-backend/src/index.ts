import { app } from './app'
import { logger } from './logger'

const port = app.get('port')
const host = app.get('host')

app.listen(port).then(() => {
  logger.info(`MedVet API listening on http://${host}:${port}`)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
})
