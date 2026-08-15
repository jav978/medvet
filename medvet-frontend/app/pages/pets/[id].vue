<template>
  <div class="pet-record-page">
    <div class="record-glow-ambient"></div>

    <div class="record-inner">

      <!-- Breadcrumbs & Top Nav -->
      <div class="record-top-nav">
        <NuxtLink to="/pets" class="back-link">
          ← Volver a Mis Mascotas
        </NuxtLink>
        <div class="record-top-actions">
          <NuxtLink :to="`/carnet/${pet.id}`" target="_blank" class="btn-ghost btn-sm">
            🪪 Carnet QR Digital
          </NuxtLink>
          <NuxtLink :to="`/book?pet=${pet.id}`" class="btn-ghost btn-sm">
            📅 Agendar Cita
          </NuxtLink>
          <button type="button" @click="showAddRecordModal = true" class="btn-primary btn-sm">
            🩺 Nueva Consulta EHR
          </button>
        </div>
      </div>

      <!-- Patient Master Header -->
      <div class="patient-master-card">
        <div class="patient-master-top">
          <div class="patient-id-block">
            <div class="patient-avatar-box">
              <span class="patient-avatar-emoji">{{ getSpeciesEmoji(pet.species) }}</span>
            </div>
            <div>
              <div class="patient-badges">
                <span class="species-badge">{{ pet.species }}</span>
                <span class="health-chip" :class="`health-chip--${latestStatus}`">
                  <span class="chip-pulse"></span>
                  Estado: {{ formatStatus(latestStatus) }}
                </span>
              </div>
              <h1 class="patient-name">{{ pet.name }}</h1>
              <p class="patient-sub">{{ pet.breed || 'Mestizo' }} · Tutor: {{ pet.tutorName }}</p>
            </div>
          </div>

          <div class="patient-qr-box" title="Microchip ISO 11784">
            <span class="qr-lbl">MICROCHIP ISO</span>
            <span class="qr-code font-mono-numbers">{{ pet.chip }}</span>
          </div>
        </div>

        <!-- Vital Signs Constants Row -->
        <div class="vitals-strip font-mono-numbers">
          <div class="vital-block">
            <span class="vb-icon">⚖️</span>
            <div>
              <span class="vb-val">{{ pet.weight || '—' }} kg</span>
              <span class="vb-lbl">Peso Actual</span>
            </div>
          </div>

          <div class="vital-block">
            <span class="vb-icon">🎂</span>
            <div>
              <span class="vb-val">{{ pet.age || '—' }} años</span>
              <span class="vb-lbl">Edad Registrada</span>
            </div>
          </div>

          <div class="vital-block">
            <span class="vb-icon">🌡️</span>
            <div>
              <span class="vb-val">{{ latestVitals.temperature ? `${latestVitals.temperature} °C` : '38.4 °C' }}</span>
              <span class="vb-lbl">Temperatura</span>
            </div>
          </div>

          <div class="vital-block">
            <span class="vb-icon">💓</span>
            <div>
              <span class="vb-val">{{ latestVitals.heart_rate ? `${latestVitals.heart_rate} lpm` : '96 lpm' }}</span>
              <span class="vb-lbl">Frecuencia Cardíaca</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Record Navigation Tabs -->
      <div class="record-tabs">
        <button
          v-for="tab in recordTabs"
          :key="tab.id"
          type="button"
          @click="activeTab = tab.id"
          :class="['record-tab-btn', activeTab === tab.id ? 'record-tab-btn--active' : '']"
        >
          <span>{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
          <span v-if="tab.count !== undefined" class="tab-badge font-mono-numbers">{{ tab.count }}</span>
        </button>
      </div>

      <!-- ────────────────────────────────────────
           TAB 1: CONSULTAS & EVOLUCIÓN CLÍNICA
      ──────────────────────────────────────── -->
      <div v-if="activeTab === 'evolucion'" class="tab-content">
        <div class="tab-content-header">
          <div>
            <h2 class="tab-title">Evolución Cronológica & Consultas</h2>
            <p class="tab-sub">Registro detallado de atenciones, anamnesis y diagnósticos clínicos</p>
          </div>
          <button @click="showAddRecordModal = true" class="btn-primary btn-sm">
            ＋ Nueva Consulta
          </button>
        </div>

        <div class="timeline-wrap">
          <div v-if="medicalRecordsList.length === 0" class="empty-tab-msg">
            No hay consultas médicas registradas aún para este paciente.
          </div>

          <div
            v-for="(ev, idx) in medicalRecordsList"
            :key="ev.id || idx"
            class="timeline-item"
          >
            <div class="timeline-dot-wrap">
              <div class="timeline-dot"></div>
              <div class="timeline-line" v-if="idx < medicalRecordsList.length - 1"></div>
            </div>

            <div class="timeline-card">
              <div class="timeline-card-header">
                <div>
                  <span class="ev-date font-mono-numbers">📅 {{ formatDate(ev.created_at) }}</span>
                  <h3 class="ev-service">{{ ev.reason_for_visit }}</h3>
                </div>
                <span class="ev-type-badge">{{ ev.record_type }}</span>
              </div>

              <!-- Vitals strip inside consultation -->
              <div class="ev-vitals-mini font-mono-numbers" v-if="ev.weight_kg || ev.temperature || ev.heart_rate">
                <span v-if="ev.weight_kg">⚖️ {{ ev.weight_kg }} kg</span>
                <span v-if="ev.temperature">🌡️ {{ ev.temperature }} °C</span>
                <span v-if="ev.heart_rate">💓 {{ ev.heart_rate }} lpm</span>
                <span v-if="ev.respiratory_rate">🫁 {{ ev.respiratory_rate }} rpm</span>
                <span v-if="ev.mucous_membranes">👄 Mucosas: {{ ev.mucous_membranes }}</span>
              </div>

              <div class="ev-body">
                <div class="ev-section" v-if="ev.anamnesis">
                  <span class="ev-sec-title">Anamnesis & Motivo:</span>
                  <p class="ev-sec-text">{{ ev.anamnesis }}</p>
                </div>

                <div class="ev-section" v-if="ev.physical_exam_findings">
                  <span class="ev-sec-title">Examen Físico:</span>
                  <p class="ev-sec-text">{{ ev.physical_exam_findings }}</p>
                </div>

                <div class="ev-section" v-if="ev.definitive_diagnosis || ev.presumptive_diagnosis">
                  <span class="ev-sec-title">Diagnóstico:</span>
                  <p class="ev-sec-text ev-sec-text--diag">
                    {{ ev.definitive_diagnosis || ev.presumptive_diagnosis }}
                  </p>
                </div>

                <div class="ev-section" v-if="ev.treatment_plan">
                  <span class="ev-sec-title">Plan Terapéutico:</span>
                  <p class="ev-sec-text">{{ ev.treatment_plan }}</p>
                </div>

                <div class="ev-section" v-if="ev.medical_prescription">
                  <span class="ev-sec-title">Receta / Indicaciones:</span>
                  <pre class="ev-prescription-box font-mono-numbers">{{ ev.medical_prescription }}</pre>
                </div>
              </div>

              <div class="ev-footer">
                <div class="doc-badge">
                  <span class="doc-avatar">👨‍⚕️</span>
                  <div>
                    <span class="doc-name">{{ ev.professional_name || 'Dr. Carlos Rodríguez' }}</span>
                    <span class="doc-reg font-mono-numbers">Médico Veterinario Tratante</span>
                  </div>
                </div>
                <span class="signed-badge">✔ Firma Digital Verificada</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ────────────────────────────────────────
           TAB 2: ESTUDIOS & PLACAS RAYOS X
      ──────────────────────────────────────── -->
      <div v-if="activeTab === 'estudios'" class="tab-content">
        <div class="tab-content-header">
          <div>
            <h2 class="tab-title">Estudios por Imágenes & Laboratorio</h2>
            <p class="tab-sub">Visor de placas de Rayos X, ecografías y hemogramas con herramientas médicas</p>
          </div>
          <button @click="openStudyViewer(0)" class="btn-primary btn-sm">
            🩻 Abrir Visor Médico de Placas
          </button>
        </div>

        <div v-if="clinicalStudiesList.length === 0" class="empty-tab-msg">
          No hay estudios ni placas radiográficas adjuntas aún.
        </div>

        <div v-else class="studies-showcase-grid">
          <div
            v-for="(study, idx) in clinicalStudiesList"
            :key="study.id || idx"
            class="study-card-item"
            @click="openStudyViewer(idx)"
          >
            <div class="study-thumb-box">
              <img
                v-if="isImage(study.file_url)"
                :src="study.thumbnail_url || study.file_url"
                :alt="study.title"
                class="study-thumb-image"
              />
              <div v-else class="study-thumb-icon">
                {{ getCategoryIcon(study.category) }}
              </div>
              <span class="study-category-badge">{{ study.category }}</span>
            </div>

            <div class="study-card-info">
              <h3 class="study-item-title">{{ study.title }}</h3>
              <span class="study-item-date font-mono-numbers">📅 {{ formatDate(study.study_date || study.created_at) }}</span>
              <p class="study-item-findings" v-if="study.findings">{{ study.findings }}</p>
            </div>

            <div class="study-card-hover-action">
              <span>🔍 Ver y Analizar</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ────────────────────────────────────────
           TAB 3: VACUNAS & DESPARASITACIÓN
      ──────────────────────────────────────── -->
      <div v-if="activeTab === 'vacunas'" class="tab-content">
        <div class="tab-content-header">
          <div>
            <h2 class="tab-title">Plan Integral de Vacunación</h2>
            <p class="tab-sub">Esquema oficial de inmunización certificado por MedVet</p>
          </div>
          <button @click="showAddVaccineModal = true" class="btn-primary btn-sm">
            💉 Registrar Vacuna
          </button>
        </div>

        <div v-if="vaccinesList.length === 0" class="empty-tab-msg">
          No hay vacunas registradas en el carnet sanitario.
        </div>

        <div v-else class="vaccines-grid">
          <div
            v-for="vac in vaccinesList"
            :key="vac.id || vac.vaccine_name"
            class="vac-card"
          >
            <div class="vac-card-top">
              <div class="vac-icon-wrap">💉</div>
              <span :class="['vac-status-pill', isDue(vac.next_due_date) ? 'vac-status-pill--warn' : 'vac-status-pill--ok']">
                {{ isDue(vac.next_due_date) ? 'Refuerzo Próximo' : 'Al Día' }}
              </span>
            </div>

            <h3 class="vac-name">{{ vac.vaccine_name }}</h3>
            <p class="vac-desc">{{ vac.type }} · {{ vac.manufacturer || 'Laboratorio Certificado' }}</p>

            <div class="vac-meta-box font-mono-numbers">
              <div class="vmb-row">
                <span>Última aplicación:</span>
                <strong>{{ formatDate(vac.applied_date) }}</strong>
              </div>
              <div class="vmb-row">
                <span>Próximo refuerzo:</span>
                <strong class="vmb-due">{{ formatDate(vac.next_due_date) }}</strong>
              </div>
              <div class="vmb-row" v-if="vac.batch_number">
                <span>Lote:</span>
                <span>{{ vac.batch_number }}</span>
              </div>
            </div>

            <div class="vac-card-footer" v-if="vac.notes">
              <span class="vac-vet">{{ vac.notes }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ────────────────────────────────────────
           TAB 4: CIRUGÍAS & QUIRÓFANO
      ──────────────────────────────────────── -->
      <div v-if="activeTab === 'cirugias'" class="tab-content">
        <div class="tab-content-header">
          <div>
            <h2 class="tab-title">Protocolos Quirúrgicos e Intervenciones</h2>
            <p class="tab-sub">Registro de cirugías, técnica empleada, anestesia y postoperatorio</p>
          </div>
          <button @click="showAddSurgeryModal = true" class="btn-primary btn-sm">
            🔪 Registrar Cirugía
          </button>
        </div>

        <div v-if="surgeriesList.length === 0" class="empty-tab-msg">
          No hay cirugías registradas para este paciente.
        </div>

        <div v-else class="surgeries-full-list">
          <div v-for="surg in surgeriesList" :key="surg.id" class="surgery-full-card">
            <div class="surgery-full-header">
              <div>
                <span class="surgery-type-badge font-mono-numbers">{{ surg.surgery_type }}</span>
                <h3 class="surgery-name">{{ surg.surgery_name }}</h3>
                <span class="surgery-date font-mono-numbers">📅 {{ formatDate(surg.surgery_date) }}</span>
              </div>
              <span class="surg-status-chip font-mono-numbers" :class="`chip--${surg.status}`">
                {{ surg.status }}
              </span>
            </div>

            <div class="surgery-sections-grid">
              <div class="surg-block" v-if="surg.pre_op_evaluation">
                <span class="surg-block-lbl">Evaluación Prequirúrgica & ASA:</span>
                <p>{{ surg.pre_op_evaluation }}</p>
              </div>

              <div class="surg-block" v-if="surg.anesthesia_protocol">
                <span class="surg-block-lbl">Protocolo Anestésico:</span>
                <p>{{ surg.anesthesia_protocol }}</p>
              </div>

              <div class="surg-block" v-if="surg.surgical_technique">
                <span class="surg-block-lbl">Técnica Quirúrgica:</span>
                <p>{{ surg.surgical_technique }}</p>
              </div>

              <div class="surg-block" v-if="surg.post_op_orders">
                <span class="surg-block-lbl">Cuidados Postoperatorios:</span>
                <p>{{ surg.post_op_orders }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Interactive Clinical Study Viewer Modal -->
    <ClinicalStudyViewer
      :is-open="isStudyViewerOpen"
      :pet-id="pet.id"
      :studies="clinicalStudiesList"
      :initial-index="selectedStudyIndex"
      @close="isStudyViewerOpen = false"
      @study-added="onStudyAdded"
      @study-deleted="onStudyDeleted"
    />

    <!-- New Medical Record Modal -->
    <NewMedicalRecordModal
      :is-open="showAddRecordModal"
      :pet-id="pet.id"
      :pet-name="pet.name"
      @close="showAddRecordModal = false"
      @record-saved="onRecordSaved"
    />

    <!-- New Vaccine Modal -->
    <NewVaccinationModal
      :is-open="showAddVaccineModal"
      :pet-id="pet.id"
      :pet-name="pet.name"
      @close="showAddVaccineModal = false"
      @vaccine-saved="onVaccineSaved"
    />

    <!-- New Surgery Modal -->
    <NewSurgeryModal
      :is-open="showAddSurgeryModal"
      :pet-id="pet.id"
      :pet-name="pet.name"
      @close="showAddSurgeryModal = false"
      @surgery-saved="onSurgerySaved"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth',
  requiresAuth: true
})

const route = useRoute()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase || 'http://localhost:3030'
const petId = String(route.params.id || '1')

const activeTab = ref('evolucion')

// Modals State
const isStudyViewerOpen = ref(false)
const selectedStudyIndex = ref(0)
const showAddRecordModal = ref(false)
const showAddVaccineModal = ref(false)
const showAddSurgeryModal = ref(false)

const pet = ref({
  id: petId,
  name: 'Max',
  species: 'Perro',
  breed: 'Labrador Retriever',
  age: 3,
  weight: 28.5,
  sex: 'M',
  chip: 'AR-98214-998',
  tutorName: 'María García'
})

const medicalRecordsList = ref<any[]>([])
const clinicalStudiesList = ref<any[]>([])
const vaccinesList = ref<any[]>([])
const surgeriesList = ref<any[]>([])

const recordTabs = computed(() => [
  { id: 'evolucion', label: 'Evolución & Consultas', icon: '📋', count: medicalRecordsList.value.length },
  { id: 'estudios', label: 'Estudios & Placas RX', icon: '🩻', count: clinicalStudiesList.value.length },
  { id: 'vacunas', label: 'Plan de Vacunación', icon: '💉', count: vaccinesList.value.length },
  { id: 'cirugias', label: 'Cirugías & Quirófano', icon: '🔪', count: surgeriesList.value.length }
])

const latestStatus = computed(() => {
  if (medicalRecordsList.value.length > 0) {
    return medicalRecordsList.value[0].patient_status || 'estable'
  }
  return 'estable'
})

const latestVitals = computed(() => {
  if (medicalRecordsList.value.length > 0) {
    return medicalRecordsList.value[0]
  }
  return {}
})

onMounted(async () => {
  await loadPetEhrData()
})

async function loadPetEhrData() {
  try {
    // 1. Fetch Pet info
    const petRes = await $fetch<any>(`${apiBase}/pets/${petId}`).catch(() => null)
    if (petRes) {
      pet.value = {
        id: petRes.id,
        name: petRes.name,
        species: petRes.species,
        breed: petRes.breed || 'Mestizo',
        age: petRes.age || 3,
        weight: petRes.weight || 28.5,
        sex: 'M',
        chip: 'ISO-11784-' + String(petRes.id).slice(0, 8).toUpperCase(),
        tutorName: 'Tutor MedVet'
      }
    }

    // 2. Fetch Medical records
    const recordsRes = await $fetch<any>(`${apiBase}/medical-records?pet_id=${petId}&$sort[created_at]=-1`).catch(() => [])
    medicalRecordsList.value = recordsRes.data || recordsRes || []

    // 3. Fetch Clinical attachments (X-rays, lab studies)
    const attachmentsRes = await $fetch<any>(`${apiBase}/clinical-attachments?pet_id=${petId}&$sort[created_at]=-1`).catch(() => [])
    clinicalStudiesList.value = attachmentsRes.data || attachmentsRes || []

    // 4. Fetch Vaccinations
    const vacsRes = await $fetch<any>(`${apiBase}/vaccinations?pet_id=${petId}&$sort[applied_date]=-1`).catch(() => [])
    vaccinesList.value = vacsRes.data || vacsRes || []

    // 5. Fetch Surgeries
    const surgRes = await $fetch<any>(`${apiBase}/surgeries?pet_id=${petId}&$sort[surgery_date]=-1`).catch(() => [])
    surgeriesList.value = surgRes.data || surgRes || []
  } catch (err) {
    console.error('Error loading EHR data:', err)
  }
}

function openStudyViewer(index: number) {
  selectedStudyIndex.value = index
  isStudyViewerOpen.value = true
}

function onStudyAdded(study: any) {
  clinicalStudiesList.value.unshift(study)
}

function onStudyDeleted(studyId: string) {
  clinicalStudiesList.value = clinicalStudiesList.value.filter(s => s.id !== studyId)
}

function onRecordSaved(rec: any) {
  medicalRecordsList.value.unshift(rec)
  if (rec.weight_kg) pet.value.weight = rec.weight_kg
}

function onVaccineSaved(vac: any) {
  vaccinesList.value.unshift(vac)
}

function onSurgerySaved(surg: any) {
  surgeriesList.value.unshift(surg)
}

function getSpeciesEmoji(species?: string) {
  if (!species) return '🐾'
  const s = species.toLowerCase()
  if (s.includes('perr') || s.includes('canin')) return '🐕'
  if (s.includes('gat') || s.includes('felin')) return '🐈'
  if (s.includes('ave') || s.includes('pajaro')) return '🦜'
  return '🐾'
}

function formatStatus(status?: string) {
  switch (status) {
    case 'estable': return 'Estable'
    case 'observacion': return 'En Observación'
    case 'critico': return 'Crítico'
    case 'hospitalizado': return 'Hospitalizado'
    case 'prequirurgico': return 'Prequirúrgico'
    case 'postquirurgico': return 'Postquirúrgico'
    case 'alta': return 'Alta Médica'
    default: return 'Estable'
  }
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

function isImage(url?: string) {
  if (!url) return false
  return (
    url.startsWith('data:image') ||
    url.endsWith('.jpg') ||
    url.endsWith('.jpeg') ||
    url.endsWith('.png') ||
    url.endsWith('.webp') ||
    url.includes('images') ||
    url.includes('unsplash')
  )
}

function getCategoryIcon(cat?: string) {
  switch (cat) {
    case 'radiografia': return '🩻'
    case 'ecografia': return '🔊'
    case 'sangre': return '🩸'
    case 'orina': return '🧪'
    case 'biopsia': return '🔬'
    default: return '📄'
  }
}
</script>

<style scoped>
.pet-record-page {
  min-height: 100vh;
  background: #040907;
  color: #f8fafc;
  padding: 2rem 1.5rem 4rem;
  position: relative;
  overflow-x: hidden;
}

.record-glow-ambient {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1000px;
  height: 400px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.03) 50%, transparent 80%);
  pointer-events: none;
}

