import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { HookContext } from '../../declarations'
import { requireAuth, requireRole } from '../../hooks/security'
import type { Application } from '../../declarations'

export interface InventoryMovement {
  id: string
  item_id: string
  user_id?: string
  type: 'in_purchase' | 'out_clinical_use' | 'out_sale' | 'adjustment' | 'expired_loss'
  quantity: number
  previous_stock: number
  new_stock: number
  reason?: string
  reference_id?: string
  created_at: Date
}

export interface InventoryMovementData extends Omit<InventoryMovement, 'id' | 'created_at'> {}
export interface InventoryMovementParams extends KnexAdapterParams<InventoryMovement> {}

export class InventoryMovementService extends KnexService<InventoryMovement, InventoryMovementData, InventoryMovementParams> {}

const handleMovementAndStock = async (context: HookContext) => {
  const db = context.app.get('knexClient')
  const { data, params } = context

  if (data && data.item_id && typeof data.quantity === 'number') {
    const item = await db('inventory_items').where({ id: data.item_id }).first()
    if (!item) {
      throw new Error('Producto de inventario no encontrado')
    }

    const currentStock = Number(item.stock_current) || 0
    const qty = Number(data.quantity)
    let newStock = currentStock

    if (data.type === 'in_purchase' || (data.type === 'adjustment' && qty > 0)) {
      newStock = currentStock + Math.abs(qty)
    } else if (data.type === 'out_clinical_use' || data.type === 'out_sale' || data.type === 'expired_loss' || (data.type === 'adjustment' && qty < 0)) {
      newStock = Math.max(0, currentStock - Math.abs(qty))
    }

    data.previous_stock = currentStock
    data.new_stock = newStock
    if (params.user?.id) {
      data.user_id = params.user.id
    }

    // Update inventory item
    await db('inventory_items')
      .where({ id: data.item_id })
      .update({
        stock_current: newStock,
        updated_at: new Date()
      })
  }
  return context
}

export const inventoryMovements = (app: Application) => {
  const options: KnexAdapterOptions = {
    paginate: app.get('paginate'),
    Model: app.get('knexClient'),
    name: 'inventory_movements'
  }

  app.use('inventory-movements', new InventoryMovementService(options), {
    methods: ['find', 'get', 'create']
  })

  app.service('inventory-movements').hooks({
    around: {
      all: []
    },
    before: {
      all: [requireAuth],
      create: [requireRole(['admin', 'veterinarian', 'receptionist']), handleMovementAndStock]
    },
    after: {
      all: []
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    'inventory-movements': InventoryMovementService
  }
}
