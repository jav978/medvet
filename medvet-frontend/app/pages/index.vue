<template>
  <div class="page-root">

    <!-- ══════════════════════════════════════
         HERO (Inspired by Nuxt.com)
    ══════════════════════════════════════ -->
    <section class="hero-section">

      <!-- Nuxt mesh glow background -->
      <div class="hero-glow-mesh" aria-hidden="true"></div>

      <!-- Rotating paw watermark -->
      <div class="paw-watermark animate-rotate-slow" aria-hidden="true">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="128" rx="38" ry="32" fill="currentColor"/>
          <ellipse cx="58"  cy="90"  rx="18" ry="22" fill="currentColor"/>
          <ellipse cx="88"  cy="72"  rx="17" ry="21" fill="currentColor"/>
          <ellipse cx="118" cy="72"  rx="17" ry="21" fill="currentColor"/>
          <ellipse cx="146" cy="90"  rx="18" ry="22" fill="currentColor"/>
        </svg>
      </div>

      <div class="hero-inner">
        <!-- Left column: text & CTAs -->
        <div class="hero-text animate-fade-up">

          <!-- Announcement pill (Nuxt badge) -->
          <NuxtLink to="/book" class="eyebrow-pill">
            <span class="eyebrow-tag">MedVet 2.0</span>
            <span class="eyebrow-text">Plataforma Veterinaria de Cuidado Integral</span>
            <span class="eyebrow-arrow">→</span>
          </NuxtLink>

          <!-- Main 2-line Nuxt H1 -->
          <h1 class="hero-headline">
            <span class="hero-headline-green">La plataforma médica</span>
            <span class="hero-headline-sub">de cuidado veterinario</span>
          </h1>

          <p class="hero-sub">
            Atención clínica especializada, agendas inteligentes e historial médico digital en tiempo real para perros, gatos, aves y animales exóticos.
          </p>

          <!-- CTAs -->
          <div class="hero-ctas">
            <NuxtLink to="/book" class="btn-nuxt-primary">
              Comenzar Turno
            </NuxtLink>
            <a href="#services" class="btn-nuxt-secondary">
              <span>MedVet en 60 seg</span>
              <svg class="btn-play-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg>
            </a>
          </div>

          <!-- CLI Quick Command (Nuxt.com quick copy bar) -->
          <div class="hero-cli-bar">
            <div class="cli-left">
              <span class="cli-prompt">&gt;_</span>
              <span class="cli-code font-mono-numbers">medvet agendar --especie {{ selectedSpecies }} --urgencia auto</span>
            </div>
            <NuxtLink to="/book" class="cli-copy-btn" title="Cita Inmediata">
              <svg viewBox="0 0 20 20" fill="currentColor" class="cli-icon"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 2H9a3 3 0 01-3-2z"/></svg>
            </NuxtLink>
          </div>

          <!-- Trust stats -->
          <div class="trust-strip">
            <div class="trust-stat">
              <span class="trust-num">+12.5k</span>
              <span class="trust-lbl">Mascotas atendidas</span>
            </div>
            <div class="trust-divider"></div>
            <div class="trust-stat">
              <span class="trust-num trust-num--amber">4.9 ★</span>
              <span class="trust-lbl">Valoración clientes</span>
            </div>
            <div class="trust-divider"></div>
            <div class="trust-stat">
              <span class="trust-num">100%</span>
              <span class="trust-lbl">Especialistas certificados</span>
            </div>
          </div>
        </div>

        <!-- Right column: Nuxt Studio / Live Booking Card -->
        <div class="hero-card-col animate-fade-up" style="animation-delay:0.15s">
          <div class="nuxt-studio-card animate-float">

            <!-- Studio Tabs (Nuxt code editor top tabs) -->
            <div class="studio-tab-bar">
              <button
                v-for="cat in serviceCategories"
                :key="cat.id"
                @click="selectedCategory = cat.id"
                :class="['studio-tab', selectedCategory === cat.id ? 'studio-tab--active' : '']"
              >
                <span class="studio-tab-icon">{{ cat.icon }}</span>
                <span>{{ cat.name }}</span>
              </button>
            </div>

            <!-- Path Bar -->
            <div class="studio-path-bar">
              <div class="studio-file">
                <span class="studio-file-icon">📁</span>
                <span class="studio-file-name font-mono-numbers">clinica/{{ selectedSpecies }}_{{ selectedCategory }}.vue</span>
              </div>
              <span class="studio-live-pill">
                <span class="live-dot"></span>
                Agenda en vivo
              </span>
            </div>

            <!-- Card Body / Interactive Preview -->
            <div class="studio-body">
              <div class="bc-header">
                <div class="bc-species-icon">{{ getSpeciesEmoji(selectedSpecies) }}</div>
                <div>
                  <div class="bc-eyebrow">{{ getCategoryLabel(selectedCategory) }}</div>
                  <div class="bc-title">{{ getSpeciesTitle(selectedSpecies) }}</div>
                </div>
                <span class="bc-badge">
                  <span class="bc-badge-dot"></span>
                  Cupos disponibles
                </span>
              </div>

              <!-- Interactive Species Pills -->
              <div class="species-group-compact">
                <span class="species-label-compact">Seleccionar paciente:</span>
                <div class="species-pills-compact">
                  <button
                    v-for="sp in speciesOptions"
                    :key="sp.id"
                    @click="selectedSpecies = sp.id"
                    :class="['species-pill-compact', selectedSpecies === sp.id ? 'species-pill-compact--active' : '']"
                  >
                    <span>{{ sp.emoji }}</span>
                    <span>{{ sp.label }}</span>
                  </button>
                </div>
              </div>

              <div class="bc-slot">
                <div class="bc-slot-label">
                  <svg class="slot-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
                  Próximo turno disponible
                </div>
                <span class="bc-slot-time font-mono-numbers">Hoy · 16:30 hs</span>
              </div>

              <div class="bc-vet">
                <div class="bc-vet-avatar">MS</div>
                <div>
                  <div class="bc-vet-name">Dr. Mateo Silva</div>
                  <div class="bc-vet-role">Especialista en Medicina Veterinaria Integral</div>
                </div>
              </div>

              <ul class="bc-perks">
                <li>
                  <svg class="perk-check" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  Historia clínica digital sincronizada
                </li>
                <li>
                  <svg class="perk-check" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  Recordatorio automático SMS & WhatsApp
                </li>
              </ul>

              <NuxtLink :to="`/book?species=${selectedSpecies}&service=${selectedCategory}`" class="btn-primary bc-cta">
                Confirmar Reserva Inmediata →
              </NuxtLink>
            </div>

          </div>
        </div>
      </div>

      <!-- Partner Logos Bar (Nuxt.com bottom trust logo row) -->
      <div class="hero-trust-bar">
        <p class="trust-bar-caption">Certificada por instituciones veterinarias y elegida por más de 12.500 familias</p>
        <div class="trust-logos-row">
          <div class="trust-logo-item">
            <span class="logo-dot"></span>
            <span class="logo-text">HOSPITAL VET CENTRAL</span>
          </div>
          <div class="trust-logo-item">
            <span class="logo-dot"></span>
            <span class="logo-text">SANIDAD ANIMAL 24H</span>
          </div>
          <div class="trust-logo-item">
            <span class="logo-dot"></span>
            <span class="logo-text">RED CANINA & FELINA</span>
          </div>
          <div class="trust-logo-item">
            <span class="logo-dot"></span>
            <span class="logo-text">CLÍNICA BIO-VET</span>
          </div>
          <div class="trust-logo-item">
            <span class="logo-dot"></span>
            <span class="logo-text">VETS ALLIANCE</span>
          </div>
        </div>
      </div>

    </section>

    <!-- ══════════════════════════════════════
         SERVICES
    ══════════════════════════════════════ -->
    <section id="services" class="services-section">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-eyebrow">Atención Médica Integral</span>
          <h2 class="section-title">Nuestros Servicios</h2>
          <p class="section-sub">Prevención, diagnóstico y tratamiento con el más alto estándar clínico para tu compañero.</p>
        </div>

        <div class="services-grid">
          <div
            v-for="service in displayedServices"
            :key="service.id"
            class="service-card"
          >
            <div class="sc-top">
              <div class="sc-icon-wrap">
                <component :is="'span'" class="sc-icon">{{ getServiceEmoji(service.category) }}</component>
              </div>
              <div class="sc-top-actions">
                <span class="sc-duration font-mono-numbers">{{ service.duration }} min</span>
                <button
                  type="button"
                  class="sc-curr-toggle"
                  @click.stop="toggleCardCurrency(service.id)"
                  :title="`Cambiar a ${getCardCurrency(service.id) === 'USD' ? 'Bolívares (VES)' : 'Dólares (USD)'}`"
                >
                  ⇄ {{ getCardCurrency(service.id) }}
                </button>
              </div>
            </div>
            <h3 class="sc-name">{{ service.name }}</h3>
            <p class="sc-desc">{{ service.description }}</p>
            <div class="sc-footer">
              <div class="sc-price">
                <span class="sc-price-label">Arancel estimado</span>
                <span class="sc-price-value font-mono-numbers">{{ formatPrice(service.price, getCardCurrency(service.id)) }}</span>
                <span class="sc-price-sub font-mono-numbers">≈ {{ formatPrice(service.price, getCardCurrency(service.id) === 'USD' ? 'VES' : 'USD') }}</span>
              </div>
              <NuxtLink :to="`/book?service=${service.id}`" class="btn-primary sc-btn">
                Agendar
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         WHY CHOOSE US
    ══════════════════════════════════════ -->
    <section class="why-section">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-eyebrow">Estándar de Excelencia</span>
          <h2 class="section-title">¿Por qué confiar en MedVet?</h2>
        </div>

        <div class="features-grid">
          <div
            v-for="f in features"
            :key="f.title"
            class="feature-card"
          >
            <div class="fc-icon">{{ f.emoji }}</div>
            <h3 class="fc-title">{{ f.title }}</h3>
            <p class="fc-desc">{{ f.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         URGENCIES BANNER
    ══════════════════════════════════════ -->
    <section class="urgent-section">
      <div class="section-inner">
        <div class="urgent-banner">
          <!-- Background paw -->
          <div class="urgent-bg-paw" aria-hidden="true">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="100" cy="128" rx="38" ry="32" fill="currentColor"/>
              <ellipse cx="58"  cy="90"  rx="18" ry="22" fill="currentColor"/>
              <ellipse cx="88"  cy="72"  rx="17" ry="21" fill="currentColor"/>
              <ellipse cx="118" cy="72"  rx="17" ry="21" fill="currentColor"/>
              <ellipse cx="146" cy="90"  rx="18" ry="22" fill="currentColor"/>
            </svg>
          </div>

          <div class="urgent-content">
            <div class="urgent-badge">
              <span class="urgent-dot"></span>
              Guardia Médica · 24/7
            </div>
            <h2 class="urgent-title">¿Tu mascota necesita atención inmediata?</h2>
            <p class="urgent-sub">Equipo médico de guardia y quirófano de urgencia disponibles ahora mismo.</p>
          </div>

          <div class="urgent-actions">
            <a href="tel:+541112345678" class="btn-amber">
              <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
              Llamar Guardia
            </a>
            <NuxtLink to="/book" class="btn-ghost urgent-ghost">
              Reservar turno regular
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
const { activeCurrency, formatPrice, toggleCurrency } = useCurrency()

const selectedSpecies = ref('dog')
const selectedCategory = ref('consulta')
const cardCurrencies = ref({})

const getCardCurrency = (id) => cardCurrencies.value[id] || activeCurrency.value

const toggleCardCurrency = (id) => {
  const current = getCardCurrency(id)
  cardCurrencies.value[id] = current === 'USD' ? 'VES' : 'USD'
}

const serviceCategories = [
  { id: 'consulta', name: 'Consulta', icon: '🩺' },
  { id: 'vacuna',   name: 'Vacunación', icon: '💉' },
  { id: 'cirugia',  name: 'Cirugía', icon: '✂️' },
  { id: 'urgencia', name: 'Guardia 24h', icon: '🚨' }
]

const speciesOptions = [
  { id: 'dog',    label: 'Perros',            emoji: '🐶' },
  { id: 'cat',    label: 'Gatos',             emoji: '🐱' },
  { id: 'exotic', label: 'Exóticos',          emoji: '🦜' },
  { id: 'small',  label: 'Pequeños Mamíferos', emoji: '🐰' }
]

const getCategoryLabel = (id) => {
  const map = {
    consulta: 'Consulta Clínica General',
    vacuna: 'Plan de Vacunación & Prevención',
    cirugia: 'Cirugía & Quirófano Especializado',
    urgencia: 'Guardia & Urgencias 24/7'
  }
  return map[id] || 'Atención Médica'
}

const services = ref([])

const fallbackServices = [
  {
    id: 1,
    name: 'Consulta Clínica General',
    category: 'consulta',
    description: 'Evaluación integral del estado de salud, auscultación, revisión dermatológica y nutricional.',
    duration: 30,
    price: 15
  },
  {
    id: 2,
    name: 'Vacunación & Desparasitación',
    category: 'vacuna',
    description: 'Aplicación de vacunas quíntuple/séxtuple, antirrábica y desparasitación interna/externa.',
    duration: 20,
    price: 18
  },
  {
    id: 3,
    name: 'Laboratorio & Análisis de Sangre',
    category: 'laboratorio',
    description: 'Hemograma completo, perfil renal, hepático y análisis bioquímico de control.',
    duration: 25,
    price: 22
  },
  {
    id: 4,
    name: 'Cirugía & Castración',
    category: 'cirugia',
    description: 'Procedimiento quirúrgico con monitoreo anestésico inhalatorio y postoperatorio.',
    duration: 60,
    price: 45
  },
  {
    id: 5,
    name: 'Higienización & Baño Sanitario',
    category: 'estetica',
    description: 'Baño medicado dermatológico, corte de uñas, limpieza de oídos y drenaje anal.',
    duration: 45,
    price: 14
  },
  {
    id: 6,
    name: 'Urgencia & Ecografía',
    category: 'emergencia',
    description: 'Diagnóstico ecográfico de alta resolución y estabilización de emergencia.',
    duration: 45,
    price: 30
  }
]

const displayedServices = computed(() =>
  services.value.length ? services.value : fallbackServices
)

const getSpeciesEmoji = (id) => {
  const map = { dog: '🐶', cat: '🐱', exotic: '🦜', small: '🐰' }
  return map[id] || '🐾'
}

const getSpeciesTitle = (id) => {
  const map = {
    dog:    'Atención Canina Especializada',
    cat:    'Medicina Felina Feline-Friendly',
    exotic: 'Atención Aves y Exóticos',
    small:  'Cuidado de Pequeños Mamíferos'
  }
  return map[id] || 'Atención Veterinaria'
}

const getServiceEmoji = (cat) => {
  const map = {
    consulta: '🩺', vacuna: '💉', cirugia: '✂️',
    emergencia: '🚨', estetica: '✨', laboratorio: '🔬'
  }
  return map[cat] || '🐾'
}

const features = [
  {
    emoji: '⚡',
    title: 'Reserva Online Instantánea',
    description: 'Elegí fecha, hora y especialista en menos de 2 minutos, sin esperas telefónicas.'
  },
  {
    emoji: '🎓',
    title: 'Cuerpo Médico Calificado',
    description: 'Veterinarios especialistas con formación continua y dedicación empática hacia cada paciente.'
  },
  {
    emoji: '🔔',
    title: 'Recordatorios Inteligentes',
    description: 'Notificaciones automáticas antes de cada cita y alertas de refuerzo de vacunas.'
  }
]

onMounted(async () => {
  try {
    const { $feathers } = useNuxtApp()
    if ($feathers) {
      const result = await $feathers.service('services').find({
        query: { active: true, $limit: 6 }
      })
      if (result && (result.data?.length || result.length)) {
        services.value = result.data || result
      }
    }
  } catch {
    // using fallback services
  }
})
</script>

<style scoped>
/* ────────────────────────────────────────
   PAGE ROOT
──────────────────────────────────────── */
.page-root {
  background-color: var(--color-cream-100);
  width: 100%;
  max-width: 100%;
}

:global(.dark) .page-root {
  background-color: #040706;
}

/* ────────────────────────────────────────
   HERO (Cyber Mint & Obsidian Glow Spotlight)
──────────────────────────────────────── */
.hero-section {
  position: relative;
  overflow: hidden;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 5rem 0 3.5rem;
}

/* Ambient Radial & Vertical Spotlight Dome behind hero */
.hero-glow-mesh {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 1000px;
  max-width: 100%;
  height: 520px;
  background: radial-gradient(ellipse 900px 480px at 50% 0%, rgba(0, 168, 107, 0.16) 0%, rgba(0, 196, 140, 0.06) 50%, transparent 80%);
  filter: blur(40px);
  pointer-events: none;
  z-index: 0;
}

:global(.dark) .hero-glow-mesh {
  background: radial-gradient(ellipse 950px 520px at 50% 0%, rgba(0, 245, 155, 0.3) 0%, rgba(0, 168, 107, 0.12) 45%, transparent 80%);
}

/* rotating paw watermark */
.paw-watermark {
  position: absolute;
  top: -10%;
  right: -8%;
  width: 540px;
  height: 540px;
  color: var(--color-forest-200);
  opacity: 0.25;
  pointer-events: none;
  z-index: 0;
}

:global(.dark) .paw-watermark {
  color: rgba(0, 245, 155, 0.08);
  opacity: 0.15;
}

.hero-inner {
  position: relative;
  z-index: 1;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 2.5vw, 2.5rem);
  display: grid;
  grid-template-columns: 1.15fr 0.95fr;
  gap: 3.5rem;
  align-items: center;
}

@media (max-width: 960px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  .hero-card-col { order: -1; }
  .hero-section { min-height: auto; padding: 4rem 0 2.5rem; }
}

/* Announcement Eyebrow Pill */
.eyebrow-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: rgba(0, 168, 107, 0.08);
  border: 1px solid rgba(0, 168, 107, 0.25);
  color: var(--color-forest-700);
  text-decoration: none;
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;
}

