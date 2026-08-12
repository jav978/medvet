<template>
  <div class="dash-page">
    <div class="dash-inner">

      <!-- Welcome header -->
      <div class="dash-header">
        <div class="dash-welcome">
          <span class="dash-eyebrow">Panel Personal de Cliente</span>
          <h1 class="dash-title">
            Hola, {{ authStore.user?.name?.split(' ')[0] || 'bienvenido' }}
            <span class="dash-wave">👋</span>
          </h1>
        </div>
        <div class="dash-ctas">
          <NuxtLink to="/dashboard/carnet" class="btn-ghost dash-cta">
            🪪 Ver Carnet
          </NuxtLink>
          <NuxtLink to="/book" class="btn-amber dash-cta">
            <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>
            Agendar Nueva Cita
          </NuxtLink>
        </div>
      </div>

      <!-- Metric cards -->
      <div class="dash-stats">
        <div class="stat-card">
          <div class="stat-icon stat-icon--forest">📅</div>
          <div class="stat-body">
            <span class="stat-num font-mono-numbers">{{ appointmentsCount }}</span>
            <span class="stat-label">Citas Programadas</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon--amber">🐾</div>
          <div class="stat-body">
            <span class="stat-num font-mono-numbers">{{ petsCount }}</span>
            <span class="stat-label">Mascotas Vinculadas</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon--sage">✔</div>
          <div class="stat-body">
            <span class="stat-num font-mono-numbers">{{ completedCount }}</span>
            <span class="stat-label">Consultas Completadas</span>
          </div>
        </div>
      </div>

      <!-- Main 2-col grid -->
      <div class="dash-grid">

        <!-- Upcoming appointments -->
        <div class="dash-panel">
          <div class="panel-header">
            <h2 class="panel-title">
              <span class="panel-title-icon">🗓</span>
              Próximas Citas Médicas
            </h2>
            <NuxtLink to="/book" class="panel-action">+ Agendar</NuxtLink>
          </div>

          <div v-if="upcomingAppointments.length" class="apt-list">
            <div
              v-for="apt in upcomingAppointments"
              :key="apt.id"
              class="apt-item"
            >
              <div class="apt-info">
                <div class="apt-name">{{ apt.service?.name || 'Consulta Veterinaria' }}</div>
                <div class="apt-datetime font-mono-numbers">
                  📅 {{ apt.date }} — {{ apt.start_time }} hs
                </div>
              </div>
              <span :class="['apt-badge', apt.status === 'confirmed' ? 'apt-badge--confirmed' : 'apt-badge--pending']">
                {{ apt.status === 'confirmed' ? 'Confirmada' : 'Pendiente' }}
              </span>
            </div>
          </div>

          <div v-else class="panel-empty">
            <span class="panel-empty-icon">📋</span>
            <p>No tenés citas próximas programadas.</p>
            <NuxtLink to="/book" class="btn-ghost btn-sm">Agendar Primera Cita</NuxtLink>
          </div>
        </div>

        <!-- My pets -->
        <div class="dash-panel">
          <div class="panel-header">
            <h2 class="panel-title">
              <span class="panel-title-icon">❤️</span>
              Mis Mascotas Registradas
            </h2>
          </div>

          <div v-if="pets.length" class="pets-list">
            <div
              v-for="pet in pets"
              :key="pet.id"
              class="pet-row"
            >
              <div class="pet-avatar">{{ getSpeciesEmoji(pet.species) }}</div>
              <div class="pet-details">
                <div class="pet-name">{{ pet.name }}</div>
                <div class="pet-meta">{{ pet.species }}{{ pet.breed ? ` · ${pet.breed}` : '' }}</div>
                <div v-if="pet.age || pet.weight" class="pet-stats font-mono-numbers">
                  <span v-if="pet.age">{{ pet.age }} años</span>
                  <span v-if="pet.weight">{{ pet.weight }} kg</span>
                </div>
              </div>
              <NuxtLink :to="`/book?pet=${pet.id}`" class="pet-book-link">
                Agendar →
              </NuxtLink>
            </div>
          </div>

          <div v-else class="panel-empty">
            <span class="panel-empty-icon">🐶</span>
            <p>Aún no has registrado mascotas en tu perfil.</p>
            <NuxtLink to="/book" class="btn-ghost btn-sm">Registrar mi Mascota</NuxtLink>
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

const appointments = ref([])
const pets = ref([])

const appointmentsCount = computed(() => appointments.value.filter(a => a.status !== 'cancelled').length)
const petsCount = computed(() => pets.value.length)
const completedCount = computed(() => appointments.value.filter(a => a.status === 'completed').length)

const upcomingAppointments = computed(() =>
  appointments.value.filter(a => a.status === 'pending' || a.status === 'confirmed').slice(0, 5)
)

const speciesList = [
  { name: 'Perro', emoji: '🐶' },
  { name: 'Gato', emoji: '🐱' },
  { name: 'Ave', emoji: '🦜' },
  { name: 'Conejo', emoji: '🐰' },
  { name: 'Exótico', emoji: '🐍' }
]

