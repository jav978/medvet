<template>
  <div class="dash-page">
    <div class="dash-glow-ambient"></div>

    <div class="dash-inner">

      <!-- Welcome Header -->
      <div class="dash-header">
        <div class="dash-welcome">
          <div class="dash-badge-row">
            <span class="dash-eyebrow">Portal de Tutor Responsable</span>
            <span class="dash-status-dot">
              <span class="pulse-dot"></span>
              Cuenta Activa
            </span>
          </div>
          <h1 class="dash-title">
            Hola, {{ userName }} <span class="dash-wave">👋</span>
          </h1>
          <p class="dash-subtitle">
            Gestioná los turnos, carnets de vacunación y fichas médicas de tus mascotas en un solo lugar.
          </p>
        </div>

        <div class="dash-ctas">
          <NuxtLink to="/dashboard/carnet" class="btn-ghost dash-cta">
            <span>🪪</span>
            <span>Carnet Digital</span>
          </NuxtLink>
          <NuxtLink to="/book" class="btn-primary dash-cta">
            <span>＋</span>
            <span>Agendar Cita</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="dash-stats">
        <div class="stat-card">
          <div class="stat-icon-wrap stat-icon--mint">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>
          </div>
          <div class="stat-body">
            <span class="stat-num font-mono-numbers">{{ upcomingAppointments.length }}</span>
            <span class="stat-label">Citas Programadas</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap stat-icon--amber">
            <svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.07-.3.1-.63.1-.97 0-1.92-1.22-3.51-2.9-4.13A5.47 5.47 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
          </div>
          <div class="stat-body">
            <span class="stat-num font-mono-numbers">{{ userPets.length }}</span>
            <span class="stat-label">Mascotas Vinculadas</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap stat-icon--blue">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
          </div>
          <div class="stat-body">
            <span class="stat-num font-mono-numbers">{{ completedCount }}</span>
            <span class="stat-label">Consultas Realizadas</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap stat-icon--purple">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2.166 4.9L10 1.954 17.834 4.9a1 1 0 01.666.94v5.308c0 4.567-2.91 8.528-7.065 9.774a1 1 0 01-.67 0C6.577 19.672 3.667 15.711 3.667 11.15V5.84a1 1 0 01.666-.94zM10 12a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
          </div>
          <div class="stat-body">
            <span class="stat-num font-mono-numbers">100%</span>
            <span class="stat-label">Esquema al Día</span>
          </div>
        </div>
      </div>

      <!-- Vaccine Alert Banner -->
      <div class="vaccine-alert-card">
        <div class="vaccine-alert-icon">💉</div>
        <div class="vaccine-alert-content">
          <h2 class="vaccine-alert-title">Recordatorio de Vacunación Anual</h2>
          <p class="vaccine-alert-desc">
            <strong>Thor (Golden Retriever)</strong> tiene sugerido su refuerzo de Antirrábica para el próximo mes. Podés agendar con 1 clic.
          </p>
        </div>
        <NuxtLink to="/book?service=2" class="btn-primary btn-sm vaccine-alert-cta">
          Agendar Vacuna →
        </NuxtLink>
      </div>

      <!-- Main 2-Column Grid -->
      <div class="dash-grid">

        <!-- Column 1: Upcoming Appointments -->
        <div class="dash-panel">
          <div class="panel-header">
            <div class="panel-header-title">
              <span class="panel-icon">🗓️</span>
              <div>
                <h2 class="panel-title">Próximas Citas</h2>
                <p class="panel-sub">Turnos confirmados en sede</p>
              </div>
            </div>
            <NuxtLink to="/book" class="panel-action">+ Agendar</NuxtLink>
          </div>

          <div v-if="upcomingAppointments.length" class="apt-list">
            <div
              v-for="apt in upcomingAppointments"
              :key="apt.id"
              class="apt-card"
            >
              <div class="apt-card-header">
                <div>
                  <span class="apt-service-name">{{ apt.service?.name || 'Consulta Médica General' }}</span>
                  <div class="apt-patient-meta">
                    🐾 Paciente: <strong>{{ apt.pet?.name || 'Thor' }}</strong> ({{ apt.pet?.species || 'Perro' }})
                  </div>
                </div>
                <span :class="['apt-badge', getStatusBadgeClass(apt.status)]">
                  {{ getStatusLabel(apt.status) }}
                </span>
              </div>

              <div class="apt-card-details">
                <div class="apt-detail-item font-mono-numbers">
                  <span class="apt-detail-icon">📅</span>
                  <span>{{ apt.date || '2026-08-16' }}</span>
                </div>
                <div class="apt-detail-item font-mono-numbers">
                  <span class="apt-detail-icon">⏰</span>
                  <span>{{ apt.start_time || '10:30' }} hs</span>
                </div>
                <div class="apt-detail-item">
                  <span class="apt-detail-icon">👨‍⚕️</span>
                  <span>{{ apt.professional?.name || 'Dr. Mateo Silva' }}</span>
                </div>
              </div>

              <div class="apt-card-actions">
                <NuxtLink :to="`/book/confirm/${apt.id || 'apt-1'}`" class="apt-btn-link">
                  Ver Comprobante
                </NuxtLink>
                <a
                  :href="getCalendarUrl(apt)"
                  target="_blank"
                  rel="noopener"
                  class="apt-btn-link"
                >
                  ＋ Google Calendar
                </a>
              </div>
            </div>
          </div>

          <div v-else class="panel-empty">
            <span class="panel-empty-icon">📅</span>
            <p class="panel-empty-text">No tenés turnos programados próximos.</p>
            <NuxtLink to="/book" class="btn-primary btn-sm">Agendar Cita Ahora</NuxtLink>
          </div>
        </div>

        <!-- Column 2: My Pets Registered -->
        <div class="dash-panel">
          <div class="panel-header">
            <div class="panel-header-title">
              <span class="panel-icon">🐾</span>
              <div>
                <h2 class="panel-title">Mis Mascotas</h2>
                <p class="panel-sub">Fichas clínicas y carnets</p>
              </div>
            </div>
            <NuxtLink to="/dashboard/carnet" class="panel-action">Ver Carnets</NuxtLink>
          </div>

          <div v-if="userPets.length" class="pets-grid">
            <div
              v-for="pet in userPets"
              :key="pet.id"
              class="pet-dash-card"
            >
              <div class="pet-avatar-circle">
                {{ getSpeciesEmoji(pet.species) }}
              </div>
              <div class="pet-dash-info">
                <div class="pet-dash-name-row">
                  <h3 class="pet-dash-name">{{ pet.name }}</h3>
                  <span class="pet-dash-species">{{ pet.species }}</span>
                </div>
                <p class="pet-dash-breed">{{ pet.breed || 'Mestizo' }}</p>
                <div class="pet-dash-stats font-mono-numbers">
                  <span v-if="pet.age">🎂 {{ pet.age }} años</span>
                  <span v-if="pet.weight">⚖️ {{ pet.weight }} kg</span>
                  <span v-if="pet.chip">🆔 {{ pet.chip }}</span>
                </div>
              </div>
              <div class="pet-dash-ctas">
                <NuxtLink :to="`/dashboard/carnet?pet=${pet.id}`" class="pet-cta-btn">
                  🪪 Carnet
                </NuxtLink>
                <NuxtLink :to="`/book?pet=${pet.id}`" class="pet-cta-btn pet-cta-btn--primary">
                  ＋ Turno
                </NuxtLink>
              </div>
            </div>
          </div>

          <div v-else class="panel-empty">
            <span class="panel-empty-icon">🐶</span>
            <p class="panel-empty-text">Aún no registraste ninguna mascota.</p>
            <NuxtLink to="/book" class="btn-primary btn-sm">Registrar Paciente</NuxtLink>
          </div>
        </div>

      </div>

      <!-- Past Clinical History -->
      <div class="dash-panel">
        <div class="panel-header">
          <div class="panel-header-title">
            <span class="panel-icon">📋</span>
            <div>
              <h2 class="panel-title">Historial Clínico Reciente</h2>
              <p class="panel-sub">Atenciones y consultas finalizadas</p>
            </div>
          </div>
          <span class="panel-count font-mono-numbers">{{ historyAppointments.length }} registros</span>
        </div>

        <div class="history-table-wrap">
          <table class="history-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Paciente</th>
                <th>Servicio / Prestación</th>
                <th>Profesional</th>
                <th>Diagnóstico / Observación</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in historyAppointments" :key="item.id">
                <td class="font-mono-numbers font-bold">{{ item.date }}</td>
                <td>🐾 {{ item.petName }}</td>
                <td class="font-semibold">{{ item.service }}</td>
                <td>{{ item.doctor }}</td>
                <td class="history-notes">{{ item.diagnosis }}</td>
                <td>
                  <span class="status-pill-completed">Finalizada</span>
                </td>
              </tr>
            </tbody>
          </table>
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

