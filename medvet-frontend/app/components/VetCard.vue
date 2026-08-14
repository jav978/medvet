<template>
  <div class="vetcard-scene" @click="flipped = !flipped" :title="flipped ? 'Ver frente' : 'Ver reverso'">
    <div :class="['vetcard-flipper', flipped ? 'vetcard-flipper--flipped' : '']">

      <!-- ────── FRENTE ────── -->
      <div class="vetcard-face vetcard-front">
        <!-- Decorative circles -->
        <div class="deco-circle deco-circle--1" aria-hidden="true"></div>
        <div class="deco-circle deco-circle--2" aria-hidden="true"></div>

        <!-- Logo header -->
        <div class="vcard-header">
          <div class="vcard-logo">
            <svg viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" fill="currentColor"/></svg>
          </div>
          <div class="vcard-brand">
            <span class="vcard-brand-name">Med<span>Vet</span></span>
            <span class="vcard-brand-sub">Clínica Veterinaria</span>
          </div>
          <div class="vcard-type-badge">ID</div>
        </div>

        <!-- Franja teal + foto -->
        <div class="vcard-photo-section">
          <div class="vcard-photo">
            <img v-if="vet.photo" :src="vet.photo" :alt="vet.name" />
            <span v-else class="vcard-photo-initials">{{ initials }}</span>
          </div>
        </div>

        <!-- Nombre + rol -->
        <div class="vcard-identity">
          <h2 class="vcard-name">{{ vet.name }}</h2>
          <div class="vcard-role">{{ vet.specialty || 'Médico Veterinario' }}</div>
          <div class="vcard-matricula font-mono-numbers" v-if="vet.license">
            Mat. {{ vet.license }}
          </div>
        </div>

        <!-- Badges de especialidad -->
        <div class="vcard-badges" v-if="vet.tags?.length">
          <span v-for="tag in vet.tags.slice(0,3)" :key="tag" class="vcard-badge">{{ tag }}</span>
        </div>

        <!-- Footer: ID + barcode -->
        <div class="vcard-footer">
          <div class="vcard-footer-left">
            <div class="vcard-footer-label">N° Empleado</div>
            <div class="vcard-footer-id font-mono-numbers">{{ String(vet.id || '001').padStart(4, '0') }}</div>
          </div>
          <div class="vcard-footer-right">
            <svg viewBox="0 0 100 22" class="vet-barcode">
              <g v-for="(w, i) in vetBars" :key="i" fill="white" opacity="0.8">
                <rect :x="i * 3.2" y="0" :width="w" height="18"/>
              </g>
            </svg>
            <div class="vcard-barcode-num font-mono-numbers">{{ String(vet.id || '001').padStart(6, '0') }}</div>
          </div>
        </div>
        <div class="flip-hint">Toca para ver reverso →</div>
      </div>

      <!-- ────── REVERSO ────── -->
      <div class="vetcard-face vetcard-back">

        <!-- Teal header strip -->
        <div class="back-strip">
          <div class="vcard-logo vcard-logo--inv">
            <svg viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" fill="currentColor"/></svg>
          </div>
          <span class="back-strip-title">Datos de Contacto</span>
        </div>

        <!-- QR -->
        <div class="back-qr-section">
          <div class="back-qr-box">
            <svg class="vet-qr-svg" viewBox="0 0 60 60" fill="none">
              <rect x="2" y="2" width="16" height="16" rx="2" fill="currentColor" opacity="0.9"/>
              <rect x="4" y="4" width="12" height="12" rx="1" fill="white"/>
              <rect x="6" y="6" width="8" height="8" fill="currentColor" opacity="0.9"/>
              <rect x="42" y="2" width="16" height="16" rx="2" fill="currentColor" opacity="0.9"/>
              <rect x="44" y="4" width="12" height="12" rx="1" fill="white"/>
              <rect x="46" y="6" width="8" height="8" fill="currentColor" opacity="0.9"/>
              <rect x="2" y="42" width="16" height="16" rx="2" fill="currentColor" opacity="0.9"/>
              <rect x="4" y="44" width="12" height="12" rx="1" fill="white"/>
              <rect x="6" y="46" width="8" height="8" fill="currentColor" opacity="0.9"/>
              <g fill="currentColor" opacity="0.7">
                <rect x="22" y="2" width="4" height="4"/><rect x="30" y="2" width="4" height="4"/>
                <rect x="38" y="6" width="4" height="4"/><rect x="24" y="10" width="4" height="4"/>
                <rect x="32" y="10" width="4" height="4"/><rect x="36" y="14" width="4" height="4"/>
                <rect x="2" y="22" width="4" height="4"/><rect x="10" y="22" width="4" height="4"/>
                <rect x="20" y="22" width="4" height="4"/><rect x="28" y="22" width="4" height="4"/>
                <rect x="38" y="22" width="4" height="4"/><rect x="46" y="22" width="4" height="4"/>
                <rect x="56" y="22" width="4" height="4"/><rect x="4" y="28" width="4" height="4"/>
                <rect x="14" y="28" width="4" height="4"/><rect x="22" y="28" width="4" height="4"/>
                <rect x="32" y="28" width="4" height="4"/><rect x="42" y="28" width="4" height="4"/>
                <rect x="52" y="28" width="4" height="4"/><rect x="6" y="34" width="4" height="4"/>
                <rect x="16" y="34" width="4" height="4"/><rect x="26" y="34" width="4" height="4"/>
                <rect x="36" y="34" width="4" height="4"/><rect x="48" y="34" width="4" height="4"/>
                <rect x="22" y="42" width="4" height="4"/><rect x="30" y="42" width="4" height="4"/>
                <rect x="40" y="42" width="4" height="4"/><rect x="52" y="42" width="4" height="4"/>
                <rect x="26" y="48" width="4" height="4"/><rect x="34" y="48" width="4" height="4"/>
                <rect x="44" y="48" width="4" height="4"/><rect x="54" y="48" width="4" height="4"/>
                <rect x="22" y="54" width="4" height="4"/><rect x="32" y="54" width="4" height="4"/>
                <rect x="42" y="54" width="4" height="4"/><rect x="50" y="54" width="4" height="4"/>
              </g>
            </svg>
          </div>
          <p class="back-qr-label">Perfil & agenda de turnos</p>
        </div>

        <!-- Contact info rows -->
        <div class="back-contacts">
          <div class="bc-row" v-if="vet.email">
            <span class="bc-ico">✉️</span>
            <span class="bc-val">{{ vet.email }}</span>
          </div>
          <div class="bc-row" v-if="vet.phone">
            <span class="bc-ico">📞</span>
            <span class="bc-val font-mono-numbers">{{ vet.phone }}</span>
          </div>
          <div class="bc-row">
            <span class="bc-ico">📍</span>
            <span class="bc-val">Clínica MedVet — Guardia 24/7</span>
          </div>
          <div class="bc-row" v-if="vet.license">
            <span class="bc-ico">🏅</span>
            <span class="bc-val font-mono-numbers">Mat. {{ vet.license }}</span>
          </div>
        </div>

        <!-- Terms note -->
        <div class="back-terms">
          Este carnet es propiedad de MedVet Clínica Veterinaria. En caso de extravío, comunicarse al +54 11 1234-5678 o admin@medvet.com
        </div>

        <!-- Footer -->
        <div class="back-footer-vet">
          <span class="bfv-brand">MedVet</span>
          <span class="bfv-web">medvet.com</span>
          <span class="bfv-paw">🐾</span>
        </div>
        <div class="flip-hint flip-hint--dark">← Ver frente</div>
      </div>

    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  vet: {
    type: Object,
    required: true,
    default: () => ({
      id: null,
      name: 'Dr. Nombre Apellido',
      specialty: 'Medicina Clínica General',
      license: null,
      photo: null,
      email: null,
      phone: null,
      tags: []
    })
  }
})