.eyebrow-pill:hover {
  background: rgba(0, 168, 107, 0.15);
  border-color: #00a86b;
  transform: translateY(-1px);
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

.eyebrow-text {
  font-weight: 500;
}

.eyebrow-arrow {
  font-weight: 700;
  transition: transform 0.2s ease;
}

.eyebrow-pill:hover .eyebrow-arrow {
  transform: translateX(3px);
}

/* 2-line Headline with Vertical Gradient */
.hero-headline {
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 5.2vw, 4.25rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.035em;
  margin: 0 0 1.25rem;
  display: flex;
  flex-direction: column;
}

.hero-headline-green {
  background: linear-gradient(135deg, #00a86b 0%, #00c48c 50%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

:global(.dark) .hero-headline-green {
  background: linear-gradient(180deg, #ffffff 0%, #d0ffed 40%, #00f59b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-headline-sub {
  color: var(--color-ink-900);
}

:global(.dark) .hero-headline-sub {
  color: #ffffff;
}

/* Subtitle */
.hero-sub {
  font-size: 1.0625rem;
  color: var(--color-ink-500);
  line-height: 1.7;
  margin: 0 0 1.75rem;
  max-width: 520px;
}

:global(.dark) .hero-sub { color: #8ca395; }

/* CTAs Button Group */
.hero-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
}

.btn-nuxt-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.6rem;
  background: #00a86b;
  color: #ffffff;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 700;
  border-radius: 10px;
  text-decoration: none;
  box-shadow: 0 4px 16px -2px rgba(0, 168, 107, 0.35);
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.btn-nuxt-primary:hover {
  background: #007a4d;
  transform: translateY(-2px);
  box-shadow: 0 8px 28px -4px rgba(0, 168, 107, 0.5);
}

:global(.dark) .btn-nuxt-primary {
  background: #00f59b;
  color: #040706;
  font-weight: 700;
  box-shadow: 0 0 24px -2px rgba(0, 245, 155, 0.65);
}

:global(.dark) .btn-nuxt-primary:hover {
  background: #38bdf8;
  box-shadow: 0 0 36px -2px rgba(56, 189, 248, 0.85);
}

.btn-nuxt-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.4rem;
  background: var(--color-cream-50);
  color: var(--color-ink-700);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  border: 1px solid var(--color-cream-300);
  transition: all 0.2s ease;
}

.btn-nuxt-secondary:hover {
  background: var(--color-cream-200);
  color: var(--color-ink-900);
  transform: translateY(-2px);
}

:global(.dark) .btn-nuxt-secondary {
  background: rgba(10, 17, 14, 0.6);
  color: #f1faf5;
  border-color: rgba(0, 245, 155, 0.2);
  backdrop-filter: blur(12px);
}

:global(.dark) .btn-nuxt-secondary:hover {
  background: rgba(16, 28, 22, 0.8);
  border-color: #00f59b;
  box-shadow: 0 0 20px rgba(0, 245, 155, 0.2);
}

.btn-play-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: var(--color-forest-600);
}

:global(.dark) .btn-play-icon {
  color: #00f59b;
}

/* CLI Quick Snippet Bar */
.hero-cli-bar {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: rgba(4, 7, 6, 0.04);
  border: 1px solid var(--color-cream-300);
  border-radius: 8px;
  padding: 0.5rem 0.85rem;
  max-width: 480px;
  margin-bottom: 2rem;
}

:global(.dark) .hero-cli-bar {
  background: rgba(10, 17, 14, 0.75);
  border-color: rgba(0, 245, 155, 0.16);
}

.cli-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  overflow: hidden;
}

.cli-prompt {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-forest-600);
}

