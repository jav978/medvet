<template>
  <div class="page-root">

    <!-- ══════════════════════════════════════
         HERO
    ══════════════════════════════════════ -->
    <section class="hero-section">

      <!-- Rotating paw watermark — the signature element -->
      <div class="paw-watermark animate-rotate-slow" aria-hidden="true">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Pad -->
          <ellipse cx="100" cy="128" rx="38" ry="32" fill="currentColor"/>
          <!-- Toes -->
          <ellipse cx="58"  cy="90"  rx="18" ry="22" fill="currentColor"/>
          <ellipse cx="88"  cy="72"  rx="17" ry="21" fill="currentColor"/>
          <ellipse cx="118" cy="72"  rx="17" ry="21" fill="currentColor"/>
          <ellipse cx="146" cy="90"  rx="18" ry="22" fill="currentColor"/>
        </svg>
      </div>

      <div class="hero-inner">
        <!-- Left column: text -->
        <div class="hero-text animate-fade-up">

          <span class="eyebrow-pill">
            <span class="eyebrow-dot"></span>
            Sistema Integral de Citas Veterinarias
          </span>

          <h1 class="hero-headline">
            El cuidado que
            <em class="hero-headline-em">merece</em>
            quien más quieres.
          </h1>

          <p class="hero-sub">
            Reservá consultas clínicas, cirugías y vacunación en minutos.
            Equipo veterinario certificado, historia clínica digital, recordatorios automáticos.
          </p>

          <!-- Species selector -->
          <div class="species-group">
            <span class="species-label">¿A quién atendemos hoy?</span>
            <div class="species-pills">
              <button
                v-for="sp in speciesOptions"
                :key="sp.id"
                @click="selectedSpecies = sp.id"
                :class="['species-pill', selectedSpecies === sp.id ? 'species-pill--active' : '']"
              >
                <span>{{ sp.emoji }}</span>
                <span>{{ sp.label }}</span>
              </button>
            </div>
          </div>

          <!-- CTAs -->
          <div class="hero-ctas">
            <NuxtLink to="/book" class="btn-amber">
              <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M6 2a1 1 0 000 2h1v1a1 1 0 002 0V4h2v1a1 1 0 002 0V4h1a1 1 0 100-2h-1V1a1 1 0 10-2 0v1H9V1a1 1 0 10-2 0v1H6zm-2 5a1 1 0 000 2h12a1 1 0 100-2H4zm0 4a1 1 0 100 2h12a1 1 0 100-2H4zm0 4a1 1 0 100 2h8a1 1 0 100-2H4z"/></svg>
              Reservar Turno
            </NuxtLink>
            <a href="#services" class="btn-ghost">
              Ver Servicios
              <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10 9.293 5.707A1 1 0 0110 3z" clip-rule="evenodd"/></svg>
            </a>
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

        <!-- Right column: booking card -->
        <div class="hero-card-col animate-fade-up" style="animation-delay:0.15s">
          <div class="booking-card animate-float">

            <div class="bc-header">
              <div class="bc-species-icon">{{ getSpeciesEmoji(selectedSpecies) }}</div>
              <div>
                <div class="bc-eyebrow">Reserva Rápida</div>
                <div class="bc-title">{{ getSpeciesTitle(selectedSpecies) }}</div>
              </div>
              <span class="bc-badge">
                <span class="bc-badge-dot"></span>
                Cupos disponibles
              </span>
            </div>

            <div class="bc-slot">
              <div class="bc-slot-label">
                <svg class="slot-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
                Próximo turno disponible
              </div>
              <span class="bc-slot-time">Hoy · 16:30 hs</span>
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
              <li>
                <svg class="perk-check" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                Cancelación y reprogramación sin costo
              </li>
            </ul>

            <NuxtLink to="/book" class="btn-primary bc-cta">
              Seleccionar horario
            </NuxtLink>
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
              <span class="sc-duration font-mono-numbers">{{ service.duration }} min</span>
            </div>
            <h3 class="sc-name">{{ service.name }}</h3>
            <p class="sc-desc">{{ service.description }}</p>
            <div class="sc-footer">
              <div class="sc-price">
                <span class="sc-price-label">Arancel estimado</span>
                <span class="sc-price-value font-mono-numbers">${{ service.price?.toLocaleString() }}</span>
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
const selectedSpecies = ref('dog')