const flipped = ref(false)

const initials = computed(() =>
  props.vet.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
)

const vetBars = computed(() => {
  const seed = props.vet.id || 7
  return Array.from({ length: 31 }, (_, i) => ((seed * (i + 5)) % 3 === 0 ? 2.5 : 1.5))
})
</script>

<style scoped>
.vetcard-scene {
  width: 300px;
  height: 480px;
  perspective: 1000px;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

.vetcard-flipper {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
}

.vetcard-flipper--flipped { transform: rotateY(180deg); }

.vetcard-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 20px 60px -12px rgba(13, 27, 42, 0.4),
    0 8px 24px -8px rgba(13, 27, 42, 0.25);
}

/* ── FRONT ── */
.vetcard-front {
  background: linear-gradient(160deg, #0B2440 0%, #1E3A70 60%, #2563EB 100%);
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Decorative circles */
.deco-circle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.deco-circle--1 {
  width: 220px; height: 220px;
  background: rgba(51, 153, 255, 0.1);
  top: -60px; right: -60px;
}
.deco-circle--2 {
  width: 120px; height: 120px;
  background: rgba(0, 181, 163, 0.08);
  bottom: 60px; left: -40px;
}

/* Header */
.vcard-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 1.125rem 0.875rem;
  position: relative;
  z-index: 1;
}

.vcard-logo {
  width: 2rem; height: 2rem;
  border-radius: 8px;
  background: rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  color: #99F6E4; flex-shrink: 0;
}
.vcard-logo svg { width: 1rem; height: 1rem; }

.vcard-logo--inv {
  background: rgba(255,255,255,0.2);
  color: #fff;
}

.vcard-brand-name {
  font-family: var(--font-display);
  font-size: 1rem; font-weight: 800; color: #fff; display: block;
}
.vcard-brand-name span { color: #76D7C4; }
.vcard-brand-sub {
  font-size: 0.5rem; color: rgba(255,255,255,0.5);
  text-transform: uppercase; letter-spacing: 0.07em;
}

.vcard-type-badge {
  margin-left: auto;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  font-size: 0.6rem; font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
  letter-spacing: 0.06em;
}

/* Photo section */
.vcard-photo-section {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0 0;
  position: relative; z-index: 1;
}

.vcard-photo {
  width: 90px; height: 90px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  border: 3px solid rgba(255,255,255,0.5);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.25);
}
.vcard-photo img { width: 100%; height: 100%; object-fit: cover; }
.vcard-photo-initials {
  font-size: 1.75rem; font-weight: 800; color: #fff;
}

/* Identity */
.vcard-identity {
  text-align: center;
  padding: 0.625rem 1rem 0;
  position: relative; z-index: 1;
}

.vcard-name {
  font-family: var(--font-display);
  font-size: 1.375rem; font-weight: 800;
  color: #fff; margin: 0; line-height: 1.1;
}
.vcard-role {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.65);
  margin-top: 0.2rem;
}
.vcard-matricula {
  font-size: 0.7rem;
  color: #76D7C4;
  margin-top: 0.3rem;
}