:global(.dark) .cli-prompt {
  color: #00f59b;
}

.cli-code {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--color-ink-600);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

:global(.dark) .cli-code { color: #d6e8de; }

.cli-copy-btn {
  background: transparent;
  border: none;
  color: var(--color-ink-400);
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.cli-copy-btn:hover {
  color: #00a86b;
  background: rgba(0, 168, 107, 0.1);
}

:global(.dark) .cli-copy-btn:hover {
  color: #00f59b;
  background: rgba(0, 245, 155, 0.15);
}

.cli-icon {
  width: 16px;
  height: 16px;
}

/* Trust strip */
.trust-strip {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-cream-200);
}

:global(.dark) .trust-strip { border-top-color: rgba(0, 245, 155, 0.15); }

.trust-stat { text-align: center; }

.trust-num {
  display: block;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-ink-900);
  line-height: 1.15;
}

:global(.dark) .trust-num { color: #f1faf5; }

.trust-num--amber { color: var(--color-joy-amber); }

.trust-lbl {
  display: block;
  font-size: 0.7rem;
  color: var(--color-ink-400);
  margin-top: 0.1rem;
}

.trust-divider {
  width: 1px;
  height: 32px;
  background: var(--color-cream-200);
  flex-shrink: 0;
}

:global(.dark) .trust-divider { background: rgba(0, 245, 155, 0.15); }

/* ────────────────────────────────────────
   LIVE BOOKING STUDIO CARD
──────────────────────────────────────── */
.nuxt-studio-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 64px -16px rgba(0, 80, 50, 0.08), 0 4px 16px rgba(0, 0, 0, 0.03);
}

