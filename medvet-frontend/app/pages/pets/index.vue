<template>
  <div class="pets-page">
    <div class="pets-glow-ambient"></div>

    <div class="pets-inner">

      <!-- Header -->
      <div class="pets-header">
        <div>
          <div class="pets-badge-row">
            <span class="pets-eyebrow">Gestión de Pacientes</span>
            <span class="pets-count-badge">
              <span class="count-dot"></span>
              {{ userPets.length }} Pacientes Registrados
            </span>
          </div>
          <h1 class="pets-title">Mis Mascotas & Fichas Clínicas</h1>
          <p class="pets-subtitle">
            Accedé a la historia clínica digital completa, recetas médicas, calendario de vacunas y carnets oficiales.
          </p>
        </div>

        <div class="pets-header-actions">
          <button type="button" @click="showAddModal = true" class="btn-primary pets-add-btn">
            <span>＋</span>
            <span>Registrar Nueva Mascota</span>
          </button>
        </div>
      </div>

      <!-- Filters and Search Bar -->
      <div class="pets-filter-bar">
        <div class="species-filter-pills">
          <button
            v-for="cat in speciesCategories"
            :key="cat.id"
            type="button"
            @click="activeSpecies = cat.id"
            :class="['spec-pill', activeSpecies === cat.id ? 'spec-pill--active' : '']"
          >
            <span>{{ cat.icon }}</span>
            <span>{{ cat.label }}</span>
          </button>
        </div>

        <div class="pets-search-wrap">
          <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre, raza o microchip..."
            class="pets-search-input"
          />
        </div>
      </div>

      <!-- Pets Grid -->
      <div class="pets-grid">
        <div
          v-for="pet in filteredPets"
          :key="pet.id"
          class="pet-master-card"
        >
          <div class="pet-card-top">
            <div class="pet-avatar-large">
              {{ getSpeciesEmoji(pet.species) }}
            </div>
            <div class="pet-badge-stack">
              <span class="pet-species-tag">{{ pet.species }}</span>
              <span class="pet-health-status">
                <span class="health-dot"></span>
                Al día
              </span>
            </div>
          </div>

          <div class="pet-card-body">
            <h2 class="pet-card-name">{{ pet.name }}</h2>
            <p class="pet-card-breed">{{ pet.breed || 'Raza no especificada' }}</p>

            <div class="pet-vitals-grid font-mono-numbers">
              <div class="vital-item">
                <span class="vital-lbl">Edad</span>
                <span class="vital-val">{{ pet.age || '4' }} años</span>
              </div>
              <div class="vital-item">
                <span class="vital-lbl">Peso</span>
                <span class="vital-val">{{ pet.weight || '28.5' }} kg</span>
              </div>
              <div class="vital-item">
                <span class="vital-lbl">Sexo</span>
                <span class="vital-val">{{ pet.sex === 'H' ? 'Hembra' : 'Macho' }}</span>
              </div>
              <div class="vital-item">
                <span class="vital-lbl">Microchip</span>
                <span class="vital-val vital-val--chip">{{ pet.chip || 'AR-98214' }}</span>
              </div>
            </div>

            <div class="pet-alert-box" v-if="pet.allergies">
              <span class="alert-icon">⚠️</span>
              <span class="alert-text">{{ pet.allergies }}</span>
            </div>
          </div>

          <div class="pet-card-footer">
            <NuxtLink :to="`/pets/${pet.id}`" class="btn-primary pet-action-btn">
              <span>📋</span>
              <span>Historia Clínica</span>
            </NuxtLink>
            <div class="pet-sub-actions">
              <NuxtLink :to="`/dashboard/carnet?pet=${pet.id}`" class="btn-ghost btn-sm">
                🪪 Carnet QR
              </NuxtLink>
              <NuxtLink :to="`/book?pet=${pet.id}`" class="btn-ghost btn-sm">
                📅 Turno
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Add Pet Card Tile -->
        <div @click="showAddModal = true" class="add-pet-card-tile">
          <div class="add-tile-icon">＋</div>
          <h3 class="add-tile-title">Registrar Nueva Mascota</h3>
          <p class="add-tile-desc">Añadí un nuevo perro, gato, ave o animal exótico a tu perfil familiar.</p>
          <span class="add-tile-btn">Comenzar Registro →</span>
        </div>
      </div>

    </div>

    <!-- Modal Registrar Mascota -->
    <div v-if="showAddModal" class="modal-backdrop" @click.self="showAddModal = false">
      <div class="modal-box">
        <div class="modal-header">
          <div>
            <span class="modal-eyebrow">Alta de Paciente Veterinario</span>
            <h2 class="modal-title">Registrar Mascota</h2>
          </div>
          <button @click="showAddModal = false" class="modal-close-btn">✕</button>
        </div>

        <form @submit.prevent="handleCreatePet" class="modal-form">
          <!-- Species Selector -->
          <div class="form-group">
            <label class="form-label">Especie *</label>
            <div class="species-picker-grid">
              <button
                v-for="spec in speciesPickerList"
                :key="spec.name"
                type="button"
                @click="formPet.species = spec.name"
                :class="['spec-choice', formPet.species === spec.name ? 'spec-choice--active' : '']"
              >
                <span class="spec-choice-emoji">{{ spec.emoji }}</span>
                <span class="spec-choice-name">{{ spec.name }}</span>
              </button>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Nombre de la Mascota *</label>
              <input v-model="formPet.name" type="text" placeholder="Ej. Thor, Luna, Rocky" class="form-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">Raza / Tipo</label>
              <input v-model="formPet.breed" type="text" placeholder="Ej. Golden Retriever, Mestizo" class="form-input" />
            </div>
          </div>

          <div class="form-grid-3">
            <div class="form-group">
              <label class="form-label">Edad (años)</label>
              <input v-model.number="formPet.age" type="number" placeholder="Ej. 3" class="form-input" min="0" />
            </div>
            <div class="form-group">
              <label class="form-label">Peso Aprox. (kg)</label>
              <input v-model.number="formPet.weight" type="number" placeholder="Ej. 25.5" step="0.1" class="form-input" min="0" />
            </div>
            <div class="form-group">
              <label class="form-label">Sexo</label>
              <select v-model="formPet.sex" class="form-input">
                <option value="M">Macho</option>
                <option value="H">Hembra</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Número de Microchip ISO (opcional)</label>
            <input v-model="formPet.chip" type="text" placeholder="Ej. AR-98214-001" class="form-input font-mono-numbers" />
          </div>

          <div class="form-group">
            <label class="form-label">Alergias o Condiciones Médicas Conocidas</label>
            <input v-model="formPet.allergies" type="text" placeholder="Ej. Alergia a picadura de pulga, cardiopatía..." class="form-input" />
          </div>

          <div class="modal-actions">
            <button type="button" @click="showAddModal = false" class="btn-ghost">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="!formPet.name.trim()">
              ✓ Guardar Paciente
            </button>
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

