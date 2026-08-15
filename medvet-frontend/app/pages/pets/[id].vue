<template>
  <div class="pet-record-page">
    <div class="record-glow-ambient"></div>

    <div class="record-inner">

      <!-- Breadcrumbs & Nav -->
      <div class="record-top-nav">
        <NuxtLink to="/pets" class="back-link">
          ← Volver a Mis Mascotas
        </NuxtLink>
        <div class="record-top-actions">
          <NuxtLink :to="`/dashboard/carnet?pet=${pet.id}`" class="btn-ghost btn-sm">
            🪪 Carnet QR
          </NuxtLink>
          <NuxtLink :to="`/book?pet=${pet.id}`" class="btn-primary btn-sm">
            ＋ Agendar Consulta
          </NuxtLink>
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
                <span class="health-chip">
                  <span class="chip-pulse"></span>
                  Estado Clínico Estable
                </span>
              </div>
              <h1 class="patient-name">{{ pet.name }}</h1>
              <p class="patient-sub">{{ pet.breed }} · Tutor: {{ pet.tutorName }}</p>
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
              <span class="vb-val">{{ pet.weight }} kg</span>
              <span class="vb-lbl">Peso Actual</span>
            </div>
          </div>

          <div class="vital-block">
            <span class="vb-icon">🎂</span>
            <div>
              <span class="vb-val">{{ pet.age }} años</span>
              <span class="vb-lbl">Edad Registrada</span>
            </div>
          </div>

          <div class="vital-block">
            <span class="vb-icon">🌡️</span>
            <div>
              <span class="vb-val">38.4 °C</span>
              <span class="vb-lbl">Temperatura Media</span>
            </div>
          </div>

          <div class="vital-block">
            <span class="vb-icon">💓</span>
            <div>
              <span class="vb-val">96 lpm</span>
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
          <span v-if="tab.count" class="tab-badge font-mono-numbers">{{ tab.count }}</span>
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
          <button @click="showAddNoteModal = true" class="btn-ghost btn-sm">
            ＋ Añadir Evolución
          </button>
        </div>

        <div class="timeline-wrap">
          <div
            v-for="(ev, idx) in clinicalEvolutions"
            :key="idx"
            class="timeline-item"
          >
            <div class="timeline-dot-wrap">
              <div class="timeline-dot"></div>
              <div class="timeline-line" v-if="idx < clinicalEvolutions.length - 1"></div>
            </div>

            <div class="timeline-card">
              <div class="timeline-card-header">
                <div>
                  <span class="ev-date font-mono-numbers">📅 {{ ev.date }} — {{ ev.time }} hs</span>
                  <h3 class="ev-service">{{ ev.service }}</h3>
                </div>
                <span class="ev-type-badge">{{ ev.type }}</span>
              </div>

              <div class="ev-body">
                <div class="ev-section">
                  <span class="ev-sec-title">Anamnesis & Motivo:</span>
                  <p class="ev-sec-text">{{ ev.symptoms }}</p>
                </div>

                <div class="ev-section">
                  <span class="ev-sec-title">Examen Físico & Diagnóstico:</span>
                  <p class="ev-sec-text ev-sec-text--diag">{{ ev.diagnosis }}</p>
                </div>

                <div class="ev-section" v-if="ev.treatment">
                  <span class="ev-sec-title">Indicación Terapéutica:</span>
                  <p class="ev-sec-text">{{ ev.treatment }}</p>
                </div>
              </div>

              <div class="ev-footer">
                <div class="doc-badge">
                  <span class="doc-avatar">👨‍⚕️</span>
                  <div>
                    <span class="doc-name">{{ ev.doctor }}</span>
                    <span class="doc-reg font-mono-numbers">Matrícula Profesional Nº {{ ev.doctorReg }}</span>
                  </div>
                </div>
                <span class="signed-badge">✔ Firma Digital Verificada</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ────────────────────────────────────────
           TAB 2: VACUNAS & DESPARASITACIÓN
      ──────────────────────────────────────── -->
      <div v-if="activeTab === 'vacunas'" class="tab-content">
        <div class="tab-content-header">
          <div>
            <h2 class="tab-title">Plan Integral de Vacunación</h2>
            <p class="tab-sub">Esquema oficial de inmunización certificado por MedVet</p>
          </div>
        </div>

        <div class="vaccines-grid">
          <div
            v-for="vac in vaccinesList"
            :key="vac.name"
            class="vac-card"
          >
            <div class="vac-card-top">
              <div class="vac-icon-wrap">💉</div>
              <span :class="['vac-status-pill', vac.status === 'ok' ? 'vac-status-pill--ok' : 'vac-status-pill--warn']">
                {{ vac.status === 'ok' ? 'Al Día' : 'Refuerzo Próximo' }}
              </span>
            </div>

            <h3 class="vac-name">{{ vac.name }}</h3>
            <p class="vac-desc">{{ vac.description }}</p>

            <div class="vac-meta-box font-mono-numbers">
              <div class="vmb-row">
                <span>Última aplicación:</span>
                <strong>{{ vac.date }}</strong>
              </div>
              <div class="vmb-row">
                <span>Próximo refuerzo:</span>
                <strong class="vmb-due">{{ vac.nextDue }}</strong>
              </div>
              <div class="vmb-row">
                <span>Lote de vacuna:</span>
                <span>{{ vac.lot }}</span>
              </div>
            </div>

            <div class="vac-card-footer">
              <span class="vac-vet">{{ vac.doctor }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ────────────────────────────────────────
           TAB 3: RECETAS FARMACOLÓGICAS
      ──────────────────────────────────────── -->
      <div v-if="activeTab === 'recetas'" class="tab-content">
        <div class="tab-content-header">
          <div>
            <h2 class="tab-title">Recetas Farmacológicas Digitales</h2>
            <p class="tab-sub">Prescripciones médicas activas e históricas con posología</p>
          </div>
        </div>

        <div class="prescriptions-list">
          <div
            v-for="rx in prescriptions"
            :key="rx.id"
            class="rx-card"
          >
            <div class="rx-header">
              <div class="rx-brand">
                <span class="rx-symbol">Rx</span>
                <div>
                  <h3 class="rx-title">Receta Médica Nº {{ rx.code }}</h3>
                  <span class="rx-date font-mono-numbers">Fecha de Emisión: {{ rx.date }}</span>
                </div>
              </div>
              <button @click="handlePrintRx(rx)" class="btn-ghost btn-xs">
                🖨️ Imprimir Receta
              </button>
            </div>

            <div class="rx-drugs-list">
              <div
                v-for="med in rx.medications"
                :key="med.name"
                class="drug-item"
              >
                <div class="drug-name-row">
                  <strong class="drug-name">{{ med.name }}</strong>
                  <span class="drug-sub">{{ med.activeIngredient }} ({{ med.concentration }})</span>
                </div>
                <div class="drug-posology">
                  <strong>Posología:</strong> {{ med.dosage }} · Duración: {{ med.duration }}
                </div>
                <div class="drug-notes font-italic" v-if="med.instructions">
                  Indicación: {{ med.instructions }}
                </div>
              </div>
            </div>

            <div class="rx-footer">
              <div class="rx-doc-info">
                <span>Prescrito por: <strong>{{ rx.doctor }}</strong> (Matrícula {{ rx.doctorReg }})</span>
              </div>
              <span class="rx-valid-badge">Válido en farmacias veterinarias de todo el país</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ────────────────────────────────────────
           TAB 4: ESTUDIOS & LABORATORIO
      ──────────────────────────────────────── -->
      <div v-if="activeTab === 'estudios'" class="tab-content">
        <div class="tab-content-header">
          <div>
            <h2 class="tab-title">Estudios Complementarios & Laboratorio</h2>
            <p class="tab-sub">Resultados de sangre, ecografías, radiografías y biopsias</p>
          </div>
        </div>

        <div class="lab-grid">
          <div
            v-for="lab in labStudies"
            :key="lab.id"
            class="lab-card"
          >
            <div class="lab-card-top">
              <span class="lab-icon">{{ lab.icon }}</span>
              <span class="lab-status-badge">Informe Aprobado</span>
            </div>

            <h3 class="lab-title">{{ lab.title }}</h3>
            <p class="lab-date font-mono-numbers">Realizado el {{ lab.date }}</p>

            <div class="lab-result-preview">
              <strong>Resultado clínico:</strong>
              <p>{{ lab.summary }}</p>
            </div>

            <button type="button" @click="handleDownloadLab(lab)" class="btn-ghost btn-sm lab-dl-btn">
              📄 Descargar Informe PDF
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal Añadir Nota Evolución -->
    <div v-if="showAddNoteModal" class="modal-backdrop" @click.self="showAddNoteModal = false">
      <div class="modal-box">
        <div class="modal-header">
          <div>
            <span class="modal-eyebrow">Historia Clínica</span>
            <h2 class="modal-title">Añadir Evolución Médica</h2>
          </div>
          <button @click="showAddNoteModal = false" class="modal-close-btn">✕</button>
        </div>

        <form @submit.prevent="handleAddEvolution" class="modal-form">
          <div class="form-group">
            <label class="form-label">Servicio / Tipo de Consulta</label>
            <input v-model="newEvolution.service" type="text" placeholder="Ej. Control Post-Operatorio, Consulta Dermatológica" class="form-input" required />
          </div>

          <div class="form-group">
            <label class="form-label">Motivo o Síntomas Reportados</label>
            <textarea v-model="newEvolution.symptoms" class="form-input" rows="2" placeholder="Observaciones del tutor..." required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Diagnóstico & Examen Físico</label>
            <textarea v-model="newEvolution.diagnosis" class="form-input" rows="2" placeholder="Hallazgos clínicos..." required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Tratamiento e Indicaciones</label>
            <textarea v-model="newEvolution.treatment" class="form-input" rows="2" placeholder="Fármacos o cuidados indicados..."></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showAddNoteModal = false" class="btn-ghost">Cancelar</button>
            <button type="submit" class="btn-primary">✓ Asentar en Historia Clínica</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  requiresAuth: true
})