:global(.dark) .nuxt-studio-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.2);
  box-shadow: 0 24px 64px -16px rgba(0, 0, 0, 0.9), 0 0 32px -8px rgba(0, 245, 155, 0.15);
}

/* Studio Tab Bar */
.studio-tab-bar {
  display: flex;
  background: rgba(4, 7, 6, 0.03);
  border-bottom: 1px solid var(--color-cream-200);
  padding: 0.4rem 0.5rem 0;
  gap: 0.25rem;
}

:global(.dark) .studio-tab-bar {
  background: #060c09;
  border-bottom-color: rgba(0, 245, 155, 0.12);
}

.studio-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.85rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-ink-500);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  transition: all 0.15s ease;
}

.studio-tab:hover {
  color: var(--color-ink-900);
}

:global(.dark) .studio-tab { color: #8ca395; }
:global(.dark) .studio-tab:hover { color: #ffffff; }

.studio-tab--active {
  color: var(--color-forest-700);
  border-bottom-color: #00a86b;
  background: var(--color-cream-50);
  font-weight: 600;
}

:global(.dark) .studio-tab--active {
  color: #00f59b;
  border-bottom-color: #00f59b;
  background: #0a110e;
}

.studio-tab-icon { font-size: 0.95rem; }

/* Studio Path Bar */
.studio-path-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1.25rem;
  background: rgba(4, 7, 6, 0.02);
  border-bottom: 1px solid var(--color-cream-200);
  font-size: 0.75rem;
}

:global(.dark) .studio-path-bar {
  background: rgba(255, 255, 255, 0.02);
  border-bottom-color: rgba(0, 245, 155, 0.1);
}

.studio-file {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-ink-400);
}