const authStore = useAuthStore()

const activeSpecies = ref('all')
const searchQuery = ref('')
const showAddModal = ref(false)

const speciesCategories = [
  { id: 'all', label: 'Todos', icon: '🐾' },
  { id: 'perro', label: 'Perros', icon: '🐶' },
  { id: 'gato', label: 'Gatos', icon: '🐱' },
  { id: 'ave', label: 'Aves', icon: '🦜' },
  { id: 'exotico', label: 'Exóticos', icon: '🐍' }
]

const speciesPickerList = [
  { name: 'Perro', emoji: '🐶' },
  { name: 'Gato', emoji: '🐱' },
  { name: 'Ave / Loro', emoji: '🦜' },
  { name: 'Conejo', emoji: '🐰' },
  { name: 'Exótico / Reptil', emoji: '🐍' }
]

const formPet = reactive({
  name: '',
  species: 'Perro',
  breed: '',
  age: null,
  weight: null,
  sex: 'M',
  chip: '',
  allergies: ''
})

const defaultPets = ref([
  {
    id: '1',
    name: 'Thor',
    species: 'Perro',
    breed: 'Golden Retriever',
    age: 4,
    weight: 28.5,
    sex: 'M',
    chip: 'AR-98214-998',
    allergies: 'Sensibilidad a la picadura de pulgas'
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
    allergies: ''
  },
  {
    id: '3',
    name: 'Pelusa',
    species: 'Conejo',
    breed: 'Enano Holandés',
    age: 1,
    weight: 1.4,
    sex: 'H',
    chip: 'AR-55102-300',
    allergies: ''
  }
])

