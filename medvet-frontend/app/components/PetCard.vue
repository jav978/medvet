<template>
  <div class="petcard-scene" @click="flipped = !flipped" :title="flipped ? 'Ver frente' : 'Ver reverso'">
    <div :class="['petcard-flipper', flipped ? 'petcard-flipper--flipped' : '']">

      <!-- ────── FRENTE ────── -->
      <div class="petcard-face petcard-front">
        <!-- Paw watermarks decorativos -->
        <div class="paw-deco paw-deco--tl" aria-hidden="true">🐾</div>
        <div class="paw-deco paw-deco--br" aria-hidden="true">🐾</div>

        <!-- Header strip: logo + marca -->
        <div class="card-header">
          <div class="card-logo">
            <MedVetIcon />
          </div>
          <div>
            <div class="card-brand">Med<span>Vet</span></div>
            <div class="card-brand-sub">Historia Clínica Digital</div>
          </div>
          <div class="card-species-badge">{{ speciesEmoji }}</div>
        </div>

        <!-- Foto de la mascota -->
        <div class="card-photo-wrap">
          <div class="card-photo">
            <img v-if="pet.photo" :src="pet.photo" :alt="pet.name" />
            <span v-else class="card-photo-placeholder">{{ speciesEmoji }}</span>
          </div>
          <div class="card-photo-ring"></div>
        </div>

        <!-- Info principal -->
        <div class="card-name-block">
          <h2 class="card-name">{{ pet.name }}</h2>
          <div class="card-species">{{ pet.species }}{{ pet.breed ? ` · ${pet.breed}` : '' }}</div>
        </div>

        <!-- Stats row -->
        <div class="card-stats">
          <div class="card-stat" v-if="pet.age">
            <span class="stat-icon">🎂</span>
            <span class="stat-val font-mono-numbers">{{ pet.age }}</span>
            <span class="stat-lbl">años</span>
          </div>
          <div class="card-stat-div" v-if="pet.age && pet.weight"></div>
          <div class="card-stat" v-if="pet.weight">
            <span class="stat-icon">⚖️</span>
            <span class="stat-val font-mono-numbers">{{ pet.weight }}</span>
            <span class="stat-lbl">kg</span>
          </div>
          <div class="card-stat-div" v-if="(pet.age || pet.weight) && pet.sex"></div>
          <div class="card-stat" v-if="pet.sex">
            <span class="stat-icon">{{ pet.sex === 'M' ? '♂' : '♀' }}</span>
            <span class="stat-lbl">{{ pet.sex === 'M' ? 'Macho' : 'Hembra' }}</span>
          </div>
        </div>

        <!-- Vacunas / chips estado -->
        <div class="card-chips" v-if="pet.vaccines?.length">
          <span
            v-for="vac in pet.vaccines.slice(0,3)"
            :key="vac"
            class="vac-chip"
          >✓ {{ vac }}</span>
          <span v-if="pet.vaccines.length > 3" class="vac-chip vac-chip--more">
            +{{ pet.vaccines.length - 3 }}
          </span>
        </div>

        <!-- Footer: N° paciente + dueño -->
        <div class="card-footer">
          <div class="card-owner">
            <span class="footer-label">Responsable</span>
            <span class="footer-val">{{ pet.ownerName || '—' }}</span>
          </div>
          <div class="card-id-block">
            <div class="card-id-num font-mono-numbers">Nº {{ String(pet.id || '000000').padStart(6, '0') }}</div>
            <div class="card-barcode" aria-hidden="true">
              <svg viewBox="0 0 120 28" class="barcode-svg">
                <g v-for="(bar, i) in barcodeBars" :key="i">
                  <rect :x="i * 4" y="0" :width="bar" height="20" fill="currentColor"/>
                </g>
              </svg>
            </div>
          </div>
        </div>

        <!-- Flip hint -->
        <div class="flip-hint">Toca para ver el reverso ↺</div>
      </div>

      <!-- ────── REVERSO ────── -->
      <div class="petcard-face petcard-back">
        <!-- Header -->
        <div class="back-header">
          <div class="card-logo card-logo--sm">
            <MedVetIcon />
          </div>
          <span class="back-header-title">Historia Clínica Digital</span>
          <span class="back-paw">🐾</span>
        </div>

        <!-- QR area -->
        <div class="qr-section">
          <div class="qr-box">
            <!-- QR SVG inline pattern -->
            <svg class="qr-svg" viewBox="0 0 60 60" fill="none">
              <rect x="2" y="2" width="16" height="16" rx="2" fill="currentColor" opacity="0.9"/>
              <rect x="4" y="4" width="12" height="12" rx="1" fill="white"/>
              <rect x="6" y="6" width="8" height="8" fill="currentColor" opacity="0.9"/>
              <rect x="42" y="2" width="16" height="16" rx="2" fill="currentColor" opacity="0.9"/>
              <rect x="44" y="4" width="12" height="12" rx="1" fill="white"/>
              <rect x="46" y="6" width="8" height="8" fill="currentColor" opacity="0.9"/>
              <rect x="2" y="42" width="16" height="16" rx="2" fill="currentColor" opacity="0.9"/>
              <rect x="4" y="44" width="12" height="12" rx="1" fill="white"/>
              <rect x="6" y="46" width="8" height="8" fill="currentColor" opacity="0.9"/>
              <g fill="currentColor" opacity="0.75">
                <rect x="22" y="2" width="4" height="4"/><rect x="28" y="2" width="4" height="4"/>
                <rect x="34" y="2" width="4" height="4"/><rect x="22" y="8" width="4" height="4"/>
                <rect x="30" y="8" width="4" height="4"/><rect x="36" y="8" width="4" height="4"/>
                <rect x="24" y="14" width="4" height="4"/><rect x="32" y="14" width="4" height="4"/>
                <rect x="2" y="22" width="4" height="4"/><rect x="8" y="22" width="4" height="4"/>
                <rect x="14" y="22" width="4" height="4"/><rect x="22" y="22" width="4" height="4"/>
                <rect x="28" y="22" width="4" height="4"/><rect x="36" y="22" width="4" height="4"/>
                <rect x="42" y="22" width="4" height="4"/><rect x="54" y="22" width="4" height="4"/>
                <rect x="2" y="28" width="4" height="4"/><rect x="10" y="28" width="4" height="4"/>
                <rect x="20" y="28" width="4" height="4"/><rect x="26" y="28" width="4" height="4"/>
                <rect x="34" y="28" width="4" height="4"/><rect x="44" y="28" width="4" height="4"/>
                <rect x="50" y="28" width="4" height="4"/><rect x="56" y="28" width="4" height="4"/>
                <rect x="4" y="34" width="4" height="4"/><rect x="12" y="34" width="4" height="4"/>
                <rect x="22" y="34" width="4" height="4"/><rect x="30" y="34" width="4" height="4"/>
                <rect x="38" y="34" width="4" height="4"/><rect x="48" y="34" width="4" height="4"/>
                <rect x="22" y="42" width="4" height="4"/><rect x="28" y="42" width="4" height="4"/>
                <rect x="36" y="42" width="4" height="4"/><rect x="42" y="42" width="4" height="4"/>
                <rect x="54" y="42" width="4" height="4"/><rect x="24" y="48" width="4" height="4"/>
                <rect x="32" y="48" width="4" height="4"/><rect x="40" y="48" width="4" height="4"/>
                <rect x="50" y="48" width="4" height="4"/><rect x="22" y="54" width="4" height="4"/>
                <rect x="30" y="54" width="4" height="4"/><rect x="38" y="54" width="4" height="4"/>
                <rect x="48" y="54" width="4" height="4"/><rect x="56" y="54" width="4" height="4"/>
              </g>
            </svg>
          </div>
          <p class="qr-label">Escanear para ver historial clínico y vacunas</p>
        </div>

        <!-- Info de contacto -->
        <div class="back-info">
          <div class="back-info-row">
            <span class="bi-label">Paciente</span>
            <span class="bi-val">{{ pet.name }} — Nº {{ String(pet.id || '000000').padStart(6, '0') }}</span>
          </div>
          <div class="back-info-row">
            <span class="bi-label">Especie</span>
            <span class="bi-val">{{ pet.species }}{{ pet.breed ? ` / ${pet.breed}` : '' }}</span>
          </div>
          <div class="back-info-row" v-if="pet.chip">
            <span class="bi-label">Microchip ISO 11784</span>
            <span class="bi-val font-mono-numbers">{{ pet.chip }}</span>
          </div>
          <div class="back-info-row" v-if="pet.ownerName">
            <span class="bi-label">Tutor Responsable</span>
            <span class="bi-val">{{ pet.ownerName }}</span>
          </div>
        </div>

        <!-- Footer con logo -->
        <div class="back-footer">
          <div>
            <div class="back-footer-brand">MedVet · Clínica Veterinaria</div>
            <div class="back-footer-web">medvet.com · urgencias 24/7</div>
          </div>
          <div class="back-footer-paws" aria-hidden="true">🐾🐾</div>
        </div>

        <!-- Flip hint -->
        <div class="flip-hint">← Ver frente ↺</div>
      </div>

    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  pet: {
    type: Object,
    required: true,
    default: () => ({
      id: null,
      name: 'Mascota',
      species: 'Perro',
      breed: '',
      age: null,
      weight: null,
      sex: null,
      photo: null,
      chip: null,
      ownerName: '',
      vaccines: []
    })
  }
})