:global(.dark) .studio-file-name { color: #8ca395; }

.studio-live-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-forest-700);
}

:global(.dark) .studio-live-pill {
  color: #00f59b;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00a86b;
  animation: pulse-ring 2s infinite;
}

:global(.dark) .live-dot {
  background: #00f59b;
}

/* Studio Body */
.studio-body {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.bc-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.bc-species-icon {
  font-size: 2rem;
  line-height: 1;
  transition: all 0.2s ease;
}

.bc-eyebrow {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-forest-700);
}

:global(.dark) .bc-eyebrow { color: var(--color-forest-400); }

.bc-title {
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-ink-900);
}

:global(.dark) .bc-title { color: #f1faf5; }

.bc-badge {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  background: rgba(0, 168, 107, 0.1);
  color: var(--color-forest-700);
  border: 1px solid rgba(0, 168, 107, 0.25);
  white-space: nowrap;
}

:global(.dark) .bc-badge {
  color: #00f59b;
  background: rgba(0, 245, 155, 0.12);
  border-color: rgba(0, 245, 155, 0.35);
}

.bc-badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-forest-400);
  animation: pulse-ring 2.5s infinite;
}

/* Compact Species Selector in card */
.species-group-compact {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.species-label-compact {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-ink-400);
}

:global(.dark) .species-label-compact { color: #5c7365; }

.species-pills-compact {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.species-pill-compact {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--color-cream-300);
  background: var(--color-cream-100);
  color: var(--color-ink-700);
  transition: all 0.15s ease;
}

.species-pill-compact:hover {
  border-color: var(--color-forest-400);
}

.species-pill-compact--active {
  background: #00a86b;
  border-color: #00a86b;
  color: #ffffff;
  font-weight: 700;
}

:global(.dark) .species-pill-compact {
  background: rgba(16, 28, 22, 0.6);
  border-color: rgba(0, 245, 155, 0.15);
  color: #d6e8de;
}

:global(.dark) .species-pill-compact--active {
  background: #00f59b;
  border-color: #00f59b;
  color: #040706;
  font-weight: 700;
}

.bc-slot {
  background: var(--color-cream-100);
  border: 1px solid var(--color-cream-200);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:global(.dark) .bc-slot {
  background: rgba(16, 28, 22, 0.7);
  border-color: rgba(0, 245, 155, 0.18);
}

.bc-slot-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--color-ink-500);
}

