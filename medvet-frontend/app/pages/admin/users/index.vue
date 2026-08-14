<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Gestionar Usuarios</h1>
      <UButton @click="openModal()" icon="i-heroicons-plus">
        <span class="hidden sm:inline">Nuevo Usuario</span>
        <span class="sm:hidden">Nuevo</span>
      </UButton>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <UInput
        v-model="searchQuery"
        placeholder="Buscar usuarios..."
        icon="i-heroicons-magnifying-glass"
        class="w-full sm:w-64"
      />
      <USelect
        v-model="roleFilter"
        :items="roleOptions"
        placeholder="Filtrar por rol"
        class="w-full sm:w-48"
      />
    </div>

    <!-- Users Table -->
    <UCard>
      <UTable :columns="columns" :rows="filteredUsers" :loading="loading">
        <template #role-data="{ row }">
          <UBadge :color="getRoleColor(row.role)" size="sm">
            {{ row.role }}
          </UBadge>
        </template>
        <template #actions-data="{ row }">
          <div class="flex gap-1">
            <UButton icon="i-heroicons-pencil" size="xs" variant="ghost" @click="openModal(row)" />
            <UButton icon="i-heroicons-trash" size="xs" variant="ghost" color="red" @click="deleteUser(row)" />
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- User Modal -->
    <UModal v-model="showModal">
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h2>
        </template>

        <UForm :schema="userSchema" :state="formState" @submit="saveUser" class="space-y-4">
          <UFormField label="Nombre" name="name">
            <UInput v-model="formState.name" placeholder="Nombre completo" icon="i-heroicons-user" />
          </UFormField>

          <UFormField label="Email" name="email">
            <UInput v-model="formState.email" placeholder="email@ejemplo.com" icon="i-heroicons-envelope" />
          </UFormField>

          <UFormField v-if="!editingUser" label="Contraseña" name="password">
            <UInput v-model="formState.password" type="password" placeholder="••••••••" icon="i-heroicons-lock-closed" />
          </UFormField>

          <UFormField label="Rol" name="role">
            <USelect v-model="formState.role" :items="roleOptions" />
          </UFormField>

          <UFormField label="Teléfono" name="phone">
            <UInput v-model="formState.phone" placeholder="+54 11 1234-5678" icon="i-heroicons-phone" />
          </UFormField>

          <div class="flex justify-end gap-3">
            <UButton variant="outline" @click="showModal = false">Cancelar</UButton>
            <UButton type="submit" :loading="saving">
              {{ editingUser ? 'Guardar Cambios' : 'Crear Usuario' }}
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

const userSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres').optional(),
  role: z.enum(['admin', 'receptionist', 'veterinarian', 'client']),
  phone: z.string().optional()
})

const users = ref([])
const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const editingUser = ref(null)
const searchQuery = ref('')
const roleFilter = ref(null)

const formState = reactive({
  name: '',
  email: '',
  password: '',
  role: 'client',
  phone: ''
})

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Recepcionista', value: 'receptionist' },
  { label: 'Veterinario', value: 'veterinarian' },
  { label: 'Cliente', value: 'client' }
]

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Rol' },
  { key: 'phone', label: 'Teléfono' },
  { key: 'actions', label: '' }
]

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = !roleFilter.value || user.role === roleFilter.value
    return matchesSearch && matchesRole
  })
})

const getRoleColor = (role) => {
  const colors = {
    admin: 'red',
    receptionist: 'blue',
    veterinarian: 'green',
    client: 'gray'
  }
  return colors[role] || 'gray'
}

const openModal = (user = null) => {
  editingUser.value = user
  if (user) {
    formState.name = user.name
    formState.email = user.email
    formState.role = user.role
    formState.phone = user.phone || ''
    formState.password = ''
  } else {
    formState.name = ''
    formState.email = ''
    formState.role = 'client'
    formState.phone = ''
    formState.password = ''
  }
  showModal.value = true
}

const saveUser = async () => {
  saving.value = true
  try {
    const { $feathers } = useNuxtApp()
    
    if (editingUser.value) {
      const { password, ...data } = formState
      if (password) data.password = password
      await $feathers.service('users').patch(editingUser.value.id, data)
    } else {
      await $feathers.service('users').create(formState)
    }
    
    await fetchUsers()
    showModal.value = false
  } catch (error) {
    console.error('Error saving user:', error)
  } finally {
    saving.value = false
  }
}

const deleteUser = async (user) => {
  if (confirm(`¿Eliminar usuario ${user.name}?`)) {
    try {
      const { $feathers } = useNuxtApp()
      await $feathers.service('users').remove(user.id)
      await fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const { $feathers } = useNuxtApp()
    const result = await $feathers.service('users').find({ query: { $limit: 100 } })
    users.value = result.data || result
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchUsers())
</script>
