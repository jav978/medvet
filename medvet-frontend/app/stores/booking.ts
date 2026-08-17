import { defineStore } from 'pinia'

interface Service {
  id: string
  name: string
  description?: string
  duration: number
  price?: number
  category: string
}

interface Pet {
  id: string
  name: string
  species: string
  breed?: string
}

interface Professional {
  id: string
  name: string
  specialty: string
}

interface TimeSlot {
  professional_id: string
  professional_name: string
  time: string
  available: boolean
}

interface BookingState {
  step: number
  selectedService: Service | null
  selectedPet: Pet | null
  selectedDate: string | null
  selectedSlot: TimeSlot | null
  selectedProfessionalId: string | null
  services: Service[]
  pets: Pet[]
  availableSlots: TimeSlot[]
  loading: boolean
}

export const useBookingStore = defineStore('booking', {
  state: (): BookingState => ({
    step: 1,
    selectedService: null,
    selectedPet: null,
    selectedDate: null,
    selectedSlot: null,
    selectedProfessionalId: null,
    services: [],
    pets: [],
    availableSlots: [],
    loading: false
  }),

  actions: {
    async fetchServices() {
      this.loading = true
      try {
        const { $feathers } = useNuxtApp()
        const result = await $feathers.service('services').find({
          query: { active: true }
        })
        this.services = result.data || result
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPets(userId: string) {
      this.loading = true
      try {
        const { $feathers } = useNuxtApp()
        const result = await $feathers.service('pets').find({
          query: { user_id: userId }
        })
        this.pets = result.data || result
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchAvailableSlots(serviceId: string, date: string, professionalId?: string) {
      this.loading = true
      try {
        const { $feathers } = useNuxtApp()
        const query: any = { service_id: serviceId, date }
        if (professionalId) {
          query.professional_id = professionalId
        }
        const result = await $feathers.service('available-slots').find({ query })
        this.availableSlots = result.data || result
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    selectService(service: Service) {
      this.selectedService = service
    },

    selectPet(pet: Pet) {
      this.selectedPet = pet
    },

    selectDate(date: string) {
      this.selectedDate = date
    },

    selectSlot(slot: TimeSlot) {
      this.selectedSlot = slot
    },

    setStep(n: number) {
      if (n >= 1 && n <= 5) {
        this.step = n
      }
    },

    nextStep() {
      if (this.step < 5) {
        this.step++
      }
    },

    prevStep() {
      if (this.step > 1) {
        this.step--
      }
    },

    resetBooking() {
      this.step = 1
      this.selectedService = null
      this.selectedPet = null
      this.selectedDate = null
      this.selectedSlot = null
      this.availableSlots = []
    },

    async confirmBooking(userId: string, notes?: string) {
      this.loading = true
      try {
        const { $feathers } = useNuxtApp()
        const isUUID = (str: any) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str)

        // Calculate end time based on service duration
        const duration = this.selectedService?.duration || 30
        const slotTime = this.selectedSlot?.time || '09:00'
        const [hours, minutes] = slotTime.split(':').map(Number)
        const endMinutes = hours * 60 + minutes + duration
        const endHours = Math.floor(endMinutes / 60)
        const endMins = endMinutes % 60
        const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`

        let petId = this.selectedPet?.id
        if ($feathers && this.selectedPet) {
          // If pet is not a UUID or was created locally, persist it to database
          if (!isUUID(petId)) {
            try {
              const createdPet = await $feathers.service('pets').create({
                user_id: userId,
                name: this.selectedPet.name.trim(),
                species: this.selectedPet.species || 'Perro',
                breed: this.selectedPet.breed?.trim() || '',
                age: (this.selectedPet as any).age ? Number((this.selectedPet as any).age) : undefined,
                weight: (this.selectedPet as any).weight ? Number((this.selectedPet as any).weight) : undefined
              })
              if (createdPet?.id) {
                petId = createdPet.id
                this.selectedPet.id = createdPet.id
              }
            } catch (err) {
              console.warn('Could not persist pet to backend:', err)
            }
          }
        }

        // Validate or resolve service_id
        let serviceId = this.selectedService?.id
        if ($feathers && (!serviceId || !isUUID(serviceId))) {
          try {
            const dbServices = await $feathers.service('services').find({ query: { active: true, $limit: 1 } })
            const list = dbServices.data || dbServices
            if (list && list.length > 0) {
              serviceId = list[0].id
            }
          } catch (e) { /* ignore */ }
        }

        // Validate or resolve professional_id
        let professionalId = this.selectedSlot?.professional_id
        if ($feathers && (!professionalId || !isUUID(professionalId))) {
          try {
            const dbPros = await $feathers.service('professionals').find({ query: { active: true, $limit: 1 } })
            const list = dbPros.data || dbPros
            if (list && list.length > 0) {
              professionalId = list[0].id
            }
          } catch (e) { /* ignore */ }
        }

        const appointment = $feathers ? await $feathers.service('appointments').create({
          user_id: userId,
          pet_id: String(petId),
          professional_id: String(professionalId),
          service_id: String(serviceId),
          date: this.selectedDate || new Date().toISOString().split('T')[0],
          start_time: slotTime,
          end_time: endTime,
          status: 'pending',
          notes: notes?.trim() || undefined
        }) : { id: 'apt_' + Date.now() }

        this.resetBooking()
        return appointment
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    }

  }
})
