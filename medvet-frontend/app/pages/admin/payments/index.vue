<template>
  <div class="admin-payments-page">

    <!-- Header -->
    <div class="admin-h-row">
      <div>
        <div class="admin-eyebrow-row">
          <span class="admin-eyebrow">Administración Contable & Cobranzas</span>
          <span class="admin-live-badge">
            <span class="live-dot"></span>
            Caja Abierta (Turno Mañana/Tarde)
          </span>
        </div>
        <h1 class="admin-title">Facturación & Control de Caja</h1>
        <p class="admin-subtitle">
          Arqueo de ingresos en tiempo real, emisión de comprobantes fiscales y gestión de cobros en mostrador.
        </p>
      </div>

      <div class="admin-header-actions">
        <button type="button" @click="handleExportExcel" class="btn-ghost">
          <span>📊</span>
          <span>Exportar a Excel</span>
        </button>
        <button type="button" @click="handlePrintReport" class="btn-ghost">
          <span>🖨️</span>
          <span>Imprimir Reporte</span>
        </button>
        <button type="button" @click="showNewInvoiceModal = true" class="btn-primary">
          <span>＋</span>
          <span>Emitir Factura / Recibo</span>
        </button>
      </div>
    </div>

    <!-- Revenue KPIs -->
    <div class="kpi-grid">
      <div class="kpi-box">
        <span class="kpi-lbl">Recaudación de Hoy</span>
        <span class="kpi-amount font-mono-numbers text-mint">${{ todayRevenue.toLocaleString() }}</span>
        <span class="kpi-note">13 transacciones registradas</span>
      </div>

      <div class="kpi-box">
        <span class="kpi-lbl">MercadoPago / QR & Tarjetas</span>
        <span class="kpi-amount font-mono-numbers">${{ (todayRevenue * 0.50).toLocaleString() }}</span>
        <span class="kpi-note">50% del volumen del día</span>
      </div>

      <div class="kpi-box">
        <span class="kpi-lbl">Cashea (3 Cuotas sin Interés)</span>
        <span class="kpi-amount font-mono-numbers text-amber-500">${{ (todayRevenue * 0.35).toLocaleString() }}</span>
        <span class="kpi-note">35% del volumen en cuotas</span>
      </div>

      <div class="kpi-box">
        <span class="kpi-lbl">Efectivo / Transferencia</span>
        <span class="kpi-amount font-mono-numbers">${{ (todayRevenue * 0.15).toLocaleString() }}</span>
        <span class="kpi-note">15% del volumen del día</span>
      </div>
    </div>

    <!-- Invoices Ledger Panel -->
    <div class="ledger-panel">
      <div class="ledger-header">
        <div>
          <h2 class="section-title">Comprobantes Emitidos en la Jornada</h2>
          <p class="section-sub">Listado de cobros y facturas oficiales vinculadas a turnos clínicos</p>
        </div>

        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por cliente, paciente o número..."
          class="ledger-search font-mono-numbers"
        />
      </div>

      <div class="table-wrap">
        <table class="ledger-table">
          <thead>
            <tr>
              <th>Nº Factura</th>
              <th>Hora</th>
              <th>Cliente / Tutor</th>
              <th>Paciente</th>
              <th>Concepto</th>
              <th>Medio de Cobro</th>
              <th>Importe</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in filteredTransactions" :key="tx.id">
              <td class="font-mono-numbers font-bold">{{ tx.code }}</td>
              <td class="font-mono-numbers">{{ tx.time }}</td>
              <td>{{ tx.tutor }}</td>
              <td>🐾 {{ tx.pet }}</td>
              <td class="font-semibold">{{ tx.concept }}</td>
              <td>{{ tx.method }}</td>
              <td class="font-mono-numbers font-bold text-mint">${{ tx.amount.toLocaleString() }}</td>
              <td>
                <span class="paid-badge">Acreditado</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Emitir Factura -->
    <div v-if="showNewInvoiceModal" class="modal-backdrop" @click.self="showNewInvoiceModal = false">
      <div class="modal-box">
        <div class="modal-header">
          <div>
            <span class="modal-eyebrow">Punto de Venta MedVet</span>
            <h2 class="modal-title">Emitir Comprobante</h2>
          </div>
          <button @click="showNewInvoiceModal = false" class="modal-close-btn">✕</button>
        </div>

        <form @submit.prevent="handleCreateInvoice" class="modal-form">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Tutor / Cliente</label>
              <input v-model="newTx.tutor" type="text" placeholder="Ej. Juan Pérez" class="form-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">Paciente</label>
              <input v-model="newTx.pet" type="text" placeholder="Ej. Thor" class="form-input" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Concepto / Servicio Prestado</label>
            <input v-model="newTx.concept" type="text" placeholder="Ej. Consulta Médica + Vacuna" class="form-input" required />
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Importe Total ($)</label>
              <input v-model.number="newTx.amount" type="number" placeholder="Ej. 18000" class="form-input font-mono-numbers" required min="1" />
            </div>
            <div class="form-group">
              <label class="form-label">Medio de Cobro</label>
              <select v-model="newTx.method" class="form-input">
                <option value="Cashea (3 Cuotas sin Interés)">Cashea (3 Cuotas sin Interés)</option>
                <option value="MercadoPago / QR">MercadoPago / QR</option>
                <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                <option value="Efectivo en Caja">Efectivo en Caja</option>
                <option value="Transferencia CBU">Transferencia CBU</option>
              </select>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showNewInvoiceModal = false" class="btn-ghost">Cancelar</button>
            <button type="submit" class="btn-primary">✓ Emitir Comprobante</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
  requiresAuth: true,
  requiresAdmin: true
})

