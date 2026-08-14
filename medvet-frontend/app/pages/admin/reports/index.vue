<template>
  <div class="admin-reports-page">

    <!-- Top Header -->
    <div class="reports-header no-print">
      <div>
        <div class="reports-eyebrow-row">
          <span class="reports-eyebrow">Auditoría Clínica & Contable</span>
          <span class="reports-period-badge">
            <span class="period-dot"></span>
            Período Fiscal Activo 2026
          </span>
        </div>
        <h1 class="reports-title">Centro de Reportería Oficial</h1>
        <p class="reports-subtitle">
          Exportación de libros de facturación, libro de guardia, registro de pacientes atendidos y estadísticas médicas con membrete institucional.
        </p>
      </div>

      <div class="reports-header-actions">
        <button type="button" @click="handleExportActiveExcel" class="btn-ghost">
          <span>📊</span>
          <span>Exportar a Excel (.csv)</span>
        </button>
        <button type="button" @click="openPrintModal" class="btn-primary">
          <span>🖨️</span>
          <span>Imprimir / PDF con Membrete</span>
        </button>
      </div>
    </div>

    <!-- Period & Category Filter Bar -->
    <div class="filter-card no-print">
      <div class="filter-left">
        <div class="tab-group">
          <button
            type="button"
            @click="activeTab = 'invoices'"
            :class="['tab-btn', activeTab === 'invoices' ? 'tab-btn--active' : '']"
          >
            <span>💳</span>
            <span>Facturación & Cobranzas</span>
            <span class="tab-count">{{ invoicesList.length }}</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'patients'"
            :class="['tab-btn', activeTab === 'patients' ? 'tab-btn--active' : '']"
          >
            <span>🐶</span>
            <span>Pacientes & Perros Atendidos</span>
            <span class="tab-count">{{ patientsList.length }}</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'cashea'"
            :class="['tab-btn', activeTab === 'cashea' ? 'tab-btn--active' : '']"
          >
            <span>💛</span>
            <span>Financiamiento Cashea</span>
            <span class="tab-count">{{ casheaList.length }}</span>
          </button>
        </div>
      </div>

      <div class="filter-right">
        <select v-model="selectedPeriod" class="filter-select font-mono-numbers">
          <option value="today">Hoy (14/08/2026)</option>
          <option value="week">Esta Semana</option>
          <option value="month">Mes Actual (Agosto 2026)</option>
          <option value="quarter">Trimestre Q3</option>
          <option value="year">Año Completo 2026</option>
        </select>
      </div>
    </div>

    <!-- Summary KPIs for active view -->
    <div class="kpi-grid no-print">
      <div v-if="activeTab === 'invoices'" class="kpi-box">
        <span class="kpi-lbl">Total Facturado Bruto</span>
        <span class="kpi-val font-mono-numbers text-mint">${{ totalInvoiced.toLocaleString() }}</span>
        <span class="kpi-sub">IVA 21% Desglosado: ${{ Math.round(totalInvoiced * 0.21).toLocaleString() }}</span>
      </div>

      <div v-if="activeTab === 'invoices'" class="kpi-box">
        <span class="kpi-lbl">Cobros con Cashea (3 Cuotas)</span>
        <span class="kpi-val font-mono-numbers text-amber-500">${{ totalCashea.toLocaleString() }}</span>
        <span class="kpi-sub">35% de operaciones en cuotas sin interés</span>
      </div>

      <div v-if="activeTab === 'invoices'" class="kpi-box">
        <span class="kpi-lbl">MercadoPago, QR & Tarjetas</span>
        <span class="kpi-val font-mono-numbers">${{ totalElectronic.toLocaleString() }}</span>
        <span class="kpi-sub">Comprobantes fiscales AFIP Tipo B</span>
      </div>

      <div v-if="activeTab === 'patients'" class="kpi-box">
        <span class="kpi-lbl">Total Pacientes Atendidos</span>
        <span class="kpi-val font-mono-numbers text-mint">{{ patientsList.length }}</span>
        <span class="kpi-sub">{{ dogCount }} Caninos · {{ catCount }} Felinos</span>
      </div>

      <div v-if="activeTab === 'patients'" class="kpi-box">
        <span class="kpi-lbl">Intervenciones Quirúrgicas & Guardia</span>
        <span class="kpi-val font-mono-numbers text-amber-500">8</span>
        <span class="kpi-sub">Guardia médica activa 24 horas</span>
      </div>

      <div v-if="activeTab === 'patients'" class="kpi-box">
        <span class="kpi-lbl">Vacunaciones Oficiales</span>
        <span class="kpi-val font-mono-numbers">14</span>
        <span class="kpi-sub">Antirrábica, Séxtuple y Trivalente</span>
      </div>

      <div v-if="activeTab === 'cashea'" class="kpi-box">
        <span class="kpi-lbl">Monto Financiado Cashea</span>
        <span class="kpi-val font-mono-numbers text-amber-500">${{ totalCashea.toLocaleString() }}</span>
        <span class="kpi-sub">Cuotas sin interés a 14, 28 y 42 días</span>
      </div>

      <div v-if="activeTab === 'cashea'" class="kpi-box">
        <span class="kpi-lbl">Iniciales Cobradas en Mostrador</span>
        <span class="kpi-val font-mono-numbers text-mint">${{ Math.round(totalCashea * 0.4).toLocaleString() }}</span>
        <span class="kpi-sub">40% inicial acreditada de inmediato</span>
      </div>

      <div v-if="activeTab === 'cashea'" class="kpi-box">
        <span class="kpi-lbl">Cuotas a Cobrar por Plataforma</span>
        <span class="kpi-val font-mono-numbers">${{ Math.round(totalCashea * 0.6).toLocaleString() }}</span>
        <span class="kpi-sub">Garantizadas por pasarela Cashea</span>
      </div>
    </div>

    <!-- Active Table View -->
    <div class="report-table-panel no-print">

      <!-- Table 1: Invoices -->
      <div v-if="activeTab === 'invoices'" class="table-wrap">
        <div class="panel-header-row">
          <h2 class="table-title">Libro de Ventas & Comprobantes Fiscales</h2>
          <span class="table-counter font-mono-numbers">{{ invoicesList.length }} registros</span>
        </div>
        <table class="report-table">
          <thead>
            <tr>
              <th>Nº Factura</th>
              <th>Fecha / Hora</th>
              <th>Cliente / Tutor</th>
              <th>Paciente</th>
              <th>Concepto / Servicio</th>
              <th>Medio de Pago</th>
              <th>Subtotal</th>
              <th>IVA (21%)</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inv in invoicesList" :key="inv.code">
              <td class="font-mono-numbers font-bold">{{ inv.code }}</td>
              <td class="font-mono-numbers">{{ inv.date }} {{ inv.time }}</td>
              <td>{{ inv.tutor }}</td>
              <td>🐾 {{ inv.pet }}</td>
              <td class="font-semibold">{{ inv.concept }}</td>
              <td>
                <span :class="['method-tag', inv.method.includes('Cashea') ? 'method-tag--cashea' : '']">
                  {{ inv.method }}
                </span>
              </td>
              <td class="font-mono-numbers">${{ Math.round(inv.amount / 1.21).toLocaleString() }}</td>
              <td class="font-mono-numbers text-ink-500">${{ Math.round(inv.amount - (inv.amount / 1.21)).toLocaleString() }}</td>
              <td class="font-mono-numbers font-bold text-mint">${{ inv.amount.toLocaleString() }}</td>
              <td><span class="badge-success">Emitida</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table 2: Patients Attended -->
      <div v-if="activeTab === 'patients'" class="table-wrap">
        <div class="panel-header-row">
          <h2 class="table-title">Registro Clínico de Perros & Pacientes Atendidos</h2>
          <span class="table-counter font-mono-numbers">{{ patientsList.length }} pacientes</span>
        </div>
        <table class="report-table">
          <thead>
            <tr>
              <th>Nº H.C.</th>
              <th>Fecha / Hora</th>
              <th>Paciente</th>
              <th>Especie / Raza</th>
              <th>Microchip ISO</th>
              <th>Tutor / Teléfono</th>
              <th>Motivo de Atención</th>
              <th>Diagnóstico / Tratamiento</th>
              <th>Veterinario Tratante</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in patientsList" :key="p.hc">
              <td class="font-mono-numbers font-bold">{{ p.hc }}</td>
              <td class="font-mono-numbers">{{ p.date }} {{ p.time }}</td>
              <td>
                <strong>{{ p.pet }}</strong>
              </td>
              <td>{{ p.species }} · {{ p.breed }}</td>
              <td class="font-mono-numbers text-mint">{{ p.chip }}</td>
              <td>
                <div>{{ p.tutor }}</div>
                <small class="text-ink-400 font-mono-numbers">{{ p.phone }}</small>
              </td>
              <td>{{ p.reason }}</td>
              <td class="font-semibold">{{ p.diagnosis }}</td>
              <td>{{ p.vet }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table 3: Cashea BNPL -->
      <div v-if="activeTab === 'cashea'" class="table-wrap">
        <div class="panel-header-row">
          <h2 class="table-title">Operaciones Financiadas con Cashea (0% Interés)</h2>
          <span class="table-counter font-mono-numbers">{{ casheaList.length }} órdenes</span>
        </div>
        <table class="report-table">
          <thead>
            <tr>
              <th>Código Cashea</th>
              <th>Fecha</th>
              <th>Tutor</th>
              <th>Paciente</th>
              <th>Servicio Médico</th>
              <th>Monto Total</th>
              <th>Pago Inicial (40%)</th>
              <th>3 Cuotas Quincenales</th>
              <th>Estado Cashea</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in casheaList" :key="c.code">
              <td class="font-mono-numbers font-bold text-amber-500">{{ c.code }}</td>
              <td class="font-mono-numbers">{{ c.date }}</td>
              <td>{{ c.tutor }}</td>
              <td>🐾 {{ c.pet }}</td>
              <td class="font-semibold">{{ c.service }}</td>
              <td class="font-mono-numbers font-bold">${{ c.amount.toLocaleString() }}</td>
              <td class="font-mono-numbers text-mint font-bold">${{ Math.round(c.amount * 0.4).toLocaleString() }}</td>
              <td class="font-mono-numbers">3 x ${{ Math.round((c.amount * 0.6) / 3).toLocaleString() }}</td>
              <td><span class="badge-cashea">Aprobado / Al Día</span></td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- ────────────────────────────────────────
         PRINT / PDF MODAL & MEMBRETE OFICIAL
    ──────────────────────────────────────── -->
    <div v-if="showPrintModal" class="print-modal-backdrop" @click.self="showPrintModal = false">
      <div class="print-modal-box">

        <!-- Toolbar (Hidden on print) -->
        <div class="print-toolbar no-print">
          <div class="toolbar-info">
            <span class="t-icon">📑</span>
            <div>
              <h3 class="t-title">Reporte Clínico Institucional Listo para Imprimir / PDF</h3>
              <p class="t-sub">Con membrete legal, resumen de auditoría y firmas colegiadas</p>
            </div>
          </div>
          <div class="toolbar-btns">
            <button type="button" @click="handlePrintAction" class="btn-primary">
              <span>🖨️</span>
              <span>Imprimir / Guardar en PDF</span>
            </button>
            <button type="button" @click="showPrintModal = false" class="btn-ghost">✕ Cerrar</button>
          </div>
        </div>

        <!-- Official Printable Document -->
        <div id="official-report-document" class="printable-report-sheet">

          <!-- Clinic Official Letterhead -->
          <div class="official-letterhead">
            <div class="letterhead-brand-col">
              <div class="brand-badge-box">
                <span class="brand-plus">✚</span>
                <span class="brand-txt">MEDVET</span>
              </div>
              <div class="brand-legal-info">
                <h2 class="clinic-full-name">HOSPITAL & CENTRO CLÍNICO VETERINARIO MEDVET SRL</h2>
                <p class="clinic-subtext">Dirección General de Sanidad Animal · Habilitación SENASA Nº 48-1902</p>
                <p class="clinic-subtext">CUIT: 30-71829012-4 · Guardia 24 Horas: +54 11 1234-5678 · Av. Libertador 4580, CABA</p>
              </div>
            </div>
            <div class="letterhead-doc-meta">
              <span class="report-meta-tag">INFORME OFICIAL DE AUDITORÍA</span>
              <span class="report-meta-num font-mono-numbers">REP-2026-{{ Math.floor(1000 + Math.random() * 9000) }}</span>
              <span class="report-meta-date">Fecha de Emisión: {{ currentDateFormatted }}</span>
            </div>
          </div>

          <!-- Document Title & Period Banner -->
          <div class="report-title-strip">
            <h3 class="strip-title">
              {{ activeTab === 'invoices' ? 'LIBRO DE FACTURACIÓN, VENTAS & RECAUDACIÓN' : (activeTab === 'patients' ? 'REGISTRO CLÍNICO DE PACIENTES ATENDIDOS' : 'INFORME DE FINANCIAMIENTO EN CUOTAS CASHEA') }}
            </h3>
            <span class="strip-period">Período: Agosto 2026 · Ejercicio Activo</span>
          </div>

          <!-- Summary Highlights Table -->
          <div class="report-stats-grid">
            <div class="stat-cell">
              <span class="stat-label">TOTAL OPERACIONES</span>
              <strong class="stat-val font-mono-numbers">{{ activeTab === 'invoices' ? invoicesList.length : (activeTab === 'patients' ? patientsList.length : casheaList.length) }}</strong>
            </div>
            <div class="stat-cell" v-if="activeTab === 'invoices' || activeTab === 'cashea'">
              <span class="stat-label">TOTAL FACTURADO</span>
              <strong class="stat-val font-mono-numbers">${{ (activeTab === 'invoices' ? totalInvoiced : totalCashea).toLocaleString() }}</strong>
            </div>
            <div class="stat-cell" v-if="activeTab === 'patients'">
              <span class="stat-label">ESPECIES ATENDIDAS</span>
              <strong class="stat-val font-mono-numbers">{{ dogCount }} Caninos / {{ catCount }} Felinos</strong>
            </div>
            <div class="stat-cell">
              <span class="stat-label">ESTADO DE AUDITORÍA</span>
              <strong class="stat-val text-mint">CONFORME / AL DÍA</strong>
            </div>
          </div>

          <!-- The Printable Table -->
          <table class="official-print-table" v-if="activeTab === 'invoices'">
            <thead>
              <tr>
                <th>Nº Comprobante</th>
                <th>Fecha</th>
                <th>Tutor / Cliente</th>
                <th>Paciente</th>
                <th>Concepto</th>
                <th>Medio de Cobro</th>
                <th>Importe Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inv in invoicesList" :key="inv.code">
                <td class="font-mono-numbers">{{ inv.code }}</td>
                <td class="font-mono-numbers">{{ inv.date }}</td>
                <td>{{ inv.tutor }}</td>
                <td>{{ inv.pet }}</td>
                <td>{{ inv.concept }}</td>
                <td>{{ inv.method }}</td>
                <td class="font-mono-numbers font-bold text-right">${{ inv.amount.toLocaleString() }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="6" class="text-right font-bold">TOTAL GENERAL RECAUDADO:</td>
                <td class="font-mono-numbers font-bold text-right">${{ totalInvoiced.toLocaleString() }}</td>
              </tr>
            </tfoot>
          </table>

          <!-- Patients Printable Table -->
          <table class="official-print-table" v-else-if="activeTab === 'patients'">
            <thead>
              <tr>
                <th>H.C.</th>
                <th>Fecha</th>
                <th>Paciente</th>
                <th>Especie / Raza</th>
                <th>Tutor</th>
                <th>Motivo / Diagnóstico</th>
                <th>Veterinario</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in patientsList" :key="p.hc">
                <td class="font-mono-numbers">{{ p.hc }}</td>
                <td class="font-mono-numbers">{{ p.date }}</td>
                <td><strong>{{ p.pet }}</strong></td>
                <td>{{ p.species }} ({{ p.breed }})</td>
                <td>{{ p.tutor }}</td>
                <td>{{ p.diagnosis }}</td>
                <td>{{ p.vet }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Cashea Printable Table -->
          <table class="official-print-table" v-else>
            <thead>
              <tr>
                <th>Código Cashea</th>
                <th>Fecha</th>
                <th>Tutor</th>
                <th>Paciente</th>
                <th>Concepto</th>
                <th>Monto Total</th>
                <th>Inicial 40%</th>
                <th>3 Cuotas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in casheaList" :key="c.code">
                <td class="font-mono-numbers">{{ c.code }}</td>
                <td class="font-mono-numbers">{{ c.date }}</td>
                <td>{{ c.tutor }}</td>
                <td>{{ c.pet }}</td>
                <td>{{ c.service }}</td>
                <td class="font-mono-numbers font-bold">${{ c.amount.toLocaleString() }}</td>
                <td class="font-mono-numbers">${{ Math.round(c.amount * 0.4).toLocaleString() }}</td>
                <td class="font-mono-numbers">3x ${{ Math.round((c.amount * 0.6) / 3).toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Signatures and Professional Stamps -->
          <div class="official-signatures-row">
            <div class="sig-col">
              <div class="sig-line"></div>
              <span class="sig-name">Dr. Mateo Silva</span>
              <span class="sig-title">Director Médico Veterinario · MP 4821</span>
              <span class="sig-inst">Hospital Central MedVet</span>
            </div>

            <div class="sig-stamp-col">
              <div class="official-stamp-circle">
                <span>MEDVET</span>
                <small>AUDITORÍA</small>
                <span>OFICIAL</span>
              </div>
            </div>

            <div class="sig-col">
              <div class="sig-line"></div>
              <span class="sig-name">Lic. Valeria Gómez</span>
              <span class="sig-title">Jefa de Administración & Tesorería</span>
              <span class="sig-inst">Registro Contable Nº 8912</span>
            </div>
          </div>

          <!-- Document Footer Legal Notice -->
          <div class="official-doc-footer">
            <p>Documento emitido con validez legal según la normativa de ejercicio de la Medicina Veterinaria y facturación fiscal electrónica. En caso de requerir verificación de firma digital o consultar el historial completo, ingrese a <strong>https://medvet.com/verify</strong>.</p>
          </div>

        </div>

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

const activeTab = ref('invoices')
const selectedPeriod = ref('month')
const showPrintModal = ref(false)

const currentDateFormatted = computed(() => {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
})

// Mock Invoices Dataset
const invoicesList = ref([
  { code: 'FAC-B-0001-0004991', date: '14/08/2026', time: '08:45', tutor: 'Juan Pérez', pet: 'Thor', concept: 'Consulta Clínica General', method: 'Cashea (3 Cuotas)', amount: 15000 },
  { code: 'FAC-B-0001-0004992', date: '14/08/2026', time: '09:30', tutor: 'Carla Morales', pet: 'Luna', concept: 'Vacunación Triple Felina', method: 'Tarjeta de Débito', amount: 17500 },
  { code: 'FAC-B-0001-0004993', date: '14/08/2026', time: '10:20', tutor: 'Martín Rossi', pet: 'Rocky', concept: 'Ecografía Abdominal Completa', method: 'Transferencia CBU', amount: 28000 },
  { code: 'FAC-B-0001-0004994', date: '14/08/2026', time: '11:15', tutor: 'Sofía Álvarez', pet: 'Simba', concept: 'Consulta Dermatológica + Medicación', method: 'MercadoPago / QR', amount: 26000 },
  { code: 'FAC-B-0001-0004995', date: '14/08/2026', time: '12:00', tutor: 'Diego Fernández', pet: 'Coco', concept: 'Vacunación Antirrábica Obligatoria', method: 'Efectivo en Caja', amount: 12000 },
  { code: 'FAC-B-0001-0004996', date: '14/08/2026', time: '12:45', tutor: 'Luciana Gómez', pet: 'Milo', concept: 'Perfil Bioquímico Completo & Sangre', method: 'Cashea (3 Cuotas)', amount: 32000 },
  { code: 'FAC-B-0001-0004997', date: '13/08/2026', time: '15:10', tutor: 'Gonzalo Varela', pet: 'Baco', concept: 'Cirugía Limpieza Dental por Ultrasonido', method: 'Cashea (3 Cuotas)', amount: 45000 },
  { code: 'FAC-B-0001-0004998', date: '13/08/2026', time: '16:40', tutor: 'Mariana Castro', pet: 'Kira', concept: 'Radiografía Digital de Tórax (2 vistas)', method: 'Tarjeta de Crédito', amount: 24000 }
])

// Mock Patients Dataset
const patientsList = ref([
  { hc: 'HC-00481', date: '14/08/2026', time: '08:45', pet: 'Thor', species: 'Canino', breed: 'Golden Retriever', chip: 'AR-98214-998', tutor: 'Juan Pérez', phone: '+54 11 9842-1100', reason: 'Control rutinario', diagnosis: 'Paciente sano, estado nutricional óptimo', vet: 'Dr. Mateo Silva (MP 4821)' },
  { hc: 'HC-00482', date: '14/08/2026', time: '09:30', pet: 'Luna', species: 'Felino', breed: 'Siamés', chip: 'AR-33910-104', tutor: 'Carla Morales', phone: '+54 11 7712-4499', reason: 'Inmunización anual', diagnosis: 'Triple Felina aplicada sin reacciones adversas', vet: 'Dra. Camila Torres (MP 5190)' },
  { hc: 'HC-00483', date: '14/08/2026', time: '10:20', pet: 'Rocky', species: 'Canino', breed: 'Bulldog Francés', chip: 'AR-10492-331', tutor: 'Martín Rossi', phone: '+54 11 4455-8822', reason: 'Dolor abdominal agudo', diagnosis: 'Gastritis moderada. Tratamiento con omeprazol y dieta blanda', vet: 'Dr. Mateo Silva (MP 4821)' },
  { hc: 'HC-00484', date: '14/08/2026', time: '11:15', pet: 'Simba', species: 'Felino', breed: 'Persa', chip: 'AR-88219-550', tutor: 'Sofía Álvarez', phone: '+54 11 6620-3311', reason: 'Prurito y alopecia en lomo', diagnosis: 'Dermatitis alérgica por picadura de pulga (DAPP)', vet: 'Dra. Camila Torres (MP 5190)' },
  { hc: 'HC-00485', date: '14/08/2026', time: '12:00', pet: 'Coco', species: 'Canino', breed: 'Caniche Toy', chip: 'AR-77192-004', tutor: 'Diego Fernández', phone: '+54 11 5590-1122', reason: 'Vacunación antirrábica', diagnosis: 'Vacuna Rabia aplicada. Certificado emitido', vet: 'Dr. Mateo Silva (MP 4821)' },
  { hc: 'HC-00486', date: '14/08/2026', time: '12:45', pet: 'Milo', species: 'Canino', breed: 'Border Collie', chip: 'AR-66401-889', tutor: 'Luciana Gómez', phone: '+54 11 3340-9988', reason: 'Chequeo geriátrico', diagnosis: 'Perfil sanguíneo completo y ecocardio normal', vet: 'Dr. Mateo Silva (MP 4821)' }
])

// Mock Cashea Dataset
const casheaList = ref([
  { code: 'CSH-8842-109', date: '14/08/2026', tutor: 'Juan Pérez', pet: 'Thor', service: 'Consulta Clínica General', amount: 15000 },
  { code: 'CSH-8842-110', date: '14/08/2026', tutor: 'Luciana Gómez', pet: 'Milo', service: 'Perfil Bioquímico Completo', amount: 32000 },
  { code: 'CSH-8842-111', date: '13/08/2026', tutor: 'Gonzalo Varela', pet: 'Baco', service: 'Limpieza Dental por Ultrasonido', amount: 45000 }
])

// Computed Metrics
const totalInvoiced = computed(() => invoicesList.value.reduce((acc, curr) => acc + curr.amount, 0))
const totalCashea = computed(() => casheaList.value.reduce((acc, curr) => acc + curr.amount, 0))
const totalElectronic = computed(() => {
  return invoicesList.value
    .filter(i => !i.method.includes('Cashea') && !i.method.includes('Efectivo'))
    .reduce((acc, curr) => acc + curr.amount, 0)
})

const dogCount = computed(() => patientsList.value.filter(p => p.species === 'Canino').length)
const catCount = computed(() => patientsList.value.filter(p => p.species === 'Felino').length)

// Export Helpers
const handleExportActiveExcel = () => {
  if (activeTab.value === 'invoices') {
    const columns = [
      { key: 'code', label: 'Nº Factura' },
      { key: 'date', label: 'Fecha' },
      { key: 'time', label: 'Hora' },
      { key: 'tutor', label: 'Tutor' },
      { key: 'pet', label: 'Paciente' },
      { key: 'concept', label: 'Concepto / Servicio' },
      { key: 'method', label: 'Medio de Pago' },
      { key: 'amount', label: 'Importe ($)', formatter: (v) => `$${Number(v).toLocaleString()}` }
    ]
    exportToExcel(invoicesList.value, columns, 'Libro_Ventas_Facturacion_MedVet')
  } else if (activeTab.value === 'patients') {
    const columns = [
      { key: 'hc', label: 'Nº Historia Clínica' },
      { key: 'date', label: 'Fecha' },
      { key: 'time', label: 'Hora' },
      { key: 'pet', label: 'Paciente' },
      { key: 'species', label: 'Especie' },
      { key: 'breed', label: 'Raza' },
      { key: 'chip', label: 'Microchip ISO' },
      { key: 'tutor', label: 'Tutor' },
      { key: 'phone', label: 'Teléfono' },
      { key: 'reason', label: 'Motivo' },
      { key: 'diagnosis', label: 'Diagnóstico' },
      { key: 'vet', label: 'Veterinario' }
    ]
    exportToExcel(patientsList.value, columns, 'Pacientes_Atendidos_MedVet')
  } else {
    const columns = [
      { key: 'code', label: 'Código Cashea' },
      { key: 'date', label: 'Fecha' },
      { key: 'tutor', label: 'Tutor' },
      { key: 'pet', label: 'Paciente' },
      { key: 'service', label: 'Servicio' },
      { key: 'amount', label: 'Monto Total ($)', formatter: (v) => `$${Number(v).toLocaleString()}` },
      { key: 'amount', label: 'Pago Inicial 40% ($)', formatter: (v) => `$${Math.round(Number(v) * 0.4).toLocaleString()}` },
      { key: 'amount', label: 'Cuotas Quincenales ($)', formatter: (v) => `3 x $${Math.round((Number(v) * 0.6) / 3).toLocaleString()}` }
    ]
    exportToExcel(casheaList.value, columns, 'Financiamiento_Cashea_MedVet')
  }
}

const openPrintModal = () => {
  showPrintModal.value = true
}

const handlePrintAction = () => {
  if (typeof window !== 'undefined') window.print()
}
</script>

<style scoped>
.admin-reports-page {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  padding-bottom: 4rem;
}

/* Header */
.reports-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.reports-eyebrow-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
}

.reports-eyebrow {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #00a86b;
}

.dark .reports-eyebrow { color: #00f59b; }

.reports-period-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(0, 168, 107, 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #007a4d;
}

.dark .reports-period-badge {
  background: rgba(0, 245, 155, 0.12);
  color: #00f59b;
}

.period-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00a86b;
}

.dark .period-dot { background: #00f59b; }

.reports-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-ink-900);
  margin: 0;
  letter-spacing: -0.02em;
}

.dark .reports-title { color: #f1faf5; }

.reports-subtitle {
  font-size: 0.875rem;
  color: var(--color-ink-500);
  margin: 0.25rem 0 0;
  max-width: 700px;
}

.dark .reports-subtitle { color: #8ca395; }

.reports-header-actions {
  display: flex;
  gap: 0.75rem;
}

/* Filter Card */
.filter-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 0.75rem 1.25rem;
  border-radius: 16px;
  border: 1px solid #e2ebe5;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
}

.dark .filter-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.15);
}

.tab-group {
  display: flex;
  gap: 0.5rem;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 0.95rem;
  border-radius: 10px;
  background: transparent;
  border: 1px solid transparent;
  color: var(--color-ink-600);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dark .tab-btn { color: #8ca395; }

.tab-btn:hover {
  background: #f4f7f5;
  color: var(--color-ink-900);
}

.dark .tab-btn:hover {
  background: #111d17;
  color: #f1faf5;
}

.tab-btn--active {
  background: rgba(0, 168, 107, 0.12);
  border-color: #00a86b;
  color: #007a4d;
  font-weight: 700;
}

.dark .tab-btn--active {
  background: rgba(0, 245, 155, 0.15);
  border-color: #00f59b;
  color: #00f59b;
}

.tab-count {
  background: rgba(0, 0, 0, 0.08);
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
  font-size: 0.7rem;
}

.dark .tab-count { background: rgba(255, 255, 255, 0.1); }

.filter-select {
  padding: 0.5rem 0.85rem;
  border-radius: 10px;
  border: 1px solid #e2ebe5;
  background: #f4f7f5;
  color: var(--color-ink-900);
  font-size: 0.8125rem;
}

.dark .filter-select {
  background: #111d17;
  border-color: rgba(0, 245, 155, 0.2);
  color: #f1faf5;
}

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
}

.kpi-box {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 18px;
  border: 1px solid #e2ebe5;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
}

.dark .kpi-box {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.15);
}

.kpi-lbl {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-ink-400);
}

.dark .kpi-lbl { color: #628070; }

.kpi-val {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-ink-900);
}

.dark .kpi-val { color: #f1faf5; }

.kpi-sub {
  font-size: 0.75rem;
  color: var(--color-ink-500);
}

.dark .kpi-sub { color: #8ca395; }

.text-mint { color: #00a86b; }
.dark .text-mint { color: #00f59b; }

/* Table Panel */
.report-table-panel {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2ebe5;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
}

.dark .report-table-panel {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.15);
}

.panel-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.table-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
}

.dark .table-title { color: #f1faf5; }

.table-counter {
  font-size: 0.78rem;
  font-weight: 700;
  color: #00a86b;
}

.table-wrap { overflow-x: auto; }

.report-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.8125rem;
}

.report-table th {
  padding: 0.85rem 1rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-ink-400);
  border-bottom: 1.5px solid #e2ebe5;
}

.dark .report-table th { border-bottom-color: rgba(0, 245, 155, 0.15); }

.report-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2ebe5;
  color: var(--color-ink-800);
}

.dark .report-table td {
  border-bottom-color: rgba(255, 255, 255, 0.05);
  color: #d6e8de;
}

.method-tag {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.72rem;
  background: #f4f7f5;
  color: var(--color-ink-800);
}

.dark .method-tag {
  background: #111d17;
  color: #d6e8de;
}

.method-tag--cashea {
  background: #fef3c7;
  color: #92400e;
  font-weight: 700;
}

.dark .method-tag--cashea {
  background: #2b2005;
  color: #fcd34d;
}

.badge-success {
  background: rgba(0, 168, 107, 0.12);
  color: #007a4d;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
}

.badge-cashea {
  background: #fef3c7;
  color: #b45309;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
}

/* ────────────────────────────────────────
   PRINT / PDF MODAL & MEMBRETE OFICIAL
──────────────────────────────────────── */
.print-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 7, 6, 0.8);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overflow-y: auto;
}