const route = useRoute()
const activeTab = ref('evolucion')
const showAddNoteModal = ref(false)

const recordTabs = [
  { id: 'evolucion', label: 'Evolución & Consultas', icon: '📋', count: 3 },
  { id: 'vacunas', label: 'Plan de Vacunación', icon: '💉', count: 4 },
  { id: 'recetas', label: 'Recetas Digitales', icon: '💊', count: 2 },
  { id: 'estudios', label: 'Estudios & Laboratorio', icon: '🔬', count: 2 }
]

const pet = ref({
  id: route.params.id || '1',
  name: 'Thor',
  species: 'Perro',
  breed: 'Golden Retriever',
  age: 4,
  weight: 28.5,
  sex: 'M',
  chip: 'AR-98214-998',
  tutorName: 'Juan Pérez'
})

const clinicalEvolutions = ref([
  {
    date: '10/06/2026',
    time: '11:15',
    service: 'Perfil Bioquímico & Examen Rutinario',
    type: 'Consulta de Control',
    symptoms: 'Control preventivo anual solicitado por tutor. Paciente normotérmico y activo.',
    diagnosis: 'Sin alteraciones a la palpación abdominal ni auscultación cardiopulmonar. Parámetros de laboratorio normales.',
    treatment: 'Continuar con dieta balanceada y pipeta antiparasitaria mensual.',
    doctor: 'Dr. Mateo Silva',
    doctorReg: '4821'
  },
  {
    date: '22/01/2026',
    time: '16:30',
    service: 'Consulta Dermatológica Especializada',
    type: 'Urgencia Menor',
    symptoms: 'Prurito intenso en zona lumbar y base de cola con alopecia focal.',
    diagnosis: 'Dermatitis alérgica por picadura de pulga (DAPP) confirmada con examen tricológico.',
    treatment: 'Apoyar con prednisolona 10mg por 5 días + baños con shampoo de clorhexidina.',
    doctor: 'Dr. Mateo Silva',
    doctorReg: '4821'
  },
  {
    date: '15/09/2025',
    time: '09:45',
    service: 'Vacunación Séxtuple Canina Anual',
    type: 'Inmunización',
    symptoms: 'Asiste para refuerzo de calendario anual obligatorio.',
    diagnosis: 'Paciente apto para vacunación sin signos de enfermedad infecciosa.',
    treatment: 'Dosis aplicada sin incidencias. Próximo control en 12 meses.',
    doctor: 'Dra. Camila Torres',
    doctorReg: '5190'
  }
])

