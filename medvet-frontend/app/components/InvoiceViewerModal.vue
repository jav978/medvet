<template>
  <div v-if="isOpen" class="inv-modal-backdrop" @click.self="$emit('close')">
    <div class="inv-modal-dialog">

      <!-- Action Toolbar (Top) -->
      <div class="inv-modal-toolbar no-print">
        <div class="toolbar-left">
          <span class="toolbar-title font-mono-numbers">🧾 Factura Electrónica {{ invoice?.code }}</span>
          <span :class="['status-pill font-mono-numbers', invoice?.paymentStatus === 'paid' || invoice?.status === 'paid' ? 'status-pill--paid' : 'status-pill--pending']">
            {{ invoice?.paymentStatus === 'paid' || invoice?.status === 'paid' ? '✔ ABONADA / PAGADA' : '⏳ PENDIENTE' }}
          </span>
        </div>

        <div class="toolbar-actions">
          <button type="button" class="btn-action-export btn--print" @click="handlePrint">
            <span>🖨️</span>
            <span>Imprimir / PDF</span>
          </button>
          <button type="button" class="btn-action-export btn--word" @click="handleExportWord">
            <span>📝</span>
            <span>Word (.docx)</span>
          </button>
          <button type="button" class="btn-action-export btn--excel" @click="handleExportExcel">
            <span>📊</span>
            <span>Excel</span>
          </button>
          <button type="button" class="btn-action-export btn--csv" @click="handleExportCsv">
            <span>📑</span>
            <span>CSV</span>
          </button>
          <button type="button" class="btn-close" @click="$emit('close')">✕</button>
        </div>
      </div>

      <!-- Printable Invoice Sheet (A4 Structured Document) -->
      <div class="invoice-sheet" id="printable-invoice-sheet">

        <!-- Header / Membrete Oficial -->
        <div class="sheet-header">
          <div class="clinic-brand">
            <div class="clinic-logo-box">
              <span class="logo-emoji">🐾</span>
              <span class="logo-plus">+</span>
            </div>
            <div>
              <h1 class="clinic-name">CENTRO VETERINARIO INTEGRAL MEDVET 24/7</h1>
              <p class="clinic-fiscal font-mono-numbers">RIF: J-40892145-0 · CUIT: 30-71234567-9 · NIT: 900.412.890-1</p>
              <p class="clinic-address">Av. Las Delicias, Edificio MedVet, Piso 1, Maracay / Caracas</p>
              <p class="clinic-contact font-mono-numbers">Tel: +58 (243) 246-7890 · Emergencias 24h: +58 (412) 123-4567 · facturacion@medvet.app</p>
              <p class="clinic-res font-mono-numbers">Providencia Administrativa SENIAT / AFIP Nº 2026-REG-004921</p>
            </div>
          </div>

          <div class="invoice-fiscal-box">
            <div class="ifb-header">
              <span class="ifb-type-badge font-mono-numbers">FACTURA ELECTRÓNICA "B"</span>
            </div>
            <div class="ifb-body font-mono-numbers">
              <div class="ifb-row">
                <span class="ifb-lbl">Nº FACTURA:</span>
                <strong class="ifb-val ifb-val--code">{{ invoice?.code }}</strong>
              </div>
              <div class="ifb-row">
                <span class="ifb-lbl">FECHA EMISIÓN:</span>
                <span class="ifb-val">{{ invoice?.date }}</span>
              </div>
              <div class="ifb-row">
                <span class="ifb-lbl">HORA EMISIÓN:</span>
                <span class="ifb-val">{{ invoice?.time || '10:30 hs' }}</span>
              </div>
              <div class="ifb-row">
                <span class="ifb-lbl">CÓDIGO CONTROL:</span>
                <span class="ifb-val">0F8A-98C1-E24D</span>
              </div>
            </div>
          </div>
        </div>

        <div class="sheet-divider"></div>

        <!-- Customer & Patient Information Grid -->
        <div class="parties-grid">
          <!-- Client Block -->
          <div class="party-card">
            <div class="party-title-row">
              <span class="party-icon">👤</span>
              <h2 class="party-title">DATOS DEL CLIENTE / TUTOR</h2>
            </div>
            <div class="party-details">
              <div class="detail-row">
                <span class="dt-lbl">Nombre / Razón Social:</span>
                <strong class="dt-val">{{ invoice?.clientName || 'María García' }}</strong>
              </div>
              <div class="detail-row">
                <span class="dt-lbl">Cédula / RIF / DNI:</span>
                <span class="dt-val font-mono-numbers">{{ invoice?.clientDoc || 'V-19.824.551' }}</span>
              </div>
              <div class="detail-row">
                <span class="dt-lbl">Teléfono / Celular:</span>
                <span class="dt-val font-mono-numbers">{{ invoice?.clientPhone || '+58 (412) 345-6789' }}</span>
              </div>
              <div class="detail-row">
                <span class="dt-lbl">Correo Electrónico:</span>
                <span class="dt-val">{{ invoice?.clientEmail || 'client@medvet.com' }}</span>
              </div>
              <div class="detail-row">
                <span class="dt-lbl">Dirección:</span>
                <span class="dt-val">{{ invoice?.clientAddress || 'Urb. Los Olivos, Maracay' }}</span>
              </div>
            </div>
          </div>

          <!-- Patient Block -->
          <div class="party-card">
            <div class="party-title-row">
              <span class="party-icon">🐾</span>
              <h2 class="party-title">DATOS DEL PACIENTE VETERINARIO</h2>
            </div>
            <div class="party-details">
              <div class="detail-row">
                <span class="dt-lbl">Nombre Mascota:</span>
                <strong class="dt-val">🐾 {{ invoice?.petName || 'Thor' }}</strong>
              </div>
              <div class="detail-row">
                <span class="dt-lbl">Especie & Raza:</span>
                <span class="dt-val">{{ invoice?.petSpecies || 'Canino' }} · {{ invoice?.petBreed || 'Golden Retriever' }}</span>
              </div>
              <div class="detail-row">
                <span class="dt-lbl">Microchip ISO 11784:</span>
                <span class="dt-val font-mono-numbers">{{ invoice?.petChip || 'ISO-11784-98214' }}</span>
              </div>
              <div class="detail-row">
                <span class="dt-lbl">Condición de Pago:</span>
                <span class="dt-val font-bold text-mint">{{ invoice?.paymentMethod || 'MercadoPago / Tarjeta' }}</span>
              </div>
              <div class="detail-row">
                <span class="dt-lbl">Estado Tributario:</span>
                <span class="dt-val font-bold">Consumidor Final (Exento IVA Consulta Médica)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="items-table-wrap">
          <table class="items-table">
            <thead>
              <tr>
                <th class="th-code">Código</th>
                <th class="th-desc">Descripción del Servicio / Fármaco / Procedimiento</th>
                <th class="th-qty text-center">Cant.</th>
                <th class="th-price text-right">P. Unitario</th>
                <th class="th-disc text-right">Desc.</th>
                <th class="th-sub text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in formattedItems" :key="idx">
                <td class="td-code font-mono-numbers">{{ item.code }}</td>
                <td class="td-desc">
                  <strong>{{ item.description }}</strong>
                  <span v-if="item.notes" class="td-subnote">{{ item.notes }}</span>
                </td>
                <td class="td-qty text-center font-mono-numbers">{{ item.quantity }}</td>
                <td class="td-price text-right font-mono-numbers">${{ item.unitPrice.toLocaleString() }}</td>
                <td class="td-disc text-right font-mono-numbers">${{ (item.discount || 0).toLocaleString() }}</td>
                <td class="td-sub text-right font-mono-numbers font-bold">${{ item.subtotal.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Financial Summary & QR Fiscal Block -->
        <div class="summary-fiscal-section">
          <!-- Left: QR Validation & Fiscal Seals -->
          <div class="fiscal-seal-box">
            <div class="qr-canvas-wrap">
              <canvas ref="qrCanvasRef" class="qr-img"></canvas>
            </div>
            <div class="fiscal-legal-text font-mono-numbers">
              <p class="flt-bold">✔ COMPROBANTE FISCAL DIGITAL HOMOLOGADO</p>
              <p>CAEA Nº: 88410293810294</p>
              <p>Vto. CAEA: 31/12/2026</p>
              <p class="flt-muted">Escanee el código QR para validar autenticidad en el portal tributario.</p>
            </div>
          </div>

          <!-- Right: Totals Breakdown -->
          <div class="totals-breakdown-card font-mono-numbers">
            <div class="tot-row">
              <span>Subtotal Gravado:</span>
              <strong>${{ calculatedSubtotal.toLocaleString() }}</strong>
            </div>
            <div class="tot-row">
              <span>Subtotal Exento:</span>
              <span>$0.00</span>
            </div>
            <div class="tot-row">
              <span>Base Imponible (IVA 16%):</span>
              <span>${{ calculatedSubtotal.toLocaleString() }}</span>
            </div>
            <div class="tot-row">
              <span>IVA (16%):</span>
              <span>${{ calculatedTax.toLocaleString() }}</span>
            </div>
            <div class="tot-row" v-if="calculatedDiscount > 0">
              <span>Descuento Promocional:</span>
              <span class="text-amber">-${{ calculatedDiscount.toLocaleString() }}</span>
            </div>
            <div class="tot-row tot-row--grand font-bold">
              <span>TOTAL FACTURA (USD):</span>
              <span class="grand-amount text-mint">${{ calculatedTotal.toLocaleString() }}</span>
            </div>
            <div class="tot-row tot-row--local">
              <span>Equivalente en Moneda Local (BCV):</span>
              <span>Bs. {{ (calculatedTotal * 36.5).toLocaleString('es-VE', { minimumFractionDigits: 2 }) }}</span>
            </div>
          </div>
        </div>

        <!-- Footer / Legal Notes -->
        <div class="sheet-footer">
          <div class="footer-terms">
            <p><strong>Observaciones:</strong> Medicamentos no tienen cambio una vez retirados de farmacia veterinaria. Para urgencias 24 horas comunicarse al número oficial de guardia.</p>
            <p>Documento emitido según los requerimientos de facturación electrónica y validación tributaria oficial.</p>
          </div>
          <div class="footer-sign">
            <div class="sign-line"></div>
            <span class="sign-name">Firma y Sello de Caja Autorizada</span>
            <span class="sign-org font-mono-numbers">MEDVET CLINICAL VETCARE</span>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import QRCode from 'qrcode'
import {
  exportInvoiceToDocx,
  exportInvoiceToExcel,
  exportInvoiceToCsv,
  type InvoiceData
} from '~/utils/exportEngine'

const props = defineProps<{
  isOpen: boolean
  invoice: any
}>()

const emit = defineEmits(['close'])

const qrCanvasRef = ref<HTMLCanvasElement | null>(null)

const formattedItems = computed(() => {
  if (props.invoice?.items && Array.isArray(props.invoice.items) && props.invoice.items.length > 0) {
    return props.invoice.items
  }
  // Fallback single item from invoice service name
  const amount = Number(props.invoice?.amount || 22000)
  return [
    {
      code: 'SRV-001',
      description: props.invoice?.service || 'Atención Médica Veterinaria',
      notes: `Paciente: ${props.invoice?.petName || 'Mascota'}`,
      quantity: 1,
      unitPrice: amount,
      discount: 0,
      subtotal: amount
    }
  ]
})

const calculatedSubtotal = computed(() => {
  return formattedItems.value.reduce((acc: number, item: any) => acc + (Number(item.subtotal) || 0), 0)
})

const calculatedTax = computed(() => {
  // 16% IVA
  return Math.round(calculatedSubtotal.value * 0.16)
})

const calculatedDiscount = computed(() => {
  return formattedItems.value.reduce((acc: number, item: any) => acc + (Number(item.discount) || 0), 0)
})

const calculatedTotal = computed(() => {
  return calculatedSubtotal.value + calculatedTax.value - calculatedDiscount.value
})

watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      await nextTick()
      generateQr()
    }
  }
)

