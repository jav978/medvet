import knex from 'knex'
import type { Knex } from 'knex'
import type { Application } from './declarations'
import { config } from 'dotenv'
import { up as initialMigration } from './migrations/20260710000000_initial'
import { up as ehrMigration } from './migrations/20260815000000_clinical_ehr'

config()

export async function ensureDatabaseSchema(db: Knex) {
  try {
    const hasUsers = await db.schema.hasTable('users')
    if (!hasUsers) {
      console.log('🔄 Initializing base database schema (users, pets, services, appointments)...')
      await initialMigration(db)
      console.log('✅ Base database schema initialized.')
    } else {
      // Check for first_name & last_name columns
      const hasFirstName = await db.schema.hasColumn('users', 'first_name')
      if (!hasFirstName) {
        await db.schema.alterTable('users', (table) => {
          table.string('first_name')
          table.string('last_name')
        })
        console.log('✅ Added first_name and last_name columns to users table.')
      }
    }

    const hasRecords = await db.schema.hasTable('medical_records')
    if (!hasRecords) {
      console.log('🔄 Initializing clinical EHR database schema...')
      await ehrMigration(db)
      console.log('✅ Clinical EHR database schema initialized.')
    }

    // Ensure concurrency anti-double-booking unique index exists on PostgreSQL
    try {
      await db.raw(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_slot 
        ON appointments(professional_id, date, start_time) 
        WHERE status != 'cancelled';
      `)
      console.log('✅ Concurrency slot isolation index verified (idx_unique_active_slot).')
    } catch (e: any) {
      // Ignore if database does not support partial unique index or already exists
    }

    // Auto-seed base services and professional if empty
    try {
      const servicesCount = await db('services').count('id as count').first()
      if (servicesCount && Number(servicesCount.count) === 0) {
        console.log('🔄 Seeding default clinic services and veterinary professionals...')
        await db('services').insert([
          { name: 'Consulta Clínica General', description: 'Evaluación veterinaria integral, chequeo de signos vitales y diagnóstico general.', duration: 30, price: 15.00, category: 'consulta', active: true },
          { name: 'Vacunación y Desparasitación', description: 'Esquema completo de inmunización con certificado oficial.', duration: 20, price: 10.00, category: 'vacuna', active: true },
          { name: 'Cirugía Menor y Esterilización', description: 'Procedimientos quirúrgicos ambulatorios con monitoreo anestésico.', duration: 60, price: 50.00, category: 'cirugia', active: true },
          { name: 'Emergencia y Cuidados Críticos', description: 'Atención médica inmediata de urgencias veterinarias.', duration: 45, price: 30.00, category: 'emergencia', active: true }
        ])

        // Ensure at least one professional user exists
        let vetUser = await db('users').where({ role: 'veterinarian' }).first()
        if (!vetUser) {
          const [newVet] = await db('users').insert({
            email: 'vet@medvet.com',
            password: '$2a$10$wN9P3XJ1YxY6m1U1K1X1XeQ9P3XJ1YxY6m1U1K1X1XeQ9P3XJ1YxY', // hashed default
            name: 'Dr. Mateo Silva',
            first_name: 'Mateo',
            last_name: 'Silva',
            phone: '+58 412 1234567',
            role: 'veterinarian',
            active: true
          }).returning('*')
          vetUser = newVet
        }

        if (vetUser) {
          let professional = await db('professionals').where({ user_id: vetUser.id }).first()
          if (!professional) {
            const [newPro] = await db('professionals').insert({
              user_id: vetUser.id,
              specialty: 'Medicina General y Diagnóstico',
              active: true
            }).returning('*')
            professional = newPro
          }

          if (professional) {
            const scheduleInserts = []
            for (let day = 1; day <= 6; day++) {
              scheduleInserts.push({
                professional_id: professional.id,
                day_of_week: day,
                start_time: '08:30:00',
                end_time: '18:00:00',
                active: true
              })
            }
            await db('schedules').insert(scheduleInserts)
          }
        }
        console.log('✅ Default services and veterinary schedules ready.')
      }
    } catch (seedErr: any) {
      console.warn('ℹ️ Seed notice:', seedErr.message)
    }
  } catch (err: any) {

    console.error('⚠️ Error ensuring database schema:', err.message)
    throw err
  }
}


export const configureKnex = (app: Application) => {
  const knexConfig = app.get('knex') || {}
  const dbUrl = process.env.DATABASE_URL

  let connection: any = dbUrl || knexConfig.connection
  if (dbUrl) {
    const isLocal = dbUrl.includes('sslmode=disable') || dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')
    connection = {
      connectionString: dbUrl,
      ssl: isLocal
        ? false
        : { rejectUnauthorized: false }
    }
  }

  const db = knex({
    client: 'pg',
    ...knexConfig,
    connection,
    pool: { min: 0, max: 10 }
  })

  app.set('knexClient', db)
}


