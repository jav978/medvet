<template>
  <div class="payments-page">
    <div class="payments-glow-ambient"></div>

    <div class="payments-inner">

      <!-- Header -->
      <div class="payments-header">
        <div>
          <div class="payments-badge-row">
            <span class="payments-eyebrow">Gestión Contable & Facturación</span>
            <span class="payments-ssl-chip">
              <span class="ssl-dot"></span>
              Pagos Seguros 256-Bit SSL
            </span>
          </div>
          <h1 class="payments-title">Mis Pagos & Facturas Electrónicas</h1>
          <p class="payments-subtitle">
            Consultá tus comprobantes fiscales, saldos pendientes y aboná consultas con MercadoPago, transferencia o tarjeta.
          </p>
        </div>

        <div class="payments-header-actions">
          <NuxtLink to="/dashboard" class="btn-ghost btn-sm">
            ← Volver al Panel
          </NuxtLink>
        </div>
      </div>

      <!-- Quick Summary Cards -->
      <div class="summary-cards-grid">
        <div class="sum-card">
          <span class="sum-lbl">Total Facturado 2026</span>
          <span class="sum-val font-mono-numbers">${{ totalSpent.toLocaleString() }}</span>
          <span class="sum-sub">4 comprobantes emitidos</span>
        </div>

        <div class="sum-card">
          <span class="sum-lbl">Aranceles Pendientes</span>
          <span class="sum-val sum-val--pending font-mono-numbers">${{ pendingAmount.toLocaleString() }}</span>
          <span class="sum-sub">{{ pendingInvoices.length }} consulta pendiente</span>
        </div>

        <div class="sum-card">
          <span class="sum-lbl">Método Preferido</span>
          <span class="sum-val font-display">MercadoPago / QR</span>
          <span class="sum-sub">Descuento 5% en clínica</span>
        </div>
      </div>

      <!-- Pending Payments Alert (if any) -->
      <div v-if="pendingInvoices.length" class="pending-banner">
        <div class="pending-banner-left">
          <span class="pending-icon">💳</span>
          <div>
            <h2 class="pending-title">Tenés 1 arancel pendiente de pago</h2>
            <p class="pending-desc">
              Consulta Dermatológica de Thor del 22/01/2026 por <strong>${{ pendingAmount.toLocaleString() }}</strong>.
            </p>
          </div>
        </div>
        <button type="button" @click="openCheckout(pendingInvoices[0])" class="btn-amber btn-sm">
          Pagar Ahora →
        </button>
      </div>

      <!-- Invoices & Receipts Table -->
      <div class="invoices-panel">
        <div class="panel-top">
          <div>
            <h2 class="panel-title">Historial de Comprobantes & Recibos</h2>
            <p class="panel-sub">Facturas electrónicas oficiales válidas ante AFIP/DGI</p>
          </div>
          <div class="panel-actions">
            <button type="button" @click="handleExportExcel" class="btn-ghost btn-sm">
              <span>📊</span>
              <span>Exportar a Excel</span>
            </button>
          </div>
        </div>

        <div class="table-wrap">
          <table class="invoices-table">
            <thead>
              <tr>
                <th>Nº Comprobante</th>
                <th>Fecha</th>
                <th>Concepto / Paciente</th>
                <th>Método de Pago</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inv in invoicesList" :key="inv.id">
                <td class="font-mono-numbers font-bold">{{ inv.code }}</td>
                <td class="font-mono-numbers">{{ inv.date }}</td>
                <td>
                  <strong class="inv-service">{{ inv.service }}</strong>
                  <div class="inv-pet">🐾 {{ inv.petName }}</div>
                </td>
                <td>{{ inv.paymentMethod }}</td>
                <td class="font-mono-numbers font-bold text-mint">${{ inv.amount.toLocaleString() }}</td>
                <td>
                  <span :class="['status-badge', inv.status === 'paid' ? 'status-badge--paid' : 'status-badge--pending']">
                    {{ inv.status === 'paid' ? 'Abonado' : 'Pendiente' }}
                  </span>
                </td>
                <td>
                  <button
                    v-if="inv.status === 'paid'"
                    type="button"
                    @click="handlePrintInvoice(inv)"
                    class="btn-ghost btn-xs"
                  >
                    📄 Factura
                  </button>
                  <button
                    v-else
                    type="button"
                    @click="openCheckout(inv)"
                    class="btn-primary btn-xs"
                  >
                    💳 Pagar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Modal Checkout de Pago -->
    <div v-if="showCheckoutModal" class="modal-backdrop" @click.self="showCheckoutModal = false">
      <div class="modal-box">
        <div class="modal-header">
          <div>
            <span class="modal-eyebrow">Checkout Seguro MedVet</span>
            <h2 class="modal-title">Abonar Consulta</h2>
          </div>
          <button @click="showCheckoutModal = false" class="modal-close-btn">✕</button>
        </div>

        <div class="checkout-summary">
          <div class="chk-row">
            <span>Concepto:</span>
            <strong>{{ activeInvoice?.service }}</strong>
          </div>
          <div class="chk-row">
            <span>Paciente:</span>
            <span>🐾 {{ activeInvoice?.petName }}</span>
          </div>
          <div class="chk-row chk-row--total font-mono-numbers">
            <span>Total a Pagar:</span>
            <span class="text-mint">${{ activeInvoice?.amount.toLocaleString() }}</span>
          </div>
        </div>

        <!-- Payment Method Options -->
        <div class="payment-methods">
          <label
            v-for="pm in paymentMethods"
            :key="pm.id"
            :class="['pm-option', selectedPaymentMethod === pm.id ? 'pm-option--active' : '']"
          >
            <input
              type="radio"
              :value="pm.id"
              v-model="selectedPaymentMethod"
              class="pm-radio"
            />
            <span class="pm-icon">{{ pm.icon }}</span>
            <div class="pm-info">
              <strong class="pm-name">{{ pm.name }}</strong>
              <span class="pm-desc">{{ pm.desc }}</span>
            </div>
          </label>
        </div>

        <!-- Cashea Breakdown Box -->
        <div v-if="selectedPaymentMethod === 'cashea'" class="cashea-breakdown-box">
          <div class="cashea-header">
            <div class="cashea-logo-badge">
              <span class="cashea-c">C</span>
              <strong>cashea</strong>
            </div>
            <span class="cashea-badge-0">0% INTERÉS · 3 CUOTAS</span>
          </div>
          <p class="cashea-desc">
            Aboná la inicial hoy y 3 cuotas quincenales sin interés a través de la App Cashea:
          </p>
          <div class="cashea-schedule font-mono-numbers">
            <div class="cashea-row cashea-row--initial">
              <span>Pago Inicial Hoy (40%):</span>
              <strong>${{ Math.round((activeInvoice?.amount || 0) * 0.4).toLocaleString() }}</strong>
            </div>
            <div class="cashea-row">
              <span>Cuota 1 (en 14 días):</span>
              <span>${{ Math.round(((activeInvoice?.amount || 0) * 0.6) / 3).toLocaleString() }}</span>
            </div>
            <div class="cashea-row">
              <span>Cuota 2 (en 28 días):</span>
              <span>${{ Math.round(((activeInvoice?.amount || 0) * 0.6) / 3).toLocaleString() }}</span>
            </div>
            <div class="cashea-row">
              <span>Cuota 3 (en 42 días):</span>
              <span>${{ Math.round(((activeInvoice?.amount || 0) * 0.6) / 3).toLocaleString() }}</span>
            </div>
          </div>
          <div class="cashea-code-group">
            <label class="cashea-label">Código de Orden Cashea / App:</label>
            <input
              v-model="casheaCode"
              type="text"
              placeholder="Ej. CSH-8842-109"
              class="form-input font-mono-numbers"
            />
          </div>
        </div>

        <!-- Transfer CBU details if transfer chosen -->
        <div v-if="selectedPaymentMethod === 'transfer'" class="transfer-box font-mono-numbers">
          <div class="tf-row"><span>CBU:</span> <strong>0000003100012345678901</strong></div>
          <div class="tf-row"><span>Alias:</span> <strong>MEDVET.CLINICA.OFICIAL</strong></div>
          <div class="tf-row"><span>Titular:</span> <strong>MedVet SRL (CUIT 30-71234567-9)</strong></div>
        </div>

        <div class="modal-actions">
          <button type="button" @click="showCheckoutModal = false" class="btn-ghost">Cancelar</button>
          <button type="button" @click="handleProcessPayment" class="btn-primary" :disabled="processingPayment">
            <span v-if="processingPayment">Procesando...</span>
            <span v-else>✓ Confirmar Pago</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  requiresAuth: true
})

