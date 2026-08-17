<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const { $feathers } = useNuxtApp()
const toast = useToastNotification()

// State
const loading = ref(true)
const activeTab = ref<'broadcast' | 'templates' | 'logs'>('broadcast')

const templates = ref<any[]>([])
const logs = ref<any[]>([])
const appointments = ref<any[]>([])
const hospitalizations = ref<any[]>([])
const vaccinations = ref<any[]>([])

// Filter for broadcast
const broadcastAudience = ref<'tomorrow_appointments' | 'vaccine_due' | 'hospitalized' | 'custom'>('tomorrow_appointments')
const customMessageText = ref('')

// Modal for Template Edit
const isTemplateModalOpen = ref(false)
const editingTemplate = ref<any | null>(null)
const templateForm = ref({
  code: '',
  channel: 'whatsapp',
  title: '',
  subject: '',
  template_body: '',
  description: '',
  active: true
})

// Modal for Direct Message Preview / Send
const isSendModalOpen = ref(false)
const selectedRecipient = ref<any | null>(null)
const generatedMessage = ref('')
const selectedChannel = ref<'whatsapp' | 'email'>('whatsapp')

// Fetch All Data
const fetchData = async () => {
  loading.value = true
  try {
    if ($feathers) {
      // 1. Templates
      try {
        const tRes = await $feathers.service('notification-templates').find({})
        templates.value = Array.isArray(tRes) ? tRes : (tRes.data || [])
      } catch (e) {
        console.warn('Fallback templates', e)
      }

      // 2. Logs
      try {
        const lRes = await $feathers.service('notifications-log').find({
          query: { $limit: 100, $sort: { created_at: -1 } }
        })
        logs.value = Array.isArray(lRes) ? lRes : (lRes.data || [])
      } catch (e) {
        console.warn('Fallback logs', e)
      }

      // 3. Appointments
      try {
        const appRes = await $feathers.service('appointments').find({
          query: { status: 'confirmed', $limit: 100 }
        })
        appointments.value = Array.isArray(appRes) ? appRes : (appRes.data || [])
      } catch (e) {
        console.warn('Fallback appointments', e)
      }

      // 4. Hospitalizations
      try {
        const hospRes = await $feathers.service('hospitalizations').find({
          query: { status: { $ne: 'discharged' } }
        })
        hospitalizations.value = Array.isArray(hospRes) ? hospRes : (hospRes.data || [])
      } catch (e) {
        console.warn('Fallback hospitalizations', e)
      }

      // 5. Vaccinations
      try {
        const vacRes = await $feathers.service('vaccinations').find({
          query: { $limit: 50 }
        })
        vaccinations.value = Array.isArray(vacRes) ? vacRes : (vacRes.data || [])
      } catch (e) {
        console.warn('Fallback vaccinations', e)
      }
    }
  } catch (error: any) {
    console.error('Error fetching notification center data:', error)
  } finally {
    loading.value = false
  }
}

// Tomorrow's appointments
const tomorrowAppointments = computed(() => {
  return appointments.value.filter(app => {
    // If appointment has a date or is upcoming
    return app.status !== 'cancelled'
  })
})

// Vaccine due list
const dueVaccinations = computed(() => {
  return vaccinations.value
})

// Active hospitalized patients
const activeHospitalized = computed(() => {
  return hospitalizations.value.filter(h => h.status !== 'discharged')
})

// Replace placeholders in template
const compileMessage = (templateBody: string, data: Record<string, string>) => {
  let result = templateBody || ''
  Object.keys(data).forEach(key => {
    const reg = new RegExp(`{{${key}}}`, 'g')
    result = result.replace(reg, data[key] || '')
  })
  return result
}

// Open Quick Send Modal for Appointment
const openAppointmentReminder = (app: any) => {
  const tpl = templates.value.find(t => t.code === 'appointment_reminder') || {
    template_body: '🐾 *Recordatorio de Cita Médica - MedVet*\n\nHola {{tutor_name}}, te recordamos que *{{pet_name}}* tiene una cita programada para el día *{{date}}* a las *{{time}}* para el servicio de *{{service_name}}*.'
  }

  const tutorName = app.pet?.owner?.name || app.user?.name || 'Estimado Tutor'
  const petName = app.pet?.name || 'su mascota'
  const dateStr = app.date || new Date().toISOString().split('T')[0]
  const timeStr = app.start_time || '10:00'
  const vetName = app.professional?.name || 'Dr. Médico Veterinario'
  const serviceName = app.service?.name || 'Consulta Médica'
  const phone = app.pet?.owner?.phone || app.user?.phone || '+584120000000'
  const email = app.pet?.owner?.email || app.user?.email || ''

  selectedRecipient.value = {
    name: tutorName,
    petName,
    phone,
    email,
    type: 'appointment_reminder',
    refId: app.id
  }

  generatedMessage.value = compileMessage(tpl.template_body, {
    tutor_name: tutorName,
    pet_name: petName,
    date: dateStr,
    time: timeStr,
    vet_name: vetName,
    service_name: serviceName,
    clinic_name: 'MedVet Clínicas'
  })

  selectedChannel.value = 'whatsapp'
  isSendModalOpen.value = true
}

