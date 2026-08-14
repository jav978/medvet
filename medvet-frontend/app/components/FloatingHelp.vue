<template>
  <div class="floating-help-container no-print" ref="containerRef">

    <!-- Popover Menu -->
    <transition name="help-popover">
      <div v-if="isOpen" class="help-popover">

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
                Equipo Veterinario en línea 24/7
              </p>
            </div>
          </div>
          <button type="button" @click="isOpen = false" class="close-btn" aria-label="Cerrar">✕</button>
        </div>

        <!-- Popover Body -->
        <div class="popover-body">
          <p class="popover-desc">
            ¿Tenés una urgencia o necesitás consultar con un especialista? Elegí un canal directo:
          </p>

          <div class="action-list">
            <!-- WhatsApp Emergencias -->
            <a
              :href="whatsappUrgentUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="help-action-card help-action-card--urgent"
              @click="isOpen = false"
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
                <p class="action-sub">Respuesta inmediata con veterinario de turno</p>
              </div>
            </a>

            <!-- WhatsApp Consultas -->
            <a
              :href="whatsappGeneralUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="help-action-card"
              @click="isOpen = false"
            >
              <div class="action-icon-box action-icon-box--chat">
                <span>💬</span>
              </div>
              <div class="action-info">
                <span class="action-title">Consultas & Turnos</span>
                <p class="action-sub">Información de estudios, cirugías y vacunas</p>
              </div>
            </a>

            <!-- Llamada Telefónica -->
            <a
              href="tel:+541112345678"
              class="help-action-card"
              @click="isOpen = false"
            >
              <div class="action-icon-box action-icon-box--phone">
                <span>📞</span>
              </div>
              <div class="action-info">
                <span class="action-title">Llamar al Hospital</span>
                <p class="action-sub">+54 11 1234-5678 (Central Telefónica)</p>
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
                <span class="action-title">Agendar Consulta Online</span>
                <p class="action-sub">Elegí fecha, hora y profesional en segundos</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Popover Footer -->
        <div class="popover-footer">
          <span>🏥 Av. Libertador 4580, CABA · Abierto 24/7/365</span>
        </div>
      </div>
    </transition>

    <!-- Floating Trigger Button -->
    <button
      type="button"
      @click="isOpen = !isOpen"
      :class="['floating-trigger-btn', isOpen ? 'floating-trigger-btn--open' : '']"
      aria-label="Abrir Asistencia de Urgencias y WhatsApp"
    >
      <span class="pulse-ring"></span>
      <div class="btn-inner-icon">
        <svg v-if="!isOpen" class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span v-else class="close-icon">✕</span>
      </div>

      <!-- Tooltip Label -->
      <span class="btn-label-tag">
        <span class="tag-pulse"></span>
        Urgencias 24/7
      </span>
    </button>

  </div>
</template>

<script setup>
const isOpen = ref(false)
const containerRef = ref(null)

const whatsappUrgentUrl = 'https://wa.me/5491112345678?text=Hola%20MedVet,%20necesito%20atenci%C3%B3n%20m%C3%A9dica%20urgente%20para%20mi%20mascota'
const whatsappGeneralUrl = 'https://wa.me/5491112345678?text=Hola%20MedVet,%20deseo%20consultar%20sobre%20servicios%20y%20turnos'

// Close on click outside
const handleClickOutside = (e) => {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

// Close on escape key
const handleKeydown = (e) => {
  if (e.key === 'Escape') isOpen.value = false
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleClickOutside)
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleClickOutside)
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
.floating-help-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 9990;
  font-family: var(--font-body);
}

/* Floating Trigger Button */
.floating-trigger-btn {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #25d366;
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 24px -4px rgba(37, 211, 102, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease, box-shadow 0.2s ease;
}

.floating-trigger-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 12px 30px -4px rgba(37, 211, 102, 0.65), 0 0 0 2px rgba(255, 255, 255, 0.4);
}

.floating-trigger-btn--open {
  background: #0d1f18;
  transform: rotate(90deg);
}

.dark .floating-trigger-btn--open {
  background: #12241b;
}

.pulse-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid #25d366;
  opacity: 0.8;
  animation: waPulse 2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
  pointer-events: none;
}

@keyframes waPulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 0; }
  100% { transform: scale(1.2); opacity: 0; }
}

.btn-inner-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-inner-icon svg {
  width: 32px;
  height: 32px;
}

.close-icon {
  font-size: 1.5rem;
  font-weight: 700;
}

/* Floating Label Tag */
.btn-label-tag {
  position: absolute;
  right: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
  background: #ffffff;
  color: #0d1f18;
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  pointer-events: none;
  border: 1px solid #e2ebe5;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dark .btn-label-tag {
  background: #0d1f18;
  color: #f1faf5;
  border-color: rgba(0, 245, 155, 0.2);
}

.tag-pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #25d366;
  animation: tagPulse 1.5s infinite;
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
  width: 360px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 168, 107, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dark .help-popover {
  background: #0a1410;
  border: 1px solid rgba(0, 245, 155, 0.25);
  box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 245, 155, 0.2);
}

/* Popover Header */
.popover-header {
  background: linear-gradient(135deg, #0d3826 0%, #005032 100%);
  color: #ffffff;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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
  font-size: 1.5rem;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #25d366;
  border: 2px solid #0d3826;
}

.popover-title {
  font-family: var(--font-display);
  font-size: 1rem;
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
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.2rem;
}

.close-btn:hover { color: #ffffff; }

/* Popover Body */
.popover-body {
  padding: 1.25rem;
}

.popover-desc {
  font-size: 0.8125rem;
  color: #4a6858;
  margin: 0 0 1rem;
  line-height: 1.4;
}

.dark .popover-desc { color: #8ca395; }

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

.dark .help-action-card {
  background: #0d1a14;
  border-color: rgba(255, 255, 255, 0.06);
}

.help-action-card:hover {
  transform: translateY(-2px);
  border-color: #00a86b;
  box-shadow: 0 4px 12px rgba(0, 168, 107, 0.15);
}

.dark .help-action-card:hover {
  border-color: #00f59b;
  background: #10241b;
}

.help-action-card--urgent {
  background: rgba(37, 211, 102, 0.08);
  border-color: rgba(37, 211, 102, 0.35);
}

.dark .help-action-card--urgent {
  background: rgba(37, 211, 102, 0.12);
  border-color: rgba(37, 211, 102, 0.4);
}

.action-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
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
}

.action-title {
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 700;
  color: #0d1f18;
}

.dark .action-title { color: #f1faf5; }

.badge-urgent {
  font-size: 0.625rem;
  font-weight: 800;
  background: #ef4444;
  color: #ffffff;
  padding: 0.15rem 0.45rem;
  border-radius: 12px;
  text-transform: uppercase;
}

.action-sub {
  font-size: 0.725rem;
  color: #628070;
  margin: 0.15rem 0 0;
  line-height: 1.2;
}

.dark .action-sub { color: #8ca395; }

/* Popover Footer */
.popover-footer {
  background: #f0f4f2;
  padding: 0.65rem 1.25rem;
  font-size: 0.6875rem;
  color: #4a6858;
  text-align: center;
  border-top: 1px solid #e2ebe5;
}

.dark .popover-footer {
  background: #08100d;
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