const speciesOptions = [
  { id: 'dog',    label: 'Perros',            emoji: '🐶' },
  { id: 'cat',    label: 'Gatos',             emoji: '🐱' },
  { id: 'exotic', label: 'Exóticos',          emoji: '🦜' },
  { id: 'small',  label: 'Pequeños Mamíferos', emoji: '🐰' }
]

const services = ref([])

const fallbackServices = [
  {
    id: 1,
    name: 'Consulta Clínica General',
    category: 'consulta',
    description: 'Evaluación integral del estado de salud, auscultación, revisión dermatológica y nutricional.',
    duration: 30,
    price: 15000
  },
  {
    id: 2,
    name: 'Vacunación & Desparasitación',
    category: 'vacuna',
    description: 'Aplicación de vacunas quíntuple/séxtuple, antirrábica y desparasitación interna/externa.',
    duration: 20,
    price: 18000
  },
  {
    id: 3,
    name: 'Laboratorio & Análisis de Sangre',
    category: 'laboratorio',
    description: 'Hemograma completo, perfil renal, hepático y análisis bioquímico de control.',
    duration: 25,
    price: 22000
  },
  {
    id: 4,
    name: 'Cirugía & Castración',
    category: 'cirugia',
    description: 'Procedimiento quirúrgico con monitoreo anestésico inhalatorio y postoperatorio.',
    duration: 60,
    price: 45000
  },
  {
    id: 5,
    name: 'Higienización & Baño Sanitario',
    category: 'estetica',
    description: 'Baño medicado dermatológico, corte de uñas, limpieza de oídos y drenaje anal.',
    duration: 45,
    price: 14000
  },
  {
    id: 6,
    name: 'Urgencia & Ecografía',
    category: 'emergencia',
    description: 'Diagnóstico ecográfico de alta resolución y estabilización de emergencia.',
    duration: 45,
    price: 30000
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
}

.dark .page-root {
  background-color: var(--color-forest-950);
}

/* ────────────────────────────────────────
   HERO
──────────────────────────────────────── */
.hero-section {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 6rem 0 4rem;
}

/* rotating paw watermark */
.paw-watermark {
  position: absolute;
  top: -12%;
  right: -10%;
  width: 560px;
  height: 560px;
  color: var(--color-forest-200);
  opacity: 0.35;
  pointer-events: none;
  z-index: 0;
}

.dark .paw-watermark {
  color: var(--color-forest-800);
  opacity: 0.18;
}

.hero-inner {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

@media (max-width: 900px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  .hero-card-col { order: -1; }
  .hero-section { min-height: auto; padding: 5rem 0 3rem; }
}

/* Eyebrow pill */
.eyebrow-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: var(--color-forest-100);
  border: 1px solid var(--color-forest-200);
  color: var(--color-forest-800);
  margin-bottom: 1.25rem;
}

.dark .eyebrow-pill {
  background: rgba(45, 90, 61, 0.2);
  border-color: rgba(78, 154, 103, 0.3);
  color: var(--color-forest-400);
}

.eyebrow-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-forest-600);
  animation: pulse-ring 2.5s infinite;
  flex-shrink: 0;
}

/* Headline */
.hero-headline {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-ink-900);
  margin: 0 0 1.25rem;
}

.dark .hero-headline { color: #e8ede9; }

.hero-headline-em {
  font-style: italic;
  color: var(--color-forest-700);
}

.dark .hero-headline-em { color: var(--color-forest-400); }

/* Sub */
.hero-sub {
  font-size: 1.0625rem;
  color: var(--color-ink-500);
  line-height: 1.7;
  margin: 0 0 1.75rem;
  max-width: 500px;
}

.dark .hero-sub { color: #8aab8e; }

/* Species pills */
.species-group { margin-bottom: 1.75rem; }

.species-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink-300);
  margin-bottom: 0.65rem;
}

