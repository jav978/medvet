<template>
  <div class="services-page">
    <div class="services-glow-ambient"></div>

    <div class="services-inner">

      <!-- Header & Hero -->
      <div class="services-hero">
        <span class="eyebrow-pill">
          <span class="eyebrow-tag">ARANCELES CLÍNICOS</span>
          <span class="eyebrow-text">Transparencia & Tasa Oficial BCV</span>
        </span>
        <h1 class="services-title">
          Servicios Médicos & <span class="gradient-text-mint">Especialidades</span>
        </h1>
        <p class="services-subtitle">
          Consultas clínicas, cirugías de alta complejidad, diagnóstico por imágenes y estética veterinaria. Precios convertibles en tiempo real a Dólares y Bolívares.
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
            <div class="service-top-badges">
              <span class="service-duration font-mono-numbers">
                ⏱️ {{ service.duration }} min
              </span>
              <button
                type="button"
                class="card-curr-switch-chip"
                @click.stop="toggleCardCurrency(service.id)"
                :title="`Cambiar a ${getCardCurrency(service.id) === 'USD' ? 'Bolívares (VES)' : 'Dólares (USD)'}`"
              >
                ⇄ {{ getCardCurrency(service.id) }}
              </button>
            </div>
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
              <div class="price-header-row">
                <span class="price-lbl">Arancel sugerido</span>
              </div>
              <div class="price-val font-mono-numbers">
                {{ formatPrice(service.price, getCardCurrency(service.id)) }}
              </div>
              <div class="price-equiv font-mono-numbers">
                ≈ {{ formatPrice(service.price, getCardCurrency(service.id) === 'USD' ? 'VES' : 'USD') }} (BCV)
              </div>
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
            COTIZADOR MULTIMONEDA BCV
          </div>
          <h2 class="calc-title">Calculadora de Presupuesto Médico</h2>
          <p class="calc-sub">
            Seleccioná los estudios o consultas combinadas para calcular el arancel total estimado en Bolívares y Dólares con tasa oficial BCV.
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
              <div class="calc-item-pricing">
                <span class="calc-item-price font-mono-numbers">{{ formatPrice(item.price) }}</span>
                <span class="calc-item-sub font-mono-numbers">≈ {{ formatPrice(item.price, activeCurrency === 'USD' ? 'VES' : 'USD') }}</span>
              </div>
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
                <span class="font-mono-numbers">{{ formatPrice(si.price) }}</span>
              </div>
            </div>
            <div v-else class="summary-empty">
              Seleccioná uno o más servicios del listado para ver el desglose.
            </div>

            <div class="summary-total-box">
              <div>
                <span class="total-lbl">Total Estimado:</span>
                <span class="total-note">Tasa oficial BCV · Tarjetas, Pago Móvil o Divisas</span>
              </div>
              <div class="total-values-stack font-mono-numbers">
                <span class="total-amount">{{ formatPrice(calculatedTotal) }}</span>
                <span class="total-secondary">≈ {{ formatPrice(calculatedTotal, activeCurrency === 'USD' ? 'VES' : 'USD') }} (BCV)</span>
              </div>
            </div>

            <!-- Cashea BNPL Option -->
            <div class="cashea-callout-pill font-mono-numbers">
              <span class="cashea-badge-mini">💛 Cashea</span>
              <span>o pagá en 3 cuotas de <strong>{{ formatPrice((calculatedTotal * 0.6) / 3) }}</strong> (Inicial {{ formatPrice(calculatedTotal * 0.4) }})</span>
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
const { activeCurrency, bcvRate, formatPrice, toggleCurrency } = useCurrency()

const activeCategory = ref('all')
const selectedCalcIds = ref([1, 2])
const cardCurrencies = ref({})

const getCardCurrency = (id) => cardCurrencies.value[id] || activeCurrency.value

const toggleCardCurrency = (id) => {
  const current = getCardCurrency(id)
  cardCurrencies.value[id] = current === 'USD' ? 'VES' : 'USD'
}

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
    price: 15,
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
    price: 18,
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
    price: 17.5,
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
    price: 22,
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
    price: 28,
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
    price: 48,
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
    price: 16,
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

:global(.dark) .services-page {
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
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 2.5vw, 2.5rem);
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
  gap: 1rem;
}

.eyebrow-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem 0.25rem 0.35rem;
  border-radius: 999px;
  background: rgba(0, 168, 107, 0.1);
  border: 1px solid rgba(0, 168, 107, 0.25);
  font-size: 0.8125rem;
  color: var(--color-forest-700);
}

