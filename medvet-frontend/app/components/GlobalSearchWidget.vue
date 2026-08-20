<template>
  <div class="search-widget-root">

    <!-- Desktop Navbar Trigger Button -->
    <button
      type="button"
      class="search-trigger-btn"
      @click="openSearchModal"
      title="Buscar en MedVet (Ctrl + K)"
      aria-label="Abrir buscador global"
    >
      <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
      </svg>
      <span class="search-placeholder">Buscar en MedVet...</span>
      <kbd class="search-kbd">
        <span class="kbd-mod">{{ isMac ? '⌘' : 'Ctrl' }}</span> K
      </kbd>
    </button>

    <!-- Mobile Icon Trigger Button -->
    <button
      type="button"
      class="search-mobile-btn"
      @click="openSearchModal"
      title="Buscar"
      aria-label="Abrir buscador global"
    >
      <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- Global Search Modal Backdrop (Command Palette) -->
    <Teleport to="body">
      <Transition name="search-fade">
        <div
          v-if="isOpen"
          class="search-modal-backdrop"
          @click.self="closeSearchModal"
          role="dialog"
          aria-modal="true"
          aria-label="Buscador Global de MedVet"
        >
          <div class="search-modal-container">

            <!-- Search Header Bar -->
            <div class="search-input-wrapper">
              <svg class="search-modal-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
              <input
                ref="searchInputRef"
                v-model="query"
                type="text"
                class="search-modal-input"
                placeholder="Buscar servicios, médicos, especies, vacunas, urgencias..."
                @keydown.down.prevent="navigateResults(1)"
                @keydown.up.prevent="navigateResults(-1)"
                @keydown.enter.prevent="selectActiveResult"
                @keydown.esc="closeSearchModal"
              />
              <button
                v-if="query"
                type="button"
                class="search-clear-btn"
                @click="query = ''"
                aria-label="Limpiar búsqueda"
              >
                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
              </button>
              <button
                type="button"
                class="search-close-badge"
                @click="closeSearchModal"
                aria-label="Cerrar modal"
              >
                ESC
              </button>
            </div>

            <!-- Quick Category Tags / Filters -->
            <div class="search-tags-row">
              <button
                v-for="cat in categoryFilters"
                :key="cat.id"
                @click="selectedCategoryFilter = selectedCategoryFilter === cat.id ? 'all' : cat.id"
                :class="['search-tag-pill', selectedCategoryFilter === cat.id ? 'search-tag-pill--active' : '']"
              >
                <span>{{ cat.icon }}</span>
                <span>{{ cat.name }}</span>
              </button>
            </div>

            <!-- Search Results Body -->
            <div class="search-results-container" ref="resultsScrollRef">

              <!-- Empty / No Query state: Popular / Suggested -->
              <div v-if="!query.trim()" class="search-suggested-section">
                <div class="search-group-title">
                  <span>💡 Recomendados y Accesos Rápidos</span>
                </div>
                <div class="search-results-list">
                  <div
                    v-for="(item, idx) in suggestedItems"
                    :key="item.id"
                    :class="['search-result-item', selectedIndex === idx ? 'search-result-item--active' : '']"
                    @click="executeNavigation(item)"
                    @mouseenter="selectedIndex = idx"
                  >
                    <div class="result-icon-box">{{ item.icon }}</div>
                    <div class="result-info">
                      <div class="result-title-row">
                        <span class="result-title">{{ item.title }}</span>
                        <span class="result-category-badge">{{ item.categoryLabel }}</span>
                      </div>
                      <p class="result-description">{{ item.description }}</p>
                    </div>
                    <span class="result-arrow">→</span>
                  </div>
                </div>
              </div>

              <!-- Filtered Results State -->
              <template v-else-if="flattenedResults.length">
                <div
                  v-for="(group, gIdx) in groupedResults"
                  :key="gIdx"
                  class="search-result-group"
                >
                  <div class="search-group-title">
                    <span>{{ group.icon }} {{ group.label }}</span>
                    <span class="group-count">({{ group.items.length }})</span>
                  </div>

                  <div class="search-results-list">
                    <div
                      v-for="item in group.items"
                      :key="item.id"
                      :class="['search-result-item', getItemGlobalIndex(item) === selectedIndex ? 'search-result-item--active' : '']"
                      @click="executeNavigation(item)"
                      @mouseenter="selectedIndex = getItemGlobalIndex(item)"
                    >
                      <div class="result-icon-box">{{ item.icon }}</div>
                      <div class="result-info">
                        <div class="result-title-row">
                          <span class="result-title">{{ item.title }}</span>
                          <span class="result-category-badge">{{ item.categoryLabel }}</span>
                        </div>
                        <p class="result-description">{{ item.description }}</p>
                      </div>
                      <span class="result-arrow">→</span>
                    </div>
                  </div>
                </div>
              </template>

              <!-- No Results Found -->
              <div v-else class="search-empty-state">
                <div class="empty-icon">🔍</div>
                <h4 class="empty-title">Sin resultados para "{{ query }}"</h4>
                <p class="empty-desc">Probá buscando con otros términos como <em>"vacuna"</em>, <em>"gatos"</em>, <em>"Mateo"</em> o <em>"guardia"</em>.</p>
                <button type="button" @click="query = ''" class="btn-ghost btn-sm empty-reset-btn">Ver sugerencias generales</button>
              </div>

            </div>

            <!-- Modal Footer Controls -->
            <div class="search-modal-footer">
              <div class="footer-key-tips">
                <span class="key-tip"><kbd>↑</kbd> <kbd>↓</kbd> Navegar</span>
                <span class="key-tip"><kbd>↵</kbd> Seleccionar</span>
                <span class="key-tip"><kbd>ESC</kbd> Cerrar</span>
              </div>
              <span class="footer-brand font-mono-numbers">MedVet 2.0 Global Search</span>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const router = useRouter()

