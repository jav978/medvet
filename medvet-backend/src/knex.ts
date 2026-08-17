import knex from 'knex'
import type { Knex } from 'knex'
import type { Application } from './declarations'
import { config } from 'dotenv'
import bcrypt from 'bcryptjs'
import { up as initialMigration } from './migrations/20260710000000_initial'
import { up as ehrMigration } from './migrations/20260815000000_clinical_ehr'
import { up as inventoryMigration } from './migrations/20260817000000_inventory'
import { up as hospitalizationMigration } from './migrations/20260818000000_hospitalizations_kardex'
import { up as notificationsMigration } from './migrations/20260819000000_notifications'
import { up as groomingMigration } from './migrations/20260820000000_grooming'

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

    const hasHospitalBoxes = await db.schema.hasTable('hospitalization_boxes')
    if (!hasHospitalBoxes) {
      console.log('🔄 Initializing hospitalization boxes & kardex database schema...')
      await hospitalizationMigration(db)
      console.log('✅ Hospitalization boxes & kardex schema initialized.')
    }

    const hasTemplates = await db.schema.hasTable('notification_templates')
    if (!hasTemplates) {
      console.log('🔄 Initializing notification templates & log database schema...')
      await notificationsMigration(db)
      console.log('✅ Notification database schema initialized.')
    }

    const hasGrooming = await db.schema.hasTable('grooming_records')
    if (!hasGrooming) {
      console.log('🔄 Initializing grooming & pet spa database schema...')
      await groomingMigration(db)
      console.log('✅ Grooming database schema initialized.')
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

      // 6. Auto-seed Hospitalization Boxes & Active Patients with Kardex
      const boxesCount = await db('hospitalization_boxes').count('id as count').first()
      if (boxesCount && Number(boxesCount.count) === 0) {
        console.log('🔄 Seeding hospitalization boxes and clinical kardex...')
        const insertedBoxes = await db('hospitalization_boxes').insert([
          {
            code: 'UCI-01',
            name: 'Box 1 - Cuidados Intensivos (UCI)',
            type: 'icu',
            status: 'occupied',
            size: 'Mediano',
            features: 'Oxígeno centralizado, Monitor multiparamétrico, Bomba de infusión peristáltica, Colchón térmico',
            daily_rate_usd: 45.00,
            active: true
          },
          {
            code: 'CAN-02',
            name: 'Box 2 - Caninos Grandes & Traumatología',
            type: 'canine',
            status: 'available',
            size: 'Grande',
            features: 'Cama ortopédica acolchada, Soporte de sueros dual, Acceso directo a patio terapéutico',
            daily_rate_usd: 30.00,
            active: true
          },
          {
            code: 'FEL-03',
            name: 'Box 3 - Felinos Exclusivo (Cat Friendly)',
            type: 'feline',
            status: 'available',
            size: 'Pequeño',
            features: 'Aislamiento acústico, Difusor de feromonas Feliway, Bandeja sanitaria separada, Manta térmica',
            daily_rate_usd: 28.00,
            active: true
          },
          {
            code: 'AISL-04',
            name: 'Box 4 - Aislamiento Infeccioso / Contagiosos',
            type: 'isolation',
            status: 'available',
            size: 'Mediano',
            features: 'Presión negativa, Lámpara UV germicida, Filtro HEPA, Pediluvio desinfectante',
            daily_rate_usd: 40.00,
            active: true
          },
          {
            code: 'POST-05',
            name: 'Box 5 - Recuperación Postquirúrgica Inmediata',
            type: 'post_op',
            status: 'occupied',
            size: 'Mediano',
            features: 'Manta térmica con sensor cutáneo, Monitor de saturación SpO2, Oxigenoterapia directa',
            daily_rate_usd: 35.00,
            active: true
          },
          {
            code: 'OBS-06',
            name: 'Box 6 - Observación Clínica & Procedimientos Cortos',
            type: 'standard',
            status: 'available',
            size: 'Mediano',
            features: 'Visor panorámico de vidrio templado, Soporte de fluidoterapia, Iluminación LED regulable',
            daily_rate_usd: 25.00,
            active: true
          }
        ]).returning('*')

        // Find doctor and pets to associate demo hospitalizations
        const docProfessional = await db('professionals').first()
        const allPets = await db('pets').select('id', 'name')

        if (allPets.length > 0 && docProfessional && insertedBoxes.length >= 5) {
          const uciBox = insertedBoxes.find(b => b.code === 'UCI-01')
          const postBox = insertedBoxes.find(b => b.code === 'POST-05')

          const pet1 = allPets[0]
          const pet2 = allPets.length > 1 ? allPets[1] : allPets[0]

          if (uciBox && pet1) {
            const hosp1 = await db('hospitalizations').insert({
              pet_id: pet1.id,
              box_id: uciBox.id,
              vet_id: docProfessional.id,
              admission_date: new Date(Date.now() - 14 * 3600 * 1000), // 14 hours ago
              status: 'critical',
              reason_for_admission: 'Gastroenteritis hemorrágica aguda con deshidratación severa (8%) y vómitos biliosos incoercibles.',
              presumptive_diagnosis: 'Parvovirosis canina / Enteritis viral aguda',
              definitive_diagnosis: 'Parvovirosis confirmada por test rápido de antígeno',
              diet_instructions: 'NPO estricto por 12h. Iniciar tolerancia a agua tibia con electrolitos vía oral a razón de 5ml c/2h.',
              fluid_therapy_plan: 'Ringer Lactato con KCl (20 mEq/L) a 38 ml/h por bomba de infusión continua.',
              medication_schedule: 'Maropitant 1mg/kg SC c/24h, Ampicilina Sulbactam 30mg/kg IV c/8h, Ranitidina 2mg/kg IV c/12h.',
              daily_cost_usd: 45.00,
              notes: 'Paciente con vía permeable en miembro anterior izquierdo (catéter 22G). Monitorear glucemia y temperatura cada 4 horas.'
            }).returning('*')

            if (hosp1 && hosp1[0]) {
              await db('hospitalization_boxes').where({ id: uciBox.id }).update({ current_hospitalization_id: hosp1[0].id })

              // Seed 3 historical Kardex monitoring entries
              await db('kardex_entries').insert([
                {
                  hospitalization_id: hosp1[0].id,
                  professional_id: docProfessional.id,
                  recorded_at: new Date(Date.now() - 12 * 3600 * 1000),
                  entry_type: 'vitals',
                  temperature: 39.4,
                  heart_rate: 145,
                  respiratory_rate: 34,
                  blood_pressure_sys: 95,
                  blood_pressure_dia: 60,
                  capillary_refill_time: '2.5s',
                  mucous_membranes: 'pálidas',
                  pain_score: 2,
                  fluid_rate_ml_hr: 45.0,
                  fluid_volume_infused_ml: 90.0,
                  urination: 'ausente',
                  defecation: 'diarrea',
                  appetite: 'anorexia',
                  vomit_episodes: 2,
                  notes: 'Ingreso a UCI. Paciente letárgico, pliegue cutáneo marcado. Se canaliza vía 22G y se instaura bolo inicial de fluidoterapia.'
                },
                {
                  hospitalization_id: hosp1[0].id,
                  professional_id: docProfessional.id,
                  recorded_at: new Date(Date.now() - 6 * 3600 * 1000),
                  entry_type: 'medication',
                  temperature: 38.8,
                  heart_rate: 130,
                  respiratory_rate: 28,
                  blood_pressure_sys: 105,
                  blood_pressure_dia: 68,
                  capillary_refill_time: '2s',
                  mucous_membranes: 'rosadas_palidas',
                  pain_score: 1,
                  medication_name: 'Ampicilina Sulbactam 300mg + Maropitant 10mg',
                  dose_given: '300mg IV lento / 10mg SC',
                  route: 'IV',
                  fluid_rate_ml_hr: 38.0,
                  fluid_volume_infused_ml: 318.0,
                  urination: 'normal',
                  defecation: 'ausente',
                  appetite: 'anorexia',
                  vomit_episodes: 0,
                  notes: 'Administración de antibioticoterapia y antiemético. Cesa episodio emético. Paciente más reactivo al llamado.'
                },
                {
                  hospitalization_id: hosp1[0].id,
                  professional_id: docProfessional.id,
                  recorded_at: new Date(Date.now() - 1 * 3600 * 1000),
                  entry_type: 'evolution_note',
                  temperature: 38.5,
                  heart_rate: 118,
                  respiratory_rate: 24,
                  blood_pressure_sys: 112,
                  blood_pressure_dia: 72,
                  capillary_refill_time: '1.5s',
                  mucous_membranes: 'rosadas',
                  pain_score: 1,
                  fluid_rate_ml_hr: 35.0,
                  fluid_volume_infused_ml: 528.0,
                  urination: 'normal',
                  defecation: 'ausente',
                  appetite: 'asistido',
                  vomit_episodes: 0,
                  notes: 'Evolución favorable en turno. Aceptó 10ml de solución de rehidratación oral sin nauseas. Mantener infusión continua a 35ml/h.'
                }
              ])
            }
          }

          if (postBox && pet2) {
            const hosp2 = await db('hospitalizations').insert({
              pet_id: pet2.id,
              box_id: postBox.id,
              vet_id: docProfessional.id,
              admission_date: new Date(Date.now() - 8 * 3600 * 1000), // 8 hours ago
              status: 'post_op',
              reason_for_admission: 'Ovariohisterectomía de urgencia por Piometra cerrada de gran volumen.',
              presumptive_diagnosis: 'Piometra postquirúrgica',
              definitive_diagnosis: 'Piometra cerrada con peritonitis localizada resuelta',
              diet_instructions: 'Royal Canin Recovery 25g tibio en pequeñas porciones cada 4 horas.',
              fluid_therapy_plan: 'Solución Fisiológica 0.9% + Dextrosa 5% a 25 ml/h.',
              medication_schedule: 'Meloxicam 0.2mg/kg SC c/24h, Tramadol 2mg/kg IV lento c/8h, Cefazolina 25mg/kg IV c/8h.',
              daily_cost_usd: 35.00,
              notes: 'Herida quirúrgica limpia sin sangrado activo ni exudado. Apósito protector estéril colocado.'
            }).returning('*')

            if (hosp2 && hosp2[0]) {
              await db('hospitalization_boxes').where({ id: postBox.id }).update({ current_hospitalization_id: hosp2[0].id })

              await db('kardex_entries').insert([
                {
                  hospitalization_id: hosp2[0].id,
                  professional_id: docProfessional.id,
                  recorded_at: new Date(Date.now() - 7 * 3600 * 1000),
                  entry_type: 'vitals',
                  temperature: 37.6,
                  heart_rate: 110,
                  respiratory_rate: 22,
                  blood_pressure_sys: 100,
                  blood_pressure_dia: 65,
                  capillary_refill_time: '2s',
                  mucous_membranes: 'rosadas',
                  pain_score: 2,
                  medication_name: 'Tramadol 20mg IV + Cefazolina 250mg IV',
                  dose_given: '20mg IV lento / 250mg IV',
                  route: 'IV',
                  fluid_rate_ml_hr: 30.0,
                  fluid_volume_infused_ml: 60.0,
                  urination: 'ausente',
                  defecation: 'ausente',
                  appetite: 'anorexia',
                  vomit_episodes: 0,
                  notes: 'Egreso de quirófano. Paciente saliendo de anestesia general. Se abriga con manta térmica.'
                },
                {
                  hospitalization_id: hosp2[0].id,
                  professional_id: docProfessional.id,
                  recorded_at: new Date(Date.now() - 2 * 3600 * 1000),
                  entry_type: 'evolution_note',
                  temperature: 38.3,
                  heart_rate: 98,
                  respiratory_rate: 20,
                  blood_pressure_sys: 118,
                  blood_pressure_dia: 75,
                  capillary_refill_time: '1.5s',
                  mucous_membranes: 'rosadas',
                  pain_score: 1,
                  fluid_rate_ml_hr: 25.0,
                  fluid_volume_infused_ml: 185.0,
                  urination: 'normal',
                  defecation: 'ausente',
                  appetite: 'come_solo',
                  vomit_episodes: 0,
                  notes: 'Paciente en estación, moviliza cola. Comió 20g de Recovery espontáneamente. Herida en excelente estado. Evaluar alta en 24h.'
                }
              ])
            }
          }
        }

        console.log('✅ Hospitalization boxes, admissions and Kardex entries seeded successfully.')
      }

      // 7. Auto-seed Notification Templates
      const templatesCount = await db('notification_templates').count('id as count').first()
      if (templatesCount && Number(templatesCount.count) === 0) {
        console.log('🔄 Seeding notification templates...')
        await db('notification_templates').insert([
          {
            code: 'appointment_reminder',
            channel: 'whatsapp',
            title: 'Recordatorio de Cita Médica (24h antes)',
            subject: 'Recordatorio de Cita Médica - MedVet',
            template_body: '🐾 *Recordatorio de Cita Médica - MedVet*\n\nHola {{tutor_name}}, te recordamos que *{{pet_name}}* tiene una cita programada para el día *{{date}}* a las *{{time}}* con el especialista *{{vet_name}}* para el servicio de *{{service_name}}*.\n\n📍 Sede Principal MedVet Clínicas\nPor favor confirma tu asistencia respondiendo a este mensaje. ¡Te esperamos!',
            description: 'Enviado automáticamente 24 horas antes de la consulta o procedimiento.',
            active: true
          },
          {
            code: 'vaccine_due',
            channel: 'whatsapp',
            title: 'Aviso Preventivo de Vacunación / Refuerzo',
            subject: 'Aviso de Vacunación - MedVet',
            template_body: '💉 *Aviso Preventivo de Vacunación - MedVet*\n\nHola {{tutor_name}}, la vacuna *{{vaccine_name}}* de *{{pet_name}}* está próxima a vencer o requiere refuerzo (Fecha límite: *{{due_date}}*).\n\n🛡️ Mantén la inmunidad de tu mascota al día. Puedes agendar el turno desde tu portal web MedVet o responder directamente a este WhatsApp para coordinar.',
            description: 'Recordatorio preventivo de calendario biológico e inmunización.',
            active: true
          },
          {
            code: 'hospitalization_update',
            channel: 'whatsapp',
            title: 'Parte Médico de Hospitalización & Evolución',
            subject: 'Evolución de Paciente Hospitalizado - MedVet',
            template_body: '🏥 *Parte Médico Diario de Hospitalización - MedVet*\n\nEstimado/a {{tutor_name}}, te compartimos la evolución clínica de *{{pet_name}}* internado/a en *{{box_name}}*:\n\n🌡️ *Estado actual:* {{status}}\n💧 *Fluidoterapia & Medicación:* Administrada según pauta horaria.\n📝 *Nota médica de guardia:* {{medical_notes}}\n\n👨‍⚕️ *Médico Responsable:* {{vet_name}}.\nNuestro equipo se encuentra atento las 24 horas.',
            description: 'Envío de informe de guardia y novedades a los tutores con mascotas en cama.',
            active: true
          },
          {
            code: 'grooming_ready',
            channel: 'whatsapp',
            title: 'Aviso: Mascota Lista en Peluquería / Spa',
            subject: '¡Tu mascota está lista! - MedVet Spa',
            template_body: '🛁✨ *¡Tu consentido ya está listo! - MedVet Spa & Grooming*\n\nHola {{tutor_name}}, te informamos con alegría que *{{pet_name}}* ha finalizado su sesión de *{{service_name}}*. ¡Quedó impecable, limpio y perfumado! 🐶💖\n\n⏰ Ya puedes pasar a retirarlo/a por nuestra sede.\n¡Gracias por confiar en MedVet!',
            description: 'Notificación instantánea cuando el estilista finaliza el secado y corte.',
            active: true
          },
          {
            code: 'custom_broadcast',
            channel: 'all',
            title: 'Comunicado General / Difusión a Tutores',
            subject: 'Comunicado Especial MedVet',
            template_body: '📢 *Comunicado Especial MedVet*\n\nEstimado/a {{tutor_name}},\n\n{{custom_message}}\n\nAtentamente,\nEquipo Médico & Directivo MedVet 🐾',
            description: 'Plantilla para avisos especiales, jornadas de desparasitación o campañas de vacunación.',
            active: true
          }
        ])
        console.log('✅ Default notification templates seeded successfully.')
      }

      // 8. Auto-seed Grooming Records
      const groomingCount = await db('grooming_records').count('id as count').first()
      if (groomingCount && Number(groomingCount.count) === 0) {
        console.log('🔄 Seeding demo grooming records...')
        const allPets = await db('pets').select('id', 'name')
        const stylist = await db('professionals').first()

        if (allPets.length > 0) {
          const today = new Date().toISOString().split('T')[0]
          await db('grooming_records').insert([
            {
              pet_id: allPets[0].id,
              stylist_id: stylist?.id,
              service_name: 'Baño Dermatológico & Corte Higiénico',
              appointment_date: today,
              start_time: '09:30',
              coat_condition: 'dermatitis',
              temperament: 'docil',
              special_shampoo: 'Champú Clorhexidina 3% + Avena Coloidal',
              haircut_style: 'Corte Higiénico y Despeje Plantar',
              status: 'in_bath',
              price_usd: 22.00,
              special_instructions: 'Dejar actuar champú antiséptico durante 10 minutos en piel.',
              notes: 'Paciente tranquilo en tina. Piel con leve eritema ventral en mejoría.'
            },
            {
              pet_id: allPets.length > 1 ? allPets[1].id : allPets[0].id,
              stylist_id: stylist?.id,
              service_name: 'Spa Completo de Raza & Deslanado Profundo',
              appointment_date: today,
              start_time: '11:00',
              coat_condition: 'enredado',
              temperament: 'nervioso',
              special_shampoo: 'Champú Hidratante con Aceite de Argán',
              haircut_style: 'Corte de Raza Estándar a Tijera',
              status: 'drying_cutting',
              price_usd: 30.00,
              special_instructions: 'Cuidado especial con nudos en zona axilar y detrás de orejas.',
              notes: 'Secado con turbina a baja potencia para evitar estrés. Corte a tijera en curso.'
            },
            {
              pet_id: allPets.length > 2 ? allPets[2].id : allPets[0].id,
              stylist_id: stylist?.id,
              service_name: 'Baño Cosmético & Perfumado Premium',
              appointment_date: today,
              start_time: '08:30',
              coat_condition: 'normal',
              temperament: 'docil',
              special_shampoo: 'Champú Brillo & Seda con Aloe Vera',
              haircut_style: 'Corte de Uñas y Limpieza de Oídos',
              status: 'ready',
              price_usd: 18.00,
              special_instructions: 'Colocar pañuelo decorativo azul.',
              notes: 'Sesión concluida con éxito. Paciente esperando a su tutor.'
            }
          ])
          console.log('✅ Demo grooming records seeded successfully.')
        }
      }

      console.log('✅ All veterinary modules: EHR, Inventory, Hospitalization, Notifications & Grooming ready.')
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


