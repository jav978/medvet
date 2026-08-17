<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const { $feathers } = useNuxtApp()
const toast = useToastNotification()
const { formatUsd, formatVes, bcvRate } = useCurrency()

// State
const loading = ref(true)
const groomingRecords = ref<any[]>([])
const pets = ref<any[]>([])
const stylists = ref<any[]>([])

// Modal for new grooming appointment
const isNewGroomingModalOpen = ref(false)
const groomingForm = ref({
  pet_id: '',
  stylist_id: '',
  service_name: 'Baño Cosmético & Corte Higiénico',
  appointment_date: new Date().toISOString().split('T')[0],
  start_time: '10:00',
  coat_condition: 'normal',
  temperament: 'docil',
  special_shampoo: 'Hipoalergénico con Avena',
  haircut_style: 'Corte Higiénico y Despeje Plantar',
  price_usd: 20.00,
  special_instructions: '',
  notes: ''
})

// Modal for WhatsApp notification
const isWaNotifyModalOpen = ref(false)
const selectedRecord = ref<any | null>(null)
const waMessageText = ref('')

// Load Data
const fetchData = async () => {
  loading.value = true
  try {
    if ($feathers) {
      // 1. Grooming Records
      try {
        const gRes = await $feathers.service('grooming-records').find({
          query: { $sort: { appointment_date: -1, start_time: 1 } }
        })
        groomingRecords.value = Array.isArray(gRes) ? gRes : (gRes.data || [])
      } catch (e) {
        console.warn('Fallback grooming records', e)
      }

      // 2. Pets
      try {
        const petsRes = await $feathers.service('pets').find({
          query: { $limit: 100 }
        })
        pets.value = Array.isArray(petsRes) ? petsRes : (petsRes.data || [])
      } catch (e) {
        console.warn('Fallback pets', e)
      }

      // 3. Stylists / Professionals
      try {
        const profRes = await $feathers.service('professionals').find({
          query: { $limit: 50 }
        })
        stylists.value = Array.isArray(profRes) ? profRes : (profRes.data || [])
      } catch (e) {
        console.warn('Fallback stylists', e)
      }
    }
  } catch (error: any) {
    console.error('Error fetching grooming data:', error)
  } finally {
    loading.value = false
  }
}

// Kanban Columns Computed
const waitingList = computed(() => groomingRecords.value.filter(r => r.status === 'waiting'))
const inBathList = computed(() => groomingRecords.value.filter(r => r.status === 'in_bath'))
const inDryingList = computed(() => groomingRecords.value.filter(r => r.status === 'drying_cutting'))
const readyList = computed(() => groomingRecords.value.filter(r => r.status === 'ready'))
const deliveredList = computed(() => groomingRecords.value.filter(r => r.status === 'delivered'))

// Summary KPIs
const totalToday = computed(() => groomingRecords.value.length)
const totalIncomeUsd = computed(() => groomingRecords.value.reduce((acc, curr) => acc + Number(curr.price_usd || 0), 0))

// Advance Status
const advanceStatus = async (record: any, nextStatus: string) => {
  try {
    if ($feathers) {
      await $feathers.service('grooming-records').patch(record.id, {
        status: nextStatus
      })

      if (nextStatus === 'ready') {
        openWaNotify(record)
      } else {
        toast.success('Estado Actualizado', `Paciente trasladado a ${getStatusLabel(nextStatus)}.`)
      }
      await fetchData()
    }
  } catch (error: any) {
    console.error('Error updating status:', error)
    toast.error('Error', error.message || 'No se pudo actualizar el estado.')
  }
}

// Open WhatsApp Notification
const openWaNotify = (record: any) => {
  selectedRecord.value = record
  const tutorName = record.pet?.owner?.name || 'Estimado Tutor'
  const petName = record.pet?.name || 'su mascota'
  const serviceName = record.service_name || 'Peluquería & Spa'

  waMessageText.value = `🛁✨ *¡Tu consentido/a ya está listo! - MedVet Spa & Grooming*\n\nHola ${tutorName}, te informamos con alegría que *${petName}* ha finalizado su sesión de *${serviceName}*. ¡Quedó impecable, limpio y perfumado! 🐶💖\n\n⏰ Ya puedes pasar a retirarlo/a por nuestra sede.\n¡Gracias por confiar en MedVet!`

  isWaNotifyModalOpen.value = true
}