const isOpen = ref(false)
const query = ref('')
const selectedCategoryFilter = ref('all')
const selectedIndex = ref(0)
const searchInputRef = ref(null)
const resultsScrollRef = ref(null)
const isMac = ref(false)

// Category Filters
const categoryFilters = [
  { id: 'all', name: 'Todo', icon: '🌟' },
  { id: 'services', name: 'Servicios', icon: '🩺' },
  { id: 'vets', name: 'Médicos', icon: '👨‍⚕️' },
  { id: 'species', name: 'Especies', icon: '🐾' },
  { id: 'portal', name: 'Portal/Mascotas', icon: '📱' },
  { id: 'urgent', name: 'Urgencias', icon: '🚨' }
]

// Exhaustive Search Database
const searchDatabase = [
  // SERVICIOS
  {
    id: 's-consulta',
    category: 'services',
    categoryLabel: 'Servicio Clínico',
    icon: '🩺',
    title: 'Consulta Clínica General',
    description: 'Evaluación de salud integral, auscultación, dermatología y nutrición para todas las especies.',
    keywords: ['consulta', 'medico', 'diagnostico', 'revisio', 'veterinario', 'chequeo', 'salud'],
    route: '/book?service=consulta'
  },
  {
    id: 's-vacuna',
    category: 'services',
    categoryLabel: 'Vacunación & Prevención',
    icon: '💉',
    title: 'Vacunación & Desparasitación',
    description: 'Vacunas quíntuple, antirrábica, felina y desparasitación interna/externa.',
    keywords: ['vacuna', 'vacunacion', 'rabia', 'quintuple', 'desparasitacion', 'pipeta', 'refuerzo', 'carnet'],
    route: '/book?service=vacuna'
  },
  {
    id: 's-cirugia',
    category: 'services',
    categoryLabel: 'Quirófano Especializado',
    icon: '✂️',
    title: 'Cirugía & Castración',
    description: 'Procedimientos quirúrgicos generales, orquiectomía, ovariohisterectomía y anestesia inhalatoria.',
    keywords: ['cirugia', 'castracion', 'operacion', 'anestesia', 'esterilizacion', 'quirofano', 'sutura'],
    route: '/book?service=cirugia'
  },
  {
    id: 's-urgencia',
    category: 'urgent',
    categoryLabel: 'Urgencias 24/7',
    icon: '🚨',
    title: 'Guardia & Triage de Urgencia 24/7',
    description: 'Atención médica prioritaria e inmediata de emergencia los 365 días del año.',
    keywords: ['urgencia', 'guardia', 'emergencia', 'hospital', '24h', '24/7', 'accidente', 'intoxicacion', 'grave'],
    route: '/book?service=urgencia'
  },
  {
    id: 's-laboratorio',
    category: 'services',
    categoryLabel: 'Diagnóstico & Análisis',
    icon: '🔬',
    title: 'Laboratorio Clínico & Análisis de Sangre',
    description: 'Hemograma completo, perfil hepático, renal, urianálisis y pruebas infecciosas.',
    keywords: ['laboratorio', 'analisis', 'sangre', 'hemograma', 'examen', 'orina', 'muestra', 'perfil'],
    route: '/services'
  },
  {
    id: 's-ecografia',
    category: 'services',
    categoryLabel: 'Imagenología',
    icon: '🖥️',
    title: 'Ecografía & Radiología Digital',
    description: 'Estudios ecográficos abdominales, cardiológicos y radiografías de alta resolución.',
    keywords: ['ecografia', 'radiografia', 'rayos x', 'imagen', 'eco', 'ultrasonido', 'diagnostico'],
    route: '/services'
  },
  {
    id: 's-estetica',
    category: 'services',
    categoryLabel: 'Estética Sanitaria',
    icon: '✨',
    title: 'Baño Sanitario & Estética Médica',
    description: 'Higiene dermatológica, corte de uñas, drenaje de glándulas anales y limpieza de oídos.',
    keywords: ['baño', 'estetica', 'corte', 'uñas', 'grooming', 'pelo', 'higiene', 'orejas', 'oidos'],
    route: '/services'
  },

  // MEDICOS / VETERINARIOS
  {
    id: 'v-mateo',
    category: 'vets',
    categoryLabel: 'Especialista',
    icon: '👨‍⚕️',
    title: 'Dr. Mateo Silva',
    description: 'Especialista en Medicina Veterinaria Integral y Cardiología Canina.',
    keywords: ['mateo', 'silva', 'doctor', 'medico', 'cardiologia', 'perros', 'director'],
    route: '/services'
  },
  {
    id: 'v-valeria',
    category: 'vets',
    categoryLabel: 'Especialista Felina',
    icon: '👩‍⚕️',
    title: 'Dra. Valeria Gómez',
    description: 'Especialista acreditada en Medicina Felina Feline-Friendly (ISFM).',
    keywords: ['valeria', 'gomez', 'doctora', 'gatos', 'felino', 'isfm', 'especialista'],
    route: '/services'
  },
  {
    id: 'v-carlos',
    category: 'vets',
    categoryLabel: 'Especialista Exóticos',
    icon: '👨‍⚕️',
    title: 'Dr. Carlos Mendoza',
    description: 'Medicina y Cirugía de Aves, Reptiles y Fauna Exótica.',
    keywords: ['carlos', 'mendoza', 'exoticos', 'aves', 'loros', 'reptiles', 'fauna'],
    route: '/services'
  },
  {
    id: 'v-sofia',
    category: 'vets',
    categoryLabel: 'Cirujana Principal',
    icon: '👩‍⚕️',
    title: 'Dra. Sofía Rivas',
    description: 'Especialista en Cirugía General, Traumatología y Anestesiología.',
    keywords: ['sofia', 'rivas', 'cirujana', 'anestesia', 'traumatologia', 'operaciones'],
    route: '/services'
  },

  // ESPECIES Y CUIDADOS
  {
    id: 'e-perros',
    category: 'species',
    categoryLabel: 'Atención Canina',
    icon: '🐶',
    title: 'Cuidado & Consultas para Perros',
    description: 'Planes de salud, vacunación puppy/adulto y nutrición canina especializada.',
    keywords: ['perro', 'perros', 'canino', 'cachorro', 'puppy', 'raza', 'perruno'],
    route: '/book?species=dog'
  },
  {
    id: 'e-gatos',
    category: 'species',
    categoryLabel: 'Medicina Felina',
    icon: '🐱',
    title: 'Cuidado & Consultas para Gatos',
    description: 'Atención de bajo estrés (Cat-Friendly), vacunación felina e historial digital.',
    keywords: ['gato', 'gatos', 'felino', 'gatito', 'kitten', 'michi'],
    route: '/book?species=cat'
  },
  {
    id: 'e-exoticos',
    category: 'species',
    categoryLabel: 'Aves y Exóticos',
    icon: '🦜',
    title: 'Atención de Aves, Loros y Exóticos',
    description: 'Consultas especializadas, hábitat, nutrición y revisiones para fauna silvestre/exótica.',
    keywords: ['ave', 'aves', 'loro', 'exotico', 'exoticos', 'reptil', 'tortuga', 'iguana'],
    route: '/book?species=exotic'
  },
  {
    id: 'e-pequenos',
    category: 'species',
    categoryLabel: 'Pequeños Mamíferos',
    icon: '🐰',
    title: 'Cuidado de Conejos, Hámsters y Cobayas',
    description: 'Odontología de roedores, gastroenterología y revisión de pequeños mamíferos.',
    keywords: ['conejo', 'hamster', 'cobaya', 'cuy', 'roedor', 'pequeños mamiferos', 'huron'],
    route: '/book?species=small'
  },

  // PORTAL Y HERRAMIENTAS
  {
    id: 'p-mis-mascotas',
    category: 'portal',
    categoryLabel: 'Mi Panel',
    icon: '🐾',
    title: 'Mis Mascotas Registradas',
    description: 'Ver tus mascotas, agregar nuevos pacientes y consultar sus perfiles.',
    keywords: ['mis mascotas', 'perfil', 'registrar mascota', 'mis perros', 'mis gatos', 'panel'],
    route: '/pets'
  },
  {
    id: 'p-carnet',
    category: 'portal',
    categoryLabel: 'Carnet Digital',
    icon: '📄',
    title: 'Carnet Sanitario & Código QR',
    description: 'Descargar e imprimir el carnet médico y vacunas con verificación QR.',
    keywords: ['carnet', 'vacunas', 'qr', 'imprimir', 'certificado', 'historial', 'ficha'],
    route: '/pets'
  },
  {
    id: 'p-book',
    category: 'portal',
    categoryLabel: 'Agendamiento',
    icon: '📅',
    title: 'Agendar Nueva Cita Médica',
    description: 'Reserva digital instantánea eligiendo fecha, hora y veterinario.',
    keywords: ['reservar', 'agendar', 'cita', 'turno', 'nueva reserva', 'reserva online'],
    route: '/book'
  },

  // URGENCIAS Y TELEFONO
  {
    id: 'u-contacto-tel',
    category: 'urgent',
    categoryLabel: 'Contacto Directo',
    icon: '📞',
    title: 'Llamar a Urgencias de Guardia (+54 11 1234-5678)',
    description: 'Contacto telefónico directo con el equipo de emergencias 24/7.',
    keywords: ['telefono', 'llamar', 'contacto', 'guardia telefono', 'numero urgencias'],
    action: 'tel'
  }
]

