import Redis from 'ioredis'
import type { Application } from './declarations'

export const redis = (app: Application) => {
  const redisConfig = app.get('redis') || {}
  const redisUrl = process.env.REDIS_URL

  let redisClient: Redis
  try {
    if (redisUrl) {
      redisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times: number) => Math.min(times * 100, 3000)
      })
    } else {
      redisClient = new Redis({
        host: process.env.REDIS_HOST || process.env.REDISHOST || redisConfig.host || 'localhost',
        port: parseInt(process.env.REDIS_PORT || process.env.REDISPORT || String(redisConfig.port || 6379)),
        password: process.env.REDIS_PASSWORD || process.env.REDISPASSWORD || undefined,
        db: redisConfig.db || 0,
        maxRetriesPerRequest: 3,
        retryStrategy: (times: number) => Math.min(times * 100, 3000)
      })
    }

    redisClient.on('connect', () => {
      console.log('Redis connected successfully')
    })

    redisClient.on('error', (err: Error) => {
      console.warn('Redis connection notice (non-fatal):', err.message)
    })

    app.set('redisClient', redisClient)
  } catch (e) {
    console.warn('Redis initialization skipped:', e)
  }
}
