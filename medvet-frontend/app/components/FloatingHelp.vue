<template>
  <div class="floating-help-container no-print" ref="containerRef" @click.stop>

    <!-- Popover Menu -->
    <transition name="help-popover">
      <div v-if="isOpen" class="help-popover" @click.stop>

        <!-- Popover Header -->
        <div class="popover-header">
          <div class="header-avatar-group">
            <div class="vet-avatar">
              <span class="vet-emoji">👨‍⚕️</span>
              <span class="online-indicator"></span>
            </div>
            <div>
              <h4 class="popover-title">Guardia Médica MedVet</h4>
              <p class="popover-subtitle">
                <span class="pulse-dot"></span>
                Atención Veterinaria en línea 24/7
              </p>
            </div>
          </div>
          <button
            type="button"
            @click.stop="isOpen = false"
            class="close-btn"
            aria-label="Cerrar ventana de WhatsApp"
          >
            ✕
          </button>
        </div>

        <!-- Popover Body -->
        <div class="popover-body">
          <p class="popover-desc">
            ¿Tenés una urgencia o necesitás consultar con nuestro equipo médico? Seleccioná un canal directo o escribí tu mensaje:
          </p>

          <!-- Quick Actions Grid -->
          <div class="action-list">
            <!-- WhatsApp Emergencias -->
            <a
              :href="whatsappUrgentUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="help-action-card help-action-card--urgent"
            >
              <div class="action-icon-box action-icon-box--wa">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </div>
              <div class="action-info">
                <div class="action-title-row">
                  <span class="action-title">WhatsApp Urgencias 24h</span>
                  <span class="badge-urgent">Prioridad</span>
                </div>
                <p class="action-sub">Respuesta inmediata con veterinario de guardia</p>
              </div>
            </a>

            <!-- WhatsApp Consultas & Turnos -->
            <a
              :href="whatsappGeneralUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="help-action-card"
            >
              <div class="action-icon-box action-icon-box--chat">
                <span>💬</span>
              </div>
              <div class="action-info">
                <span class="action-title">Consultas & Turnos WhatsApp</span>
                <p class="action-sub">Vacunas, estudios clínicos y presupuestos</p>
              </div>
            </a>

            <!-- Llamada Telefónica Directa -->
            <a
              href="tel:+541112345678"
              class="help-action-card"
            >
              <div class="action-icon-box action-icon-box--phone">
                <span>📞</span>
              </div>
              <div class="action-info">
                <span class="action-title">Llamar a Central Médica</span>
                <p class="action-sub">+54 11 1234-5678 (Línea Directa)</p>
              </div>
            </a>

            <!-- Agendar en Línea -->
            <NuxtLink
              to="/book"
              class="help-action-card"
              @click="isOpen = false"
            >
              <div class="action-icon-box action-icon-box--book">
                <span>📅</span>
              </div>
              <div class="action-info">
                <span class="action-title">Agendar Turno Online</span>
                <p class="action-sub">Elegí fecha, horario y profesional al instante</p>
              </div>
            </NuxtLink>
          </div>

          <!-- Interactive Custom Message to WhatsApp -->
          <div class="custom-chat-box">
            <label class="custom-chat-label">💬 Escribí tu mensaje directo a WhatsApp:</label>
            
            <!-- Quick Chips -->
            <div class="quick-chips">
              <button
                type="button"
                v-for="chip in quickChips"
                :key="chip"
                @click="customMessage = chip"
                class="chip-btn"
              >
                {{ chip }}
              </button>
            </div>

            <div class="custom-input-row">
              <input
                v-model="customMessage"
                type="text"
                placeholder="Ej: Tengo una consulta sobre vacunas para mi perro..."
                class="custom-input"
                @keydown.enter="sendCustomWhatsApp"
              />
              <button
                type="button"
                @click="sendCustomWhatsApp"
                class="send-btn"
                title="Enviar por WhatsApp"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Popover Footer -->
        <div class="popover-footer">
          <span>🏥 Av. Libertador 4580, Buenos Aires · Guardia Activa 24/7/365</span>
        </div>
      </div>
    </transition>

    <!-- Floating Trigger Button -->
    <button
      type="button"
      @click.stop="toggleMenu"
      :class="['floating-trigger-btn', isOpen ? 'floating-trigger-btn--open' : '']"
      aria-label="Abrir Asistencia de Urgencias y WhatsApp"
      :title="isOpen ? 'Cerrar Asistencia' : 'Urgencias & WhatsApp 24/7'"
    >
      <span class="pulse-ring" v-if="!isOpen"></span>
      <div class="btn-inner-icon">
        <svg v-if="!isOpen" class="wa-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span v-else class="close-icon">✕</span>
      </div>

      <!-- Tooltip Label -->
      <span class="btn-label-tag" v-if="!isOpen">
        <span class="tag-pulse"></span>
        Urgencias & WhatsApp 24/7
      </span>
    </button>

  </div>