const showCheckoutModal = ref(false)
const activeInvoice = ref(null)
const selectedPaymentMethod = ref('cashea')
const casheaCode = ref('')
const processingPayment = ref(false)

const invoicesList = ref([
  {
    id: 1,
    code: 'FAC-B-0001-0004821',
    date: '10/06/2026',
    service: 'Perfil Bioquímico & Sangre',
    petName: 'Thor',
    paymentMethod: 'MercadoPago / QR',
    amount: 22000,
    status: 'paid'
  },
  {
    id: 2,
    code: 'FAC-B-0001-0004110',
    date: '15/04/2026',
    service: 'Vacunación Triple Felina',
    petName: 'Luna',
    paymentMethod: 'Tarjeta de Débito',
    amount: 17500,
    status: 'paid'
  },
  {
    id: 3,
    code: 'FAC-B-0001-0003990',
    date: '15/03/2026',
    service: 'Vacunación Séxtuple Canina',
    petName: 'Thor',
    paymentMethod: 'Transferencia CBU',
    amount: 18000,
    status: 'paid'
  },
  {
    id: 4,
    code: 'FAC-B-0001-0004995',
    date: '22/01/2026',
    service: 'Consulta Dermatológica Especializada',
    petName: 'Thor',
    paymentMethod: 'Pendiente de Pago',
    amount: 15000,
    status: 'pending'
  }
])