const getSpeciesEmoji = (species) => {
  const m = speciesList.find(s => s.name.toLowerCase().includes((species || '').toLowerCase()))
  return m ? m.emoji : '🐾'
}

onMounted(async () => {
  try {
    const { $feathers } = useNuxtApp()
    if ($feathers && authStore.user?.id) {
      const aptResult = await $feathers.service('appointments').find({
        query: { user_id: authStore.user.id, $sort: { date: -1 } }
      })
      appointments.value = aptResult.data || aptResult

      const petResult = await $feathers.service('pets').find({
        query: { user_id: authStore.user.id }
      })
      pets.value = petResult.data || petResult
    }
  } catch { /* fallback to empty */ }
})
</script>

<style scoped>
/* Dashboard page layout */
.dash-page {
  min-height: 80vh;
  background: var(--color-cream-100);
  padding: 2.5rem 1.5rem 5rem;
}

.dash-inner {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header */
.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-cream-200);
  flex-wrap: wrap;
}

.dash-welcome {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.dash-eyebrow {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-ink-500);
}

.dash-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: var(--color-ink-900);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.dash-wave { font-style: normal; }

.dash-cta { font-size: 0.9rem; }
.dash-ctas { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }

/* Stat cards */
.dash-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
@media (max-width: 640px) { .dash-stats { grid-template-columns: 1fr; } }

.stat-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 18px;
  padding: 1.375rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}
.stat-icon--forest {
  background: var(--color-forest-100);
  color: var(--color-forest-600);
}
.stat-icon--amber {
  background: var(--color-amber-100);
  color: var(--color-amber-600);
}
.stat-icon--sage {
  background: rgba(99, 102, 241, 0.08);
  color: var(--color-amber-500);
}
.dark .stat-icon--forest { background: rgba(0, 245, 212, 0.15); }
.dark .stat-icon--amber  { background: rgba(99, 102, 241, 0.15); }
.dark .stat-icon--sage   { background: rgba(99, 102, 241, 0.12); }

.stat-body { display: flex; flex-direction: column; gap: 0.15rem; }

.stat-num {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
  color: var(--color-ink-900);
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-ink-500);
}

/* Dashboard 2-col grid */
.dash-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
@media (max-width: 768px) { .dash-grid { grid-template-columns: 1fr; } }

.dash-panel {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 22px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.panel-title-icon { font-size: 1rem; }

.panel-action {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-amber-600);
  text-decoration: none;
  transition: color 0.15s;
}
.panel-action:hover { color: var(--color-amber-500); }

/* Appointment list */
.apt-list { display: flex; flex-direction: column; gap: 0.65rem; }

.apt-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  background: var(--color-cream-100);
  border: 1px solid var(--color-cream-200);
  border-radius: 14px;
  padding: 0.875rem 1rem;
}

.apt-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-ink-900);
}

.apt-datetime {
  font-size: 0.72rem;
  color: var(--color-ink-500);
  margin-top: 0.15rem;
}

.apt-badge {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  white-space: nowrap;
  flex-shrink: 0;
}
.apt-badge--confirmed {
  background: rgba(14, 165, 233, 0.1);
  color: var(--color-forest-800);
  border: 1px solid rgba(14, 165, 233, 0.2);
}
.apt-badge--pending {
  background: rgba(245, 158, 11, 0.1);
  color: #c27d00;
  border: 1px solid rgba(245, 158, 11, 0.2);
}
.dark .apt-badge--confirmed {
  background: rgba(0, 245, 212, 0.15);
  color: var(--color-forest-600);
  border-color: rgba(0, 245, 212, 0.25);
}
.dark .apt-badge--pending {
  background: rgba(245, 158, 11, 0.15);
  color: #ffb833;
  border-color: rgba(245, 158, 11, 0.25);
}

/* Pets list */
.pets-list { display: flex; flex-direction: column; gap: 0.65rem; }

.pet-row {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  background: var(--color-cream-100);
  border: 1px solid var(--color-cream-200);
  border-radius: 14px;
  padding: 0.875rem 1rem;
}

.pet-avatar { font-size: 1.75rem; flex-shrink: 0; }

.pet-details { flex: 1; }

.pet-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-ink-900);
}

.pet-meta {
  font-size: 0.72rem;
  color: var(--color-ink-500);
}

.pet-stats {
  font-size: 0.67rem;
  color: var(--color-ink-400);
  display: flex;
  gap: 0.5rem;
  margin-top: 0.15rem;
}

.pet-book-link {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-forest-700);
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: color 0.15s;
}
.pet-book-link:hover { color: var(--color-forest-600); }

/* Empty states */
.panel-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2.5rem 1rem;
  gap: 0.65rem;
}
.panel-empty-icon { font-size: 2rem; opacity: 0.45; }
.panel-empty p {
  font-size: 0.8125rem;
  color: var(--color-ink-500);
  margin: 0;
}
.btn-sm { font-size: 0.8rem; padding: 0.4rem 0.875rem; }
</style>