.print-modal-box {
  background: #f4f7f5;
  border-radius: 20px;
  width: 100%;
  max-width: 980px;
  max-height: 94vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 80px -15px rgba(0, 0, 0, 0.6);
}

.dark .print-modal-box { background: #0a110e; }

.print-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.75rem;
  background: #ffffff;
  border-bottom: 1px solid #e2ebe5;
}

.dark .print-toolbar {
  background: #0d1a14;
  border-color: rgba(0, 245, 155, 0.2);
}

.toolbar-info { display: flex; align-items: center; gap: 0.75rem; }
.t-icon { font-size: 1.75rem; }
.t-title { font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; margin: 0; color: var(--color-ink-900); }
.dark .t-title { color: #f1faf5; }
.t-sub { font-size: 0.8125rem; color: var(--color-ink-500); margin: 0; }
.dark .t-sub { color: #8ca395; }
.toolbar-btns { display: flex; gap: 0.75rem; }

.printable-report-sheet {
  background: #ffffff;
  color: #0d1f18;
  padding: 3rem 2.5rem;
  overflow-y: auto;
  font-family: var(--font-body);
}

/* Official Letterhead */
.official-letterhead {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 1.5rem;
  border-bottom: 2.5px solid #00a86b;
  margin-bottom: 1.5rem;
}

.letterhead-brand-col {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.brand-badge-box {
  background: #00a86b;
  color: #ffffff;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 0.75rem;
  line-height: 1;
}

.brand-plus { font-size: 1.2rem; }

.clinic-full-name {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 900;
  color: #0d1f18;
  margin: 0;
  letter-spacing: -0.02em;
}

.clinic-subtext {
  font-size: 0.75rem;
  color: #4a6858;
  margin: 0.15rem 0 0;
}

.letterhead-doc-meta { text-align: right; }
.report-meta-tag { font-size: 0.6875rem; font-weight: 800; color: #00a86b; display: block; letter-spacing: 0.06em; }
.report-meta-num { font-size: 1.1rem; font-weight: 800; color: #0d1f18; display: block; }
.report-meta-date { font-size: 0.75rem; color: #628070; }

.report-title-strip {
  background: #f0f7f3;
  border-left: 4px solid #00a86b;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.strip-title {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 800;
  color: #0d3826;
  margin: 0;
}

.strip-period { font-size: 0.75rem; font-weight: 700; color: #007a4d; }

.report-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  background: #fafcfb;
  border: 1px solid #e2ebe5;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.stat-cell { display: flex; flex-direction: column; gap: 0.2rem; }
.stat-label { font-size: 0.65rem; font-weight: 800; color: #628070; }
.stat-val { font-size: 1.1rem; font-weight: 800; color: #0d1f18; }

.official-print-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
  margin-bottom: 2.5rem;
}

.official-print-table th {
  background: #f0f7f3;
  padding: 0.65rem 0.75rem;
  text-align: left;
  font-weight: 800;
  color: #0d3826;
  border: 1px solid #d1e2d8;
}

.official-print-table td {
  padding: 0.65rem 0.75rem;
  border: 1px solid #e2ebe5;
  color: #0d1f18;
}

.official-print-table tfoot td {
  background: #f0f7f3;
  padding: 0.75rem;
  border: 1px solid #d1e2d8;
}

.official-signatures-row {
  display: grid;
  grid-template-columns: 1fr 120px 1fr;
  gap: 1rem;
  align-items: center;
  margin-top: 3rem;
  padding-top: 1.5rem;
}

.sig-col { text-align: center; }
.sig-line { width: 160px; height: 1.5px; background: #0d1f18; margin: 0 auto 0.4rem; }
.sig-name { font-size: 0.8125rem; font-weight: 800; color: #0d1f18; display: block; }
.sig-title { font-size: 0.6875rem; color: #4a6858; display: block; }
.sig-inst { font-size: 0.625rem; color: #628070; }

.sig-stamp-col { display: flex; justify-content: center; }

.official-stamp-circle {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: 2px dashed #00a86b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #007a4d;
  font-size: 0.6rem;
  font-weight: 900;
  transform: rotate(-8deg);
}

.official-doc-footer {
  margin-top: 2rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2ebe5;
  font-size: 0.65rem;
  color: #628070;
  line-height: 1.4;
}

/* Print CSS */
@media print {
  body * { visibility: hidden; }
  .print-modal-backdrop,
  #official-report-document,
  #official-report-document * {
    visibility: visible;
  }
  .print-modal-backdrop {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: transparent !important;
    padding: 0 !important;
  }
  .no-print { display: none !important; }
  .print-modal-box {
    max-width: 100% !important;
    background: transparent !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
  .printable-report-sheet {
    padding: 0 !important;
  }
}
</style>
