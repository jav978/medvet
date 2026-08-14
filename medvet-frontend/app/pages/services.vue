<template>
  <div class="services-page">
    <div class="services-glow-ambient"></div>

    <div class="services-inner">

      <!-- Header & Hero -->
      <div class="services-hero">
        <span class="eyebrow-pill">
          <span class="eyebrow-tag">ARANCELES CLÍNICOS</span>
          <span class="eyebrow-text">Transparencia & Cobertura Integral</span>
        </span>
        <h1 class="services-title">
          Servicios Médicos & <span class="gradient-text-mint">Especialidades</span>
        </h1>
        <p class="services-subtitle">
          Consultas clínicas, cirugías de alta complejidad, diagnóstico por imágenes y estética veterinaria con tecnología de vanguardia.
        </p>

        <!-- Category Filter Pills -->
        <div class="category-pills">
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            @click="activeCategory = cat.id"
            :class="['cat-pill', activeCategory === cat.id ? 'cat-pill--active' : '']"
          >
            <span>{{ cat.icon }}</span>
            <span>{{ cat.name }}</span>
          </button>
        </div>
      </div>

      <!-- Services Grid -->
      <div class="services-grid">
        <div
          v-for="service in filteredServices"
          :key="service.id"
          class="service-card"
        >
          <div class="service-card-top">
            <div class="service-icon-box">{{ service.emoji }}</div>
            <span class="service-duration font-mono-numbers">
              ⏱️ {{ service.duration }} min
            </span>
          </div>

          <h2 class="service-card-title">{{ service.title }}</h2>
          <p class="service-card-desc">{{ service.description }}</p>

          <ul class="service-features-list">
            <li v-for="(feat, i) in service.features" :key="i">
              <svg class="feat-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span>{{ feat }}</span>
            </li>
          </ul>

          <div class="service-card-footer">
            <div class="service-price-block">
              <span class="price-lbl">Arancel sugerido</span>
              <span class="price-val font-mono-numbers">${{ Number(service.price).toLocaleString() }}</span>
            </div>
            <NuxtLink :to="`/book?service=${service.id}`" class="btn-primary svc-cta-btn">
              Agendar Turno →
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Interactive Clinical Budget Calculator -->
      <div class="budget-calculator-card">
        <div class="calc-header">
          <div class="calc-badge">
            <span class="calc-dot"></span>
            COTIZADOR INTERACTIVO
          </div>
          <h2 class="calc-title">Calculadora de Presupuesto Médico</h2>
          <p class="calc-sub">
            Seleccioná los estudios o consultas combinadas para calcular el arancel total estimado para tu mascota.
          </p>
        </div>

        <div class="calc-grid">
          <div class="calc-services-checklist">
            <label
              v-for="item in calculableServices"
              :key="item.id"
              :class="['calc-check-item', isSelected(item.id) ? 'calc-check-item--active' : '']"
            >
              <input
                type="checkbox"
                :value="item.id"
                v-model="selectedCalcIds"
                class="calc-checkbox"
              />
              <span class="calc-item-emoji">{{ item.emoji }}</span>
              <div class="calc-item-info">
                <strong class="calc-item-name">{{ item.title }}</strong>
                <span class="calc-item-dur">{{ item.duration }} min · {{ item.category }}</span>
              </div>
              <span class="calc-item-price font-mono-numbers">${{ item.price.toLocaleString() }}</span>
            </label>
          </div>

          <div class="calc-summary-panel">
            <div class="summary-top">
              <h3 class="summary-title">Resumen de Atención</h3>
              <span class="summary-count font-mono-numbers">{{ selectedCalcIds.length }} prestaciones</span>
            </div>

            <div class="summary-items-list" v-if="selectedItems.length">
              <div v-for="si in selectedItems" :key="si.id" class="summary-row">
                <span>{{ si.emoji }} {{ si.title }}</span>
                <span class="font-mono-numbers">${{ si.price.toLocaleString() }}</span>
              </div>
            </div>
            <div v-else class="summary-empty">
              Seleccioná uno o más servicios del listado para ver el desglose.
            </div>

            <div class="summary-total-box font-mono-numbers">
              <div>
                <span class="total-lbl">Total Estimado:</span>
                <span class="total-note">Aboná en clínica con tarjetas o MercadoPago</span>
              </div>
              <span class="total-amount">${{ calculatedTotal.toLocaleString() }}</span>
            </div>

            <NuxtLink to="/book" class="btn-amber summary-book-btn">
              ✓ Agendar con este Presupuesto
            </NuxtLink>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const activeCategory = ref('all')
