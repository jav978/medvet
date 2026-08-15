<template>
  <div class="admin-dash-page">
    
    <!-- Portal Header -->
    <div class="admin-header">
      <div>
        <div class="admin-eyebrow-row">
          <span class="admin-eyebrow">Panel de Control Clínico</span>
          <span class="admin-live-badge">
            <span class="live-dot"></span>
            En Vivo · Sede Central
          </span>
        </div>
        <h1 class="admin-title">Agenda Médica & Centro de Guardia</h1>
        <p class="admin-subtitle">
          Supervisión en tiempo real de consultas, turnos en sala de espera y asignación de consultorios.
        </p>
      </div>

      <div class="admin-header-actions">
        <NuxtLink to="/admin/appointments" class="btn-ghost admin-h-btn">
          <span>📅</span>
          <span>Ver Calendario Mensual</span>
        </NuxtLink>
        <NuxtLink to="/book" class="btn-primary admin-h-btn">
          <span>＋</span>
          <span>Nuevo Turno en Mostrador</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Clinical KPI Stats Grid -->
    <div class="stats-grid">
      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Citas Agendadas Hoy</span>
          <div class="kpi-icon kpi-icon--mint">📅</div>
        </div>
        <span class="kpi-val font-mono-numbers">{{ todayAppointments.length }}</span>
        <span class="kpi-sub">8 turnos completados</span>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">En Sala de Espera</span>
          <div class="kpi-icon kpi-icon--amber">⏳</div>
        </div>
        <span class="kpi-val font-mono-numbers">{{ waitingCount }}</span>
        <span class="kpi-sub">Tiempo promedio: 8 min</span>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">En Atención Médica</span>
          <div class="kpi-icon kpi-icon--blue">🩺</div>
        </div>
        <span class="kpi-val font-mono-numbers">{{ inProgressCount }}</span>
        <span class="kpi-sub">Consultorios 1 y Quirófano</span>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Recaudación Estimada</span>
          <div class="kpi-icon kpi-icon--green">💵</div>
        </div>
        <span class="kpi-val font-mono-numbers kpi-val--mint">${{ totalRevenue.toLocaleString() }}</span>
        <span class="kpi-sub">Efectivo, Tarjetas & MP</span>
      </div>
    </div>

    <!-- Quick Navigation Modules -->
    <div class="quick-modules">
      <h2 class="section-title">Módulos Administrativos Rápidos</h2>
      <div class="modules-grid">
        <NuxtLink
          v-for="mod in moduleLinks"
          :key="mod.to"
          :to="mod.to"
          class="module-card"
        >
          <div class="module-icon">{{ mod.icon }}</div>
          <span class="module-title">{{ mod.title }}</span>
          <span class="module-desc">{{ mod.desc }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Live Daily Agenda Timeline -->
    <div class="agenda-section">
      <div class="agenda-header">
        <div>
          <h2 class="section-title">Turnos de la Jornada de Hoy</h2>
          <p class="section-sub">Actualizá el estado de los pacientes a medida que ingresan a la clínica</p>
        </div>

        <div class="agenda-filters">
          <div class="filter-pills">
            <button
              v-for="tab in shiftTabs"
              :key="tab.id"
              type="button"
              @click="activeShiftTab = tab.id"
              :class="['filter-pill', activeShiftTab === tab.id ? 'filter-pill--active' : '']"
            >
              {{ tab.label }}
            </button>
          </div>

          <input
            v-model="agendaSearch"
            type="text"
            placeholder="Buscar por mascota o tutor..."
            class="agenda-search-input"
          />
        </div>
      </div>

      <div class="agenda-list">
        <div
          v-for="apt in filteredAgenda"
          :key="apt.id"
          :class="['agenda-row', `agenda-row--${apt.status}`]"
        >
          <!-- Time Badge -->
          <div class="agenda-time font-mono-numbers">
            <span class="time-main">{{ apt.time }}</span>
            <span class="time-dur">{{ apt.duration }}m</span>
          </div>

          <!-- Patient & Service Info -->
          <div class="agenda-patient">
            <div class="patient-title-row">
              <span class="p-emoji">{{ getSpeciesEmoji(apt.petSpecies) }}</span>
              <strong class="p-name">{{ apt.petName }}</strong>
              <span class="p-species-pill">{{ apt.petSpecies }} · {{ apt.petBreed }}</span>
            </div>
            <div class="p-service">{{ apt.serviceName }}</div>
            <div class="p-tutor">Tutor: {{ apt.tutorName }} (Tel: {{ apt.tutorPhone }})</div>
          </div>

          <!-- Doctor & Location -->
          <div class="agenda-doctor">
            <span class="doc-label">Profesional Asignado</span>
            <span class="doc-name">{{ apt.doctorName }}</span>
            <span class="doc-room">{{ apt.room }}</span>
          </div>

          <!-- Status Dropdown / Changer -->
          <div class="agenda-status-wrap">
            <label class="status-lbl">Estado del Paciente</label>
            <select
              v-model="apt.status"
              class="status-select font-mono-numbers"
              :class="`status-select--${apt.status}`"
            >
              <option value="waiting">🟡 En Sala de Espera</option>
              <option value="in_progress">🟢 En Atención Médica</option>
              <option value="confirmed">⚪ Turno Confirmado</option>
              <option value="completed">✔ Consulta Finalizada</option>
              <option value="cancelled">🔴 Cancelada / Ausente</option>
            </select>
          </div>

          <!-- Actions -->
          <div class="agenda-actions">
            <button
              type="button"
              @click="toggleNotes(apt.id)"
              class="btn-ghost btn-xs agenda-btn"
              title="Notas clínicas"
            >
              📝 Notas
            </button>
          </div>

          <!-- Expandable Clinical Notes -->
          <div v-if="openedNotes[apt.id]" class="agenda-notes-drawer">
            <label class="notes-lbl">Evolución Clínica & Indicaciones:</label>
            <textarea
              v-model="apt.notes"
              class="notes-textarea"
              rows="2"
              placeholder="Escribí aquí las observaciones médicas, diagnóstico preliminar o prescripciones..."
            ></textarea>
            <div class="notes-actions">
              <button @click="saveNotes(apt.id)" class="btn-primary btn-xs">Guardar en Ficha</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- On-Duty Staff & Capacity -->
    <div class="staff-section">
      <h2 class="section-title">Cuerpo Médico de Guardia Hoy</h2>
      <div class="staff-grid">
        <div v-for="vet in onDutyStaff" :key="vet.id" class="staff-card">
          <div class="staff-avatar">{{ vet.avatar }}</div>
          <div class="staff-info">
            <h3 class="staff-name">{{ vet.name }}</h3>
            <span class="staff-spec">{{ vet.specialty }}</span>
            <span class="staff-room">{{ vet.room }}</span>
          </div>
          <div class="staff-status-col">
            <span class="staff-badge staff-badge--active">En Guardia</span>
            <span class="staff-count font-mono-numbers">{{ vet.completedCount }} atenciones hoy</span>
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

const activeShiftTab = ref('all')
const agendaSearch = ref('')
const openedNotes = reactive({})

const shiftTabs = [
  { id: 'all', label: 'Todos los turnos' },
  { id: 'morning', label: '🌅 Mañana (08:30 - 12:30)' },
  { id: 'afternoon', label: '🌇 Tarde (14:00 - 19:30)' },
  { id: 'waiting', label: '🟡 En Espera' }
]

const moduleLinks = [
  { to: '/admin/appointments', icon: '📅', title: 'Gestión de Citas', desc: 'Reprogramar y agenda mensual' },
  { to: '/admin/users', icon: '👥', title: 'Usuarios & Tutores', desc: 'Padrón de clientes y pacientes' },
  { to: '/admin/services', icon: '🩺', title: 'Servicios & Aranceles', desc: 'Tarifario y prestaciones médicas' },
  { to: '/admin/professionals', icon: '👨‍⚕️', title: 'Cuerpo Médico', desc: 'Veterinarios y especialistas' },
  { to: '/admin/schedules', icon: '⏰', title: 'Horarios & Guardias', desc: 'Configuración de disponibilidad' }
]

const todayAppointments = reactive([
  {
    id: 1,
    time: '08:30',
    duration: 30,
    petName: 'Thor',
    petSpecies: 'Perro',
    petBreed: 'Golden Retriever',
    serviceName: 'Consulta Clínica General',
    tutorName: 'Juan Pérez',
    tutorPhone: '+54 9 11 4821-9988',
    doctorName: 'Dr. Mateo Silva',
    room: 'Consultorio 1',
    status: 'completed',
    notes: 'Control semestral satisfactorio. Plan de vacunación al día.'
  },
  {
    id: 2,
    time: '09:15',
    duration: 20,
    petName: 'Luna',
    petSpecies: 'Gato',
    petBreed: 'Siamés',
    serviceName: 'Vacunación Triple Felina',
    tutorName: 'Carla Morales',
    tutorPhone: '+54 9 11 5590-1234',
    doctorName: 'Dra. Camila Torres',
    room: 'Consultorio 2',
    status: 'completed',
    notes: 'Inmunización aplicada en miembro posterior derecho.'
  },
  {
    id: 3,
    time: '10:00',
    duration: 35,
    petName: 'Rocky',
    petSpecies: 'Perro',
    petBreed: 'Bulldog Francés',
    serviceName: 'Ecografía Abdominal',
    tutorName: 'Martín Rossi',
    tutorPhone: '+54 9 11 3320-7766',
    doctorName: 'Dr. Mateo Silva',
    room: 'Diagnóstico por Imágenes',
    status: 'in_progress',
    notes: 'Estudio de control digestivo por vómitos intermitentes.'
  },
  {
    id: 4,
    time: '10:45',
    duration: 30,
    petName: 'Simba',
    petSpecies: 'Gato',
    petBreed: 'Persa',
    serviceName: 'Consulta Dermatológica',
    tutorName: 'Sofía Álvarez',
    tutorPhone: '+54 9 11 6712-4433',
    doctorName: 'Dra. Camila Torres',
    room: 'Consultorio 2',
    status: 'waiting',
    notes: ''
  },
  {
    id: 5,
    time: '11:30',
    duration: 20,
    petName: 'Coco',
    petSpecies: 'Perro',
    petBreed: 'Caniche Toy',
    serviceName: 'Vacunación Antirrábica',
    tutorName: 'Diego Fernández',
    tutorPhone: '+54 9 11 9988-1122',
    doctorName: 'Dr. Mateo Silva',
    room: 'Consultorio 1',
    status: 'waiting',
    notes: ''
  },
  {
    id: 6,
    time: '14:30',
    duration: 60,
    petName: 'Milo',
    petSpecies: 'Perro',
    petBreed: 'Labrador',
    serviceName: 'Castración Quirúrgica',
    tutorName: 'Valeria Gómez',
    tutorPhone: '+54 9 11 2233-4455',
    doctorName: 'Dr. Mateo Silva & Dra. Camila Torres',
    room: 'Quirófano Central',
    status: 'confirmed',
    notes: 'Pre-quirúrgico y coagulograma aprobados.'
  },
  {
    id: 7,
    time: '16:00',
    duration: 30,
    petName: 'Pelusa',
    petSpecies: 'Conejo',
    petBreed: 'Enano Holandés',
    serviceName: 'Consulta Animales Exóticos',
    tutorName: 'Esteban Paz',
    tutorPhone: '+54 9 11 7788-9900',
    doctorName: 'Dra. Camila Torres',
    room: 'Consultorio 2',
    status: 'confirmed',
    notes: ''
  }
])

const onDutyStaff = [
  { id: 1, name: 'Dr. Mateo Silva', specialty: 'Clínica Médica & Cirugía', room: 'Consultorio 1 & Quirófano', avatar: '👨‍⚕️', completedCount: 5 },
  { id: 2, name: 'Dra. Camila Torres', specialty: 'Medicina Felina & Diagnóstico', room: 'Consultorio 2', avatar: '👩‍⚕️', completedCount: 3 }
]

const waitingCount = computed(() => todayAppointments.filter(a => a.status === 'waiting').length)
const inProgressCount = computed(() => todayAppointments.filter(a => a.status === 'in_progress').length)
const totalRevenue = computed(() => 245000)

const filteredAgenda = computed(() => {
  return todayAppointments.filter(apt => {
    // Shift filter
    const hour = parseInt(apt.time.split(':')[0], 10)
    let matchesShift = true
    if (activeShiftTab.value === 'morning') matchesShift = hour < 13
    if (activeShiftTab.value === 'afternoon') matchesShift = hour >= 13
    if (activeShiftTab.value === 'waiting') matchesShift = apt.status === 'waiting'

    // Search filter
    const q = agendaSearch.value.trim().toLowerCase()
    const matchesSearch = !q ||
      apt.petName.toLowerCase().includes(q) ||
      apt.tutorName.toLowerCase().includes(q) ||
      apt.serviceName.toLowerCase().includes(q)

    return matchesShift && matchesSearch
  })
})

const getSpeciesEmoji = (species) => {
  const s = (species || '').toLowerCase()
  if (s.includes('perro')) return '🐶'
  if (s.includes('gato')) return '🐱'
  if (s.includes('conejo')) return '🐰'
  if (s.includes('ave')) return '🦜'
  return '🐾'
}

const toggleNotes = (id) => {
  openedNotes[id] = !openedNotes[id]
}

const saveNotes = (id) => {
  openedNotes[id] = false
}
</script>

<style scoped>
.admin-dash-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 3rem;
}

