<template>
  <div class="confirm-page">
    <div class="confirm-glow-mesh"></div>

    <div class="confirm-inner">

      <!-- Success Icon with Pulse -->
      <div class="success-icon-wrap">
        <div class="success-icon-ring"></div>
        <svg class="success-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
      </div>

      <span class="confirm-eyebrow">¡Cita Confirmada con Éxito!</span>
      <h1 class="confirm-title">Comprobante de Turno</h1>
      <p class="confirm-subtitle">
        Tu turno ha sido registrado en el sistema de MedVet. Te enviamos los detalles por email y WhatsApp.
      </p>

      <!-- Digital Receipt Card -->
      <div class="receipt-card">
        <div class="receipt-header">
          <div class="receipt-brand">
            <div class="receipt-icon">
              <svg viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" fill="currentColor"/></svg>
            </div>
            <div>
              <span class="receipt-name">MedVet Clinical Ticket</span>
              <span class="receipt-code font-mono-numbers">#{{ appointmentId }}</span>
            </div>
          </div>
          <span class="receipt-status-badge">Confirmado</span>
        </div>

        <div class="receipt-grid">
          <div class="receipt-cell">
            <span class="cell-label">Servicio</span>
            <span class="cell-val">{{ appointment?.service?.name || 'Consulta Médica Veterinaria' }}</span>
          </div>

          <div class="receipt-cell">
            <span class="cell-label">Paciente</span>
            <span class="cell-val">🐾 {{ appointment?.pet?.name || 'Mascota' }}</span>
            <span class="cell-sub" v-if="appointment?.pet?.species">{{ appointment.pet.species }}</span>
          </div>

          <div class="receipt-cell">
            <span class="cell-label">Fecha</span>
            <span class="cell-val font-mono-numbers">{{ formattedDate }}</span>
          </div>

          <div class="receipt-cell">
            <span class="cell-label">Horario</span>
            <span class="cell-val font-mono-numbers">{{ appointment?.start_time || '09:30' }} hs</span>
            <span class="cell-sub" v-if="appointment?.end_time">Hasta las {{ appointment.end_time }} hs</span>
          </div>

          <div class="receipt-cell">
            <span class="cell-label">Profesional a Cargo</span>
            <span class="cell-val">{{ appointment?.professional?.name || 'Dr. Mateo Silva' }}</span>
            <span class="cell-sub">Clínica & Quirófano</span>
          </div>

          <div class="receipt-cell">
            <span class="cell-label">Sede de Atención</span>
            <span class="cell-val">MedVet Central</span>
            <span class="cell-sub">Av. Libertador 4580, CABA</span>
          </div>
        </div>

        <!-- Barcode Decorative Line -->
        <div class="receipt-footer">
          <div class="barcode-graphic">
            <span>||| | |||| | | |||||| || | ||| |||| | ||</span>
          </div>
          <div class="receipt-note">
            Presentate 10 minutos antes con la libreta de vacunación de tu mascota.
          </div>
        </div>
      </div>

      <!-- Quick Action Utilities -->
      <div class="utility-actions">
        <!-- Google Calendar -->
        <a :href="googleCalendarUrl" target="_blank" rel="noopener" class="btn-ghost utility-btn">
          <span>📅</span>
          <span>Añadir a Google Calendar</span>
        </a>

        <!-- WhatsApp Share -->
        <a :href="whatsappShareUrl" target="_blank" rel="noopener" class="btn-ghost utility-btn">
          <span>💬</span>
          <span>Compartir en WhatsApp</span>
        </a>

        <!-- Print -->
        <button type="button" @click="handlePrint" class="btn-ghost utility-btn">
          <span>🖨️</span>
          <span>Imprimir Comprobante</span>
        </button>
      </div>

      <!-- Main Navigation Buttons -->
      <div class="main-actions">
        <NuxtLink to="/dashboard" class="btn-primary main-btn">
          Ir a Mi Panel de Citas →
        </NuxtLink>
        <NuxtLink to="/" class="btn-ghost main-btn">
          Volver a la Página Principal
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const appointment = ref(null)

const appointmentId = computed(() => route.params.id || 'MV-2026')

const formattedDate = computed(() => {
  if (!appointment.value?.date) {
    return new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }
  const d = new Date(appointment.value.date + 'T12:00:00')
  return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
})

const googleCalendarUrl = computed(() => {
  const title = encodeURIComponent(`Cita MedVet: ${appointment.value?.service?.name || 'Consulta Veterinaria'} (${appointment.value?.pet?.name || 'Mascota'})`)
  const details = encodeURIComponent(`Turno veterinario en MedVet.\nPaciente: ${appointment.value?.pet?.name || 'Mascota'}\nProfesional: ${appointment.value?.professional?.name || 'Dr. Mateo Silva'}\nSede: Av. Libertador 4580, CABA`)
  const location = encodeURIComponent('Av. Libertador 4580, Buenos Aires, Argentina')
  const dateStr = (appointment.value?.date || new Date().toISOString().split('T')[0]).replace(/-/g, '')
  const startTime = (appointment.value?.start_time || '09:00').replace(':', '') + '00'
  const endTime = (appointment.value?.end_time || '10:00').replace(':', '') + '00'
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}T${startTime}/${dateStr}T${endTime}&details=${details}&location=${location}`
})

const whatsappShareUrl = computed(() => {
  const text = encodeURIComponent(`🐾 ¡Hola! Tengo turno reservado en MedVet para ${appointment.value?.pet?.name || 'mi mascota'} el ${formattedDate.value} a las ${appointment.value?.start_time || '09:30'} hs con el ${appointment.value?.professional?.name || 'Dr. Mateo Silva'}.`)
  return `https://api.whatsapp.com/send?text=${text}`
})

