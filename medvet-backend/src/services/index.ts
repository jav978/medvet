import { users } from './users/users'
import { pets } from './pets/pets'
import { services } from './services/services'
import { professionals } from './professionals/professionals'
import { schedules } from './schedules/schedules'
import { appointments } from './appointments/appointments'
import { availableSlots } from './available-slots/available-slots'
import type { Application } from '../declarations'

export const configureServices = (app: Application) => {
  app.configure(users)
  app.configure(pets)
  app.configure(services)
  app.configure(professionals)
  app.configure(schedules)
  app.configure(appointments)
  app.configure(availableSlots)
}