/* Header */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.admin-eyebrow-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.admin-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #00a86b;
}

.dark .admin-eyebrow { color: #00f59b; }

.admin-live-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(0, 245, 155, 0.12);
  color: #00a86b;
  border: 1px solid rgba(0, 245, 155, 0.25);
}

.dark .admin-live-badge { color: #00f59b; }

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00f59b;
  box-shadow: 0 0 6px #00f59b;
  animation: pulse 1.8s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

.admin-title {
  font-family: var(--font-display);
  font-size: clamp(1.85rem, 3vw, 2.35rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--color-ink-900);
  margin: 0 0 0.35rem;
}

.dark .admin-title { color: #f1faf5; }

.admin-subtitle {
  font-size: 0.9375rem;
  color: var(--color-ink-500);
  margin: 0;
}

.dark .admin-subtitle { color: #cbd5e1; }

.admin-header-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.admin-h-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1.15rem;
  font-size: 0.8125rem;
}

/* KPI Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

@media (max-width: 960px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px) { .stats-grid { grid-template-columns: 1fr; } }

.kpi-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 20px;
  padding: 1.25rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  box-shadow: 0 8px 24px -6px rgba(0, 80, 50, 0.05);
}

.dark .kpi-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.15);
}

.kpi-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kpi-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-ink-400);
}

.kpi-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
}

.kpi-icon--mint { background: rgba(0, 168, 107, 0.12); }
.dark .kpi-icon--mint { background: rgba(0, 245, 155, 0.15); }

.kpi-icon--amber { background: rgba(255, 122, 0, 0.12); }
.kpi-icon--blue { background: rgba(59, 130, 246, 0.12); }
.kpi-icon--green { background: rgba(16, 185, 129, 0.12); }

.kpi-val {
  font-family: var(--font-display);
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--color-ink-900);
}

.dark .kpi-val { color: #f1faf5; }
.kpi-val--mint { color: #00a86b; }
.dark .kpi-val--mint { color: #00f59b; }

.kpi-sub {
  font-size: 0.72rem;
  color: var(--color-ink-500);
}

.dark .kpi-sub { color: #cbd5e1; }

/* Section Common */
.section-title {
  font-family: var(--font-display);
  font-size: 1.1875rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0 0 0.2rem;
}

.dark .section-title { color: #f1faf5; }

.section-sub {
  font-size: 0.8125rem;
  color: var(--color-ink-500);
  margin: 0;
}

.dark .section-sub { color: #cbd5e1; }

/* Quick Modules */
.quick-modules {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}

@media (max-width: 960px) { .modules-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 580px) { .modules-grid { grid-template-columns: repeat(2, 1fr); } }

.module-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 18px;
  padding: 1.25rem 1rem;
  text-align: center;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.2s ease;
}

.module-card:hover {
  border-color: #00a86b;
  transform: translateY(-3px);
  box-shadow: 0 8px 24px -6px rgba(0, 80, 50, 0.08);
}

.dark .module-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.15);
}

.dark .module-card:hover {
  border-color: #00f59b;
  box-shadow: 0 10px 30px -8px rgba(0, 245, 155, 0.25);
}

.module-icon { font-size: 1.75rem; margin-bottom: 0.2rem; }
.module-title { font-size: 0.875rem; font-weight: 700; color: var(--color-ink-900); }
.dark .module-title { color: #f1faf5; }
.module-desc { font-size: 0.68rem; color: var(--color-ink-400); line-height: 1.3; }

/* Agenda Timeline */
.agenda-section {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 24px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 10px 30px -8px rgba(0, 80, 50, 0.06);
}

.dark .agenda-section {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.16);
  box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.7);
}

