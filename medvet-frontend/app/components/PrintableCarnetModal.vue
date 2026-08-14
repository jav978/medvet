<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-dialog print-dialog">

      <!-- Modal Toolbar (Hidden during print) -->
      <div class="dialog-toolbar no-print">
        <div class="toolbar-title-box">
          <span class="toolbar-icon">🖨️</span>
          <div>
            <h3 class="toolbar-title">Carnet Imprimible A4 - Formato Credencial Plegable</h3>
            <p class="toolbar-sub">Anverso y Reverso en una sola hoja con guías de corte y doblado</p>
          </div>
        </div>

        <div class="toolbar-actions">
          <button type="button" @click="handlePrint" class="btn-primary print-trigger-btn">
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
            </svg>
            <span>Imprimir / Guardar en PDF</span>
          </button>
          <button type="button" @click="$emit('close')" class="btn-ghost btn-icon" aria-label="Cerrar">
            ✕
          </button>
        </div>
      </div>

      <!-- Printable A4 Sheet Area -->
      <div class="printable-sheet-wrapper">
        <div id="printable-carnet-sheet" class="a4-sheet">

          <!-- Clinic Official Letterhead -->
          <div class="sheet-letterhead">
            <div class="letterhead-logo-group">
              <div class="letterhead-icon">
                <svg viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" fill="currentColor"/></svg>
              </div>
              <div>
                <h1 class="clinic-brand-name">MEDVET <span>HOSPITAL & CLÍNICA VETERINARIA</span></h1>
                <p class="clinic-legal">Registro Sanitario Provincial Nº 48-1902 · CUIT 30-71829012-4</p>
                <p class="clinic-addr">Av. Libertador 4580, Buenos Aires · Guardia 24 Horas: +54 11 1234-5678 · medvet.com</p>
              </div>
            </div>
            <div class="letterhead-badge">
              <span class="doc-code">PASAPORTE SANITARIO ANIMAL</span>
              <span class="doc-id">DOC-{{ String(pet.id || '10492').padStart(6, '0') }}</span>
            </div>
          </div>

          <!-- Cutting & Folding Guide Notice -->
          <div class="print-guide-notice">
            <span class="guide-badge">✂️ GUÍA DE IMPRESIÓN Y ARMADO</span>
            <span>1. Imprimir a escala 100% (A4 o Carta) · 2. Recortar por la línea punteada exterior (✂️) · 3. Doblar por la línea central (📂) y pegar ambas caras o plastificar.</span>
          </div>

          <!-- The Foldable Card Area (Anverso + Reverso side by side) -->
          <div class="foldable-card-outer">

            <!-- Card Front (Anverso) -->
            <div class="fold-card fold-card--front">
              <div class="card-inner-header">
                <div class="card-inner-brand">
                  <span class="c-brand-logo">🐾</span>
                  <span class="c-brand-txt">Med<span>Vet</span> · Carnet Oficial</span>
                </div>
                <span class="c-species-badge">{{ speciesEmoji }}</span>
              </div>

              <div class="card-main-body">
                <div class="card-photo-box">
                  <img v-if="pet.photo" :src="pet.photo" :alt="pet.name" class="pet-img" />
                  <span v-else class="pet-placeholder">{{ speciesEmoji }}</span>
                </div>

                <div class="card-identity-box">
                  <h2 class="c-pet-name">{{ pet.name }}</h2>
                  <div class="c-pet-breed">{{ pet.species }} · {{ pet.breed || 'Mestizo' }}</div>
                  <div class="c-data-row">
                    <span><strong>Edad:</strong> {{ pet.age || 4 }} años</span>
                    <span><strong>Peso:</strong> {{ pet.weight || 28.5 }} kg</span>
                    <span><strong>Sexo:</strong> {{ pet.sex === 'H' ? 'Hembra' : 'Macho' }}</span>
                  </div>
                  <div class="c-chip-badge">
                    <span>MICROCHIP ISO:</span>
                    <strong>{{ pet.chip || 'AR-98214-998' }}</strong>
                  </div>
                </div>
              </div>

              <div class="card-tutor-footer">
                <div>
                  <span class="lbl-mini">TUTOR RESPONSABLE</span>
                  <div class="val-mini">{{ pet.ownerName || 'Juan Pérez' }}</div>
                </div>
                <div class="text-right">
                  <span class="lbl-mini">EMISIÓN</span>
                  <div class="val-mini">{{ currentDate }}</div>
                </div>
              </div>
            </div>

            <!-- Folding Divider line -->
            <div class="fold-divider-line">
              <span class="fold-label">📂 DOBLAR POR AQUÍ (LÍNEA CENTRAL)</span>
            </div>

            <!-- Card Back (Reverso) -->
            <div class="fold-card fold-card--back">
              <div class="card-inner-header card-inner-header--back">
                <span class="c-brand-txt">Esquema Inmunológico & Validación</span>
                <span class="lbl-mini-white">REGISTRO OFICIAL</span>
              </div>

              <div class="card-back-grid">
                <!-- QR & Barcode -->
                <div class="back-qr-col">
                  <div class="qr-print-box">
                    <svg class="w-16 h-16" viewBox="0 0 60 60" fill="none">
                      <rect x="2" y="2" width="16" height="16" rx="2" fill="#0d1f18" />
                      <rect x="4" y="4" width="12" height="12" rx="1" fill="white" />
                      <rect x="6" y="6" width="8" height="8" fill="#0d1f18" />
                      <rect x="42" y="2" width="16" height="16" rx="2" fill="#0d1f18" />
                      <rect x="44" y="4" width="12" height="12" rx="1" fill="white" />
                      <rect x="46" y="6" width="8" height="8" fill="#0d1f18" />
                      <rect x="2" y="42" width="16" height="16" rx="2" fill="#0d1f18" />
                      <rect x="4" y="44" width="12" height="12" rx="1" fill="white" />
                      <rect x="6" y="46" width="8" height="8" fill="#0d1f18" />
                      <g fill="#0d1f18">
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
                  <span class="qr-caption">Escanear para verificar validez</span>
                </div>

                <!-- Essential Vaccines list -->
                <div class="back-vac-col">
                  <div class="vac-micro-item">
                    <span class="v-dot">✓</span>
                    <div>
                      <strong>Antirrábica Obligatoria:</strong>
                      <span>Aplicada: 15/03/2026 · Vence: 15/03/2027</span>
                    </div>
                  </div>
                  <div class="vac-micro-item">
                    <span class="v-dot">✓</span>
                    <div>
                      <strong>Séxtuple Canina / Triple Felina:</strong>
                      <span>Aplicada: 10/04/2026 · Vence: 10/04/2027</span>
                    </div>
                  </div>
                  <div class="vac-micro-item">
                    <span class="v-dot">✓</span>
                    <div>
                      <strong>Desparasitación Interna/Externa:</strong>
                      <span>Al día · Nexgard Spectra / Bravecto</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Signature and Clinic Seal -->
              <div class="card-seal-footer">
                <div class="seal-box">
                  <div class="seal-circle">
                    <span>MEDVET</span>
                    <small>CLINICAL</small>
                  </div>
                </div>
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <span class="doc-name">Dr. Mateo Silva</span>
                  <span class="doc-mp">Médico Veterinario · MP 4821</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Sheet Footer with emergency disclaimer -->
          <div class="sheet-footer-disclaimer">
            <p><strong>Nota Legal:</strong> Este documento acredita el estado sanitario del paciente en los términos del Código Sanitario y la Ley de Bienestar Animal. En caso de extravío o emergencia comunicarse las 24hs al <strong>+54 11 1234-5678</strong>.</p>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: { type: Boolean, default: false },
  pet: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