const selectedCalcIds = ref([1, 2])

const categories = [
  { id: 'all',         name: 'Todos',        icon: '🐾' },
  { id: 'consulta',    name: 'Consultas',    icon: '🩺' },
  { id: 'vacunacion',  name: 'Vacunación',   icon: '💉' },
  { id: 'diagnostico', name: 'Diagnóstico',  icon: '🔬' },
  { id: 'cirugia',     name: 'Cirugías',     icon: '🏥' },
  { id: 'estetica',    name: 'Estética',     icon: '✂️' }
]

const servicesList = [
  {
    id: 1,
    category: 'consulta',
    emoji: '🩺',
    title: 'Consulta Clínica General',
    duration: 30,
    price: 15000,
    description: 'Examen físico minucioso, auscultación cardiopulmonar, revisión de mucosas, ojos, oídos y palpación abdominal.',
    features: [
      'Evaluación clínica integral',
      'Diagnóstico de patologías agudas y crónicas',
      'Prescripción y receta digital oficial'
    ]
  },
  {
    id: 2,
    category: 'vacunacion',
    emoji: '💉',
    title: 'Vacunación Séxtuple Canina',
    duration: 20,
    price: 18000,
    description: 'Inmunización completa con certificado oficial y sello profesional contra Parvovirus, Moquillo y Leptospira.',
    features: [
      'Examen clínico pre-vacunal',
      'Certificado sanitario firmado',
      'Actualización en carnet digital'
    ]
  },
  {
    id: 3,
    category: 'vacunacion',
    emoji: '💉',
    title: 'Vacunación Triple Felina',
    duration: 20,
    price: 17500,
    description: 'Inmunización contra Rinotraqueítis, Calicivirus y Panleucopenia felina para gatos de todas las edades.',
    features: [
      'Revisión clínica preventiva',
      'Dosis de alta pureza antigénica',
      'Monitoreo post-aplicación'
    ]
  },
  {
    id: 4,
    category: 'diagnostico',
    emoji: '🔬',
    title: 'Perfil Bioquímico & Sangre',
    duration: 25,
    price: 22000,
    description: 'Laboratorio de alta precisión con resultados en 24hs. Evalúa función hepática, renal y hemograma.',
    features: [
      'Hemograma completo',
      'Urea, creatinina y transaminasas',
      'Informe digital descargable en PDF'
    ]
  },
  {
    id: 5,
    category: 'diagnostico',
    emoji: '📸',
    title: 'Ecografía Abdominal Completa',
    duration: 35,
    price: 28000,
    description: 'Estudio de imágenes de alta resolución en tiempo real con informe descriptivo firmado por especialista.',
    features: [
      'Revisión de todos los órganos digestivos',
      'Captura de imágenes diagnósticas',
      'Entrega en el acto'
    ]
  },
  {
    id: 6,
    category: 'cirugia',
    emoji: '🏥',
    title: 'Castración / Esterilización',
    duration: 60,
    price: 48000,
    description: 'Cirugía ambulatoria de mínima invasión con monitoreo anestésico multiparamétrico y analgesia preventiva.',
    features: [
      'Quirófano estéril de alta tecnología',
      'Recuperación guiada en sala post-quirúrgica',
      'Control de sutura sin cargo'
    ]
  },
  {
    id: 7,
    category: 'estetica',
    emoji: '✂️',
    title: 'Baño Terapéutico & Deslanado',
    duration: 45,
    price: 16000,
    description: 'Cuidado dermatológico profesional con shampoo medicado y corte higiénico.',
    features: [
      'Corte de uñas y limpieza de oídos',
      'Secado a temperatura controlada',
      'Perfume hipoalergénico'
    ]
  }
]

const calculableServices = servicesList

const filteredServices = computed(() => {
  if (activeCategory.value === 'all') return servicesList
  return servicesList.filter(s => s.category === activeCategory.value)
})