const vaccinesList = [
  {
    name: 'Vacuna Séxtuple Canina (DHPPiL)',
    description: 'Protección contra Parvovirus, Moquillo, Hepatitis, Adenovirus, Parainfluenza y Leptospira.',
    date: '15/03/2026',
    nextDue: '15/03/2027',
    lot: 'LT-99214-A',
    doctor: 'Dr. Mateo Silva',
    status: 'ok'
  },
  {
    name: 'Vacuna Antirrábica Obligatoria',
    description: 'Inmunización contra virus rábico con certificado oficial y estampilla del colegio veterinario.',
    date: '20/09/2025',
    nextDue: '20/09/2026',
    lot: 'LT-33010-B',
    doctor: 'Dr. Mateo Silva',
    status: 'warn'
  },
  {
    name: 'Vacuna Giardia & Coronavirus',
    description: 'Protección gastroentérica para perros con acceso frecuente a parques y paseos compartidos.',
    date: '10/05/2026',
    nextDue: '10/05/2027',
    lot: 'LT-88120-C',
    doctor: 'Dra. Camila Torres',
    status: 'ok'
  },
  {
    name: 'Traqueobronquitis Infecciosa (Tos de las Perreras)',
    description: 'Vacuna intranasal contra Bordetella bronchiseptica.',
    date: '02/02/2026',
    nextDue: '02/02/2027',
    lot: 'LT-55110-D',
    doctor: 'Dr. Mateo Silva',
    status: 'ok'
  }
]