// Suggested Default Items when input is empty
const suggestedItems = computed(() => searchDatabase.slice(0, 5))

// Filter logic
const filteredItems = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []

  // Normalization helper
  const normalize = (str) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

  const normalizedQuery = normalize(q)

  return searchDatabase.filter((item) => {
    // Filter by selected category tag
    if (selectedCategoryFilter.value !== 'all' && item.category !== selectedCategoryFilter.value) {
      return false
    }

    const titleMatch = normalize(item.title).includes(normalizedQuery)
    const descMatch = normalize(item.description).includes(normalizedQuery)
    const kwMatch = item.keywords.some((kw) => normalize(kw).includes(normalizedQuery))

    return titleMatch || descMatch || kwMatch
  })
})

// Group results by category
const groupedResults = computed(() => {
  const items = filteredItems.value
  if (!items.length) return []

  const groups = [
    { id: 'services', label: 'Servicios Clínicos & Diagnóstico', icon: '🩺', items: [] },
    { id: 'vets', label: 'Médicos & Especialistas', icon: '👨‍⚕️', items: [] },
    { id: 'species', label: 'Especies & Pacientes', icon: '🐾', items: [] },
    { id: 'portal', label: 'Portal & Historial Médico', icon: '📱', items: [] },
    { id: 'urgent', label: 'Urgencias & Guardia 24/7', icon: '🚨', items: [] }
  ]

  items.forEach((item) => {
    const group = groups.find((g) => g.id === item.category)
    if (group) group.items.push(item)
    else groups[0].items.push(item)
  })

  return groups.filter((g) => g.items.length > 0)
})