:global(.dark) .bc-slot-label { color: #8ca395; }

.slot-icon {
  width: 14px;
  height: 14px;
  color: var(--color-forest-400);
  flex-shrink: 0;
}

.bc-slot-time {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-ink-900);
  background: var(--color-cream-200);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

:global(.dark) .bc-slot-time {
  color: #00f59b;
  background: rgba(0, 245, 155, 0.12);
}

.bc-vet {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.25rem;
  border-top: 1px solid var(--color-cream-200);
}

:global(.dark) .bc-vet { border-top-color: rgba(0, 245, 155, 0.15); }

.bc-vet-avatar {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: var(--color-forest-800);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

:global(.dark) .bc-vet-avatar {
  background: #00f59b;
  color: #040706;
}

.bc-vet-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-ink-900);
}

:global(.dark) .bc-vet-name { color: #f8fafc; }

.bc-vet-role {
  font-size: 0.7rem;
  color: var(--color-ink-500);
  margin-top: 0.1rem;
}

:global(.dark) .bc-vet-role { color: #94a3b8; }

.bc-perks {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.bc-perks li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-ink-500);
}

:global(.dark) .bc-perks li { color: #94a3b8; }

.perk-check {
  width: 14px;
  height: 14px;
  color: var(--color-forest-400);
  flex-shrink: 0;
}

.bc-cta {
  width: 100%;
  justify-content: center;
  padding-top: 0.85rem;
  padding-bottom: 0.85rem;
  margin-top: 0.25rem;
}

/* ────────────────────────────────────────
   TRUST LOGOS BAR (Nuxt.com Style)
──────────────────────────────────────── */
.hero-trust-bar {
  max-width: 1440px;
  margin: 4.5rem auto 0;
  padding: 0 clamp(1.25rem, 2.5vw, 2.5rem);
  text-align: center;
}

.trust-bar-caption {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-ink-400);
  margin-bottom: 1.5rem;
}

:global(.dark) .trust-bar-caption { color: #64748b; }

.trust-logos-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 2rem 3rem;
}

.trust-logo-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--color-ink-300);
  transition: color 0.2s ease;
}

