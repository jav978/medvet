import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import { requireAuth, requireRole } from '../../hooks/security'
import type { Application } from '../../declarations'

export interface InventoryItem {
  id: string
  sku: string
  name: string
  category: 'medicamentos' | 'vacunas' | 'insumos_clinicos' | 'alimentos_especiales' | 'anestesia' | 'otro'
  presentation: string
  stock_current: number
  stock_min: number
  cost_price: number
  sale_price: number
  lot_number?: string
  expiry_date?: string
  location?: string
  requires_prescription?: boolean
  description?: string
  active?: boolean
  created_at: Date
  updated_at: Date
}

export interface InventoryItemData extends Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'> {}
export interface InventoryItemParams extends KnexAdapterParams<InventoryItem> {}

export class InventoryService extends KnexService<InventoryItem, InventoryItemData, InventoryItemParams> {}

export const inventory = (app: Application) => {
  const options: KnexAdapterOptions = {
    paginate: app.get('paginate'),
    Model: app.get('knexClient'),
    name: 'inventory_items'
  }

  app.use('inventory', new InventoryService(options), {
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove']
  })

  app.service('inventory').hooks({
    around: {
      all: []
    },
    before: {
      all: [requireAuth],
      create: [requireRole(['admin', 'veterinarian', 'receptionist'])],
      update: [requireRole(['admin', 'veterinarian'])],
      patch: [requireRole(['admin', 'veterinarian', 'receptionist'])],
      remove: [requireRole(['admin'])]
    },
    after: {
      all: []
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    inventory: InventoryService
  }
}