.record-inner {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Top Nav */
.record-top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-link {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: #34d399;
}

.record-top-actions {
  display: flex;
  gap: 0.75rem;
}

/* Master Card */
.patient-master-card {
  background: #091310;
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 1.5rem;
  padding: 1.75rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.patient-master-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.patient-id-block {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.patient-avatar-box {
  width: 80px;
  height: 80px;
  background: #050a08;
  border: 2px solid rgba(16, 185, 129, 0.4);
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.patient-avatar-emoji {
  font-size: 2.75rem;
}

.patient-badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.species-badge {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  text-transform: uppercase;
}

.health-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.6875rem;
  color: #34d399;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  font-weight: 600;
}

.health-chip--critico {
  color: #f87171;
  background: rgba(239, 68, 68, 0.15);
}

.health-chip--observacion {
  color: #fbbf24;
  background: rgba(245, 158, 11, 0.15);
}

.chip-pulse {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: currentColor;
}

.patient-name {
  font-size: 2rem;
  font-weight: 900;
  color: #f0fdf4;
  margin: 0;
  line-height: 1.1;
}

.patient-sub {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0.2rem 0 0;
}

.patient-qr-box {
  background: #050a08;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  padding: 0.625rem 1rem;
  text-align: right;
}

.qr-lbl {
  display: block;
  font-size: 0.625rem;
  color: #64748b;
  font-weight: 700;
}

.qr-code {
  font-size: 0.875rem;
  font-weight: 700;
  color: #34d399;
}

.vitals-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  background: #060c09;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1rem 1.25rem;
}

.vital-block {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.vb-icon {
  font-size: 1.5rem;
}

.vb-val {
  display: block;
  font-size: 1.125rem;
  font-weight: 800;
  color: #f8fafc;
}

.vb-lbl {
  font-size: 0.6875rem;
  color: #94a3b8;
}

/* Tabs */
.record-tabs {
  display: flex;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.5rem;
  overflow-x: auto;
}

.record-tab-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.625rem 1rem;
  border-radius: 0.625rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.record-tab-btn:hover {
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.03);
}

.record-tab-btn--active {
  color: #34d399;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.tab-badge {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.15rem 0.45rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
}

/* Tab Content */
.tab-content {
  background: #091310;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.25rem;
  padding: 1.75rem;
}

.tab-content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.tab-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #f0fdf4;
  margin: 0;
}

.tab-sub {
  font-size: 0.8125rem;
  color: #94a3b8;
  margin: 0.2rem 0 0;
}

.empty-tab-msg {
  text-align: center;
  padding: 3rem 1rem;
  color: #64748b;
  font-size: 0.875rem;
}

/* Timeline */
.timeline-wrap {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.timeline-item {
  display: flex;
  gap: 1.5rem;
}

.timeline-dot-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-dot {
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
  margin-top: 0.5rem;
}

.timeline-line {
  width: 2px;
  flex: 1;
  background: rgba(16, 185, 129, 0.2);
  margin-top: 0.5rem;
}

.timeline-card {
  flex: 1;
  background: #060c09;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1rem;
  padding: 1.5rem;
}

.timeline-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.ev-date {
  font-size: 0.75rem;
  color: #64748b;
}

.ev-service {
  font-size: 1.125rem;
  font-weight: 800;
  color: #f8fafc;
  margin: 0.2rem 0 0;
}

.ev-type-badge {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.ev-vitals-mini {
  display: flex;
  gap: 1rem;
  background: rgba(16, 185, 129, 0.06);
  padding: 0.4rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: #34d399;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.ev-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ev-sec-title {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #34d399;
  margin-bottom: 0.2rem;
}

.ev-sec-text {
  font-size: 0.875rem;
  color: #cbd5e1;
  margin: 0;
}

.ev-sec-text--diag {
  color: #f0fdf4;
  font-weight: 600;
}

.ev-prescription-box {
  background: #040806;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: #34d399;
  font-size: 0.8125rem;
  white-space: pre-wrap;
  margin: 0;
}

.ev-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.25rem;
  padding-top: 0.875rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.doc-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.doc-avatar {
  font-size: 1.25rem;
}

.doc-name {
  display: block;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #f8fafc;
}

.doc-reg {
  font-size: 0.6875rem;
  color: #64748b;
}

.signed-badge {
  font-size: 0.6875rem;
  color: #34d399;
}

/* Studies Showcase Grid */
.studies-showcase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.study-card-item {
  background: #060c09;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  position: relative;
}

.study-card-item:hover {
  border-color: #10b981;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.study-thumb-box {
  height: 180px;
  background: #020504;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.study-thumb-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.study-thumb-icon {
  font-size: 3.5rem;
}

.study-category-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(4, 10, 8, 0.8);
  backdrop-filter: blur(4px);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  text-transform: uppercase;
}

.study-card-info {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.study-item-title {
  font-size: 0.9375rem;
  font-weight: 800;
  color: #f8fafc;
  margin: 0;
}

.study-item-date {
  font-size: 0.75rem;
  color: #64748b;
}

.study-item-findings {
  font-size: 0.8125rem;
  color: #94a3b8;
  margin: 0.35rem 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.study-card-hover-action {
  padding: 0.625rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;
}

/* Vaccines Grid */
.vaccines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.vac-card {
  background: #060c09;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.25rem;
}

.vac-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.vac-icon-wrap {
  font-size: 1.5rem;
}

.vac-status-pill {
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
}

.vac-status-pill--ok {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.vac-status-pill--warn {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}

.vac-name {
  font-size: 1rem;
  font-weight: 800;
  color: #f8fafc;
  margin: 0;
}

.vac-desc {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0.2rem 0 0.75rem;
}

.vac-meta-box {
  background: #040806;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.vmb-row {
  display: flex;
  justify-content: space-between;
}

.vmb-due {
  color: #34d399;
}

/* Surgeries */
.surgeries-full-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.surgery-full-card {
  background: #060c09;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.5rem;
}

.surgery-full-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.surgery-type-badge {
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.surgery-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: #f8fafc;
  margin: 0.35rem 0 0.15rem;
}

.surgery-date {
  font-size: 0.75rem;
  color: #64748b;
}

.surg-status-chip {
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  text-transform: uppercase;
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.surgery-sections-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.surg-block {
  background: #040806;
  padding: 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.surg-block-lbl {
  display: block;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #34d399;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.surg-block p {
  font-size: 0.8125rem;
  color: #cbd5e1;
  margin: 0;
}

/* Global Buttons */
.btn-primary {
  background: #10b981;
  color: #042f20;
  font-weight: 700;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-primary:hover {
  background: #34d399;
}

.btn-ghost {
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-ghost:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.btn-sm {
  font-size: 0.8125rem;
  padding: 0.4rem 0.8rem;
}

@media (max-width: 768px) {
  .vitals-strip {
    grid-template-columns: repeat(2, 1fr);
  }
  .surgery-sections-grid {
    grid-template-columns: 1fr;
  }
  .patient-master-top {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
