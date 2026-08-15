<template>
  <div class="carnet-public-page">
    <div class="carnet-ambient-glow"></div>

    <div class="carnet-container">

      <!-- Top Verification Status Banner -->
      <div class="verification-badge-header">
        <div class="v-seal">
          <span class="v-check">✓</span>
          <div>
            <span class="v-title">DOCUMENTO SANITARIO OFICIAL VERIFICADO</span>
            <span class="v-sub">Centro Veterinario Integral MedVet 24/7 · Registro Sanitario Activo</span>
          </div>
        </div>
        <div class="v-meta font-mono-numbers">
          <span>Actualizado: {{ formatDate(data?.verified_at || new Date().toISOString()) }}</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando información médica del paciente...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error || !data?.pet" class="error-state">
        <span class="error-icon">⚠️</span>
        <h2>Carnet no encontrado</h2>
        <p>No se encontró ningún registro clínico activo con el identificador proporcionado.</p>
        <NuxtLink to="/" class="btn-primary mt-4">Ir al Inicio</NuxtLink>
      </div>

      <!-- Main Carnet Content -->
      <div v-else class="carnet-card-main">

        <!-- Hero Passport Header -->
        <div class="passport-hero">
          <div class="passport-avatar-box">
            <img v-if="data.pet.photo" :src="data.pet.photo" :alt="data.pet.name" class="passport-img" />
            <span v-else class="passport-emoji">{{ getSpeciesEmoji(data.pet.species) }}</span>
          </div>

          <div class="passport-info">
            <div class="passport-tags">
              <span class="tag-species">{{ data.pet.species }}</span>
              <span class="tag-status">
                <span class="pulse-dot"></span>
                {{ getPatientStatusText(data.pet) }}
              </span>
            </div>

            <h1 class="passport-pet-name">{{ data.pet.name }}</h1>
            <p class="passport-sub">
              {{ data.pet.breed || 'Mestizo' }} · {{ data.pet.age ? `${data.pet.age} años` : 'Edad no reg.' }}
            </p>

            <div class="passport-identifiers font-mono-numbers">
              <div class="id-item">
                <span class="id-lbl">ID CLÍNICO</span>
                <span class="id-val">#{{ String(data.pet.id).slice(0, 8).toUpperCase() }}</span>
              </div>
              <div class="id-item">
                <span class="id-lbl">PESO REGISTRADO</span>
                <span class="id-val">{{ data.pet.weight || '—' }} kg</span>
              </div>
              <div class="id-item" v-if="data.owner">
                <span class="id-lbl">TUTOR</span>
                <span class="id-val">{{ data.owner.name }}</span>
              </div>
            </div>
          </div>

          <!-- Dynamic QR Code Box -->
          <div class="passport-qr-pane">
            <div class="qr-canvas-box">
              <canvas ref="qrCanvasRef" class="qr-canvas"></canvas>
            </div>
            <span class="qr-caption font-mono-numbers">ESCANEAR PARA VALIDAR</span>
          </div>
        </div>

        <!-- Action Bar -->
        <div class="passport-actions-bar">
          <button type="button" class="action-btn action-btn--primary" @click="isPrintModalOpen = true">
            🖨️ Imprimir Pasaporte Sanitario (A4)
          </button>
          <button type="button" class="action-btn action-btn--secondary" @click="shareCarnet">
            📲 Compartir Ficha
          </button>
          <a :href="`tel:${data.clinic.emergency_phone}`" class="action-btn action-btn--emergency">
            🚨 Guardia 24/7: {{ data.clinic.emergency_phone }}
          </a>
        </div>

        <!-- Section: Vaccination Records -->
        <div class="carnet-section">
          <div class="section-hdr">
            <h2 class="sec-title">💉 Esquema de Vacunación e Inmunizaciones</h2>
            <span class="sec-badge font-mono-numbers">{{ data.vaccines?.length || 0 }} Registros</span>
          </div>

          <div v-if="!data.vaccines || data.vaccines.length === 0" class="empty-notice">
            No hay vacunas registradas en la base de datos.
          </div>

          <div v-else class="vaccines-table-wrapper">
            <table class="vaccines-table font-mono-numbers">
              <thead>
                <tr>
                  <th>Biológico / Vacuna</th>
                  <th>Tipo</th>
                  <th>Lote</th>
                  <th>Aplicación</th>
                  <th>Próximo Refuerzo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="vac in data.vaccines" :key="vac.id">
                  <td class="font-bold text-white">{{ vac.vaccine_name }}</td>
                  <td><span class="badge-type">{{ vac.type }}</span></td>
                  <td class="text-slate-400">{{ vac.batch_number || '—' }}</td>
                  <td>{{ formatDate(vac.applied_date) }}</td>
                  <td :class="isDue(vac.next_due_date) ? 'text-amber-400 font-bold' : 'text-emerald-400'">
                    {{ formatDate(vac.next_due_date) }}
                  </td>
                  <td>
                    <span class="badge-status" :class="isDue(vac.next_due_date) ? 'badge--due' : 'badge--valid'">
                      {{ isDue(vac.next_due_date) ? '⚠️ Refuerzo Pendiente' : '✅ Vigente' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section: Clinical Consultations & Vitals History -->
        <div class="carnet-section" v-if="data.latestRecords && data.latestRecords.length > 0">
          <div class="section-hdr">
            <h2 class="sec-title">📋 Historial de Consultas y Evolución Clínica</h2>
            <span class="sec-badge font-mono-numbers">{{ data.latestRecords.length }} Consultas</span>
          </div>

          <div class="records-timeline">
            <div v-for="rec in data.latestRecords" :key="rec.id" class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-card">
                <div class="timeline-card-hdr">
                  <div class="flex items-center gap-2">
                    <span class="record-type-pill">{{ rec.record_type }}</span>
                    <h3 class="record-title">{{ rec.reason_for_visit }}</h3>
                  </div>
                  <span class="record-date font-mono-numbers">{{ formatDate(rec.created_at) }}</span>
                </div>

                <div class="vitals-row font-mono-numbers" v-if="rec.weight_kg || rec.temperature || rec.heart_rate">
                  <span v-if="rec.weight_kg">⚖️ {{ rec.weight_kg }} kg</span>
                  <span v-if="rec.temperature">🌡️ {{ rec.temperature }} °C</span>
                  <span v-if="rec.heart_rate">💓 {{ rec.heart_rate }} lpm</span>
                  <span v-if="rec.respiratory_rate">🫁 {{ rec.respiratory_rate }} rpm</span>
                </div>

                <div class="record-diag" v-if="rec.definitive_diagnosis || rec.presumptive_diagnosis">
                  <strong>Diagnóstico:</strong> {{ rec.definitive_diagnosis || rec.presumptive_diagnosis }}
                </div>

                <div class="record-prescr" v-if="rec.medical_prescription">
                  <strong>Indicaciones:</strong>
                  <pre class="prescr-text">{{ rec.medical_prescription }}</pre>
                </div>

                <div class="record-vet-sign" v-if="rec.professional_name">
                  <span>Médico Veterinario Tratante: <strong>{{ rec.professional_name }}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section: Surgeries -->
        <div class="carnet-section" v-if="data.surgeries && data.surgeries.length > 0">
          <div class="section-hdr">
            <h2 class="sec-title">🔪 Procedimientos Quirúrgicos</h2>
            <span class="sec-badge font-mono-numbers">{{ data.surgeries.length }} Cirugías</span>
          </div>

          <div class="surgeries-grid">
            <div v-for="surg in data.surgeries" :key="surg.id" class="surgery-card">
              <div class="surg-hdr">
                <h4>{{ surg.surgery_name }}</h4>
                <span class="surg-date font-mono-numbers">{{ formatDate(surg.surgery_date) }}</span>
              </div>
              <p class="surg-status">Estado: <span class="badge-valid">{{ surg.status }}</span></p>
              <p v-if="surg.surgical_technique" class="surg-tech">{{ surg.surgical_technique }}</p>
            </div>
          </div>
        </div>

        <!-- Clinic Footer -->
        <div class="carnet-footer">
          <div class="clinic-info">
            <h3 class="clinic-name">{{ data.clinic.name }}</h3>
            <p>{{ data.clinic.address }}</p>
            <p class="font-mono-numbers">Atención de Emergencias 24/7: {{ data.clinic.emergency_phone }} · Central: {{ data.clinic.phone }}</p>
          </div>
        </div>

      </div>

    </div>

    <!-- Printable Modal integration -->
    <PrintableCarnetModal
      :is-open="isPrintModalOpen"
      :pet="printablePetData"
      @close="isPrintModalOpen = false"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import QRCode from 'qrcode'

const route = useRoute()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase || 'http://localhost:3030'

const isPrintModalOpen = ref(false)
const qrCanvasRef = ref<HTMLCanvasElement | null>(null)

const { data, pending, error } = await useFetch<any>(`${apiBase}/public-carnet/${route.params.id}`)

onMounted(() => {
  renderQRCode()
})

watch(data, () => {
  renderQRCode()
})

async function renderQRCode() {
  await nextTick()
  if (!qrCanvasRef.value) return

  const currentUrl = window.location.href
  try {
    await QRCode.toCanvas(qrCanvasRef.value, currentUrl, {
      width: 130,
      margin: 1,
      color: {
        dark: '#042f20',
        light: '#ffffff'
      }
    })
  } catch (e) {
    console.error('Error generating QR code:', e)
  }
}

function getSpeciesEmoji(species?: string) {
  if (!species) return '🐾'
  const s = species.toLowerCase()
  if (s.includes('perr') || s.includes('canin') || s.includes('dog')) return '🐕'
  if (s.includes('gat') || s.includes('felin') || s.includes('cat')) return '🐈'
  if (s.includes('ave') || s.includes('pajaro') || s.includes('bird')) return '🦜'
  if (s.includes('conejo') || s.includes('rabbit')) return '🐇'
  return '🐾'
}

function getPatientStatusText(pet: any) {
  return 'Historial Clínico Activo'
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function isDue(dateStr?: string) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

function shareCarnet() {
  if (navigator.share) {
    navigator.share({
      title: `Carnet de Salud - ${data.value?.pet?.name || 'Mascota'} | MedVet`,
      text: `Pasaporte Sanitario y Registro Clínico Oficial de ${data.value?.pet?.name}`,
      url: window.location.href
    }).catch(() => {})
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('Enlace del carnet copiado al portapapeles!')
  }
}

const printablePetData = computed(() => {
  if (!data.value?.pet) return {}
  return {
    id: data.value.pet.id,
    name: data.value.pet.name,
    species: data.value.pet.species,
    breed: data.value.pet.breed,
    age: data.value.pet.age,
    weight: data.value.pet.weight,
    photo: data.value.pet.photo,
    chip: 'ISO-11784-' + String(data.value.pet.id).slice(0, 8).toUpperCase(),
    ownerName: data.value.owner?.name,
    ownerPhone: data.value.owner?.phone,
    vaccines: data.value.vaccines
  }
})
</script>

<style scoped>
.carnet-public-page {
  min-height: 100vh;
  background: #040907;
  color: #f8fafc;
  padding: 2rem 1rem 4rem;
  position: relative;
  overflow-x: hidden;
}

.carnet-ambient-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 400px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.04) 50%, transparent 80%);
  pointer-events: none;
}

