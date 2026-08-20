<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-card" role="dialog" aria-modal="true">
          <!-- Modal Header -->
          <div class="modal-header">
            <div class="header-branding">
              <div class="header-icon-box">
                <MedVetIcon custom-class="w-6 h-6" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="modal-title">MedVet Clinical Systems</h2>
                  <span class="status-badge">Centro de Alta Complejidad</span>
                </div>
                <p class="modal-subtitle">Hospital & Centro Quirúrgico de Diagnóstico Veterinario</p>
              </div>
            </div>
            <button type="button" @click="$emit('close')" class="close-btn" aria-label="Cerrar modal">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Body Content -->
          <div class="modal-body custom-scrollbar">
            <!-- Hero Description -->
            <div class="info-hero-banner">
              <div class="banner-text">
                <h3 class="banner-title">Excelencia Médica, Tecnología & Cuidado Humanizado</h3>
                <p class="banner-desc">
                  MedVet es una institución médico-veterinaria orientada al diagnóstico avanzado, la cirugía de alta precisión y el cuidado intensivo continuo. Diseñada bajo estándares hospitalarios internacionales, garantizamos un trato empático y riguroso a cada paciente.
                </p>
              </div>
            </div>

            <!-- Highlights Grid -->
            <div class="highlights-grid">
              <div class="highlight-card">
                <div class="card-icon bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">🏥</div>
                <div class="card-content">
                  <h4 class="card-title">Quirófano Estéril de Alta Complejidad</h4>
                  <p class="card-text">Torre de anestesia inhalatoria con sevoflurano/isoflurano, monitoreo multiparamétrico (ECG, capnografía, pulsioximetría y PNI) y electrobisturí bipolar para cirugías de tejidos blandos y traumatología.</p>
                </div>
              </div>

              <div class="highlight-card">
                <div class="card-icon bg-blue-500/10 text-blue-600 dark:text-blue-400">⚡</div>
                <div class="card-content">
                  <h4 class="card-title">Diagnóstico por Imágenes Digital</h4>
                  <p class="card-text">Ecógrafo Doppler color multifrecuencia para estudios cardiológicos y abdominales, y sala plomada con Radiología Digital Directa (DR) con visualización instantánea de alta definición.</p>
                </div>
              </div>

              <div class="highlight-card">
                <div class="card-icon bg-purple-500/10 text-purple-600 dark:text-purple-400">🔬</div>
                <div class="card-content">
                  <h4 class="card-title">Laboratorio Clínico Automatizado</h4>
                  <p class="card-text">Equipamiento in-house para hemogramas completos, química clínica cuantitativa, gases en sangre, frotis citológicos y uroanálisis con resultados en menos de 20 minutos para emergencias.</p>
                </div>
              </div>

              <div class="highlight-card">
                <div class="card-icon bg-amber-500/10 text-amber-600 dark:text-amber-400">🛏️</div>
                <div class="card-content">
                  <h4 class="card-title">UCI & Hospitalización Climatizada</h4>
                  <p class="card-text">Áreas de internación separadas para pacientes caninos y felinos con infusión continua por bomba volumétrica, oxigenoterapia central y vigilancia médica ininterrumpida.</p>
                </div>
              </div>
            </div>

            <!-- Medical Specializations -->
            <div class="section-block">
              <h4 class="section-heading">
                <span class="heading-pill"></span>
                Especialidades Clínicas & Quirúrgicas
              </h4>
              <div class="tags-container">
                <span class="spec-tag">🩺 Medicina Interna</span>
                <span class="spec-tag">🦴 Cirugía & Traumatología</span>
                <span class="spec-tag">❤️ Cardiología Veterinaria</span>
                <span class="spec-tag">🔬 Oncología Clínica</span>
                <span class="spec-tag">🧴 Dermatología & Alergias</span>
                <span class="spec-tag">🦷 Odontología & Limpieza Ultrasónica</span>
                <span class="spec-tag">👁️ Oftalmología</span>
                <span class="spec-tag">🧠 Neurología & Fisiatría</span>
                <span class="spec-tag">💉 Inmunizaciones & Medicina Preventiva</span>
              </div>
            </div>

            <!-- Clinic Operations & Attention -->
            <div class="section-block location-block">
              <h4 class="section-heading">
                <span class="heading-pill"></span>
                Horarios & Canales de Guardia
              </h4>
              <div class="schedule-grid">
                <div class="schedule-card">
                  <span class="sch-title">🚨 Urgencias & Quirófano de Guardia</span>
                  <span class="sch-time">Abierto las 24 horas · 365 días del año</span>
                  <p class="sch-desc">Atención médica prioritaria según protocolo de triage veterinario.</p>
                </div>
                <div class="schedule-card">
                  <span class="sch-title">📅 Consultas Programadas y Estudios</span>
                  <span class="sch-time">Lunes a Sábado · 08:00 a 20:00 hs</span>
                  <p class="sch-desc">Atención con turno previo o reserva online.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer Actions -->
          <div class="modal-footer">
            <NuxtLink to="/book" @click="$emit('close')" class="btn-primary-action">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Agendar Cita Médica</span>
            </NuxtLink>
            <a href="https://wa.me/5491112345678?text=Hola%2C%20quisiera%20solicitar%20informaci%C3%B3n%20cl%C3%ADnica%20en%20MedVet" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-action">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.764.845 2.796.845h.005c3.18 0 5.767-2.587 5.768-5.766 0-3.18-2.588-5.767-5.768-5.767zm3.385 8.163c-.144.405-.837.774-1.17.822-.311.045-.71.074-2.029-.472-1.685-.697-2.766-2.42-2.85-2.532-.084-.112-.684-.912-.684-1.739 0-.827.433-1.233.587-1.39.144-.146.338-.212.45-.212.112 0 .225.002.324.007.104.005.244-.04.382.292.144.346.491 1.198.535 1.286.044.088.073.19.015.305-.058.115-.088.187-.174.288-.088.101-.184.225-.263.303-.09.088-.183.184-.079.362.105.178.468.772 1.004 1.25 1.004.894 1.543 1.171 1.761 1.279.218.108.347.09.477-.058.13-.148.558-.65.706-.874.148-.224.296-.187.498-.112.202.075 1.284.606 1.505.717.221.111.368.166.423.259.055.093.055.539-.089.944z"/>
              </svg>
              <span>Consultar por WhatsApp</span>
            </a>
            <button type="button" @click="$emit('close')" class="btn-close-action">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(8px);
}