.dark .species-label { color: #6b8e6e; }

.species-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.species-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-50);
  color: var(--color-ink-700);
  transition: all 0.18s ease;
}

.species-pill:hover {
  border-color: var(--color-forest-600);
}

.species-pill--active {
  background: var(--color-forest-900);
  border-color: var(--color-forest-900);
  color: #fff;
}

.dark .species-pill {
  background: rgba(22, 34, 16, 0.6);
  border-color: rgba(61, 122, 82, 0.25);
  color: #b8d4bb;
}

.dark .species-pill--active {
  background: var(--color-forest-700);
  border-color: var(--color-forest-700);
  color: #fff;
}

/* CTAs */
.hero-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
}

.btn-icon {
  width: 1.1em;
  height: 1.1em;
  flex-shrink: 0;
}

/* Trust strip */
.trust-strip {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-cream-200);
}

.dark .trust-strip { border-top-color: rgba(61, 122, 82, 0.15); }

.trust-stat { text-align: center; }

.trust-num {
  display: block;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-ink-900);
  line-height: 1.15;
}

.dark .trust-num { color: #c8deca; }

.trust-num--amber { color: var(--color-amber-600); }

.trust-lbl {
  display: block;
  font-size: 0.7rem;
  color: var(--color-ink-300);
  margin-top: 0.1rem;
}

.trust-divider {
  width: 1px;
  height: 32px;
  background: var(--color-cream-200);
  flex-shrink: 0;
}

.dark .trust-divider { background: rgba(61, 122, 82, 0.2); }

/* ────────────────────────────────────────
   BOOKING CARD
──────────────────────────────────────── */
.booking-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 60px -16px rgba(26, 22, 14, 0.14), 0 4px 16px rgba(26, 22, 14, 0.06);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.dark .booking-card {
  background: #162210;
  border-color: rgba(61, 122, 82, 0.22);
  box-shadow: 0 20px 60px -16px rgba(0,0,0,0.4);
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

.dark .bc-eyebrow { color: var(--color-forest-400); }

.bc-title {
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-ink-900);
}

.dark .bc-title { color: #d4e8d6; }

.bc-badge {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  background: rgba(78, 154, 103, 0.12);
  color: var(--color-forest-700);
  border: 1px solid rgba(78, 154, 103, 0.25);
  white-space: nowrap;
}

.bc-badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-forest-600);
  animation: pulse-ring 2.5s infinite;
}

.bc-slot {
  background: var(--color-cream-100);
  border: 1px solid var(--color-cream-200);
  border-radius: 12px;
  padding: 0.875rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dark .bc-slot {
  background: rgba(14, 31, 20, 0.7);
  border-color: rgba(61, 122, 82, 0.2);
}

.bc-slot-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--color-ink-500);
}

.dark .bc-slot-label { color: #6b8e6e; }

.slot-icon {
  width: 14px;
  height: 14px;
  color: var(--color-forest-600);
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

.dark .bc-slot-time {
  color: #c8deca;
  background: rgba(27, 58, 42, 0.6);
}

.bc-vet {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.25rem;
  border-top: 1px solid var(--color-cream-200);
}

.dark .bc-vet { border-top-color: rgba(61, 122, 82, 0.15); }

.bc-vet-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--color-forest-800);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 700;
  flex-shrink: 0;
  animation: pulse-ring 3s infinite;
}

.bc-vet-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-ink-900);
}

.dark .bc-vet-name { color: #d4e8d6; }

.bc-vet-role {
  font-size: 0.7rem;
  color: var(--color-ink-500);
  margin-top: 0.1rem;
}

.dark .bc-vet-role { color: #5a7e5e; }

.bc-perks {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bc-perks li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-ink-500);
}

.dark .bc-perks li { color: #6b8e6e; }

.perk-check {
  width: 14px;
  height: 14px;
  color: var(--color-forest-600);
  flex-shrink: 0;
}

.bc-cta {
  width: 100%;
  justify-content: center;
  padding-top: 1rem;
  padding-bottom: 1rem;
  margin-top: 0.25rem;
}

/* ────────────────────────────────────────
   SECTION COMMON
──────────────────────────────────────── */
.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
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
  color: var(--color-forest-700);
  margin-bottom: 0.65rem;
}

.dark .section-eyebrow { color: var(--color-forest-400); }

.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0 0 0.75rem;
  line-height: 1.2;
}

