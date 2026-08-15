const knex = require('knex')
require('dotenv').config()

const connection = process.env.DATABASE_URL || {
  host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
  port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432'),
  user: process.env.DB_USER || process.env.PGUSER || 'medvet_admin',
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || 'medvet_secret_2026',
  database: process.env.DB_DATABASE || process.env.PGDATABASE || 'medvet'
}

const config = {
  client: 'pg',
  connection,
  pool: { min: 1, max: 5 },
  migrations: {
    directory: './lib/migrations',
    loadExtensions: ['.js', '.ts']
  }
}

async function runMigrations() {
  if (!process.env.DATABASE_URL && !process.env.DB_HOST && !process.env.PGHOST) {
    console.warn('⚠️ No database connection string configured. Skipping migrations.')
    return
  }

  const db = knex(config)
  console.log('🔄 Running database migrations...')
  try {
    const [batchNo, log] = await db.migrate.latest()
    if (log.length === 0) {
      console.log('✅ Database is already up to date.')
    } else {
      console.log(`✅ Batch ${batchNo} completed: ${log.length} migrations executed`)
      log.forEach((file) => console.log(`   - ${file}`))
    }
  } catch (err) {
    console.error('⚠️ Migration notice:', err.message)
  } finally {
    await db.destroy()
  }
}

if (require.main === module) {
  runMigrations()
}

module.exports = { runMigrations }
