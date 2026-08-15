import type { Application } from '../../declarations'

export class PublicCarnetService {
  app: Application

  constructor(app: Application) {
    this.app = app
  }

  async get(id: string) {
    const knex = this.app.get('knexClient')

    // Find pet
    const pet = await knex('pets').where({ id }).first()
    if (!pet) {
      throw new Error('Mascota no encontrada en el registro clínico de MedVet')
    }

    // Find owner
    const owner = await knex('users')
      .where({ id: pet.user_id })
      .select('id', 'name', 'email', 'phone')
      .first()

    // Find vaccinations
    const vaccines = await knex('vaccinations')
      .leftJoin('professionals', 'vaccinations.professional_id', 'professionals.id')
      .leftJoin('users as vet_users', 'professionals.user_id', 'vet_users.id')
      .where({ 'vaccinations.pet_id': id })
      .select(
        'vaccinations.*',
        'vet_users.name as professional_name'
      )
      .orderBy('vaccinations.applied_date', 'desc')

    // Find latest medical records & vitals
    const latestRecords = await knex('medical_records')
      .leftJoin('professionals', 'medical_records.professional_id', 'professionals.id')
      .leftJoin('users as vet_users', 'professionals.user_id', 'vet_users.id')
      .where({ 'medical_records.pet_id': id })
      .select(
        'medical_records.*',
        'vet_users.name as professional_name'
      )
      .orderBy('medical_records.created_at', 'desc')
      .limit(5)

    // Find surgeries
    const surgeries = await knex('surgeries')
      .leftJoin('professionals', 'surgeries.professional_id', 'professionals.id')
      .leftJoin('users as vet_users', 'professionals.user_id', 'vet_users.id')
      .where({ 'surgeries.pet_id': id })
      .select(
        'surgeries.*',
        'vet_users.name as professional_name'
      )
      .orderBy('surgeries.surgery_date', 'desc')

    return {
      pet,
      owner: owner ? {
        name: owner.name,
        phone: owner.phone,
        email: owner.email
      } : null,
      vaccines,
      latestRecords,
      surgeries,
      clinic: {
        name: 'Centro Veterinario Integral MedVet 24/7',
        phone: '+58 412-1234567',
        emergency_phone: '+58 424-9876543',
        address: 'Av. Las Delicias, Edificio MedVet, Piso 1, Maracay / Caracas',
        hours: 'Atención Continua 24 Horas / 365 Días'
      },
      verified_at: new Date().toISOString()
    }
  }

  async find(params: any) {
    const petId = params?.query?.pet_id
    if (petId) {
      return this.get(petId)
    }
    return { message: 'Proporcione un ID de mascota para consultar su carnet digital' }
  }
}

export const publicCarnet = (app: Application) => {
  app.use('public-carnet', new PublicCarnetService(app), {
    methods: ['get', 'find']
  })
}