.dark .section-title { color: #d4e8d6; }

.section-sub {
  font-size: 0.9375rem;
  color: var(--color-ink-500);
  line-height: 1.65;
}

.dark .section-sub { color: #5a7e5e; }

/* ────────────────────────────────────────
   SERVICES SECTION
──────────────────────────────────────── */
.services-section {
  padding: 5rem 0;
  background: var(--color-cream-50);
}

.dark .services-section {
  background: #111e0f;
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
  box-shadow: 0 12px 36px -8px rgba(26, 22, 14, 0.12);
  border-color: var(--color-forest-300, #a0c8a8);
}

.dark .service-card {
  background: #162210;
  border-color: rgba(61, 122, 82, 0.18);
}

.dark .service-card:hover {
  border-color: rgba(78, 154, 103, 0.45);
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

.dark .sc-icon-wrap {
  background: rgba(45, 90, 61, 0.25);
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

.dark .sc-duration {
  background: rgba(27, 58, 42, 0.5);
  color: #6b8e6e;
}

.sc-name {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
  line-height: 1.25;
}

.dark .sc-name { color: #c8deca; }

.sc-desc {
  font-size: 0.8125rem;
  color: var(--color-ink-500);
  line-height: 1.6;
  flex-grow: 1;
  margin: 0;
}

.dark .sc-desc { color: #5a7e5e; }

.sc-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 1rem;
  border-top: 1px solid var(--color-cream-200);
  margin-top: 0.5rem;
}

.dark .sc-footer { border-top-color: rgba(61, 122, 82, 0.15); }

.sc-price-label {
  display: block;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-ink-300);
}

.sc-price-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-ink-900);
}

.dark .sc-price-value { color: #c8deca; }

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

.dark .why-section {
  background: var(--color-forest-950);
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
  box-shadow: 0 8px 28px -6px rgba(26, 22, 14, 0.1);
}

.dark .feature-card {
  background: #162210;
  border-color: rgba(61, 122, 82, 0.18);
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

.dark .fc-title { color: #c8deca; }

.fc-desc {
  font-size: 0.875rem;
  color: var(--color-ink-500);
  line-height: 1.65;
  margin: 0;
}

.dark .fc-desc { color: #5a7e5e; }

/* ────────────────────────────────────────
   URGENT BANNER
──────────────────────────────────────── */
.urgent-section {
  padding: 5rem 0 6rem;
  background: var(--color-cream-50);
}

.dark .urgent-section {
  background: #111e0f;
}

.urgent-banner {
  position: relative;
  overflow: hidden;
  background: var(--color-forest-900);
  border-radius: 28px;
  padding: 3.5rem 3rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem 3rem;
  align-items: center;
  box-shadow: 0 24px 80px -20px rgba(27, 58, 42, 0.5);
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
  color: rgba(255, 255, 255, 0.04);
  pointer-events: none;
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
  color: rgba(200, 232, 200, 0.75);
  background: rgba(200, 134, 10, 0.12);
  border: 1px solid rgba(200, 134, 10, 0.3);
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  margin-bottom: 1rem;
}

.urgent-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-amber-500);
  animation: pulse-ring 2s infinite;
}

.urgent-title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.5vw, 2.25rem);
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.75rem;
  line-height: 1.2;
}

.urgent-sub {
  font-size: 0.9375rem;
  color: rgba(200, 232, 200, 0.6);
  line-height: 1.6;
  margin: 0;
  max-width: 520px;
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
  border-color: rgba(200, 232, 200, 0.2);
  color: rgba(200, 232, 200, 0.7);
  justify-content: center;
}

.urgent-ghost:hover {
  border-color: rgba(200, 232, 200, 0.45);
  background: rgba(255,255,255,0.05);
}
</style>