const paymentMethods = [
  { id: 'cashea', icon: '💛', name: 'Cashea · Paga en 3 Cuotas sin Interés', desc: 'Inicial hoy (40%) y 3 cuotas quincenales a 0% interés' },
  { id: 'mp', icon: '📱', name: 'MercadoPago / QR Dinámico', desc: 'Débito, crédito o dinero en cuenta' },
  { id: 'card', icon: '💳', name: 'Tarjeta de Crédito / Débito', desc: 'Visa, Mastercard, Cabal' },
  { id: 'transfer', icon: '🏦', name: 'Transferencia Bancaria', desc: 'Acreditación instantánea por CBU/Alias' }
]

const totalSpent = computed(() => {
  return invoicesList.value.filter(i => i.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0)
})

const pendingInvoices = computed(() => invoicesList.value.filter(i => i.status === 'pending'))
const pendingAmount = computed(() => pendingInvoices.value.reduce((acc, curr) => acc + curr.amount, 0))

const openCheckout = (inv) => {
  activeInvoice.value = inv
  showCheckoutModal.value = true
}

const handleProcessPayment = () => {
  processingPayment.value = true
  setTimeout(() => {
    processingPayment.value = false
    if (activeInvoice.value) {
      activeInvoice.value.status = 'paid'
      activeInvoice.value.paymentMethod = selectedPaymentMethod.value === 'cashea'
        ? 'Cashea (3 Cuotas sin Interés)'
        : (paymentMethods.find(m => m.id === selectedPaymentMethod.value)?.name || 'MercadoPago / QR')
    }
    showCheckoutModal.value = false
    alert('¡Pago acreditado correctamente! Tu factura electrónica ha sido emitida con membrete oficial.')
  }, 1000)
}

const handlePrintInvoice = (inv) => {
  if (typeof window !== 'undefined') window.print()
}

const handleExportExcel = () => {
  const columns = [
    { key: 'code', label: 'Nº Comprobante' },
    { key: 'date', label: 'Fecha' },
    { key: 'service', label: 'Concepto / Servicio' },
    { key: 'petName', label: 'Paciente' },
    { key: 'paymentMethod', label: 'Método de Pago' },
    { key: 'amount', label: 'Importe ($)', formatter: (v) => `$${Number(v).toLocaleString()}` },
    { key: 'status', label: 'Estado', formatter: (v) => v === 'paid' ? 'Abonado' : 'Pendiente' }
  ]
  exportToExcel(invoicesList.value, columns, 'Mis_Facturas_MedVet')
}
</script>

<style scoped>
.payments-page {
  position: relative;
  min-height: 85vh;
  padding: 3.5rem 1.5rem 6rem;
  background-color: var(--color-cream-100);
  overflow: hidden;
}

.dark .payments-page {
  background-color: #040706;
}