// Flattened results for keyboard navigation index calculation
const flattenedResults = computed(() => {
  if (!query.value.trim()) return suggestedItems.value
  return groupedResults.value.flatMap((g) => g.items)
})

const getItemGlobalIndex = (item) => {
  return flattenedResults.value.findIndex((i) => i.id === item.id)
}

// Navigation and Modal Handlers
const openSearchModal = () => {
  isOpen.value = true
  selectedIndex.value = 0
  nextTick(() => {
    if (searchInputRef.value) {
      searchInputRef.value.focus()
    }
  })
}

const closeSearchModal = () => {
  isOpen.value = false
  query.value = ''
}

const navigateResults = (direction) => {
  const total = flattenedResults.value.length
  if (!total) return
  selectedIndex.value = (selectedIndex.value + direction + total) % total
}

const selectActiveResult = () => {
  const activeItem = flattenedResults.value[selectedIndex.value]
  if (activeItem) {
    executeNavigation(activeItem)
  }
}

const executeNavigation = (item) => {
  closeSearchModal()
  if (item.action === 'tel') {
    window.location.href = 'tel:+541112345678'
  } else if (item.route) {
    router.push(item.route)
  }
}

// Keyboard Shortcut Listener (Ctrl+K or Cmd+K)
const handleGlobalKeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    if (isOpen.value) closeSearchModal()
    else openSearchModal()
  }
}

