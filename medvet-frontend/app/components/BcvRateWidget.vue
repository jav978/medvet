<script setup lang="ts">
const {
  activeCurrency,
  bcvRate,
  bcvLastUpdated,
  bcvLoading,
  bcvError,
  fetchBcvRate,
  setCurrency,
  formatBcvRate,
  convertUsdToVes,
  convertVesToUsd
} = useCurrency()

const dropdownOpen = ref(false)
const calcUsd = ref<number>(20)
const calcVes = ref<number>(20 * bcvRate.value)

// Sync calculator
watch(calcUsd, (newVal) => {
  calcVes.value = Number(((newVal || 0) * bcvRate.value).toFixed(2))
})

watch(bcvRate, (newRate) => {
  calcVes.value = Number(((calcUsd.value || 0) * newRate).toFixed(2))
})

const onVesChange = (val: number) => {
  if (bcvRate.value > 0) {
    calcUsd.value = Number(((val || 0) / bcvRate.value).toFixed(2))
  }
}

// Close on outside click
const widgetRef = ref<HTMLElement | null>(null)
onMounted(() => {
  const handleOutside = (e: MouseEvent) => {
    if (widgetRef.value && !widgetRef.value.contains(e.target as Node)) {
      dropdownOpen.value = false
    }
  }
  window.addEventListener('click', handleOutside)
  onUnmounted(() => window.removeEventListener('click', handleOutside))
})

const formattedDate = computed(() => {
  if (!bcvLastUpdated.value) return 'Hoy'
  try {
    const d = new Date(bcvLastUpdated.value)
    return d.toLocaleDateString('es-VE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return 'Actualizada hoy'
  }
})
</script>

<template>
  <div class="bcv-widget-root" ref="widgetRef">
    <!-- Trigger Button Group -->
    <div class="bcv-bar">
      <!-- Currency Switcher Toggle -->
      <div class="currency-segmented-control" title="Seleccionar moneda principal">
        <button
          type="button"
          :class="['curr-btn', { active: activeCurrency === 'USD' }]"
          @click.stop="setCurrency('USD')"
        >
          $ USD
        </button>
        <button
          type="button"
          :class="['curr-btn', { active: activeCurrency === 'VES' }]"
          @click.stop="setCurrency('VES')"
        >
          Bs. VES
        </button>
      </div>

      <!-- BCV Rate Pill Trigger -->
      <button
        type="button"
        class="bcv-pill-btn"
        :class="{ 'is-open': dropdownOpen }"
        @click="dropdownOpen = !dropdownOpen"
        title="Ver detalles de la Tasa Oficial BCV y Calculadora"
      >
        <span class="live-dot" :class="{ 'pulse-anim': !bcvLoading }"></span>
        <span class="bcv-title-tag">BCV:</span>
        <span class="bcv-val-text font-mono-numbers">{{ formatBcvRate() }}</span>
        <svg class="bcv-chevron" :class="{ 'rotate-180': dropdownOpen }" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </button>
    </div>

    <!-- Dropdown / Popover -->
    <Transition name="dropdown-pop">
      <div v-if="dropdownOpen" class="bcv-dropdown-card">
        <!-- Header -->
        <div class="bcv-card-header">
          <div class="bcv-brand">
            <div class="bcv-flag-emblem">🇻🇪</div>
            <div>
              <h4 class="bcv-header-title">Tasa Oficial BCV</h4>
              <p class="bcv-header-sub">Banco Central de Venezuela</p>
            </div>
          </div>
          <button
            type="button"
            class="bcv-refresh-btn"
            :disabled="bcvLoading"
            @click="fetchBcvRate(true)"
            title="Refrescar tasa oficial en tiempo real"
          >
            <svg class="w-4 h-4" :class="{ 'spin-anim': bcvLoading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{{ bcvLoading ? 'Actualizando...' : 'Actualizar' }}</span>
          </button>
        </div>

        <!-- Main Rate Display -->
        <div class="bcv-rate-display">
          <span class="rate-equation font-mono-numbers">1 USD = {{ formatBcvRate() }}</span>
          <div class="rate-meta-row">
            <span class="rate-status-badge">
              <span class="badge-dot"></span> Tasa Vigente
            </span>
            <span class="rate-date">📅 {{ formattedDate }}</span>
          </div>
        </div>

        <!-- Currency Selector Mode in Popover -->
        <div class="bcv-mode-section">
          <label class="mode-label">Visualizar aranceles y servicios en:</label>
          <div class="mode-buttons-grid">
            <button
              type="button"
              class="mode-choice-btn"
              :class="{ selected: activeCurrency === 'USD' }"
              @click="setCurrency('USD')"
            >
              <span class="mode-icon">💵</span>
              <div class="mode-info">
                <strong>Dólares ($ USD)</strong>
                <small>Moneda de referencia</small>
              </div>
            </button>
            <button
              type="button"
              class="mode-choice-btn"
              :class="{ selected: activeCurrency === 'VES' }"
              @click="setCurrency('VES')"
            >
              <span class="mode-icon">🇻🇪</span>
              <div class="mode-info">
                <strong>Bolívares (Bs. VES)</strong>
                <small>Tasa oficial BCV</small>
              </div>
            </button>
          </div>
        </div>

        <!-- Mini Converter -->
        <div class="bcv-calculator">
          <div class="calc-header">
            <span class="calc-title">🧮 Conversor Rápido USD ⇄ VES</span>
          </div>
          <div class="calc-grid">
            <div class="calc-field">
              <label>Monto USD ($)</label>
              <div class="calc-input-wrap">
                <span class="calc-prefix">$</span>
                <input
                  type="number"
                  v-model.number="calcUsd"
                  min="0"
                  step="1"
                  placeholder="0.00"
                  class="calc-input font-mono-numbers"
                />
              </div>
            </div>
            <div class="calc-equals">⇄</div>
            <div class="calc-field">
              <label>Equivalente BCV (Bs.)</label>
              <div class="calc-input-wrap">
                <span class="calc-prefix">Bs.</span>
                <input
                  type="number"
                  :value="calcVes"
                  @input="onVesChange(Number(($event.target as HTMLInputElement).value))"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  class="calc-input font-mono-numbers"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Notice -->
        <div class="bcv-card-footer">
          <svg class="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span>Conforme a la normativa del Banco Central de Venezuela para pagos y facturación.</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.bcv-widget-root {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.bcv-bar {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0.65rem;
}