const handlePrint = () => {
  if (typeof window !== 'undefined') {
    window.print()
  }
}

onMounted(async () => {
  try {
    const { $feathers } = useNuxtApp()
    if ($feathers) {
      const result = await $feathers.service('appointments').get(route.params.id, {
        query: {
          $include: ['service', 'pet', 'professional.user']
        }
      })
      if (result) appointment.value = result
    }
  } catch (error) {
    // Simulated fallback appointment data for offline/mock presentation
    appointment.value = {
      id: route.params.id,
      date: new Date().toISOString().split('T')[0],
      start_time: '10:30',
      end_time: '11:00',
      status: 'confirmed',
      service: { name: 'Consulta Clínica General' },
      pet: { name: 'Thor', species: 'Perro' },
      professional: { name: 'Dr. Mateo Silva' }
    }
  }
})
</script>

<style scoped>
.confirm-page {
  position: relative;
  min-height: 85vh;
  padding: 4rem 1.5rem 6rem;
  background-color: var(--color-cream-100);
  overflow: hidden;
}

.dark .confirm-page {
  background-color: #040706;
}

.confirm-glow-mesh {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 450px;
  background: radial-gradient(ellipse 700px 350px at 50% 0%, rgba(0, 245, 155, 0.22) 0%, rgba(0, 168, 107, 0.06) 50%, transparent 80%);
  filter: blur(40px);
  pointer-events: none;
  z-index: 0;
}

.confirm-inner {
  position: relative;
  z-index: 1;
  max-width: 680px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Success Icon */
.success-icon-wrap {
  position: relative;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  background: #00a86b;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 28px rgba(0, 168, 107, 0.4);
}

.dark .success-icon-wrap {
  background: #00f59b;
  color: #040706;
  box-shadow: 0 0 32px rgba(0, 245, 155, 0.7);
}

.success-icon { width: 2.25rem; height: 2.25rem; }

.confirm-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #00a86b;
  margin-bottom: 0.5rem;
}

.dark .confirm-eyebrow { color: #00f59b; }

.confirm-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  color: var(--color-ink-900);
  margin: 0 0 0.75rem;
}

.dark .confirm-title { color: #f1faf5; }

.confirm-subtitle {
  font-size: 0.9375rem;
  color: var(--color-ink-500);
  line-height: 1.6;
  margin: 0 0 2.25rem;
  max-width: 520px;
}

.dark .confirm-subtitle { color: #8ca395; }

/* Receipt Card */
.receipt-card {
  width: 100%;
  background: var(--color-cream-50);
  border: 1.5px solid var(--color-cream-300);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 16px 40px -12px rgba(0, 80, 50, 0.1);
  text-align: left;
  margin-bottom: 2rem;
}

.dark .receipt-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.22);
  box-shadow: 0 20px 50px -16px rgba(0, 0, 0, 0.85);
}

.receipt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.75rem;
  background: rgba(0, 168, 107, 0.08);
  border-bottom: 1px solid var(--color-cream-200);
}

.dark .receipt-header {
  background: rgba(0, 245, 155, 0.1);
  border-bottom-color: rgba(0, 245, 155, 0.15);
}

.receipt-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.receipt-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 10px;
  background: #00a86b;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .receipt-icon { background: #00f59b; color: #040706; }
.receipt-icon svg { width: 1.15rem; height: 1.15rem; }

.receipt-name {
  display: block;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-ink-900);
}

.dark .receipt-name { color: #f1faf5; }

.receipt-code {
  display: block;
  font-size: 0.72rem;
  color: #00a86b;
  font-weight: 700;
}

.dark .receipt-code { color: #00f59b; }

.receipt-status-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(0, 168, 107, 0.15);
  color: #007a4d;
  border: 1px solid rgba(0, 168, 107, 0.3);
}

.dark .receipt-status-badge {
  background: rgba(0, 245, 155, 0.18);
  color: #00f59b;
  border-color: rgba(0, 245, 155, 0.4);
}

.receipt-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  padding: 1.75rem;
}

@media (max-width: 500px) { .receipt-grid { grid-template-columns: 1fr; } }

.receipt-cell { display: flex; flex-direction: column; gap: 0.2rem; }

.cell-label {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 600;
  color: var(--color-ink-400);
}

.cell-val {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-ink-900);
}

.dark .cell-val { color: #f1faf5; }

.cell-sub { font-size: 0.75rem; color: var(--color-ink-500); }
.dark .cell-sub { color: #8ca395; }

.receipt-footer {
  padding: 1.25rem 1.75rem;
  background: var(--color-cream-100);
  border-top: 1px dashed var(--color-cream-300);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  align-items: center;
  text-align: center;
}

.dark .receipt-footer {
  background: #060c09;
  border-top-color: rgba(0, 245, 155, 0.2);
}

.barcode-graphic {
  font-family: monospace;
  letter-spacing: 0.18em;
  font-size: 0.85rem;
  opacity: 0.4;
  color: var(--color-ink-900);
}

.dark .barcode-graphic { color: #00f59b; }

.receipt-note {
  font-size: 0.75rem;
  color: var(--color-ink-500);
}

.dark .receipt-note { color: #8ca395; }

/* Utility buttons */
.utility-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  width: 100%;
}

.utility-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1rem;
  font-size: 0.8125rem;
  text-decoration: none;
}

/* Main actions */
.main-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 380px;
}

.main-btn {
  width: 100%;
  justify-content: center;
  padding: 0.85rem 1.5rem;
  font-size: 0.9375rem;
  text-decoration: none;
}
</style>
