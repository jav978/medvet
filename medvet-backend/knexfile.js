require('dotenv').config()

const connection = process.env.DATABASE_URL || {
  host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
  port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432'),
  user: process.env.DB_USER || process.env.PGUSER || 'medvet_admin',
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || 'medvet_secret_2026',
  database: process.env.DB_DATABASE || process.env.PGDATABASE || 'medvet'
}

module.exports = {
  development: {
    client: 'pg',
    connection,
    migrations: {
      directory: './lib/migrations',
      loadExtensions: ['.js', '.ts']
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL || connection,
    pool: { min: 2, max: 10 },
    migrations: {
      directory: './lib/migrations',
      loadExtensions: ['.js', '.ts']
    }
  }
}