// Open Quick Send Modal for Vaccine
const openVaccineReminder = (vac: any) => {
  const tpl = templates.value.find(t => t.code === 'vaccine_due') || {
    template_body: '💉 *Aviso Preventivo de Vacunación - MedVet*\n\nHola {{tutor_name}}, la vacuna *{{vaccine_name}}* de *{{pet_name}}* está próxima a vencer (Fecha: {{due_date}}).'
  }

  const tutorName = vac.pet?.owner?.name || 'Estimado Tutor'
  const petName = vac.pet?.name || 'su mascota'
  const vaccineName = vac.vaccine_name || 'Vacuna Séxtuple'
  const dueDate = vac.next_due_date || 'Próximos días'
  const phone = vac.pet?.owner?.phone || '+584120000000'
  const email = vac.pet?.owner?.email || ''

  selectedRecipient.value = {
    name: tutorName,
    petName,
    phone,
    email,
    type: 'vaccine_due',
    refId: vac.id
  }

  generatedMessage.value = compileMessage(tpl.template_body, {
    tutor_name: tutorName,
    pet_name: petName,
    vaccine_name: vaccineName,
    due_date: dueDate,
    clinic_name: 'MedVet Clínicas'
  })

  selectedChannel.value = 'whatsapp'
  isSendModalOpen.value = true
}

// Open Quick Send Modal for Hospitalization Update
const openHospitalizationUpdate = (hosp: any) => {
  const tpl = templates.value.find(t => t.code === 'hospitalization_update') || {
    template_body: '🏥 *Parte Médico Diario de Hospitalización - MedVet*\n\nEstimado/a {{tutor_name}}, te compartimos la evolución de *{{pet_name}}* en *{{box_name}}*:\n\n🌡️ Estado: {{status}}\n📝 Nota médica: {{medical_notes}}'
  }

  const tutorName = hosp.pet?.owner?.name || 'Estimado Tutor'
  const petName = hosp.pet?.name || 'su mascota'
  const boxName = hosp.box?.code ? `${hosp.box.code} (${hosp.box.name})` : 'Sala de Hospitalización'
  const statusStr = hosp.status === 'critical' ? 'Crítico con monitoreo continuo' : (hosp.status === 'post_op' ? 'Recuperación postquirúrgica favorable' : 'Estable en observación')
  const vetName = hosp.vet?.name || 'Dr. Médico Veterinario'
  const notes = hosp.notes || 'Paciente tranquilo, tolerando medicación y fluidos.'
  const phone = hosp.pet?.owner?.phone || '+584120000000'
  const email = hosp.pet?.owner?.email || ''

  selectedRecipient.value = {
    name: tutorName,
    petName,
    phone,
    email,
    type: 'hospitalization_update',
    refId: hosp.id
  }

  generatedMessage.value = compileMessage(tpl.template_body, {
    tutor_name: tutorName,
    pet_name: petName,
    box_name: boxName,
    status: statusStr,
    medical_notes: notes,
    vet_name: vetName,
    clinic_name: 'MedVet Clínicas'
  })

  selectedChannel.value = 'whatsapp'
  isSendModalOpen.value = true
}

// Dispatch Message & Log
const executeSendMessage = async () => {
  if (!selectedRecipient.value) return

  // Format phone number for WhatsApp clean digits
  let cleanPhone = (selectedRecipient.value.phone || '').replace(/[^0-9]/g, '')
  if (cleanPhone && !cleanPhone.startsWith('58') && !cleanPhone.startsWith('1') && cleanPhone.length === 10) {
    cleanPhone = '58' + cleanPhone // Default Venezuela country code if missing
  }

  // 1. Log in database
  try {
    if ($feathers) {
      await $feathers.service('notifications-log').create({
        recipient_name: selectedRecipient.value.name,
        recipient_phone: selectedRecipient.value.phone,
        recipient_email: selectedRecipient.value.email,
        channel: selectedChannel.value,
        type: selectedRecipient.value.type || 'direct_message',
        subject: selectedRecipient.value.type,
        message_body: generatedMessage.value,
        status: 'sent',
        sent_at: new Date()
      })
    }
  } catch (e) {
    console.warn('Could not log notification to DB:', e)
  }

  // 2. Trigger WhatsApp Click-to-Chat URL or Email client
  if (selectedChannel.value === 'whatsapp') {
    const encodedText = encodeURIComponent(generatedMessage.value)
    const waUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
      : `https://api.whatsapp.com/send?text=${encodedText}`

    window.open(waUrl, '_blank')
    toast.success('WhatsApp Preparado', `Abriendo chat para ${selectedRecipient.value.name}.`)
  } else {
    const mailtoUrl = `mailto:${selectedRecipient.value.email}?subject=${encodeURIComponent('Notificación MedVet')}&body=${encodeURIComponent(generatedMessage.value)}`
    window.location.href = mailtoUrl
    toast.success('Correo Preparado', `Cliente de correo abierto para ${selectedRecipient.value.email}.`)
  }

  isSendModalOpen.value = false
  await fetchData()
}

