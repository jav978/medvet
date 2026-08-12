<template>
  <div class="book-page">
    <div class="book-inner">

      <!-- Header -->
      <div class="book-header">
        <span class="section-eyebrow">Reserva de Citas en Línea</span>
        <h1 class="book-title">Agenda la atención de tu mascota</h1>
      </div>

      <!-- Stepper -->
      <div class="stepper-card">
        <div class="stepper-track">
          <div
            v-for="(item, idx) in stepperItems"
            :key="idx"
            class="stepper-item"
          >
            <div :class="['stepper-circle', getStepClass(idx + 1)]">
              <svg v-if="bookingStore.step > idx + 1" class="stepper-check" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <span :class="['stepper-label', bookingStore.step === idx + 1 ? 'stepper-label--active' : '']">
              {{ item.title }}
            </span>
          </div>
          <!-- Progress line -->
          <div class="stepper-line">
            <div class="stepper-progress" :style="`width: ${((bookingStore.step - 1) / 4) * 100}%`"></div>
          </div>
        </div>
      </div>

      <!-- ─── Step 1: Service ─── -->
      <div v-if="bookingStore.step === 1" class="step-section">
        <div class="step-header">
          <h2 class="step-title">Seleccioná el Servicio</h2>
          <span class="step-hint">Elegí la prestación veterinaria que necesitás</span>
        </div>
        <div class="pick-grid">
          <div
            v-for="service in availableServices"
            :key="service.id"
            @click="bookingStore.selectService(service)"
            :class="['pick-card', bookingStore.selectedService?.id === service.id ? 'pick-card--active' : '']"
          >
            <div class="pick-card-top">
              <span class="pick-duration font-mono-numbers">{{ service.duration }} min</span>
              <svg v-if="bookingStore.selectedService?.id === service.id" class="pick-check" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            </div>
            <h3 class="pick-name">{{ service.name }}</h3>
            <p class="pick-desc">{{ service.description }}</p>
            <div class="pick-price-row">
              <span class="pick-price-label">Arancel</span>
              <span class="pick-price font-mono-numbers">${{ service.price?.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── Step 2: Pet ─── -->
      <div v-if="bookingStore.step === 2" class="step-section">
        <div class="step-header">
          <h2 class="step-title">Seleccioná o Registrá tu Mascota</h2>
          <button @click="showAddPet = !showAddPet" class="btn-ghost btn-sm add-pet-btn">
            {{ showAddPet ? '✕ Cancelar' : '＋ Nueva Mascota' }}
          </button>
        </div>

        <!-- Add pet inline form -->
        <Transition name="expand">
          <div v-if="showAddPet" class="add-pet-panel">
            <h3 class="add-pet-title">🐾 Registrar Nueva Mascota</h3>

            <div class="species-grid">
              <button
                v-for="spec in speciesList"
                :key="spec.name"
                type="button"
                @click="newPet.species = spec.name"
                :class="['species-pick', newPet.species === spec.name ? 'species-pick--active' : '']"
              >
                <span>{{ spec.emoji }}</span>
                <span>{{ spec.name }}</span>
              </button>
            </div>

            <div class="pet-form-grid">
              <div class="form-field">
                <label class="form-label">Nombre *</label>
                <input v-model="newPet.name" type="text" placeholder="Ej. Tobías" class="form-input" required />
              </div>
              <div class="form-field">
                <label class="form-label">Raza</label>
                <input v-model="newPet.breed" type="text" placeholder="Ej. Caniche" class="form-input" />
              </div>
              <div class="form-field">
                <label class="form-label">Edad (años)</label>
                <input v-model.number="newPet.age" type="number" placeholder="3" class="form-input" min="0" />
              </div>
              <div class="form-field">
                <label class="form-label">Peso (kg)</label>
                <input v-model.number="newPet.weight" type="number" placeholder="8.5" step="0.1" class="form-input" min="0" />
              </div>
            </div>

            <textarea
              v-model="newPet.notes"
              placeholder="Notas médicas o alergias conocidas..."
              class="form-input pet-notes"
              rows="2"
            ></textarea>

            <div class="add-pet-actions">
              <button @click="handleAddPet" class="btn-amber" :disabled="!newPet.name">
                Guardar y Seleccionar
              </button>
            </div>
          </div>
        </Transition>

        <div class="pick-grid">
          <div
            v-for="pet in userPets"
            :key="pet.id || pet.name"
            @click="bookingStore.selectPet(pet)"
            :class="['pick-card pick-card--pet', bookingStore.selectedPet?.name === pet.name ? 'pick-card--active' : '']"
          >
            <div class="pet-emoji">{{ getSpeciesEmoji(pet.species) }}</div>
            <div class="pet-info">
              <div class="pet-name">{{ pet.name }}</div>
              <div class="pet-meta">{{ pet.species }}{{ pet.breed ? ` · ${pet.breed}` : '' }}</div>
              <div class="pet-stats font-mono-numbers">
                <span v-if="pet.age">{{ pet.age }} años</span>
                <span v-if="pet.weight">{{ pet.weight }} kg</span>
              </div>
            </div>
            <svg v-if="bookingStore.selectedPet?.name === pet.name" class="pet-selected-check" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
          </div>

          <!-- Add new trigger tile -->
          <div @click="showAddPet = true" class="add-pet-tile">
            <span class="add-pet-tile-icon">＋</span>
            <p class="add-pet-tile-text">Registrar mascota nueva</p>
            <span class="add-pet-tile-sub">Perros, gatos, aves y exóticos</span>
          </div>
        </div>
      </div>

      <!-- ─── Step 3: Date ─── -->
      <div v-if="bookingStore.step === 3" class="step-section">
        <h2 class="step-title">Seleccioná la Fecha</h2>
        <div class="date-card">
          <input
            type="date"
            v-model="selectedDateStr"
            :min="todayStr"
            class="date-input"
            id="appointment-date"
          />
          <label for="appointment-date" class="date-label">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>
            Elegí una fecha disponible
          </label>
          <div v-if="selectedDateStr" class="date-selected">
            Fecha seleccionada: <strong class="font-mono-numbers">{{ formatDate(selectedDateStr) }}</strong>
          </div>
          <button
            class="btn-amber date-confirm-btn"
            :disabled="!selectedDateStr"
            @click="handleDateSelect"
          >
            Buscar Horarios Disponibles
          </button>
        </div>
      </div>

      <!-- ─── Step 4: Time ─── -->
      <div v-if="bookingStore.step === 4" class="step-section">
        <h2 class="step-title">Seleccioná un Horario</h2>
        <div v-if="displayedSlots.length" class="slots-grid">
          <button
            v-for="slot in displayedSlots"
            :key="`${slot.professional_id}-${slot.time}`"
            @click="bookingStore.selectSlot(slot)"
            :class="['slot-btn', bookingStore.selectedSlot?.time === slot.time && bookingStore.selectedSlot?.professional_id === slot.professional_id ? 'slot-btn--active' : '']"
          >
            <span class="slot-time font-mono-numbers">{{ slot.time }}</span>
            <span class="slot-vet">{{ slot.professional_name }}</span>
          </button>
        </div>
        <div v-else class="slots-empty">
          <span>📅</span>
          No hay turnos disponibles para esta fecha. Probá con otro día.
        </div>
      </div>

      <!-- ─── Step 5: Confirm ─── -->
      <div v-if="bookingStore.step === 5" class="step-section">
        <h2 class="step-title">Confirmá tu Cita</h2>
        <div class="summary-card">
          <div class="summary-row">
            <span class="summary-key">Servicio</span>
            <span class="summary-val">{{ bookingStore.selectedService?.name }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-key">Mascota</span>
            <span class="summary-val">{{ bookingStore.selectedPet?.name }} ({{ bookingStore.selectedPet?.species }})</span>
          </div>
          <div class="summary-row">
            <span class="summary-key">Fecha y Hora</span>
            <span class="summary-val font-mono-numbers">{{ bookingStore.selectedDate }} — {{ bookingStore.selectedSlot?.time }} hs</span>
          </div>
          <div class="summary-row">
            <span class="summary-key">Veterinario</span>
            <span class="summary-val">{{ bookingStore.selectedSlot?.professional_name || 'Dr. Mateo Silva' }}</span>
          </div>
          <div class="summary-row summary-row--total">
            <span class="summary-total-label">Total a abonar</span>
            <span class="summary-total-val font-mono-numbers">${{ bookingStore.selectedService?.price?.toLocaleString() }}</span>
          </div>
        </div>

        <div class="notes-field">
          <label for="booking-notes" class="form-label">Notas para el profesional (opcional)</label>
          <textarea
            id="booking-notes"
            v-model="notes"
            class="form-input"
            rows="3"
            placeholder="Describí brevemente síntomas o el motivo de la consulta..."
          ></textarea>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="nav-buttons">
        <button
          v-if="bookingStore.step > 1"
          @click="bookingStore.prevStep()"
          class="btn-ghost nav-prev"
        >
          ← Anterior
        </button>
        <div v-else></div>

        <button
          v-if="bookingStore.step < 5"
          @click="bookingStore.nextStep()"
          class="btn-primary nav-next"
          :disabled="!canProceed"
        >
          Siguiente →
        </button>
        <button
          v-else
          @click="handleConfirm"
          class="btn-amber nav-confirm"
          :disabled="bookingStore.loading"
        >
          <span v-if="bookingStore.loading" class="spinner"></span>
          <span v-else>✓ Confirmar y Agendar</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const bookingStore = useBookingStore()
const router = useRouter()
const route = useRoute()

const selectedDateStr = ref('')
const notes = ref('')
const showAddPet = ref(false)

const todayStr = computed(() => new Date().toISOString().split('T')[0])

const formatDate = (str) => {
  if (!str) return ''
  const d = new Date(str + 'T12:00:00')
  return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

const speciesList = [
  { name: 'Perro', emoji: '🐶' },
  { name: 'Gato', emoji: '🐱' },
  { name: 'Ave / Loro', emoji: '🦜' },
  { name: 'Conejo', emoji: '🐰' },
  { name: 'Exótico', emoji: '🐍' }
]

const newPet = reactive({ name: '', species: 'Perro', breed: '', age: null, weight: null, notes: '' })

const defaultPets = ref([
  { id: 1, name: 'Thor', species: 'Perro', breed: 'Golden Retriever', age: 4, weight: 28.5 },
  { id: 2, name: 'Mishi', species: 'Gato', breed: 'Siamés', age: 2, weight: 4.2 }
])

const userPets = computed(() => bookingStore.pets?.length ? bookingStore.pets : defaultPets.value)

const stepperItems = [
  { title: 'Servicio' },
  { title: 'Mascota' },
  { title: 'Fecha' },
  { title: 'Horario' },
  { title: 'Confirmación' }
]

const getStepClass = (n) => {
  if (bookingStore.step === n) return 'stepper-circle--current'
  if (bookingStore.step > n) return 'stepper-circle--done'
  return 'stepper-circle--pending'
}

const getSpeciesEmoji = (species) => {
  const m = speciesList.find(s => s.name.toLowerCase().includes((species || '').toLowerCase()))
  return m ? m.emoji : '🐾'
}

const handleAddPet = () => {
  if (!newPet.name) return
  const pet = { id: Date.now(), name: newPet.name, species: newPet.species, breed: newPet.breed, age: newPet.age, weight: newPet.weight }
  if (!bookingStore.pets) bookingStore.pets = []
  bookingStore.pets.push(pet)
  defaultPets.value.push(pet)
  bookingStore.selectPet(pet)
  showAddPet.value = false
  Object.assign(newPet, { name: '', species: 'Perro', breed: '', age: null, weight: null, notes: '' })
}

const fallbackServices = [
  { id: 1, name: 'Consulta Clínica General', description: 'Revisión médica completa y diagnóstica.', duration: 30, price: 15000 },
  { id: 2, name: 'Vacunación Completa', description: 'Esquema quíntuple/antirrábica.', duration: 20, price: 18000 },
  { id: 3, name: 'Perfil de Laboratorio', description: 'Análisis de sangre y bioquímica.', duration: 25, price: 22000 },
  { id: 4, name: 'Cirugía & Castración', description: 'Procedimiento quirúrgico con anestesia.', duration: 60, price: 45000 }
]

const availableServices = computed(() => bookingStore.services?.length ? bookingStore.services : fallbackServices)

const fallbackSlots = [
  { time: '09:00', professional_id: 1, professional_name: 'Dr. Mateo Silva', available: true },
  { time: '10:30', professional_id: 1, professional_name: 'Dr. Mateo Silva', available: true },
  { time: '14:00', professional_id: 2, professional_name: 'Dra. Camila Torres', available: true },
  { time: '15:30', professional_id: 2, professional_name: 'Dra. Camila Torres', available: true },
  { time: '17:00', professional_id: 1, professional_name: 'Dr. Mateo Silva', available: true }
]

const displayedSlots = computed(() =>
  bookingStore.availableSlots?.length ? bookingStore.availableSlots.filter(s => s.available) : fallbackSlots
)

const canProceed = computed(() => {
  switch (bookingStore.step) {
    case 1: return !!bookingStore.selectedService
    case 2: return !!bookingStore.selectedPet
    case 3: return !!bookingStore.selectedDate
    case 4: return !!bookingStore.selectedSlot
    default: return true
  }
})

const handleDateSelect = async () => {
  if (!selectedDateStr.value) return
  bookingStore.selectDate(selectedDateStr.value)
  try {
    await bookingStore.fetchAvailableSlots(bookingStore.selectedService?.id || 1, selectedDateStr.value)
  } catch { /* use fallback */ }
}

const handleConfirm = async () => {
  if (!authStore.isAuthenticated) { router.push('/login'); return }
  try {
    const apt = await bookingStore.confirmBooking(authStore.user.id, notes.value)
    router.push(apt?.id ? `/book/confirm/${apt.id}` : '/dashboard')
  } catch {
    router.push('/dashboard')
  }
}

onMounted(async () => {
  const serviceId = route.query.service
  try {
    await bookingStore.fetchServices()
    if (serviceId) {
      const svc = availableServices.value.find(s => String(s.id) === String(serviceId))
      if (svc) bookingStore.selectService(svc)
    }
    if (authStore.isAuthenticated && authStore.user?.id) {
      await bookingStore.fetchPets(authStore.user.id)
    }
  } catch { /* continue */ }
})
</script>

<style scoped>
.book-page {
  min-height: 80vh;
  padding: 3rem 1.5rem 5rem;
  background: var(--color-cream-100);
}

.dark .book-page { background: var(--color-forest-950); }

.book-inner {
  max-width: 840px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header */
.book-header { text-align: center; }

.section-eyebrow {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-forest-700);
  display: block;
  margin-bottom: 0.5rem;
}
.dark .section-eyebrow { color: var(--color-forest-400); }

.book-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
}
.dark .book-title { color: #d4e8d6; }

/* Stepper */
.stepper-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 18px;
  padding: 1.5rem 2rem;
}
.dark .stepper-card {
  background: #162210;
  border-color: rgba(61, 122, 82, 0.2);
}

.stepper-track {
  display: flex;
  justify-content: space-between;
  position: relative;
  align-items: flex-start;
}

.stepper-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
  flex: 1;
}

.stepper-circle {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  transition: all 0.25s ease;
}

.stepper-circle--current {
  background: var(--color-forest-900);
  color: #fff;
  box-shadow: 0 4px 12px -4px rgba(27, 58, 42, 0.45);
  transform: scale(1.1);
}

.stepper-circle--done {
  background: var(--color-forest-100);
  color: var(--color-forest-700);
  border: 1.5px solid var(--color-forest-300, #a0c8a8);
}
.dark .stepper-circle--done {
  background: rgba(45, 90, 61, 0.2);
  color: var(--color-forest-400);
  border-color: rgba(78, 154, 103, 0.3);
}

.stepper-circle--pending {
  background: var(--color-cream-200);
  color: var(--color-ink-300);
}
.dark .stepper-circle--pending {
  background: rgba(27, 58, 42, 0.3);
  color: #3d5e40;
}

.stepper-check { width: 1rem; height: 1rem; }

.stepper-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--color-ink-300);
  text-align: center;
  display: none;
}
@media (min-width: 500px) { .stepper-label { display: block; } }

.stepper-label--active { color: var(--color-forest-700); }
.dark .stepper-label--active { color: var(--color-forest-400); }

.stepper-line {
  position: absolute;
  top: 1.1rem;
  left: 10%;
  right: 10%;
  height: 2px;
  background: var(--color-cream-200);
  z-index: 0;
  border-radius: 1px;
}
.dark .stepper-line { background: rgba(45, 90, 61, 0.25); }

.stepper-progress {
  height: 100%;
  background: var(--color-forest-700);
  border-radius: 1px;
  transition: width 0.35s ease;
}

/* Steps */
.step-section { display: flex; flex-direction: column; gap: 1.25rem; }

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.step-title {
  font-family: var(--font-display);
  font-size: 1.3125rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
}
.dark .step-title { color: #c8deca; }

.step-hint {
  font-size: 0.8rem;
  color: var(--color-ink-300);
}

/* Pick cards */
.pick-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
@media (max-width: 540px) { .pick-grid { grid-template-columns: 1fr; } }

.pick-card {
  background: var(--color-cream-50);
  border: 1.5px solid var(--color-cream-200);
  border-radius: 18px;
  padding: 1.25rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all 0.2s ease;
}
.pick-card:hover { border-color: rgba(78, 154, 103, 0.45); }

.pick-card--active {
  border-color: var(--color-forest-700);
  border-width: 2px;
  background: var(--color-forest-50, #f2faf4);
  box-shadow: 0 4px 16px -6px rgba(27, 58, 42, 0.2);
}
.dark .pick-card {
  background: #162210;
  border-color: rgba(61, 122, 82, 0.18);
}
.dark .pick-card--active {
  border-color: var(--color-forest-500);
  background: rgba(45, 90, 61, 0.12);
}

.pick-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pick-duration {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  background: var(--color-cream-200);
  color: var(--color-ink-500);
}
.dark .pick-duration { background: rgba(27, 58, 42, 0.5); color: #6b8e6e; }

.pick-check { width: 1.25rem; height: 1.25rem; color: var(--color-forest-700); }

.pick-name {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
}
.dark .pick-name { color: #c8deca; }

.pick-desc {
  font-size: 0.78rem;
  color: var(--color-ink-500);
  line-height: 1.55;
  flex-grow: 1;
  margin: 0;
}
.dark .pick-desc { color: #5a7e5e; }

.pick-price-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-cream-200);
  margin-top: 0.25rem;
}
.dark .pick-price-row { border-top-color: rgba(61, 122, 82, 0.15); }

.pick-price-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: var(--color-ink-300);
  font-weight: 600;
}

.pick-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-forest-700);
}
.dark .pick-price { color: var(--color-forest-400); }

/* Pet card variant */
.pick-card--pet {
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.pet-emoji { font-size: 2rem; flex-shrink: 0; }

.pet-info { flex: 1; }

.pet-name {
  font-weight: 700;
  font-size: 0.9375rem;
  color: var(--color-ink-900);
}
.dark .pet-name { color: #c8deca; }

.pet-meta {
  font-size: 0.75rem;
  color: var(--color-ink-500);
  margin-top: 0.1rem;
}
.dark .pet-meta { color: #5a7e5e; }

.pet-stats {
  font-size: 0.7rem;
  color: var(--color-ink-300);
  margin-top: 0.2rem;
  display: flex;
  gap: 0.5rem;
}

.pet-selected-check {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-forest-700);
  flex-shrink: 0;
}

/* Add pet tile */
.add-pet-tile {
  border: 2px dashed var(--color-cream-300);
  border-radius: 18px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  gap: 0.3rem;
  transition: border-color 0.18s, background 0.18s;
}
.add-pet-tile:hover {
  border-color: var(--color-forest-600);
  background: var(--color-forest-50, #f2faf4);
}
.dark .add-pet-tile {
  border-color: rgba(61, 122, 82, 0.2);
}
.dark .add-pet-tile:hover {
  border-color: rgba(78, 154, 103, 0.45);
  background: rgba(45, 90, 61, 0.08);
}

.add-pet-tile-icon { font-size: 1.75rem; color: var(--color-forest-600); }
.add-pet-tile-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-ink-700);
}
.dark .add-pet-tile-text { color: #8aab8e; }
.add-pet-tile-sub {
  font-size: 0.7rem;
  color: var(--color-ink-300);
}

/* Inline add pet form */
.add-pet-btn { font-size: 0.8125rem; padding: 0.4rem 0.85rem; }

.add-pet-panel {
  background: var(--color-forest-50, #f2faf4);
  border: 1.5px solid rgba(78, 154, 103, 0.25);
  border-radius: 18px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.dark .add-pet-panel {
  background: rgba(22, 34, 16, 0.6);
  border-color: rgba(61, 122, 82, 0.25);
}

.add-pet-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
}
.dark .add-pet-title { color: #c8deca; }

.species-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 0.5rem;
}

.species-pick {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-50);
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--color-ink-700);
}
.species-pick:hover { border-color: var(--color-forest-600); }
.species-pick--active {
  background: var(--color-forest-900);
  border-color: var(--color-forest-900);
  color: #fff;
}

.pet-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
@media (max-width: 480px) { .pet-form-grid { grid-template-columns: 1fr; } }

.form-field { display: flex; flex-direction: column; gap: 0.3rem; }
.form-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-ink-700);
}
.dark .form-label { color: #8aab8e; }

.form-input {
  padding: 0.65rem 0.875rem;
  border-radius: 10px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-100);
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-ink-900);
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s;
  width: 100%;
}
.form-input:focus {
  border-color: var(--color-forest-600);
  box-shadow: 0 0 0 3px rgba(78, 154, 103, 0.15);
}
.dark .form-input {
  background: rgba(14, 31, 20, 0.6);
  border-color: rgba(61, 122, 82, 0.25);
  color: #d4e8d6;
}

