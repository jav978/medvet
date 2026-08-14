<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Gestionar Citas & Pacientes</h1>
      <div class="flex items-center gap-2">
        <UButton color="gray" variant="ghost" @click="handleExportExcel">
          <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4 mr-2" />
          Exportar Excel
        </UButton>
        <UButton color="gray" variant="ghost" @click="handlePrintAgenda">
          <UIcon name="i-heroicons-printer" class="w-4 h-4 mr-2" />
          Imprimir Agenda
        </UButton>
        <UButton @click="showFilters = !showFilters">
          <UIcon name="i-heroicons-funnel" class="w-4 h-4 mr-2" />
          Filtros
        </UButton>
      </div>
    </div>

    <!-- Filters -->
    <UCard v-if="showFilters" class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UInput v-model="filters.search" placeholder="Buscar..." icon="i-heroicons-magnifying-glass" />
        <USelect v-model="filters.status" :items="statusOptions" placeholder="Estado" />
        <UInput v-model="filters.dateFrom" type="date" placeholder="Desde" />
        <UInput v-model="filters.dateTo" type="date" placeholder="Hasta" />
      </div>
    </UCard>

    <UCard>
      <UTable :columns="columns" :rows="filteredAppointments" :loading="loading">
        <template #pet-data="{ row }">
          <span class="font-medium text-gray-900 dark:text-white">{{ row.pet?.name }}</span>
        </template>
        <template #service-data="{ row }">
          <span class="text-gray-900 dark:text-white">{{ row.service?.name }}</span>
        </template>
        <template #professional-data="{ row }">
          <span class="text-gray-900 dark:text-white">{{ row.professional?.user?.name }}</span>
        </template>
        <template #date-data="{ row }">
          <span class="text-gray-900 dark:text-white">{{ row.date }}</span>
        </template>
        <template #start_time-data="{ row }">
          <span class="font-mono text-gray-900 dark:text-white">{{ row.start_time }} - {{ row.end_time }}</span>
        </template>
        <template #status-data="{ row }">
          <UBadge :color="getStatusColor(row.status)">
            {{ row.status }}
          </UBadge>
        </template>
        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton
              v-if="row.status === 'pending'"
              icon="i-heroicons-check"
              size="xs"
              variant="ghost"
              color="green"
              @click="updateStatus(row, 'confirmed')"
            />
            <UButton
              v-if="row.status === 'confirmed'"
              icon="i-heroicons-check-circle"
              size="xs"
              variant="ghost"
              color="blue"
              @click="updateStatus(row, 'completed')"
            />
            <UButton
              v-if="row.status !== 'cancelled' && row.status !== 'completed'"
              icon="i-heroicons-x-mark"
              size="xs"
              variant="ghost"
              color="red"
              @click="updateStatus(row, 'cancelled')"
            />
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
  requiresAuth: true,
  requiresAdmin: true
})

const appointments = ref([])
const loading = ref(true)
const showFilters = ref(false)

const filters = reactive({
  search: '',
  status: null,
  dateFrom: '',
  dateTo: ''
})

const statusOptions = [
  { label: 'Todos', value: null },
  { label: 'Pendiente', value: 'pending' },
  { label: 'Confirmada', value: 'confirmed' },
  { label: 'Completada', value: 'completed' },
  { label: 'Cancelada', value: 'cancelled' }
]

const columns = [
  { key: 'pet', label: 'Mascota' },
  { key: 'service', label: 'Servicio' },
  { key: 'professional', label: 'Profesional' },
  { key: 'date', label: 'Fecha' },
  { key: 'start_time', label: 'Horario' },
  { key: 'status', label: 'Estado' },
  { key: 'actions', label: '' }
]

const getStatusColor = (status) => {
  const colors = {
    pending: 'yellow',
    confirmed: 'green',
    completed: 'blue',
    cancelled: 'red'
  }
  return colors[status] || 'gray'
}

const filteredAppointments = computed(() => {
  return appointments.value.filter(apt => {
    const matchesSearch = !filters.search ||
      apt.pet?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      apt.service?.name?.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesStatus = !filters.status || apt.status === filters.status
    
    const matchesDateFrom = !filters.dateFrom || apt.date >= filters.dateFrom
    const matchesDateTo = !filters.dateTo || apt.date <= filters.dateTo

    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo
  })
})

const updateStatus = async (appointment, newStatus) => {
  try {
    const { $feathers } = useNuxtApp()
    await $feathers.service('appointments').patch(appointment.id, {
      status: newStatus
    })
    appointment.status = newStatus
  } catch (error) {
    console.error('Error updating status:', error)
  }
}

const fetchAppointments = async () => {
  loading.value = true
  try {
    const { $feathers } = useNuxtApp()
    const result = await $feathers.service('appointments').find({
      query: {
        $limit: 200,
        $sort: { date: -1, start_time: 1 },
        $include: ['pet', 'service', 'professional.user']
      }
    })
    appointments.value = result.data || result
  } catch (error) {
    console.error('Error fetching appointments:', error)
  } finally {
    loading.value = false
  }
}

const handleExportExcel = () => {
  const columns = [
    { key: 'date', label: 'Fecha' },
    { key: 'start_time', label: 'Horario', formatter: (_, row) => `${row.start_time} - ${row.end_time}` },
    { key: 'pet', label: 'Mascota', formatter: (_, row) => row.pet?.name || 'Mascota' },
    { key: 'service', label: 'Servicio', formatter: (_, row) => row.service?.name || 'Consulta' },
    { key: 'professional', label: 'Profesional', formatter: (_, row) => row.professional?.user?.name || 'Veterinario' },
    { key: 'status', label: 'Estado', formatter: (v) => v }
  ]
  exportToExcel(filteredAppointments.value, columns, 'Agenda_Citas_MedVet')
}

const handlePrintAgenda = () => {
  if (typeof window !== 'undefined') window.print()
}

onMounted(() => fetchAppointments())
</script>