// Open Template Editor
const openEditTemplate = (tpl?: any) => {
  if (tpl) {
    editingTemplate.value = tpl
    templateForm.value = { ...tpl }
  } else {
    editingTemplate.value = null
    templateForm.value = {
      code: 'custom_' + Date.now(),
      channel: 'whatsapp',
      title: '',
      subject: '',
      template_body: 'Hola {{tutor_name}}, te escribimos desde MedVet respecto a {{pet_name}}...',
      description: '',
      active: true
    }
  }
  isTemplateModalOpen.value = true
}

// Save Template
const handleSaveTemplate = async () => {
  try {
    if ($feathers) {
      if (editingTemplate.value?.id) {
        await $feathers.service('notification-templates').patch(editingTemplate.value.id, templateForm.value)
        toast.success('Plantilla Actualizada', 'Los cambios se guardaron correctamente.')
      } else {
        await $feathers.service('notification-templates').create(templateForm.value)
        toast.success('Plantilla Creada', 'Nueva plantilla agregada al catálogo.')
      }
      isTemplateModalOpen.value = false
      await fetchData()
    }
  } catch (error: any) {
    console.error('Error saving template:', error)
    toast.error('Error', error.message || 'No se pudo guardar la plantilla.')
  }
}

// Helpers
const formatDate = (dateStr: string) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('es-VE', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="notif-page">
    <div class="notif-ambient-glow"></div>

    <div class="notif-container">
      
      <!-- Top Header -->
      <div class="notif-header">
        <div class="header-left">
          <div class="beacon-box">
            <span class="beacon-pulse"></span>
            <span class="beacon-icon">📲</span>
          </div>
          <div>
            <div class="header-badge-row">
              <span class="badge-live">CENTRO DE NOTIFICACIONES & WHATSAPP</span>
              <span class="badge-sub font-mono-numbers">Direct WhatsApp Engine</span>
            </div>
            <h1 class="header-title">Automatización de Recordatorios & Mensajería</h1>
            <p class="header-sub">Envíos directos a tutores: citas próximas, alertas de vacunas, partes médicos y grooming</p>
          </div>
        </div>

        <div class="header-actions">
          <button type="button" class="btn-primary" @click="openEditTemplate()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nueva Plantilla
          </button>
          <NuxtLink to="/admin" class="btn-ghost">
            ← Volver al Panel
          </NuxtLink>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="kpi-strip font-mono-numbers">
        <div class="kpi-card kpi-card--app">
          <div class="kpi-icon">📅</div>
          <div class="kpi-info">
            <span class="kpi-val">{{ tomorrowAppointments.length }}</span>
            <span class="kpi-lbl">Citas Próximas por Recordar</span>
          </div>
        </div>

        <div class="kpi-card kpi-card--vac">
          <div class="kpi-icon">💉</div>
          <div class="kpi-info">
            <span class="kpi-val">{{ dueVaccinations.length }}</span>
            <span class="kpi-lbl">Refuerzos de Vacunas Pendientes</span>
          </div>
        </div>

        <div class="kpi-card kpi-card--hosp">
          <div class="kpi-icon">🏥</div>
          <div class="kpi-info">
            <span class="kpi-val">{{ activeHospitalized.length }}</span>
            <span class="kpi-lbl">Tutores de Hospitalizados</span>
          </div>
        </div>

        <div class="kpi-card kpi-card--sent">
          <div class="kpi-icon">📨</div>
          <div class="kpi-info">
            <span class="kpi-val">{{ logs.length }}</span>
            <span class="kpi-lbl">Mensajes Emitidos & Auditados</span>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="main-tabs-bar">
        <button
          type="button"
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === 'broadcast' }"
          @click="activeTab = 'broadcast'"
        >
          🚀 Centro de Envíos Rápidos
        </button>
        <button
          type="button"
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === 'templates' }"
          @click="activeTab = 'templates'"
        >
          📝 Plantillas de Mensajes ({{ templates.length }})
        </button>
        <button
          type="button"
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === 'logs' }"
          @click="activeTab = 'logs'"
        >
          📑 Historial de Auditoría ({{ logs.length }})
        </button>
      </div>

      <!-- ============================================================= -->
      <!-- TAB 1: BROADCAST / QUICK SENDING CENTER -->
      <!-- ============================================================= -->
      <div v-if="activeTab === 'broadcast'" class="tab-content-box">
        <!-- Audience Selector Sub-tabs -->
        <div class="audience-subtabs">
          <button
            type="button"
            class="subtab-btn"
            :class="{ 'subtab-btn--active': broadcastAudience === 'tomorrow_appointments' }"
            @click="broadcastAudience = 'tomorrow_appointments'"
          >
            📅 Citas Médicas Agendadas ({{ tomorrowAppointments.length }})
          </button>
          <button
            type="button"
            class="subtab-btn"
            :class="{ 'subtab-btn--active': broadcastAudience === 'vaccine_due' }"
            @click="broadcastAudience = 'vaccine_due'"
          >
            💉 Vacunas & Desparasitación por Vencer ({{ dueVaccinations.length }})
          </button>
          <button
            type="button"
            class="subtab-btn"
            :class="{ 'subtab-btn--active': broadcastAudience === 'hospitalized' }"
            @click="broadcastAudience = 'hospitalized'"
          >
            🏥 Pacientes en Hospitalización ({{ activeHospitalized.length }})
          </button>
        </div>

        <!-- AUDIENCE 1: APPOINTMENTS -->
        <div v-if="broadcastAudience === 'tomorrow_appointments'" class="audience-panel">
          <div class="panel-header-info">
            <h3 class="panel-title">📅 Recordatorios de Citas Médicas</h3>
            <p class="panel-desc">Envía el recordatorio personalizado con fecha, hora y sede con un solo clic a WhatsApp.</p>
          </div>

          <div v-if="tomorrowAppointments.length === 0" class="empty-state">
            <p>No hay citas programadas para las próximas horas.</p>
          </div>

          <div v-else class="recipients-grid">
            <div
              v-for="app in tomorrowAppointments"
              :key="app.id"
              class="recipient-card"
            >
              <div class="card-left-info">
                <div class="patient-pill">
                  <span class="patient-avatar-mini">🐾</span>
                  <strong>{{ app.pet?.name || 'Mascota' }}</strong>
                  <span class="text-xs text-gray-400">({{ app.pet?.species || 'Canino' }})</span>
                </div>
                <p class="tutor-row">
                  👤 Tutor: <strong>{{ app.pet?.owner?.name || app.user?.name || 'Cliente' }}</strong>
                  <span class="font-mono-numbers text-emerald">📞 {{ app.pet?.owner?.phone || app.user?.phone || 'S/N' }}</span>
                </p>
                <p class="meta-row font-mono-numbers">
                  ⏰ {{ app.date }} · {{ app.start_time || '10:00' }} hrs | 👨‍⚕️ {{ app.professional?.name || 'Dr. Médico' }} | 🩺 {{ app.service?.name || 'Consulta' }}
                </p>
              </div>

              <div class="card-action-right">
                <button
                  type="button"
                  class="btn-wa-action"
                  @click="openAppointmentReminder(app)"
                >
                  <span>💬 Enviar WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- AUDIENCE 2: VACCINES DUE -->
        <div v-if="broadcastAudience === 'vaccine_due'" class="audience-panel">
          <div class="panel-header-info">
            <h3 class="panel-title">💉 Alertas de Refuerzo de Vacunas</h3>
            <p class="panel-desc">Contacta a los tutores con esquemas biológicos vencidos para proteger a su mascota.</p>
          </div>

          <div v-if="dueVaccinations.length === 0" class="empty-state">
            <p>No hay vacunas pendientes en el registro.</p>
          </div>

          <div v-else class="recipients-grid">
            <div
              v-for="vac in dueVaccinations"
              :key="vac.id"
              class="recipient-card"
            >
              <div class="card-left-info">
                <div class="patient-pill">
                  <span class="patient-avatar-mini">💉</span>
                  <strong>{{ vac.pet?.name || 'Mascota' }}</strong>
                  <span class="text-xs text-gray-400">({{ vac.vaccine_name }})</span>
                </div>
                <p class="tutor-row">
                  👤 Tutor: <strong>{{ vac.pet?.owner?.name || 'Cliente' }}</strong>
                  <span class="font-mono-numbers text-emerald">📞 {{ vac.pet?.owner?.phone || 'S/N' }}</span>
                </p>
                <p class="meta-row font-mono-numbers text-amber">
                  ⚠️ Fecha límite: {{ vac.next_due_date || 'Inmediata' }} | Tipo: {{ vac.type || 'Vacuna' }}
                </p>
              </div>

              <div class="card-action-right">
                <button
                  type="button"
                  class="btn-wa-action"
                  @click="openVaccineReminder(vac)"
                >
                  <span>💬 Enviar Aviso WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- AUDIENCE 3: HOSPITALIZED PATIENTS -->
        <div v-if="broadcastAudience === 'hospitalized'" class="audience-panel">
          <div class="panel-header-info">
            <h3 class="panel-title">🏥 Partes Médicos a Tutores de Hospitalización</h3>
            <p class="panel-desc">Envía el reporte diario de evolución, constantes y estado de ánimo del paciente en cama.</p>
          </div>

          <div v-if="activeHospitalized.length === 0" class="empty-state">
            <p>No hay pacientes hospitalizados en este momento.</p>
          </div>

          <div v-else class="recipients-grid">
            <div
              v-for="hosp in activeHospitalized"
              :key="hosp.id"
              class="recipient-card recipient-card--hosp"
            >
              <div class="card-left-info">
                <div class="patient-pill">
                  <span class="patient-avatar-mini">🏥</span>
                  <strong>{{ hosp.pet?.name || 'Mascota' }}</strong>
                  <span class="box-badge-mini font-mono-numbers">{{ hosp.box?.code || 'BOX-01' }}</span>
                </div>
                <p class="tutor-row">
                  👤 Tutor: <strong>{{ hosp.pet?.owner?.name || 'Cliente' }}</strong>
                  <span class="font-mono-numbers text-emerald">📞 {{ hosp.pet?.owner?.phone || 'S/N' }}</span>
                </p>
                <p class="meta-row">
                  📋 Diagnóstico: {{ hosp.definitive_diagnosis || hosp.presumptive_diagnosis || 'En tratamiento' }}
                </p>
              </div>

              <div class="card-action-right">
                <button
                  type="button"
                  class="btn-wa-action btn-wa-action--cyan"
                  @click="openHospitalizationUpdate(hosp)"
                >
                  <span>🩺 Enviar Parte Médico</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ============================================================= -->
      <!-- TAB 2: TEMPLATES MANAGEMENT -->
      <!-- ============================================================= -->
      <div v-if="activeTab === 'templates'" class="tab-content-box">
        <div class="templates-grid">
          <div
            v-for="tpl in templates"
            :key="tpl.id"
            class="template-card"
          >
            <div class="tpl-head">
              <div>
                <span class="tpl-code font-mono-numbers">{{ tpl.code }}</span>
                <h4 class="tpl-title">{{ tpl.title }}</h4>
              </div>
              <span class="tpl-channel-chip" :class="`chip--${tpl.channel}`">
                {{ tpl.channel === 'whatsapp' ? 'WhatsApp 💬' : 'Email 📧' }}
              </span>
            </div>

            <p class="tpl-desc">{{ tpl.description || 'Plantilla de comunicación preconfigurada' }}</p>

            <div class="tpl-preview-box">
              <pre class="tpl-body-text">{{ tpl.template_body }}</pre>
            </div>

            <div class="tpl-footer-actions">
              <button type="button" class="btn-edit-tpl" @click="openEditTemplate(tpl)">
                ✏️ Editar Plantilla
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================= -->
      <!-- TAB 3: AUDIT LOGS -->
      <!-- ============================================================= -->
      <div v-if="activeTab === 'logs'" class="tab-content-box">
        <div v-if="logs.length === 0" class="empty-state">
          <p>No se han emitido notificaciones todavía.</p>
        </div>

        <div v-else class="logs-table-wrap">
          <table class="logs-table font-mono-numbers">
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Destinatario</th>
                <th>Canal</th>
                <th>Tipo de Mensaje</th>
                <th>Contenido</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in logs" :key="log.id">
                <td class="font-bold">{{ formatDate(log.sent_at || log.created_at) }}</td>
                <td class="font-sans">
                  <strong>{{ log.recipient_name }}</strong>
                  <span class="text-xs text-gray-400 block">{{ log.recipient_phone || log.recipient_email }}</span>
                </td>
                <td>
                  <span class="channel-badge" :class="`badge--${log.channel}`">
                    {{ log.channel }}
                  </span>
                </td>
                <td class="font-sans text-xs">{{ log.type }}</td>
                <td class="font-sans td-log-body" :title="log.message_body">
                  {{ log.message_body }}
                </td>
                <td>
                  <span class="status-chip status-chip--sent">
                    ✅ {{ log.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- ============================================================= -->
    <!-- MODAL: PREVIEW & DISPATCH MESSAGE -->
    <!-- ============================================================= -->
    <div v-if="isSendModalOpen" class="modal-backdrop" @click.self="isSendModalOpen = false">
      <div class="modal-dialog modal-dialog--md">
        <div class="modal-head">
          <div class="modal-head-title">
            <span class="modal-head-icon">💬</span>
            <div>
              <h3>Vista Previa & Envío de Mensaje</h3>
              <p>Destinatario: <strong>{{ selectedRecipient?.name }}</strong> ({{ selectedRecipient?.petName }})</p>
            </div>
          </div>
          <button type="button" class="btn-close" @click="isSendModalOpen = false">✕</button>
        </div>

        <div class="modal-body-form">
          <div class="channel-selector-row">
            <label class="form-lbl">Canal de Envío:</label>
            <div class="flex gap-3">
              <label class="radio-label">
                <input v-model="selectedChannel" type="radio" value="whatsapp" />
                <span>WhatsApp Instantáneo (Click-to-Chat)</span>
              </label>
              <label class="radio-label">
                <input v-model="selectedChannel" type="radio" value="email" />
                <span>Correo Electrónico (Email)</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-lbl">Teléfono / Destino:</label>
            <input
              v-model="selectedRecipient.phone"
              type="text"
              class="form-ctrl font-mono-numbers"
              placeholder="+584121234567"
            />
          </div>

          <!-- Live WhatsApp Chat Bubble Preview -->
          <div class="wa-preview-wrapper">
            <div class="wa-chat-header">
              <span class="wa-avatar">🐾</span>
              <div>
                <strong>MedVet Clínicas Oficial</strong>
                <span class="text-xs text-emerald block">En línea</span>
              </div>
            </div>

            <div class="wa-bubble-body">
              <textarea
                v-model="generatedMessage"
                class="wa-textarea-edit"
                rows="7"
              ></textarea>
              <span class="wa-bubble-time font-mono-numbers">Ahora ✓✓</span>
            </div>
          </div>

          <div class="modal-actions-bar">
            <button type="button" class="btn-cancel" @click="isSendModalOpen = false">
              Cancelar
            </button>
            <button type="button" class="btn-submit btn-submit--wa" @click="executeSendMessage">
              📲 Abrir Chat & Enviar WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================= -->
    <!-- MODAL: EDIT TEMPLATE -->
    <!-- ============================================================= -->
    <div v-if="isTemplateModalOpen" class="modal-backdrop" @click.self="isTemplateModalOpen = false">
      <div class="modal-dialog modal-dialog--md">
        <div class="modal-head">
          <div class="modal-head-title">
            <span class="modal-head-icon">📝</span>
            <div>
              <h3>{{ editingTemplate ? 'Editar Plantilla' : 'Nueva Plantilla de Notificación' }}</h3>
              <p>Configuración de placeholders dinámicos</p>
            </div>
          </div>
          <button type="button" class="btn-close" @click="isTemplateModalOpen = false">✕</button>
        </div>

        <form @submit.prevent="handleSaveTemplate" class="modal-body-form">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-lbl">Código Único (Identificador) *</label>
              <input v-model="templateForm.code" type="text" class="form-ctrl font-mono-numbers" required />
            </div>

            <div class="form-group">
              <label class="form-lbl">Canal *</label>
              <select v-model="templateForm.channel" class="form-ctrl">
                <option value="whatsapp">WhatsApp 💬</option>
                <option value="email">Correo Electrónico 📧</option>
                <option value="all">Multicanal (Todos) 🌐</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-lbl">Título Descriptivo *</label>
            <input v-model="templateForm.title" type="text" class="form-ctrl" required />
          </div>

          <div class="form-group">
            <label class="form-lbl">Cuerpo del Mensaje (Soporta {{pet_name}}, {{tutor_name}}, {{date}}, {{time}}, {{service_name}}) *</label>
            <textarea
              v-model="templateForm.template_body"
              class="form-ctrl form-textarea"
              rows="6"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-lbl">Descripción / Uso</label>
            <input v-model="templateForm.description" type="text" class="form-ctrl" />
          </div>

          <div class="modal-actions-bar">
            <button type="button" class="btn-cancel" @click="isTemplateModalOpen = false">
              Cancelar
            </button>
            <button type="submit" class="btn-submit">
              💾 Guardar Plantilla
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
.notif-page {
  position: relative;
  min-height: 100%;
  padding-bottom: 2rem;
  color: var(--color-ink-900);
}

.notif-ambient-glow {
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 200px;
  background: radial-gradient(ellipse at top, rgba(0, 168, 107, 0.08), transparent 70%);
  pointer-events: none;
}

.dark .notif-ambient-glow {
  background: radial-gradient(ellipse at top, rgba(0, 245, 155, 0.12), transparent 70%);
}

.notif-container {
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Header */
.notif-header {
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
  background: rgba(0, 168, 107, 0.12);
  border: 1px solid rgba(0, 168, 107, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.dark .beacon-box {
  background: rgba(0, 245, 155, 0.12);
  border-color: rgba(0, 245, 155, 0.35);
}

.beacon-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 18px;
  background: rgba(0, 168, 107, 0.15);
  animation: pulse-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}

.dark .beacon-pulse {
  background: rgba(0, 245, 155, 0.2);
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
  background: rgba(0, 168, 107, 0.12);
  color: #00a86b;
  border: 1px solid rgba(0, 168, 107, 0.25);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
}

.dark .badge-live {
  background: rgba(0, 245, 155, 0.15);
  color: #00f59b;
  border-color: rgba(0, 245, 155, 0.3);
}

.badge-sub {
  background: rgba(56, 189, 248, 0.12);
  color: #0284c7;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
}

.dark .badge-sub {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-ink-900);
  margin: 0;
}

.dark .header-title {
  color: #f1faf5;
}

.header-sub {
  font-size: 0.85rem;
  color: var(--color-ink-500);
  margin: 0;
}

.dark .header-sub {
  color: #cbd5e1;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #00a86b, #007a4d);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 168, 107, 0.25);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.dark .btn-primary {
  background: linear-gradient(135deg, #00a86b, #005035);
  box-shadow: 0 4px 14px rgba(0, 245, 155, 0.25);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  color: var(--color-ink-700);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.15s ease;
}

.btn-ghost:hover {
  border-color: #00a86b;
  color: #00a86b;
}

.dark .btn-ghost {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.15);
  color: #cbd5e1;
}

.dark .btn-ghost:hover {
  border-color: #00f59b;
  color: #00f59b;
}

/* KPI Strip */
.kpi-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.kpi-card {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 16px;
  padding: 1.15rem;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  box-shadow: 0 4px 20px -4px rgba(0, 80, 50, 0.04);
  transition: all 0.2s ease;
}

.dark .kpi-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.15);
  box-shadow: none;
}

.kpi-icon {
  font-size: 1.6rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 168, 107, 0.08);
  border-radius: 10px;
}

