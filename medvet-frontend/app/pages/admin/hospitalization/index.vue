<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const { $feathers } = useNuxtApp()
const toast = useToastNotification()
const { formatUsd, formatVes, bcvRate } = useCurrency()

// State
const loading = ref(true)
const boxes = ref<any[]>([])
const hospitalizations = ref<any[]>([])
const pets = ref<any[]>([])
const professionals = ref<any[]>([])

// Filter & active tabs
const activeFilter = ref<'all' | 'occupied' | 'available' | 'icu' | 'critical'>('all')
const searchQuery = ref('')

// Modals
const isAdmitModalOpen = ref(false)
const isKardexDrawerOpen = ref(false)
const isQuickEntryModalOpen = ref(false)
const isDischargeModalOpen = ref(false)
const isPrintKardexModalOpen = ref(false)

// Active selections
const selectedHospitalization = ref<any | null>(null)
const selectedBox = ref<any | null>(null)
const selectedKardexEntries = ref<any[]>([])
const loadingKardex = ref(false)

// Forms
const admitForm = ref({
  pet_id: '',
  box_id: '',
  vet_id: '',
  admission_date: new Date().toISOString().slice(0, 16),
  status: 'active',
  reason_for_admission: '',
  presumptive_diagnosis: '',
  definitive_diagnosis: '',
  diet_instructions: '',
  fluid_therapy_plan: '',
  medication_schedule: '',
  daily_cost_usd: 35.00,
  notes: ''
})

const entryForm = ref({
  entry_type: 'vitals',
  recorded_at: new Date().toISOString().slice(0, 16),
  temperature: 38.5,
  heart_rate: 110,
  respiratory_rate: 24,
  blood_pressure_sys: 115,
  blood_pressure_dia: 70,
  capillary_refill_time: '1.5s',
  mucous_membranes: 'rosadas',
  pain_score: 0,
  medication_name: '',
  dose_given: '',
  route: 'IV',
  fluid_rate_ml_hr: 30,
  fluid_volume_infused_ml: 60,
  urination: 'normal',
  defecation: 'normal',
  appetite: 'come_solo',
  vomit_episodes: 0,
  notes: ''
})

const dischargeForm = ref({
  discharge_date: new Date().toISOString().slice(0, 16),
  discharge_summary: '',
  home_care_instructions: '',
  send_whatsapp: true
})

// Load All Data
const fetchData = async () => {
  loading.value = true
  try {
    if ($feathers) {
      // 1. Fetch Boxes
      try {
        const boxesRes = await $feathers.service('hospitalization-boxes').find({
          query: { $sort: { code: 1 } }
        })
        boxes.value = Array.isArray(boxesRes) ? boxesRes : (boxesRes.data || [])
      } catch (e) {
        console.warn('Fallback boxes', e)
      }

      // 2. Fetch Active Hospitalizations
      try {
        const hospRes = await $feathers.service('hospitalizations').find({
          query: {
            status: { $ne: 'discharged' },
            $sort: { admission_date: -1 }
          }
        })
        hospitalizations.value = Array.isArray(hospRes) ? hospRes : (hospRes.data || [])
      } catch (e) {
        console.warn('Fallback hospitalizations', e)
      }

      // 3. Fetch Pets for admission
      try {
        const petsRes = await $feathers.service('pets').find({
          query: { $limit: 100 }
        })
        pets.value = Array.isArray(petsRes) ? petsRes : (petsRes.data || [])
      } catch (e) {
        console.warn('Fallback pets', e)
      }

      // 4. Fetch Professionals
      try {
        const profRes = await $feathers.service('professionals').find({
          query: { $limit: 50 }
        })
        professionals.value = Array.isArray(profRes) ? profRes : (profRes.data || [])
      } catch (e) {
        console.warn('Fallback professionals', e)
      }
    }
  } catch (error: any) {
    console.error('Error loading hospitalization data:', error)
    toast.error('Error de carga', 'No se pudieron cargar los datos de hospitalización.')
  } finally {
    loading.value = false
  }
}

// Fetch Kardex entries for a hospitalization
const fetchKardex = async (hospId: string) => {
  loadingKardex.value = true
  try {
    if ($feathers) {
      const res = await $feathers.service('kardex-entries').find({
        query: {
          hospitalization_id: hospId,
          $sort: { recorded_at: -1 }
        }
      })
      selectedKardexEntries.value = Array.isArray(res) ? res : (res.data || [])
    }
  } catch (error) {
    console.error('Error fetching kardex entries:', error)
    selectedKardexEntries.value = []
  } finally {
    loadingKardex.value = false
  }
}

// Computed KPIs
const totalBoxes = computed(() => boxes.value.length || 6)
const occupiedBoxesCount = computed(() => boxes.value.filter(b => b.status === 'occupied').length)
const availableBoxesCount = computed(() => boxes.value.filter(b => b.status === 'available').length)
const occupancyRate = computed(() => {
  if (totalBoxes.value === 0) return 0
  return Math.round((occupiedBoxesCount.value / totalBoxes.value) * 100)
})
const criticalPatientsCount = computed(() => {
  return hospitalizations.value.filter(h => h.status === 'critical').length
})
const totalDailyIncomeUsd = computed(() => {
  return hospitalizations.value.reduce((acc, curr) => acc + Number(curr.daily_cost_usd || 0), 0)
})

// Box-Hospitalization Map
const enrichedBoxes = computed(() => {
  return boxes.value.map(box => {
    const hosp = hospitalizations.value.find(h => h.box_id === box.id && h.status !== 'discharged')
    return {
      ...box,
      hospitalization: hosp || null
    }
  })
})

// Filtered Boxes
const filteredBoxes = computed(() => {
  let list = enrichedBoxes.value

  if (activeFilter.value === 'occupied') {
    list = list.filter(b => b.status === 'occupied')
  } else if (activeFilter.value === 'available') {
    list = list.filter(b => b.status === 'available')
  } else if (activeFilter.value === 'icu') {
    list = list.filter(b => b.type === 'icu')
  } else if (activeFilter.value === 'critical') {
    list = list.filter(b => b.hospitalization?.status === 'critical')
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(b =>
      b.code.toLowerCase().includes(q) ||
      b.name.toLowerCase().includes(q) ||
      b.hospitalization?.pet?.name?.toLowerCase().includes(q) ||
      b.hospitalization?.presumptive_diagnosis?.toLowerCase().includes(q) ||
      b.hospitalization?.definitive_diagnosis?.toLowerCase().includes(q)
    )
  }

  return list
})

