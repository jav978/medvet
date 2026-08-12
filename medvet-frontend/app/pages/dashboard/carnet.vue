<template>
  <div class="carnet-page">
    <div class="carnet-inner">

      <!-- Page header -->
      <div class="carnet-page-header">
        <div>
          <span class="page-eyebrow">Historia Clínica Digital</span>
          <h1 class="page-title">Carnet Médico</h1>
          <p class="page-subtitle">El carnet digital de tu mascota contiene su información médica y puede ser escaneado en cualquier visita a la clínica.</p>
        </div>
        <NuxtLink to="/book" class="btn-amber">
          <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>
          Nueva Cita
        </NuxtLink>
      </div>

      <!-- Pet selector (si tiene varias mascotas) -->
      <div class="pet-selector" v-if="pets.length > 1">
        <button
          v-for="pet in pets"
          :key="pet.id"
          :class="['pet-tab', selectedPetId === pet.id ? 'pet-tab--active' : '']"
          @click="selectedPetId = pet.id"
        >
          <span class="pet-tab-emoji">{{ getEmoji(pet.species) }}</span>
          {{ pet.name }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Cargando historial clínico...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="!currentPet" class="empty-state">
        <span class="empty-emoji">🐾</span>
        <h2>No hay mascotas registradas</h2>
        <p>Registrá tu primera mascota al agendar una cita para generar su carnet médico digital.</p>
        <NuxtLink to="/book" class="btn-amber">Agendar Primera Visita</NuxtLink>
      </div>

      <!-- Card + Info panel -->
      <div v-else class="carnet-layout">

        <!-- Flip card -->
        <div class="card-side">
          <PetCard :pet="currentPet" />
          <p class="card-hint">Tocá el carnet para ver el reverso con QR</p>
        </div>

        <!-- Info panel -->
        <div class="info-side">

          <!-- Ficha básica -->
          <div class="info-section">
            <h2 class="info-section-title">📋 Datos del Paciente</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Nombre</span>
                <span class="info-val">{{ currentPet.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Especie / Raza</span>
                <span class="info-val">{{ currentPet.species }}{{ currentPet.breed ? ` · ${currentPet.breed}` : '' }}</span>
              </div>
              <div class="info-item" v-if="currentPet.age">
                <span class="info-label">Edad</span>
                <span class="info-val font-mono-numbers">{{ currentPet.age }} años</span>
              </div>
              <div class="info-item" v-if="currentPet.weight">
                <span class="info-label">Peso</span>
                <span class="info-val font-mono-numbers">{{ currentPet.weight }} kg</span>
              </div>
              <div class="info-item" v-if="currentPet.sex">
                <span class="info-label">Sexo</span>
                <span class="info-val">{{ currentPet.sex === 'M' ? 'Macho' : 'Hembra' }}</span>
              </div>
              <div class="info-item" v-if="currentPet.chip">
                <span class="info-label">Chip ISO</span>
                <span class="info-val font-mono-numbers">{{ currentPet.chip }}</span>
              </div>
            </div>
          </div>

          <!-- Vacunas -->
          <div class="info-section" v-if="currentPet.vaccines?.length">
            <h2 class="info-section-title">💉 Vacunas Registradas</h2>
            <div class="vac-list">
              <div
                v-for="vac in currentPet.vaccines"
                :key="vac.name || vac"
                class="vac-row"
              >
                <span class="vac-check">✓</span>
                <div class="vac-info">
                  <span class="vac-name">{{ vac.name || vac }}</span>
                  <span v-if="vac.date" class="vac-date font-mono-numbers">{{ vac.date }}</span>
                </div>
                <span :class="['vac-status', vac.upToDate !== false ? 'vac-status--ok' : 'vac-status--exp']">
                  {{ vac.upToDate !== false ? 'Al día' : 'Vencida' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Citas recientes -->
          <div class="info-section" v-if="appointments.length">
            <h2 class="info-section-title">🗓 Historial de Citas</h2>
            <div class="apt-history">
              <div
                v-for="apt in appointments.slice(0, 4)"
                :key="apt.id"
                class="apt-hist-row"
              >
                <div class="apt-hist-dot" :class="apt.status === 'completed' ? 'apt-hist-dot--ok' : ''"></div>
                <div class="apt-hist-info">
                  <div class="apt-hist-service">{{ apt.service?.name || 'Consulta' }}</div>
                  <div class="apt-hist-date font-mono-numbers">{{ apt.date }}</div>
                </div>
                <span class="apt-hist-badge">{{ apt.status === 'completed' ? 'Completada' : apt.status }}</span>
              </div>
            </div>
          </div>

          <!-- Download hint -->
          <div class="download-hint">
            <svg viewBox="0 0 20 20" fill="currentColor" class="hint-icon"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            El QR del reverso contiene el historial clínico completo. Presentalo en la clínica para acceso rápido.
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
const loading = ref(true)
const pets = ref([])
const appointments = ref([])
const selectedPetId = ref(null)

const currentPet = computed(() =>
  pets.value.find(p => p.id === selectedPetId.value) || pets.value[0] || null
)

const getEmoji = (species) => {
  const map = { Perro: '🐶', Gato: '🐱', Ave: '🦜', Conejo: '🐰', Exótico: '🐍' }
  return map[species] || '🐾'
}

// Demo data if backend returns nothing
const demoPets = [
  {
    id: 1,
    name: 'Thor',
    species: 'Perro',
    breed: 'Golden Retriever',
    age: 4,
    weight: 28,
    sex: 'M',
    chip: '941000012345678',
    ownerName: authStore.user?.name || 'Usuario',
    vaccines: [
      { name: 'Antirrábica', date: '2026-03-10', upToDate: true },
      { name: 'Séxtuple', date: '2026-03-10', upToDate: true },
      { name: 'Bordetella', date: '2025-09-01', upToDate: false }
    ]
  }
]

const demoApts = [
  { id: 1, service: { name: 'Consulta Clínica General' }, date: '2026-08-10', status: 'completed' },
  { id: 2, service: { name: 'Vacunación Antirrábica' }, date: '2026-03-10', status: 'completed' }
]

onMounted(async () => {
  try {
    const { $feathers } = useNuxtApp()
    if ($feathers && authStore.user?.id) {
      const [petRes, aptRes] = await Promise.all([
        $feathers.service('pets').find({ query: { user_id: authStore.user.id } }),
        $feathers.service('appointments').find({ query: { user_id: authStore.user.id, $limit: 10, $sort: { date: -1 } } })
      ])
      pets.value = (petRes.data || petRes).length ? (petRes.data || petRes) : demoPets
      appointments.value = aptRes.data || aptRes
    } else {
      pets.value = demoPets
    }
  } catch {
    pets.value = demoPets
    appointments.value = demoApts
  } finally {
    loading.value = false
    if (pets.value.length) selectedPetId.value = pets.value[0].id
  }
})
</script>

<style scoped>
.carnet-page {
  min-height: 80vh;
  background: var(--color-cream-100);
  padding: 2.5rem 1.5rem 5rem;
}

.carnet-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Page header */
.carnet-page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-cream-200);
  flex-wrap: wrap;
}

.page-eyebrow {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-forest-600);
  margin-bottom: 0.3rem;
}

.page-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: var(--color-ink-900);
  margin: 0 0 0.35rem;
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--color-ink-500);
  max-width: 480px;
  margin: 0;
}