.dark .bcv-bar {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

/* Currency Segmented Control */
.currency-segmented-control {
  display: inline-flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 0.45rem;
  padding: 2px;
}

.dark .currency-segmented-control {
  background: rgba(0, 0, 0, 0.3);
}

.curr-btn {
  padding: 0.2rem 0.45rem;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 0.35rem;
  color: var(--color-ink-600);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dark .curr-btn {
  color: rgba(255, 255, 255, 0.6);
}

.curr-btn.active {
  background: #ffffff;
  color: #059669;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark .curr-btn.active {
  background: #00f59b;
  color: #032014;
  font-weight: 800;
  box-shadow: 0 0 10px rgba(0, 245, 155, 0.3);
}

/* BCV Rate Pill */
.bcv-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.22rem 0.55rem;
  font-size: 0.725rem;
  border-radius: 0.45rem;
  background: rgba(0, 168, 107, 0.08);
  border: 1px solid rgba(0, 168, 107, 0.22);
  color: #059669;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark .bcv-pill-btn {
  background: rgba(0, 245, 155, 0.08);
  border-color: rgba(0, 245, 155, 0.25);
  color: #00f59b;
}

.bcv-pill-btn:hover,
.bcv-pill-btn.is-open {
  background: rgba(0, 168, 107, 0.15);
  border-color: #059669;
}

.dark .bcv-pill-btn:hover,
.dark .bcv-pill-btn.is-open {
  background: rgba(0, 245, 155, 0.16);
  border-color: #00f59b;
  box-shadow: 0 0 10px rgba(0, 245, 155, 0.2);
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  display: inline-block;
}

.dark .live-dot {
  background: #00f59b;
  box-shadow: 0 0 6px #00f59b;
}

.pulse-anim {
  animation: pulse-dot 2s infinite ease-in-out;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.bcv-title-tag {
  font-weight: 700;
  letter-spacing: 0.02em;
}

.bcv-val-text {
  font-weight: 700;
}

.bcv-chevron {
  width: 12px;
  height: 12px;
  transition: transform 0.2s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* Dropdown Card */
.bcv-dropdown-card {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 330px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  box-shadow: 0 12px 30px -4px rgba(0, 0, 0, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.08);
  padding: 1.1rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.dark .bcv-dropdown-card {
  background: #0b1c15;
  border-color: rgba(0, 245, 155, 0.25);
  box-shadow: 0 12px 36px -4px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 245, 155, 0.1);
}

.bcv-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bcv-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bcv-flag-emblem {
  font-size: 1.3rem;
  line-height: 1;
}

.bcv-header-title {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--color-ink-900);
}

.dark .bcv-header-title {
  color: #f1f5f9;
}

.bcv-header-sub {
  margin: 0;
  font-size: 0.675rem;
  color: var(--color-ink-500);
}

.dark .bcv-header-sub {
  color: rgba(223, 240, 238, 0.6);
}

.bcv-refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.55rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: #059669;
  background: rgba(0, 168, 107, 0.08);
  border: 1px solid rgba(0, 168, 107, 0.2);
  border-radius: 0.4rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dark .bcv-refresh-btn {
  color: #00f59b;
  background: rgba(0, 245, 155, 0.08);
  border-color: rgba(0, 245, 155, 0.25);
}

.bcv-refresh-btn:hover:not(:disabled) {
  background: rgba(0, 168, 107, 0.16);
}

.dark .bcv-refresh-btn:hover:not(:disabled) {
  background: rgba(0, 245, 155, 0.16);
}

.spin-anim {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Rate Display */
.bcv-rate-display {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.dark .bcv-rate-display {
  background: rgba(16, 28, 22, 0.85);
  border: 1px solid rgba(0, 245, 155, 0.2);
}

.rate-equation {
  font-size: 1.15rem;
  font-weight: 900;
  color: #047857;
}

.dark .rate-equation {
  color: #00f59b;
}

.rate-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 0.675rem;
  color: var(--color-ink-500);
}

.dark .rate-meta-row {
  color: #94a3b8;
}

.rate-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #059669;
  font-weight: 700;
}

.dark .rate-status-badge {
  color: #00f59b;
}

.badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

/* Mode Selection Section */
.bcv-mode-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.mode-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-ink-700);
}