.payments-glow-ambient {
  position: absolute;
  top: -140px;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 420px;
  background: radial-gradient(ellipse 800px 350px at 50% 0%, rgba(0, 245, 155, 0.16) 0%, rgba(0, 168, 107, 0.04) 50%, transparent 80%);
  filter: blur(40px);
  pointer-events: none;
  z-index: 0;
}

.payments-inner {
  position: relative;
  z-index: 1;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 2.5vw, 2.5rem);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header */
.payments-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.payments-badge-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.payments-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #00a86b;
}

.dark .payments-eyebrow { color: #00f59b; }

.payments-ssl-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(0, 168, 107, 0.1);
  color: #007a4d;
}

.dark .payments-ssl-chip {
  background: rgba(0, 245, 155, 0.12);
  color: #00f59b;
}

.ssl-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00f59b;
}

.payments-title {
  font-family: var(--font-display);
  font-size: clamp(1.85rem, 3.5vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--color-ink-900);
  margin: 0 0 0.4rem;
}

.dark .payments-title { color: #f1faf5; }

.payments-subtitle {
  font-size: 0.9375rem;
  color: var(--color-ink-500);
  margin: 0;
  max-width: 620px;
}

.dark .payments-subtitle { color: #cbd5e1; }

/* Summary Cards */
.summary-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

@media (max-width: 768px) { .summary-cards-grid { grid-template-columns: 1fr; } }

.sum-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  box-shadow: 0 8px 24px -6px rgba(0, 80, 50, 0.05);
}

.dark .sum-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.15);
}

.sum-lbl { font-size: 0.72rem; text-transform: uppercase; color: var(--color-ink-400); font-weight: 600; }
.sum-val { font-size: 1.85rem; font-weight: 800; color: #00a86b; }
.dark .sum-val { color: #00f59b; }
.sum-val--pending { color: var(--color-joy-tangerine); }
.sum-sub { font-size: 0.72rem; color: var(--color-ink-500); }
.dark .sum-sub { color: #cbd5e1; }

/* Pending Banner */
.pending-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.65rem;
  border-radius: 20px;
  background: rgba(255, 122, 0, 0.1);
  border: 1.5px solid rgba(255, 122, 0, 0.3);
  flex-wrap: wrap;
  gap: 1rem;
}

.pending-banner-left { display: flex; align-items: center; gap: 1rem; }
.pending-icon { font-size: 1.75rem; }
.pending-title { font-family: var(--font-display); font-size: 0.9375rem; font-weight: 700; color: var(--color-ink-900); margin: 0; }
.dark .pending-title { color: #f1faf5; }
.pending-desc { font-size: 0.8125rem; color: var(--color-ink-600); margin: 0.15rem 0 0; }
.dark .pending-desc { color: #d6e8de; }

/* Invoices Panel */
.invoices-panel {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 24px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 10px 30px -8px rgba(0, 80, 50, 0.06);
}

.dark .invoices-panel {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.16);
  box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.7);
}

.panel-title { font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; color: var(--color-ink-900); margin: 0; }
.dark .panel-title { color: #f1faf5; }
.panel-sub { font-size: 0.78rem; color: var(--color-ink-500); margin: 0.15rem 0 0; }
.dark .panel-sub { color: #cbd5e1; }

.table-wrap { overflow-x: auto; }

.invoices-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.8125rem;
}

.invoices-table th {
  padding: 0.75rem 1rem;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-ink-400);
  border-bottom: 1px solid var(--color-cream-200);
}

.dark .invoices-table th { border-bottom-color: rgba(0, 245, 155, 0.15); }

.invoices-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--color-cream-200);
  color: var(--color-ink-800);
}

.dark .invoices-table td {
  border-bottom-color: rgba(0, 245, 155, 0.1);
  color: #d6e8de;
}