const prescriptions = [
  {
    id: 'rx-1',
    code: 'RX-2026-0482',
    date: '22/01/2026',
    doctor: 'Dr. Mateo Silva',
    doctorReg: '4821',
    medications: [
      {
        name: 'Apoquel / Oclacitinib',
        activeIngredient: 'Oclacitinib Maleato',
        concentration: '16 mg',
        dosage: '1 comprimido cada 12 horas durante 5 días, luego 1 comprimido diario',
        duration: '14 días',
        instructions: 'Administrar con o sin alimento para control del prurito dermatológico.'
      },
      {
        name: 'Shampoo Clorhexidina 3% con Aloe',
        activeIngredient: 'Clorhexidina Digluconato',
        concentration: '3%',
        dosage: 'Baños cada 3 días dejando actuar la espuma 10 minutos',
        duration: '3 semanas',
        instructions: 'Enjuagar con abundante agua tibia.'
      }
    ]
  }
]

const labStudies = [
  {
    id: 1,
    icon: '🩸',
    title: 'Hemograma Completo & Perfil Bioquímico',
    date: '10/06/2026',
    summary: 'Glóbulos rojos, blancos y plaquetas en rango óptimo. GPT/ALT y Creatinina normales.'
  },
  {
    id: 2,
    icon: '📸',
    title: 'Ecografía Abdominal Completa',
    date: '10/06/2026',
    summary: 'Hígado, bazo y riñones sin lesiones focales ni alteraciones en la ecogenicidad.'
  }
]

const newEvolution = reactive({
  service: '',
  symptoms: '',
  diagnosis: '',
  treatment: ''
})

const getSpeciesEmoji = (species) => {
  const s = (species || '').toLowerCase()
  if (s.includes('perro')) return '🐶'
  if (s.includes('gato')) return '🐱'
  if (s.includes('ave')) return '🦜'
  if (s.includes('conejo')) return '🐰'
  return '🐾'
}

const handleAddEvolution = () => {
  const now = new Date()
  clinicalEvolutions.value.unshift({
    date: now.toLocaleDateString('es-AR'),
    time: now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    service: newEvolution.service,
    type: 'Consulta Ambulatoria',
    symptoms: newEvolution.symptoms,
    diagnosis: newEvolution.diagnosis,
    treatment: newEvolution.treatment,
    doctor: 'Dr. Mateo Silva',
    doctorReg: '4821'
  })
  showAddNoteModal.value = false
  Object.assign(newEvolution, { service: '', symptoms: '', diagnosis: '', treatment: '' })
}

const handlePrintRx = (rx) => {
  if (typeof window !== 'undefined') window.print()
}

const handleDownloadLab = (lab) => {
  alert(`Descargando informe oficial de ${lab.title}...`)
}
</script>

<style scoped>
.pet-record-page {
  position: relative;
  min-height: 85vh;
  padding: 3rem 1.5rem 6rem;
  background-color: var(--color-cream-100);
  overflow: hidden;
}

:global(.dark) .pet-record-page {
  background-color: #040706;
}

