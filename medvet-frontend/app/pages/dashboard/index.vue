<template>
  <div class="max-w-7xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-8">Mi Panel</h1>

    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <UCard>
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-calendar" class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p class="text-2xl font-bold">{{ appointmentsCount }}</p>
            <p class="text-gray-600">Citas Próximas</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-heart" class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p class="text-2xl font-bold">{{ petsCount }}</p>
            <p class="text-gray-600">Mascotas</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-clock" class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p class="text-2xl font-bold">{{ completedCount }}</p>
            <p class="text-gray-600">Citas Completadas</p>
          </div>
        </div>
      </UCard>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Próximas Citas</h2>
        </template>
        <div v-if="upcomingAppointments.length" class="space-y-4">
          <div
            v-for="apt in upcomingAppointments"
            :key="apt.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p class="font-medium">{{ apt.service?.name }}</p>
              <p class="text-sm text-gray-600">{{ apt.date }} - {{ apt.start_time }}</p>
            </div>
            <UBadge :color="apt.status === 'confirmed' ? 'green' : 'yellow'">
              {{ apt.status }}
            </UBadge>
          </div>
        </div>
        <p v-else class="text-gray-500 text-center py-4">No tienes citas próximas</p>
        <template #footer>
          <NuxtLink to="/book">
            <UButton block variant="outline">Reservar Nueva Cita</UButton>
          </NuxtLink>
        </template>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Mis Mascotas</h2>
        </template>
        <div v-if="pets.length" class="space-y-4">
          <div
            v-for="pet in pets"
            :key="pet.id"
            class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <UIcon name="i-heroicons-heart" class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p class="font-medium">{{ pet.name }}</p>
              <p class="text-sm text-gray-600">{{ pet.species }} - {{ pet.breed }}</p>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500 text-center py-4">Aún no tienes mascotas registradas</p>
        <template #footer>
          <NuxtLink to="/dashboard/my-pets">
            <UButton block variant="outline">Gestionar Mascotas</UButton>
          </NuxtLink>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  requiresAuth: true
})

const authStore = useAuthStore()

const appointments = ref([])
const pets = ref([])

const appointmentsCount = computed(() => appointments.value.filter(a => a.status !== 'cancelled').length)
const petsCount = computed(() => pets.value.length)
const completedCount = computed(() => appointments.value.filter(a => a.status === 'completed').length)

const upcomingAppointments = computed(() => {
  return appointments.value
    .filter(a => a.status === 'pending' || a.status === 'confirmed')
    .slice(0, 5)
})

onMounted(async () => {
  try {
    const { $feathers } = useNuxtApp()

    const aptResult = await $feathers.service('appointments').find({
      query: { user_id: authStore.user.id, $sort: { date: -1 } }
    })
    appointments.value = aptResult.data || aptResult

    const petResult = await $feathers.service('pets').find({
      query: { user_id: authStore.user.id }
    })
    pets.value = petResult.data || petResult
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>