.pet-notes { resize: none; }

.add-pet-actions { display: flex; justify-content: flex-end; }

/* Date step */
.date-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}
.dark .date-card {
  background: #162210;
  border-color: rgba(61, 122, 82, 0.18);
}

.date-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-ink-500);
  cursor: pointer;
}
.date-label svg { width: 1rem; height: 1rem; color: var(--color-forest-600); }

.date-input {
  width: 100%;
  max-width: 280px;
  padding: 0.875rem 1rem;
  border-radius: 14px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-100);
  font-family: var(--font-mono);
  font-size: 1.0625rem;
  color: var(--color-ink-900);
  text-align: center;
  outline: none;
  cursor: pointer;
  transition: border-color 0.18s;
}
.date-input:focus { border-color: var(--color-forest-600); }
.dark .date-input {
  background: rgba(14, 31, 20, 0.6);
  border-color: rgba(61, 122, 82, 0.25);
  color: #c8deca;
}
.dark .date-input::-webkit-calendar-picker-indicator { filter: invert(1); }

.date-selected {
  font-size: 0.875rem;
  color: var(--color-ink-500);
}
.dark .date-selected { color: #5a7e5e; }

.date-confirm-btn { width: 100%; max-width: 320px; justify-content: center; }
.date-confirm-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

/* Slots */
.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.875rem;
}