const showNewInvoiceModal = ref(false)
const searchQuery = ref('')

const todayRevenue = ref(245000)

const transactions = ref([
  { id: 1, code: 'FAC-B-0001-0004991', time: '08:45', tutor: 'Juan Pérez', pet: 'Thor', concept: 'Consulta Clínica General', method: 'Cashea (3 Cuotas sin Interés)', amount: 15000 },
  { id: 2, code: 'FAC-B-0001-0004992', time: '09:30', tutor: 'Carla Morales', pet: 'Luna', concept: 'Vacunación Triple Felina', method: 'Tarjeta de Débito', amount: 17500 },
  { id: 3, code: 'FAC-B-0001-0004993', time: '10:20', tutor: 'Martín Rossi', pet: 'Rocky', concept: 'Ecografía Abdominal Completa', method: 'Transferencia CBU', amount: 28000 },
  { id: 4, code: 'FAC-B-0001-0004994', time: '11:15', tutor: 'Sofía Álvarez', pet: 'Simba', concept: 'Consulta Dermatológica + Medicación', method: 'MercadoPago / QR', amount: 26000 },
  { id: 5, code: 'FAC-B-0001-0004995', time: '12:00', tutor: 'Diego Fernández', pet: 'Coco', concept: 'Vacunación Antirrábica Obligatoria', method: 'Efectivo en Caja', amount: 12000 },
  { id: 6, code: 'FAC-B-0001-0004996', time: '12:45', tutor: 'Luciana Gómez', pet: 'Milo', concept: 'Perfil Bioquímico Completo', method: 'Cashea (3 Cuotas sin Interés)', amount: 32000 }
])

const newTx = reactive({
  tutor: '',
  pet: '',
  concept: '',
  amount: null,
  method: 'Cashea (3 Cuotas sin Interés)'
})

const filteredTransactions = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return transactions.value
  return transactions.value.filter(t =>
    t.code.toLowerCase().includes(q) ||
    t.tutor.toLowerCase().includes(q) ||
    t.pet.toLowerCase().includes(q) ||
    t.concept.toLowerCase().includes(q)
  )
})

const handleCreateInvoice = () => {
  const now = new Date()
  const tx = {
    id: Date.now(),
    code: `FAC-B-0001-000${Math.floor(5000 + Math.random() * 1000)}`,
    time: now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    tutor: newTx.tutor,
    pet: newTx.pet,
    concept: newTx.concept,
    method: newTx.method,
    amount: Number(newTx.amount) || 15000
  }
  transactions.value.unshift(tx)
  todayRevenue.value += tx.amount
  showNewInvoiceModal.value = false
  Object.assign(newTx, { tutor: '', pet: '', concept: '', amount: null, method: 'Cashea (3 Cuotas sin Interés)' })
}

const handleExportExcel = () => {
  const columns = [
    { key: 'code', label: 'Nº Factura' },
    { key: 'time', label: 'Hora' },
    { key: 'tutor', label: 'Cliente / Tutor' },
    { key: 'pet', label: 'Paciente' },
    { key: 'concept', label: 'Concepto / Servicio' },
    { key: 'method', label: 'Medio de Cobro' },
    { key: 'amount', label: 'Importe ($)', formatter: (v) => `$${Number(v).toLocaleString()}` }
  ]
  exportToExcel(transactions.value, columns, 'Facturacion_Diaria_MedVet')
}

const handlePrintReport = () => {
  if (typeof window !== 'undefined') window.print()
}
</script>

<style scoped>
.admin-payments-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 3rem;
}

