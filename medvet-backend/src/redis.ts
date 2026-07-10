import Redis from 'ioredis'
import type { Application } from './declarations'

export const redis = (app: Application) => {
  const redisConfig = app.get('redis')
  const redisClient = new Redis({
    host: redisConfig.host,
    port: redisConfig.port,
    db: redisConfig.db,
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000)
      return delay
    }
  })

  redisClient.on('connect', () => {
    console.log('Redis connected')
  })

  redisClient.on('error', (err: Error) => {
    console.error('Redis error:', err)
  })

  app.set('redisClient', redisClient)
}
