import type { Application } from '../../declarations'

interface SlotQuery {
  service_id: string
  professional_id?: string
  date: string
}

interface TimeSlot {
  professional_id: string
  professional_name: string
  time: string
  available: boolean
}

export class AvailableSlotsService {
  app: Application

  constructor(app: Application) {
    this.app = app
  }

  async find(params: any) {
    const { service_id, professional_id, date } = params.query as SlotQuery

    // Get service duration
    const service = await this.app.service('services').get(service_id)
    const duration = service.duration

    // Get professionals (optionally filtered)
    const professionalQuery: any = { active: true }
    if (professional_id) {
      professionalQuery.id = professional_id
    }
    const professionals = await this.app.service('professionals').find({ query: professionalQuery })

    // Get day of week from date
    const dateObj = new Date(date)
    const dayOfWeek = dateObj.getDay()

    // Get available slots for each professional
    const slots: TimeSlot[] = []

    for (const professional of professionals.data || professionals) {
      // Get schedule for this day
      const schedules = await this.app.service('schedules').find({
        query: {
          professional_id: professional.id,
          day_of_week: dayOfWeek,
          active: true
        }
      })

      for (const schedule of schedules.data || schedules) {
        // Generate time slots
        const startTime = this.timeToMinutes(schedule.start_time)
        const endTime = this.timeToMinutes(schedule.end_time)

        for (let time = startTime; time < endTime; time += duration) {
          const timeStr = this.minutesToTime(time)
          const endSlotTime = this.minutesToTime(time + duration)

          // Check if slot is already booked
          const existingAppointment = await this.app.service('appointments').find({
            query: {
              professional_id: professional.id,
              date: date,
              start_time: timeStr,
              status: { $ne: 'cancelled' }
            }
          })

          const isAvailable = (existingAppointment.data || existingAppointment).length === 0

          slots.push({
            professional_id: professional.id,
            professional_name: professional.user?.name || 'Professional',
            time: timeStr,
            available: isAvailable
          })
        }
      }
    }

    return slots
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }
}

export const availableSlots = (app: Application) => {
  app.use('available-slots', new AvailableSlotsService(app), {
    methods: ['find']
  })
}
