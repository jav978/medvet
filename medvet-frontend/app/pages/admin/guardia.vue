<template>
  <div class="guardia-page">
    <div class="guardia-ambient-glow"></div>

    <div class="guardia-container">

      <!-- Header -->
      <div class="guardia-header">
        <div class="header-left">
          <div class="guard-beacon-box">
            <span class="beacon-pulse"></span>
            <span class="beacon-icon">🚨</span>
          </div>
          <div>
            <div class="header-badge-row">
              <span class="badge-guardia">GUARDIA ACTIVA 24/7</span>
              <span class="badge-date font-mono-numbers">{{ currentLiveTime }}</span>
            </div>
            <h1 class="header-title">Tablero Clínico de Guardia y Entrega de Turno</h1>
            <p class="header-sub">Supervisión en tiempo real de pacientes hospitalizados, urgencias y relevo médico</p>
          </div>
        </div>

        <div class="header-actions">
          <button type="button" class="btn-primary" @click="isNewHandoverModalOpen = true">
            📝 Emitir Entrega de Turno
          </button>
          <NuxtLink to="/admin" class="btn-ghost">
            ← Volver al Panel
          </NuxtLink>
        </div>
      </div>

      <!-- Live Shift Stats Counter Strip -->
      <div class="shift-stats-strip font-mono-numbers">
        <div class="stat-box stat-box--hosp">
          <span class="stat-icon">🏥</span>
          <div>
            <span class="stat-num">{{ stats.hospitalized }}</span>
            <span class="stat-lbl">Hospitalizados / Box</span>
          </div>
        </div>

        <div class="stat-box stat-box--urg">
          <span class="stat-icon">🚨</span>
          <div>
            <span class="stat-num">{{ stats.emergencies }}</span>
            <span class="stat-lbl">Urgencias del Turno</span>
          </div>
        </div>

        <div class="stat-box stat-box--surg">
          <span class="stat-icon">🔪</span>
          <div>
            <span class="stat-num">{{ stats.surgeries }}</span>
            <span class="stat-lbl">Cirugías / Quirófano</span>
          </div>
        </div>

        <div class="stat-box stat-box--crit">
          <span class="stat-icon">⚠️</span>
          <div>
            <span class="stat-num">{{ stats.critical }}</span>
            <span class="stat-lbl">Pacientes Críticos</span>
          </div>
        </div>

        <div class="stat-box stat-box--alt">
          <span class="stat-icon">✅</span>
          <div>
            <span class="stat-num">{{ stats.discharges }}</span>
            <span class="stat-lbl">Altas Médicas</span>
          </div>
        </div>
      </div>

      <!-- Main Layout: 2 Columns (Left: On-duty patients & Critical alerts / Right: Shift handovers log) -->
      <div class="guardia-grid">

        <!-- Left Column: Active Hospitalized & Critical Patients -->
        <div class="patients-column">
          <div class="column-header">
            <h2 class="column-title">🐾 Pacientes en Monitoreo Activo</h2>
            <span class="badge-count font-mono-numbers">{{ activePatients.length }} en Sala</span>
          </div>

          <div class="patients-cards-list">
            <div
              v-for="patient in activePatients"
              :key="patient.id"
              class="patient-monitor-card"
              :class="`patient-monitor-card--${patient.status}`"
            >
              <div class="p-card-top">
                <div class="p-id-group">
                  <span class="p-box-badge font-mono-numbers">{{ patient.box }}</span>
                  <div>
                    <h3 class="p-name">{{ patient.name }}</h3>
                    <span class="p-species">{{ patient.species }} · {{ patient.breed }}</span>
                  </div>
                </div>
                <span class="p-status-chip font-mono-numbers" :class="`chip--${patient.status}`">
                  {{ patient.statusLabel }}
                </span>
              </div>

              <!-- Diagnosis & Care Note -->
              <div class="p-diag-box">
                <p class="p-diag-title"><strong>Diagnóstico / Motivo:</strong> {{ patient.diagnosis }}</p>
                <p class="p-care-plan"><strong>Manejo & Terapia:</strong> {{ patient.carePlan }}</p>
              </div>

              <!-- Vitals Row -->
              <div class="p-vitals-strip font-mono-numbers">
                <span>⚖️ {{ patient.weight }} kg</span>
                <span>🌡️ {{ patient.temperature }} °C</span>
                <span>💓 {{ patient.heartRate }} lpm</span>
                <span class="p-vet-tag">👨‍⚕️ {{ patient.doctor }}</span>
              </div>

              <!-- Card Actions -->
              <div class="p-card-actions">
                <NuxtLink :to="`/pets/${patient.id}`" class="btn-action">
                  📋 Ver Historia Clínica
                </NuxtLink>
                <NuxtLink :to="`/carnet/${patient.id}`" target="_blank" class="btn-action">
                  🪪 Carnet QR
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Shift Handover History & Protocol -->
        <div class="handovers-column">
          <div class="column-header">
            <h2 class="column-title">📑 Actas de Entrega de Guardia</h2>
            <span class="badge-count font-mono-numbers">{{ handovers.length }} Registros</span>
          </div>

          <div class="handovers-list">
            <div v-for="ho in handovers" :key="ho.id" class="handover-card">
              <div class="ho-header">
                <div>
                  <span class="ho-type-badge font-mono-numbers">{{ formatShiftType(ho.shift_type) }}</span>
                  <span class="ho-date font-mono-numbers">{{ formatDate(ho.shift_date) }}</span>
                </div>
                <div class="ho-export-actions">
                  <button type="button" class="btn-print-sm" @click="exportHandoverWord(ho)" title="Descargar en Word">
                    📝 Word
                  </button>
                  <button type="button" class="btn-print-sm" @click="exportHandoverExcel(ho)" title="Descargar en Excel">
                    📊 Excel
                  </button>
                  <button type="button" class="btn-print-sm" @click="exportHandoverCsv(ho)" title="Descargar en CSV">
                    📑 CSV
                  </button>
                  <button type="button" class="btn-print-sm" @click="printHandover(ho)" title="Imprimir Parte / PDF">
                    🖨️ PDF
                  </button>
                </div>
              </div>

              <!-- Handover Counts -->
              <div class="ho-counts font-mono-numbers">
                <span>🏥 {{ ho.admitted_patients_count }} Hosp.</span>
                <span>🔪 {{ ho.surgeries_count }} Cirugías</span>
                <span>🚨 {{ ho.emergencies_count }} Urgencias</span>
                <span>✅ {{ ho.discharges_count }} Altas</span>
              </div>

              <!-- Critical Notes -->
              <div class="ho-notes" v-if="ho.critical_patients_notes">
                <span class="ho-lbl">⚠️ Alertas de Pacientes Críticos:</span>
                <p>{{ ho.critical_patients_notes }}</p>
              </div>

              <!-- Pending Tasks -->
              <div class="ho-tasks" v-if="ho.pending_tasks">
                <span class="ho-lbl">📌 Tareas Pendientes para el Relevo:</span>
                <p>{{ ho.pending_tasks }}</p>
              </div>

              <!-- Summary -->
              <div class="ho-summary" v-if="ho.shift_summary">
                <span class="ho-lbl">📝 Resumen General:</span>
                <p>{{ ho.shift_summary }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- New Handover Modal -->
    <div v-if="isNewHandoverModalOpen" class="ho-modal-backdrop" @click.self="isNewHandoverModalOpen = false">
      <div class="ho-modal-dialog">
        <div class="ho-modal-header">
          <h2 class="ho-modal-title">📝 Emitir Acta de Entrega de Guardia</h2>
          <button type="button" class="btn-close" @click="isNewHandoverModalOpen = false">✕</button>
        </div>

        <form @submit.prevent="handleCreateHandover" class="ho-modal-form">
          <div class="form-row form-row--2">
            <div class="form-group">
              <label class="form-label">Tipo de Turno *</label>
              <select v-model="handoverForm.shift_type" class="form-select" required>
                <option value="guardia_24h">🚨 Guardia Completa 24 Horas</option>
                <option value="noche">🌙 Turno Nocturno (20:00 - 08:00)</option>
                <option value="manana">☀️ Turno Mañana (08:00 - 14:00)</option>
                <option value="tarde">🌇 Turno Tarde (14:00 - 20:00)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Fecha del Turno *</label>
              <input v-model="handoverForm.shift_date" type="date" class="form-input" required />
            </div>
          </div>

          <div class="counts-input-grid font-mono-numbers">
            <div class="cnt-card">
              <label>Hospitalizados</label>
              <input v-model.number="handoverForm.admitted_patients_count" type="number" class="cnt-input" />
            </div>
            <div class="cnt-card">
              <label>Cirugías</label>
              <input v-model.number="handoverForm.surgeries_count" type="number" class="cnt-input" />
            </div>
            <div class="cnt-card">
              <label>Urgencias</label>
              <input v-model.number="handoverForm.emergencies_count" type="number" class="cnt-input" />
            </div>
            <div class="cnt-card">
              <label>Altas</label>
              <input v-model.number="handoverForm.discharges_count" type="number" class="cnt-input" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Alertas de Pacientes Críticos</label>
            <textarea
              v-model="handoverForm.critical_patients_notes"
              rows="3"
              class="form-textarea"
              placeholder="Detalle pacientes en cuidados intensivos, soporte vital, vías venosas permeables, medicación de horario estricto..."
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Tareas y Pendientes para el Veterinario Entrante</label>
            <textarea
              v-model="handoverForm.pending_tasks"
              rows="3"
              class="form-textarea"
              placeholder="1. Repetir hematocrito a las 06:00&#10;2. Administrar antibiótico IV a Box 2 a las 04:00&#10;3. Evaluar alta médica de canino Toby al mediodía"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Resumen Ejecutivo del Turno</label>
            <textarea
              v-model="handoverForm.shift_summary"
              rows="2"
              class="form-textarea"
              placeholder="Incidencias generales, consumo de insumos críticos de urgencia, traslados..."
            ></textarea>
          </div>

          <div class="ho-modal-footer">
            <button type="button" class="btn-ghost" @click="isNewHandoverModalOpen = false">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="isSubmittingHandover">
              {{ isSubmittingHandover ? 'Guardando...' : '💾 Registrar Entrega de Turno' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  exportReportToDocx,
  exportReportToExcel,
  exportReportToCsv
} from '~/utils/exportEngine'

const config = useRuntimeConfig()
const apiBase = config.public.apiBase || 'http://localhost:3030'

const isNewHandoverModalOpen = ref(false)
const isSubmittingHandover = ref(false)
const currentLiveTime = ref('')

let timeInterval: any = null

const stats = ref({
  hospitalized: 3,
  emergencies: 4,
  surgeries: 2,
  critical: 1,
  discharges: 2
})

const activePatients = ref([
  {
    id: '1',
    box: 'BOX 01',
    name: 'Max',
    species: 'Canino',
    breed: 'Labrador Retriever',
    status: 'observacion',
    statusLabel: 'En Observación',
    diagnosis: 'Distensión ligamentosa y claudicación posterior',
    carePlan: 'Reposo en jaula, Meloxicam 0.1 mg/kg cada 24h, hielo local',
    weight: 28.5,
    temperature: 38.6,
    heartRate: 95,
    doctor: 'Dr. Carlos Rodríguez'
  },
  {
    id: '2',
    box: 'BOX 02 - UCI',
    name: 'Milo',
    species: 'Felino',
    breed: 'Siamés',
    status: 'critico',
    statusLabel: 'Crítico / UCI',
    diagnosis: 'Síndrome Urológico Felino (FUS) / Obstrucción Uretral',
    carePlan: 'Sonda uretral permeable, fluidoterapia NaCl 0.9% a 15 ml/h, monitorizar diuresis',
    weight: 4.8,
    temperature: 37.9,
    heartRate: 140,
    doctor: 'Dr. Carlos Rodríguez'
  },
  {
    id: '3',
    box: 'BOX 03',
    name: 'Luna',
    species: 'Canino',
    breed: 'Poodle',
    status: 'recuperacion',
    statusLabel: 'Postquirúrgico',
    diagnosis: 'Postoperatorio inmediato de Tartrectomía y Profilaxis',
    carePlan: 'Recuperación anestésica completa, sueroterapia de soporte, dieta blanda',
    weight: 6.2,
    temperature: 38.3,
    heartRate: 105,
    doctor: 'Dra. Valentina Paz'
  }
])

const handovers = ref<any[]>([])

const handoverForm = ref({
  shift_type: 'guardia_24h',
  shift_date: new Date().toISOString().split('T')[0],
  admitted_patients_count: 3,
  surgeries_count: 2,
  emergencies_count: 4,
  discharges_count: 1,
  critical_patients_notes: 'Box 2: Paciente felino "Milo" con obstrucción uretral, sonda permeable y fluidoterapia a 15 ml/h. Monitorizar gasto urinario cada 2h.',
  pending_tasks: '1. Repetir hematocrito en Box 1 a las 06:00.\n2. Administrar analgesia a Canino "Luna" (postoperatorio piometra) a las 04:00.',
  shift_summary: 'Turno de noche con 4 ingresos de urgencia. Todos los pacientes estables en observación.'
})

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  fetchHandovers()
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})