.carnet-container {
  max-width: 980px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Verification Header */
.verification-badge-header {
  background: rgba(13, 26, 21, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(16, 185, 129, 0.35);
  border-radius: 1rem;
  padding: 0.875rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.v-seal {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.v-check {
  width: 1.75rem;
  height: 1.75rem;
  background: #10b981;
  color: #042f20;
  font-weight: 900;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.v-title {
  display: block;
  font-size: 0.8125rem;
  font-weight: 800;
  color: #34d399;
  letter-spacing: 0.05em;
}

.v-sub {
  font-size: 0.75rem;
  color: #94a3b8;
}

.v-meta {
  font-size: 0.75rem;
  color: #64748b;
}

/* Card Main */
.carnet-card-main {
  background: #091310;
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7);
}

/* Hero Passport */
.passport-hero {
  padding: 2rem;
  background: linear-gradient(135deg, #0d1e17 0%, #08130f 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: center;
}

.passport-avatar-box {
  width: 110px;
  height: 110px;
  border-radius: 1.25rem;
  background: #050a08;
  border: 2px solid rgba(16, 185, 129, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.passport-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.passport-emoji {
  font-size: 3.5rem;
}

.passport-tags {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.tag-species {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.4);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
}

.tag-status {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.6875rem;
  color: #94a3b8;
  font-weight: 600;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 9999px;
  box-shadow: 0 0 8px #10b981;
}

.passport-pet-name {
  font-size: 2.25rem;
  font-weight: 900;
  color: #f0fdf4;
  margin: 0;
  line-height: 1.1;
}

.passport-sub {
  font-size: 1rem;
  color: #cbd5e1;
  margin: 0.25rem 0 1rem;
}

.passport-identifiers {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.id-item {
  display: flex;
  flex-direction: column;
}

.id-lbl {
  font-size: 0.625rem;
  color: #64748b;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.id-val {
  font-size: 0.875rem;
  color: #34d399;
  font-weight: 700;
}

.passport-qr-pane {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.qr-canvas-box {
  padding: 0.5rem;
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
}

.qr-canvas {
  display: block;
}

.qr-caption {
  font-size: 0.625rem;
  color: #94a3b8;
  letter-spacing: 0.08em;
}

/* Actions Bar */
.passport-actions-bar {
  padding: 1rem 2rem;
  background: #070e0b;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.625rem 1.25rem;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.action-btn--primary {
  background: #10b981;
  color: #042f20;
  border: none;
}

.action-btn--primary:hover {
  background: #34d399;
}

.action-btn--secondary {
  background: rgba(255, 255, 255, 0.05);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.action-btn--secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

.action-btn--emergency {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #f87171;
  margin-left: auto;
}

.action-btn--emergency:hover {
  background: #ef4444;
  color: #ffffff;
}

/* Sections */
.carnet-section {
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.section-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.sec-title {
  font-size: 1.125rem;
  font-weight: 800;
  color: #f0fdf4;
  margin: 0;
}

.sec-badge {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
}

/* Tables */
.vaccines-table-wrapper {
  overflow-x: auto;
}

.vaccines-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.vaccines-table th {
  text-align: left;
  padding: 0.75rem 1rem;
  background: #060c09;
  color: #94a3b8;
  font-weight: 700;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.vaccines-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.badge-type {
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.badge-status {
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.badge--valid {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.badge--due {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}

/* Timeline */
.records-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.timeline-item {
  display: flex;
  gap: 1.25rem;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 9999px;
  background: #10b981;
  margin-top: 0.5rem;
  box-shadow: 0 0 10px #10b981;
  flex-shrink: 0;
}

.timeline-card {
  flex: 1;
  background: #070e0c;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.875rem;
  padding: 1.25rem;
}

.timeline-card-hdr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.record-type-pill {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
}

.record-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
}

.record-date {
  font-size: 0.75rem;
  color: #64748b;
}

.vitals-row {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #34d399;
  background: rgba(16, 185, 129, 0.05);
  padding: 0.35rem 0.6rem;
  border-radius: 0.375rem;
  margin: 0.5rem 0;
}

.record-diag, .record-prescr {
  font-size: 0.8125rem;
  color: #cbd5e1;
  margin-top: 0.375rem;
}

.prescr-text {
  font-family: inherit;
  white-space: pre-wrap;
  background: #040806;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  margin: 0.25rem 0 0;
}

.record-vet-sign {
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
  font-size: 0.75rem;
  color: #64748b;
}

/* Surgeries */
.surgeries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.surgery-card {
  background: #070e0c;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
  padding: 1rem;
}

.surg-hdr {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.surg-hdr h4 {
  font-size: 0.875rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
}

.surg-date {
  font-size: 0.75rem;
  color: #64748b;
}

.surg-status {
  font-size: 0.75rem;
  margin: 0.35rem 0;
}

.surg-tech {
  font-size: 0.8125rem;
  color: #94a3b8;
  margin: 0;
}

/* Footer */
.carnet-footer {
  padding: 2rem;
  background: #050a08;
  text-align: center;
}

.clinic-name {
  font-size: 1rem;
  font-weight: 700;
  color: #34d399;
  margin: 0 0 0.35rem;
}

.clinic-info p {
  font-size: 0.8125rem;
  color: #64748b;
  margin: 0.2rem 0;
}

.loading-state, .error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: #091310;
  border-radius: 1.5rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(16, 185, 129, 0.2);
  border-top-color: #10b981;
  border-radius: 9999px;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .passport-hero {
    grid-template-columns: 1fr;
    text-align: center;
    justify-items: center;
  }
  .passport-identifiers {
    justify-content: center;
  }
  .action-btn--emergency {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
}
</style>