// Open Kardex Drawer
const openKardex = async (hosp: any) => {
  selectedHospitalization.value = hosp
  isKardexDrawerOpen.value = true
  await fetchKardex(hosp.id)
}

// Open Quick Entry Modal
const openQuickEntry = (hosp: any) => {
  selectedHospitalization.value = hosp
  entryForm.value.recorded_at = new Date().toISOString().slice(0, 16)
  isQuickEntryModalOpen.value = true
}

// Open Admit Modal
const openAdmitModal = (box?: any) => {
  admitForm.value = {
    pet_id: '',
    box_id: box?.id || (boxes.value.find(b => b.status === 'available')?.id || ''),
    vet_id: professionals.value[0]?.id || '',
    admission_date: new Date().toISOString().slice(0, 16),
    status: 'active',
    reason_for_admission: '',
    presumptive_diagnosis: '',
    definitive_diagnosis: '',
    diet_instructions: 'Dieta hídrica / Recovery según tolerancia',
    fluid_therapy_plan: 'Ringer Lactato a 30 ml/h',
    medication_schedule: '',
    daily_cost_usd: box?.daily_rate_usd || 35.00,
    notes: ''
  }
  selectedBox.value = box || null
  isAdmitModalOpen.value = true
}

// Submit Admission
const handleAdmitPatient = async () => {
  if (!admitForm.value.pet_id || !admitForm.value.box_id) {
    toast.error('Datos incompletos', 'Por favor selecciona una mascota y un box disponible.')
    return
  }

  try {
    if ($feathers) {
      const created = await $feathers.service('hospitalizations').create({
        ...admitForm.value,
        admission_date: new Date(admitForm.value.admission_date)
      })

      // Create initial Kardex entry
      await $feathers.service('kardex-entries').create({
        hospitalization_id: created.id,
        professional_id: admitForm.value.vet_id,
        recorded_at: new Date(),
        entry_type: 'evolution_note',
        temperature: 38.5,
        heart_rate: 110,
        respiratory_rate: 24,
        pain_score: 1,
        fluid_rate_ml_hr: 30,
        urination: 'normal',
        defecation: 'normal',
        appetite: 'anorexia',
        notes: `Ingreso a internación. Motivo: ${admitForm.value.reason_for_admission || 'Evaluación clínica'}. Se inicia protocolo pautado.`
      })

      toast.success('Paciente Ingresado', 'El paciente ha sido asignado al box exitosamente.')
      isAdmitModalOpen.value = false
      await fetchData()
    }
  } catch (error: any) {
    console.error('Error admitting patient:', error)
    toast.error('Error', error.message || 'No se pudo registrar la hospitalización.')
  }
}

// Submit Kardex Entry
const handleSaveKardexEntry = async () => {
  if (!selectedHospitalization.value) return

  try {
    if ($feathers) {
      await $feathers.service('kardex-entries').create({
        hospitalization_id: selectedHospitalization.value.id,
        professional_id: selectedHospitalization.value.vet_id || professionals.value[0]?.id,
        ...entryForm.value,
        recorded_at: new Date(entryForm.value.recorded_at)
      })

      toast.success('Kardex Actualizado', 'Signos y evolución registrados correctamente.')
      isQuickEntryModalOpen.value = false
      if (isKardexDrawerOpen.value) {
        await fetchKardex(selectedHospitalization.value.id)
      }
      await fetchData()
    }
  } catch (error: any) {
    console.error('Error saving kardex entry:', error)
    toast.error('Error', error.message || 'No se pudo registrar en el Kardex.')
  }
}

// Open Discharge Modal
const openDischargeModal = (hosp: any) => {
  selectedHospitalization.value = hosp
  dischargeForm.value = {
    discharge_date: new Date().toISOString().slice(0, 16),
    discharge_summary: `Paciente con evolución clínica favorable. Signos vitales estables, tolerancia alimentaria adecuada y parámetros hemodinámicos normalizados. Se otorga alta médica hospitalaria con indicaciones de reposo y farmacoterapia ambulatoria.`,
    home_care_instructions: `1. Reposo relativo por 5 días.\n2. Administrar medicación según receta adjunta.\n3. Control clínico en 72 horas o antes si presenta decaimiento, vómitos o inapetencia.`,
    send_whatsapp: true
  }
  isDischargeModalOpen.value = true
}

// Submit Discharge
const handleDischargePatient = async () => {
  if (!selectedHospitalization.value) return

  try {
    if ($feathers) {
      await $feathers.service('hospitalizations').patch(selectedHospitalization.value.id, {
        status: 'discharged',
        discharge_date: new Date(dischargeForm.value.discharge_date),
        discharge_summary: `${dischargeForm.value.discharge_summary}\n\n[INDICACIONES PARA EL HOGAR]:\n${dischargeForm.value.home_care_instructions}`
      })

      // Add final Kardex entry
      await $feathers.service('kardex-entries').create({
        hospitalization_id: selectedHospitalization.value.id,
        professional_id: selectedHospitalization.value.vet_id || professionals.value[0]?.id,
        recorded_at: new Date(),
        entry_type: 'evolution_note',
        temperature: 38.4,
        heart_rate: 100,
        respiratory_rate: 22,
        pain_score: 0,
        notes: `ALTA MÉDICA HOSPITALARIA EMITIDA. Box liberado y entregado a desinfección.`
      })

      toast.success('Alta Médica Exitosa', 'El paciente ha sido dado de alta y el box ha quedado libre.')
      isDischargeModalOpen.value = false
      isKardexDrawerOpen.value = false
      await fetchData()
    }
  } catch (error: any) {
    console.error('Error discharging patient:', error)
    toast.error('Error', error.message || 'No se pudo procesar el alta.')
  }
}