.record-glow-ambient {
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

.record-inner {
  position: relative;
  z-index: 1;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 2.5vw, 2.5rem);
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Nav */
.record-top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.back-link {
  font-size: 0.84rem;
  font-weight: 700;
  color: #00a86b;
  text-decoration: none;
}

:global(.dark) .back-link { color: #00f59b; }

.record-top-actions {
  display: flex;
  gap: 0.65rem;
}

/* Master Header Card */
.patient-master-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 24px;
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 12px 36px -8px rgba(0, 80, 50, 0.08);
}

:global(.dark) .patient-master-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.18);
  box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.7);
}

.patient-master-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.patient-id-block {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.patient-avatar-box {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 20px;
  background: var(--color-cream-200);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  flex-shrink: 0;
}

:global(.dark) .patient-avatar-box {
  background: rgba(16, 28, 22, 0.9);
  border: 1.5px solid rgba(0, 245, 155, 0.25);
}

.patient-badges {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.species-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  background: rgba(0, 168, 107, 0.12);
  color: #007a4d;
}

:global(.dark) .species-badge {
  background: rgba(0, 245, 155, 0.15);
  color: #00f59b;
}

.health-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--color-ink-600);
}

:global(.dark) .health-chip { color: #d6e8de; }

.chip-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00f59b;
  box-shadow: 0 0 6px #00f59b;
}

.patient-name {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-ink-900);
  margin: 0;
  line-height: 1.1;
}

:global(.dark) .patient-name { color: #f1faf5; }

.patient-sub {
  font-size: 0.8125rem;
  color: var(--color-ink-500);
  margin: 0.2rem 0 0;
}

:global(.dark) .patient-sub { color: #cbd5e1; }

.patient-qr-box {
  padding: 0.85rem 1.25rem;
  border-radius: 16px;
  background: var(--color-cream-100);
  border: 1px dashed var(--color-cream-300);
  text-align: right;
}

:global(.dark) .patient-qr-box {
  background: rgba(16, 28, 22, 0.7);
  border-color: rgba(0, 245, 155, 0.2);
}

.qr-lbl {
  display: block;
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--color-ink-400);
  letter-spacing: 0.08em;
}

.qr-code {
  display: block;
  font-size: 0.9375rem;
  font-weight: 800;
  color: #00a86b;
  margin-top: 0.15rem;
}

:global(.dark) .qr-code { color: #00f59b; }

/* Vitals Strip */
.vitals-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1.15rem 1.5rem;
  background: var(--color-cream-100);
  border-radius: 16px;
}

@media (max-width: 768px) { .vitals-strip { grid-template-columns: repeat(2, 1fr); } }

:global(.dark) .vitals-strip { background: rgba(16, 28, 22, 0.6); }

.vital-block {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.vb-icon { font-size: 1.4rem; }
.vb-val { display: block; font-size: 1.125rem; font-weight: 800; color: var(--color-ink-900); }
:global(.dark) .vb-val { color: #f1faf5; }
.vb-lbl { display: block; font-size: 0.68rem; color: var(--color-ink-400); font-family: var(--font-body); }

/* Tabs */
.record-tabs {
  display: flex;
  gap: 0.65rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.record-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 14px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-50);
  font-family: var(--font-body);
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--color-ink-700);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.18s ease;
}

.record-tab-btn:hover { border-color: #00a86b; color: #007a4d; }

.record-tab-btn--active {
  background: #00a86b;
  border-color: #00a86b;
  color: #fff;
}

:global(.dark) .record-tab-btn {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.15);
  color: #d6e8de;
}

:global(.dark) .record-tab-btn:hover { border-color: #00f59b; color: #00f59b; }

:global(.dark) .record-tab-btn--active {
  background: #00f59b;
  border-color: #00f59b;
  color: #040706;
  box-shadow: 0 0 16px rgba(0, 245, 155, 0.4);
}

.tab-badge {
  font-size: 0.68rem;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.1);
}

:global(.dark) .record-tab-btn--active .tab-badge {
  background: rgba(0, 0, 0, 0.2);
}

/* Tab Contents */
.tab-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tab-content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
}

.tab-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
}