.dark .mode-label {
  color: #cbd5e1;
}

.mode-buttons-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.mode-choice-btn {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem;
  border-radius: 0.6rem;
  background: #f1f5f9;
  border: 1.5px solid #e2e8f0;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dark .mode-choice-btn {
  background: rgba(16, 28, 22, 0.7);
  border-color: rgba(0, 245, 155, 0.15);
}

.mode-choice-btn strong {
  display: block;
  font-size: 0.725rem;
  color: var(--color-ink-800);
}

.dark .mode-choice-btn strong {
  color: #f8fafc;
}

.mode-choice-btn small {
  display: block;
  font-size: 0.625rem;
  color: var(--color-ink-500);
}

.dark .mode-choice-btn small {
  color: #94a3b8;
}

.mode-choice-btn.selected {
  background: #ecfdf5;
  border-color: #059669;
}

.dark .mode-choice-btn.selected {
  background: rgba(0, 245, 155, 0.12);
  border-color: #00f59b;
}

.mode-icon {
  font-size: 1.1rem;
}

/* Calculator */
.bcv-calculator {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.65rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.dark .bcv-calculator {
  background: rgba(16, 28, 22, 0.7);
  border-color: rgba(0, 245, 155, 0.18);
}

.calc-title {
  font-size: 0.675rem;
  font-weight: 700;
  color: var(--color-ink-700);
}

.dark .calc-title {
  color: #cbd5e1;
}

.calc-grid {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.calc-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.calc-field label {
  font-size: 0.6rem;
  color: var(--color-ink-500);
  font-weight: 600;
}

.dark .calc-field label {
  color: #94a3b8;
}

.calc-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.calc-prefix {
  position: absolute;
  left: 0.45rem;
  font-size: 0.675rem;
  font-weight: 700;
  color: var(--color-ink-400);
  pointer-events: none;
}

.calc-input {
  width: 100%;
  padding: 0.3rem 0.4rem 0.3rem 1.6rem;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid #cbd5e1;
  border-radius: 0.4rem;
  background: #ffffff;
  color: var(--color-ink-900);
}

.dark .calc-input {
  background: rgba(10, 17, 14, 0.9);
  border-color: rgba(0, 245, 155, 0.22);
  color: #f1faf5;
}

.calc-equals {
  font-size: 0.85rem;
  color: var(--color-ink-400);
  padding-top: 0.8rem;
}

.bcv-card-footer {
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
  font-size: 0.625rem;
  color: var(--color-ink-500);
  line-height: 1.3;
}

.dark .bcv-card-footer {
  color: #94a3b8;
}

/* Animations */
.dropdown-pop-enter-active,
.dropdown-pop-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-pop-enter-from,
.dropdown-pop-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

@media (max-width: 640px) {
  .bcv-title-tag { display: none; }
  .bcv-chevron { display: none; }
  .bcv-pill-btn {
    padding: 0.2rem 0.4rem;
    font-size: 0.6875rem;
    gap: 0.25rem;
  }
  .curr-btn {
    padding: 0.18rem 0.35rem;
    font-size: 0.65rem;
  }
  .bcv-dropdown-card {
    position: fixed;
    top: 60px;
    right: 12px;
    left: 12px;
    width: auto;
  }
}
</style>