defineEmits(['close'])

const speciesEmoji = computed(() => {
  const map = { Perro: '🐶', Gato: '🐱', Ave: '🦜', Conejo: '🐰', Exótico: '🐍' }
  return map[props.pet?.species] || '🐾'
})

const currentDate = computed(() => {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
})

const handlePrint = () => {
  if (typeof window !== 'undefined') {
    window.print()
  }
}
</script>

<style scoped>
/* Modal Backdrop */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 7, 6, 0.75);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overflow-y: auto;
}

.modal-dialog {
  background: #f4f7f5;
  border-radius: 20px;
  width: 100%;
  max-width: 960px;
  max-height: 94vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 80px -15px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.dark .modal-dialog {
  background: #0a110e;
}

/* Dialog Toolbar */
.dialog-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.75rem;
  background: #ffffff;
  border-bottom: 1px solid #e2ebe5;
}

.dark .dialog-toolbar {
  background: #0d1a14;
  border-color: rgba(0, 245, 155, 0.2);
}

.toolbar-title-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toolbar-icon { font-size: 1.75rem; }

.toolbar-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
}

.dark .toolbar-title { color: #f1faf5; }

.toolbar-sub {
  font-size: 0.8125rem;
  color: var(--color-ink-500);
  margin: 0;
}

.dark .toolbar-sub { color: #8ca395; }

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.print-trigger-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  font-size: 0.875rem;
}

.btn-icon {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
}

/* Printable Sheet Wrapper */
.printable-sheet-wrapper {
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  background: #e5ece8;
}

.dark .printable-sheet-wrapper {
  background: #040806;
}

/* A4 Sheet Container */
.a4-sheet {
  background: #ffffff;
  color: #0d1f18;
  width: 100%;
  max-width: 820px;
  min-height: 580px;
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  font-family: var(--font-body);
}

/* Letterhead */
.sheet-letterhead {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 1.25rem;
  border-bottom: 2px solid #00a86b;
  margin-bottom: 1.25rem;
}

.letterhead-logo-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.letterhead-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  background: rgba(0, 168, 107, 0.12);
  border: 1.5px solid #00a86b;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00a86b;
}