.slot-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.875rem 1rem;
  border-radius: 14px;
  border: 1.5px solid var(--color-cream-200);
  background: var(--color-cream-50);
  cursor: pointer;
  transition: all 0.18s ease;
  font-family: var(--font-body);
}
.slot-btn:hover { border-color: var(--color-forest-600); }
.slot-btn--active {
  background: var(--color-forest-900);
  border-color: var(--color-forest-900);
  color: #fff;
  box-shadow: 0 4px 16px -6px rgba(27, 58, 42, 0.4);
  transform: scale(1.03);
}
.dark .slot-btn {
  background: #162210;
  border-color: rgba(61, 122, 82, 0.18);
  color: #c8deca;
}
.dark .slot-btn:hover { border-color: rgba(78, 154, 103, 0.5); }

.slot-time {
  font-size: 1.1rem;
  font-weight: 700;
}
.slot-vet {
  font-size: 0.65rem;
  opacity: 0.7;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 110px;
}

.slots-empty {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 16px;
  padding: 3rem 1.5rem;
  text-align: center;
  color: var(--color-ink-500);
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.dark .slots-empty {
  background: #162210;
  border-color: rgba(61, 122, 82, 0.15);
  color: #5a7e5e;
}

/* Summary */
.summary-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 20px;
  overflow: hidden;
}
.dark .summary-card {
  background: #162210;
  border-color: rgba(61, 122, 82, 0.18);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1.5rem;
  border-bottom: 1px solid var(--color-cream-200);
  font-size: 0.875rem;
}
.dark .summary-row { border-bottom-color: rgba(61, 122, 82, 0.12); }

.summary-key { color: var(--color-ink-500); }
.dark .summary-key { color: #5a7e5e; }

.summary-val {
  font-weight: 600;
  color: var(--color-ink-900);
  text-align: right;
}
.dark .summary-val { color: #c8deca; }

.summary-row--total {
  border-bottom: none;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.summary-total-label {
  font-size: 1rem;
  font-weight: 700;
  font-family: var(--font-display);
  color: var(--color-ink-900);
}
.dark .summary-total-label { color: #c8deca; }

.summary-total-val {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-forest-700);
}
.dark .summary-total-val { color: var(--color-forest-400); }

.notes-field { display: flex; flex-direction: column; gap: 0.4rem; }

/* Nav buttons */
.nav-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-cream-200);
}
.dark .nav-buttons { border-top-color: rgba(61, 122, 82, 0.15); }

.nav-prev { font-size: 0.9rem; }
.nav-next { font-size: 0.9375rem; padding: 0.75rem 1.75rem; }
.nav-next:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
.nav-confirm { font-size: 0.9375rem; padding: 0.875rem 2rem; }
.nav-confirm:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Expand transition */
.expand-enter-active, .expand-leave-active {
  transition: all 0.28s ease;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
}
</style>