function generateQr() {
  if (!qrCanvasRef.value) return
  const qrData = `https://medvet.app/invoices/${props.invoice?.code || 'FAC-2026-0001'}?total=${calculatedTotal.value}&date=${props.invoice?.date || '2026-08-15'}`
  QRCode.toCanvas(qrCanvasRef.value, qrData, {
    width: 90,
    margin: 1,
    color: {
      dark: '#059669',
      light: '#ffffff'
    }
  })
}

function getStructuredInvoiceData(): InvoiceData {
  return {
    code: props.invoice?.code || 'FAC-B-0001-0004821',
    date: props.invoice?.date || new Date().toLocaleDateString('es-ES'),
    time: props.invoice?.time || '10:30 hs',
    clientName: props.invoice?.clientName || 'María García',
    clientDoc: props.invoice?.clientDoc || 'V-19.824.551',
    clientPhone: props.invoice?.clientPhone || '+58 (412) 345-6789',
    clientEmail: props.invoice?.clientEmail || 'client@medvet.com',
    clientAddress: props.invoice?.clientAddress || 'Urb. Los Olivos, Maracay',
    petName: props.invoice?.petName || 'Thor',
    petSpecies: props.invoice?.petSpecies || 'Canino',
    petBreed: props.invoice?.petBreed || 'Golden Retriever',
    petChip: props.invoice?.petChip || 'ISO-11784-98214',
    paymentMethod: props.invoice?.paymentMethod || 'MercadoPago / QR',
    paymentStatus: props.invoice?.status === 'paid' || props.invoice?.paymentStatus === 'paid' ? 'paid' : 'pending',
    items: formattedItems.value,
    subtotal: calculatedSubtotal.value,
    taxPercent: 16,
    taxAmount: calculatedTax.value,
    exemptAmount: 0,
    discountAmount: calculatedDiscount.value,
    total: calculatedTotal.value,
    currency: 'USD'
  }
}