.trust-logo-item:hover {
  color: var(--color-ink-600);
}

:global(.dark) .trust-logo-item {
  color: #475569;
}

:global(.dark) .trust-logo-item:hover {
  color: #94a3b8;
}

.logo-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-forest-400);
  opacity: 0.6;
}

/* ────────────────────────────────────────
   SECTION COMMON
──────────────────────────────────────── */
.section-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 2.5vw, 2.5rem);
}

.section-header {
  text-align: center;
  max-width: 640px;
  margin: 0 auto 3.5rem;
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-forest-600);
  margin-bottom: 0.65rem;
}

:global(.dark) .section-eyebrow { color: var(--color-forest-400); }

.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0 0 0.75rem;
  line-height: 1.2;
}

:global(.dark) .section-title { color: #f8fafc; }

.section-sub {
  font-size: 0.9375rem;
  color: var(--color-ink-500);
  line-height: 1.65;
}

:global(.dark) .section-sub { color: #94a3b8; }

/* ────────────────────────────────────────
   SERVICES SECTION
──────────────────────────────────────── */
.services-section {
  padding: 5rem 0;
  background: var(--color-cream-50);
}

:global(.dark) .services-section {
  background: #040706;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .services-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .services-grid { grid-template-columns: 1fr; }
}

.service-card {
  background: var(--color-cream-100);
  border: 1px solid var(--color-cream-200);
  border-radius: 20px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px -8px rgba(0, 80, 50, 0.08);
  border-color: var(--color-forest-400);
}

:global(.dark) .service-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.15);
}

:global(.dark) .service-card:hover {
  border-color: #00f59b;
  box-shadow: 0 12px 36px -8px rgba(0, 245, 155, 0.22);
}

.sc-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sc-icon-wrap {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 12px;
  background: var(--color-forest-100);
  display: flex;
  align-items: center;
  justify-content: center;
}

:global(.dark) .sc-icon-wrap {
  background: rgba(0, 245, 155, 0.12);
}

.sc-icon { font-size: 1.2rem; }

.sc-duration {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.55rem;
  border-radius: 8px;
  background: var(--color-cream-200);
  color: var(--color-ink-500);
}

:global(.dark) .sc-duration {
  background: rgba(16, 28, 22, 0.7);
  color: #8ca395;
}

.sc-name {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
  line-height: 1.25;
}

:global(.dark) .sc-name { color: #f1faf5; }

.sc-desc {
  font-size: 0.8125rem;
  color: var(--color-ink-500);
  line-height: 1.6;
  flex-grow: 1;
  margin: 0;
}

:global(.dark) .sc-desc { color: #8ca395; }

.sc-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 1rem;
  border-top: 1px solid var(--color-cream-200);
  margin-top: 0.5rem;
}

:global(.dark) .sc-footer { border-top-color: rgba(0, 245, 155, 0.15); }

.sc-price-label {
  display: block;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-ink-300);
}

.sc-top-actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.sc-curr-toggle {
  padding: 0.2rem 0.45rem;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 6px;
  background: rgba(0, 168, 107, 0.1);
  border: 1px solid rgba(0, 168, 107, 0.25);
  color: #059669;
  cursor: pointer;
  transition: all 0.15s ease;
}