.agenda-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-cream-200);
}

.dark .agenda-header { border-bottom-color: rgba(0, 245, 155, 0.12); }

.agenda-filters {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-pills {
  display: flex;
  gap: 0.35rem;
}

.filter-pill {
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--color-cream-300);
  background: var(--color-cream-100);
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-ink-700);
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-pill--active {
  background: #00a86b;
  border-color: #00a86b;
  color: #fff;
}

.dark .filter-pill {
  background: rgba(16, 28, 22, 0.7);
  border-color: rgba(0, 245, 155, 0.15);
  color: #d6e8de;
}

.dark .filter-pill--active {
  background: #00f59b;
  border-color: #00f59b;
  color: #040706;
}

.agenda-search-input {
  padding: 0.5rem 0.85rem;
  border-radius: 12px;
  border: 1px solid var(--color-cream-300);
  background: var(--color-cream-100);
  font-size: 0.8125rem;
  color: var(--color-ink-900);
  outline: none;
}

.dark .agenda-search-input {
  background: rgba(16, 28, 22, 0.7);
  border-color: rgba(0, 245, 155, 0.2);
  color: #f1faf5;
}

.agenda-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.agenda-row {
  background: var(--color-cream-100);
  border: 1px solid var(--color-cream-300);
  border-radius: 18px;
  padding: 1.15rem 1.35rem;
  display: grid;
  grid-template-columns: 80px 1.5fr 1fr 180px 80px;
  align-items: center;
  gap: 1.25rem;
  position: relative;
  transition: border-color 0.18s ease;
}