.inv-service { color: var(--color-ink-900); font-size: 0.84rem; }
.dark .inv-service { color: #f1faf5; }
.inv-pet { font-size: 0.72rem; color: var(--color-ink-400); margin-top: 0.1rem; }

.text-mint { color: #00a86b; }
.dark .text-mint { color: #00f59b; }

.status-badge {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
}

.status-badge--paid {
  background: rgba(0, 168, 107, 0.12);
  color: #007a4d;
}

.dark .status-badge--paid {
  background: rgba(0, 245, 155, 0.15);
  color: #00f59b;
}

.status-badge--pending {
  background: rgba(255, 122, 0, 0.15);
  color: var(--color-joy-tangerine);
}

/* Checkout Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  backdrop-filter: blur(4px);
}

.modal-box {
  background: var(--color-cream-50);
  border: 1.5px solid var(--color-cream-300);
  border-radius: 24px;
  width: 100%;
  max-width: 520px;
  padding: 2rem;
  box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.dark .modal-box {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.25);
}

.modal-header { display: flex; justify-content: space-between; align-items: flex-start; }
.modal-eyebrow { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #00a86b; }
.dark .modal-eyebrow { color: #00f59b; }
.modal-title { font-family: var(--font-display); font-size: 1.35rem; font-weight: 800; color: var(--color-ink-900); margin: 0.2rem 0 0; }
.dark .modal-title { color: #f1faf5; }
.modal-close-btn { background: transparent; border: none; font-size: 1.25rem; color: var(--color-ink-400); cursor: pointer; }

.checkout-summary {
  background: var(--color-cream-100);
  border-radius: 14px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  font-size: 0.8125rem;
}

.dark .checkout-summary { background: rgba(16, 28, 22, 0.6); }

.chk-row { display: flex; justify-content: space-between; color: var(--color-ink-700); }
.dark .chk-row { color: #d6e8de; }
.chk-row--total { font-size: 1rem; font-weight: 800; padding-top: 0.4rem; border-top: 1px dashed var(--color-cream-300); }
.dark .chk-row--total { border-top-color: rgba(0, 245, 155, 0.15); }

.payment-methods { display: flex; flex-direction: column; gap: 0.65rem; }

.pm-option {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-100);
  cursor: pointer;
  transition: all 0.15s;
}

.pm-option--active {
  border-color: #00a86b;
  background: rgba(0, 168, 107, 0.08);
}

.dark .pm-option {
  background: rgba(16, 28, 22, 0.6);
  border-color: rgba(0, 245, 155, 0.15);
}

.dark .pm-option--active {
  border-color: #00f59b;
  background: rgba(0, 245, 155, 0.12);
}

.pm-radio { accent-color: #00f59b; }
.pm-icon { font-size: 1.4rem; }
.pm-info { display: flex; flex-direction: column; }
.pm-name { font-size: 0.84rem; color: var(--color-ink-900); }
.dark .pm-name { color: #f1faf5; }
.pm-desc { font-size: 0.68rem; color: var(--color-ink-400); }

.transfer-box {
  background: rgba(0, 168, 107, 0.08);
  border: 1px solid rgba(0, 168, 107, 0.2);
  border-radius: 12px;
  padding: 0.75rem;
  font-size: 0.72rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dark .transfer-box {
  background: rgba(0, 245, 155, 0.08);
  border-color: rgba(0, 245, 155, 0.2);
}

.tf-row { display: flex; justify-content: space-between; }

/* Cashea Breakdown Styling */
.cashea-breakdown-box {
  background: #fffbeb;
  border: 1.5px solid #f59e0b;
  border-radius: 14px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dark .cashea-breakdown-box {
  background: #191407;
  border-color: rgba(245, 158, 11, 0.4);
}

.cashea-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cashea-logo-badge {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 1.05rem;
  color: #d97706;
}

.cashea-c {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: #f59e0b;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 0.8rem;
}

.cashea-badge-0 {
  font-size: 0.65rem;
  font-weight: 800;
  background: #fef3c7;
  color: #92400e;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.dark .cashea-badge-0 {
  background: #291f05;
  color: #fcd34d;
}

.cashea-desc {
  font-size: 0.75rem;
  color: #78350f;
  margin: 0;
  line-height: 1.35;
}

.dark .cashea-desc { color: #fde68a; }

.cashea-schedule {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.7);
  padding: 0.65rem;
  border-radius: 10px;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.dark .cashea-schedule {
  background: rgba(0, 0, 0, 0.3);
}

.cashea-row {
  display: flex;
  justify-content: space-between;
  color: #451a03;
}

.dark .cashea-row { color: #fef3c7; }

.cashea-row--initial {
  font-weight: 800;
  color: #b45309;
  border-bottom: 1px dashed rgba(245, 158, 11, 0.3);
  padding-bottom: 0.3rem;
  margin-bottom: 0.15rem;
}

.dark .cashea-row--initial { color: #fbbf24; }

.cashea-code-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.cashea-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #78350f;
}

.dark .cashea-label { color: #fcd34d; }

.modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; }
</style>
