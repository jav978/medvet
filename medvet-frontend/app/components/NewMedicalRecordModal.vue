<template>
  <div v-if="isOpen" class="record-modal-backdrop" @click.self="$emit('close')">
    <div class="record-modal-dialog">

      <!-- Header -->
      <div class="record-modal-header">
        <div class="header-left">
          <span class="header-icon">🩺</span>
          <div>
            <h2 class="header-title">Nueva Consulta / Registro Clínico</h2>
            <p class="header-sub">Historia Clínica Electrónica · Paciente: {{ petName }}</p>
          </div>
        </div>
        <button type="button" class="btn-close" @click="$emit('close')">✕</button>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="handleSubmit" class="record-modal-form">
        <div class="form-scrollable-body">

          <!-- Row 1: Record Type & Patient Status -->
          <div class="form-row form-row--2">
            <div class="form-group">
              <label class="form-label">Tipo de Atención *</label>
              <select v-model="form.record_type" class="form-select" required>
                <option value="consulta">🩺 Consulta Médica General</option>
                <option value="urgencia">🚨 Atención de Urgencia / Emergencia</option>
                <option value="control">🔄 Control / Reevaluación</option>
                <option value="hospitalizacion">🏥 Pase de Hospitalización</option>
                <option value="procedimiento">💉 Procedimiento Clínico Menor</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Estado Clínico del Paciente *</label>
              <select v-model="form.patient_status" class="form-select" required>
                <option value="estable">🟢 Estable</option>
                <option value="observacion">🟡 En Observación / Monitoreo</option>
                <option value="critico">🔴 Estado Crítico / Cuidado Intensivo</option>
                <option value="hospitalizado">🏥 Hospitalizado</option>
                <option value="prequirurgico">🔪 Prequirúrgico</option>
                <option value="postquirurgico">🩹 Postquirúrgico</option>
                <option value="alta">✅ Alta Médica</option>
              </select>
            </div>
          </div>

          <!-- Section: Vital Signs / Constantes Fisiológicas -->
          <div class="form-section">
            <h4 class="section-title">📊 Constantes Fisiológicas y Triage</h4>
            <div class="vitals-input-grid font-mono-numbers">
              <div class="vital-input-card">
                <span class="v-card-icon">⚖️</span>
                <label>Peso (kg)</label>
                <input
                  v-model.number="form.weight_kg"
                  type="number"
                  step="0.01"
                  placeholder="28.50"
                  class="v-input"
                />
              </div>

              <div class="vital-input-card">
                <span class="v-card-icon">🌡️</span>
                <label>Temp (°C)</label>
                <input
                  v-model.number="form.temperature"
                  type="number"
                  step="0.1"
                  placeholder="38.5"
                  class="v-input"
                />
              </div>

              <div class="vital-input-card">
                <span class="v-card-icon">💓</span>
                <label>FC (lpm / bpm)</label>
                <input
                  v-model.number="form.heart_rate"
                  type="number"
                  placeholder="90"
                  class="v-input"
                />
              </div>

              <div class="vital-input-card">
                <span class="v-card-icon">🫁</span>
                <label>FR (rpm)</label>
                <input
                  v-model.number="form.respiratory_rate"
                  type="number"
                  placeholder="24"
                  class="v-input"
                />
              </div>

              <div class="vital-input-card">
                <span class="v-card-icon">👄</span>
                <label>Mucosas</label>
                <input
                  v-model="form.mucous_membranes"
                  type="text"
                  placeholder="Rosadas y húmedas"
                  class="v-input"
                />
              </div>

              <div class="vital-input-card">
                <span class="v-card-icon">⏱️</span>
                <label>TLLC</label>
                <input
                  v-model="form.capillary_refill_time"
                  type="text"
                  placeholder="< 2 seg"
                  class="v-input"
                />
              </div>
            </div>
          </div>

          <!-- Section: Anamnesis & Reason for visit -->
          <div class="form-section">
            <h4 class="section-title">📝 Anamnesis y Motivo de Consulta</h4>
            <div class="form-group">
              <label class="form-label">Motivo de Consulta Principal *</label>
              <input
                v-model="form.reason_for_visit"
                type="text"
                class="form-input"
                placeholder="Ej: Claudicación en miembro posterior derecho con 3 días de evolución"
                required
              />
            </div>

            <div class="form-group mt-2">
              <label class="form-label">Anamnesis / Historia Previa</label>
              <textarea
                v-model="form.anamnesis"
                rows="2"
                class="form-textarea"
                placeholder="Síntomas descritos por el tutor, dieta, vacunas al día, desparasitación, tratamientos previos..."
              ></textarea>
            </div>
          </div>

          <!-- Section: Physical Exam & Diagnoses -->
          <div class="form-section">
            <h4 class="section-title">🔍 Examen Físico y Diagnóstico</h4>
            <div class="form-group">
              <label class="form-label">Hallazgos del Examen Físico</label>
              <textarea
                v-model="form.physical_exam_findings"
                rows="2"
                class="form-textarea"
                placeholder="Inspección general, palpación abdominal, auscultación cardiopulmonar, ganglios linfáticos, dolor a la palpación..."
              ></textarea>
            </div>

            <div class="form-row form-row--2 mt-2">
              <div class="form-group">
                <label class="form-label">Diagnóstico Presuntivo / Diferenciales</label>
                <input
                  v-model="form.presumptive_diagnosis"
                  type="text"
                  class="form-input"
                  placeholder="Ej: Posible esguince vs rotura de ligamento cruzado anterior"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Diagnóstico Definitivo</label>
                <input
                  v-model="form.definitive_diagnosis"
                  type="text"
                  class="form-input"
                  placeholder="Ej: Distensión ligamentosa coxofemoral leve"
                />
              </div>
            </div>
          </div>

          <!-- Section: Treatment & Prescription -->
          <div class="form-section">
            <h4 class="section-title">💊 Plan Terapéutico y Receta Médica</h4>
            <div class="form-group">
              <label class="form-label">Plan Terapéutico / Manejo</label>
              <textarea
                v-model="form.treatment_plan"
                rows="2"
                class="form-textarea"
                placeholder="Reposo, aplicación de crioterapia, dieta blanda, programación de estudios por imágenes..."
              ></textarea>
            </div>

            <div class="form-group mt-2">
              <label class="form-label">Receta Farmacológica / Indicaciones al Propietario</label>
              <textarea
                v-model="form.medical_prescription"
                rows="3"
                class="form-textarea font-mono-numbers"
                placeholder="1. Fármaco A (Dosis, Frecuencia, Días)&#10;2. Fármaco B (Dosis, Frecuencia, Días)"
              ></textarea>
            </div>
          </div>

          <!-- Notes -->
          <div class="form-group">
            <label class="form-label">Notas Internas / Próximo Control</label>
            <input
              v-model="form.notes"
              type="text"
              class="form-input"
              placeholder="Ej: Citar a control en 7 días para retiro de puntos o reevaluación"
            />
          </div>

        </div>

        <!-- Footer Actions -->
        <div class="record-modal-footer">
          <button type="button" class="btn-ghost" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Guardando...' : '💾 Guardar en Historia Clínica' }}
          </button>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  isOpen: boolean
  petId: string
  petName?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'recordSaved', record: any): void
}>()