.admin-h-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.admin-eyebrow-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
.admin-eyebrow { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #00a86b; }
.dark .admin-eyebrow { color: #00f59b; }

.admin-live-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(0, 245, 155, 0.12);
  color: #00a86b;
}
.dark .admin-live-badge { color: #00f59b; }
.live-dot { width: 6px; height: 6px; border-radius: 50%; background: #00f59b; box-shadow: 0 0 6px #00f59b; }

.admin-title {
  font-family: var(--font-display);
  font-size: clamp(1.85rem, 3vw, 2.35rem);
  font-weight: 800;
  color: var(--color-ink-900);
  margin: 0 0 0.35rem;
}
.dark .admin-title { color: #f1faf5; }
.admin-subtitle { font-size: 0.9375rem; color: var(--color-ink-500); margin: 0; }
.dark .admin-subtitle { color: #8ca395; }

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}
@media (max-width: 960px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px) { .kpi-grid { grid-template-columns: 1fr; } }

.kpi-box {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 20px;
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.dark .kpi-box { background: #0a110e; border-color: rgba(0, 245, 155, 0.15); }
.kpi-lbl { font-size: 0.6875rem; text-transform: uppercase; color: var(--color-ink-400); font-weight: 600; }
.kpi-amount { font-family: var(--font-display); font-size: 1.75rem; font-weight: 800; color: var(--color-ink-900); }
.dark .kpi-amount { color: #f1faf5; }
.text-mint { color: #00a86b; }
.dark .text-mint { color: #00f59b; }
.kpi-note { font-size: 0.72rem; color: var(--color-ink-500); }
.dark .kpi-note { color: #8ca395; }

/* Ledger */
.ledger-panel {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 24px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 10px 30px -8px rgba(0, 80, 50, 0.06);
}
.dark .ledger-panel { background: #0a110e; border-color: rgba(0, 245, 155, 0.16); box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.7); }

.ledger-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-cream-200);
}
.dark .ledger-header { border-bottom-color: rgba(0, 245, 155, 0.12); }

.section-title { font-family: var(--font-display); font-size: 1.1875rem; font-weight: 700; color: var(--color-ink-900); margin: 0; }
.dark .section-title { color: #f1faf5; }
.section-sub { font-size: 0.8125rem; color: var(--color-ink-500); margin: 0.2rem 0 0; }
.dark .section-sub { color: #8ca395; }

.ledger-search {
  padding: 0.5rem 0.85rem;
  border-radius: 12px;
  border: 1px solid var(--color-cream-300);
  background: var(--color-cream-100);
  font-size: 0.8125rem;
  outline: none;
  min-width: 260px;
}
.dark .ledger-search { background: rgba(16, 28, 22, 0.7); border-color: rgba(0, 245, 155, 0.2); color: #f1faf5; }

.table-wrap { overflow-x: auto; }

.ledger-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.8125rem;
}
.ledger-table th { padding: 0.75rem 1rem; font-size: 0.6875rem; text-transform: uppercase; color: var(--color-ink-400); border-bottom: 1px solid var(--color-cream-200); }
.dark .ledger-table th { border-bottom-color: rgba(0, 245, 155, 0.15); }
.ledger-table td { padding: 1rem; border-bottom: 1px solid var(--color-cream-200); color: var(--color-ink-800); }
.dark .ledger-table td { border-bottom-color: rgba(0, 245, 155, 0.1); color: #d6e8de; }

.paid-badge { font-size: 0.68rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 999px; background: rgba(0, 168, 107, 0.12); color: #007a4d; }
.dark .paid-badge { background: rgba(0, 245, 155, 0.15); color: #00f59b; }

/* Modal */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); z-index: 99; display: flex; align-items: center; justify-content: center; padding: 1.5rem; backdrop-filter: blur(4px); }
.modal-box { background: var(--color-cream-50); border: 1.5px solid var(--color-cream-300); border-radius: 24px; width: 100%; max-width: 520px; padding: 2rem; }
.dark .modal-box { background: #0a110e; border-color: rgba(0, 245, 155, 0.25); }
.modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; }
.modal-eyebrow { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #00a86b; }
.dark .modal-eyebrow { color: #00f59b; }
.modal-title { font-family: var(--font-display); font-size: 1.35rem; font-weight: 800; color: var(--color-ink-900); margin: 0.2rem 0 0; }
.dark .modal-title { color: #f1faf5; }
.modal-close-btn { background: transparent; border: none; font-size: 1.25rem; color: var(--color-ink-400); cursor: pointer; }

.modal-form { display: flex; flex-direction: column; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.35rem; }
.form-label { font-size: 0.78rem; font-weight: 600; color: var(--color-ink-700); }
.dark .form-label { color: #d6e8de; }
.form-input { padding: 0.65rem 0.85rem; border-radius: 12px; border: 1.5px solid var(--color-cream-300); background: var(--color-cream-100); font-size: 0.84rem; color: var(--color-ink-900); outline: none; }
.dark .form-input { background: rgba(16, 28, 22, 0.7); border-color: rgba(0, 245, 155, 0.2); color: #f1faf5; }
.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; }
.modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; }
</style>
