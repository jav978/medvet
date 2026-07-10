<template>
  <div class="max-w-2xl mx-auto py-8 sm:py-12 px-4 text-center">
    <!-- Success Icon -->
    <div class="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
      <UIcon name="i-heroicons-check" class="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" />
    </div>

    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">¡Cita Reservada!</h1>
    <p class="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base">
      Tu cita ha sido registrada exitosamente. Recibirás una confirmación por email.
    </p>

    <!-- Appointment Details -->
    <UCard v-if="appointment" class="text-left mb-6 sm:mb-8">
      <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Detalles de tu Cita</h2>
      <div class="space-y-3">
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Servicio:</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ appointment.service?.name }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Mascota:</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ appointment.pet?.name }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Fecha:</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ appointment.date }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Hora:</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ appointment.start_time }} - {{ appointment.end_time }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Profesional:</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ appointment.professional?.name }}</span>
        </div>
        <UDivider />
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Estado:</span>
          <UBadge :color="getStatusColor(appointment.status)">
            {{ appointment.status }}
          </UBadge>
        </div>
      </div>
    </UCard>

    <!-- Actions -->
    <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
      <NuxtLink to="/dashboard/my-appointments" class="w-full sm:w-auto">
        <UButton variant="outline" block>
          Ver Mis Citas
        </UButton>
      </NuxtLink>
      <NuxtLink to="/" class="w-full sm:w-auto">
        <UButton block>
          Volver al Inicio
        </UButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const appointment = ref(null)

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
    const result = await $feathers.service('appointments').get(route.params.id, {
      query: {
        $include: ['service', 'pet', 'professional.user']
      }
    })
    appointment.value = result
  } catch (error) {
    console.error('Error fetching appointment:', error)
  }
})
</script>
