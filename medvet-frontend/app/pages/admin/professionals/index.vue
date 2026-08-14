<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Gestionar Profesionales</h1>
      <UButton @click="openModal()" icon="i-heroicons-plus">
        <span class="hidden sm:inline">Nuevo Profesional</span>
        <span class="sm:hidden">Nuevo</span>
      </UButton>
    </div>

    <UCard>
      <UTable :columns="columns" :rows="professionals" :loading="loading">
        <template #user-data="{ row }">
          <div class="flex items-center space-x-2">
            <UAvatar :alt="row.user?.name" size="xs" />
            <span class="text-gray-900 dark:text-white">{{ row.user?.name }}</span>
          </div>
        </template>
        <template #specialty-data="{ row }">
          <UBadge variant="subtle">{{ row.specialty }}</UBadge>
        </template>
        <template #active-data="{ row }">
          <UBadge :color="row.active ? 'green' : 'red'">
            {{ row.active ? 'Activo' : 'Inactivo' }}
          </UBadge>
        </template>
        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton icon="i-heroicons-pencil" size="xs" variant="ghost" @click="openModal(row)" />
            <UButton icon="i-heroicons-trash" size="xs" variant="ghost" color="red" @click="deleteProfessional(row)" />
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Professional Modal -->
    <UModal v-model="showModal">
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ editingProfessional ? 'Editar Profesional' : 'Nuevo Profesional' }}
          </h2>
        </template>

        <UForm :schema="professionalSchema" :state="formState" @submit="saveProfessional" class="space-y-4">
          <UFormField label="Usuario" name="user_id">
            <USelect v-model="formState.user_id" :items="userOptions" placeholder="Seleccionar usuario" />
          </UFormField>

          <UFormField label="Especialidad" name="specialty">
            <UInput v-model="formState.specialty" placeholder="Ej: Cirugía, Dermatología" />
          </UFormField>

          <UFormField label="Licencia Profesional" name="license_number">
            <UInput v-model="formState.license_number" placeholder="Número de licencia" />
          </UFormField>

          <UFormField label="Biografía" name="bio">
            <UTextarea v-model="formState.bio" placeholder="Breve descripción..." :rows="3" />
          </UFormField>

          <UFormField label="Estado" name="active">
            <UToggle v-model="formState.active" />
          </UFormField>

          <div class="flex justify-end gap-3">
            <UButton variant="outline" @click="showModal = false">Cancelar</UButton>
            <UButton type="submit" :loading="saving">
              {{ editingProfessional ? 'Guardar Cambios' : 'Crear Profesional' }}
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

const professionalSchema = z.object({
  user_id: z.string().uuid('Selecciona un usuario'),
  specialty: z.string().min(2, 'Mínimo 2 caracteres'),
  license_number: z.string().optional(),
  bio: z.string().optional(),
  active: z.boolean()
})

const professionals = ref([])
const users = ref([])
const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const editingProfessional = ref(null)

const formState = reactive({
  user_id: '',
  specialty: '',
  license_number: '',
  bio: '',
  active: true
})

const userOptions = computed(() =>
  users.value.map(u => ({ label: `${u.name} (${u.email})`, value: u.id }))
)

const columns = [
  { key: 'user', label: 'Usuario' },
  { key: 'specialty', label: 'Especialidad' },
  { key: 'license_number', label: 'Licencia' },
  { key: 'active', label: 'Estado' },
  { key: 'actions', label: '' }
]

const openModal = (professional = null) => {
  editingProfessional.value = professional
  if (professional) {
    formState.user_id = professional.user_id
    formState.specialty = professional.specialty
    formState.license_number = professional.license_number || ''
    formState.bio = professional.bio || ''
    formState.active = professional.active
  } else {
    formState.user_id = ''
    formState.specialty = ''
    formState.license_number = ''
    formState.bio = ''
    formState.active = true
  }
  showModal.value = true
}

const saveProfessional = async () => {
  saving.value = true
  try {
    const { $feathers } = useNuxtApp()
    
    if (editingProfessional.value) {
      await $feathers.service('professionals').patch(editingProfessional.value.id, { ...formState })
    } else {
      await $feathers.service('professionals').create({ ...formState })
    }
    
    await fetchProfessionals()
    showModal.value = false
  } catch (error) {
    console.error('Error saving professional:', error)
  } finally {
    saving.value = false
  }
}

const deleteProfessional = async (professional) => {
  if (confirm('¿Eliminar este profesional?')) {
    try {
      const { $feathers } = useNuxtApp()
      await $feathers.service('professionals').remove(professional.id)
      await fetchProfessionals()
    } catch (error) {
      console.error('Error deleting professional:', error)
    }
  }
}

const fetchProfessionals = async () => {
  loading.value = true
  try {
    const { $feathers } = useNuxtApp()
    const result = await $feathers.service('professionals').find({
      query: { $limit: 100, $include: ['user'] }
    })
    professionals.value = result.data || result
  } catch (error) {
    console.error('Error fetching professionals:', error)
  } finally {
    loading.value = false
  }
}

const fetchUsers = async () => {
  try {
    const { $feathers } = useNuxtApp()
    const result = await $feathers.service('users').find({
      query: { role: 'veterinarian', $limit: 100 }
    })
    users.value = result.data || result
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

onMounted(async () => {
  await Promise.all([fetchProfessionals(), fetchUsers()])
})
</script>
