<template>
  <div class="services-page">

    <!-- Page header -->
    <div class="services-hero">
      <div class="services-hero-inner">
        <span class="section-eyebrow">Catálogo Médico Integral</span>
        <h1 class="services-title">Servicios y Especialidades</h1>
        <p class="services-sub">
          Todas las especialidades médicas, cirugías, diagnósticos por imágenes y servicios
          de estética para el cuidado integral de tu mascota.
        </p>

        <!-- Category filter bar -->
        <div class="filter-bar">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="activeCategory = cat.id"
            :class="['filter-btn', activeCategory === cat.id ? 'filter-btn--active' : '']"
          >
            <span>{{ cat.icon }}</span>
            <span>{{ cat.name }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Services grid -->
    <div class="services-body">
      <div class="services-inner">
        <TransitionGroup name="svc" tag="div" class="svc-grid">
          <div
            v-for="service in filteredServices"
            :key="service.id"
            :id="service.anchorId"
            class="svc-card"
          >
            <div class="svc-top">
              <div class="svc-icon-wrap">{{ service.emoji }}</div>
              <span class="svc-duration font-mono-numbers">⏱ {{ service.duration }} min</span>
            </div>

            <h2 class="svc-title">{{ service.title }}</h2>
            <p class="svc-desc">{{ service.description }}</p>

            <ul class="svc-features">
              <li v-for="(feat, i) in service.features" :key="i">
                <svg class="feat-check" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                {{ feat }}
              </li>
            </ul>

            <div class="svc-footer">
              <div class="svc-price">
                <span class="svc-price-label">Arancel estimado</span>
                <span class="svc-price-value font-mono-numbers">${{ service.price.toLocaleString() }}</span>
              </div>
              <NuxtLink :to="`/book?service=${service.id}`" class="btn-amber svc-btn">
                Agendar Cita
              </NuxtLink>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>

  </div>
</template>

<script setup>
const activeCategory = ref('all')

const categories = [
  { id: 'all',       name: 'Todos',       icon: '🐾' },
  { id: 'consulta',  name: 'Consultas',   icon: '🩺' },
  { id: 'vacunacion',name: 'Vacunas',     icon: '🛡️' },
  { id: 'cirugia',   name: 'Cirugía',     icon: '✂️' },
  { id: 'estetica',  name: 'Estética',    icon: '✨' },
  { id: 'laboratorio',name: 'Laboratorio',icon: '🧪' }
]

const servicesList = [
  {
    id: 'consulta',
    anchorId: 'consulta',
    category: 'consulta',
    emoji: '🩺',
    title: 'Consulta Clínica General',
    duration: 30,
    price: 15000,
    description: 'Examen físico minucioso, auscultación cardíaca y pulmonar, revisión de mucosas, ojos, oídos y palpación abdominal.',
    features: [
      'Evaluación clínica integral',
      'Diagnóstico de patologías agudas y crónicas',
      'Prescripción de tratamiento médico'
    ]
  },
  {
    id: 'vacunacion',
    anchorId: 'vacunacion',
    category: 'vacunacion',
    emoji: '🛡️',
    title: 'Vacunación & Desparasitación',
    duration: 20,
    price: 18000,
    description: 'Inmunización contra enfermedades infecciosas principales (Quíntuple/Séxtuple canina, Triple felina, Antirrábica obligatoria).',
    features: [
      'Control de libreta sanitaria',
      'Desparasitación interna y externa',
      'Emisión de certificado oficial'
    ]
  },
  {
    id: 'cirugia',
    anchorId: 'cirugia',
    category: 'cirugia',
    emoji: '✂️',
    title: 'Cirugía & Castración',
    duration: 60,
    price: 45000,
    description: 'Intervenciones quirúrgicas programadas y de emergencia con monitoreo anestésico inhalatorio continuo y control del dolor.',
    features: [
      'Anestesia inhalatoria segura',
      'Monitoreo cardíaco y respiratorio',
      'Recuperación asistida en canil estéril'
    ]
  },
  {
    id: 'estetica',
    anchorId: 'estetica',
    category: 'estetica',
    emoji: '✨',
    title: 'Peluquería & Baño Sanitario',
    duration: 45,
    price: 14000,
    description: 'Higiene profunda dermatológica con champú neutro o medicado, corte de pelo higiénico, vaciado de glándulas y corte de uñas.',
    features: [
      'Baño con agua tibia acondicionada',
      'Limpieza y secado de oídos',
      'Desanudado y cepillado prolijo'
    ]
  },
  {
    id: 'laboratorio',
    anchorId: 'laboratorio',
    category: 'laboratorio',
    emoji: '🧪',
    title: 'Laboratorio Clínico & Ecografía',
    duration: 30,
    price: 22000,
    description: 'Análisis bioquímicos urgentes, hemogramas de alta precisión, ecografía abdominal y radiología digital.',
    features: [
      'Resultados en el día',
      'Ecografía doppler de alta resolución',
      'Perfil renal, hepático y glucemia'
    ]
  }
]

const filteredServices = computed(() => {
  if (activeCategory.value === 'all') return servicesList
  return servicesList.filter(s => s.category === activeCategory.value)
})

onMounted(() => {
  const route = useRoute()
  if (route.hash) {
    activeCategory.value = route.hash.replace('#', '')
  }
})
</script>

<style scoped>
.services-page {
  min-height: 80vh;
}

/* ── Hero ── */
.services-hero {
  background: var(--color-forest-900);
  padding: 5rem 1.5rem 3.5rem;
}

.services-hero-inner {
  max-width: 860px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-forest-400);
  margin-bottom: 0.65rem;
}

