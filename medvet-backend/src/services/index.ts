import { users } from './users/users'
import { pets } from './pets/pets'
import { services } from './services/services'
import { professionals } from './professionals/professionals'
import { schedules } from './schedules/schedules'
import { appointments } from './appointments/appointments'
import { availableSlots } from './available-slots/available-slots'
import { medicalRecords } from './medical-records/medical-records'
import { clinicalAttachments } from './clinical-attachments/clinical-attachments'
import { vaccinations } from './vaccinations/vaccinations'
import { surgeries } from './surgeries/surgeries'
import { shiftHandovers } from './shift-handovers/shift-handovers'
import { publicCarnet } from './public-carnet/public-carnet'
import { clinicalUpload } from './clinical-upload/clinical-upload'
import { inventory } from './inventory/inventory'
import { inventoryMovements } from './inventory-movements/inventory-movements'
import type { Application } from '../declarations'

export const configureServices = (app: Application) => {
  app.configure(users)
  app.configure(pets)
  app.configure(services)
  app.configure(professionals)
  app.configure(schedules)
  app.configure(appointments)
  app.configure(availableSlots)
  app.configure(medicalRecords)
  app.configure(clinicalAttachments)
  app.configure(vaccinations)
  app.configure(surgeries)
  app.configure(shiftHandovers)
  app.configure(publicCarnet)
  app.configure(clinicalUpload)
  app.configure(inventory)
  app.configure(inventoryMovements)
}