const isSelected = (id) => selectedCalcIds.value.includes(id)

const selectedItems = computed(() => {
  return calculableServices.filter(s => selectedCalcIds.value.includes(s.id))
})

const calculatedTotal = computed(() => {
  return selectedItems.value.reduce((acc, curr) => acc + curr.price, 0)
})
</script>

<style scoped>
.services-page {
  position: relative;
  min-height: 85vh;
  padding: 3.5rem 1.5rem 6rem;
  background-color: var(--color-cream-100);
  overflow: hidden;
}

.dark .services-page {
  background-color: #040706;
}

.services-glow-ambient {
  position: absolute;
  top: -140px;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 420px;
  background: radial-gradient(ellipse 800px 350px at 50% 0%, rgba(0, 245, 155, 0.18) 0%, rgba(0, 168, 107, 0.04) 50%, transparent 80%);
  filter: blur(40px);
  pointer-events: none;
  z-index: 0;
}

.services-inner {
  position: relative;
  z-index: 1;
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* Hero */
.services-hero {
  text-align: center;
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.services-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--color-ink-900);
  margin: 0.85rem 0 0.5rem;
  line-height: 1.15;
}

.dark .services-title { color: #f1faf5; }

.services-subtitle {
  font-size: 0.9375rem;
  color: var(--color-ink-500);
  line-height: 1.6;
  margin: 0 0 1.75rem;
}

.dark .services-subtitle { color: #8ca395; }

/* Category Pills */
.category-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.cat-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-50);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-ink-700);
  cursor: pointer;
  transition: all 0.18s ease;
}

.cat-pill:hover { border-color: #00a86b; color: #007a4d; }

.cat-pill--active {
  background: #00a86b;
  border-color: #00a86b;
  color: #fff;
  font-weight: 700;
}

.dark .cat-pill {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.15);
  color: #d6e8de;
}

.dark .cat-pill:hover { border-color: #00f59b; color: #00f59b; }

.dark .cat-pill--active {
  background: #00f59b;
  border-color: #00f59b;
  color: #040706;
  box-shadow: 0 0 16px rgba(0, 245, 155, 0.4);
}

/* Services Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 960px) { .services-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .services-grid { grid-template-columns: 1fr; } }

.service-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 24px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 10px 30px -8px rgba(0, 80, 50, 0.06);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.service-card:hover {
  transform: translateY(-3px);
  border-color: #00a86b;
}

.dark .service-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.16);
  box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.7);
}

.dark .service-card:hover {
  border-color: #00f59b;
  box-shadow: 0 12px 36px -8px rgba(0, 245, 155, 0.25);
}

.service-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-icon-box {
  width: 3rem;
  height: 3rem;
  border-radius: 14px;
  background: var(--color-cream-200);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
}

.dark .service-icon-box {
  background: rgba(16, 28, 22, 0.9);
  border: 1px solid rgba(0, 245, 155, 0.2);
}

.service-duration {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  background: var(--color-cream-200);
  color: var(--color-ink-500);
}

.dark .service-duration {
  background: rgba(16, 28, 22, 0.8);
  color: #8ca395;
}

.service-card-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
  line-height: 1.25;
}

.dark .service-card-title { color: #f1faf5; }

.service-card-desc {
  font-size: 0.8125rem;
  color: var(--color-ink-500);
  line-height: 1.5;
  margin: 0;
}

.dark .service-card-desc { color: #8ca395; }

.service-features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex-grow: 1;
}

.service-features-list li {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.75rem;
  color: var(--color-ink-600);
}

.dark .service-features-list li { color: #d6e8de; }

.feat-icon { width: 14px; height: 14px; color: #00a86b; flex-shrink: 0; }
.dark .feat-icon { color: #00f59b; }

.service-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--color-cream-200);
}

.dark .service-card-footer { border-top-color: rgba(0, 245, 155, 0.12); }

.price-lbl { display: block; font-size: 0.65rem; text-transform: uppercase; color: var(--color-ink-400); }
.price-val { font-size: 1.25rem; font-weight: 800; color: #00a86b; }
.dark .price-val { color: #00f59b; }

.svc-cta-btn {
  font-size: 0.78rem;
  padding: 0.55rem 1rem;
  text-decoration: none;
}

/* Budget Calculator Card */
.budget-calculator-card {
  background: var(--color-cream-50);
  border: 1.5px solid var(--color-cream-300);
  border-radius: 28px;
  padding: 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  box-shadow: 0 16px 40px -12px rgba(0, 80, 50, 0.1);
}

.dark .budget-calculator-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.22);
  box-shadow: 0 20px 50px -16px rgba(0, 0, 0, 0.85);
}