.letterhead-icon svg { width: 1.75rem; height: 1.75rem; fill: currentColor; }

.clinic-brand-name {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 900;
  color: #0d1f18;
  margin: 0;
  letter-spacing: -0.02em;
}

.clinic-brand-name span {
  font-size: 0.85rem;
  font-weight: 700;
  color: #00a86b;
  margin-left: 0.35rem;
}

.clinic-legal {
  font-size: 0.725rem;
  color: #4a6858;
  margin: 0.15rem 0 0;
}

.clinic-addr {
  font-size: 0.6875rem;
  color: #628070;
  margin: 0.1rem 0 0;
}

.letterhead-badge {
  text-align: right;
}

.doc-code {
  display: block;
  font-size: 0.65rem;
  font-weight: 800;
  color: #00a86b;
  letter-spacing: 0.08em;
}

.doc-id {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 800;
  color: #0d1f18;
}

/* Guide Notice */
.print-guide-notice {
  background: #f0f7f3;
  border: 1px dashed #00a86b;
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  font-size: 0.725rem;
  color: #2d4a3b;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  line-height: 1.4;
}

.guide-badge {
  font-weight: 800;
  color: #007a4d;
  white-space: nowrap;
}

/* Foldable Card Outer Box with Cut Borders */
.foldable-card-outer {
  border: 2px dashed #94a3b8;
  border-radius: 12px;
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr 20px 1fr;
  gap: 0;
  align-items: stretch;
  background: #fafcfb;
  position: relative;
}

/* Cut Badge on Card Outline */
.foldable-card-outer::before {
  content: '✂️ CORTAR POR AQUÍ';
  position: absolute;
  top: -10px;
  left: 20px;
  background: #ffffff;
  padding: 0 8px;
  font-size: 0.625rem;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 0.05em;
}

/* Folding Line */
.fold-divider-line {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.fold-divider-line::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: repeating-linear-gradient(to bottom, #00a86b, #00a86b 6px, transparent 6px, transparent 12px);
}

.fold-label {
  writing-mode: vertical-lr;
  font-size: 0.55rem;
  font-weight: 800;
  color: #007a4d;
  background: #ffffff;
  padding: 8px 2px;
  z-index: 2;
  letter-spacing: 0.08em;
  transform: rotate(180deg);
}

/* The Individual Card (Front & Back) */
.fold-card {
  background: #ffffff;
  border: 1.5px solid #00a86b;
  border-radius: 14px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 260px;
  box-shadow: 0 2px 8px rgba(0, 80, 50, 0.06);
}

/* Front Card */
.card-inner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2ebe5;
}