function updateTime() {
  const now = new Date()
  currentLiveTime.value = now.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) + ' · ' + now.toLocaleTimeString('es-ES')
}

async function fetchHandovers() {
  try {
    const res = await $fetch<any>(`${apiBase}/shift-handovers?$sort[created_at]=-1`)
    handovers.value = res.data || res || []
  } catch (e) {
    console.warn('Could not fetch handovers from API, using fallback:', e)
  }
}

async function handleCreateHandover() {
  isSubmittingHandover.value = true
  try {
    const res = await $fetch(`${apiBase}/shift-handovers`, {
      method: 'POST',
      body: handoverForm.value
    })
    handovers.value.unshift(res)
    isNewHandoverModalOpen.value = false
    alert('Acta de entrega de guardia registrada con éxito!')
  } catch (err: any) {
    console.error('Error al registrar entrega de guardia:', err)
    alert('Error al guardar el acta: ' + (err.message || 'Error de conexión'))
  } finally {
    isSubmittingHandover.value = false
  }
}

function formatShiftType(type?: string) {
  switch (type) {
    case 'guardia_24h': return '🚨 GUARDIA 24H'
    case 'noche': return '🌙 TURNO NOCHE'
    case 'manana': return '☀️ TURNO MAÑANA'
    case 'tarde': return '🌇 TURNO TARDE'
    default: return 'PARTE DE GUARDIA'
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function printHandover(ho: any) {
  window.print()
}

async function exportHandoverWord(ho: any) {
  const headers = ['Métrica / Campo', 'Detalle / Conteo']
  const rows = [
    ['Tipo de Turno', formatShiftType(ho.shift_type)],
    ['Fecha', formatDate(ho.shift_date)],
    ['Pacientes Hospitalizados', String(ho.admitted_patients_count || 0)],
    ['Cirugías Realizadas', String(ho.surgeries_count || 0)],
    ['Urgencias del Turno', String(ho.emergencies_count || 0)],
    ['Altas Médicas Otorgadas', String(ho.discharges_count || 0)],
    ['Alertas Críticas', ho.critical_patients_notes || 'Sin alertas críticas'],
    ['Tareas Pendientes Relevo', ho.pending_tasks || 'Sin tareas pendientes'],
    ['Resumen General', ho.shift_summary || 'Guardia completada sin novedades extraordinarias']
  ]
  await exportReportToDocx(
    `Acta Entrega de Guardia - ${formatShiftType(ho.shift_type)}`,
    `Fecha del Turno: ${formatDate(ho.shift_date)} · Guardia Activa MedVet 24/7`,
    headers,
    rows,
    `Hospitalizados: ${ho.admitted_patients_count} | Cirugías: ${ho.surgeries_count} | Urgencias: ${ho.emergencies_count}`
  )
}

function exportHandoverExcel(ho: any) {
  const headers = ['Parámetro', 'Valor']
  const rows = [
    ['Tipo de Turno', formatShiftType(ho.shift_type)],
    ['Fecha', formatDate(ho.shift_date)],
    ['Hospitalizados', ho.admitted_patients_count || 0],
    ['Cirugías', ho.surgeries_count || 0],
    ['Urgencias', ho.emergencies_count || 0],
    ['Altas', ho.discharges_count || 0],
    ['Pacientes Críticos', ho.critical_patients_notes || '—'],
    ['Tareas Pendientes', ho.pending_tasks || '—'],
    ['Resumen', ho.shift_summary || '—']
  ]
  exportReportToExcel(`Guardia_${ho.shift_date}`, headers, rows)
}

function exportHandoverCsv(ho: any) {
  const headers = ['Parámetro', 'Valor']
  const rows = [
    ['Tipo de Turno', formatShiftType(ho.shift_type)],
    ['Fecha', formatDate(ho.shift_date)],
    ['Hospitalizados', ho.admitted_patients_count || 0],
    ['Cirugías', ho.surgeries_count || 0],
    ['Urgencias', ho.emergencies_count || 0],
    ['Altas', ho.discharges_count || 0],
    ['Pacientes Críticos', ho.critical_patients_notes || '—'],
    ['Tareas Pendientes', ho.pending_tasks || '—'],
    ['Resumen', ho.shift_summary || '—']
  ]
  exportReportToCsv(`Guardia_${ho.shift_date}`, headers, rows)
}
</script>

<style scoped>
.guardia-page {
  min-height: 100vh;
  background: #040907;
  color: #f8fafc;
  padding: 2rem 1.5rem 4rem;
  position: relative;
  overflow-x: hidden;
}

.guardia-ambient-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1000px;
  height: 400px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(239, 68, 68, 0.04) 50%, transparent 80%);
  pointer-events: none;
}

