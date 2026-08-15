<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-card" role="dialog" aria-modal="true">
          <!-- Modal Header -->
          <div class="modal-header">
            <div class="header-branding">
              <div class="header-icon-box">
                <svg viewBox="0 0 24 24" fill="none" class="w-6 h-6" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="modal-title">Protocolos Sanitarios & Normas ISO</h2>
                  <span class="status-badge">Regulación Sanitaria Venezuela & Estándares ISO</span>
                </div>
                <p class="modal-subtitle">Marco Jurídico INSAI · Normas COVENIN de Bioseguridad · Certificaciones ISO</p>
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
            <!-- Regulatory Banner -->
            <div class="protocol-hero-banner">
              <div class="banner-badge-row">
                <span class="pill-badge pill-insai">🏛️ INSAI Homologado</span>
                <span class="pill-badge pill-covenin">📋 Normas COVENIN</span>
                <span class="pill-badge pill-iso">🌐 ISO 9001 · 14001 · 17025</span>
              </div>
              <h3 class="banner-title">Marco de Bioseguridad y Regulación Médico-Veterinaria en Venezuela</h3>
              <p class="banner-desc">
                MedVet opera en estricta conformidad con el marco regulatorio del <strong>Instituto Nacional de Salud Agrícola Integral (INSAI)</strong>, el Colegio de Médicos Veterinarios de Venezuela (CMVV) y los estándares internacionales ISO de gestión clínica, control de infecciones y preservación ambiental.
              </p>
            </div>

            <!-- Detailed Regulatory Pillars -->
            <div class="pillars-grid">
              <!-- Pillar 1: INSAI -->
              <div class="pillar-card">
                <div class="pillar-header">
                  <span class="pillar-num">01</span>
                  <h4 class="pillar-title">Regulación Sanitaria INSAI (Venezuela)</h4>
                </div>
                <ul class="pillar-list">
                  <li>
                    <strong>Registro Sanitario de Establecimiento:</strong> Habilitación oficial de consultorios, áreas de hospitalización y quirófanos veterinarios según la <em>Ley de Salud Agrícola Integral</em> (Gaceta Oficial Nº 5.890).
                  </li>
                  <li>
                    <strong>Guías de Movilización y Viajes (SIGMAV / RUNSAI):</strong> Emisión y validación médica de certificados de salud animal, títulos de anticuerpos y constancias de vacunación antirrábica obligatoria para traslados nacionales e internacionales.
                  </li>
                  <li>
                    <strong>Vigilancia Epidemiológica:</strong> Notificación inmediata de enfermedades de denuncia obligatoria y control de zoonosis (Rabia, Leishmania, Brucelosis).
                  </li>
                </ul>
              </div>

              <!-- Pillar 2: COVENIN Bioseguridad -->
              <div class="pillar-card">
                <div class="pillar-header">
                  <span class="pillar-num">02</span>
                  <h4 class="pillar-title">Normas Venezolanas COVENIN de Bioseguridad</h4>
                </div>
                <ul class="pillar-list">
                  <li>
                    <strong>COVENIN 3058 / 3159 (Desechos Biopeligrosos):</strong> Segregación estricta en recipientes rígidos para cortopunzantes y bolsas rojas normalizadas para material biológico, con cadena de custodia y recolección certificada.
                  </li>
                  <li>
                    <strong>COVENIN 2260 & 2270 (Salud y Seguridad Laboral):</strong> Protocolos de ergonomía, protección radiológica con blindaje de plomo en sala de Rayos X y dosimetría del personal técnico.
                  </li>
                  <li>
                    <strong>Zonificación de Asepsia:</strong> Separación física de áreas limpias (quirófano), semilimpias (prequirófano/recuperación) y sucias (zona de aislamiento infeccioso y necropsias).
                  </li>
                </ul>
              </div>

              <!-- Pillar 3: Estándares ISO -->
              <div class="pillar-card">
                <div class="pillar-header">
                  <span class="pillar-num">03</span>
                  <h4 class="pillar-title">Estándares Internacionales de Calidad ISO</h4>
                </div>
                <ul class="pillar-list">
                  <li>
                    <strong>ISO 9001:2015 (Gestión de Calidad Clínica):</strong> Protocolos estandarizados en historia clínica digital, doble verificación farmacológica y trazabilidad de lotes y fechas de caducidad.
                  </li>
                  <li>
                    <strong>ISO 14001:2015 (Gestión Ambiental Hospitalaria):</strong> Mitigación del impacto ambiental en el manejo de efluentes clínicos y descarte seguro de fármacos vencidos.
                  </li>
                  <li>
                    <strong>ISO/IEC 17025 (Calidad en Diagnóstico Laboratorial):</strong> Calibración periódica y controles de calidad analíticos diarios en equipos de hematología y bioquímica.
                  </li>
                </ul>
              </div>

              <!-- Pillar 4: Protocolos Quirúrgicos y Esterilización -->
              <div class="pillar-card">
                <div class="pillar-header">
                  <span class="pillar-num">04</span>
                  <h4 class="pillar-title">Control de Infecciones & Esterilización</h4>
                </div>
                <ul class="pillar-list">
                  <li>
                    <strong>Ciclos de Autoclave Validados:</strong> Esterilización por calor húmedo a 121°C/134°C con verificación por indicadores químicos multiparámetro y pruebas biológicas de esporas.
                  </li>
                  <li>
                    <strong>Triage y Aislamiento Infeccioso:</strong> Sala con presión negativa independiente para pacientes con sospecha de Parvovirus, Moquillo o enfermedades altamente contagiosas.
                  </li>
                  <li>
                    <strong>Desinfección de Alto Nivel:</strong> Uso de amonio cuaternario de quinta generación y peróxido de hidrógeno acelerado entre pacientes.
                  </li>
                </ul>
              </div>
            </div>

            <!-- Professional Responsibility Note -->
            <div class="commitment-card">
              <div class="commitment-icon">👨‍⚕️</div>
              <div class="commitment-content">
                <h5 class="commitment-title">Cuerpo Médico Colegiado & Certificado</h5>
                <p class="commitment-text">
                  Todos los médicos veterinarios de MedVet cuentan con matrícula profesional activa en el <strong>Colegio de Médicos Veterinarios de Venezuela (CMVV)</strong> y acreditación sanitaria vigente ante el <strong>INSAI</strong>, asegurando el ejercicio ético, legal y de máxima solvencia científica.
                </p>
              </div>
            </div>
          </div>

          <!-- Modal Footer Actions -->
          <div class="modal-footer">
            <a href="https://wa.me/5491112345678?text=Hola%2C%20quisiera%20consultar%20sobre%20certificados%20de%20salud%2C%20vacunas%20y%20protocolos%20INSAI%20en%20MedVet" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-action">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.764.845 2.796.845h.005c3.18 0 5.767-2.587 5.768-5.766 0-3.18-2.588-5.767-5.768-5.767zm3.385 8.163c-.144.405-.837.774-1.17.822-.311.045-.71.074-2.029-.472-1.685-.697-2.766-2.42-2.85-2.532-.084-.112-.684-.912-.684-1.739 0-.827.433-1.233.587-1.39.144-.146.338-.212.45-.212.112 0 .225.002.324.007.104.005.244-.04.382.292.144.346.491 1.198.535 1.286.044.088.073.19.015.305-.058.115-.088.187-.174.288-.088.101-.184.225-.263.303-.09.088-.183.184-.079.362.105.178.468.772 1.004 1.25 1.004.894 1.543 1.171 1.761 1.279.218.108.347.09.477-.058.13-.148.558-.65.706-.874.148-.224.296-.187.498-.112.202.075 1.284.606 1.505.717.221.111.368.166.423.259.055.093.055.539-.089.944z"/>
              </svg>
              <span>Consultar Certificados & INSAI</span>
            </a>
            <button type="button" @click="$emit('close')" class="btn-close-action">
              Entendido / Cerrar
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
  max-width: 860px;
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
  background: #eff6ff;
  color: #2563eb;
  border-radius: 0.75rem;
}