function handlePrint() {
  window.print()
}

async function handleExportWord() {
  const invData = getStructuredInvoiceData()
  await exportInvoiceToDocx(invData)
}

function handleExportExcel() {
  const invData = getStructuredInvoiceData()
  exportInvoiceToExcel(invData)
}

function handleExportCsv() {
  const invData = getStructuredInvoiceData()
  exportInvoiceToCsv(invData)
}
</script>

<style scoped>
.inv-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(2, 6, 4, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem 1rem;
  overflow-y: auto;
}

.inv-modal-dialog {
  width: 100%;
  max-width: 900px;
  background: #ffffff;
  color: #0f172a;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Action Toolbar */
.inv-modal-toolbar {
  background: #0f172a;
  color: #f8fafc;
  padding: 0.875rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toolbar-title {
  font-size: 1rem;
  font-weight: 800;
  color: #f8fafc;
}

.status-pill {
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
}

.status-pill--paid {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.status-pill--pending {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-action-export {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.4rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn--print { background: #059669; color: #ffffff; }
.btn--print:hover { background: #10b981; }

.btn--word { background: #2563eb; color: #ffffff; }
.btn--word:hover { background: #3b82f6; }

.btn--excel { background: #16a34a; color: #ffffff; }
.btn--excel:hover { background: #22c55e; }

.btn--csv { background: #475569; color: #ffffff; }
.btn--csv:hover { background: #64748b; }

.btn-close {
  background: transparent;
  color: #94a3b8;
  border: none;
  font-size: 1.25rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}

.btn-close:hover { color: #ffffff; }

/* Printable A4 Sheet */
.invoice-sheet {
  background: #ffffff;
  color: #0f172a;
  padding: 2.5rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.4;
}

/* Header */
.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
}

.clinic-brand {
  display: flex;
  gap: 1rem;
  max-width: 58%;
}

.clinic-logo-box {
  width: 52px;
  height: 52px;
  background: #059669;
  color: #ffffff;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.logo-emoji { font-size: 1.75rem; }
.logo-plus {
  position: absolute;
  top: 2px;
  right: 4px;
  font-size: 0.875rem;
  font-weight: 900;
  color: #a7f3d0;
}

.clinic-name {
  font-size: 1.125rem;
  font-weight: 900;
  color: #065f46;
  margin: 0 0 0.25rem;
  line-height: 1.2;
}

.clinic-fiscal {
  font-size: 0.75rem;
  font-weight: 700;
  color: #334155;
  margin: 0;
}

.clinic-address, .clinic-contact, .clinic-res {
  font-size: 0.6875rem;
  color: #64748b;
  margin: 0.15rem 0 0;
}

.invoice-fiscal-box {
  background: #f8fafc;
  border: 2px solid #059669;
  border-radius: 0.75rem;
  overflow: hidden;
  width: 250px;
  flex-shrink: 0;
}

.ifb-header {
  background: #059669;
  color: #ffffff;
  text-align: center;
  padding: 0.4rem;
}

.ifb-type-badge {
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.05em;
}

.ifb-body {
  padding: 0.6rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.75rem;
}

.ifb-row {
  display: flex;
  justify-content: space-between;
}

.ifb-lbl { color: #64748b; font-size: 0.6875rem; }
.ifb-val { color: #0f172a; font-weight: 700; }
.ifb-val--code { color: #059669; font-size: 0.875rem; font-weight: 900; }

.sheet-divider {
  height: 2px;
  background: #e2e8f0;
  margin: 1.25rem 0;
}

/* Parties Grid */
.parties-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.party-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.625rem;
  padding: 0.875rem;
}

.party-title-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.6rem;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid #e2e8f0;
}

.party-title {
  font-size: 0.75rem;
  font-weight: 800;
  color: #059669;
  margin: 0;
  text-transform: uppercase;
}

.party-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
}

.dt-lbl { color: #64748b; font-size: 0.6875rem; }
.dt-val { color: #1e293b; text-align: right; }

/* Table */
.items-table-wrap {
  margin-bottom: 1.25rem;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}

.items-table th {
  background: #059669;
  color: #ffffff;
  font-weight: 800;
  padding: 0.6rem 0.75rem;
  text-align: left;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.items-table td {
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
}

.td-desc strong { display: block; }
.td-subnote { font-size: 0.6875rem; color: #64748b; }

.items-table tbody tr:nth-child(even) {
  background: #f8fafc;
}

/* Summary & QR */
.summary-fiscal-section {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.fiscal-seal-box {
  border: 1px dashed #94a3b8;
  border-radius: 0.625rem;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fdfdfd;
}

.qr-canvas-wrap {
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.qr-img {
  width: 100%;
  height: 100%;
}

.fiscal-legal-text {
  font-size: 0.6875rem;
  color: #334155;
  line-height: 1.3;
}

.fiscal-legal-text p { margin: 0 0 0.15rem; }
.flt-bold { font-weight: 800; color: #059669; }
.flt-muted { color: #64748b; font-size: 0.625rem; }

.totals-breakdown-card {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 0.625rem;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.8125rem;
}

.tot-row {
  display: flex;
  justify-content: space-between;
}

.tot-row--grand {
  border-top: 2px solid #059669;
  padding-top: 0.5rem;
  margin-top: 0.25rem;
  font-size: 1rem;
  color: #065f46;
}

.grand-amount {
  font-size: 1.125rem;
  color: #059669;
}

.tot-row--local {
  font-size: 0.6875rem;
  color: #64748b;
  border-top: 1px dotted #cbd5e1;
  padding-top: 0.25rem;
}

/* Footer */
.sheet-footer {
  display: grid;
  grid-template-columns: 1.4fr 0.6fr;
  gap: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  align-items: flex-end;
}

.footer-terms p {
  font-size: 0.6875rem;
  color: #64748b;
  margin: 0 0 0.25rem;
}

.footer-sign {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sign-line {
  width: 140px;
  height: 1px;
  background: #475569;
  margin-bottom: 0.25rem;
}

.sign-name {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #1e293b;
}

.sign-org {
  font-size: 0.625rem;
  color: #059669;
  font-weight: 700;
}

/* Print Optimization */
@media print {
  body * {
    visibility: hidden;
  }
  .inv-modal-backdrop {
    position: absolute;
    inset: 0;
    background: transparent;
    padding: 0;
    margin: 0;
  }
  .inv-modal-dialog {
    box-shadow: none;
    max-width: 100%;
    border-radius: 0;
  }
  .no-print {
    display: none !important;
  }
  #printable-invoice-sheet, #printable-invoice-sheet * {
    visibility: visible;
  }
  #printable-invoice-sheet {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 1.5cm;
    margin: 0;
  }
}
</style>