.dark .kpi-icon {
  background: rgba(0, 245, 155, 0.12);
}

.kpi-val {
  display: block;
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--color-ink-900);
}

.dark .kpi-val {
  color: #f1faf5;
}

.kpi-lbl {
  font-size: 0.75rem;
  color: var(--color-ink-500);
}

.dark .kpi-lbl {
  color: #94a3b8;
}

/* Main Tabs */
.main-tabs-bar {
  display: flex;
  gap: 0.5rem;
  background: var(--color-cream-200);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid var(--color-cream-300);
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.dark .main-tabs-bar {
  background: #060c09;
  border-color: rgba(0, 245, 155, 0.15);
}

.tab-btn {
  background: transparent;
  border: none;
  color: var(--color-ink-500);
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn--active {
  background: #00a86b;
  color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 168, 107, 0.3);
}

.dark .tab-btn {
  color: #94a3b8;
}

.dark .tab-btn--active {
  background: #00a86b;
  color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 245, 155, 0.3);
}

.tab-content-box {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: 0 8px 30px -8px rgba(0, 80, 50, 0.05);
}

.dark .tab-content-box {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.15);
  box-shadow: none;
}

/* Audience Subtabs */
.audience-subtabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-cream-200);
  padding-bottom: 0.75rem;
  flex-wrap: wrap;
}