.card-inner-brand {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.c-brand-logo { font-size: 1rem; }

.c-brand-txt {
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 800;
  color: #0d1f18;
}

.c-brand-txt span { color: #00a86b; }

.c-species-badge { font-size: 1.25rem; }

.card-main-body {
  display: flex;
  gap: 0.85rem;
  align-items: center;
  padding: 0.6rem 0;
}

.card-photo-box {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: #f0f7f3;
  border: 2px solid #00a86b;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.pet-img { width: 100%; height: 100%; object-fit: cover; }
.pet-placeholder { font-size: 1.8rem; }

.c-pet-name {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 800;
  color: #0d1f18;
  margin: 0;
  line-height: 1.1;
}

.c-pet-breed {
  font-size: 0.725rem;
  color: #4a6858;
  margin-bottom: 0.3rem;
}

.c-data-row {
  display: flex;
  gap: 0.6rem;
  font-size: 0.65rem;
  color: #2d4a3b;
  margin-bottom: 0.35rem;
}

.c-chip-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.625rem;
  background: rgba(0, 168, 107, 0.1);
  padding: 0.2rem 0.45rem;
  border-radius: 6px;
  color: #007a4d;
}

.card-tutor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 1px solid #e2ebe5;
}

.lbl-mini {
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #628070;
  display: block;
}

.val-mini {
  font-size: 0.75rem;
  font-weight: 700;
  color: #0d1f18;
}

/* Back Card */
.card-inner-header--back {
  background: #0d3826;
  color: #ffffff;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  margin: -0.4rem -0.4rem 0.5rem;
}

.card-inner-header--back .c-brand-txt { color: #ffffff; font-size: 0.75rem; }
.lbl-mini-white { font-size: 0.55rem; font-weight: 800; color: #00f59b; }

.card-back-grid {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 0.75rem;
  align-items: center;
}

.back-qr-col {
  text-align: center;
}

.qr-print-box {
  width: 72px;
  height: 72px;
  background: #ffffff;
  border: 1.5px solid #00a86b;
  border-radius: 8px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.qr-caption {
  font-size: 0.5rem;
  color: #628070;
  display: block;
  margin-top: 0.2rem;
  line-height: 1.1;
}

.back-vac-col {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.vac-micro-item {
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
  font-size: 0.625rem;
  line-height: 1.25;
}

.v-dot {
  color: #00a86b;
  font-weight: 900;
  font-size: 0.75rem;
}

.vac-micro-item strong {
  display: block;
  color: #0d1f18;
}

.vac-micro-item span {
  color: #4a6858;
  font-size: 0.575rem;
}

.card-seal-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 0.5rem;
  border-top: 1px solid #e2ebe5;
}

.seal-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px dashed #00a86b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #007a4d;
  font-size: 0.5rem;
  font-weight: 900;
  transform: rotate(-10deg);
}

.seal-circle small { font-size: 0.4rem; font-weight: 700; }

.signature-box {
  text-align: right;
}

.signature-line {
  width: 90px;
  height: 1px;
  background: #2d4a3b;
  margin: 0 0 0.15rem auto;
}

.doc-name {
  display: block;
  font-size: 0.65rem;
  font-weight: 800;
  color: #0d1f18;
}

.doc-mp {
  font-size: 0.55rem;
  color: #628070;
}

.sheet-footer-disclaimer {
  margin-top: 1.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2ebe5;
  font-size: 0.65rem;
  color: #628070;
  line-height: 1.4;
}

/* ────────────────────────────────────────
   PRINT STYLES (@media print)
──────────────────────────────────────── */
@media print {
  /* Hide everything on page except modal sheet */
  body * {
    visibility: hidden;
  }

  .modal-backdrop,
  #printable-carnet-sheet,
  #printable-carnet-sheet * {
    visibility: visible;
  }

  .modal-backdrop {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: auto;
    background: transparent !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .no-print {
    display: none !important;
  }

  .modal-dialog {
    box-shadow: none !important;
    max-width: 100% !important;
    border-radius: 0 !important;
    background: transparent !important;
  }

  .printable-sheet-wrapper {
    background: transparent !important;
    padding: 0 !important;
  }

  .a4-sheet {
    box-shadow: none !important;
    padding: 0 !important;
    max-width: 100% !important;
    width: 100% !important;
  }
}
</style>
