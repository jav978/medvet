<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Gestionar Horarios</h1>
      <UButton @click="openModal()" icon="i-heroicons-plus">
        <span class="hidden sm:inline">Nuevo Horario</span>
        <span class="sm:hidden">Nuevo</span>
      </UButton>
    </div>

    <UCard>
      <UTable :columns="columns" :rows="schedules" :loading="loading">
        <template #day_of_week-data="{ row }">
          <UBadge variant="subtle">{{ getDayName(row.day_of_week) }}</UBadge>
        </template>
        <template #start_time-data="{ row }">
          <span class="font-mono text-gray-900 dark:text-white">{{ row.start_time }}</span>
        </template>
        <template #end_time-data="{ row }">
          <span class="font-mono text-gray-900 dark:text-white">{{ row.end_time }}</span>
        </template>
        <template #is_active-data="{ row }">
          <UBadge :color="row.is_active ? 'green' : 'red'">
            {{ row.is_active ? 'Activo' : 'Inactivo' }}
          </UBadge>
        </template>
        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton icon="i-heroicons-pencil" size="xs" variant="ghost" @click="openModal(row)" />
            <UButton icon="i-heroicons-trash" size="xs" variant="ghost" color="red" @click="deleteSchedule(row)" />
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Schedule Modal -->
    <UModal v-model="showModal">
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ editingSchedule ? 'Editar Horario' : 'Nuevo Horario' }}
          </h2>
        </template>

        <UForm :schema="scheduleSchema" :state="formState" @submit="saveSchedule" class="space-y-4">
          <UFormField label="Profesional" name="professional_id">
            <USelect v-model="formState.professional_id" :items="professionalOptions" placeholder="Seleccionar profesional" />
          </UFormField>

          <UFormField label="Día de la Semana" name="day_of_week">
            <USelect v-model="formState.day_of_week" :items="dayOptions" />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Hora Inicio" name="start_time">
              <UInput v-model="formState.start_time" type="time" />
            </UFormField>

            <UFormField label="Hora Fin" name="end_time">
              <UInput v-model="formState.end_time" type="time" />
            </UFormField>
          </div>

          <UFormField label="Estado" name="is_active">
            <UToggle v-model="formState.is_active" />
          </UFormField>

          <div class="flex justify-end gap-3">
            <UButton variant="outline" @click="showModal = false">Cancelar</UButton>
            <UButton type="submit" :loading="saving">
              {{ editingSchedule ? 'Guardar Cambios' : 'Crear Horario' }}
            </UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { z } from 'zod'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
  requiresAuth: true,
  requiredRole: 'admin'
})

const scheduleSchema = z.object({
  professional_id: z.string().uuid('Selecciona un profesional'),
  day_of_week: z.number().min(0).max(6),
  start_time: z.string(),
  end_time: z.string(),
  is_active: z.boolean()
})

const schedules = ref([])
const professionals = ref([])
const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const editingSchedule = ref(null)

const formState = reactive({
  professional_id: '',
  day_of_week: 1,
  start_time: '09:00',
  end_time: '18:00',
  is_active: true
})

const dayOptions = [
  { label: 'Lunes', value: 1 },
  { label: 'Martes', value: 2 },
  { label: 'Miércoles', value: 3 },
  { label: 'Jueves', value: 4 },
  { label: 'Viernes', value: 5 },
  { label: 'Sábado', value: 6 },
  { label: 'Domingo', value: 0 }
]

const getDayName = (day) => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  return days[day]
}

const professionalOptions = computed(() =>
  professionals.value.map(p => ({
    label: `${p.user?.name} - ${p.specialty}`,
    value: p.id
  }))
)

const columns = [
  { key: 'professional', label: 'Profesional' },
  { key: 'day_of_week', label: 'Día' },
  { key: 'start_time', label: 'Inicio' },
  { key: 'end_time', label: 'Fin' },
  { key: 'is_active', label: 'Estado' },
  { key: 'actions', label: '' }
]

const openModal = (schedule = null) => {
  editingSchedule.value = schedule
  if (schedule) {
    formState.professional_id = schedule.professional_id
    formState.day_of_week = schedule.day_of_week
    formState.start_time = schedule.start_time
    formState.end_time = schedule.end_time
    formState.is_active = schedule.is_active
  } else {
    formState.professional_id = ''
    formState.day_of_week = 1
    formState.start_time = '09:00'
    formState.end_time = '18:00'
    formState.is_active = true
  }
  showModal.value = true
}

const saveSchedule = async () => {
  saving.value = true
  try {
    const { $feathers } = useNuxtApp()
    
    if (editingSchedule.value) {
      await $feathers.service('schedules').patch(editingSchedule.value.id, { ...formState })
    } else {
      await $feathers.service('schedules').create({ ...formState })
    }
    
    await fetchSchedules()
    showModal.value = false
  } catch (error) {
    console.error('Error saving schedule:', error)
  } finally {
    saving.value = false
  }
}

const deleteSchedule = async (schedule) => {
  if (confirm('¿Eliminar este horario?')) {
    try {
      const { $feathers } = useNuxtApp()
      await $feathers.service('schedules').remove(schedule.id)
      await fetchSchedules()
    } catch (error) {
      console.error('Error deleting schedule:', error)
    }
  }
}

const fetchSchedules = async () => {
  loading.value = true
  try {
    const { $feathers } = useNuxtApp()
    const result = await $feathers.service('schedules').find({
      query: { $limit: 100, $include: ['professional.user'] }
    })
    schedules.value = result.data || result
  } catch (error) {
    console.error('Error fetching schedules:', error)
  } finally {
    loading.value = false
  }
}

const fetchProfessionals = async () => {
  try {
    const { $feathers } = useNuxtApp()
    const result = await $feathers.service('professionals').find({
      query: { active: true, $include: ['user'] }
    })
    professionals.value = result.data || result
  } catch (error) {
    console.error('Error fetching professionals:', error)
  }
}

onMounted(async () => {
  await Promise.all([fetchSchedules(), fetchProfessionals()])
})
</script>