.sc-curr-toggle:hover {
  background: rgba(0, 168, 107, 0.2);
}

:global(.dark) .sc-curr-toggle {
  background: rgba(0, 245, 155, 0.1);
  border-color: rgba(0, 245, 155, 0.3);
  color: #00f59b;
}

:global(.dark) .sc-curr-toggle:hover {
  background: rgba(0, 245, 155, 0.22);
}

.sc-price-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-ink-900);
  line-height: 1.2;
}

:global(.dark) .sc-price-value { color: #f1faf5; }

.sc-price-sub {
  display: block;
  font-size: 0.68rem;
  color: var(--color-ink-400);
  margin-top: 2px;
}

:global(.dark) .sc-price-sub { color: rgba(223, 240, 238, 0.55); }

.sc-btn {
  font-size: 0.8125rem;
  padding: 0.5rem 1rem;
}

/* ────────────────────────────────────────
   WHY SECTION
──────────────────────────────────────── */
.why-section {
  padding: 5rem 0;
  background: var(--color-cream-100);
}

:global(.dark) .why-section {
  background: #040706;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

@media (max-width: 768px) {
  .features-grid { grid-template-columns: 1fr; }
}

.feature-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 20px;
  padding: 2rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px -6px rgba(0, 80, 50, 0.07);
}

:global(.dark) .feature-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.15);
}

:global(.dark) .feature-card:hover {
  border-color: #00f59b;
  box-shadow: 0 8px 28px -6px rgba(0, 245, 155, 0.2);
}

.fc-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.fc-title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0 0 0.6rem;
}

:global(.dark) .fc-title { color: #f1faf5; }

.fc-desc {
  font-size: 0.875rem;
  color: var(--color-ink-500);
  line-height: 1.65;
  margin: 0;
}

:global(.dark) .fc-desc { color: #8ca395; }

/* ────────────────────────────────────────
   URGENT BANNER
──────────────────────────────────────── */
.urgent-section {
  padding: 5rem 0 6rem;
  background: var(--color-cream-50);
  transition: background-color 0.25s ease;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
}

:global(.dark) .urgent-section {
  background: #040706;
}

.urgent-banner {
  position: relative;
  overflow: hidden;
  background: var(--color-cream-100);
  border: 1.5px solid var(--color-cream-300);
  border-radius: 28px;
  padding: 3.5rem 3rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem 3rem;
  align-items: center;
  box-shadow: 0 20px 60px -15px rgba(0, 80, 50, 0.08);
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

:global(.dark) .urgent-banner {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.22);
  box-shadow: 0 24px 80px -20px rgba(0, 0, 0, 0.8);
}

@media (max-width: 768px) {
  .urgent-banner {
    grid-template-columns: 1fr;
    padding: 2.5rem 1.75rem;
  }
}

.urgent-bg-paw {
  position: absolute;
  right: -60px;
  top: -60px;
  width: 340px;
  height: 340px;
  color: rgba(0, 168, 107, 0.05);
  pointer-events: none;
}

:global(.dark) .urgent-bg-paw {
  color: rgba(0, 245, 155, 0.04);
}

.urgent-content {
  position: relative;
  z-index: 1;
}

.urgent-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #b45309;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  margin-bottom: 1rem;
}

:global(.dark) .urgent-badge {
  color: #fbbf24;
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.4);
}

.urgent-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-amber-500);
  animation: pulse-ring 2s infinite;
}

.urgent-title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.5vw, 2.25rem);
  font-weight: 800;
  color: var(--color-ink-900);
  margin: 0 0 0.75rem;
  line-height: 1.2;
}

:global(.dark) .urgent-title {
  color: #f1faf5;
}

.urgent-sub {
  font-size: 0.9375rem;
  color: var(--color-ink-600);
  line-height: 1.6;
  margin: 0;
  max-width: 520px;
}

:global(.dark) .urgent-sub {
  color: #8ca395;
}

.urgent-actions {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  align-items: stretch;
  min-width: 200px;
}

.urgent-ghost {
  border-color: var(--color-cream-300);
  color: var(--color-ink-700);
  justify-content: center;
  background: var(--color-cream-50);
}

.urgent-ghost:hover {
  border-color: #00a86b;
  color: #007a4d;
  background: var(--color-cream-100);
}

:global(.dark) .urgent-ghost {
  border-color: rgba(0, 245, 155, 0.2);
  color: #d6e8de;
  background: transparent;
}

:global(.dark) .urgent-ghost:hover {
  border-color: #00f59b;
  color: #00f59b;
  background: rgba(0, 245, 155, 0.08);
}
</style>