.modal-card {
  width: 100%;
  max-width: 820px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.dark .modal-card {
  background: #0d171e;
  border-color: rgba(0, 245, 155, 0.15);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.dark .modal-header {
  border-bottom-color: rgba(255, 255, 255, 0.07);
}

.header-branding {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.header-icon-box {
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 168, 107, 0.12);
  border: 1px solid rgba(0, 168, 107, 0.25);
  border-radius: 0.75rem;
  padding: 3px;
}

.dark .header-icon-box {
  background: rgba(0, 245, 155, 0.12);
  border-color: rgba(0, 245, 155, 0.3);
}

.header-icon-box img,
.header-icon-box svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.dark .modal-title {
  color: #f8fafc;
}

.status-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  background: #e0f2fe;
  color: #0369a1;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.dark .status-badge {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
}

.modal-subtitle {
  font-size: 0.8125rem;
  color: #64748b;
  margin: 0.125rem 0 0;
}

.dark .modal-subtitle {
  color: #94a3b8;
}

.close-btn {
  padding: 0.5rem;
  color: #94a3b8;
  border-radius: 0.5rem;
  transition: all 0.15s ease;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.dark .close-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #f8fafc;
}

/* Body */
.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.info-hero-banner {
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border: 1px solid #bbf7d0;
  border-radius: 1rem;
  padding: 1.25rem;
}

.dark .info-hero-banner {
  background: linear-gradient(135deg, rgba(0, 245, 155, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%);
  border-color: rgba(0, 245, 155, 0.2);
}

.banner-title {
  font-size: 1rem;
  font-weight: 700;
  color: #065f46;
  margin: 0 0 0.375rem;
}

.dark .banner-title {
  color: #00f59b;
}

.banner-desc {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #1e293b;
  margin: 0;
}

.dark .banner-desc {
  color: #cbd5e1;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (max-width: 640px) {
  .highlights-grid {
    grid-template-columns: 1fr;
  }
}

.highlight-card {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.875rem;
}

.dark .highlight-card {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.07);
}

.card-icon {
  width: 2.25rem;
  height: 2.25rem;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem;
}

.dark .card-title {
  color: #f1f5f9;
}

.card-text {
  font-size: 0.775rem;
  line-height: 1.5;
  color: #64748b;
  margin: 0;
}

.dark .card-text {
  color: #94a3b8;
}

/* Sections */
.section-block {
  margin-top: 0.25rem;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .section-heading {
  color: #e2e8f0;
}

.heading-pill {
  width: 0.25rem;
  height: 1rem;
  background: #059669;
  border-radius: 9999px;
}

.dark .heading-pill {
  background: #00f59b;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.spec-tag {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.375rem 0.75rem;
  background: #f1f5f9;
  color: #334155;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.dark .spec-tag {
  background: rgba(255, 255, 255, 0.05);
  color: #cbd5e1;
  border-color: rgba(255, 255, 255, 0.08);
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.875rem;
}

@media (max-width: 640px) {
  .schedule-grid {
    grid-template-columns: 1fr;
  }
}

.schedule-card {
  padding: 0.875rem;
  border-radius: 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.dark .schedule-card {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.07);
}

.sch-title {
  display: block;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.dark .sch-title {
  color: #f1f5f9;
}

.sch-time {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #059669;
  margin-bottom: 0.25rem;
}

.dark .sch-time {
  color: #00f59b;
}

.sch-desc {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
}

.dark .sch-desc {
  color: #94a3b8;
}

/* Footer Actions */
.modal-footer {
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.dark .modal-footer {
  background: rgba(255, 255, 255, 0.02);
  border-top-color: rgba(255, 255, 255, 0.07);
}

.btn-primary-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #ffffff;
  background: #059669;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background 0.15s ease;
}

.btn-primary-action:hover {
  background: #047857;
}

.dark .btn-primary-action {
  background: #00f59b;
  color: #0d171e;
}

.dark .btn-primary-action:hover {
  background: #00dc82;
}

.btn-whatsapp-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #ffffff;
  background: #25d366;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background 0.15s ease;
}

.btn-whatsapp-action:hover {
  background: #1eb857;
}

.btn-close-action {
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #64748b;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  transition: all 0.15s ease;
}

.btn-close-action:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.dark .btn-close-action {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

.dark .btn-close-action:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