</template>

<script setup>
const isOpen = ref(false)
const containerRef = ref(null)
const customMessage = ref('')

const whatsappUrgentUrl = 'https://wa.me/5491112345678?text=Hola%20MedVet,%20necesito%20atenci%C3%B3n%20m%C3%A9dica%20urgente%20para%20mi%20mascota'
const whatsappGeneralUrl = 'https://wa.me/5491112345678?text=Hola%20MedVet,%20deseo%20consultar%20sobre%20servicios%20y%20turnos'

const quickChips = [
  '🚨 Urgencia con mi mascota',
  '📅 Turno para hoy',
  '💉 Consulta de vacunas',
  '🩺 Cirugías / Quirófano'
]

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const sendCustomWhatsApp = () => {
  const msg = customMessage.value.trim() || 'Hola MedVet, deseo realizar una consulta'
  const url = `https://wa.me/5491112345678?text=${encodeURIComponent(msg)}`
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  customMessage.value = ''
  isOpen.value = false
}

// Robust click-outside detection
const handleClickOutside = (e) => {
  if (!isOpen.value) return
  const path = e.composedPath ? e.composedPath() : []
  if (containerRef.value && !containerRef.value.contains(e.target) && !path.includes(containerRef.value)) {
    isOpen.value = false
  }
}

// Close on escape key
const handleKeydown = (e) => {
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
.floating-help-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 9999;
  font-family: var(--font-body);
}

/* Floating Trigger Button */
.floating-trigger-btn {
  position: relative;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background: #25d366;
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 28px -4px rgba(37, 211, 102, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.25);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease, box-shadow 0.2s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.floating-trigger-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 14px 34px -4px rgba(37, 211, 102, 0.7), 0 0 0 2px rgba(255, 255, 255, 0.4);
}

.floating-trigger-btn--open {
  background: #0d1f18;
  box-shadow: 0 10px 28px -4px rgba(0, 0, 0, 0.45);
}

:global(.dark) .floating-trigger-btn--open {
  background: #0a1711;
  border: 1px solid rgba(0, 245, 155, 0.35);
}

.pulse-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid #25d366;
  opacity: 0.8;
  animation: waPulse 2.2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
  pointer-events: none;
}

@keyframes waPulse {
  0% { transform: scale(0.95); opacity: 0.85; }
  60% { transform: scale(1.25); opacity: 0; }
  100% { transform: scale(1.25); opacity: 0; }
}

.btn-inner-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.wa-icon {
  width: 32px;
  height: 32px;
}

.close-icon {
  font-size: 1.4rem;
  font-weight: 700;
  color: #00f59b;
}

/* Floating Label Tag (Visible only on hover or dynamic focus) */
.btn-label-tag {
  position: absolute;
  right: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%) translateX(8px);
  background: #ffffff;
  color: #0d1f18;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 0.45rem;
  pointer-events: none;
  border: 1px solid #e2ebe5;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.22s;
}

.floating-trigger-btn:hover .btn-label-tag,
.floating-trigger-btn:focus-visible .btn-label-tag {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0);
}

:global(.dark) .btn-label-tag {
  background: #0b1c15;
  color: #00f59b;
  border-color: rgba(0, 245, 155, 0.35);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .btn-label-tag {
    display: none !important;
  }
}

.tag-pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #25d366;
  animation: tagPulse 1.5s infinite;
  flex-shrink: 0;
}