.dark .audience-subtabs {
  border-color: rgba(0, 245, 155, 0.12);
}

.subtab-btn {
  background: var(--color-cream-100);
  border: 1px solid var(--color-cream-200);
  color: var(--color-ink-700);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.subtab-btn--active {
  background: rgba(0, 168, 107, 0.12);
  color: #00a86b;
  border-color: #00a86b;
  font-weight: 700;
}

.dark .subtab-btn {
  background: #060c09;
  border-color: rgba(0, 245, 155, 0.15);
  color: #cbd5e1;
}

.dark .subtab-btn--active {
  background: rgba(0, 245, 155, 0.15);
  color: #00f59b;
  border-color: #00f59b;
}

.panel-header-info {
  margin-bottom: 1.2rem;
}

.panel-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-ink-900);
  margin: 0;
}

.dark .panel-title {
  color: #f1faf5;
}

.panel-desc {
  font-size: 0.8rem;
  color: var(--color-ink-500);
  margin: 0.2rem 0 0 0;
}

.dark .panel-desc {
  color: #cbd5e1;
}

/* Recipients Grid */
.recipients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1rem;
}

.recipient-card {
  background: var(--color-cream-100);
  border: 1px solid var(--color-cream-200);
  border-radius: 14px;
  padding: 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.85rem;
  transition: all 0.2s ease;
}

