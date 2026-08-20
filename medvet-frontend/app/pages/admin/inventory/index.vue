<template>
  <div class="admin-inventory-page">

    <!-- Top Header -->
    <div class="admin-h-row">
      <div>
        <div class="admin-eyebrow-row">
          <span class="admin-eyebrow">Farmacia & Logística Hospitalaria</span>
          <span class="admin-live-badge">
            <span class="live-dot"></span>
            Control de Stock en Tiempo Real
          </span>
        </div>
        <h1 class="admin-title">Farmacia & Inventario Clínico</h1>
        <p class="admin-subtitle">
          Control de existencias de medicamentos, biológicos, material quirúrgico y trazabilidad de lotes con fechas de vencimiento.
        </p>
      </div>

      <div class="admin-header-actions">
        <button type="button" @click="handleExportCsv" class="btn-ghost">
          <span>📑</span>
          <span>Exportar CSV</span>
        </button>
        <button type="button" @click="openMovementModal(null)" class="btn-ghost">
          <span>🔄</span>
          <span>Ajuste / Movimiento</span>
        </button>
        <button type="button" @click="openNewItemModal" class="btn-primary">
          <span>＋</span>
          <span>Nuevo Producto / Insumo</span>
        </button>
      </div>
    </div>

    <!-- Inventory KPIs -->
    <div class="kpi-grid">
      <div class="kpi-box">
        <span class="kpi-lbl">Total de Referencias</span>
        <span class="kpi-amount font-mono-numbers">{{ items.length }}</span>
        <span class="kpi-note">Productos activos en catálogo</span>
      </div>

      <div class="kpi-box" :class="{ 'kpi-box--alert': lowStockItemsCount > 0 }">
        <span class="kpi-lbl">Stock Crítico / Por Agotar</span>
        <span class="kpi-amount font-mono-numbers text-amber-500">{{ lowStockItemsCount }}</span>
        <span class="kpi-note">{{ lowStockItemsCount > 0 ? 'Requieren reposición inmediata' : 'Niveles de stock óptimos' }}</span>
      </div>

      <div class="kpi-box" :class="{ 'kpi-box--alert': expiringSoonCount > 0 }">
        <span class="kpi-lbl">Por Vencer (&lt; 60 días)</span>
        <span class="kpi-amount font-mono-numbers text-rose-500">{{ expiringSoonCount }}</span>
        <span class="kpi-note">Monitoreo de biológicos y fármacos</span>
      </div>

      <div class="kpi-box">
        <span class="kpi-lbl">Valorización Total (USD)</span>
        <span class="kpi-amount font-mono-numbers text-mint">${{ totalInventoryValueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
        <span class="kpi-note">~ Bs. {{ (totalInventoryValueUsd * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} (BCV)</span>
      </div>
    </div>

    <!-- Category Tabs & Quick Filters -->
    <div class="filter-card">
      <div class="filter-categories">
        <button
          type="button"
          v-for="cat in categoryTabs"
          :key="cat.id"
          @click="selectedCategory = cat.id"
          :class="['cat-tab-btn', selectedCategory === cat.id ? 'cat-tab-btn--active' : '']"
        >
          <span>{{ cat.icon }}</span>
          <span>{{ cat.label }}</span>
          <span class="cat-badge">{{ getCategoryCount(cat.id) }}</span>
        </button>
      </div>

      <div class="filter-search-row">
        <div class="search-input-wrap">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre de producto, SKU o lote..."
            class="search-input"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search">✕</button>
        </div>

        <div class="status-filter-wrap">
          <select v-model="stockFilter" class="filter-select">
            <option value="all">Todos los Estados</option>
            <option value="low">⚠️ Solo Stock Bajo</option>
            <option value="expiring">⏳ Por Vencer (&lt; 60 días)</option>
            <option value="out">🛑 Agotados (Stock 0)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="inventory-table-container">
      <div v-if="loading" class="table-loading">
        <div class="spinner"></div>
        <span>Cargando catálogo de farmacia...</span>
      </div>

      <div v-else-if="filteredItems.length === 0" class="table-empty">
        <span class="empty-icon">📦</span>
        <h3>No se encontraron productos</h3>
        <p>Intenta ajustar los filtros de búsqueda o agrega un nuevo producto al inventario.</p>
        <button type="button" @click="openNewItemModal" class="btn-primary btn-sm mt-3">
          ＋ Agregar Producto
        </button>
      </div>

      <table v-else class="inventory-table">
        <thead>
          <tr>
            <th>SKU / Código</th>
            <th>Producto & Presentación</th>
            <th>Categoría</th>
            <th>Ubicación</th>
            <th>Stock Actual</th>
            <th>Lote / Vencimiento</th>
            <th>Precios (USD)</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item.id" :class="{ 'row-warning': isLowStock(item) }">
            <td class="font-mono-numbers">
              <span class="sku-pill">{{ item.sku || '—' }}</span>
            </td>
            <td>
              <div class="product-info-cell">
                <span class="product-name">{{ item.name }}</span>
                <span class="product-presentation">{{ item.presentation || 'Unidad' }}</span>
                <span v-if="item.requires_prescription" class="rx-tag" title="Requiere Prescripción Médica">Rx Médica</span>
              </div>
            </td>
            <td>
              <span :class="['category-pill', `category-pill--${item.category}`]">
                {{ getCategoryLabel(item.category) }}
              </span>
            </td>
            <td>
              <span class="location-text">📍 {{ item.location || 'Farmacia Central' }}</span>
            </td>
            <td>
              <div class="stock-cell font-mono-numbers">
                <div class="stock-num-row">
                  <span class="stock-current" :class="getStockColorClass(item)">
                    {{ item.stock_current }}
                  </span>
                  <span class="stock-min-label">/ Mín. {{ item.stock_min }}</span>
                </div>
                <div class="stock-bar-bg">
                  <div
                    class="stock-bar-fill"
                    :class="getStockBarColorClass(item)"
                    :style="{ width: `${Math.min(100, (item.stock_current / (item.stock_min * 2 || 10)) * 100)}%` }"
                  ></div>
                </div>
              </div>
            </td>
            <td>
              <div class="expiry-cell font-mono-numbers">
                <span class="lot-number">Lote: {{ item.lot_number || 'S/L' }}</span>
                <span v-if="item.expiry_date" :class="['expiry-date', getExpiryStatusClass(item.expiry_date)]">
                  📅 {{ formatDate(item.expiry_date) }}
                  <span v-if="isExpiringSoon(item.expiry_date)" class="exp-badge">Próximo</span>
                </span>
                <span v-else class="text-xs text-gray-400">Sin caducidad</span>
              </div>
            </td>
            <td>
              <div class="price-cell font-mono-numbers">
                <span class="sale-price">${{ Number(item.sale_price || 0).toFixed(2) }}</span>
                <span class="cost-price">Costo: ${{ Number(item.cost_price || 0).toFixed(2) }}</span>
              </div>
            </td>
            <td class="text-right">
              <div class="actions-cell">
                <button
                  type="button"
                  @click="openMovementModal(item)"
                  class="action-btn action-btn--move"
                  title="Registrar Entrada / Salida / Ajuste"
                >
                  ⚡ Mover
                </button>
                <button
                  type="button"
                  @click="openEditItemModal(item)"
                  class="action-btn action-btn--edit"
                  title="Editar Información"
                >
                  ✏️
                </button>
                <button
                  type="button"
                  @click="confirmDeleteItem(item)"
                  class="action-btn action-btn--delete"
                  title="Eliminar del Catálogo"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ─── MODAL: NUEVO / EDITAR PRODUCTO ─── -->
    <div v-if="showItemModal" class="modal-backdrop" @click.self="showItemModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h3 class="modal-title">{{ editingItem ? 'Editar Producto / Insumo' : 'Nuevo Producto en Farmacia' }}</h3>
            <p class="modal-sub">Completa los datos técnicos y comerciales del fármaco o material clínico.</p>
          </div>
          <button type="button" @click="showItemModal = false" class="modal-close-btn">✕</button>
        </div>

        <form @submit.prevent="saveItem" class="modal-form">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-lbl">Código SKU <span class="req">*</span></label>
              <input
                v-model="formItem.sku"
                type="text"
                required
                placeholder="Ej. MED-ENRO-50"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-lbl">Categoría <span class="req">*</span></label>
              <select v-model="formItem.category" required class="form-select">
                <option value="medicamentos">💊 Medicamento</option>
                <option value="vacunas">💉 Vacuna / Biológico</option>
                <option value="insumos_clinicos">🩹 Insumo Descartable</option>
                <option value="anestesia">❄️ Anestesia / Quirófano</option>
                <option value="alimentos_especiales">🥫 Nutrición Terapéutica</option>
                <option value="otro">📦 Otro Insumo</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label class="form-lbl">Nombre Comercial & Principio Activo <span class="req">*</span></label>
              <input
                v-model="formItem.name"
                type="text"
                required
                placeholder="Ej. Enrofloxacina 50mg - 10 comp."
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-lbl">Presentación</label>
              <input
                v-model="formItem.presentation"
                type="text"
                placeholder="Ej. Frasco 100ml, Caja 10 comp., Ampolla"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-lbl">Ubicación en Clínica</label>
              <input
                v-model="formItem.location"
                type="text"
                placeholder="Ej. Estante A-1, Refrigerador, Quirófano"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-lbl">Stock Actual</label>
              <input
                v-model.number="formItem.stock_current"
                type="number"
                min="0"
                required
                class="form-input font-mono-numbers"
              />
            </div>

            <div class="form-group">
              <label class="form-lbl">Stock Mínimo (Alerta de Reorden)</label>
              <input
                v-model.number="formItem.stock_min"
                type="number"
                min="1"
                required
                class="form-input font-mono-numbers"
              />
            </div>

            <div class="form-group">
              <label class="form-lbl">Precio de Costo (USD)</label>
              <input
                v-model.number="formItem.cost_price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="form-input font-mono-numbers"
              />
            </div>

            <div class="form-group">
              <label class="form-lbl">Precio de Venta / Aplicación (USD)</label>
              <input
                v-model.number="formItem.sale_price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="form-input font-mono-numbers"
              />
            </div>

            <div class="form-group">
              <label class="form-lbl">Número de Lote</label>
              <input
                v-model="formItem.lot_number"
                type="text"
                placeholder="Ej. LOT-2026-EN50"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-lbl">Fecha de Vencimiento</label>
              <input
                v-model="formItem.expiry_date"
                type="date"
                class="form-input"
              />
            </div>

            <div class="form-group full-width">
              <label class="checkbox-label">
                <input v-model="formItem.requires_prescription" type="checkbox" />
                <span>Requiere prescripción médica veterinaria obligatoria (Rx)</span>
              </label>
            </div>

            <div class="form-group full-width">
              <label class="form-lbl">Descripción / Indicaciones Terapéuticas</label>
              <textarea
                v-model="formItem.description"
                rows="2"
                placeholder="Dosificación sugerida, contraindicaciones o notas adicionales..."
                class="form-textarea"
              ></textarea>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showItemModal = false" class="btn-ghost">Cancelar</button>
            <button type="submit" :disabled="saving" class="btn-primary">
              {{ saving ? 'Guardando...' : (editingItem ? 'Actualizar Producto' : 'Guardar en Catálogo') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ─── MODAL: REGISTRAR MOVIMIENTO / AJUSTE DE STOCK ─── -->
    <div v-if="showMovementModal" class="modal-backdrop" @click.self="showMovementModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h3 class="modal-title">Registrar Movimiento de Inventario</h3>
            <p class="modal-sub">
              {{ selectedMovementItem ? `Producto: ${selectedMovementItem.name} (${selectedMovementItem.sku})` : 'Selecciona el producto a ajustar' }}
            </p>
          </div>
          <button type="button" @click="showMovementModal = false" class="modal-close-btn">✕</button>
        </div>

        <form @submit.prevent="saveMovement" class="modal-form">
          <div class="form-grid">
            <div class="form-group full-width" v-if="!selectedMovementItem">
              <label class="form-lbl">Seleccionar Producto <span class="req">*</span></label>
              <select v-model="formMovement.item_id" required class="form-select">
                <option value="" disabled>Selecciona un producto...</option>
                <option v-for="it in items" :key="it.id" :value="it.id">
                  {{ it.name }} (Stock: {{ it.stock_current }} {{ it.presentation }}) - {{ it.sku }}
                </option>
              </select>
            </div>

            <div class="form-group full-width">
              <label class="form-lbl">Tipo de Movimiento <span class="req">*</span></label>
              <select v-model="formMovement.type" required class="form-select">
                <option value="in_purchase">📥 Entrada por Compra a Proveedor (+)</option>
                <option value="out_clinical_use">🩺 Salida por Uso Clínico / Quirófano (-)</option>
                <option value="out_sale">🛒 Salida por Venta Directa en Mostrador (-)</option>
                <option value="adjustment">⚖️ Ajuste por Auditoría / Conteo Físico</option>
                <option value="expired_loss">🛑 Pérdida por Caducidad / Vencimiento (-)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-lbl">Cantidad <span class="req">*</span></label>
              <input
                v-model.number="formMovement.quantity"
                type="number"
                min="1"
                required
                placeholder="1"
                class="form-input font-mono-numbers"
              />
            </div>

            <div class="form-group">
              <label class="form-lbl">Stock Resultante Estimado</label>
              <div class="resulting-stock-box font-mono-numbers">
                {{ calculatedNewStock }} unidades
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-lbl">Motivo / Justificación <span class="req">*</span></label>
              <input
                v-model="formMovement.reason"
                type="text"
                required
                placeholder="Ej. Ingreso Factura Proveedor #4092, Cirugía de Urgencia Paciente #12"
                class="form-input"
              />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showMovementModal = false" class="btn-ghost">Cancelar</button>
            <button type="submit" :disabled="saving" class="btn-primary">
              {{ saving ? 'Registrando...' : 'Confirmar Movimiento' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const { $feathers } = useNuxtApp()
const toast = useToastNotification()
const { bcvRate } = useCurrency()

const items = ref([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('all')
const stockFilter = ref('all')

const showItemModal = ref(false)
const editingItem = ref(null)
const formItem = reactive({
  sku: '',
  name: '',
  category: 'medicamentos',
  presentation: 'Unidad',
  stock_current: 10,
  stock_min: 5,
  cost_price: 0,
  sale_price: 0,
  lot_number: '',
  expiry_date: '',
  location: 'Farmacia Central',
  requires_prescription: false,
  description: ''
})

const showMovementModal = ref(false)
const selectedMovementItem = ref(null)
const formMovement = reactive({
  item_id: '',
  type: 'in_purchase',
  quantity: 1,
  reason: ''
})

const categoryTabs = [
  { id: 'all', label: 'Todo el Catálogo', icon: '📦' },
  { id: 'medicamentos', label: 'Medicamentos', icon: '💊' },
  { id: 'vacunas', label: 'Vacunas & Biológicos', icon: '💉' },
  { id: 'insumos_clinicos', label: 'Insumos Quirúrgicos', icon: '🩹' },
  { id: 'anestesia', label: 'Anestesia', icon: '❄️' },
  { id: 'alimentos_especiales', label: 'Nutrición', icon: '🥫' }
]

const fallbackInventory = [
  {
    id: 'f-1',
    sku: 'MED-ENRO-50',
    name: 'Enrofloxacina 50mg - 10 comp.',
    category: 'medicamentos',
    presentation: 'Caja 10 comprimidos',
    stock_current: 45,
    stock_min: 10,
    cost_price: 4.50,
    sale_price: 12.00,
    lot_number: 'LOT-2026-EN50',
    expiry_date: '2027-08-15',
    location: 'Estante A-1 (Farmacia)',
    requires_prescription: true,
    description: 'Antibiótico bactericida de amplio espectro para caninos y felinos.'
  },
  {
    id: 'f-2',
    sku: 'VAC-FEL-TRIC',
    name: 'Vacuna Triple Felina (Tricat Novivac)',
    category: 'vacunas',
    presentation: 'Frasco ampolla + Diluyente',
    stock_current: 18,
    stock_min: 10,
    cost_price: 8.00,
    sale_price: 20.00,
    lot_number: 'LOT-2026-VF88',
    expiry_date: '2026-11-30',
    location: 'Refrigerador #1 (2°C - 8°C)',
    requires_prescription: true,
    description: 'Inmunización activa contra Panleucopenia, Calicivirus y Rinotraqueítis felina.'
  },
  {
    id: 'f-3',
    sku: 'INS-CAT-IV22',
    name: 'Catéter Intravenoso 22G Jelco',
    category: 'insumos_clinicos',
    presentation: 'Caja 50 unidades',
    stock_current: 8,
    stock_min: 15,
    cost_price: 0.80,
    sale_price: 3.50,
    lot_number: 'LOT-2025-C22',
    expiry_date: '2028-05-20',
    location: 'Estante C-3 (Insumos)',
    requires_prescription: false,
    description: 'Catéter periférico radiopaco para venoclisis y fluidoterapia hospitalaria.'
  },
  {
    id: 'f-4',
    sku: 'ANE-ISO-100',
    name: 'Isoflurano 100ml Anestésico Inhalatorio',
    category: 'anestesia',
    presentation: 'Frasco ampolla 100ml',
    stock_current: 3,
    stock_min: 5,
    cost_price: 32.00,
    sale_price: 75.00,
    lot_number: 'LOT-2026-ISO',
    expiry_date: '2027-02-10',
    location: 'Gabinete Anestesia (Quirófano)',
    requires_prescription: true,
    description: 'Agente anestésico de inhalación para mantenimiento en quirófano.'
  },
  {
    id: 'f-5',
    sku: 'NUT-RC-RECOV',
    name: 'Royal Canin Veterinary Recovery 195g',
    category: 'alimentos_especiales',
    presentation: 'Lata 195g',
    stock_current: 14,
    stock_min: 8,
    cost_price: 3.20,
    sale_price: 7.50,
    lot_number: 'LOT-2026-RC',
    expiry_date: '2026-10-15',
    location: 'Estante Nutrición',
    requires_prescription: false,
    description: 'Alimento húmedo de alta densidad energética para convalecencia u hospitalización.'
  }
]

const loadInventory = async () => {
  loading.value = true
  try {
    if ($feathers) {
      const res = await $feathers.service('inventory').find({
        query: {
          $sort: { category: 1, name: 1 },
          $limit: 200
        }
      })
      const fetched = Array.isArray(res) ? res : (res.data || [])
      items.value = fetched.length ? fetched : fallbackInventory
    } else {
      items.value = fallbackInventory
    }
  } catch (err) {
    console.warn('Error fetching inventory from backend, using fallback data:', err)
    items.value = fallbackInventory
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadInventory()
})

const lowStockItemsCount = computed(() => {
  return items.value.filter(i => Number(i.stock_current) <= Number(i.stock_min)).length
})

const expiringSoonCount = computed(() => {
  return items.value.filter(i => isExpiringSoon(i.expiry_date)).length
})

const totalInventoryValueUsd = computed(() => {
  return items.value.reduce((acc, i) => acc + (Number(i.stock_current) * Number(i.cost_price || 0)), 0)
})

const getCategoryCount = (catId) => {
  if (catId === 'all') return items.value.length
  return items.value.filter(i => i.category === catId).length
}

const isLowStock = (item) => {
  return Number(item.stock_current) <= Number(item.stock_min)
}

const isExpiringSoon = (dateStr) => {
  if (!dateStr) return false
  const exp = new Date(dateStr)
  const now = new Date()
  const diffDays = (exp - now) / (1000 * 60 * 60 * 24)
  return diffDays > 0 && diffDays <= 60
}

const getStockColorClass = (item) => {
  const cur = Number(item.stock_current)
  const min = Number(item.stock_min)
  if (cur === 0) return 'text-rose-500 font-bold'
  if (cur <= min) return 'text-amber-500 font-bold'
  return 'text-emerald-500 font-bold'
}

const getStockBarColorClass = (item) => {
  const cur = Number(item.stock_current)
  const min = Number(item.stock_min)
  if (cur === 0) return 'bg-rose-500'
  if (cur <= min) return 'bg-amber-500'
  return 'bg-emerald-500'
}

const getExpiryStatusClass = (dateStr) => {
  if (!dateStr) return ''
  const exp = new Date(dateStr)
  const now = new Date()
  if (exp < now) return 'text-rose-600 font-bold'
  if (isExpiringSoon(dateStr)) return 'text-amber-500 font-semibold'
  return 'text-gray-600 dark:text-gray-300'
}

const getCategoryLabel = (cat) => {
  const map = {
    medicamentos: 'Medicamento',
    vacunas: 'Vacuna / Biológico',
    insumos_clinicos: 'Insumo Clínico',
    anestesia: 'Anestesia',
    alimentos_especiales: 'Nutrición',
    otro: 'Insumo General'
  }
  return map[cat] || cat
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-AR', { year: 'numeric', month: 'short', day: 'numeric' })
}

const filteredItems = computed(() => {
  return items.value.filter(item => {
    // Category
    if (selectedCategory.value !== 'all' && item.category !== selectedCategory.value) {
      return false
    }
    // Stock filter
    if (stockFilter.value === 'low' && !isLowStock(item)) return false
    if (stockFilter.value === 'expiring' && !isExpiringSoon(item.expiry_date)) return false
    if (stockFilter.value === 'out' && Number(item.stock_current) > 0) return false

    // Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchName = item.name?.toLowerCase().includes(q)
      const matchSku = item.sku?.toLowerCase().includes(q)
      const matchLot = item.lot_number?.toLowerCase().includes(q)
      if (!matchName && !matchSku && !matchLot) return false
    }

    return true
  })
})

const calculatedNewStock = computed(() => {
  const current = selectedMovementItem.value
    ? Number(selectedMovementItem.value.stock_current)
    : (items.value.find(i => i.id === formMovement.item_id)?.stock_current || 0)
  
  const qty = Number(formMovement.quantity) || 0
  if (formMovement.type === 'in_purchase' || (formMovement.type === 'adjustment' && qty > 0)) {
    return current + Math.abs(qty)
  }
  return Math.max(0, current - Math.abs(qty))
})

// ─── ACTIONS ───
const openNewItemModal = () => {
  editingItem.value = null
  Object.assign(formItem, {
    sku: `MED-${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    category: 'medicamentos',
    presentation: 'Unidad',
    stock_current: 10,
    stock_min: 5,
    cost_price: 0,
    sale_price: 0,
    lot_number: `LOT-${new Date().getFullYear()}-01`,
    expiry_date: '',
    location: 'Farmacia Central',
    requires_prescription: false,
    description: ''
  })
  showItemModal.value = true
}

const openEditItemModal = (item) => {
  editingItem.value = item
  Object.assign(formItem, {
    sku: item.sku || '',
    name: item.name || '',
    category: item.category || 'medicamentos',
    presentation: item.presentation || 'Unidad',
    stock_current: Number(item.stock_current) || 0,
    stock_min: Number(item.stock_min) || 5,
    cost_price: Number(item.cost_price) || 0,
    sale_price: Number(item.sale_price) || 0,
    lot_number: item.lot_number || '',
    expiry_date: item.expiry_date ? item.expiry_date.substring(0, 10) : '',
    location: item.location || 'Farmacia Central',
    requires_prescription: !!item.requires_prescription,
    description: item.description || ''
  })
  showItemModal.value = true
}

const saveItem = async () => {
  saving.value = true
  try {
    const payload = {
      sku: formItem.sku.trim(),
      name: formItem.name.trim(),
      category: formItem.category,
      presentation: formItem.presentation.trim(),
      stock_current: Number(formItem.stock_current),
      stock_min: Number(formItem.stock_min),
      cost_price: Number(formItem.cost_price),
      sale_price: Number(formItem.sale_price),
      lot_number: formItem.lot_number?.trim() || null,
      expiry_date: formItem.expiry_date || null,
      location: formItem.location?.trim() || 'Farmacia Central',
      requires_prescription: formItem.requires_prescription,
      description: formItem.description?.trim() || null
    }

    if (editingItem.value) {
      if ($feathers) {
        await $feathers.service('inventory').patch(editingItem.value.id, payload)
      } else {
        const idx = items.value.findIndex(i => i.id === editingItem.value.id)
        if (idx !== -1) items.value[idx] = { ...items.value[idx], ...payload }
      }
      toast.success('Producto Actualizado', 'Cambios guardados con éxito en el catálogo.')
    } else {
      if ($feathers) {
        await $feathers.service('inventory').create(payload)
      } else {
        items.value.unshift({ id: 'item_' + Date.now(), ...payload })
      }
      toast.success('Producto Registrado', 'Nuevo insumo agregado a la farmacia.')
    }
    showItemModal.value = false
    await loadInventory()
  } catch (err: any) {
    console.error('Error saving item:', err)
    toast.error('Error al Guardar', err.message || 'No se pudo guardar el producto.')
  } finally {
    saving.value = false
  }
}

const confirmDeleteItem = async (item: any) => {
  if (confirm(`¿Estás seguro de eliminar "${item.name}" del inventario?`)) {
    try {
      if ($feathers) {
        await $feathers.service('inventory').remove(item.id)
      } else {
        items.value = items.value.filter(i => i.id !== item.id)
      }
      toast.success('Producto Eliminado', 'El ítem ha sido removido del catálogo.')
      await loadInventory()
    } catch (err: any) {
      toast.error('Error al Eliminar', err.message || 'No se pudo eliminar el producto.')
    }
  }
}

const openMovementModal = (item) => {
  selectedMovementItem.value = item
  formMovement.item_id = item ? item.id : ''
  formMovement.type = 'in_purchase'
  formMovement.quantity = 1
  formMovement.reason = ''
  showMovementModal.value = true
}

const saveMovement = async () => {
  saving.value = true
  try {
    const targetItemId = selectedMovementItem.value ? selectedMovementItem.value.id : formMovement.item_id
    if (!targetItemId) {
      throw new Error('Selecciona un producto')
    }

    if ($feathers) {
      await $feathers.service('inventory-movements').create({
        item_id: targetItemId,
        type: formMovement.type,
        quantity: Number(formMovement.quantity),
        reason: formMovement.reason.trim()
      })
    } else {
      const it = items.value.find(i => i.id === targetItemId)
      if (it) {
        const qty = Number(formMovement.quantity) || 0
        if (formMovement.type === 'in_purchase') it.stock_current += qty
        else it.stock_current = Math.max(0, it.stock_current - qty)
      }
    }

    toast.success('Movimiento Registrado', 'El stock de farmacia ha sido actualizado.')
    showMovementModal.value = false
    await loadInventory()
  } catch (err: any) {
    toast.error('Error de Movimiento', err.message || 'No se pudo procesar el ajuste de stock.')
  } finally {
    saving.value = false
  }
}

const handleExportCsv = () => {
  const headers = ['SKU', 'Nombre', 'Categoria', 'Presentacion', 'Stock Actual', 'Stock Minimo', 'Costo USD', 'Precio Venta USD', 'Lote', 'Vencimiento', 'Ubicacion']
  const rows = items.value.map(i => [
    i.sku,
    `"${(i.name || '').replace(/"/g, '""')}"`,
    i.category,
    i.presentation,
    i.stock_current,
    i.stock_min,
    i.cost_price,
    i.sale_price,
    i.lot_number || '',
    i.expiry_date ? i.expiry_date.substring(0, 10) : '',
    `"${(i.location || '').replace(/"/g, '""')}"`
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `Inventario_MedVet_${new Date().toISOString().substring(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.admin-inventory-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.admin-h-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.admin-eyebrow-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.admin-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-mint, #10b981);
}

.admin-live-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  font-size: 0.7rem;
  font-weight: 600;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.admin-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-text, #0f172a);
}

.admin-subtitle {
  font-size: 0.875rem;
  color: var(--color-muted, #64748b);
  max-width: 600px;
}

.admin-header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.1rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}

.btn-primary:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.9rem;
  border-radius: 0.5rem;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e2e8f0);
  color: var(--color-text, #0f172a);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-ghost:hover {
  background: var(--color-bg-hover, #f8fafc);
  border-color: #cbd5e1;
}

/* KPI GRID */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.kpi-box {
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e2e8f0);
  padding: 1.25rem;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  transition: all 0.2s;
}

.kpi-box--alert {
  border-color: rgba(245, 158, 11, 0.4);
  background: linear-gradient(to bottom, rgba(245, 158, 11, 0.03), var(--color-surface, #ffffff));
}

.kpi-lbl {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-muted, #64748b);
  letter-spacing: 0.03em;
}

.kpi-amount {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-text, #0f172a);
}

.kpi-note {
  font-size: 0.75rem;
  color: var(--color-muted, #94a3b8);
}

/* FILTER CARD */
.filter-card {
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-categories {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.cat-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 9999px;
  background: var(--color-bg-muted, #f1f5f9);
  border: 1px solid transparent;
  color: var(--color-muted, #64748b);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.cat-tab-btn:hover {
  background: #e2e8f0;
}

.cat-tab-btn--active {
  background: #10b981;
  color: white;
}

.cat-badge {
  padding: 0.1rem 0.4rem;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.1);
  font-size: 0.7rem;
}

.cat-tab-btn--active .cat-badge {
  background: rgba(255, 255, 255, 0.25);
  color: white;
}

.filter-search-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.search-input-wrap {
  position: relative;
  flex: 1;
  min-width: 260px;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.875rem;
  color: #94a3b8;
}

.search-input {
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 2.25rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border, #e2e8f0);
  background: var(--color-surface, #ffffff);
  color: var(--color-text, #0f172a);
  font-size: 0.875rem;
}

.clear-search {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border, #e2e8f0);
  background: var(--color-surface, #ffffff);
  color: var(--color-text, #0f172a);
  font-size: 0.875rem;
}

/* TABLE */
.inventory-table-container {
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 0.75rem;
  overflow-x: auto;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;
}

.inventory-table th {
  padding: 0.75rem 1rem;
  background: var(--color-bg-muted, #f8fafc);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-muted, #64748b);
  border-bottom: 1px solid var(--color-border, #e2e8f0);
}

.inventory-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--color-border, #f1f5f9);
  vertical-align: middle;
}

.inventory-table tr:hover {
  background: var(--color-bg-hover, #f8fafc);
}

.sku-pill {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.45rem;
  border-radius: 0.35rem;
  background: var(--color-bg-muted, #f1f5f9);
  color: var(--color-text, #334155);
}

.product-info-cell {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.product-name {
  font-weight: 700;
  color: var(--color-text, #0f172a);
}

.product-presentation {
  font-size: 0.75rem;
  color: var(--color-muted, #64748b);
}

.rx-tag {
  align-self: flex-start;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.1rem 0.35rem;
  border-radius: 0.25rem;
  background: #fee2e2;
  color: #dc2626;
  margin-top: 0.15rem;
}

.category-pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  background: #f1f5f9;
  color: #475569;
}

.category-pill--medicamentos { background: #e0e7ff; color: #4338ca; }
.category-pill--vacunas { background: #dcfce7; color: #15803d; }
.category-pill--insumos_clinicos { background: #fef3c7; color: #b45309; }
.category-pill--anestesia { background: #cffafe; color: #0e7490; }
.category-pill--alimentos_especiales { background: #fce7f3; color: #be185d; }

.location-text {
  font-size: 0.75rem;
  color: var(--color-muted, #64748b);
}

.stock-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 100px;
}

.stock-num-row {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
}

.stock-current {
  font-size: 1rem;
}

.stock-min-label {
  font-size: 0.7rem;
  color: #94a3b8;
}

.stock-bar-bg {
  width: 100%;
  height: 5px;
  border-radius: 9999px;
  background: var(--color-bg-muted, #e2e8f0);
  overflow: hidden;
}

.stock-bar-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.expiry-cell {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-size: 0.75rem;
}

.lot-number {
  color: var(--color-muted, #64748b);
}

.exp-badge {
  font-size: 0.65rem;
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
  background: #fef3c7;
  color: #b45309;
  font-weight: 700;
  margin-left: 0.25rem;
}

.price-cell {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.sale-price {
  font-weight: 700;
  color: #10b981;
}

.cost-price {
  font-size: 0.7rem;
  color: #94a3b8;
}

.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 0.35rem;
}

.action-btn {
  padding: 0.3rem 0.5rem;
  border-radius: 0.35rem;
  border: 1px solid var(--color-border, #e2e8f0);
  background: var(--color-surface, #ffffff);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn--move {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #15803d;
  font-weight: 700;
}

.action-btn--move:hover {
  background: #dcfce7;
}

.action-btn--edit:hover {
  background: #f1f5f9;
}

.action-btn--delete:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

/* MODAL STYLES */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-card {
  background: var(--color-surface, #ffffff);
  border-radius: 0.85rem;
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--color-border, #e2e8f0);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--color-text, #0f172a);
}

.modal-sub {
  font-size: 0.8rem;
  color: var(--color-muted, #64748b);
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  color: #94a3b8;
  cursor: pointer;
}

.modal-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.full-width {
  grid-column: span 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-lbl {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text, #334155);
}

.req {
  color: #ef4444;
}

.form-input, .form-select, .form-textarea {
  padding: 0.55rem 0.75rem;
  border-radius: 0.45rem;
  border: 1px solid var(--color-border, #cbd5e1);
  background: var(--color-surface, #ffffff);
  color: var(--color-text, #0f172a);
  font-size: 0.875rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text, #334155);
  cursor: pointer;
}

.resulting-stock-box {
  padding: 0.55rem 0.75rem;
  border-radius: 0.45rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
  font-weight: 800;
  font-size: 0.95rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.table-loading, .table-empty {
  padding: 3rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-muted, #64748b);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(16, 185, 129, 0.2);
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .full-width {
    grid-column: span 1;
  }
}
</style>