const isSubmitting = ref(false)

const form = ref({
  record_type: 'consulta',
  patient_status: 'estable',
  reason_for_visit: '',
  weight_kg: undefined as number | undefined,
  temperature: undefined as number | undefined,
  heart_rate: undefined as number | undefined,
  respiratory_rate: undefined as number | undefined,
  mucous_membranes: 'Rosadas y húmedas',
  capillary_refill_time: '< 2 seg',
  anamnesis: '',
  physical_exam_findings: '',
  presumptive_diagnosis: '',
  definitive_diagnosis: '',
  treatment_plan: '',
  medical_prescription: '',
  notes: ''
})

async function handleSubmit() {
  if (!props.petId || !form.value.reason_for_visit) return
  isSubmitting.value = true

  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase || 'http://localhost:3030'

    const payload = {
      pet_id: props.petId,
      ...form.value
    }

    const savedRecord = await $fetch(`${apiBase}/medical-records`, {
      method: 'POST',
      body: payload
    })

    // Also update pet weight in pets table if weight was specified
    if (form.value.weight_kg) {
      try {
        await $fetch(`${apiBase}/pets/${props.petId}`, {
          method: 'PATCH',
          body: { weight: form.value.weight_kg }
        })
      } catch (e) {
        console.warn('Could not update pet weight:', e)
      }
    }

    emit('recordSaved', savedRecord)
    emit('close')
  } catch (err: any) {
    console.error('Error al guardar consulta clínica:', err)
    alert('Error al guardar la consulta: ' + (err.message || 'Error de conexión'))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.record-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(4, 10, 8, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.record-modal-dialog {
  width: 100%;
  max-width: 850px;
  max-height: 92vh;
  background: #0d1a15;
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 1.25rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(16, 185, 129, 0.1);
  overflow: hidden;
}

.record-modal-header {
  padding: 1.25rem 1.75rem;
  background: #08110e;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.header-icon {
  font-size: 1.75rem;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f0fdf4;
  margin: 0;
}

.header-sub {
  font-size: 0.8125rem;
  color: #94a3b8;
  margin: 0.2rem 0 0;
}

.btn-close {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-close:hover {
  color: #fff;
  background: rgba(239, 68, 68, 0.2);
}

.record-modal-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.form-scrollable-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-section {
  background: #091310;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.875rem;
  padding: 1.25rem;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #34d399;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1rem;
}

.form-row {
  display: grid;
  gap: 1rem;
}

.form-row--2 {
  grid-template-columns: 1fr 1fr;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #cbd5e1;
}

.form-input, .form-select, .form-textarea {
  background: #050a08;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.5rem;
  padding: 0.625rem 0.875rem;
  color: #f8fafc;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: #10b981;
}

/* Vitals Cards */
.vitals-input-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.75rem;
}

.vital-input-card {
  background: #050a08;
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 0.625rem;
  padding: 0.625rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.v-card-icon {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.vital-input-card label {
  font-size: 0.6875rem;
  color: #94a3b8;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.v-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(16, 185, 129, 0.4);
  color: #34d399;
  font-size: 0.875rem;
  font-weight: 700;
  text-align: center;
  outline: none;
  padding: 0.2rem 0;
}

.v-input:focus {
  border-color: #10b981;
}

.record-modal-footer {
  padding: 1rem 1.75rem;
  background: #08110e;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-primary {
  background: #10b981;
  color: #042f20;
  font-weight: 700;
  border: none;
  padding: 0.625rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-primary:hover {
  background: #34d399;
}

.btn-ghost {
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .vitals-input-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .form-row--2 {
    grid-template-columns: 1fr;
  }
}
</style>