.recipient-card:hover {
  border-color: #00a86b;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px -4px rgba(0, 80, 50, 0.08);
}

.dark .recipient-card {
  background: #060c09;
  border-color: rgba(0, 245, 155, 0.15);
}

.dark .recipient-card:hover {
  border-color: #00f59b;
  box-shadow: 0 8px 25px -6px rgba(0, 245, 155, 0.2);
}

.recipient-card--hosp {
  border-left: 4px solid #0284c7;
}

.patient-pill {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  color: var(--color-ink-900);
}

.dark .patient-pill {
  color: #f1faf5;
}

.patient-avatar-mini {
  font-size: 1.1rem;
}

.box-badge-mini {
  background: #0284c7;
  color: #ffffff;
  font-size: 0.68rem;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.tutor-row {
  font-size: 0.78rem;
  color: var(--color-ink-600);
  margin: 0.2rem 0;
}

.dark .tutor-row {
  color: #cbd5e1;
}

.meta-row {
  font-size: 0.72rem;
  color: var(--color-ink-400);
  margin: 0;
}

.dark .meta-row {
  color: #94a3b8;
}

.btn-wa-action {
  background: linear-gradient(135deg, #00a86b, #007a4d);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.78rem;
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 168, 107, 0.25);
  transition: all 0.15s ease;
}

.btn-wa-action:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.dark .btn-wa-action {
  background: linear-gradient(135deg, #25d366, #128c7e);
  box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3);
}

.btn-wa-action--cyan {
  background: linear-gradient(135deg, #0284c7, #0369a1);
  box-shadow: 0 2px 8px rgba(2, 132, 199, 0.3);
}

/* Templates Grid */
.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.25rem;
}

.template-card {
  background: var(--color-cream-100);
  border: 1px solid var(--color-cream-200);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: all 0.2s ease;
}

.template-card:hover {
  border-color: #00a86b;
  transform: translateY(-2px);
}

.dark .template-card {
  background: #060c09;
  border-color: rgba(0, 245, 155, 0.15);
}

.dark .template-card:hover {
  border-color: #00f59b;
}

.tpl-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.tpl-code {
  font-size: 0.7rem;
  color: var(--color-ink-400);
  display: block;
}

.dark .tpl-code {
  color: #94a3b8;
}

.tpl-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--color-ink-900);
  margin: 0;
}

