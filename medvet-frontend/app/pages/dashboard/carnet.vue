<template>
  <div class="carnet-page">
    <div class="carnet-glow-ambient"></div>

    <div class="carnet-inner">

      <!-- Header -->
      <div class="carnet-header">
        <div>
          <div class="carnet-badge-row">
            <span class="carnet-eyebrow">Historia Clínica & Pasaporte Veterinario</span>
            <span class="carnet-chip-status">
              <span class="chip-dot"></span>
              Microchip ISO Vinculado
            </span>
          </div>
          <h1 class="carnet-title">Carnet Médico Digital</h1>
          <p class="carnet-subtitle">
            Credencial oficial con código QR y esquema completo de inmunización para controles clínicos y viajes.
          </p>
        </div>

        <div class="carnet-header-actions">
          <button type="button" @click="isPrintModalOpen = true" class="btn-ghost carnet-header-btn">
            <span>🖨️</span>
            <span>Imprimir Carnet (PDF A4)</span>
          </button>
          <NuxtLink :to="`/book?pet=${currentPet?.id || '1'}`" class="btn-primary carnet-header-btn">
            <span>＋</span>
            <span>Agendar Consulta</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Printable A4 Dual-Face Credential Modal -->
      <PrintableCarnetModal
        :is-open="isPrintModalOpen"
        :pet="currentPet"
        @close="isPrintModalOpen = false"
      />

      <!-- Pet Switcher Tabs -->
      <div class="pet-tabs" v-if="petsList.length">
        <button
          v-for="pet in petsList"
          :key="pet.id"
          type="button"
          @click="selectedPetId = pet.id"
          :class="['pet-tab-btn', selectedPetId === pet.id ? 'pet-tab-btn--active' : '']"
        >
          <span class="pet-tab-emoji">{{ getSpeciesEmoji(pet.species) }}</span>
          <span class="pet-tab-name">{{ pet.name }}</span>
          <span class="pet-tab-breed">({{ pet.species }})</span>
        </button>
      </div>

      <!-- Main Carnet Layout -->
      <div v-if="currentPet" class="carnet-layout">

        <!-- Left Column: 3D Flip Card -->
        <div class="carnet-card-col">
          <PetCard :pet="currentPet" />
          <div class="flip-helper-box">
            <span class="flip-icon">🔄</span>
            <span>Tocá la tarjeta para girar y ver el código QR de escaneo rápido</span>
          </div>
        </div>

        <!-- Right Column: Medical Record Details -->
        <div class="carnet-details-col">

          <!-- Patient Summary Card -->
          <div class="carnet-panel">
            <div class="panel-head">
              <span class="panel-icon">📋</span>
              <h2 class="panel-title">Ficha Médica del Paciente</h2>
            </div>

            <div class="patient-grid">
              <div class="patient-item">
                <span class="p-lbl">Nombre</span>
                <span class="p-val">{{ currentPet.name }}</span>
              </div>
              <div class="patient-item">
                <span class="p-lbl">Especie & Raza</span>
                <span class="p-val">{{ currentPet.species }} · {{ currentPet.breed || 'Mestizo' }}</span>
              </div>
              <div class="patient-item">
                <span class="p-lbl">Edad Registrada</span>
                <span class="p-val font-mono-numbers">{{ currentPet.age || 4 }} años</span>
              </div>
              <div class="patient-item">
                <span class="p-lbl">Peso Corporal</span>
                <span class="p-val font-mono-numbers">{{ currentPet.weight || 28.5 }} kg</span>
              </div>
              <div class="patient-item">
                <span class="p-lbl">Sexo</span>
                <span class="p-val">{{ currentPet.sex === 'H' ? 'Hembra' : 'Macho' }}</span>
              </div>
              <div class="patient-item">
                <span class="p-lbl">Microchip ISO 11784</span>
                <span class="p-val font-mono-numbers p-val--mint">{{ currentPet.chip || 'AR-98214-998' }}</span>
              </div>
            </div>
          </div>

          <!-- Vaccine Ledger -->
          <div class="carnet-panel">
            <div class="panel-head">
              <span class="panel-icon">💉</span>
              <div>
                <h2 class="panel-title">Esquema de Vacunación & Inmunización</h2>
                <p class="panel-sub">Registro oficial firmado por el cuerpo médico MedVet</p>
              </div>
            </div>

            <div class="vaccine-ledger">
              <div
                v-for="vac in currentVaccines"
                :key="vac.name"
                class="vac-entry"
              >
                <div class="vac-entry-left">
                  <span :class="['vac-status-icon', vac.status === 'ok' ? 'vac-status-icon--ok' : 'vac-status-icon--warning']">
                    {{ vac.status === 'ok' ? '✓' : '⚠️' }}
                  </span>
                  <div>
                    <span class="vac-title">{{ vac.name }}</span>
                    <div class="vac-meta font-mono-numbers">
                      <span>Aplicada: {{ vac.appliedDate }}</span>
                      <span v-if="vac.nextDue">· Próximo Refuerzo: {{ vac.nextDue }}</span>
                    </div>
                  </div>
                </div>

                <div class="vac-entry-right">
                  <span class="vac-vet">{{ vac.vet }}</span>
                  <span :class="['vac-pill', vac.status === 'ok' ? 'vac-pill--ok' : 'vac-pill--warning']">
                    {{ vac.status === 'ok' ? 'Al Día' : 'Por Vencer' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Deworming & Antiparasitic -->
          <div class="carnet-panel">
            <div class="panel-head">
              <span class="panel-icon">🛡️</span>
              <div>
                <h2 class="panel-title">Control Antiparasitario</h2>
                <p class="panel-sub">Desparasitación interna y pipetas externas</p>
              </div>
            </div>

            <div class="deworm-grid">
              <div class="deworm-card">
                <span class="deworm-type">Desparasitación Interna (Comprimidos)</span>
                <span class="deworm-date font-mono-numbers">Última dosis: 01/07/2026</span>
                <span class="deworm-status font-bold">Estado: Protegido hasta Octubre 2026</span>
              </div>
              <div class="deworm-card">
                <span class="deworm-type">Pipeta Externa (Pulgas y Garrapatas)</span>
                <span class="deworm-date font-mono-numbers">Última dosis: 05/08/2026</span>
                <span class="deworm-status font-bold">Estado: Vigente hasta Septiembre 2026</span>
              </div>
            </div>
          </div>

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

const authStore = useAuthStore()
const route = useRoute()

const defaultPets = [
  {
    id: '1',
    name: 'Thor',
    species: 'Perro',
    breed: 'Golden Retriever',
    age: 4,
    weight: 28.5,
    sex: 'M',
    chip: 'AR-98214-998',
    ownerName: 'Juan Pérez'
  },
  {
    id: '2',
    name: 'Luna',
    species: 'Gato',
    breed: 'Siamés',
    age: 2,
    weight: 4.1,
    sex: 'H',
    chip: 'AR-33910-104',
    ownerName: 'Juan Pérez'
  }
]

const petsList = ref(defaultPets)
const selectedPetId = ref('1')
const isPrintModalOpen = ref(false)

const currentPet = computed(() => {
  return petsList.value.find(p => String(p.id) === String(selectedPetId.value)) || petsList.value[0]
})

const dogVaccines = [
  { name: 'Vacuna Séxtuple Canina (DHPPiL)', appliedDate: '15/03/2026', nextDue: '15/03/2027', vet: 'Dr. Mateo Silva (MP 4821)', status: 'ok' },
  { name: 'Vacuna Antirrábica Obligatoria', appliedDate: '20/09/2025', nextDue: '20/09/2026', vet: 'Dr. Mateo Silva (MP 4821)', status: 'warning' },
  { name: 'Vacuna Giardia & Coronavirus', appliedDate: '10/05/2026', nextDue: '10/05/2027', vet: 'Dra. Camila Torres (MP 5190)', status: 'ok' },
  { name: 'Traqueobronquitis Infecciosa (Tos de las Perreras)', appliedDate: '02/02/2026', nextDue: '02/02/2027', vet: 'Dr. Mateo Silva (MP 4821)', status: 'ok' }
]

const catVaccines = [
  { name: 'Vacuna Triple Felina (Trivalente)', appliedDate: '10/04/2026', nextDue: '10/04/2027', vet: 'Dra. Camila Torres (MP 5190)', status: 'ok' },
  { name: 'Vacuna Antirrábica Felina', appliedDate: '10/04/2026', nextDue: '10/04/2027', vet: 'Dra. Camila Torres (MP 5190)', status: 'ok' },
  { name: 'Leucemia Viral Felina (FeLV)', appliedDate: '10/04/2026', nextDue: '10/04/2027', vet: 'Dra. Camila Torres (MP 5190)', status: 'ok' }
]

const currentVaccines = computed(() => {
  return (currentPet.value?.species || '').toLowerCase().includes('gato') ? catVaccines : dogVaccines
})

const getSpeciesEmoji = (species) => {
  const s = (species || '').toLowerCase()
  if (s.includes('perro')) return '🐶'
  if (s.includes('gato')) return '🐱'
  if (s.includes('ave')) return '🦜'
  if (s.includes('conejo')) return '🐰'
  return '🐾'
}

const handlePrint = () => {
  if (typeof window !== 'undefined') window.print()
}

onMounted(async () => {
  if (route.query.pet) {
    selectedPetId.value = String(route.query.pet)
  }
  try {
    const { $feathers } = useNuxtApp()
    if ($feathers && authStore.user?.id) {
      const petRes = await $feathers.service('pets').find({
        query: { user_id: authStore.user.id }
      })
      const serverPets = petRes.data || petRes
      if (serverPets && serverPets.length) {
        petsList.value = serverPets
        if (!route.query.pet) selectedPetId.value = serverPets[0].id
      }
    }
  } catch {
    // Keep fallback pets
  }
})
</script>

<style scoped>
.carnet-page {
  position: relative;
  min-height: 85vh;
  padding: 3.5rem 1.5rem 6rem;
  background-color: var(--color-cream-100);
  overflow: hidden;
}

:global(.dark) .carnet-page {
  background-color: #040706;
}

.carnet-glow-ambient {
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

.carnet-inner {
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
.carnet-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.carnet-badge-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.carnet-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #00a86b;
}

:global(.dark) .carnet-eyebrow { color: #00f59b; }

.carnet-chip-status {
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

:global(.dark) .carnet-chip-status {
  background: rgba(0, 245, 155, 0.12);
  color: #00f59b;
}

.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00f59b;
  box-shadow: 0 0 6px #00f59b;
}

.carnet-title {
  font-family: var(--font-display);
  font-size: clamp(1.85rem, 3.5vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--color-ink-900);
  margin: 0 0 0.4rem;
}

:global(.dark) .carnet-title { color: #f1faf5; }

.carnet-subtitle {
  font-size: 0.9375rem;
  color: var(--color-ink-500);
  margin: 0;
  max-width: 600px;
}

:global(.dark) .carnet-subtitle { color: #8ca395; }

.carnet-header-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.carnet-header-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.75rem 1.35rem;
  font-size: 0.875rem;
}

/* Pet Switcher */
.pet-tabs {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.pet-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1.15rem;
  border-radius: 14px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-50);
  cursor: pointer;
  transition: all 0.18s ease;
  font-family: var(--font-body);
}

.pet-tab-btn:hover {
  border-color: #00a86b;
  transform: translateY(-2px);
}

.pet-tab-btn--active {
  background: #00a86b;
  border-color: #00a86b;
  color: #fff !important;
  box-shadow: 0 4px 16px rgba(0, 168, 107, 0.35);
}

:global(.dark) .pet-tab-btn {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.18);
  color: #d6e8de;
}

:global(.dark) .pet-tab-btn:hover { border-color: #00f59b; }

:global(.dark) .pet-tab-btn--active {
  background: #00f59b;
  border-color: #00f59b;
  color: #040706 !important;
  box-shadow: 0 0 20px rgba(0, 245, 155, 0.4);
}

.pet-tab-emoji { font-size: 1.25rem; }
.pet-tab-name { font-weight: 700; font-size: 0.9375rem; }
.pet-tab-breed { font-size: 0.75rem; opacity: 0.8; }

/* Carnet Layout */
.carnet-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 900px) { .carnet-layout { grid-template-columns: 1fr; } }

.carnet-card-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.flip-helper-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-ink-500);
  background: var(--color-cream-50);
  border: 1px dashed var(--color-cream-300);
  border-radius: 12px;
  padding: 0.65rem 0.95rem;
  text-align: center;
}

:global(.dark) .flip-helper-box {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.2);
  color: #8ca395;
}