@keyframes tagPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* Popover Card */
.help-popover {
  position: absolute;
  bottom: calc(100% + 16px);
  right: 0;
  width: 380px;
  max-width: calc(100vw - 2.5rem);
  background: #ffffff;
  border-radius: 22px;
  box-shadow: 0 24px 64px -12px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(0, 168, 107, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

:global(.dark) .help-popover {
  background: #09120e;
  border: 1px solid rgba(0, 245, 155, 0.25);
  box-shadow: 0 24px 64px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(0, 245, 155, 0.2);
}

/* Popover Header */
.popover-header {
  background: linear-gradient(135deg, #092c1e 0%, #004d30 100%);
  color: #ffffff;
  padding: 1.25rem 1.35rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-avatar-group {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.vet-avatar {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid #00f59b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #25d366;
  border: 2px solid #092c1e;
}

.popover-title {
  font-family: var(--font-display);
  font-size: 0.975rem;
  font-weight: 800;
  margin: 0;
  color: #ffffff;
}

.popover-subtitle {
  font-size: 0.75rem;
  color: #a7f3d0;
  margin: 0.15rem 0 0;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00f59b;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: rgba(255, 255, 255, 0.85);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
}

/* Popover Body */
.popover-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.popover-desc {
  font-size: 0.8125rem;
  color: #4a6858;
  margin: 0;
  line-height: 1.45;
}

:global(.dark) .popover-desc { color: #8ca395; }

.action-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.help-action-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 0.85rem;
  border-radius: 14px;
  background: #f4f7f5;
  border: 1px solid #e2ebe5;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
}

:global(.dark) .help-action-card {
  background: #0e1a14;
  border-color: rgba(255, 255, 255, 0.07);
}

.help-action-card:hover {
  transform: translateY(-2px);
  border-color: #00a86b;
  box-shadow: 0 6px 16px rgba(0, 168, 107, 0.15);
}

:global(.dark) .help-action-card:hover {
  border-color: #00f59b;
  background: #12241b;
}

.help-action-card--urgent {
  background: rgba(37, 211, 102, 0.08);
  border-color: rgba(37, 211, 102, 0.4);
}

:global(.dark) .help-action-card--urgent {
  background: rgba(37, 211, 102, 0.14);
  border-color: rgba(37, 211, 102, 0.45);
}

.action-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.action-icon-box--wa { background: #25d366; color: #ffffff; }
.action-icon-box--chat { background: rgba(0, 168, 107, 0.15); }
.action-icon-box--phone { background: rgba(59, 130, 246, 0.15); }
.action-icon-box--book { background: rgba(245, 158, 11, 0.15); }

.action-info {
  flex: 1;
  min-width: 0;
}

.action-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.action-title {
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 700;
  color: #0d1f18;
}

:global(.dark) .action-title { color: #f1faf5; }

.badge-urgent {
  font-size: 0.625rem;
  font-weight: 800;
  background: #ef4444;
  color: #ffffff;
  padding: 0.15rem 0.45rem;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.action-sub {
  font-size: 0.725rem;
  color: #628070;
  margin: 0.15rem 0 0;
  line-height: 1.25;
}

:global(.dark) .action-sub { color: #8ca395; }

/* Custom Chat Box */
.custom-chat-box {
  background: #edf3f0;
  padding: 0.85rem;
  border-radius: 16px;
  border: 1px solid #dbe6e0;
}

:global(.dark) .custom-chat-box {
  background: #0a1711;
  border-color: rgba(0, 245, 155, 0.15);
}

.custom-chat-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #0d1f18;
  margin-bottom: 0.5rem;
}

:global(.dark) .custom-chat-label {
  color: #d1fae5;
}

.quick-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 0.6rem;
}

.chip-btn {
  background: #ffffff;
  border: 1px solid #ccdcd2;
  border-radius: 999px;
  padding: 0.25rem 0.55rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #1a4030;
  cursor: pointer;
  transition: all 0.15s ease;
}

.chip-btn:hover {
  background: #00a86b;
  color: #ffffff;
  border-color: #00a86b;
}

:global(.dark) .chip-btn {
  background: #11261b;
  border-color: rgba(0, 245, 155, 0.25);
  color: #a7f3d0;
}

:global(.dark) .chip-btn:hover {
  background: #00f59b;
  color: #040706;
  border-color: #00f59b;
}

.custom-input-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.custom-input {
  flex: 1;
  padding: 0.55rem 0.75rem;
  border-radius: 10px;
  border: 1px solid #ccdcd2;
  background: #ffffff;
  font-size: 0.8125rem;
  color: #0d1f18;
  outline: none;
  font-family: inherit;
}

.custom-input:focus {
  border-color: #00a86b;
  box-shadow: 0 0 0 2px rgba(0, 168, 107, 0.2);
}

:global(.dark) .custom-input {
  background: #07100b;
  border-color: rgba(255, 255, 255, 0.12);
  color: #f1faf5;
}

:global(.dark) .custom-input:focus {
  border-color: #00f59b;
  box-shadow: 0 0 0 2px rgba(0, 245, 155, 0.25);
}

.send-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #25d366;
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.15s ease, background 0.15s ease;
}

.send-btn:hover {
  transform: scale(1.06);
  background: #1ebd5a;
}

/* Popover Footer */
.popover-footer {
  background: #f0f4f2;
  padding: 0.65rem 1.25rem;
  font-size: 0.6875rem;
  color: #4a6858;
  text-align: center;
  border-top: 1px solid #e2ebe5;
}

:global(.dark) .popover-footer {
  background: #060e0a;
  border-color: rgba(255, 255, 255, 0.05);
  color: #8ca395;
}

/* Transitions */
.help-popover-enter-active,
.help-popover-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.help-popover-enter-from,
.help-popover-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}

@media (max-width: 640px) {
  .floating-help-container {
    bottom: 1.25rem;
    right: 1.25rem;
  }

  .help-popover {
    width: calc(100vw - 2.5rem);
    right: 0;
  }

  .btn-label-tag {
    display: none;
  }
}
</style>
