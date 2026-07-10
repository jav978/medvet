import type { Knex } from 'knex'
import bcrypt from 'bcryptjs'

export async function seed(knex: Knex): Promise<void> {
  // Clean existing data
  await knex('appointments').del()
  await knex('schedules').del()
  await knex('professionals').del()
  await knex('services').del()
  await knex('pets').del()
  await knex('users').del()

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const [admin] = await knex('users').insert({
    email: 'admin@medvet.com',
    password: adminPassword,
    name: 'Admin MedVet',
    phone: '+54 11 1234-5678',
    role: 'admin',
    active: true
  }).returning('*')

  // Create veterinarian user
  const vetPassword = await bcrypt.hash('vet123', 10)
  const [vetUser] = await knex('users').insert({
    email: 'vet@medvet.com',
    password: vetPassword,
    name: 'Dr. Carlos Rodriguez',
    phone: '+54 11 2345-6789',
    role: 'veterinarian',
    active: true
  }).returning('*')

  // Create client user
  const clientPassword = await bcrypt.hash('client123', 10)
  const [client] = await knex('users').insert({
    email: 'client@medvet.com',
    password: clientPassword,
    name: 'Maria Garcia',
    phone: '+54 11 3456-7890',
    role: 'client',
    active: true
  }).returning('*')

  // Create professional profile for vet
  const [professional] = await knex('professionals').insert({
    user_id: vetUser.id,
    specialty: 'Medicina General',
    active: true
  }).returning('*')

  // Create services
  const [consulta] = await knex('services').insert({
    name: 'Consulta General',
    description: 'Consulta veterinaria general para evaluación de salud',
    duration: 30,
    price: 5000,
    category: 'consulta',
    active: true
  }).returning('*')

  const [vacuna] = await knex('services').insert({
    name: 'Vacunación',
    description: 'Aplicación de vacunas para mascotas',
    duration: 20,
    price: 3000,
    category: 'vacuna',
    active: true
  }).returning('*')

  const [cirugia] = await knex('services').insert({
    name: 'Cirugía',
    description: 'Procedimientos quirúrgicos veterinarios',
    duration: 60,
    price: 25000,
    category: 'cirugia',
    active: true
  }).returning('*')

  // Create pet for client
  await knex('pets').insert({
    user_id: client.id,
    name: 'Max',
    species: 'Perro',
    breed: 'Labrador',
    age: 3,
    weight: 28.5
  })

  // Create schedules (Monday to Friday, 9:00 - 18:00)
  const scheduleInserts = []
  for (let day = 1; day <= 5; day++) {
    scheduleInserts.push({
      professional_id: professional.id,
      day_of_week: day,
      start_time: '09:00',
      end_time: '18:00',
      active: true
    })
  }
  await knex('schedules').insert(scheduleInserts)

  console.log('Seed data created successfully!')
}