.flip-icon { font-size: 1rem; }

/* Details Panels */
.carnet-details-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.carnet-panel {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 24px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 10px 30px -8px rgba(0, 80, 50, 0.06);
}

:global(.dark) .carnet-panel {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.16);
  box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.7);
}

.panel-head {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-cream-200);
}

:global(.dark) .panel-head { border-bottom-color: rgba(0, 245, 155, 0.12); }

.panel-icon { font-size: 1.35rem; }

.panel-title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
}

:global(.dark) .panel-title { color: #f1faf5; }

.panel-sub {
  font-size: 0.72rem;
  color: var(--color-ink-400);
  margin: 0;
}

/* Patient Grid */
.patient-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

@media (max-width: 600px) { .patient-grid { grid-template-columns: repeat(2, 1fr); } }

.patient-item { display: flex; flex-direction: column; gap: 0.15rem; }

.p-lbl {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-ink-400);
  font-weight: 600;
}

.p-val {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.9375rem;
  color: var(--color-ink-900);
}

:global(.dark) .p-val { color: #f1faf5; }
.p-val--mint { color: #00a86b; }
:global(.dark) .p-val--mint { color: #00f59b; }

/* Vaccine Ledger */
.vaccine-ledger {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.vac-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: var(--color-cream-100);
  border: 1px solid var(--color-cream-300);
  flex-wrap: wrap;
  gap: 0.65rem;
}

:global(.dark) .vac-entry {
  background: rgba(16, 28, 22, 0.6);
  border-color: rgba(0, 245, 155, 0.15);
}

.vac-entry-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.vac-status-icon {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.vac-status-icon--ok { background: rgba(0, 168, 107, 0.15); color: #007a4d; }
:global(.dark) .vac-status-icon--ok { background: rgba(0, 245, 155, 0.18); color: #00f59b; }

.vac-status-icon--warning { background: rgba(255, 122, 0, 0.15); color: var(--color-joy-tangerine); }

.vac-title {
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-ink-900);
}

:global(.dark) .vac-title { color: #f1faf5; }

.vac-meta {
  font-size: 0.72rem;
  color: var(--color-ink-500);
}

:global(.dark) .vac-meta { color: #8ca395; }

.vac-entry-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.vac-vet {
  font-size: 0.72rem;
  color: var(--color-ink-400);
}

.vac-pill {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
}

.vac-pill--ok {
  background: rgba(0, 168, 107, 0.12);
  color: #007a4d;
}

:global(.dark) .vac-pill--ok {
  background: rgba(0, 245, 155, 0.15);
  color: #00f59b;
}

.vac-pill--warning {
  background: rgba(255, 122, 0, 0.15);
  color: var(--color-joy-tangerine);
}

/* Deworming */
.deworm-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 600px) { .deworm-grid { grid-template-columns: 1fr; } }

.deworm-card {
  padding: 1rem;
  border-radius: 14px;
  background: var(--color-cream-100);
  border: 1px solid var(--color-cream-300);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

:global(.dark) .deworm-card {
  background: rgba(16, 28, 22, 0.6);
  border-color: rgba(0, 245, 155, 0.15);
}

.deworm-type {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-ink-900);
}

:global(.dark) .deworm-type { color: #f1faf5; }

.deworm-date {
  font-size: 0.72rem;
  color: var(--color-ink-500);
}

:global(.dark) .deworm-date { color: #8ca395; }

.deworm-status {
  font-size: 0.72rem;
  color: #00a86b;
  margin-top: 0.25rem;
}

:global(.dark) .deworm-status { color: #00f59b; }
</style>