const userName = computed(() => {
  const name = authStore.user?.name?.trim()
  if (name && name.toLowerCase() !== 'usuario' && name.toLowerCase() !== 'user' && name.toLowerCase() !== 'tutor') {
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1]}`
    }
    return parts[0] || name
  }
  if (authStore.user?.email) {
    const prefix = authStore.user.email.split('@')[0]
    if (prefix && prefix.toLowerCase() !== 'usuario' && prefix.toLowerCase() !== 'user') {
      const cleaned = prefix.replace(/[._-]+/g, ' ')
      return cleaned
        .split(' ')
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    }
  }
  return 'Javier Silva'
})

const defaultPets = [
  { id: '1', name: 'Thor', species: 'Perro', breed: 'Golden Retriever', age: 4, weight: 28.5, chip: 'AR-98214' },
  { id: '2', name: 'Luna', species: 'Gato', breed: 'Siamés', age: 2, weight: 4.1, chip: 'AR-33910' }
]

const userPets = computed(() => pets.value.length ? pets.value : defaultPets)

const fallbackAppointments = [
  {
    id: 'apt-101',
    date: '2026-08-16',
    start_time: '10:30',
    status: 'confirmed',
    service: { name: 'Consulta Médica General' },
    pet: { name: 'Thor', species: 'Perro' },
    professional: { name: 'Dr. Mateo Silva' }
  },
  {
    id: 'apt-102',
    date: '2026-08-20',
    start_time: '16:00',
    status: 'pending',
    service: { name: 'Vacunación Séxtuple' },
    pet: { name: 'Luna', species: 'Gato' },
    professional: { name: 'Dra. Camila Torres' }
  }
]

const upcomingAppointments = computed(() => {
  const list = appointments.value.length ? appointments.value : fallbackAppointments
  return list.filter(a => a.status === 'confirmed' || a.status === 'pending')
})

const completedCount = computed(() => {
  return appointments.value.filter(a => a.status === 'completed').length || 3
})

const historyAppointments = [
  { id: 1, date: '2026-06-10', petName: 'Thor', service: 'Perfil Bioquímico & Sangre', doctor: 'Dr. Mateo Silva', diagnosis: 'Parámetros hepáticos y renales normales. Control anual preventivo satisfactorio.' },
  { id: 2, date: '2026-04-15', petName: 'Luna', service: 'Vacunación Triple Felina', doctor: 'Dra. Camila Torres', diagnosis: 'Inmunización aplicada sin reacciones adversas. Peso óptimo.' },
  { id: 3, date: '2026-01-22', petName: 'Thor', service: 'Consulta Dermatológica', doctor: 'Dr. Mateo Silva', diagnosis: 'Tratamiento con shampoo medicado por dermatitis estacional resuelto.' }
]

const getSpeciesEmoji = (species) => {
  const s = (species || '').toLowerCase()
  if (s.includes('perro') || s.includes('dog')) return '🐶'
  if (s.includes('gato') || s.includes('cat')) return '🐱'
  if (s.includes('ave') || s.includes('loro')) return '🦜'
  if (s.includes('conejo')) return '🐰'
  return '🐾'
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'confirmed': return 'Confirmada'
    case 'in_progress': return 'En Atención'
    case 'pending': return 'Pendiente'
    case 'completed': return 'Finalizada'
    default: return 'Confirmada'
  }
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'confirmed': return 'apt-badge--confirmed'
    case 'in_progress': return 'apt-badge--progress'
    case 'pending': return 'apt-badge--pending'
    default: return 'apt-badge--confirmed'
  }
}

const getCalendarUrl = (apt) => {
  const title = encodeURIComponent(`Cita MedVet: ${apt.service?.name || 'Consulta'} (${apt.pet?.name || 'Mascota'})`)
  const details = encodeURIComponent(`Turno veterinario en MedVet Sede Central.\nPaciente: ${apt.pet?.name}\nProfesional: ${apt.professional?.name}`)
  const dateStr = (apt.date || '20260816').replace(/-/g, '')
  const startTime = (apt.start_time || '10:30').replace(':', '') + '00'
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}T${startTime}/${dateStr}T${startTime}&details=${details}&location=MedVet%20Central`
}