/* Pet selector tabs */
.pet-selector {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pet-tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1.5px solid var(--color-cream-200);
  background: var(--color-cream-50);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-ink-500);
  cursor: pointer;
  transition: all 0.15s;
}

.pet-tab--active {
  background: var(--color-amber-600);
  border-color: var(--color-amber-600);
  color: #fff;
  font-weight: 700;
}

.pet-tab-emoji { font-size: 1rem; }

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 0;
  color: var(--color-ink-400);
}

.loading-spinner {
  width: 2rem; height: 2rem;
  border: 3px solid var(--color-cream-200);
  border-top-color: var(--color-amber-600);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Empty */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 5rem 1rem;
  gap: 0.75rem;
}
.empty-emoji { font-size: 3rem; opacity: 0.4; }
.empty-state h2 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--color-ink-700);
  margin: 0;
}
.empty-state p { color: var(--color-ink-500); max-width: 380px; margin: 0; }

/* Main layout */
.carnet-layout {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2.5rem;
  align-items: start;
}
@media (max-width: 768px) { .carnet-layout { grid-template-columns: 1fr; } }

/* Card side */
.card-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.card-hint {
  font-size: 0.7rem;
  color: var(--color-ink-400);
  text-align: center;
}

/* Info side */
.info-side {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.info-section {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 18px;
  padding: 1.25rem 1.375rem;
}

.info-section-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0 0 0.875rem;
}

/* Data grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem 1.5rem;
}
@media (max-width: 480px) { .info-grid { grid-template-columns: 1fr; } }

.info-item { display: flex; flex-direction: column; gap: 0.1rem; }

.info-label {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-ink-400);
}

.info-val {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-ink-900);
}

/* Vaccine list */
.vac-list { display: flex; flex-direction: column; gap: 0.5rem; }

.vac-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  background: var(--color-cream-100);
  border-radius: 10px;
}

.vac-check {
  color: var(--color-forest-600);
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.vac-info { flex: 1; }

.vac-name { font-size: 0.8125rem; font-weight: 600; color: var(--color-ink-900); display: block; }

.vac-date { font-size: 0.68rem; color: var(--color-ink-400); }

.vac-status {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  flex-shrink: 0;
}
.vac-status--ok {
  background: rgba(0,181,163,0.1);
  color: #007A6E;
  border: 1px solid rgba(0,181,163,0.25);
}
.vac-status--exp {
  background: rgba(220, 60, 60, 0.08);
  color: #c0392b;
  border: 1px solid rgba(220, 60, 60, 0.2);
}

/* Appointment history */
.apt-history { display: flex; flex-direction: column; gap: 0.5rem; }

.apt-hist-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  background: var(--color-cream-100);
  border-radius: 10px;
}

.apt-hist-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--color-ink-300);
  flex-shrink: 0;
}
.apt-hist-dot--ok { background: var(--color-forest-600); }

.apt-hist-info { flex: 1; }
.apt-hist-service { font-size: 0.8125rem; font-weight: 600; color: var(--color-ink-900); }
.apt-hist-date { font-size: 0.68rem; color: var(--color-ink-400); }

.apt-hist-badge {
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: rgba(0,181,163,0.1);
  color: #007A6E;
  flex-shrink: 0;
}

/* Download hint */
.download-hint {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.875rem 1rem;
  background: var(--color-amber-100);
  border-radius: 12px;
  border: 1px solid rgba(30, 120, 224, 0.2);
  font-size: 0.8rem;
  color: var(--color-ink-700);
  line-height: 1.5;
}

.hint-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: var(--color-amber-600);
  flex-shrink: 0;
  margin-top: 0.1rem;
}
</style>
