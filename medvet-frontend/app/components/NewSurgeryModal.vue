<template>
  <div v-if="isOpen" class="surg-modal-backdrop" @click.self="$emit('close')">
    <div class="surg-modal-dialog">

      <div class="surg-modal-header">
        <div class="header-left">
          <span class="header-icon">🔪</span>
          <div>
            <h2 class="header-title">Protocolo Quirúrgico e Intervención</h2>
            <p class="header-sub">Quirófano MedVet 24/7 · Paciente: {{ petName }}</p>
          </div>
        </div>
        <button type="button" class="btn-close" @click="$emit('close')">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="surg-form">
        <div class="form-scrollable">

          <div class="form-row form-row--2">
            <div class="form-group">
              <label class="form-label">Nombre del Procedimiento Quirúrgico *</label>
              <input
                v-model="form.surgery_name"
                type="text"
                class="form-input"
                placeholder="Ej: Ovariohisterectomía (OVH) o Osteosíntesis de Fémur"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Tipo de Cirugía *</label>
              <select v-model="form.surgery_type" class="form-select" required>
                <option value="programada">📅 Cirugía Programada</option>
                <option value="urgencia">🚨 Cirugía de Urgencia</option>
                <option value="ambulatoria">🏥 Ambulatoria (Alta en el día)</option>
                <option value="mayor">⚠️ Cirugía Mayor Compleja</option>
              </select>
            </div>
          </div>

          <div class="form-row form-row--2">
            <div class="form-group">
              <label class="form-label">Fecha y Hora de la Cirugía *</label>
              <input
                v-model="form.surgery_date"
                type="datetime-local"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Estado del Procedimiento *</label>
              <select v-model="form.status" class="form-select" required>
                <option value="programada">🟡 Programada</option>
                <option value="en_quirofano">🔵 En Quirófano</option>
                <option value="recuperacion">🟣 En Recuperación / Hospitalización</option>
                <option value="completada">🟢 Completada con Éxito</option>
                <option value="cancelada">🔴 Cancelada</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Evaluación Prequirúrgica y Riesgo ASA</label>
            <textarea
              v-model="form.pre_op_evaluation"
              rows="2"
              class="form-textarea"
              placeholder="Clasificación ASA (I a V), análisis de sangre prequirúrgicos, ecocardiograma, tiempo de ayuno..."
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Protocolo Anestésico y Monitorización</label>
            <textarea
              v-model="form.anesthesia_protocol"
              rows="2"
              class="form-textarea"
              placeholder="Premedicación (ej. Dexmedetomidina), Inducción (ej. Propofol), Mantenimiento inhalatorio con Isoflurano, monitoreo multiparamétrico..."
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Técnica Quirúrgica y Hallazgos Intraoperatorios</label>
            <textarea
              v-model="form.surgical_technique"
              rows="3"
              class="form-textarea"
              placeholder="Descripción del abordaje, incisión, hemostasia, técnica empleada, suturas utilizadas y tiempo quirúrgico total..."
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Indicaciones y Cuidados Postoperatorios</label>
            <textarea
              v-model="form.post_op_orders"
              rows="2"
              class="form-textarea"
              placeholder="Analgesia postoperatoria, antibioticoterapia, collar isabelino, cura de herida, fecha de retiro de puntos..."
            ></textarea>
          </div>

        </div>

        <div class="surg-modal-footer">
          <button type="button" class="btn-ghost" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Guardando...' : '🔪 Guardar Protocolo Quirúrgico' }}
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
  (e: 'surgerySaved', surgery: any): void
}>()

const isSubmitting = ref(false)

const form = ref({
  surgery_name: '',
  surgery_type: 'programada',
  surgery_date: new Date().toISOString().slice(0, 16),
  status: 'programada',
  pre_op_evaluation: '',
  anesthesia_protocol: '',
  surgical_technique: '',
  post_op_orders: ''
})

async function handleSubmit() {
  if (!props.petId || !form.value.surgery_name) return
  isSubmitting.value = true

  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase || 'http://localhost:3030'

    const saved = await $fetch(`${apiBase}/surgeries`, {
      method: 'POST',
      body: {
        pet_id: props.petId,
        ...form.value
      }
    })

    emit('surgerySaved', saved)
    emit('close')
  } catch (err: any) {
    console.error('Error al registrar cirugía:', err)
    alert('Error al registrar la cirugía: ' + (err.message || 'Error de conexión'))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.surg-modal-backdrop {
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

.surg-modal-dialog {
  width: 100%;
  max-width: 750px;
  max-height: 90vh;
  background: #0d1a15;
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 1.25rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.surg-modal-header {
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
  gap: 0.75rem;
}

.header-icon {
  font-size: 1.75rem;
}

.header-title {
  font-size: 1.125rem;
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
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.25rem;
  cursor: pointer;
}

.surg-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.form-scrollable {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  background: #070e0c;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.5rem;
  padding: 0.625rem 0.875rem;
  color: #f8fafc;
  font-size: 0.875rem;
  outline: none;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: #10b981;
}

.surg-modal-footer {
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
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-ghost {
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
}
</style>