.dark .tpl-title {
  color: #f1faf5;
}

.tpl-channel-chip {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
}

.chip--whatsapp {
  background: rgba(0, 168, 107, 0.12);
  color: #00a86b;
}

.dark .chip--whatsapp {
  background: rgba(0, 245, 155, 0.15);
  color: #00f59b;
}

.chip--email {
  background: rgba(56, 189, 248, 0.15);
  color: #0284c7;
}

.dark .chip--email {
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
}

.tpl-desc {
  font-size: 0.75rem;
  color: var(--color-ink-500);
  margin: 0;
}

.dark .tpl-desc {
  color: #94a3b8;
}

.tpl-preview-box {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 8px;
  padding: 0.75rem;
  max-height: 140px;
  overflow-y: auto;
}

.dark .tpl-preview-box {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.12);
}

.tpl-body-text {
  font-family: inherit;
  font-size: 0.75rem;
  color: var(--color-ink-700);
  white-space: pre-wrap;
  margin: 0;
}

.dark .tpl-body-text {
  color: #cbd5e1;
}

.tpl-footer-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
}

.btn-edit-tpl {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  color: var(--color-ink-700);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-edit-tpl:hover {
  border-color: #00a86b;
  color: #00a86b;
}

.dark .btn-edit-tpl {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

/* Logs Table */
.logs-table-wrap {
  overflow-x: auto;
}

.logs-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
}

.logs-table th {
  background: var(--color-cream-100);
  color: var(--color-ink-500);
  text-align: left;
  padding: 0.65rem 0.85rem;
  border-bottom: 2px solid var(--color-cream-200);
}

.dark .logs-table th {
  background: #060c09;
  color: #94a3b8;
  border-color: rgba(0, 245, 155, 0.15);
}

.logs-table td {
  padding: 0.65rem 0.85rem;
  border-bottom: 1px solid var(--color-cream-200);
  color: var(--color-ink-700);
}

.dark .logs-table td {
  border-color: rgba(0, 245, 155, 0.1);
  color: #e2e8f0;
}

.channel-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.badge--whatsapp {
  background: rgba(0, 168, 107, 0.12);
  color: #00a86b;
}

.dark .badge--whatsapp {
  background: rgba(0, 245, 155, 0.2);
  color: #00f59b;
}

.badge--email {
  background: rgba(56, 189, 248, 0.15);
  color: #0284c7;
}

.dark .badge--email {
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
}

.status-chip--sent {
  color: #00a86b;
  font-weight: 700;
}

.dark .status-chip--sent {
  color: #00f59b;
}

.td-log-body {
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* MODALS */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-dialog {
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 20px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
}

.dark .modal-dialog {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.2);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
}

.modal-dialog--md { max-width: 620px; }

.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-cream-200);
}

