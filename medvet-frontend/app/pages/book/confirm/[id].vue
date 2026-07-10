<template>
  <div class="max-w-2xl mx-auto py-12 px-4 text-center">
    <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <UIcon name="i-heroicons-check" class="w-10 h-10 text-green-600" />
    </div>

    <h1 class="text-3xl font-bold text-gray-900 mb-4">¡Cita Reservada!</h1>
    <p class="text-gray-600 mb-8">
      Tu cita ha sido registrada exitosamente. Recibirás una confirmación por email.
    </p>

    <UCard v-if="appointment" class="text-left mb-8">
      <h2 class="text-lg font-semibold mb-4">Detalles de tu Cita</h2>
      <div class="space-y-3">
        <div class="flex justify-between">
          <span class="text-gray-600">Servicio:</span>
          <span class="font-semibold">{{ appointment.service?.name }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Mascota:</span>
          <span class="font-semibold">{{ appointment.pet?.name }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Fecha:</span>
          <span class="font-semibold">{{ appointment.date }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Hora:</span>
          <span class="font-semibold">{{ appointment.start_time }} - {{ appointment.end_time }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Profesional:</span>
          <span class="font-semibold">{{ appointment.professional?.name }}</span>
        </div>
        <UDivider />
        <div class="flex justify-between">
          <span class="text-gray-600">Estado:</span>
          <UBadge :color="getStatusColor(appointment.status)">
            {{ appointment.status }}
          </UBadge>
        </div>
      </div>
    </UCard>

    <div class="flex justify-center gap-4">
      <NuxtLink to="/dashboard/my-appointments">
        <UButton variant="outline">
          Ver Mis Citas
        </UButton>
      </NuxtLink>
      <NuxtLink to="/">
        <UButton>
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