@media (max-width: 960px) {
  .agenda-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

.dark .agenda-row {
  background: rgba(16, 28, 22, 0.6);
  border-color: rgba(0, 245, 155, 0.15);
}

.agenda-row--waiting { border-left: 4px solid var(--color-joy-tangerine); }
.agenda-row--in_progress { border-left: 4px solid #00a86b; }
.dark .agenda-row--in_progress { border-left-color: #00f59b; }

.agenda-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  border-radius: 10px;
  background: var(--color-cream-200);
}

.dark .agenda-time { background: rgba(16, 28, 22, 0.9); }

.time-main { font-size: 1.15rem; font-weight: 800; color: var(--color-ink-900); }
.dark .time-main { color: #f1faf5; }
.time-dur { font-size: 0.65rem; color: var(--color-ink-500); }

.patient-title-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.p-emoji { font-size: 1.15rem; }
.p-name { font-size: 0.9375rem; font-weight: 700; color: var(--color-ink-900); }
.dark .p-name { color: #f1faf5; }

.p-species-pill {
  font-size: 0.65rem;
  padding: 0.1rem 0.4rem;
  border-radius: 6px;
  background: var(--color-cream-200);
  color: var(--color-ink-600);
}

.dark .p-species-pill { background: rgba(16, 28, 22, 0.8); color: #cbd5e1; }

.p-service { font-size: 0.8125rem; font-weight: 600; color: #00a86b; margin-top: 0.15rem; }
.dark .p-service { color: #00f59b; }
.p-tutor { font-size: 0.72rem; color: var(--color-ink-400); }

.agenda-doctor { display: flex; flex-direction: column; gap: 0.15rem; }
.doc-label { font-size: 0.65rem; text-transform: uppercase; color: var(--color-ink-400); }
.doc-name { font-size: 0.8125rem; font-weight: 700; color: var(--color-ink-900); }
.dark .doc-name { color: #f1faf5; }
.doc-room { font-size: 0.72rem; color: var(--color-ink-500); }
.dark .doc-room { color: #cbd5e1; }

.agenda-status-wrap { display: flex; flex-direction: column; gap: 0.25rem; }
.status-lbl { font-size: 0.65rem; text-transform: uppercase; color: var(--color-ink-400); }

.status-select {
  padding: 0.45rem 0.65rem;
  border-radius: 10px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-50);
  font-size: 0.75rem;
  font-weight: 700;
  outline: none;
  cursor: pointer;
}

.dark .status-select {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.2);
  color: #f1faf5;
}

.status-select--waiting { border-color: var(--color-joy-tangerine); color: var(--color-joy-tangerine); }
.status-select--in_progress { border-color: #00a86b; color: #00a86b; }
.dark .status-select--in_progress { border-color: #00f59b; color: #00f59b; }

.agenda-notes-drawer {
  grid-column: 1 / -1;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--color-cream-300);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.dark .agenda-notes-drawer { border-top-color: rgba(0, 245, 155, 0.15); }

.notes-lbl { font-size: 0.72rem; font-weight: 600; color: var(--color-ink-700); }
.dark .notes-lbl { color: #d6e8de; }

.notes-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  border: 1px solid var(--color-cream-300);
  background: var(--color-cream-50);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--color-ink-900);
  resize: none;
}

.dark .notes-textarea {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.2);
  color: #f1faf5;
}

.notes-actions { display: flex; justify-content: flex-end; }

/* Staff Grid */
.staff-section {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.staff-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

@media (max-width: 650px) { .staff-grid { grid-template-columns: 1fr; } }

.staff-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 20px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dark .staff-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.15);
}

.staff-avatar {
  font-size: 2rem;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 14px;
  background: var(--color-cream-200);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dark .staff-avatar {
  background: rgba(16, 28, 22, 0.8);
  border: 1px solid rgba(0, 245, 155, 0.2);
}

.staff-info { flex: 1; min-width: 0; }
.staff-name { font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: var(--color-ink-900); margin: 0; }
.dark .staff-name { color: #f1faf5; }
.staff-spec { display: block; font-size: 0.75rem; color: #00a86b; }
.dark .staff-spec { color: #00f59b; }
.staff-room { display: block; font-size: 0.72rem; color: var(--color-ink-400); }

.staff-status-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.staff-badge--active {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(0, 168, 107, 0.15);
  color: #007a4d;
}

.dark .staff-badge--active {
  background: rgba(0, 245, 155, 0.15);
  color: #00f59b;
}

.staff-count { font-size: 0.72rem; color: var(--color-ink-400); }
</style>