.services-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: #e8f5ec;
  margin: 0 0 0.875rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.services-sub {
  font-size: 1rem;
  color: rgba(200, 232, 200, 0.55);
  line-height: 1.65;
  max-width: 600px;
  margin: 0 0 2.25rem;
}

/* Filter bar */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid rgba(200, 232, 200, 0.18);
  background: transparent;
  color: rgba(200, 232, 200, 0.55);
  transition: all 0.18s ease;
}

.filter-btn:hover {
  border-color: rgba(200, 232, 200, 0.4);
  color: rgba(200, 232, 200, 0.85);
}

.filter-btn--active {
  background: var(--color-amber-600);
  border-color: var(--color-amber-600);
  color: #fff;
  box-shadow: 0 4px 12px -4px rgba(200, 134, 10, 0.45);
}

/* ── Services body ── */
.services-body {
  background: var(--color-cream-100);
  padding: 3.5rem 1.5rem 5rem;
}

.dark .services-body {
  background: var(--color-forest-950);
}

.services-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.svc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 1024px) { .svc-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px)  { .svc-grid { grid-template-columns: 1fr; } }

.svc-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 22px;
  padding: 1.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.svc-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 48px -12px rgba(26, 22, 14, 0.13);
  border-color: rgba(78, 154, 103, 0.35);
}

.dark .svc-card {
  background: #162210;
  border-color: rgba(61, 122, 82, 0.18);
}

.dark .svc-card:hover {
  border-color: rgba(78, 154, 103, 0.5);
}

.svc-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.svc-icon-wrap {
  width: 3rem;
  height: 3rem;
  border-radius: 14px;
  background: var(--color-forest-100);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}

.dark .svc-icon-wrap {
  background: rgba(45, 90, 61, 0.25);
}

.svc-duration {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: 8px;
  background: var(--color-cream-200);
  color: var(--color-ink-500);
}

.dark .svc-duration {
  background: rgba(27, 58, 42, 0.5);
  color: #6b8e6e;
}

.svc-title {
  font-family: var(--font-display);
  font-size: 1.1875rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
  line-height: 1.25;
}

.dark .svc-title { color: #c8deca; }

.svc-desc {
  font-size: 0.8125rem;
  color: var(--color-ink-500);
  line-height: 1.65;
  margin: 0;
}

.dark .svc-desc { color: #5a7e5e; }

.svc-features {
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding-top: 0.875rem;
  border-top: 1px solid var(--color-cream-200);
  flex-grow: 1;
}

.dark .svc-features {
  border-top-color: rgba(61, 122, 82, 0.15);
}

.svc-features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-ink-500);
}

.dark .svc-features li { color: #6b8e6e; }

.feat-check {
  width: 14px;
  height: 14px;
  color: var(--color-forest-600);
  flex-shrink: 0;
}

.svc-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 1rem;
  border-top: 1px solid var(--color-cream-200);
  margin-top: auto;
}

.dark .svc-footer {
  border-top-color: rgba(61, 122, 82, 0.15);
}

.svc-price-label {
  display: block;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-ink-300);
}

.svc-price-value {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-ink-900);
}

.dark .svc-price-value { color: #c8deca; }

.svc-btn {
  font-size: 0.8125rem;
  padding: 0.55rem 1.1rem;
}

/* TransitionGroup animations */
.svc-enter-active, .svc-leave-active {
  transition: all 0.28s ease;
}
.svc-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.svc-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
