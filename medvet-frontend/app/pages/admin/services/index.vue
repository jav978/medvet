<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Gestionar Servicios</h1>
      <UButton @click="openModal()" icon="i-heroicons-plus">
        <span class="hidden sm:inline">Nuevo Servicio</span>
        <span class="sm:hidden">Nuevo</span>
      </UButton>
    </div>

    <UCard>
      <UTable :columns="columns" :rows="services" :loading="loading">
        <template #price-data="{ row }">
          <span class="font-semibold text-green-600 dark:text-green-400">${{ row.price?.toLocaleString() }}</span>
        </template>
        <template #duration-data="{ row }">
          <span>{{ row.duration }} min</span>
        </template>
        <template #active-data="{ row }">
          <UBadge :color="row.active ? 'green' : 'red'">
            {{ row.active ? 'Activo' : 'Inactivo' }}
          </UBadge>
        </template>
        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton icon="i-heroicons-pencil" size="xs" variant="ghost" @click="openModal(row)" />
            <UButton icon="i-heroicons-trash" size="xs" variant="ghost" color="red" @click="deleteService(row)" />
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Service Modal -->
    <UModal v-model="showModal">
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ editingService ? 'Editar Servicio' : 'Nuevo Servicio' }}
          </h2>
        </template>

        <UForm :schema="serviceSchema" :state="formState" @submit="saveService" class="space-y-4">
          <UFormField label="Nombre" name="name">
            <UInput v-model="formState.name" placeholder="Nombre del servicio" />
          </UFormField>

          <UFormField label="Descripción" name="description">
            <UTextarea v-model="formState.description" placeholder="Descripción del servicio" :rows="3" />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Duración (min)" name="duration">
              <UInput v-model.number="formState.duration" type="number" placeholder="30" />
            </UFormField>

            <UFormField label="Precio ($)" name="price">
              <UInput v-model.number="formState.price" type="number" placeholder="15000" />
            </UFormField>
          </div>

          <UFormField label="Estado" name="active">
            <UToggle v-model="formState.active" />
          </UFormField>

          <div class="flex justify-end gap-3">
            <UButton variant="outline" @click="showModal = false">Cancelar</UButton>
            <UButton type="submit" :loading="saving">
              {{ editingService ? 'Guardar Cambios' : 'Crear Servicio' }}
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
  requiresAdmin: true
})

const serviceSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  description: z.string().optional(),
  duration: z.number().min(15, 'Mínimo 15 minutos'),
  price: z.number().min(0, 'Precio inválido'),
  active: z.boolean()
})

const services = ref([])
const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const editingService = ref(null)

const formState = reactive({
  name: '',
  description: '',
  duration: 30,
  price: 0,
  active: true
})

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'description', label: 'Descripción' },
  { key: 'duration', label: 'Duración' },
  { key: 'price', label: 'Precio' },
  { key: 'active', label: 'Estado' },
  { key: 'actions', label: '' }
]

const openModal = (service = null) => {
  editingService.value = service
  if (service) {
    formState.name = service.name
    formState.description = service.description || ''
    formState.duration = service.duration
    formState.price = service.price
    formState.active = service.active
  } else {
    formState.name = ''
    formState.description = ''
    formState.duration = 30
    formState.price = 0
    formState.active = true
  }
  showModal.value = true
}

const saveService = async () => {
  saving.value = true
  try {
    const { $feathers } = useNuxtApp()
    
    if (editingService.value) {
      await $feathers.service('services').patch(editingService.value.id, { ...formState })
    } else {
      await $feathers.service('services').create({ ...formState })
    }
    
    await fetchServices()
    showModal.value = false
  } catch (error) {
    console.error('Error saving service:', error)
  } finally {
    saving.value = false
  }
}

const deleteService = async (service) => {
  if (confirm(`¿Eliminar servicio ${service.name}?`)) {
    try {
      const { $feathers } = useNuxtApp()
      await $feathers.service('services').remove(service.id)
      await fetchServices()
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }
}

const fetchServices = async () => {
  loading.value = true
  try {
    const { $feathers } = useNuxtApp()
    const result = await $feathers.service('services').find({ query: { $limit: 100 } })
    services.value = result.data || result
  } catch (error) {
    console.error('Error fetching services:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchServices())
</script>
