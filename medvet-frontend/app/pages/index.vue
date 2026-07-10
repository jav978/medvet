<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 sm:py-20 lg:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
          Cuidamos a quienes más quieres
        </h1>
        <p class="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-2xl mx-auto">
          Reserva citas veterinarias de manera fácil y rápida
        </p>
        <NuxtLink to="/book">
          <UButton size="xl" color="white" variant="solid">
            Reservar Ahora
          </UButton>
        </NuxtLink>
      </div>
    </section>

    <!-- Services Section -->
    <section class="py-12 sm:py-16 bg-white dark:bg-gray-800 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-900 dark:text-white">
          Nuestros Servicios
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <UCard
            v-for="service in services"
            :key="service.id"
            class="hover:border-blue-500 transition-colors"
          >
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <UIcon :name="getServiceIcon(service.category)" class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{{ service.name }}</h3>
              </div>
            </template>
            <p class="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">{{ service.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ service.duration }} min</span>
              <span class="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                ${{ service.price?.toLocaleString() }}
              </span>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-900 dark:text-white">
          ¿Por qué elegirnos?
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div v-for="feature in features" :key="feature.title" class="text-center">
            <div class="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <UIcon :name="feature.icon" class="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{{ feature.title }}</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-12 sm:py-16 bg-white dark:bg-gray-800 transition-colors">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">¿Listo para reservar?</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base">
          Agenda tu cita en solo unos clics. Nuestro equipo de profesionales está listo para atender a tu mascota.
        </p>
        <NuxtLink to="/book">
          <UButton size="lg">
            Comenzar Reserva
          </UButton>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
const services = ref([])

const features = [
  {
    title: 'Fácil de usar',
    description: 'Reserva tu cita en menos de 2 minutos desde cualquier dispositivo.',
    icon: 'i-heroicons-sparkles'
  },
  {
    title: 'Profesionales calificados',
    description: 'Nuestro equipo cuenta con amplia experiencia y certificaciones.',
    icon: 'i-heroicons-user-group'
  },
  {
    title: 'Recordatorios',
    description: 'Recibe notificaciones antes de tu cita para que no se te olvide.',
    icon: 'i-heroicons-bell'
  }
]

const getServiceIcon = (category) => {
  const icons = {
    consulta: 'i-heroicons-magnifying-glass',
    vacuna: 'i-heroicons-syringe',
    cirugia: 'i-heroicons-scissors',
    emergencia: 'i-heroicons-exclamation-triangle',
    estetica: 'i-heroicons-sparkles',
    laboratorio: 'i-heroicons-beaker'
  }
  return icons[category] || 'i-heroicons-heart'
}

onMounted(async () => {
  try {
    const { $feathers } = useNuxtApp()
    const result = await $feathers.service('services').find({
      query: { active: true, $limit: 6 }
    })
    services.value = result.data || result
  } catch (error) {
    console.error('Error fetching services:', error)
  }
})
</script>