:global(.dark) .eyebrow-pill {
  background: rgba(0, 245, 155, 0.1);
  border-color: rgba(0, 245, 155, 0.28);
  color: #00f59b;
}

.eyebrow-tag {
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: rgba(0, 168, 107, 0.15);
  color: #007a4d;
}

:global(.dark) .eyebrow-tag {
  background: #00f59b;
  color: #040706;
}

.eyebrow-text { font-weight: 500; }

.services-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--color-ink-900);
  margin: 0;
  line-height: 1.15;
}

:global(.dark) .services-title { color: #f1faf5; }

.gradient-text-mint {
  background: linear-gradient(135deg, #00a86b 0%, #00c48c 50%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

:global(.dark) .gradient-text-mint {
  background: linear-gradient(180deg, #ffffff 0%, #d0ffed 40%, #00f59b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.services-subtitle {
  font-size: 1rem;
  color: var(--color-ink-500);
  line-height: 1.6;
  margin: 0;
}

:global(.dark) .services-subtitle { color: #cbd5e1; }

/* Category Pills */
.category-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 0.5rem;
}

.cat-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  background: var(--color-cream-200);
  border: 1px solid var(--color-cream-300);
  color: var(--color-ink-600);
  cursor: pointer;
  transition: all 0.2s ease;
}

.cat-pill:hover {
  background: var(--color-cream-300);
  color: var(--color-ink-900);
}

.cat-pill--active {
  background: #00a86b;
  border-color: #00a86b;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 168, 107, 0.3);
}

:global(.dark) .cat-pill {
  background: rgba(16, 28, 22, 0.6);
  border-color: rgba(0, 245, 155, 0.2);
  color: #cbd5e1;
}

:global(.dark) .cat-pill:hover {
  background: rgba(0, 245, 155, 0.12);
  color: #f1faf5;
}

:global(.dark) .cat-pill--active {
  background: #00f59b;
  border-color: #00f59b;
  color: #040706;
  box-shadow: 0 0 16px rgba(0, 245, 155, 0.35);
}

/* Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.service-card {
  background: var(--color-cream-50);
  border: 1.5px solid var(--color-cream-300);
  border-radius: 24px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.service-card:hover {
  transform: translateY(-4px);
  border-color: #00a86b;
  box-shadow: 0 16px 32px -8px rgba(0, 80, 50, 0.12);
}

:global(.dark) .service-card {
  background: #080f0c;
  border-color: rgba(0, 245, 155, 0.14);
}

:global(.dark) .service-card:hover {
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

:global(.dark) .service-icon-box {
  background: rgba(16, 28, 22, 0.9);
  border: 1px solid rgba(0, 245, 155, 0.2);
}

.service-top-badges {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.service-duration {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  background: var(--color-cream-200);
  color: var(--color-ink-500);
}

:global(.dark) .service-duration {
  background: rgba(16, 28, 22, 0.7);
  color: #cbd5e1;
}

.card-curr-switch-chip {
  padding: 0.22rem 0.5rem;
  font-size: 0.675rem;
  font-weight: 700;
  border-radius: 8px;
  background: rgba(0, 168, 107, 0.1);
  border: 1px solid rgba(0, 168, 107, 0.25);
  color: #059669;
  cursor: pointer;
  transition: all 0.15s ease;
}

.card-curr-switch-chip:hover {
  background: rgba(0, 168, 107, 0.2);
}

:global(.dark) .card-curr-switch-chip {
  background: rgba(0, 245, 155, 0.1);
  border-color: rgba(0, 245, 155, 0.3);
  color: #00f59b;
}

:global(.dark) .card-curr-switch-chip:hover {
  background: rgba(0, 245, 155, 0.22);
}

.service-card-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
  line-height: 1.25;
}

:global(.dark) .service-card-title { color: #f1faf5; }

.service-card-desc {
  font-size: 0.8125rem;
  color: var(--color-ink-500);
  line-height: 1.5;
  margin: 0;
}

:global(.dark) .service-card-desc { color: #cbd5e1; }

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

:global(.dark) .service-features-list li { color: #d6e8de; }

.feat-icon { width: 14px; height: 14px; color: #00a86b; flex-shrink: 0; }
:global(.dark) .feat-icon { color: #00f59b; }

.service-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--color-cream-200);
}

:global(.dark) .service-card-footer { border-top-color: rgba(0, 245, 155, 0.12); }

.service-price-block {
  display: flex;
  flex-direction: column;
}

.price-header-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.price-lbl { display: block; font-size: 0.65rem; text-transform: uppercase; color: var(--color-ink-400); font-weight: 600; }
.price-val { font-size: 1.25rem; font-weight: 800; color: #00a86b; line-height: 1.2; }
:global(.dark) .price-val { color: #00f59b; }

.price-equiv {
  font-size: 0.68rem;
  color: var(--color-ink-400);
  margin-top: 2px;
}
:global(.dark) .price-equiv { color: rgba(223, 240, 238, 0.55); }

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

:global(.dark) .budget-calculator-card {
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

:global(.dark) .calc-badge { color: #00f59b; }

.calc-dot { width: 6px; height: 6px; border-radius: 50%; background: #00f59b; }

.calc-title {
  font-family: var(--font-display);
  font-size: 1.65rem;
  font-weight: 800;
  color: var(--color-ink-900);
  margin: 0 0 0.35rem;
}

:global(.dark) .calc-title { color: #f1faf5; }

.calc-sub { font-size: 0.875rem; color: var(--color-ink-500); margin: 0; }
:global(.dark) .calc-sub { color: #cbd5e1; }

.calc-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
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

:global(.dark) .calc-check-item {
  background: rgba(16, 28, 22, 0.6);
  border-color: rgba(0, 245, 155, 0.15);
}

:global(.dark) .calc-check-item--active {
  border-color: #00f59b;
  background: rgba(0, 245, 155, 0.12);
}

.calc-checkbox { width: 1.15rem; height: 1.15rem; accent-color: #00f59b; cursor: pointer; }
.calc-item-emoji { font-size: 1.35rem; }
.calc-item-info { flex: 1; display: flex; flex-direction: column; }
.calc-item-name { font-size: 0.875rem; color: var(--color-ink-900); }
:global(.dark) .calc-item-name { color: #f1faf5; }
.calc-item-dur { font-size: 0.72rem; color: var(--color-ink-400); }

.calc-item-pricing {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.calc-item-price { font-weight: 700; font-size: 0.9375rem; color: #00a86b; }
:global(.dark) .calc-item-price { color: #00f59b; }
.calc-item-sub { font-size: 0.68rem; color: var(--color-ink-400); }
:global(.dark) .calc-item-sub { color: rgba(223, 240, 238, 0.5); }

.calc-summary-panel {
  background: var(--color-cream-100);
  border: 1px solid var(--color-cream-300);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

:global(.dark) .calc-summary-panel {
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

:global(.dark) .summary-top { border-bottom-color: rgba(0, 245, 155, 0.15); }
.summary-title { font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: var(--color-ink-900); margin: 0; }
:global(.dark) .summary-title { color: #f1faf5; }
.summary-count { font-size: 0.72rem; color: var(--color-ink-400); }

.summary-items-list { display: flex; flex-direction: column; gap: 0.45rem; font-size: 0.8125rem; }
.summary-row { display: flex; justify-content: space-between; color: var(--color-ink-700); }
:global(.dark) .summary-row { color: #d6e8de; }

.summary-empty { font-size: 0.78rem; color: var(--color-ink-400); font-style: italic; }

.summary-total-box {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 0.85rem;
  border-top: 1px dashed var(--color-cream-300);
}

:global(.dark) .summary-total-box { border-top-color: rgba(0, 245, 155, 0.2); }
.total-lbl { display: block; font-family: var(--font-display); font-size: 0.9375rem; font-weight: 700; color: var(--color-ink-900); }
:global(.dark) .total-lbl { color: #f1faf5; }
.total-note { display: block; font-size: 0.65rem; color: var(--color-ink-400); font-family: var(--font-body); }

.total-values-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.total-amount { font-size: 1.5rem; font-weight: 800; color: #00a86b; }
:global(.dark) .total-amount { color: #00f59b; }
.total-secondary { font-size: 0.75rem; color: var(--color-ink-400); }
:global(.dark) .total-secondary { color: rgba(223, 240, 238, 0.6); }

.cashea-callout-pill {
  background: #fffbeb;
  border: 1px dashed #f59e0b;
  border-radius: 10px;
  padding: 0.55rem 0.75rem;
  font-size: 0.75rem;
  color: #92400e;
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

:global(.dark) .cashea-callout-pill {
  background: #191407;
  border-color: rgba(245, 158, 11, 0.4);
  color: #fcd34d;
}

.cashea-badge-mini {
  background: #f59e0b;
  color: #ffffff;
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 800;
  white-space: nowrap;
}

.summary-book-btn { justify-content: center; width: 100%; text-decoration: none; }
</style>