// Trigger WhatsApp Web / Direct Send
const sendWaMessage = async () => {
  if (!selectedRecord.value) return

  let cleanPhone = (selectedRecord.value.pet?.owner?.phone || '').replace(/[^0-9]/g, '')
  if (cleanPhone && !cleanPhone.startsWith('58') && !cleanPhone.startsWith('1') && cleanPhone.length === 10) {
    cleanPhone = '58' + cleanPhone
  }

  const encodedText = encodeURIComponent(waMessageText.value)
  const waUrl = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`

  // Log notification in database
  try {
    if ($feathers) {
      await $feathers.service('notifications-log').create({
        recipient_name: selectedRecord.value.pet?.owner?.name || 'Tutor',
        recipient_phone: selectedRecord.value.pet?.owner?.phone,
        recipient_email: selectedRecord.value.pet?.owner?.email,
        channel: 'whatsapp',
        type: 'grooming_ready',
        subject: 'Aviso Mascota Lista en Peluquería',
        message_body: waMessageText.value,
        status: 'sent',
        sent_at: new Date()
      })
    }
  } catch (e) {
    console.warn('Could not log grooming ready message:', e)
  }

  window.open(waUrl, '_blank')
  toast.success('WhatsApp Preparado', 'Se abrió la conversación para notificar al tutor.')
  isWaNotifyModalOpen.value = false
}

// Open New Grooming Modal
const openNewGroomingModal = () => {
  groomingForm.value = {
    pet_id: '',
    stylist_id: stylists.value[0]?.id || '',
    service_name: 'Baño Cosmético & Corte Higiénico',
    appointment_date: new Date().toISOString().split('T')[0],
    start_time: '10:00',
    coat_condition: 'normal',
    temperament: 'docil',
    special_shampoo: 'Hipoalergénico con Avena',
    haircut_style: 'Corte Higiénico y Despeje Plantar',
    price_usd: 20.00,
    special_instructions: '',
    notes: ''
  }
  isNewGroomingModalOpen.value = true
}

// Submit New Grooming Appointment
const handleCreateGrooming = async () => {
  if (!groomingForm.value.pet_id) {
    toast.error('Datos Incompletos', 'Por favor selecciona una mascota.')
    return
  }

  try {
    if ($feathers) {
      await $feathers.service('grooming-records').create({
        ...groomingForm.value,
        status: 'waiting'
      })

      toast.success('Turno de Peluquería Creado', 'El paciente ha sido ingresado al tablero de spa.')
      isNewGroomingModalOpen.value = false
      await fetchData()
    }
  } catch (error: any) {
    console.error('Error creating grooming record:', error)
    toast.error('Error', error.message || 'No se pudo agendar el turno.')
  }
}

// Helpers
const getStatusLabel = (st: string) => {
  switch (st) {
    case 'waiting': return 'En Espera ⏳'
    case 'in_bath': return 'En Baño 🛁'
    case 'drying_cutting': return 'En Secado y Corte ✂️'
    case 'ready': return 'Listo para Retiro 🔔'
    case 'delivered': return 'Entregado ✅'
    default: return st
  }
}

const getCoatBadge = (cond: string) => {
  switch (cond) {
    case 'dermatitis': return { label: 'Dermatitis / Piel Sensible ⚠️', class: 'coat--derm' }
    case 'nudos_severos': return { label: 'Nudos Severos 🧶', class: 'coat--knots' }
    case 'enredado': return { label: 'Enredado 🪮', class: 'coat--tang' }
    case 'ectoparasitos': return { label: 'Ectoparásitos / Pulgas 🐜', class: 'coat--bugs' }
    default: return { label: 'Manto Saludable ✨', class: 'coat--norm' }
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="groom-page">
    <div class="groom-ambient-glow"></div>

    <div class="groom-container">
      
      <!-- Top Header -->
      <div class="groom-header">
        <div class="header-left">
          <div class="beacon-box">
            <span class="beacon-pulse"></span>
            <span class="beacon-icon">🛁</span>
          </div>
          <div>
            <div class="header-badge-row">
              <span class="badge-live">PELUQUERÍA, ESTÉTICA & PET SPA</span>
              <span class="badge-rate font-mono-numbers">BCV: {{ formatVes(1 * bcvRate) }} / USD</span>
            </div>
            <h1 class="header-title">Gestión de Peluquería Canina & Felina</h1>
            <p class="header-sub">Flujo de spa en vivo, control de manto, corte de raza y aviso automático por WhatsApp</p>
          </div>
        </div>

        <div class="header-actions">
          <button type="button" class="btn-primary" @click="openNewGroomingModal">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Turno de Spa
          </button>
          <NuxtLink to="/admin/notifications" class="btn-ghost">
            📲 Centro de WhatsApp
          </NuxtLink>
        </div>
      </div>

      <!-- KPI Summary Strip -->
      <div class="kpi-strip font-mono-numbers">
        <div class="kpi-card kpi-card--tot">
          <div class="kpi-icon">✂️</div>
          <div class="kpi-info">
            <span class="kpi-val">{{ totalToday }}</span>
            <span class="kpi-lbl">Turnos Programados</span>
          </div>
        </div>

        <div class="kpi-card kpi-card--bath">
          <div class="kpi-icon">🛁</div>
          <div class="kpi-info">
            <span class="kpi-val">{{ inBathList.length }}</span>
            <span class="kpi-lbl">En Tina & Hidromasaje</span>
          </div>
        </div>

        <div class="kpi-card kpi-card--dry">
          <div class="kpi-icon">🪮</div>
          <div class="kpi-info">
            <span class="kpi-val">{{ inDryingList.length }}</span>
            <span class="kpi-lbl">En Secado & Corte</span>
          </div>
        </div>

        <div class="kpi-card kpi-card--rdy">
          <div class="kpi-icon">🔔</div>
          <div class="kpi-info">
            <span class="kpi-val">{{ readyList.length }}</span>
            <span class="kpi-lbl">Listos para Retiro</span>
          </div>
        </div>

        <div class="kpi-card kpi-card--fin">
          <div class="kpi-icon">💵</div>
          <div class="kpi-info">
            <span class="kpi-val">{{ formatUsd(totalIncomeUsd) }}</span>
            <span class="kpi-lbl">Facturación Estimada</span>
          </div>
        </div>
      </div>

      <!-- KANBAN BOARD -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando flujo de peluquería y spa...</p>
      </div>

      <div v-else class="kanban-board">
        
        <!-- COLUMN 1: WAITING -->
        <div class="kanban-col">
          <div class="col-header col-header--wait">
            <div class="col-title-group">
              <span class="col-dot"></span>
              <h3>En Espera / Recepción</h3>
            </div>
            <span class="col-count font-mono-numbers">{{ waitingList.length }}</span>
          </div>

          <div class="cards-stack">
            <div v-if="waitingList.length === 0" class="col-empty">
              <span>Sin pacientes en espera</span>
            </div>

            <div
              v-for="item in waitingList"
              :key="item.id"
              class="groom-card"
            >
              <div class="card-head">
                <div class="pet-id-wrap">
                  <span class="pet-icon">{{ item.pet?.species?.toLowerCase().includes('fel') ? '🐱' : '🐕' }}</span>
                  <div>
                    <h4 class="pet-name">{{ item.pet?.name || 'Mascota' }}</h4>
                    <span class="pet-sub">{{ item.pet?.species }} · {{ item.pet?.breed || 'Mestizo' }}</span>
                  </div>
                </div>
                <span class="price-pill font-mono-numbers">{{ formatUsd(item.price_usd || 20) }}</span>
              </div>

              <div class="service-pill-row">
                <span class="service-name-tag">✂️ {{ item.service_name }}</span>
                <span class="coat-tag" :class="getCoatBadge(item.coat_condition).class">
                  {{ getCoatBadge(item.coat_condition).label }}
                </span>
              </div>

              <p class="tutor-info">
                👤 {{ item.pet?.owner?.name || 'Cliente' }} · 📞 {{ item.pet?.owner?.phone || 'S/N' }}
              </p>

              <div class="card-footer-actions">
                <button
                  type="button"
                  class="btn-step btn-step--bath"
                  @click="advanceStatus(item, 'in_bath')"
                >
                  🛁 Pasar a Baño
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- COLUMN 2: IN BATH -->
        <div class="kanban-col">
          <div class="col-header col-header--bath">
            <div class="col-title-group">
              <span class="col-dot"></span>
              <h3>En Baño & Tina</h3>
            </div>
            <span class="col-count font-mono-numbers">{{ inBathList.length }}</span>
          </div>

          <div class="cards-stack">
            <div v-if="inBathList.length === 0" class="col-empty">
              <span>Sin mascotas en tina</span>
            </div>

            <div
              v-for="item in inBathList"
              :key="item.id"
              class="groom-card groom-card--in-bath"
            >
              <div class="card-head">
                <div class="pet-id-wrap">
                  <span class="pet-icon">🛁</span>
                  <div>
                    <h4 class="pet-name">{{ item.pet?.name || 'Mascota' }}</h4>
                    <span class="pet-sub">{{ item.pet?.breed || 'Mestizo' }}</span>
                  </div>
                </div>
                <span class="shampoo-tag">🧴 {{ item.special_shampoo || 'Hipoalergénico' }}</span>
              </div>

              <div class="service-pill-row">
                <span class="service-name-tag">✂️ {{ item.service_name }}</span>
              </div>

              <p class="instructions-txt" v-if="item.special_instructions">
                ⚠️ {{ item.special_instructions }}
              </p>

              <div class="card-footer-actions">
                <button
                  type="button"
                  class="btn-step btn-step--dry"
                  @click="advanceStatus(item, 'drying_cutting')"
                >
                  🪮 Pasar a Secado & Corte
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- COLUMN 3: DRYING & CUTTING -->
        <div class="kanban-col">
          <div class="col-header col-header--dry">
            <div class="col-title-group">
              <span class="col-dot"></span>
              <h3>En Secado & Corte</h3>
            </div>
            <span class="col-count font-mono-numbers">{{ inDryingList.length }}</span>
          </div>

          <div class="cards-stack">
            <div v-if="inDryingList.length === 0" class="col-empty">
              <span>Mesa de corte libre</span>
            </div>

            <div
              v-for="item in inDryingList"
              :key="item.id"
              class="groom-card groom-card--in-cut"
            >
              <div class="card-head">
                <div class="pet-id-wrap">
                  <span class="pet-icon">✂️</span>
                  <div>
                    <h4 class="pet-name">{{ item.pet?.name || 'Mascota' }}</h4>
                    <span class="pet-sub">{{ item.haircut_style || 'Corte de Raza' }}</span>
                  </div>
                </div>
              </div>

              <div class="service-pill-row">
                <span class="service-name-tag">✂️ {{ item.service_name }}</span>
                <span class="stylist-tag">👤 {{ item.stylist?.name || 'Estilista' }}</span>
              </div>

              <div class="card-footer-actions">
                <button
                  type="button"
                  class="btn-step btn-step--ready"
                  @click="advanceStatus(item, 'ready')"
                >
                  🔔 Marcar Listo & Avisar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- COLUMN 4: READY FOR PICKUP -->
        <div class="kanban-col">
          <div class="col-header col-header--ready">
            <div class="col-title-group">
              <span class="col-dot"></span>
              <h3>Listo para Retiro</h3>
            </div>
            <span class="col-count font-mono-numbers">{{ readyList.length }}</span>
          </div>

          <div class="cards-stack">
            <div v-if="readyList.length === 0" class="col-empty">
              <span>Sin mascotas en espera de retiro</span>
            </div>

            <div
              v-for="item in readyList"
              :key="item.id"
              class="groom-card groom-card--ready"
            >
              <div class="card-head">
                <div class="pet-id-wrap">
                  <span class="pet-icon">✨</span>
                  <div>
                    <h4 class="pet-name">{{ item.pet?.name || 'Mascota' }}</h4>
                    <span class="pet-sub text-emerald">¡Limpio/a y perfumado/a!</span>
                  </div>
                </div>
                <span class="price-pill font-mono-numbers">{{ formatUsd(item.price_usd || 20) }}</span>
              </div>

              <p class="tutor-info">
                👤 Tutor: <strong>{{ item.pet?.owner?.name || 'Cliente' }}</strong>
                <span class="block font-mono-numbers text-emerald">📞 {{ item.pet?.owner?.phone || 'S/N' }}</span>
              </p>

              <div class="card-footer-actions card-footer-actions--2">
                <button
                  type="button"
                  class="btn-wa-notify"
                  @click="openWaNotify(item)"
                >
                  💬 Notificar WhatsApp
                </button>
                <button
                  type="button"
                  class="btn-deliver"
                  @click="advanceStatus(item, 'delivered')"
                >
                  ✅ Entregar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- COLUMN 5: DELIVERED -->
        <div class="kanban-col">
          <div class="col-header col-header--deliv">
            <div class="col-title-group">
              <span class="col-dot"></span>
              <h3>Entregados</h3>
            </div>
            <span class="col-count font-mono-numbers">{{ deliveredList.length }}</span>
          </div>

          <div class="cards-stack">
            <div v-if="deliveredList.length === 0" class="col-empty">
              <span>Sin entregas aún</span>
            </div>

            <div
              v-for="item in deliveredList"
              :key="item.id"
              class="groom-card groom-card--delivered"
            >
              <div class="card-head">
                <div class="pet-id-wrap">
                  <span class="pet-icon">✅</span>
                  <div>
                    <h4 class="pet-name">{{ item.pet?.name || 'Mascota' }}</h4>
                    <span class="pet-sub text-gray-400">Servicio completado</span>
                  </div>
                </div>
                <span class="price-pill font-mono-numbers">{{ formatUsd(item.price_usd || 20) }}</span>
              </div>
              <p class="tutor-info">
                👤 {{ item.pet?.owner?.name || 'Cliente' }} · {{ item.service_name }}
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- ============================================================= -->
    <!-- MODAL 1: NEW GROOMING APPOINTMENT -->
    <!-- ============================================================= -->
    <div v-if="isNewGroomingModalOpen" class="modal-backdrop" @click.self="isNewGroomingModalOpen = false">
      <div class="modal-dialog modal-dialog--md">
        <div class="modal-head">
          <div class="modal-head-title">
            <span class="modal-head-icon">✂️</span>
            <div>
              <h3>Nuevo Turno de Peluquería & Spa</h3>
              <p>Registro de servicio estético y estado de manto</p>
            </div>
          </div>
          <button type="button" class="btn-close" @click="isNewGroomingModalOpen = false">✕</button>
        </div>

        <form @submit.prevent="handleCreateGrooming" class="modal-body-form">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-lbl">Mascota / Paciente *</label>
              <select v-model="groomingForm.pet_id" class="form-ctrl" required>
                <option value="" disabled>Selecciona una mascota...</option>
                <option v-for="pet in pets" :key="pet.id" :value="pet.id">
                  {{ pet.name }} ({{ pet.species }} - {{ pet.breed || 'Mestizo' }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-lbl">Estilista Responsable</label>
              <select v-model="groomingForm.stylist_id" class="form-ctrl">
                <option value="">Cualquier estilista disponible</option>
                <option v-for="st in stylists" :key="st.id" :value="st.id">
                  {{ st.name || 'Estilista Canino' }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-lbl">Servicio de Spa / Grooming *</label>
              <select v-model="groomingForm.service_name" class="form-ctrl" required>
                <option value="Baño Cosmético & Perfumado Premium">Baño Cosmético & Perfumado Premium</option>
                <option value="Baño Dermatológico & Medicado">Baño Dermatológico & Medicado</option>
                <option value="Corte de Raza Estándar a Tijera">Corte de Raza Estándar a Tijera</option>
                <option value="Deslanado Profundo & Eliminación de Nudos">Deslanado Profundo & Eliminación de Nudos</option>
                <option value="Spa de Hidromasaje con Ozono">Spa de Hidromasaje con Ozono</option>
                <option value="Corte Higiénico y Despeje Plantar">Corte Higiénico y Despeje Plantar</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-lbl">Precio del Servicio ($ USD)</label>
              <input
                v-model.number="groomingForm.price_usd"
                type="number"
                step="1"
                class="form-ctrl font-mono-numbers"
              />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-lbl">Condición del Manto / Piel</label>
              <select v-model="groomingForm.coat_condition" class="form-ctrl">
                <option value="normal">Normal / Saludable ✨</option>
                <option value="enredado">Enredado Moderado 🪮</option>
                <option value="nudos_severos">Nudos Severos / Rastas 🧶</option>
                <option value="dermatitis">Dermatitis / Piel Irritada ⚠️</option>
                <option value="ectoparasitos">Presencia de Pulgas / Garrapatas 🐜</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-lbl">Temperamento</label>
              <select v-model="groomingForm.temperament" class="form-ctrl">
                <option value="docil">Dócil & Tranquilo 😊</option>
                <option value="nervioso">Nervioso / Miedoso 🥺</option>
                <option value="agresivo">Reactivo / Usar Bozal ⚠️</option>
                <option value="anciano">Geriátrico / Cuidado Articular 🐾</option>
              </select>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-lbl">Champú Especial</label>
              <input
                v-model="groomingForm.special_shampoo"
                type="text"
                class="form-ctrl"
                placeholder="Ej: Clorhexidina 3% / Avena Coloidal / Aloe"
              />
            </div>

            <div class="form-group">
              <label class="form-lbl">Estilo de Corte Deseado</label>
              <input
                v-model="groomingForm.haircut_style"
                type="text"
                class="form-ctrl"
                placeholder="Ej: Corte Cachorro / Schnauzer / Poodle"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-lbl">Instrucciones Especiales del Tutor</label>
            <textarea
              v-model="groomingForm.special_instructions"
              class="form-ctrl form-textarea"
              rows="2"
              placeholder="Ej: No recortar bigotes, dejar orejas largas, colocar pañuelo..."
            ></textarea>
          </div>

          <div class="modal-actions-bar">
            <button type="button" class="btn-cancel" @click="isNewGroomingModalOpen = false">
              Cancelar
            </button>
            <button type="submit" class="btn-submit">
              ✂️ Ingresar Turno de Spa
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ============================================================= -->
    <!-- MODAL 2: NOTIFY TUTOR VIA WHATSAPP -->
    <!-- ============================================================= -->
    <div v-if="isWaNotifyModalOpen" class="modal-backdrop" @click.self="isWaNotifyModalOpen = false">
      <div class="modal-dialog modal-dialog--md">
        <div class="modal-head">
          <div class="modal-head-title">
            <span class="modal-head-icon">💬</span>
            <div>
              <h3>Avisar Retiro por WhatsApp</h3>
              <p>Mascota: <strong>{{ selectedRecord?.pet?.name }}</strong> · Tutor: <strong>{{ selectedRecord?.pet?.owner?.name }}</strong></p>
            </div>
          </div>
          <button type="button" class="btn-close" @click="isWaNotifyModalOpen = false">✕</button>
        </div>

        <div class="modal-body-form">
          <div class="form-group">
            <label class="form-lbl">Teléfono del Tutor:</label>
            <input
              v-model="selectedRecord.pet.owner.phone"
              type="text"
              class="form-ctrl font-mono-numbers"
              placeholder="+584121234567"
            />
          </div>

          <div class="form-group">
            <label class="form-lbl">Mensaje Preformateado:</label>
            <textarea
              v-model="waMessageText"
              class="form-ctrl form-textarea font-sans"
              rows="6"
            ></textarea>
          </div>

          <div class="modal-actions-bar">
            <button type="button" class="btn-cancel" @click="isWaNotifyModalOpen = false">
              Cancelar
            </button>
            <button type="button" class="btn-submit btn-submit--wa" @click="sendWaMessage">
              📲 Abrir Chat & Enviar WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.groom-page {
  position: relative;
  min-height: 100vh;
  padding: 1.5rem;
  background: #0f172a;
  color: #f8fafc;
}

.groom-ambient-glow {
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 250px;
  background: radial-gradient(ellipse at top, rgba(236, 72, 153, 0.12), transparent 70%);
  pointer-events: none;
}

.groom-container {
  max-width: 1560px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Header */
.groom-header {
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
  background: rgba(236, 72, 153, 0.15);
  border: 1px solid rgba(236, 72, 153, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.beacon-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 18px;
  background: rgba(236, 72, 153, 0.2);
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
  background: rgba(236, 72, 153, 0.2);
  color: #f472b6;
  border: 1px solid rgba(236, 72, 153, 0.35);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
}

.badge-rate {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
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
  gap: 0.75rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(236, 72, 153, 0.3);
  transition: all 0.2s ease;
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
}

/* KPI Strip */
.kpi-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
  font-size: 1.3rem;
  font-weight: 800;
  color: #ffffff;
}

.kpi-lbl {
  font-size: 0.75rem;
  color: #94a3b8;
}

/* KANBAN BOARD */
.kanban-board {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  align-items: flex-start;
}

.kanban-col {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 16px;
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  min-height: 600px;
}

.col-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
}

.col-title-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.col-title-group h3 {
  font-size: 0.85rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.col-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.col-header--wait .col-dot { background: #94a3b8; }
.col-header--bath .col-dot { background: #38bdf8; }
.col-header--dry .col-dot { background: #f59e0b; }
.col-header--ready .col-dot { background: #22c55e; }
.col-header--deliv .col-dot { background: #64748b; }

.col-count {
  background: #0f172a;
  color: #94a3b8;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 6px;
}

.cards-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.col-empty {
  text-align: center;
  padding: 2rem 0.5rem;
  font-size: 0.75rem;
  color: #64748b;
  border: 1px dashed rgba(148, 163, 184, 0.1);
  border-radius: 10px;
}

/* Cards */
.groom-card {
  background: #1e293b;
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 12px;
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.groom-card:hover {
  transform: translateY(-2px);
  border-color: rgba(236, 72, 153, 0.35);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.groom-card--ready {
  border-left: 4px solid #22c55e;
}

.groom-card--in-bath {
  border-left: 4px solid #38bdf8;
}

.groom-card--in-cut {
  border-left: 4px solid #f59e0b;
}

.groom-card--delivered {
  opacity: 0.7;
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.pet-id-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pet-icon {
  font-size: 1.3rem;
}

.pet-name {
  font-size: 0.95rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.pet-sub {
  font-size: 0.7rem;
  color: #94a3b8;
  display: block;
}

.price-pill {
  background: #0f172a;
  color: #34d399;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.service-pill-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.service-name-tag {
  font-size: 0.75rem;
  color: #f1f5f9;
  font-weight: 600;
}

.coat-tag {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  width: fit-content;
}

.coat--norm { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
.coat--derm { background: rgba(239, 68, 68, 0.15); color: #f87171; }
.coat--knots { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
.coat--tang { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
.coat--bugs { background: rgba(168, 85, 247, 0.15); color: #c084fc; }

.shampoo-tag, .stylist-tag {
  font-size: 0.7rem;
  color: #cbd5e1;
}

.instructions-txt {
  font-size: 0.7rem;
  color: #fbbf24;
  margin: 0;
  background: rgba(245, 158, 11, 0.1);
  padding: 4px 6px;
  border-radius: 4px;
}

.tutor-info {
  font-size: 0.72rem;
  color: #cbd5e1;
  margin: 0;
}

.card-footer-actions {
  display: flex;
  margin-top: 0.25rem;
}

.card-footer-actions--2 {
  gap: 0.4rem;
}

.btn-step {
  width: 100%;
  border: none;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.45rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-step--bath { background: #0284c7; color: #ffffff; }
.btn-step--bath:hover { background: #0369a1; }

.btn-step--dry { background: #d97706; color: #ffffff; }
.btn-step--dry:hover { background: #b45309; }

.btn-step--ready { background: #16a34a; color: #ffffff; }
.btn-step--ready:hover { background: #15803d; }

.btn-wa-notify {
  flex: 1;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.72rem;
  padding: 0.45rem 0.5rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.btn-deliver {
  background: #334155;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.72rem;
  padding: 0.45rem 0.6rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

/* Modals */
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

.modal-dialog--md { max-width: 620px; }

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

.modal-head-icon { font-size: 1.6rem; }

.btn-close {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
}

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

.form-ctrl:focus { border-color: #ec4899; }
.form-textarea { resize: vertical; }

.modal-actions-bar {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.5rem;
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
  background: #ec4899;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.55rem 1.2rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.btn-submit--wa {
  background: linear-gradient(135deg, #25d366, #128c7e);
}

.loading-state {
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(236, 72, 153, 0.2);
  border-top-color: #ec4899;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1200px) {
  .kanban-board { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .kanban-board { grid-template-columns: 1fr; }
  .form-grid-2 { grid-template-columns: 1fr; }
}
</style>