watch(query, () => {
  selectedIndex.value = 0
})

onMounted(() => {
  isMac.value = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style scoped>
/* ────────────────────────────────────────
   GLOBAL SEARCH TRIGGER BUTTONS
──────────────────────────────────────── */
.search-trigger-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 0.85rem;
  background: var(--color-cream-100);
  border: 1px solid var(--color-cream-300);
  border-radius: 10px;
  color: var(--color-ink-600);
  font-size: 0.8125rem;
  font-family: var(--font-body);
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-trigger-btn:hover {
  background: var(--color-cream-200);
  border-color: #00a86b;
  color: var(--color-ink-900);
}

.dark .search-trigger-btn {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(0, 245, 155, 0.18);
  color: #cbd5e1;
}

.dark .search-trigger-btn:hover {
  background: rgba(0, 245, 155, 0.1);
  border-color: #00f59b;
  color: #00f59b;
}

.search-icon {
  width: 1rem;
  height: 1rem;
  color: var(--color-ink-500);
  flex-shrink: 0;
}

.dark .search-icon {
  color: #00f59b;
}

.search-placeholder {
  font-weight: 500;
  margin-right: 0.5rem;
}

.search-kbd {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-ink-500);
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-300);
  border-radius: 5px;
  padding: 0.15rem 0.4rem;
}

.dark .search-kbd {
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.12);
}

.search-mobile-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--color-cream-100);
  border: 1px solid var(--color-cream-300);
  color: var(--color-ink-700);
  cursor: pointer;
}

@media (max-width: 768px) {
  .search-trigger-btn { display: none; }
  .search-mobile-btn { display: inline-flex; }
}

/* ────────────────────────────────────────
   SEARCH MODAL BACKDROP (COMMAND PALETTE)
──────────────────────────────────────── */
.search-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(4, 7, 6, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 4rem 1.5rem 2rem;
  overflow-y: auto;
}

@media (max-width: 640px) {
  .search-modal-backdrop {
    padding: 1rem;
  }
}

.search-modal-container {
  width: 100%;
  max-width: 680px;
  background: #ffffff;
  border: 1px solid var(--color-cream-300);
  border-radius: 20px;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: search-pop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dark .search-modal-container {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.25);
  box-shadow: 0 0 50px rgba(0, 245, 155, 0.15);
}

@keyframes search-pop {
  from { opacity: 0; transform: scale(0.96) translateY(-10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* Search Header */
.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-cream-200);
  background: #ffffff;
}

.dark .search-input-wrapper {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.15);
}