.guardia-container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Header */
.guardia-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  background: #091310;
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 1.25rem;
  padding: 1.5rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.guard-beacon-box {
  width: 3.5rem;
  height: 3.5rem;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.beacon-icon {
  font-size: 1.75rem;
}

.beacon-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  border: 2px solid #ef4444;
  animation: beaconPing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes beaconPing {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.3); opacity: 0; }
}

.header-badge-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.badge-guardia {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.4);
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
}

.badge-date {
  font-size: 0.75rem;
  color: #94a3b8;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #f0fdf4;
  margin: 0;
}

.header-sub {
  font-size: 0.875rem;
  color: #cbd5e1;
  margin: 0.2rem 0 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Stats Strip */
.shift-stats-strip {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}

.stat-box {
  background: #091310;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.25rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.stat-box--hosp { border-color: rgba(59, 130, 246, 0.3); }
.stat-box--urg { border-color: rgba(239, 68, 68, 0.3); }
.stat-box--surg { border-color: rgba(168, 85, 247, 0.3); }
.stat-box--crit { border-color: rgba(245, 158, 11, 0.3); }
.stat-box--alt { border-color: rgba(16, 185, 129, 0.3); }

.stat-icon {
  font-size: 2rem;
}

.stat-num {
  display: block;
  font-size: 1.75rem;
  font-weight: 900;
  color: #f8fafc;
  line-height: 1;
}

.stat-lbl {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 600;
}

/* Grid Layout */
.guardia-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 1.5rem;
}

.patients-column, .handovers-column {
  background: #091310;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.25rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.column-title {
  font-size: 1.125rem;
  font-weight: 800;
  color: #f0fdf4;
  margin: 0;
}

.badge-count {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
}

/* Patient Monitor Cards */
.patients-cards-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.patient-monitor-card {
  background: #060c09;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.patient-monitor-card--critico {
  border-color: rgba(239, 68, 68, 0.5);
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, #060c09 100%);
}

.patient-monitor-card--observacion {
  border-color: rgba(245, 158, 11, 0.4);
}

.p-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.p-id-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.p-box-badge {
  background: #0d1e17;
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #34d399;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.35rem 0.6rem;
  border-radius: 0.5rem;
}

.p-name {
  font-size: 1.125rem;
  font-weight: 800;
  color: #f8fafc;
  margin: 0;
}

.p-species {
  font-size: 0.75rem;
  color: #94a3b8;
}

.p-status-chip {
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  text-transform: uppercase;
}

.chip--critico {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.chip--observacion {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.chip--recuperacion {
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.4);
}

.p-diag-box {
  background: rgba(255, 255, 255, 0.02);
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.p-diag-title {
  font-size: 0.8125rem;
  color: #f1f5f9;
  margin: 0 0 0.25rem;
}

.p-care-plan {
  font-size: 0.8125rem;
  color: #94a3b8;
  margin: 0;
}

.p-vitals-strip {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #34d399;
}

.p-vet-tag {
  color: #94a3b8;
  margin-left: auto;
}

.p-card-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.btn-action {
  font-size: 0.75rem;
  font-weight: 700;
  color: #34d399;
  text-decoration: none;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.35rem 0.75rem;
  border-radius: 0.375rem;
}

.btn-action:hover {
  background: #10b981;
  color: #042f20;
}

/* Handovers List */
.handovers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.handover-card {
  background: #060c09;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ho-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ho-type-badge {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  margin-right: 0.5rem;
}

.ho-date {
  font-size: 0.75rem;
  color: #94a3b8;
}

.btn-print-sm {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  font-size: 0.6875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.ho-counts {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  padding: 0.5rem;
  border-radius: 0.375rem;
}

.ho-lbl {
  display: block;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #34d399;
  text-transform: uppercase;
  margin-bottom: 0.2rem;
}

.ho-notes, .ho-tasks, .ho-summary {
  font-size: 0.8125rem;
  color: #cbd5e1;
}

.ho-notes p, .ho-tasks p, .ho-summary p {
  margin: 0;
  white-space: pre-wrap;
}

/* Handover Modal */
.ho-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(4, 10, 8, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.ho-modal-dialog {
  width: 100%;
  max-width: 680px;
  background: #0d1a15;
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
}

.ho-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.ho-modal-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #f0fdf4;
  margin: 0;
}

.btn-close {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.25rem;
  cursor: pointer;
}

.ho-modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.counts-input-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.cnt-card {
  background: #050a08;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cnt-card label {
  font-size: 0.6875rem;
  color: #94a3b8;
}

.cnt-input {
  width: 100%;
  background: transparent;
  border: none;
  color: #34d399;
  font-size: 1.125rem;
  font-weight: 800;
  text-align: center;
  outline: none;
}

.form-row--2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #cbd5e1;
}

.form-input, .form-select, .form-textarea {
  background: #050a08;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.5rem;
  padding: 0.625rem 0.875rem;
  color: #f8fafc;
  font-size: 0.875rem;
  outline: none;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: #10b981;
}

.ho-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-primary {
  background: #10b981;
  color: #042f20;
  font-weight: 700;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-primary:hover {
  background: #34d399;
}

.btn-ghost {
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  text-decoration: none;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .guardia-grid {
    grid-template-columns: 1fr;
  }
  .shift-stats-strip {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