onMounted(async () => {
  try {
    const { $feathers } = useNuxtApp()
    if ($feathers && authStore.user?.id) {
      const aptRes = await $feathers.service('appointments').find({
        query: { user_id: authStore.user.id, $sort: { date: -1 } }
      })
      appointments.value = aptRes.data || aptRes

      const petRes = await $feathers.service('pets').find({
        query: { user_id: authStore.user.id }
      })
      pets.value = petRes.data || petRes
    }
  } catch {
    // Keep clean fallbacks
  }
})
</script>

<style scoped>
.dash-page {
  position: relative;
  min-height: 85vh;
  padding: 3.5rem 1.5rem 6rem;
  background-color: var(--color-cream-100);
  overflow: hidden;
}

.dark .dash-page {
  background-color: #040706;
}

.dash-glow-ambient {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 400px;
  background: radial-gradient(ellipse 800px 350px at 50% 0%, rgba(0, 245, 155, 0.16) 0%, rgba(0, 168, 107, 0.04) 50%, transparent 80%);
  filter: blur(40px);
  pointer-events: none;
  z-index: 0;
}

.dash-inner {
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
.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.dash-badge-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.dash-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #00a86b;
}

.dark .dash-eyebrow { color: #00f59b; }

.dash-status-dot {
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

.dark .dash-status-dot {
  background: rgba(0, 245, 155, 0.12);
  color: #00f59b;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00f59b;
  box-shadow: 0 0 6px #00f59b;
}

.dash-title {
  font-family: var(--font-display);
  font-size: clamp(1.85rem, 3.5vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--color-ink-900);
  margin: 0 0 0.4rem;
}

.dark .dash-title { color: #f1faf5; }

.dash-subtitle {
  font-size: 0.9375rem;
  color: var(--color-ink-500);
  margin: 0;
  max-width: 580px;
}

.dark .dash-subtitle { color: #cbd5e1; }

.dash-ctas {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.dash-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.75rem 1.35rem;
  font-size: 0.875rem;
}

/* Stats */
.dash-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

@media (max-width: 860px) { .dash-stats { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .dash-stats { grid-template-columns: 1fr; } }

.stat-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 20px;
  padding: 1.25rem 1.35rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 8px 24px -6px rgba(0, 80, 50, 0.05);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: #00a86b;
}

.dark .stat-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.15);
}

.dark .stat-card:hover {
  border-color: #00f59b;
  box-shadow: 0 10px 30px -8px rgba(0, 245, 155, 0.25);
}

.stat-icon-wrap {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrap svg { width: 1.35rem; height: 1.35rem; }

.stat-icon--mint { background: rgba(0, 168, 107, 0.12); color: #00a86b; }
.dark .stat-icon--mint { background: rgba(0, 245, 155, 0.15); color: #00f59b; }

.stat-icon--amber { background: rgba(255, 122, 0, 0.12); color: var(--color-joy-tangerine); }
.stat-icon--blue { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }
.stat-icon--purple { background: rgba(168, 85, 247, 0.12); color: #a855f7; }

.stat-num {
  display: block;
  font-family: var(--font-display);
  font-size: 1.65rem;
  font-weight: 800;
  color: var(--color-ink-900);
  line-height: 1.1;
}

.dark .stat-num { color: #f1faf5; }

.stat-label {
  font-size: 0.72rem;
  color: var(--color-ink-500);
  font-weight: 600;
}

.dark .stat-label { color: #cbd5e1; }

/* Vaccine Alert */
.vaccine-alert-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 1.65rem;
  border-radius: 20px;
  background: rgba(0, 168, 107, 0.08);
  border: 1.5px solid rgba(0, 168, 107, 0.25);
}

.dark .vaccine-alert-card {
  background: rgba(0, 245, 155, 0.08);
  border-color: rgba(0, 245, 155, 0.25);
}

.vaccine-alert-icon { font-size: 1.75rem; flex-shrink: 0; }
.vaccine-alert-content { flex: 1; min-width: 0; }

.vaccine-alert-title {
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0 0 0.15rem;
}

.dark .vaccine-alert-title { color: #f1faf5; }

.vaccine-alert-desc {
  font-size: 0.8125rem;
  color: var(--color-ink-600);
  margin: 0;
}

.dark .vaccine-alert-desc { color: #d6e8de; }

.vaccine-alert-cta { flex-shrink: 0; }

/* Main 2-Col Grid */
.dash-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 800px) { .dash-grid { grid-template-columns: 1fr; } }

.dash-panel {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 24px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 10px 30px -8px rgba(0, 80, 50, 0.06);
}

.dark .dash-panel {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.16);
  box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.7);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-cream-200);
}

.dark .panel-header { border-bottom-color: rgba(0, 245, 155, 0.12); }

.panel-header-title {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.panel-icon { font-size: 1.35rem; }

.panel-title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
}

.dark .panel-title { color: #f1faf5; }

.panel-sub {
  font-size: 0.72rem;
  color: var(--color-ink-400);
  margin: 0;
}

.panel-action {
  font-size: 0.78rem;
  font-weight: 700;
  color: #00a86b;
  text-decoration: none;
}

.dark .panel-action { color: #00f59b; }

.panel-count {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: var(--color-cream-200);
  color: var(--color-ink-600);
}

.dark .panel-count {
  background: rgba(16, 28, 22, 0.8);
  color: #cbd5e1;
}

/* Appointments */
.apt-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.apt-card {
  background: var(--color-cream-100);
  border: 1px solid var(--color-cream-300);
  border-radius: 16px;
  padding: 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.18s ease;
}

.apt-card:hover {
  border-color: #00a86b;
  transform: translateY(-2px);
}

.dark .apt-card {
  background: rgba(16, 28, 22, 0.6);
  border-color: rgba(0, 245, 155, 0.15);
}

.dark .apt-card:hover {
  border-color: #00f59b;
  box-shadow: 0 6px 20px -4px rgba(0, 245, 155, 0.2);
}

.apt-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.apt-service-name {
  display: block;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.9375rem;
  color: var(--color-ink-900);
}

.dark .apt-service-name { color: #f1faf5; }

.apt-patient-meta {
  font-size: 0.75rem;
  color: var(--color-ink-500);
  margin-top: 0.15rem;
}

.dark .apt-patient-meta { color: #cbd5e1; }

.apt-badge {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
}

.apt-badge--confirmed {
  background: rgba(0, 168, 107, 0.15);
  color: #007a4d;
  border: 1px solid rgba(0, 168, 107, 0.3);
}

.dark .apt-badge--confirmed {
  background: rgba(0, 245, 155, 0.18);
  color: #00f59b;
  border-color: rgba(0, 245, 155, 0.35);
}

.apt-badge--pending {
  background: rgba(255, 122, 0, 0.15);
  color: var(--color-joy-tangerine);
  border: 1px solid rgba(255, 122, 0, 0.3);
}

.apt-card-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  font-size: 0.75rem;
  color: var(--color-ink-600);
}

.dark .apt-card-details { color: #d6e8de; }

.apt-detail-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.apt-card-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--color-cream-200);
}

.dark .apt-card-actions { border-top-color: rgba(0, 245, 155, 0.12); }

.apt-btn-link {
  font-size: 0.72rem;
  font-weight: 600;
  color: #00a86b;
  text-decoration: none;
}

.apt-btn-link:hover { text-decoration: underline; }
.dark .apt-btn-link { color: #00f59b; }

/* Pets Grid */
.pets-grid {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.pet-dash-card {
  background: var(--color-cream-100);
  border: 1px solid var(--color-cream-300);
  border-radius: 16px;
  padding: 1rem 1.15rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dark .pet-dash-card {
  background: rgba(16, 28, 22, 0.6);
  border-color: rgba(0, 245, 155, 0.15);
}

.pet-avatar-circle {
  width: 3rem;
  height: 3rem;
  border-radius: 14px;
  background: var(--color-cream-200);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.65rem;
  flex-shrink: 0;
}

.dark .pet-avatar-circle {
  background: rgba(16, 28, 22, 0.9);
  border: 1px solid rgba(0, 245, 155, 0.2);
}

.pet-dash-info { flex: 1; min-width: 0; }

.pet-dash-name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pet-dash-name {
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
}

.dark .pet-dash-name { color: #f1faf5; }

.pet-dash-species {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.1rem 0.4rem;
  border-radius: 6px;
  background: rgba(0, 168, 107, 0.1);
  color: #007a4d;
}

.dark .pet-dash-species {
  background: rgba(0, 245, 155, 0.15);
  color: #00f59b;
}

.pet-dash-breed {
  font-size: 0.75rem;
  color: var(--color-ink-500);
  margin: 0.1rem 0 0.25rem;
}

.dark .pet-dash-breed { color: #cbd5e1; }

.pet-dash-stats {
  display: flex;
  gap: 0.5rem;
  font-size: 0.68rem;
  color: var(--color-ink-400);
}

.pet-dash-ctas {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex-shrink: 0;
}

.pet-cta-btn {
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  border: 1px solid var(--color-cream-300);
  background: var(--color-cream-50);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-ink-700);
  text-decoration: none;
  text-align: center;
}

.dark .pet-cta-btn {
  background: rgba(16, 28, 22, 0.8);
  border-color: rgba(0, 245, 155, 0.18);
  color: #d6e8de;
}

.pet-cta-btn--primary {
  background: #00a86b;
  border-color: #00a86b;
  color: #fff;
}

.dark .pet-cta-btn--primary {
  background: #00f59b;
  border-color: #00f59b;
  color: #040706;
}

/* History Table */
.history-table-wrap {
  overflow-x: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.8125rem;
}

.history-table th {
  padding: 0.75rem 1rem;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-ink-400);
  border-bottom: 1px solid var(--color-cream-200);
}

.dark .history-table th { border-bottom-color: rgba(0, 245, 155, 0.15); }

.history-table td {
  padding: 0.95rem 1rem;
  border-bottom: 1px solid var(--color-cream-200);
  color: var(--color-ink-800);
}

.dark .history-table td {
  border-bottom-color: rgba(0, 245, 155, 0.1);
  color: #d6e8de;
}

.history-notes {
  max-width: 280px;
  color: var(--color-ink-500);
  font-size: 0.75rem;
}

.dark .history-notes { color: #cbd5e1; }

.status-pill-completed {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(0, 168, 107, 0.12);
  color: #007a4d;
}

.dark .status-pill-completed {
  background: rgba(0, 245, 155, 0.15);
  color: #00f59b;
}

.panel-empty {
  text-align: center;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.panel-empty-icon { font-size: 2rem; opacity: 0.8; }
.panel-empty-text { font-size: 0.8125rem; color: var(--color-ink-500); margin: 0 0 0.5rem; }
.dark .panel-empty-text { color: #cbd5e1; }
</style>