.dark .header-icon-box {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
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
  background: #f0fdf4;
  color: #15803d;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.dark .status-badge {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
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

.protocol-hero-banner {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #cbd5e1;
  border-radius: 1rem;
  padding: 1.25rem;
}

.dark .protocol-hero-banner {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%);
  border-color: rgba(255, 255, 255, 0.1);
}

.banner-badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.pill-badge {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  letter-spacing: 0.02em;
}

.pill-insai {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.dark .pill-insai {
  background: rgba(0, 245, 155, 0.12);
  color: #00f59b;
  border-color: rgba(0, 245, 155, 0.25);
}

.pill-covenin {
  background: #eff6ff;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

.dark .pill-covenin {
  background: rgba(59, 130, 246, 0.12);
  color: #93c5fd;
  border-color: rgba(59, 130, 246, 0.25);
}

.pill-iso {
  background: #faf5ff;
  color: #6b21a8;
  border: 1px solid #e9d5ff;
}

.dark .pill-iso {
  background: rgba(168, 85, 247, 0.12);
  color: #d8b4fe;
  border-color: rgba(168, 85, 247, 0.25);
}

.banner-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.375rem;
}

.dark .banner-title {
  color: #f8fafc;
}

.banner-desc {
  font-size: 0.8125rem;
  line-height: 1.6;
  color: #334155;
  margin: 0;
}

.dark .banner-desc {
  color: #cbd5e1;
}

/* Pillars */
.pillars-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (max-width: 700px) {
  .pillars-grid {
    grid-template-columns: 1fr;
  }
}

.pillar-card {
  padding: 1.125rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dark .pillar-card {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.07);
}

.pillar-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.pillar-num {
  font-size: 0.75rem;
  font-weight: 800;
  color: #059669;
  background: #ecfdf5;
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;
}

.dark .pillar-num {
  color: #00f59b;
  background: rgba(0, 245, 155, 0.1);
}

.pillar-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.dark .pillar-title {
  color: #f1f5f9;
}

.pillar-list {
  list-style: disc;
  padding-left: 1.125rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pillar-list li {
  font-size: 0.775rem;
  line-height: 1.5;
  color: #475569;
}

.dark .pillar-list li {
  color: #94a3b8;
}

.pillar-list li strong {
  color: #0f172a;
}

.dark .pillar-list li strong {
  color: #e2e8f0;
}

/* Commitment card */
.commitment-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 0.875rem;
}

.dark .commitment-card {
  background: rgba(0, 245, 155, 0.05);
  border-color: rgba(0, 245, 155, 0.15);
}

.commitment-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.commitment-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #065f46;
  margin: 0 0 0.25rem;
}

.dark .commitment-title {
  color: #00f59b;
}

.commitment-text {
  font-size: 0.775rem;
  line-height: 1.55;
  color: #064e3b;
  margin: 0;
}

.dark .commitment-text {
  color: #cbd5e1;
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