.search-modal-icon {
  width: 1.35rem;
  height: 1.35rem;
  color: #00a86b;
  flex-shrink: 0;
}

.dark .search-modal-icon {
  color: #00f59b;
}

.search-modal-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--color-ink-900);
}

.dark .search-modal-input {
  color: #f1faf5;
}

.search-modal-input::placeholder {
  color: var(--color-ink-400);
}

.dark .search-modal-input::placeholder {
  color: #64748b;
}

.search-clear-btn {
  background: transparent;
  border: none;
  color: var(--color-ink-400);
  cursor: pointer;
  padding: 0.2rem;
  display: flex;
}

.search-clear-btn svg { width: 1.2rem; height: 1.2rem; }

.search-close-badge {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-ink-500);
  background: var(--color-cream-100);
  border: 1px solid var(--color-cream-300);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
}

.dark .search-close-badge {
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}

/* Category Filter Tags */
.search-tags-row {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-cream-50);
  border-bottom: 1px solid var(--color-cream-200);
  overflow-x: auto;
  scrollbar-width: none;
}

.dark .search-tags-row {
  background: #060c0a;
  border-color: rgba(0, 245, 155, 0.12);
}

.search-tag-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid var(--color-cream-300);
  color: var(--color-ink-700);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.dark .search-tag-pill {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

.search-tag-pill--active {
  background: #00a86b;
  border-color: #00a86b;
  color: #ffffff;
}

.dark .search-tag-pill--active {
  background: #00f59b;
  border-color: #00f59b;
  color: #040706;
  font-weight: 700;
}

/* Results Container */
.search-results-container {
  max-height: 420px;
  overflow-y: auto;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.search-group-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-ink-500);
  margin-bottom: 0.6rem;
  padding: 0 0.5rem;
}

.dark .search-group-title {
  color: #94a3b8;
}

.group-count {
  font-weight: 500;
  opacity: 0.8;
}

.search-results-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.search-result-item--active {
  background: var(--color-cream-100);
  border-color: #00a86b;
}

.dark .search-result-item--active {
  background: rgba(0, 245, 155, 0.1);
  border-color: #00f59b;
}

.result-icon-box {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-title-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.2rem;
}

.result-title {
  font-weight: 700;
  font-size: 0.9375rem;
  color: var(--color-ink-900);
}

.dark .result-title { color: #f1faf5; }

.result-category-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #00a86b;
  background: rgba(0, 168, 107, 0.1);
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
}

.dark .result-category-badge {
  color: #00f59b;
  background: rgba(0, 245, 155, 0.15);
}

.result-description {
  font-size: 0.8125rem;
  color: var(--color-ink-600);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .result-description { color: #94a3b8; }

.result-arrow {
  color: var(--color-ink-400);
  font-size: 1.1rem;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.search-result-item--active .result-arrow {
  opacity: 1;
  color: #00a86b;
}

.dark .search-result-item--active .result-arrow {
  color: #00f59b;
}

/* Empty State */
.search-empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
}

.empty-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.empty-title { font-size: 1.1rem; font-weight: 700; color: var(--color-ink-900); margin: 0 0 0.5rem; }
.dark .empty-title { color: #f1faf5; }
.empty-desc { font-size: 0.875rem; color: var(--color-ink-600); margin: 0 0 1.25rem; }
.dark .empty-desc { color: #94a3b8; }

/* Modal Footer */
.search-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: var(--color-cream-50);
  border-top: 1px solid var(--color-cream-200);
  font-size: 0.75rem;
}

.dark .search-modal-footer {
  background: #060c0a;
  border-color: rgba(0, 245, 155, 0.12);
}

.footer-key-tips {
  display: flex;
  gap: 1rem;
  color: var(--color-ink-600);
}

.dark .footer-key-tips { color: #94a3b8; }

.key-tip { display: flex; align-items: center; gap: 0.3rem; }
.key-tip kbd {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  background: #ffffff;
  border: 1px solid var(--color-cream-300);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
}
.dark .key-tip kbd {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  color: #f1faf5;
}

.footer-brand {
  color: var(--color-ink-500);
  font-size: 0.7rem;
}
.dark .footer-brand { color: #64748b; }

/* Transitions */
.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.2s ease;
}
.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}
</style>
