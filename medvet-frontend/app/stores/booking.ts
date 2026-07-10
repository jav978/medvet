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
      this.step = 2
    },

    selectPet(pet: Pet) {
      this.selectedPet = pet
      this.step = 3
    },

    selectDate(date: string) {
      this.selectedDate = date
      this.step = 4
    },

    selectSlot(slot: TimeSlot) {
      this.selectedSlot = slot
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

        // Calculate end time based on service duration
        const [hours, minutes] = this.selectedSlot!.time.split(':').map(Number)
        const endMinutes = hours * 60 + minutes + this.selectedService!.duration
        const endHours = Math.floor(endMinutes / 60)
        const endMins = endMinutes % 60
        const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`

        const appointment = await $feathers.service('appointments').create({
          user_id: userId,
          pet_id: this.selectedPet!.id,
          professional_id: this.selectedSlot!.professional_id,
          service_id: this.selectedService!.id,
          date: this.selectedDate!,
          start_time: this.selectedSlot!.time,
          end_time: endTime,
          status: 'pending',
          notes
        })

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