const flipped = ref(false)

const speciesEmoji = computed(() => {
  const map = { Perro: '🐶', Gato: '🐱', Ave: '🦜', Conejo: '🐰', Exótico: '🐍' }
  return map[props.pet.species] || '🐾'
})

// Barcode generator based on pet ID
const barcodeBars = computed(() => {
  const seed = props.pet.id || 12345
  return Array.from({ length: 30 }, (_, i) => ((seed * (i + 3)) % 3 === 0 ? 3 : 2))
})
</script>

<style scoped>
/* ── Scene & 3D Flip ── */
.petcard-scene {
  width: 320px;
  max-width: 100%;
  height: 490px;
  perspective: 1000px;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
  margin: 0 auto;
}

.petcard-flipper {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
}

.petcard-flipper--flipped {
  transform: rotateY(180deg);
}

.petcard-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 22px;
  overflow: hidden;
  box-shadow:
    0 20px 60px -12px rgba(10, 35, 25, 0.3),
    0 8px 24px -8px rgba(10, 35, 25, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* ── FRONT ── */
.petcard-front {
  background: linear-gradient(145deg, #0d3826 0%, #154d36 50%, #1b6345 100%);
  display: flex;
  flex-direction: column;
  padding: 0;
  position: relative;
}

.dark .petcard-front {
  background: linear-gradient(145deg, #07150f 0%, #0d241a 50%, #112d21 100%);
  border-color: rgba(0, 245, 155, 0.25);
  box-shadow: 0 20px 60px -12px rgba(0, 0, 0, 0.7);
}

/* Decorative paw marks */
.paw-deco {
  position: absolute;
  font-size: 3.5rem;
  opacity: 0.08;
  pointer-events: none;
  z-index: 0;
}
.paw-deco--tl { top: -10px; left: -10px; transform: rotate(-20deg); }
.paw-deco--br { bottom: 45px; right: -10px; transform: rotate(30deg); }

/* Card header */
.card-header {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 1.1rem 1.25rem 0.75rem;
  position: relative;
  z-index: 1;
}

.card-logo {
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 10px;
  background: rgba(0, 245, 155, 0.2);
  border: 1px solid rgba(0, 245, 155, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00f59b;
  flex-shrink: 0;
}
.card-logo img,
.card-logo svg { width: 100%; height: 100%; object-fit: contain; }
.card-logo--sm { width: 1.6rem; height: 1.6rem; border-radius: 8px; padding: 1px; }
.card-logo--sm img,
.card-logo--sm svg { width: 100%; height: 100%; object-fit: contain; }

.card-brand {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}
.card-brand span { color: #00f59b; }

.card-brand-sub {
  font-size: 0.58rem;
  color: rgba(223, 240, 238, 0.65);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-top: 0.15rem;
}

.card-species-badge {
  margin-left: auto;
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

/* Photo */
.card-photo-wrap {
  display: flex;
  justify-content: center;
  padding: 0.4rem 0 0.2rem;
  position: relative;
  z-index: 1;
}

.card-photo {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 3px solid rgba(0, 245, 155, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.6rem;
  overflow: hidden;
  position: relative;
  z-index: 2;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
}

.card-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-photo-ring {
  position: absolute;
  width: 118px;
  height: 118px;
  border-radius: 50%;
  border: 1.5px dashed rgba(0, 245, 155, 0.3);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Name block */
.card-name-block {
  text-align: center;
  padding: 0.5rem 1rem 0;
  position: relative;
  z-index: 1;
}

.card-name {
  font-family: var(--font-display);
  font-size: 1.55rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.015em;
}

.card-species {
  font-size: 0.78rem;
  color: rgba(223, 240, 238, 0.8);
  margin-top: 0.25rem;
}

/* Stats */
.card-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.65rem;
  margin-top: 0.65rem;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
}

.card-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
}

.stat-icon { font-size: 0.875rem; }
.stat-val {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}
.stat-lbl {
  font-size: 0.6rem;
  color: rgba(223, 240, 238, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-stat-div {
  width: 1px;
  height: 28px;
  background: rgba(255, 255, 255, 0.15);
}

/* Vaccine chips */
.card-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  justify-content: center;
  padding: 0.625rem 1rem 0;
  position: relative;
  z-index: 1;
}

.vac-chip {
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(0, 245, 155, 0.15);
  color: #00f59b;
  border: 1px solid rgba(0, 245, 155, 0.3);
}

.vac-chip--more {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Footer */
.card-footer {
  margin-top: auto;
  background: rgba(4, 15, 10, 0.75);
  backdrop-filter: blur(10px);
  padding: 0.8rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
  z-index: 1;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-label {
  display: block;
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: rgba(223, 240, 238, 0.45);
}

.footer-val {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #ffffff;
}

.card-id-block { text-align: right; }

.card-id-num {
  font-size: 0.7rem;
  color: #00f59b;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.barcode-svg {
  width: 80px;
  height: 20px;
  color: rgba(223, 240, 238, 0.6);
}

/* ── BACK ── */
.petcard-back {
  transform: rotateY(180deg);
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.dark .petcard-back {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.25);
}

/* Back header */
.back-header {
  background: #0d3826;
  padding: 0.875rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.dark .back-header {
  background: #06110c;
}

.back-header-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #ffffff;
  flex: 1;
}

.back-paw { font-size: 1rem; }

/* QR section */
.qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.35rem 1rem 0.9rem;
  gap: 0.5rem;
  background: #f4f7f5;
  border-bottom: 1px solid #e2ebe5;
}

.dark .qr-section {
  background: #070e0b;
  border-bottom-color: rgba(0, 245, 155, 0.12);
}

.qr-box {
  width: 120px;
  height: 120px;
  background: #ffffff;
  border: 2px solid #00a86b;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 168, 107, 0.15);
}

.dark .qr-box {
  background: #ffffff;
  border-color: #00f59b;
  box-shadow: 0 0 20px rgba(0, 245, 155, 0.25);
}

.qr-svg {
  width: 100%;
  height: 100%;
  color: #0d1f18;
}

.qr-label {
  font-size: 0.675rem;
  color: #4a6858;
  text-align: center;
  max-width: 170px;
  line-height: 1.4;
  margin: 0;
}

.dark .qr-label {
  color: #cbd5e1;
}

/* Back info */
.back-info {
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
}

.back-info-row {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.bi-label {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #628070;
}

.dark .bi-label {
  color: #557563;
}

.bi-val {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #0d1f18;
}

.dark .bi-val {
  color: #f1faf5;
}

/* Back footer */
.back-footer {
  background: #0d3826;
  padding: 0.75rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dark .back-footer {
  background: #06110c;
}

.back-footer-brand {
  font-size: 0.75rem;
  font-weight: 700;
  color: #ffffff;
}

.back-footer-web {
  font-size: 0.6rem;
  color: rgba(223, 240, 238, 0.6);
  margin-top: 0.1rem;
}

.back-footer-paws { font-size: 1rem; }

/* Flip hint */
.flip-hint {
  position: absolute;
  bottom: 56px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.58rem;
  color: rgba(255, 255, 255, 0.45);
  white-space: nowrap;
  pointer-events: none;
  z-index: 5;
}

.petcard-back .flip-hint {
  bottom: 56px;
  color: rgba(74, 104, 88, 0.5);
}

.dark .petcard-back .flip-hint {
  color: rgba(140, 163, 149, 0.4);
}
</style>
