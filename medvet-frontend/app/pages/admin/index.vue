<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-8">Panel de Administración</h1>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <UCard>
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-users" class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p class="text-2xl font-bold">{{ stats.users }}</p>
            <p class="text-gray-600">Usuarios</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-calendar" class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p class="text-2xl font-bold">{{ stats.appointments }}</p>
            <p class="text-gray-600">Citas Hoy</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-heart" class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p class="text-2xl font-bold">{{ stats.pets }}</p>
            <p class="text-gray-600">Mascotas</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-currency-dollar" class="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p class="text-2xl font-bold">${{ stats.revenue?.toLocaleString() }}</p>
            <p class="text-gray-600">Ingresos Hoy</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Quick Actions -->
    <h2 class="text-xl font-semibold mb-4">Acciones Rápidas</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <NuxtLink
        v-for="action in quickActions"
        :key="action.to"
        :to="action.to"
        class="block"
      >
        <UCard class="hover:border-blue-500 transition-colors cursor-pointer text-center">
          <UIcon :name="action.icon" class="w-8 h-8 mx-auto mb-2" :class="action.color" />
          <p class="text-sm font-medium">{{ action.label }}</p>
        </UCard>
      </NuxtLink>
    </div>

    <!-- Recent Activity -->
    <div class="grid lg:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Últimas Citas</h2>
        </template>
        <div class="space-y-3">
          <div
            v-for="apt in recentAppointments"
            :key="apt.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p class="font-medium">{{ apt.pet?.name }}</p>
              <p class="text-sm text-gray-600">{{ apt.service?.name }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm">{{ apt.date }}</p>
              <UBadge :color="getStatusColor(apt.status)" size="xs">
                {{ apt.status }}
              </UBadge>
            </div>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Profesionales Disponibles</h2>
        </template>
        <div class="space-y-3">
          <div
            v-for="vet in professionals"
            :key="vet.id"
            class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <UAvatar :alt="vet.user?.name" size="sm" />
            <div class="flex-1">
              <p class="font-medium">{{ vet.user?.name }}</p>
              <p class="text-sm text-gray-600">{{ vet.specialty }}</p>
            </div>
            <UBadge :color="vet.active ? 'green' : 'red'" size="xs">
              {{ vet.active ? 'Activo' : 'Inactivo' }}
            </UBadge>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
  requiresAuth: true,
  requiredRole: 'admin'
})

const stats = ref({
  users: 0,
  appointments: 0,
  pets: 0,
  revenue: 0
})

const recentAppointments = ref([])
const professionals = ref([])

const quickActions = [
  { label: 'Usuarios', to: '/admin/users', icon: 'i-heroicons-users', color: 'text-blue-600' },
  { label: 'Mascotas', to: '/admin/pets', icon: 'i-heroicons-heart', color: 'text-pink-600' },
  { label: 'Servicios', to: '/admin/services', icon: 'i-heroicons-briefcase', color: 'text-green-600' },
  { label: 'Profesionales', to: '/admin/professionals', icon: 'i-heroicons-user-group', color: 'text-purple-600' },
  { label: 'Horarios', to: '/admin/schedules', icon: 'i-heroicons-clock', color: 'text-yellow-600' },
  { label: 'Citas', to: '/admin/appointments', icon: 'i-heroicons-calendar', color: 'text-indigo-600' }
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

onMounted(async () => {
  try {
    const { $feathers } = useNuxtApp()

    const [users, appointments, pets, profs] = await Promise.all([
      $feathers.service('users').find({ query: { $limit: 1 } }),
      $feathers.service('appointments').find({ query: { $limit: 1 } }),
      $feathers.service('pets').find({ query: { $limit: 1 } }),
      $feathers.service('professionals').find({ query: { $limit: 5 } })
    ])

    stats.value.users = users.total || users.length || 0
    stats.value.appointments = appointments.total || appointments.length || 0
    stats.value.pets = pets.total || pets.length || 0

    recentAppointments.value = (appointments.data || appointments).slice(0, 5)
    professionals.value = profs.data || profs
  } catch (error) {
    console.error('Error fetching admin stats:', error)
  }
})
</script>
