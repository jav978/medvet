<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          Cuidamos a quienes más quieres
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-blue-100">
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
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <UCard v-for="service in services" :key="service.id">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UIcon :name="getServiceIcon(service.category)" class="w-6 h-6 text-blue-600" />
                </div>
                <h3 class="text-lg font-semibold">{{ service.name }}</h3>
              </div>
            </template>
            <p class="text-gray-600 mb-4">{{ service.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">{{ service.duration }} min</span>
              <span class="text-lg font-bold text-blue-600">
                ${{ service.price?.toLocaleString() }}
              </span>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gray-100 py-16">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">¿Listo para reservar?</h2>
        <p class="text-gray-600 mb-8">
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