/* Badges */
.vcard-badges {
  display: flex; flex-wrap: wrap; gap: 0.3rem;
  justify-content: center;
  padding: 0.6rem 1rem 0;
  position: relative; z-index: 1;
}
.vcard-badge {
  font-size: 0.6rem; font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: rgba(20, 184, 166, 0.2);
  color: #99F6E4;
  border: 1px solid rgba(20, 184, 166, 0.35);
}

/* Footer */
.vcard-footer {
  margin-top: auto;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  padding: 0.75rem 1.125rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative; z-index: 1;
}

.vcard-footer-label {
  font-size: 0.55rem; color: rgba(255,255,255,0.4);
  text-transform: uppercase; letter-spacing: 0.07em;
}
.vcard-footer-id {
  font-size: 1rem; font-weight: 700; color: #fff;
}

.vet-barcode { width: 80px; height: 22px; }
.vcard-barcode-num {
  font-size: 0.55rem; color: rgba(255,255,255,0.45); text-align: right;
}

/* ── BACK ── */
.vetcard-back {
  transform: rotateY(180deg);
  background: #F4F7FB;
  display: flex;
  flex-direction: column;
}

.back-strip {
  background: #00B5A3;
  padding: 0.875rem 1.125rem;
  display: flex; align-items: center; gap: 0.6rem;
}
.back-strip-title {
  font-size: 0.875rem; font-weight: 700; color: #fff;
}

/* QR */
.back-qr-section {
  display: flex; flex-direction: column; align-items: center;
  padding: 1.25rem 1rem 0.875rem; gap: 0.5rem;
  background: #fff;
  border-bottom: 1px solid #E2E8F0;
}
.back-qr-box {
  width: 100px; height: 100px;
  background: #fff;
  border: 2px solid #00B5A3;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  padding: 0.4rem;
}
.vet-qr-svg { width: 100%; height: 100%; color: #0B2440; }
.back-qr-label {
  font-size: 0.6rem; color: #475569; text-align: center;
  max-width: 150px; margin: 0;
}

/* Contact rows */
.back-contacts {
  padding: 0.875rem 1.25rem;
  display: flex; flex-direction: column; gap: 0.55rem;
  flex: 1;
}
.bc-row { display: flex; align-items: flex-start; gap: 0.5rem; }
.bc-ico { font-size: 0.875rem; flex-shrink: 0; }
.bc-val { font-size: 0.78rem; color: #334155; line-height: 1.4; }

/* Terms */
.back-terms {
  font-size: 0.58rem;
  color: #94A3B8;
  padding: 0 1.25rem 0.625rem;
  line-height: 1.6;
  border-top: 1px solid #E2E8F0;
  padding-top: 0.625rem;
}

/* Back footer */
.back-footer-vet {
  background: #0B2440;
  padding: 0.625rem 1.125rem;
  display: flex; align-items: center; gap: 0.5rem;
}
.bfv-brand {
  font-family: var(--font-display);
  font-size: 0.875rem; font-weight: 800; color: #fff;
  flex: 1;
}
.bfv-web { font-size: 0.6rem; color: rgba(255,255,255,0.45); }
.bfv-paw { font-size: 0.875rem; }

/* Flip hint */
.flip-hint {
  position: absolute;
  bottom: 50px; left: 50%;
  transform: translateX(-50%);
  font-size: 0.55rem;
  color: rgba(255,255,255,0.3);
  white-space: nowrap;
  pointer-events: none;
  z-index: 5;
}
.flip-hint--dark { color: rgba(44,62,80,0.3); }
</style>
