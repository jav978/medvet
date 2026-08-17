import knex from 'knex'
import type { Knex } from 'knex'
import type { Application } from './declarations'
import { config } from 'dotenv'
import bcrypt from 'bcryptjs'
import { up as initialMigration } from './migrations/20260710000000_initial'
import { up as ehrMigration } from './migrations/20260815000000_clinical_ehr'
import { up as inventoryMigration } from './migrations/20260817000000_inventory'

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

    const hasInventory = await db.schema.hasTable('inventory_items')
    if (!hasInventory) {
      console.log('🔄 Initializing veterinary pharmacy & inventory database schema...')
      await inventoryMigration(db)
      console.log('✅ Inventory database schema initialized.')
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
      }

      // Ensure veterinarian user exists with password vet123
      const vetHash = bcrypt.hashSync('vet123', 10)
      let vetUser = await db('users').where({ email: 'vet@medvet.com' }).first()
      if (!vetUser) {
        const [newVet] = await db('users').insert({
          email: 'vet@medvet.com',
          password: vetHash,
          name: 'Dr. Mateo Silva',
          first_name: 'Mateo',
          last_name: 'Silva',
          phone: '+58 412 1234567',
          role: 'veterinarian',
          active: true
        }).returning('*')
        vetUser = newVet
      } else {
        // Update password to ensure vet123 always works
        await db('users').where({ id: vetUser.id }).update({
          password: vetHash,
          name: 'Dr. Mateo Silva',
          role: 'veterinarian',
          active: true
        })
      }

      if (vetUser) {
        let professional = await db('professionals').where({ user_id: vetUser.id }).first()
        if (!professional) {
          const [newPro] = await db('professionals').insert({
            user_id: vetUser.id,
            specialty: 'Medicina General y Cirugía',
            license_number: 'MPPS-VET-8842',
            active: true
          }).returning('*')
          professional = newPro
        }

        if (professional) {
          const scheduleCount = await db('schedules').where({ professional_id: professional.id }).count('id as count').first()
          if (scheduleCount && Number(scheduleCount.count) === 0) {
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
      }

      // Seed default inventory items if empty
      const inventoryCount = await db('inventory_items').count('id as count').first()
      if (inventoryCount && Number(inventoryCount.count) === 0) {
        console.log('🔄 Seeding veterinary pharmacy & inventory catalogue...')
        await db('inventory_items').insert([
          {
            sku: 'MED-ENRO-50',
            name: 'Enrofloxacina 50mg (Antibiótico)',
            category: 'medicamentos',
            presentation: 'Caja 10 comprimidos',
            stock_current: 24,
            stock_min: 8,
            cost_price: 4.50,
            sale_price: 9.00,
            lot_number: 'LOT-2026-EN50',
            expiry_date: '2027-11-30',
            location: 'Farmacia Estante A-1',
            requires_prescription: true,
            description: 'Antimicrobiano de amplio espectro para caninos y felinos.'
          },
          {
            sku: 'MED-MELOX-05',
            name: 'Meloxicam Suspensión Oral 0.5mg/ml',
            category: 'medicamentos',
            presentation: 'Frasco gotero 15ml',
            stock_current: 18,
            stock_min: 5,
            cost_price: 6.20,
            sale_price: 12.50,
            lot_number: 'LOT-2026-MX05',
            expiry_date: '2028-02-15',
            location: 'Farmacia Estante A-2',
            requires_prescription: true,
            description: 'Antiinflamatorio no esteroideo (AINE) para control del dolor y analgesia post-quirúrgica.'
          },
          {
            sku: 'MED-AMOX-CLAV',
            name: 'Amoxicilina + Ácido Clavulánico 250mg',
            category: 'medicamentos',
            presentation: 'Caja 14 comprimidos',
            stock_current: 30,
            stock_min: 10,
            cost_price: 7.80,
            sale_price: 15.00,
            lot_number: 'LOT-2026-AMC25',
            expiry_date: '2027-09-20',
            location: 'Farmacia Estante A-1',
            requires_prescription: true,
            description: 'Tratamiento de infecciones bacterianas dérmicas, respiratorias y urinarias.'
          },
          {
            sku: 'MED-TRAMA-50',
            name: 'Tramadol Clorhidrato Inyectable 50mg/ml',
            category: 'medicamentos',
            presentation: 'Ampolla 2ml',
            stock_current: 4, // Low stock on purpose to test alert
            stock_min: 8,
            cost_price: 3.50,
            sale_price: 8.00,
            lot_number: 'LOT-2026-TR50',
            expiry_date: '2027-06-10',
            location: 'Caja de Seguridad / Quirófano',
            requires_prescription: true,
            description: 'Analgésico opioide para dolor moderado a severo.'
          },
          {
            sku: 'VAC-NOVI-SEX',
            name: 'Vacuna Séxtuple Canina Nobivac DHPPi+L',
            category: 'vacunas',
            presentation: 'Frasco monodosis + Diluyente',
            stock_current: 35,
            stock_min: 10,
            cost_price: 8.00,
            sale_price: 18.00,
            lot_number: 'LOT-2026-NB6X',
            expiry_date: '2027-12-31',
            location: 'Refrigerador Biológicos (4°C)',
            requires_prescription: false,
            description: 'Protección contra Parvovirus, Moquillo, Hepatitis, Parainfluenza y Leptospira.'
          },
          {
            sku: 'VAC-NOVI-RAB',
            name: 'Vacuna Antirrábica Nobivac Rabies',
            category: 'vacunas',
            presentation: 'Frasco monodosis',
            stock_current: 40,
            stock_min: 15,
            cost_price: 5.00,
            sale_price: 12.00,
            lot_number: 'LOT-2026-NBRAB',
            expiry_date: '2028-05-30',
            location: 'Refrigerador Biológicos (4°C)',
            requires_prescription: false,
            description: 'Inmunización activa frente a la Rabia en perros y gatos.'
          },
          {
            sku: 'VAC-FELI-TRI',
            name: 'Vacuna Triple Felina Felocell 3',
            category: 'vacunas',
            presentation: 'Frasco monodosis',
            stock_current: 3, // Low stock on purpose
            stock_min: 6,
            cost_price: 9.50,
            sale_price: 20.00,
            lot_number: 'LOT-2026-FEL3',
            expiry_date: '2027-08-15',
            location: 'Refrigerador Biológicos (4°C)',
            requires_prescription: false,
            description: 'Inmunización contra Panleucopenia, Rinotraqueítis y Calicivirus felino.'
          },
          {
            sku: 'INS-SUER-RL',
            name: 'Solución Ringer Lactato 500ml Baxter',
            category: 'insumos_clinicos',
            presentation: 'Bolsa 500ml',
            stock_current: 45,
            stock_min: 12,
            cost_price: 2.20,
            sale_price: 6.00,
            lot_number: 'LOT-2026-SRL5',
            expiry_date: '2028-10-01',
            location: 'Depósito Soluciones & Fluidos',
            requires_prescription: false,
            description: 'Solución electrolítica para fluidoterapia y rehidratación intravenosa.'
          },
          {
            sku: 'INS-CAT-22G',
            name: 'Catéter Intravenoso 22G Nipro con Alas',
            category: 'insumos_clinicos',
            presentation: 'Caja 50 unidades',
            stock_current: 80,
            stock_min: 20,
            cost_price: 0.60,
            sale_price: 1.80,
            lot_number: 'LOT-2026-CAT22',
            expiry_date: '2029-01-01',
            location: 'Carro de Curaciones & Quirófano',
            requires_prescription: false,
            description: 'Catéter teflón estéril para punción venosa en caninos medianos y gatos.'
          },
          {
            sku: 'INS-JER-3ML',
            name: 'Jeringa Descartable 3ml con Aguja 21G',
            category: 'insumos_clinicos',
            presentation: 'Caja 100 unidades',
            stock_current: 120,
            stock_min: 30,
            cost_price: 0.25,
            sale_price: 0.80,
            lot_number: 'LOT-2026-JER3',
            expiry_date: '2029-06-01',
            location: 'Estante Descartables',
            requires_prescription: false,
            description: 'Jeringa de 3 cuerpos apirogénica estéril.'
          },
          {
            sku: 'ANE-ISO-100',
            name: 'Isoflurano Líquido para Inhalación 100ml',
            category: 'anestesia',
            presentation: 'Frasco ámbar 100ml',
            stock_current: 2, // Low stock on purpose
            stock_min: 3,
            cost_price: 28.00,
            sale_price: 65.00,
            lot_number: 'LOT-2026-ISO10',
            expiry_date: '2028-03-31',
            location: 'Máquina Anestésica Quirófano',
            requires_prescription: true,
            description: 'Anestésico volátil inhalatorio para cirugías generales y procedimientos invasivos.'
          },
          {
            sku: 'ALI-ROY-REC',
            name: 'Royal Canin Recovery Dieta Húmeda 195g',
            category: 'alimentos_especiales',
            presentation: 'Lata 195g',
            stock_current: 14,
            stock_min: 5,
            cost_price: 3.80,
            sale_price: 7.50,
            lot_number: 'LOT-2026-RCREC',
            expiry_date: '2026-09-30', // Expiring soon (<60 days) on purpose to test alert
            location: 'Góndola Nutrición Terapéutica',
            requires_prescription: false,
            description: 'Alimento dietético completo para perros y gatos en convalecencia o cuidados intensivos.'
          }
        ])
        console.log('✅ Default pharmacy catalogue seeded successfully.')
      }

      console.log('✅ Veterinary services, doctor profile, schedules and inventory ready.')
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


