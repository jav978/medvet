import Redis from 'ioredis'
import type { Application } from './declarations'

export const redis = (app: Application) => {
  const redisConfig = app.get('redis') || {}
  const redisUrl = process.env.REDIS_URL
  const hasExplicitRedis = redisUrl || process.env.REDIS_HOST || process.env.REDISHOST

  if (!hasExplicitRedis && process.env.NODE_ENV === 'production') {
    console.log('ℹ️ Redis no configurado en producción. Operando con caché en memoria.')
    return
  }

  let redisClient: Redis
  try {
    if (redisUrl) {
      redisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: 2,
        enableOfflineQueue: false,
        retryStrategy: (times: number) => {
          if (times > 3) return null
          return Math.min(times * 200, 1000)
        }
      })
    } else {
      redisClient = new Redis({
        host: process.env.REDIS_HOST || process.env.REDISHOST || redisConfig.host || 'localhost',
        port: parseInt(process.env.REDIS_PORT || process.env.REDISPORT || String(redisConfig.port || 6379)),
        password: process.env.REDIS_PASSWORD || process.env.REDISPASSWORD || undefined,
        db: redisConfig.db || 0,
        maxRetriesPerRequest: 2,
        enableOfflineQueue: false,
        retryStrategy: (times: number) => {
          if (times > 3) return null
          return Math.min(times * 200, 1000)
        }
      })
    }

    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully')
    })

    redisClient.on('error', (err: Error) => {
      // Quiet non-fatal notice
    })

    app.set('redisClient', redisClient)
  } catch (e) {
    console.warn('Redis initialization skipped:', e)
  }
}