:global(.dark) .tab-title { color: #f1faf5; }

.tab-sub {
  font-size: 0.8125rem;
  color: var(--color-ink-500);
  margin: 0.2rem 0 0;
}

:global(.dark) .tab-sub { color: #cbd5e1; }

/* Timeline */
.timeline-wrap {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.timeline-item {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 1.25rem;
}

.timeline-dot-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-dot {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #00a86b;
  box-shadow: 0 0 10px rgba(0, 168, 107, 0.5);
  margin-top: 0.5rem;
  flex-shrink: 0;
}

:global(.dark) .timeline-dot {
  background: #00f59b;
  box-shadow: 0 0 12px rgba(0, 245, 155, 0.7);
}

.timeline-line {
  width: 2px;
  flex-grow: 1;
  background: var(--color-cream-300);
  margin-top: 0.5rem;
}

:global(.dark) .timeline-line { background: rgba(0, 245, 155, 0.15); }

.timeline-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 8px 24px -6px rgba(0, 80, 50, 0.05);
}

:global(.dark) .timeline-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.16);
}

.timeline-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-cream-200);
}

:global(.dark) .timeline-card-header { border-bottom-color: rgba(0, 245, 155, 0.12); }

.ev-date { font-size: 0.75rem; font-weight: 700; color: #00a86b; }
:global(.dark) .ev-date { color: #00f59b; }

.ev-service {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0.15rem 0 0;
}

:global(.dark) .ev-service { color: #f1faf5; }

.ev-type-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: var(--color-cream-200);
  color: var(--color-ink-700);
}

:global(.dark) .ev-type-badge { background: rgba(16, 28, 22, 0.8); color: #cbd5e1; }

.ev-body { display: flex; flex-direction: column; gap: 0.65rem; }
.ev-sec-title { font-size: 0.72rem; font-weight: 700; color: var(--color-ink-400); text-transform: uppercase; }
.ev-sec-text { font-size: 0.84rem; color: var(--color-ink-700); margin: 0.15rem 0 0; line-height: 1.45; }
:global(.dark) .ev-sec-text { color: #d6e8de; }
.ev-sec-text--diag { color: var(--color-ink-900); font-weight: 600; }
:global(.dark) .ev-sec-text--diag { color: #f1faf5; }

.ev-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--color-cream-200);
}

:global(.dark) .ev-footer { border-top-color: rgba(0, 245, 155, 0.12); }

.doc-badge { display: flex; align-items: center; gap: 0.5rem; }
.doc-avatar { font-size: 1.25rem; }
.doc-name { display: block; font-size: 0.78rem; font-weight: 700; color: var(--color-ink-900); }
:global(.dark) .doc-name { color: #f1faf5; }
.doc-reg { display: block; font-size: 0.68rem; color: var(--color-ink-400); }

.signed-badge {
  font-size: 0.7rem;
  font-weight: 600;
  color: #00a86b;
}

:global(.dark) .signed-badge { color: #00f59b; }

/* Vaccines Tab */
.vaccines-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

@media (max-width: 700px) { .vaccines-grid { grid-template-columns: 1fr; } }

.vac-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

:global(.dark) .vac-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.16);
}

.vac-card-top { display: flex; justify-content: space-between; align-items: center; }
.vac-icon-wrap { font-size: 1.4rem; }

.vac-status-pill {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
}

.vac-status-pill--ok { background: rgba(0, 168, 107, 0.15); color: #007a4d; }
:global(.dark) .vac-status-pill--ok { background: rgba(0, 245, 155, 0.15); color: #00f59b; }
.vac-status-pill--warn { background: rgba(255, 122, 0, 0.15); color: var(--color-joy-tangerine); }

.vac-name {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
}

:global(.dark) .vac-name { color: #f1faf5; }

.vac-desc { font-size: 0.78rem; color: var(--color-ink-500); margin: 0; line-height: 1.4; }
:global(.dark) .vac-desc { color: #cbd5e1; }

.vac-meta-box {
  background: var(--color-cream-100);
  border-radius: 12px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.72rem;
}

:global(.dark) .vac-meta-box { background: rgba(16, 28, 22, 0.6); }

.vmb-row { display: flex; justify-content: space-between; color: var(--color-ink-600); }
:global(.dark) .vmb-row { color: #d6e8de; }
.vmb-due { color: #00a86b; font-weight: 700; }
:global(.dark) .vmb-due { color: #00f59b; }

.vac-card-footer { font-size: 0.72rem; color: var(--color-ink-400); text-align: right; }

/* Prescriptions Tab */
.prescriptions-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.rx-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

:global(.dark) .rx-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.16);
}

.rx-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-cream-200);
}

:global(.dark) .rx-header { border-bottom-color: rgba(0, 245, 155, 0.12); }

.rx-brand { display: flex; align-items: center; gap: 0.75rem; }

.rx-symbol {
  font-family: var(--font-display);
  font-size: 1.65rem;
  font-weight: 800;
  color: #00a86b;
}

:global(.dark) .rx-symbol { color: #00f59b; }

.rx-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
}

:global(.dark) .rx-title { color: #f1faf5; }
.rx-date { font-size: 0.72rem; color: var(--color-ink-400); }

.rx-drugs-list { display: flex; flex-direction: column; gap: 0.75rem; }

.drug-item {
  padding: 0.85rem;
  border-radius: 12px;
  background: var(--color-cream-100);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

:global(.dark) .drug-item { background: rgba(16, 28, 22, 0.6); }

.drug-name-row { display: flex; justify-content: space-between; align-items: baseline; }
.drug-name { font-size: 0.875rem; color: var(--color-ink-900); }
:global(.dark) .drug-name { color: #f1faf5; }
.drug-sub { font-size: 0.72rem; color: var(--color-ink-400); }
.drug-posology { font-size: 0.78rem; color: var(--color-ink-700); }
:global(.dark) .drug-posology { color: #d6e8de; }
.drug-notes { font-size: 0.72rem; color: var(--color-ink-500); }

.rx-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--color-cream-200);
  font-size: 0.75rem;
}

:global(.dark) .rx-footer { border-top-color: rgba(0, 245, 155, 0.12); }
.rx-valid-badge { color: #00a86b; font-weight: 600; font-size: 0.7rem; }
:global(.dark) .rx-valid-badge { color: #00f59b; }

/* Lab Tab */
.lab-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

@media (max-width: 650px) { .lab-grid { grid-template-columns: 1fr; } }

.lab-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

:global(.dark) .lab-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.16);
}

.lab-card-top { display: flex; justify-content: space-between; align-items: center; }
.lab-icon { font-size: 1.4rem; }

.lab-status-badge {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(0, 168, 107, 0.15);
  color: #007a4d;
}

:global(.dark) .lab-status-badge {
  background: rgba(0, 245, 155, 0.15);
  color: #00f59b;
}

.lab-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
}

:global(.dark) .lab-title { color: #f1faf5; }
.lab-date { font-size: 0.72rem; color: var(--color-ink-400); margin: 0; }

.lab-result-preview {
  background: var(--color-cream-100);
  padding: 0.75rem;
  border-radius: 12px;
  font-size: 0.78rem;
  color: var(--color-ink-700);
  flex-grow: 1;
}

:global(.dark) .lab-result-preview { background: rgba(16, 28, 22, 0.6); color: #d6e8de; }
.lab-result-preview p { margin: 0.2rem 0 0; }

.lab-dl-btn { justify-content: center; width: 100%; margin-top: 0.25rem; }

/* Modal */
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
  max-width: 540px;
  padding: 2rem;
  box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.6);
}

:global(.dark) .modal-box {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.modal-eyebrow { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #00a86b; }
:global(.dark) .modal-eyebrow { color: #00f59b; }
.modal-title { font-family: var(--font-display); font-size: 1.35rem; font-weight: 800; color: var(--color-ink-900); margin: 0.2rem 0 0; }
:global(.dark) .modal-title { color: #f1faf5; }
.modal-close-btn { background: transparent; border: none; font-size: 1.25rem; color: var(--color-ink-400); cursor: pointer; }

.modal-form { display: flex; flex-direction: column; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.35rem; }
.form-label { font-size: 0.78rem; font-weight: 600; color: var(--color-ink-700); }
:global(.dark) .form-label { color: #d6e8de; }

.form-input {
  padding: 0.65rem 0.85rem;
  border-radius: 12px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-100);
  font-family: var(--font-body);
  font-size: 0.84rem;
  color: var(--color-ink-900);
  outline: none;
}

:global(.dark) .form-input {
  background: rgba(16, 28, 22, 0.7);
  border-color: rgba(0, 245, 155, 0.2);
  color: #f1faf5;
}

.modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; }
</style>