.dark .modal-head {
  border-color: rgba(0, 245, 155, 0.12);
}

.modal-head-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-head-title h3 {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-ink-900);
  margin: 0;
}

.dark .modal-head-title h3 {
  color: #f1faf5;
}

.modal-head-title p {
  font-size: 0.78rem;
  color: var(--color-ink-500);
  margin: 0;
}

.dark .modal-head-title p {
  color: #94a3b8;
}

.modal-head-icon { font-size: 1.6rem; }

.btn-close {
  background: transparent;
  border: none;
  color: var(--color-ink-400);
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
  color: var(--color-ink-700);
}

.dark .form-lbl {
  color: #cbd5e1;
}

.form-ctrl {
  background: var(--color-cream-100);
  border: 1px solid var(--color-cream-200);
  border-radius: 8px;
  padding: 0.55rem 0.85rem;
  color: var(--color-ink-900);
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.15s ease;
}

.form-ctrl:focus { border-color: #00a86b; }

.dark .form-ctrl {
  background: #060c09;
  border-color: rgba(0, 245, 155, 0.2);
  color: #f1faf5;
}

.dark .form-ctrl:focus { border-color: #00f59b; }

.form-textarea { resize: vertical; }

.channel-selector-row {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--color-ink-700);
  cursor: pointer;
}

.dark .radio-label {
  color: #e2e8f0;
}

/* WhatsApp Bubble Preview */
.wa-preview-wrapper {
  background: #e5ddd5;
  border: 1px solid #d1d7db;
  border-radius: 12px;
  padding: 0.85rem;
  background-image: radial-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 0);
  background-size: 12px 12px;
}

.dark .wa-preview-wrapper {
  background: #0b141a;
  border-color: rgba(0, 245, 155, 0.15);
  background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 0);
}

.wa-chat-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding-bottom: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.82rem;
  color: #111b21;
}

.dark .wa-chat-header {
  border-color: rgba(255, 255, 255, 0.08);
  color: #e9edef;
}

.wa-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #128c7e;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wa-bubble-body {
  background: #d9fdd3;
  border-radius: 10px;
  padding: 0.75rem;
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.dark .wa-bubble-body {
  background: #005c4b;
  box-shadow: none;
}

.wa-textarea-edit {
  width: 100%;
  background: transparent;
  border: none;
  color: #111b21;
  font-family: inherit;
  font-size: 0.8rem;
  outline: none;
  resize: vertical;
}

.dark .wa-textarea-edit {
  color: #e9edef;
}

.wa-bubble-time {
  display: block;
  text-align: right;
  font-size: 0.65rem;
  color: rgba(0, 0, 0, 0.45);
  margin-top: 4px;
}

.dark .wa-bubble-time {
  color: rgba(255, 255, 255, 0.6);
}

.modal-actions-bar {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.btn-cancel {
  background: transparent;
  border: 1px solid var(--color-cream-200);
  color: var(--color-ink-600);
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0.55rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}

.dark .btn-cancel {
  border-color: rgba(0, 245, 155, 0.2);
  color: #cbd5e1;
}

.btn-submit {
  background: #00a86b;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.55rem 1.2rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-submit:hover { filter: brightness(1.08); }

.btn-submit--wa {
  background: linear-gradient(135deg, #25d366, #128c7e);
  box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);
}

.text-amber { color: #d97706; }
.dark .text-amber { color: #fbbf24; }

.text-cyan { color: #0284c7; }
.dark .text-cyan { color: #38bdf8; }

.text-emerald { color: #00a86b; }
.dark .text-emerald { color: #00f59b; }

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-ink-400);
}

.dark .empty-state {
  color: #94a3b8;
}
</style>