// Helper formatting
const formatTimeAgo = (dateStr: string) => {
  if (!dateStr) return ''
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h internado`
  if (diffHours > 0) return `${diffHours} horas internado`
  const diffMins = Math.floor(diffMs / (1000 * 60))
  return `${diffMins} min internado`
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleString('es-VE', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getBoxTypeBadge = (type: string) => {
  switch (type) {
    case 'icu': return { label: 'UCI / Críticos 🚨', class: 'badge--icu' }
    case 'isolation': return { label: 'Aislamiento ☣️', class: 'badge--iso' }
    case 'feline': return { label: 'Cat Friendly 🐱', class: 'badge--fel' }
    case 'canine': return { label: 'Caninos 🐕', class: 'badge--can' }
    case 'post_op': return { label: 'Postquirúrgico 🩹', class: 'badge--post' }
    default: return { label: 'Estándar 🏥', class: 'badge--std' }
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'critical': return { label: 'Crítico ⚠️', class: 'status--crit' }
    case 'post_op': return { label: 'Post-Op 🩹', class: 'status--post' }
    case 'stable': return { label: 'Estable ✅', class: 'status--stab' }
    default: return { label: 'En Observación 🩺', class: 'status--act' }
  }
}

// Print Kardex
const printKardexSheet = () => {
  window.print()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="hosp-page">
    <div class="hosp-ambient-glow"></div>

    <div class="hosp-container">
      
      <!-- Top Header & Navigation -->
      <div class="hosp-header">
        <div class="header-left">
          <div class="beacon-box">
            <span class="beacon-pulse"></span>
            <span class="beacon-icon">🏥</span>
          </div>
          <div>
            <div class="header-badge-row">
              <span class="badge-live">HOSPITALIZACIÓN & KARDEX 24H</span>
              <span class="badge-rate font-mono-numbers">BCV: {{ formatVes(1 * bcvRate) }} / USD</span>
            </div>
            <h1 class="header-title">Control de Boxes, Jaulas y Kardex Clínico</h1>
            <p class="header-sub">Monitoreo continuo de constantes vitales, fluidoterapia por bomba y evolución en cama</p>
          </div>
        </div>

        <div class="header-actions">
          <button type="button" class="btn-primary" @click="openAdmitModal()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Ingresar Paciente a Box
          </button>
          <NuxtLink to="/admin/guardia" class="btn-ghost">
            🚨 Tablero de Guardia 24/7
          </NuxtLink>
        </div>
      </div>

      <!-- KPI Summary Cards Strip -->
      <div class="kpi-strip font-mono-numbers">
        <div class="kpi-card kpi-card--occ">
          <div class="kpi-icon">🏨</div>
          <div class="kpi-info">
            <span class="kpi-val">{{ occupiedBoxesCount }} / {{ totalBoxes }}</span>
            <span class="kpi-lbl">Ocupación ({{ occupancyRate }}%)</span>
          </div>
          <div class="kpi-bar-wrap">
            <div class="kpi-bar" :style="{ width: `${occupancyRate}%` }"></div>
          </div>
        </div>

        <div class="kpi-card kpi-card--free">
          <div class="kpi-icon">🟢</div>
          <div class="kpi-info">
            <span class="kpi-val">{{ availableBoxesCount }}</span>
            <span class="kpi-lbl">Boxes Libres para Admisión</span>
          </div>
        </div>

        <div class="kpi-card kpi-card--crit">
          <div class="kpi-icon">⚠️</div>
          <div class="kpi-info">
            <span class="kpi-val">{{ criticalPatientsCount }}</span>
            <span class="kpi-lbl">Pacientes en Estado Crítico</span>
          </div>
        </div>

        <div class="kpi-card kpi-card--fin">
          <div class="kpi-icon">💵</div>
          <div class="kpi-info">
            <span class="kpi-val">{{ formatUsd(totalDailyIncomeUsd) }}</span>
            <span class="kpi-lbl">Facturación Estancia/Día</span>
          </div>
        </div>
      </div>

      <!-- Filter Tabs & Search Bar -->
      <div class="toolbar-box">
        <div class="filter-tabs">
          <button
            type="button"
            class="tab-btn"
            :class="{ 'tab-btn--active': activeFilter === 'all' }"
            @click="activeFilter = 'all'"
          >
            Todos los Boxes ({{ boxes.length }})
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ 'tab-btn--active': activeFilter === 'occupied' }"
            @click="activeFilter = 'occupied'"
          >
            🔴 Ocupados ({{ occupiedBoxesCount }})
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ 'tab-btn--active': activeFilter === 'available' }"
            @click="activeFilter = 'available'"
          >
            🟢 Libres ({{ availableBoxesCount }})
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ 'tab-btn--active': activeFilter === 'icu' }"
            @click="activeFilter = 'icu'"
          >
            🚨 Cuidados Intensivos UCI
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ 'tab-btn--active': activeFilter === 'critical' }"
            @click="activeFilter = 'critical'"
          >
            ⚠️ Críticos
          </button>
        </div>

        <div class="search-input-wrap">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por box, paciente o diagnóstico..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Interactive Boxes Grid Map -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando estado de la sala de hospitalización...</p>
      </div>

      <div v-else-if="filteredBoxes.length === 0" class="empty-state">
        <span class="empty-icon">🛏️</span>
        <h3>No se encontraron boxes con los filtros actuales</h3>
        <p>Ajusta el término de búsqueda o selecciona otra categoría.</p>
      </div>

      <div v-else class="boxes-grid">
        <div
          v-for="box in filteredBoxes"
          :key="box.id"
          class="box-card"
          :class="[
            box.status === 'occupied' ? 'box-card--occupied' : 'box-card--available',
            box.hospitalization?.status === 'critical' ? 'box-card--critical' : ''
          ]"
        >
          <!-- Box Header Badge Strip -->
          <div class="box-card-head">
            <div class="box-identity">
              <span class="box-code-pill font-mono-numbers">{{ box.code }}</span>
              <span class="box-type-pill" :class="getBoxTypeBadge(box.type).class">
                {{ getBoxTypeBadge(box.type).label }}
              </span>
            </div>
            <div class="box-status-indicator">
              <span v-if="box.status === 'occupied'" class="status-dot status-dot--occ"></span>
              <span v-else class="status-dot status-dot--avail"></span>
              <span class="status-txt">
                {{ box.status === 'occupied' ? 'OCUPADO' : 'DISPONIBLE' }}
              </span>
            </div>
          </div>

          <!-- Box Info Title -->
          <h3 class="box-name">{{ box.name }}</h3>
          <p class="box-features" :title="box.features">
            ⚙️ {{ box.features || 'Equipamiento estándar hospitalario' }}
          </p>

          <!-- OCCUPIED STATE: Patient Card Inside -->
          <div v-if="box.status === 'occupied' && box.hospitalization" class="patient-in-bed">
            <div class="patient-header-row">
              <div class="patient-avatar-box">
                <span class="p-avatar-emoji">
                  {{ box.hospitalization.pet?.species?.toLowerCase().includes('fel') || box.hospitalization.pet?.species?.toLowerCase().includes('gat') ? '🐱' : '🐕' }}
                </span>
              </div>
              <div class="patient-details">
                <div class="p-name-row">
                  <h4 class="p-title">{{ box.hospitalization.pet?.name || 'Mascota' }}</h4>
                  <span class="p-status-badge font-mono-numbers" :class="getStatusBadge(box.hospitalization.status).class">
                    {{ getStatusBadge(box.hospitalization.status).label }}
                  </span>
                </div>
                <p class="p-meta">
                  {{ box.hospitalization.pet?.species }} · {{ box.hospitalization.pet?.breed || 'Mestizo' }} · {{ box.hospitalization.pet?.weight || '—' }} kg
                </p>
                <p class="p-tutor" v-if="box.hospitalization.pet?.owner">
                  👤 {{ box.hospitalization.pet.owner.name }} · 📞 {{ box.hospitalization.pet.owner.phone || 'S/N' }}
                </p>
              </div>
            </div>

            <!-- Diagnosis & Fluid Plan Box -->
            <div class="clinical-memo-box">
              <div class="memo-row">
                <span class="memo-tag">Diagnóstico:</span>
                <span class="memo-val">{{ box.hospitalization.definitive_diagnosis || box.hospitalization.presumptive_diagnosis || box.hospitalization.reason_for_admission }}</span>
              </div>
              <div class="memo-row" v-if="box.hospitalization.fluid_therapy_plan">
                <span class="memo-tag">💧 Fluidos:</span>
                <span class="memo-val text-cyan font-mono-numbers">{{ box.hospitalization.fluid_therapy_plan }}</span>
              </div>
              <div class="memo-row" v-if="box.hospitalization.diet_instructions">
                <span class="memo-tag">🍲 Dieta:</span>
                <span class="memo-val">{{ box.hospitalization.diet_instructions }}</span>
              </div>
            </div>

            <!-- Admission & Stay Counter -->
            <div class="stay-counter-row font-mono-numbers">
              <span class="stay-time">⏱️ {{ formatTimeAgo(box.hospitalization.admission_date) }}</span>
              <span class="stay-vet">👨‍⚕️ {{ box.hospitalization.vet?.name || 'Dr. Médico de Guardia' }}</span>
            </div>

            <!-- Action Buttons for Occupied Bed -->
            <div class="bed-actions-grid">
              <button
                type="button"
                class="btn-kardex"
                @click="openKardex(box.hospitalization)"
              >
                📋 Kardex 24h
              </button>
              <button
                type="button"
                class="btn-quick-entry"
                @click="openQuickEntry(box.hospitalization)"
                title="Registrar signos vitales o dosis aplicada"
              >
                💉 Toma de Signos
              </button>
              <button
                type="button"
                class="btn-discharge"
                @click="openDischargeModal(box.hospitalization)"
                title="Egresar y dar de alta médica"
              >
                🚪 Alta Médica
              </button>
            </div>
          </div>

          <!-- AVAILABLE STATE: Empty Bed with Quick Admit -->
          <div v-else class="empty-bed-card">
            <div class="empty-bed-visual">
              <span class="empty-bed-icon">🛏️</span>
              <p class="empty-bed-txt">Box higienizado y listo para recibir paciente</p>
              <span class="rate-tag font-mono-numbers">Arancel: {{ formatUsd(box.daily_rate_usd || 25) }}/día</span>
            </div>
            <button
              type="button"
              class="btn-admit-here"
              @click="openAdmitModal(box)"
            >
              🐾 Ingresar Paciente aquí
            </button>
          </div>

        </div>
      </div>

    </div>

    <!-- ================================================================= -->
    <!-- MODAL 1: ADMIT PATIENT TO BOX -->
    <!-- ================================================================= -->
    <div v-if="isAdmitModalOpen" class="modal-backdrop" @click.self="isAdmitModalOpen = false">
      <div class="modal-dialog modal-dialog--md">
        <div class="modal-head">
          <div class="modal-head-title">
            <span class="modal-head-icon">🏥</span>
            <div>
              <h3>Admisión de Paciente a Hospitalización</h3>
              <p>Asignación de cama, diagnóstico inicial y pauta terapéutica</p>
            </div>
          </div>
          <button type="button" class="btn-close" @click="isAdmitModalOpen = false">✕</button>
        </div>

        <form @submit.prevent="handleAdmitPatient" class="modal-body-form">
          <div class="form-grid-2">
            <!-- Pet Selector -->
            <div class="form-group">
              <label class="form-lbl">Paciente / Mascota *</label>
              <select v-model="admitForm.pet_id" class="form-ctrl" required>
                <option value="" disabled>Selecciona un paciente...</option>
                <option v-for="pet in pets" :key="pet.id" :value="pet.id">
                  {{ pet.name }} ({{ pet.species }} - {{ pet.breed || 'Mestizo' }})
                </option>
              </select>
            </div>

            <!-- Box Selector -->
            <div class="form-group">
              <label class="form-lbl">Box / Jaula de Internación *</label>
              <select v-model="admitForm.box_id" class="form-ctrl" required>
                <option value="" disabled>Selecciona un box...</option>
                <option
                  v-for="b in boxes"
                  :key="b.id"
                  :value="b.id"
                  :disabled="b.status === 'occupied' && b.id !== selectedBox?.id"
                >
                  {{ b.code }} - {{ b.name }} ({{ b.status === 'occupied' ? 'Ocupado' : 'Disponible' }})
                </option>
              </select>
            </div>

            <!-- Doctor In Charge -->
            <div class="form-group">
              <label class="form-lbl">Médico Veterinario Responsable *</label>
              <select v-model="admitForm.vet_id" class="form-ctrl" required>
                <option value="" disabled>Selecciona un profesional...</option>
                <option v-for="prof in professionals" :key="prof.id" :value="prof.id">
                  {{ prof.name || 'Dr. Médico Veterinario' }} - {{ prof.specialty || 'Clínica Médica' }}
                </option>
              </select>
            </div>

            <!-- Patient Clinical Status -->
            <div class="form-group">
              <label class="form-lbl">Gravedad / Estado de Ingreso *</label>
              <select v-model="admitForm.status" class="form-ctrl" required>
                <option value="active">🩺 En Observación / Tratamiento Estándar</option>
                <option value="critical">🚨 Paciente Crítico (UCI / Vigilancia Estricta)</option>
                <option value="post_op">🩹 Postquirúrgico Inmediato</option>
                <option value="stable">✅ Estable en Mantenimiento</option>
              </select>
            </div>
          </div>

          <!-- Reason for admission -->
          <div class="form-group">
            <label class="form-lbl">Motivo de Hospitalización *</label>
            <textarea
              v-model="admitForm.reason_for_admission"
              class="form-ctrl form-textarea"
              rows="2"
              placeholder="Ej: Deshidratación moderada a severa secundaria a vómitos y diarrea de 48h de evolución..."
              required
            ></textarea>
          </div>

          <div class="form-grid-2">
            <!-- Presumptive Diagnosis -->
            <div class="form-group">
              <label class="form-lbl">Diagnóstico Presuntivo / Definitivo</label>
              <input
                v-model="admitForm.presumptive_diagnosis"
                type="text"
                class="form-ctrl"
                placeholder="Ej: Gastroenteritis infecciosa / Parvovirus"
              />
            </div>

            <!-- Daily Rate -->
            <div class="form-group">
              <label class="form-lbl">Arancel Diario de Estancia ($ USD)</label>
              <input
                v-model.number="admitForm.daily_cost_usd"
                type="number"
                step="0.5"
                class="form-ctrl font-mono-numbers"
              />
            </div>
          </div>

          <div class="form-grid-2">
            <!-- Fluid therapy plan -->
            <div class="form-group">
              <label class="form-lbl">💧 Plan de Fluidoterapia (Solución y ml/h)</label>
              <input
                v-model="admitForm.fluid_therapy_plan"
                type="text"
                class="form-ctrl"
                placeholder="Ej: Ringer Lactato + KCl a 35 ml/h"
              />
            </div>

            <!-- Diet instructions -->
            <div class="form-group">
              <label class="form-lbl">🍲 Plan de Alimentación</label>
              <input
                v-model="admitForm.diet_instructions"
                type="text"
                class="form-ctrl"
                placeholder="Ej: Royal Canin Recovery 25g c/6h en papilla"
              />
            </div>
          </div>

          <!-- Medication Schedule -->
          <div class="form-group">
            <label class="form-lbl">💊 Pauta Farmacológica Programada</label>
            <textarea
              v-model="admitForm.medication_schedule"
              class="form-ctrl form-textarea"
              rows="2"
              placeholder="Ej: Metronidazol 10mg/kg IV c/12h, Meloxicam 0.1mg/kg SC c/24h, Omeprazol 1mg/kg IV c/24h..."
            ></textarea>
          </div>

          <div class="modal-actions-bar">
            <button type="button" class="btn-cancel" @click="isAdmitModalOpen = false">
              Cancelar
            </button>
            <button type="submit" class="btn-submit">
              🏥 Confirmar Ingreso a Box
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- MODAL 2: QUICK VITAL SIGNS & KARDEX ENTRY -->
    <!-- ================================================================= -->
    <div v-if="isQuickEntryModalOpen" class="modal-backdrop" @click.self="isQuickEntryModalOpen = false">
      <div class="modal-dialog modal-dialog--md">
        <div class="modal-head">
          <div class="modal-head-title">
            <span class="modal-head-icon">💉</span>
            <div>
              <h3>Registrar Toma en Kardex Clínico</h3>
              <p>
                Paciente: <strong>{{ selectedHospitalization?.pet?.name }}</strong> ·
                Box: <span class="text-emerald font-mono-numbers">{{ selectedHospitalization?.box?.code }}</span>
              </p>
            </div>
          </div>
          <button type="button" class="btn-close" @click="isQuickEntryModalOpen = false">✕</button>
        </div>

        <form @submit.prevent="handleSaveKardexEntry" class="modal-body-form">
          <!-- Time & Entry Type -->
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-lbl">Fecha y Hora de la Medición *</label>
              <input v-model="entryForm.recorded_at" type="datetime-local" class="form-ctrl font-mono-numbers" required />
            </div>

            <div class="form-group">
              <label class="form-lbl">Tipo de Registro</label>
              <select v-model="entryForm.entry_type" class="form-ctrl">
                <option value="vitals">🩺 Constantes Vitales & Monitoreo</option>
                <option value="medication">💊 Administración de Fármaco</option>
                <option value="fluids">💧 Ajuste / Revisión de Fluidoterapia</option>
                <option value="feeding_elimination">🥣 Alimentación y Eliminaciones</option>
                <option value="evolution_note">📝 Nota de Evolución Médica</option>
              </select>
            </div>
          </div>

          <!-- Vital Signs Strip -->
          <div class="vitals-input-section">
            <h4 class="section-subtitle">🩺 Constantes Vitales</h4>
            <div class="vitals-inputs-grid">
              <div class="v-input-card">
                <span class="v-icon">🌡️</span>
                <label class="v-lbl">T° (°C)</label>
                <input v-model.number="entryForm.temperature" type="number" step="0.1" class="v-field font-mono-numbers" />
              </div>

              <div class="v-input-card">
                <span class="v-icon">💓</span>
                <label class="v-lbl">FC (lpm)</label>
                <input v-model.number="entryForm.heart_rate" type="number" class="v-field font-mono-numbers" />
              </div>

              <div class="v-input-card">
                <span class="v-icon">🫁</span>
                <label class="v-lbl">FR (rpm)</label>
                <input v-model.number="entryForm.respiratory_rate" type="number" class="v-field font-mono-numbers" />
              </div>

              <div class="v-input-card">
                <span class="v-icon">🩸</span>
                <label class="v-lbl">PA (S/D)</label>
                <div class="flex gap-1">
                  <input v-model.number="entryForm.blood_pressure_sys" type="number" class="v-field font-mono-numbers" placeholder="120" />
                  <input v-model.number="entryForm.blood_pressure_dia" type="number" class="v-field font-mono-numbers" placeholder="80" />
                </div>
              </div>

              <div class="v-input-card">
                <span class="v-icon">⚡</span>
                <label class="v-lbl">Dolor (0-4)</label>
                <select v-model.number="entryForm.pain_score" class="v-field">
                  <option :value="0">0 (Nulo)</option>
                  <option :value="1">1 (Leve)</option>
                  <option :value="2">2 (Moderado)</option>
                  <option :value="3">3 (Severo)</option>
                  <option :value="4">4 (Extremo)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Medications & Fluids -->
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-lbl">Fármaco Administrado (Opcional)</label>
              <input
                v-model="entryForm.medication_name"
                type="text"
                class="form-ctrl"
                placeholder="Ej: Meloxicam 0.5mg / Tramadol 15mg"
              />
            </div>

            <div class="form-group">
              <label class="form-lbl">Dosis & Vía de Aplicación</label>
              <div class="flex gap-2">
                <input
                  v-model="entryForm.dose_given"
                  type="text"
                  class="form-ctrl"
                  placeholder="Ej: 0.8 ml"
                />
                <select v-model="entryForm.route" class="form-ctrl w-28">
                  <option value="IV">IV</option>
                  <option value="SC">SC</option>
                  <option value="IM">IM</option>
                  <option value="PO">Oral</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Fluid Rate & Physiological State -->
          <div class="form-grid-3">
            <div class="form-group">
              <label class="form-lbl">💧 Infusión (ml/h)</label>
              <input
                v-model.number="entryForm.fluid_rate_ml_hr"
                type="number"
                step="0.5"
                class="form-ctrl font-mono-numbers"
              />
            </div>

            <div class="form-group">
              <label class="form-lbl">💦 Micción</label>
              <select v-model="entryForm.urination" class="form-ctrl">
                <option value="normal">Normal ✅</option>
                <option value="ausente">Ausente ❌</option>
                <option value="hematuria">Hematuria ⚠️</option>
                <option value="con_sonda">Con Sonda 🩺</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-lbl">💩 Deposición</label>
              <select v-model="entryForm.defecation" class="form-ctrl">
                <option value="normal">Normal ✅</option>
                <option value="ausente">Ausente ❌</option>
                <option value="diarrea">Diarrea ⚠️</option>
                <option value="melena">Melena 🚨</option>
              </select>
            </div>
          </div>

          <!-- Evolution Notes -->
          <div class="form-group">
            <label class="form-lbl">Notas Clínicas y Observación de la Enfermería/Médico *</label>
            <textarea
              v-model="entryForm.notes"
              class="form-ctrl form-textarea"
              rows="2"
              placeholder="Describir actitud, respuesta a estímulos, tolerancia a fluidos..."
              required
            ></textarea>
          </div>

          <div class="modal-actions-bar">
            <button type="button" class="btn-cancel" @click="isQuickEntryModalOpen = false">
              Cancelar
            </button>
            <button type="submit" class="btn-submit">
              💾 Guardar en Kardex
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- DRAWER / MODAL 3: FULL 24H KARDEX SHEET -->
    <!-- ================================================================= -->
    <div v-if="isKardexDrawerOpen" class="modal-backdrop" @click.self="isKardexDrawerOpen = false">
      <div class="modal-dialog modal-dialog--lg">
        <!-- Kardex Header -->
        <div class="modal-head modal-head--kardex">
          <div class="kardex-banner-left">
            <span class="kardex-badge font-mono-numbers">{{ selectedHospitalization?.box?.code || 'BOX-01' }}</span>
            <div>
              <h2 class="kardex-patient-name">
                Hoja de Kardex & Monitoreo 24h: {{ selectedHospitalization?.pet?.name }}
              </h2>
              <p class="kardex-patient-sub">
                {{ selectedHospitalization?.pet?.species }} · {{ selectedHospitalization?.pet?.breed || 'Mestizo' }} ·
                Tutor: {{ selectedHospitalization?.pet?.owner?.name || 'Cliente MedVet' }}
              </p>
            </div>
          </div>

          <div class="kardex-actions-top">
            <button type="button" class="btn-print-sm" @click="printKardexSheet" title="Imprimir hoja clínica">
              🖨️ Imprimir Hoja
            </button>
            <button
              type="button"
              class="btn-primary-sm"
              @click="openQuickEntry(selectedHospitalization)"
            >
              ➕ Nueva Medición
            </button>
            <button type="button" class="btn-close" @click="isKardexDrawerOpen = false">✕</button>
          </div>
        </div>

        <!-- Clinical Orders Banner -->
        <div class="kardex-orders-grid">
          <div class="order-box">
            <span class="order-title">📋 Diagnóstico:</span>
            <p>{{ selectedHospitalization?.definitive_diagnosis || selectedHospitalization?.presumptive_diagnosis || 'En estudio' }}</p>
          </div>
          <div class="order-box">
            <span class="order-title">💧 Fluidoterapia:</span>
            <p class="text-cyan font-mono-numbers">{{ selectedHospitalization?.fluid_therapy_plan || 'Sin plan activo' }}</p>
          </div>
          <div class="order-box">
            <span class="order-title">🍲 Dieta Pautada:</span>
            <p>{{ selectedHospitalization?.diet_instructions || 'NPO / Ayuno' }}</p>
          </div>
          <div class="order-box">
            <span class="order-title">💊 Farmacoterapia:</span>
            <p>{{ selectedHospitalization?.medication_schedule || 'Sin pauta' }}</p>
          </div>
        </div>

        <!-- Kardex Timeline Table -->
        <div class="kardex-table-wrap">
          <div v-if="loadingKardex" class="loading-state">
            <div class="spinner"></div>
            <p>Cargando mediciones horarias...</p>
          </div>

          <div v-else-if="selectedKardexEntries.length === 0" class="empty-state">
            <p>No hay mediciones registradas en el Kardex aún.</p>
            <button type="button" class="btn-primary" @click="openQuickEntry(selectedHospitalization)">
              Registrar Primera Medición
            </button>
          </div>

          <table v-else class="kardex-table font-mono-numbers">
            <thead>
              <tr>
                <th>Hora</th>
                <th>T°</th>
                <th>FC</th>
                <th>FR</th>
                <th>PA (PAM)</th>
                <th>Dolor</th>
                <th>Fármaco / Dosis</th>
                <th>Fluidos</th>
                <th>Micción / Heces</th>
                <th>Notas de Evolución</th>
                <th>Firma</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in selectedKardexEntries" :key="entry.id">
                <td class="td-time font-bold">{{ formatDate(entry.recorded_at) }}</td>
                <td :class="entry.temperature > 39.2 ? 'text-red font-bold' : (entry.temperature < 37.5 ? 'text-blue font-bold' : '')">
                  {{ entry.temperature ? `${entry.temperature}°C` : '—' }}
                </td>
                <td>{{ entry.heart_rate ? `${entry.heart_rate} lpm` : '—' }}</td>
                <td>{{ entry.respiratory_rate ? `${entry.respiratory_rate} rpm` : '—' }}</td>
                <td>
                  {{ entry.blood_pressure_sys ? `${entry.blood_pressure_sys}/${entry.blood_pressure_dia}` : '—' }}
                </td>
                <td>
                  <span class="pain-chip" :class="`pain-${entry.pain_score || 0}`">
                    {{ entry.pain_score ?? 0 }}/4
                  </span>
                </td>
                <td class="font-sans">
                  <span v-if="entry.medication_name" class="font-semibold text-emerald">
                    {{ entry.medication_name }} ({{ entry.dose_given }} {{ entry.route }})
                  </span>
                  <span v-else class="text-gray-500">—</span>
                </td>
                <td class="text-cyan">
                  {{ entry.fluid_rate_ml_hr ? `${entry.fluid_rate_ml_hr} ml/h` : '—' }}
                </td>
                <td class="font-sans">
                  <span>{{ entry.urination || '—' }} / {{ entry.defecation || '—' }}</span>
                </td>
                <td class="font-sans td-notes">
                  {{ entry.notes }}
                </td>
                <td class="font-sans text-xs text-gray-400">
                  {{ entry.professional?.name || 'Dr. Médico' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

    <!-- ================================================================= -->
    <!-- MODAL 4: DISCHARGE PATIENT -->
    <!-- ================================================================= -->
    <div v-if="isDischargeModalOpen" class="modal-backdrop" @click.self="isDischargeModalOpen = false">
      <div class="modal-dialog modal-dialog--md">
        <div class="modal-head">
          <div class="modal-head-title">
            <span class="modal-head-icon">🚪</span>
            <div>
              <h3>Alta Médica Hospitalaria</h3>
              <p>Egreso del paciente y liberación del Box</p>
            </div>
          </div>
          <button type="button" class="btn-close" @click="isDischargeModalOpen = false">✕</button>
        </div>

        <form @submit.prevent="handleDischargePatient" class="modal-body-form">
          <div class="form-group">
            <label class="form-lbl">Fecha y Hora de Egreso *</label>
            <input v-model="dischargeForm.discharge_date" type="datetime-local" class="form-ctrl font-mono-numbers" required />
          </div>

          <div class="form-group">
            <label class="form-lbl">Epicrisis / Resumen Clínico de Egreso *</label>
            <textarea
              v-model="dischargeForm.discharge_summary"
              class="form-ctrl form-textarea"
              rows="3"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-lbl">Indicaciones y Cuidados para el Tutor en Casa *</label>
            <textarea
              v-model="dischargeForm.home_care_instructions"
              class="form-ctrl form-textarea"
              rows="3"
              placeholder="Posología de fármacos orales, dieta recomendada, pautas de alarma..."
              required
            ></textarea>
          </div>

          <div class="modal-actions-bar">
            <button type="button" class="btn-cancel" @click="isDischargeModalOpen = false">
              Cancelar
            </button>
            <button type="submit" class="btn-submit btn-submit--emerald">
              ✅ Emitir Alta Médica & Liberar Box
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
.hosp-page {
  position: relative;
  min-height: 100vh;
  padding: 1.5rem;
  background: #0f172a;
  color: #f8fafc;
}

.hosp-ambient-glow {
  position: absolute;
  top: 0;
  left: 15%;
  right: 15%;
  height: 250px;
  background: radial-gradient(ellipse at top, rgba(16, 185, 129, 0.12), transparent 70%);
  pointer-events: none;
}

.hosp-container {
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Header */
.hosp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.beacon-box {
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.beacon-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 18px;
  background: rgba(16, 185, 129, 0.2);
  animation: pulse-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 0; }
  100% { transform: scale(0.95); opacity: 0; }
}

.header-badge-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.badge-live {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.35);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.badge-rate {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.header-sub {
  font-size: 0.85rem;
  color: #94a3b8;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: #cbd5e1;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: rgba(51, 65, 85, 0.9);
  color: #ffffff;
}

/* KPI Strip */
.kpi-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.kpi-card {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.12);
  backdrop-filter: blur(12px);
  border-radius: 14px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  position: relative;
  overflow: hidden;
}

.kpi-icon {
  font-size: 1.6rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.kpi-val {
  display: block;
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
}

.kpi-lbl {
  font-size: 0.75rem;
  color: #94a3b8;
  font-family: inherit;
}

.kpi-bar-wrap {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
}

.kpi-bar {
  height: 100%;
  background: #10b981;
}

/* Toolbar */
.toolbar-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-tabs {
  display: flex;
  gap: 0.4rem;
  background: rgba(30, 41, 59, 0.8);
  padding: 4px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.12);
  flex-wrap: wrap;
}

.tab-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.45rem 0.85rem;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn--active {
  background: #10b981;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.search-input-wrap {
  position: relative;
  min-width: 280px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #64748b;
}

.search-input {
  width: 100%;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 10px;
  padding: 0.5rem 1rem 0.5rem 2.2rem;
  color: #ffffff;
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #10b981;
}

/* Boxes Grid */
.boxes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.25rem;
}

.box-card {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.12);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;
  position: relative;
}

.box-card:hover {
  transform: translateY(-2px);
  border-color: rgba(16, 185, 129, 0.3);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

.box-card--occupied {
  border-left: 4px solid #ef4444;
}

.box-card--available {
  border-left: 4px solid #10b981;
}

.box-card--critical {
  border-left: 4px solid #f59e0b;
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.15);
}

.box-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.box-identity {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.box-code-pill {
  background: #1e293b;
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #f8fafc;
  font-weight: 800;
  font-size: 0.75rem;
  padding: 2px 7px;
  border-radius: 6px;
}

.box-type-pill {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 6px;
}

.badge--icu { background: rgba(239, 68, 68, 0.18); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
.badge--iso { background: rgba(245, 158, 11, 0.18); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
.badge--fel { background: rgba(168, 85, 247, 0.18); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }
.badge--can { background: rgba(59, 130, 246, 0.18); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
.badge--post { background: rgba(20, 184, 166, 0.18); color: #2dd4bf; border: 1px solid rgba(20, 184, 166, 0.3); }
.badge--std { background: rgba(100, 116, 139, 0.2); color: #cbd5e1; border: 1px solid rgba(100, 116, 139, 0.3); }

.box-status-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot--occ { background: #ef4444; box-shadow: 0 0 8px #ef4444; }
.status-dot--avail { background: #10b981; box-shadow: 0 0 8px #10b981; }

.box-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0.2rem 0;
}

.box-features {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Patient in bed */
.patient-in-bed {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 12px;
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.patient-header-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.patient-avatar-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}

.patient-details {
  flex: 1;
  min-width: 0;
}

.p-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.p-title {
  font-size: 1rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.p-status-badge {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 5px;
}

.status--crit { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid #ef4444; }
.status--post { background: rgba(20, 184, 166, 0.2); color: #2dd4bf; border: 1px solid #14b8a6; }
.status--stab { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid #10b981; }
.status--act { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid #38bdf8; }

.p-meta {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
}

.p-tutor {
  font-size: 0.72rem;
  color: #cbd5e1;
  margin: 0;
}

/* Clinical Memo */
.clinical-memo-box {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.memo-row {
  display: flex;
  gap: 0.4rem;
}

.memo-tag {
  color: #94a3b8;
  font-weight: 600;
  flex-shrink: 0;
}

.memo-val {
  color: #f1f5f9;
}

.text-cyan { color: #38bdf8; }
.text-emerald { color: #34d399; }
.text-red { color: #f87171; }
.text-blue { color: #60a5fa; }

.stay-counter-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: #cbd5e1;
  border-top: 1px dashed rgba(148, 163, 184, 0.15);
  padding-top: 0.4rem;
}

/* Bed Actions */
.bed-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.4rem;
  margin-top: 0.25rem;
}

.btn-kardex {
  background: #0284c7;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.45rem 0.6rem;
  border-radius: 7px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-kardex:hover {
  background: #0369a1;
}

.btn-quick-entry {
  background: #10b981;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.45rem 0.6rem;
  border-radius: 7px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-quick-entry:hover {
  background: #059669;
}

.btn-discharge {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #f87171;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.45rem 0.6rem;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-discharge:hover {
  background: #ef4444;
  color: #ffffff;
}

/* Empty Bed Card */
.empty-bed-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  text-align: center;
  background: rgba(15, 23, 42, 0.4);
  border: 1px dashed rgba(16, 185, 129, 0.25);
  border-radius: 12px;
  gap: 0.75rem;
}

.empty-bed-icon {
  font-size: 2rem;
  display: block;
}

.empty-bed-txt {
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0;
}

.rate-tag {
  font-size: 0.75rem;
  color: #34d399;
  font-weight: 700;
}

.btn-admit-here {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid #10b981;
  color: #34d399;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-admit-here:hover {
  background: #10b981;
  color: #ffffff;
}

/* MODALS */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-dialog {
  background: #1e293b;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 18px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
}

.modal-dialog--md { max-width: 680px; }
.modal-dialog--lg { max-width: 1080px; }

.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
}

.modal-head-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-head-title h3 {
  font-size: 1.15rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.modal-head-title p {
  font-size: 0.78rem;
  color: #94a3b8;
  margin: 0;
}

.modal-head-icon {
  font-size: 1.8rem;
}

.btn-close {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
}

.btn-close:hover { color: #ffffff; }

.modal-body-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-lbl {
  font-size: 0.75rem;
  font-weight: 700;
  color: #cbd5e1;
}

.form-ctrl {
  background: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  padding: 0.55rem 0.85rem;
  color: #ffffff;
  font-size: 0.85rem;
  outline: none;
}

.form-ctrl:focus {
  border-color: #10b981;
}

.form-textarea {
  resize: vertical;
}

/* Vitals Inputs Strip */
.vitals-input-section {
  background: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 12px;
  padding: 0.9rem;
}

.section-subtitle {
  font-size: 0.8rem;
  font-weight: 700;
  color: #38bdf8;
  margin: 0 0 0.6rem 0;
}

.vitals-inputs-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
}

.v-input-card {
  background: #1e293b;
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 8px;
  padding: 0.5rem;
  text-align: center;
}

.v-icon { font-size: 1rem; }

.v-lbl {
  display: block;
  font-size: 0.68rem;
  color: #94a3b8;
  font-weight: 600;
}

.v-field {
  width: 100%;
  background: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 6px;
  padding: 0.35rem 0.2rem;
  color: #ffffff;
  font-size: 0.85rem;
  text-align: center;
  outline: none;
}

.modal-actions-bar {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
}

.btn-cancel {
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0.55rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}

.btn-submit {
  background: #10b981;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.55rem 1.2rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.btn-submit--emerald { background: #10b981; }

/* KARDEX SHEET DRAWER SPECIFICS */
.modal-head--kardex {
  background: #0f172a;
}

.kardex-banner-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.kardex-badge {
  background: #10b981;
  color: #ffffff;
  font-weight: 800;
  font-size: 0.85rem;
  padding: 4px 10px;
  border-radius: 8px;
}

.kardex-patient-name {
  font-size: 1.2rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.kardex-patient-sub {
  font-size: 0.78rem;
  color: #94a3b8;
  margin: 0;
}

.kardex-actions-top {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.btn-print-sm {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
}

.btn-primary-sm {
  background: #10b981;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.kardex-orders-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #152238;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
}

.order-box {
  font-size: 0.75rem;
}

.order-title {
  font-weight: 700;
  color: #94a3b8;
  display: block;
}

.order-box p {
  margin: 0.15rem 0 0 0;
  color: #f1f5f9;
}

/* Kardex Table */
.kardex-table-wrap {
  padding: 1rem 1.5rem;
  overflow-x: auto;
}

.kardex-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}

.kardex-table th {
  background: #0f172a;
  color: #94a3b8;
  font-weight: 700;
  text-align: left;
  padding: 0.6rem 0.75rem;
  border-bottom: 2px solid rgba(148, 163, 184, 0.2);
}

.kardex-table td {
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.td-time { color: #f8fafc; }
.td-notes { max-width: 250px; color: #cbd5e1; }

.pain-chip {
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.pain-0 { background: rgba(16, 185, 129, 0.2); color: #34d399; }
.pain-1 { background: rgba(56, 189, 248, 0.2); color: #38bdf8; }
.pain-2 { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
.pain-3 { background: rgba(239, 68, 68, 0.2); color: #f87171; }
.pain-4 { background: #ef4444; color: #ffffff; }

/* States */
.loading-state, .empty-state {
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(16, 185, 129, 0.2);
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .boxes-grid { grid-template-columns: 1fr; }
  .form-grid-2, .form-grid-3, .kardex-orders-grid { grid-template-columns: 1fr; }
  .vitals-inputs-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