const userPets = computed(() => defaultPets.value)

const filteredPets = computed(() => {
  return userPets.value.filter(p => {
    const matchesSpec = activeSpecies.value === 'all' || p.species.toLowerCase().includes(activeSpecies.value)
    const q = searchQuery.value.trim().toLowerCase()
    const matchesSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      (p.breed || '').toLowerCase().includes(q) ||
      (p.chip || '').toLowerCase().includes(q)
    return matchesSpec && matchesSearch
  })
})

const getSpeciesEmoji = (species) => {
  const s = (species || '').toLowerCase()
  if (s.includes('perro')) return '🐶'
  if (s.includes('gato')) return '🐱'
  if (s.includes('ave') || s.includes('loro')) return '🦜'
  if (s.includes('conejo')) return '🐰'
  return '🐍'
}

const handleCreatePet = () => {
  if (!formPet.name.trim()) return
  const newPet = {
    id: Date.now().toString(),
    name: formPet.name.trim(),
    species: formPet.species,
    breed: formPet.breed.trim(),
    age: formPet.age || 1,
    weight: formPet.weight || 5,
    sex: formPet.sex,
    chip: formPet.chip.trim() || `AR-${Math.floor(10000 + Math.random() * 90000)}`,
    allergies: formPet.allergies.trim()
  }
  defaultPets.value.push(newPet)
  showAddModal.value = false
  Object.assign(formPet, { name: '', species: 'Perro', breed: '', age: null, weight: null, sex: 'M', chip: '', allergies: '' })
}

onMounted(async () => {
  try {
    const { $feathers } = useNuxtApp()
    if ($feathers && authStore.user?.id) {
      const res = await $feathers.service('pets').find({ query: { user_id: authStore.user.id } })
      const data = res.data || res
      if (data && data.length) {
        defaultPets.value = data
      }
    }
  } catch {
    // Keep fallbacks
  }
})
</script>

<style scoped>
.pets-page {
  position: relative;
  min-height: 85vh;
  padding: 3.5rem 1.5rem 6rem;
  background-color: var(--color-cream-100);
  overflow: hidden;
}

:global(.dark) .pets-page {
  background-color: #040706;
}