.calc-header { text-align: left; }

.calc-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #00a86b;
  margin-bottom: 0.4rem;
}

.dark .calc-badge { color: #00f59b; }

.calc-dot { width: 6px; height: 6px; border-radius: 50%; background: #00f59b; }

.calc-title {
  font-family: var(--font-display);
  font-size: 1.65rem;
  font-weight: 800;
  color: var(--color-ink-900);
  margin: 0 0 0.35rem;
}

.dark .calc-title { color: #f1faf5; }

.calc-sub { font-size: 0.875rem; color: var(--color-ink-500); margin: 0; }
.dark .calc-sub { color: #8ca395; }

.calc-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.75rem;
  align-items: start;
}

@media (max-width: 860px) { .calc-grid { grid-template-columns: 1fr; } }

.calc-services-checklist {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.calc-check-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1.15rem;
  border-radius: 14px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-100);
  cursor: pointer;
  transition: all 0.15s ease;
}

.calc-check-item:hover { border-color: #00a86b; }

.calc-check-item--active {
  border-color: #00a86b;
  background: rgba(0, 168, 107, 0.08);
}

.dark .calc-check-item {
  background: rgba(16, 28, 22, 0.6);
  border-color: rgba(0, 245, 155, 0.15);
}

.dark .calc-check-item--active {
  border-color: #00f59b;
  background: rgba(0, 245, 155, 0.12);
}

.calc-checkbox { width: 1.15rem; height: 1.15rem; accent-color: #00f59b; cursor: pointer; }
.calc-item-emoji { font-size: 1.35rem; }
.calc-item-info { flex: 1; display: flex; flex-direction: column; }
.calc-item-name { font-size: 0.875rem; color: var(--color-ink-900); }
.dark .calc-item-name { color: #f1faf5; }
.calc-item-dur { font-size: 0.72rem; color: var(--color-ink-400); }
.calc-item-price { font-weight: 700; font-size: 0.9375rem; color: #00a86b; }
.dark .calc-item-price { color: #00f59b; }

.calc-summary-panel {
  background: var(--color-cream-100);
  border: 1px solid var(--color-cream-300);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.dark .calc-summary-panel {
  background: #060c09;
  border-color: rgba(0, 245, 155, 0.2);
}

.summary-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.65rem;
  border-bottom: 1px solid var(--color-cream-300);
}

.dark .summary-top { border-bottom-color: rgba(0, 245, 155, 0.15); }
.summary-title { font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: var(--color-ink-900); margin: 0; }
.dark .summary-title { color: #f1faf5; }
.summary-count { font-size: 0.72rem; color: var(--color-ink-400); }

.summary-items-list { display: flex; flex-direction: column; gap: 0.45rem; font-size: 0.8125rem; }
.summary-row { display: flex; justify-content: space-between; color: var(--color-ink-700); }
.dark .summary-row { color: #d6e8de; }

.summary-empty { font-size: 0.78rem; color: var(--color-ink-400); font-style: italic; }

.summary-total-box {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 0.85rem;
  border-top: 1px dashed var(--color-cream-300);
}

.dark .summary-total-box { border-top-color: rgba(0, 245, 155, 0.2); }
.total-lbl { display: block; font-family: var(--font-display); font-size: 0.9375rem; font-weight: 700; color: var(--color-ink-900); }
.dark .total-lbl { color: #f1faf5; }
.total-note { display: block; font-size: 0.65rem; color: var(--color-ink-400); font-family: var(--font-body); }
.total-amount { font-size: 1.65rem; font-weight: 800; color: #00a86b; }
.dark .total-amount { color: #00f59b; }

.summary-book-btn { justify-content: center; width: 100%; text-decoration: none; }
</style>
