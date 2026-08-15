<template>
  <div v-if="isOpen" class="vac-modal-backdrop" @click.self="$emit('close')">
    <div class="vac-modal-dialog">

      <div class="vac-modal-header">
        <div class="header-left">
          <span class="header-icon">💉</span>
          <div>
            <h2 class="header-title">Registrar Vacuna / Desparasitación</h2>
            <p class="header-sub">Carnet Sanitario Oficial · Mascota: {{ petName }}</p>
          </div>
        </div>
        <button type="button" class="btn-close" @click="$emit('close')">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="vac-form">
        <div class="form-group">
          <label class="form-label">Tipo de Inmunización / Tratamiento *</label>
          <div class="type-pills">
            <button
              type="button"
              class="pill-btn"
              :class="{ 'pill-btn--active': form.type === 'vacuna' }"
              @click="form.type = 'vacuna'"
            >
              💉 Vacuna Principal
            </button>
            <button
              type="button"
              class="pill-btn"
              :class="{ 'pill-btn--active': form.type === 'refuerzo' }"
              @click="form.type = 'refuerzo'"
            >
              🔄 Refuerzo Anual
            </button>
            <button
              type="button"
              class="pill-btn"
              :class="{ 'pill-btn--active': form.type === 'desparasitacion' }"
              @click="form.type = 'desparasitacion'"
            >
              💊 Desparasitación
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Nombre del Biológico / Vacuna *</label>
          <input
            v-model="form.vaccine_name"
            type="text"
            list="common-vaccines"
            class="form-input"
            placeholder="Ej: Antirrábica Canina (Rabisin) o Séxtuple Canina"
            required
          />
          <datalist id="common-vaccines">
            <option value="Antirrábica Canina (Rabisin - Boehringer)" />
            <option value="Séxtuple Canina (DHPPi/L4 - Zoetis)" />
            <option value="Óctuple Canina (Vanguard Plus - Zoetis)" />
            <option value="Triple Felina (Felocell - FVRCP)" />
            <option value="Leucemia Felina (FeLV)" />
            <option value="Tos de las Perreras (KC Bronchicine / Pneumodog)" />
            <option value="Giardia Vax" />
            <option value="Desparasitación Interna (Simparica Trio / Drontal Plus)" />
            <option value="Antiparasitario Externo (Bravecto / Nexgard Spectra)" />
          </datalist>
        </div>

        <div class="form-row form-row--2">
          <div class="form-group">
            <label class="form-label">Número de Lote</label>
            <input
              v-model="form.batch_number"
              type="text"
              class="form-input font-mono-numbers"
              placeholder="Ej: RAB-2026-981A"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Laboratorio Fabricante</label>
            <input
              v-model="form.manufacturer"
              type="text"
              class="form-input"
              placeholder="Ej: Zoetis / Boehringer Ingelheim / MSD"
            />
          </div>
        </div>

        <div class="form-row form-row--2">
          <div class="form-group">
            <label class="form-label">Fecha de Aplicación *</label>
            <input
              v-model="form.applied_date"
              type="date"
              class="form-input"
              required
              @change="calculateNextDue"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Próximo Refuerzo (Vencimiento)</label>
            <input
              v-model="form.next_due_date"
              type="date"
              class="form-input"
            />
          </div>
        </div>

        <!-- Quick Interval helpers -->
        <div class="interval-helpers">
          <span class="helper-lbl">Calcular revacunación en:</span>
          <button type="button" class="btn-chip" @click="setDueInterval(1)">1 Mes</button>
          <button type="button" class="btn-chip" @click="setDueInterval(3)">3 Meses</button>
          <button type="button" class="btn-chip" @click="setDueInterval(6)">6 Meses</button>
          <button type="button" class="btn-chip btn-chip--active" @click="setDueInterval(12)">1 Año (Recomendado)</button>
        </div>

        <div class="form-group">
          <label class="form-label">Notas / Observaciones</label>
          <textarea
            v-model="form.notes"
            rows="2"
            class="form-textarea"
            placeholder="Tolerancia, vía de administración (SC/IM/Oral), sitio anatómico..."
          ></textarea>
        </div>

        <div class="vac-modal-footer">
          <button type="button" class="btn-ghost" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Guardando...' : '💉 Registrar en Carnet' }}
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
  (e: 'vaccineSaved', vaccine: any): void
}>()

const isSubmitting = ref(false)

const form = ref({
  type: 'vacuna',
  vaccine_name: '',
  batch_number: '',
  manufacturer: '',
  applied_date: new Date().toISOString().split('T')[0],
  next_due_date: '',
  status: 'aplicada',
  notes: ''
})

function setDueInterval(months: number) {
  const base = form.value.applied_date ? new Date(form.value.applied_date) : new Date()
  base.setMonth(base.getMonth() + months)
  form.value.next_due_date = base.toISOString().split('T')[0]
}

// Default to 1 year ahead
setDueInterval(12)

function calculateNextDue() {
  setDueInterval(12)
}

async function handleSubmit() {
  if (!props.petId || !form.value.vaccine_name || !form.value.applied_date) return
  isSubmitting.value = true

  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase || 'http://localhost:3030'

    const saved = await $fetch(`${apiBase}/vaccinations`, {
      method: 'POST',
      body: {
        pet_id: props.petId,
        ...form.value
      }
    })

    emit('vaccineSaved', saved)
    emit('close')
  } catch (err: any) {
    console.error('Error al registrar vacuna:', err)
    alert('Error al registrar la vacuna: ' + (err.message || 'Error de conexión'))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.vac-modal-backdrop {
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

.vac-modal-dialog {
  width: 100%;
  max-width: 600px;
  background: #0d1a15;
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 1.25rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.vac-modal-header {
  padding: 1.25rem 1.5rem;
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

.vac-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}

.type-pills {
  display: flex;
  gap: 0.5rem;
}

.pill-btn {
  flex: 1;
  background: #070e0c;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pill-btn--active {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
  color: #34d399;
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

.form-row {
  display: grid;
  gap: 1rem;
}

.form-row--2 {
  grid-template-columns: 1fr 1fr;
}

.form-input, .form-textarea {
  background: #070e0c;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.5rem;
  padding: 0.625rem 0.875rem;
  color: #f8fafc;
  font-size: 0.875rem;
  outline: none;
}

.form-input:focus, .form-textarea:focus {
  border-color: #10b981;
}

.interval-helpers {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.helper-lbl {
  font-size: 0.75rem;
  color: #94a3b8;
}

.btn-chip {
  background: #070e0c;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  cursor: pointer;
}

.btn-chip:hover, .btn-chip--active {
  background: rgba(16, 185, 129, 0.15);
  border-color: #10b981;
  color: #34d399;
}

.vac-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
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