.pets-glow-ambient {
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

.pets-inner {
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
.pets-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.pets-badge-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.pets-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #00a86b;
}

:global(.dark) .pets-eyebrow { color: #00f59b; }

.pets-count-badge {
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

:global(.dark) .pets-count-badge {
  background: rgba(0, 245, 155, 0.12);
  color: #00f59b;
}

.count-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00f59b;
  box-shadow: 0 0 6px #00f59b;
}

.pets-title {
  font-family: var(--font-display);
  font-size: clamp(1.85rem, 3.5vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--color-ink-900);
  margin: 0 0 0.4rem;
}

:global(.dark) .pets-title { color: #f1faf5; }

.pets-subtitle {
  font-size: 0.9375rem;
  color: var(--color-ink-500);
  margin: 0;
  max-width: 600px;
}

:global(.dark) .pets-subtitle { color: #8ca395; }

.pets-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.75rem 1.45rem;
  font-size: 0.875rem;
}

/* Filter Bar */
.pets-filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.species-filter-pills {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.spec-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.95rem;
  border-radius: 999px;
  border: 1px solid var(--color-cream-300);
  background: var(--color-cream-50);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-ink-700);
  cursor: pointer;
  transition: all 0.15s ease;
}

.spec-pill:hover { border-color: #00a86b; color: #007a4d; }

.spec-pill--active {
  background: #00a86b;
  border-color: #00a86b;
  color: #fff;
  font-weight: 700;
}

:global(.dark) .spec-pill {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.15);
  color: #d6e8de;
}

:global(.dark) .spec-pill:hover { border-color: #00f59b; color: #00f59b; }

:global(.dark) .spec-pill--active {
  background: #00f59b;
  border-color: #00f59b;
  color: #040706;
  box-shadow: 0 0 14px rgba(0, 245, 155, 0.4);
}

.pets-search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 280px;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  width: 1rem;
  height: 1rem;
  color: var(--color-ink-400);
  pointer-events: none;
}

.pets-search-input {
  width: 100%;
  padding: 0.55rem 1rem 0.55rem 2.35rem;
  border-radius: 12px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-50);
  font-size: 0.8125rem;
  color: var(--color-ink-900);
  outline: none;
}

.pets-search-input:focus { border-color: #00a86b; }

:global(.dark) .pets-search-input {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.2);
  color: #f1faf5;
}

:global(.dark) .pets-search-input:focus { border-color: #00f59b; }

/* Pets Grid */
.pets-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 960px) { .pets-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .pets-grid { grid-template-columns: 1fr; } }

.pet-master-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 24px;
  padding: 1.65rem;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  box-shadow: 0 10px 30px -8px rgba(0, 80, 50, 0.06);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.pet-master-card:hover {
  transform: translateY(-3px);
  border-color: #00a86b;
}

:global(.dark) .pet-master-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.16);
  box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.7);
}

:global(.dark) .pet-master-card:hover {
  border-color: #00f59b;
  box-shadow: 0 12px 36px -8px rgba(0, 245, 155, 0.25);
}

.pet-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.pet-avatar-large {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 16px;
  background: var(--color-cream-200);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

:global(.dark) .pet-avatar-large {
  background: rgba(16, 28, 22, 0.9);
  border: 1px solid rgba(0, 245, 155, 0.2);
}

.pet-badge-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
}

.pet-species-tag {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  background: rgba(0, 168, 107, 0.12);
  color: #007a4d;
}

:global(.dark) .pet-species-tag {
  background: rgba(0, 245, 155, 0.15);
  color: #00f59b;
}

.pet-health-status {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.65rem;
  color: var(--color-ink-500);
}

:global(.dark) .pet-health-status { color: #8ca395; }

.health-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00f59b;
}

.pet-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  flex: 1;
}

.pet-card-name {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-ink-900);
  margin: 0;
}

:global(.dark) .pet-card-name { color: #f1faf5; }

.pet-card-breed {
  font-size: 0.8125rem;
  color: var(--color-ink-500);
  margin: 0 0 0.5rem;
}

:global(.dark) .pet-card-breed { color: #8ca395; }

.pet-vitals-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
  padding: 0.85rem;
  background: var(--color-cream-100);
  border-radius: 14px;
}

:global(.dark) .pet-vitals-grid { background: rgba(16, 28, 22, 0.6); }

.vital-item { display: flex; flex-direction: column; gap: 0.1rem; }
.vital-lbl { font-size: 0.65rem; text-transform: uppercase; color: var(--color-ink-400); font-weight: 600; }
.vital-val { font-size: 0.8125rem; font-weight: 700; color: var(--color-ink-900); }
:global(.dark) .vital-val { color: #f1faf5; }
.vital-val--chip { color: #00a86b; font-size: 0.72rem; }
:global(.dark) .vital-val--chip { color: #00f59b; }

.pet-alert-box {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  background: rgba(255, 122, 0, 0.1);
  border: 1px solid rgba(255, 122, 0, 0.25);
  font-size: 0.72rem;
  color: var(--color-joy-tangerine);
  margin-top: 0.25rem;
}

.pet-card-footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.85rem;
  border-top: 1px solid var(--color-cream-200);
}

:global(.dark) .pet-card-footer { border-top-color: rgba(0, 245, 155, 0.12); }

.pet-action-btn {
  width: 100%;
  justify-content: center;
  padding: 0.65rem 1rem;
  font-size: 0.84rem;
  text-decoration: none;
}

.pet-sub-actions {
  display: flex;
  gap: 0.5rem;
}

.pet-sub-actions .btn-ghost {
  flex: 1;
  justify-content: center;
  font-size: 0.75rem;
  text-decoration: none;
  padding: 0.45rem;
}

/* Add Pet Card Tile */
.add-pet-card-tile {
  border: 2px dashed var(--color-cream-300);
  border-radius: 24px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  gap: 0.65rem;
  transition: all 0.2s ease;
}

.add-pet-card-tile:hover {
  border-color: #00a86b;
  background: rgba(0, 168, 107, 0.04);
  transform: translateY(-3px);
}

:global(.dark) .add-pet-card-tile {
  border-color: rgba(0, 245, 155, 0.2);
}

:global(.dark) .add-pet-card-tile:hover {
  border-color: #00f59b;
  background: rgba(0, 245, 155, 0.06);
}

.add-tile-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: rgba(0, 168, 107, 0.12);
  color: #00a86b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
}

:global(.dark) .add-tile-icon {
  background: rgba(0, 245, 155, 0.15);
  color: #00f59b;
}

.add-tile-title {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
}

:global(.dark) .add-tile-title { color: #f1faf5; }

.add-tile-desc {
  font-size: 0.78rem;
  color: var(--color-ink-400);
  line-height: 1.4;
  margin: 0;
}

.add-tile-btn {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #00a86b;
  margin-top: 0.5rem;
}

:global(.dark) .add-tile-btn { color: #00f59b; }

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
  max-width: 580px;
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
  margin-bottom: 1.5rem;
}

.modal-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #00a86b;
}

:global(.dark) .modal-eyebrow { color: #00f59b; }

.modal-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-ink-900);
  margin: 0.2rem 0 0;
}

:global(.dark) .modal-title { color: #f1faf5; }

.modal-close-btn {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: var(--color-ink-400);
  cursor: pointer;
}

.modal-form { display: flex; flex-direction: column; gap: 1.15rem; }

.form-group { display: flex; flex-direction: column; gap: 0.35rem; }

.form-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-ink-700);
}

:global(.dark) .form-label { color: #d6e8de; }

.form-input {
  padding: 0.65rem 0.85rem;
  border-radius: 12px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-100);
  font-size: 0.84rem;
  color: var(--color-ink-900);
  outline: none;
}

:global(.dark) .form-input {
  background: rgba(16, 28, 22, 0.7);
  border-color: rgba(0, 245, 155, 0.2);
  color: #f1faf5;
}

.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; }
.form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.85rem; }

.species-picker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.45rem;
}

.spec-choice {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  border: 1px solid var(--color-cream-300);
  background: var(--color-cream-100);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--color-ink-700);
}

.spec-choice--active {
  background: #00a86b;
  border-color: #00a86b;
  color: #fff;
  font-weight: 700;
}

:global(.dark) .spec-choice {
  background: rgba(16, 28, 22, 0.6);
  border-color: rgba(0, 245, 155, 0.15);
  color: #d6e8de;
}

:global(.dark) .spec-choice--active {
  background: #00f59b;
  border-color: #00f59b;
  color: #040706;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
</style>
