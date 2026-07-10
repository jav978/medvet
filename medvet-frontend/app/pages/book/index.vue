<template>
  <div class="max-w-4xl mx-auto py-12 px-4">
    <h1 class="text-3xl font-bold text-center mb-8">Reservar Cita</h1>

    <!-- Stepper -->
    <UStepper :items="stepperItems" :model-value="bookingStore.step" class="mb-8" />

    <!-- Step 1: Select Service -->
    <div v-if="bookingStore.step === 1">
      <h2 class="text-xl font-semibold mb-4">Selecciona un Servicio</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <UCard
          v-for="service in bookingStore.services"
          :key="service.id"
          class="cursor-pointer hover:border-blue-500 transition-colors"
          :class="{ 'border-2 border-blue-500': bookingStore.selectedService?.id === service.id }"
          @click="bookingStore.selectService(service)"
        >
          <h3 class="font-semibold">{{ service.name }}</h3>
          <p class="text-gray-600 text-sm">{{ service.description }}</p>
          <div class="mt-2 flex justify-between">
            <span class="text-sm text-gray-500">{{ service.duration }} min</span>
            <span class="font-bold text-blue-600">${{ service.price?.toLocaleString() }}</span>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Step 2: Select Pet -->
    <div v-if="bookingStore.step === 2">
      <h2 class="text-xl font-semibold mb-4">Selecciona tu Mascota</h2>
      <div v-if="authStore.isAuthenticated" class="grid md:grid-cols-2 gap-4">
        <UCard
          v-for="pet in bookingStore.pets"
          :key="pet.id"
          class="cursor-pointer hover:border-blue-500 transition-colors"
          :class="{ 'border-2 border-blue-500': bookingStore.selectedPet?.id === pet.id }"
          @click="bookingStore.selectPet(pet)"
        >
          <h3 class="font-semibold">{{ pet.name }}</h3>
          <p class="text-gray-600 text-sm">{{ pet.species }} - {{ pet.breed }}</p>
        </UCard>

        <UCard class="border-dashed border-2 border-gray-300 cursor-pointer hover:border-blue-500">
          <div class="text-center text-gray-500">
            <UIcon name="i-heroicons-plus" class="w-8 h-8 mx-auto mb-2" />
            <p>Agregar nueva mascota</p>
          </div>
        </UCard>
      </div>
      <div v-else class="text-center py-8">
        <p class="text-gray-600 mb-4">Inicia sesión para seleccionar tu mascota</p>
        <NuxtLink to="/login">
          <UButton>Iniciar Sesión</UButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Step 3: Select Date -->
    <div v-if="bookingStore.step === 3">
      <h2 class="text-xl font-semibold mb-4">Selecciona una Fecha</h2>
      <UCalendar v-model="selectedDate" />
      <UButton
        class="mt-4"
        :disabled="!selectedDate"
        @click="handleDateSelect"
      >
        Continuar
      </UButton>
    </div>

    <!-- Step 4: Select Time -->
    <div v-if="bookingStore.step === 4">
      <h2 class="text-xl font-semibold mb-4">Selecciona un Horario</h2>
      <div v-if="bookingStore.availableSlots.length" class="grid grid-cols-3 md:grid-cols-4 gap-3">
        <UButton
          v-for="slot in bookingStore.availableSlots.filter(s => s.available)"
          :key="`${slot.professional_id}-${slot.time}`"
          variant="outline"
          :class="{ 'bg-blue-500 text-white': bookingStore.selectedSlot?.time === slot.time && bookingStore.selectedSlot?.professional_id === slot.professional_id }"
          @click="bookingStore.selectSlot(slot)"
        >
          {{ slot.time }}
          <span class="text-xs block">{{ slot.professional_name }}</span>
        </UButton>
      </div>
      <p v-else class="text-gray-500 text-center py-8">
        No hay horarios disponibles para esta fecha
      </p>
    </div>

    <!-- Step 5: Confirm -->
    <div v-if="bookingStore.step === 5">
      <h2 class="text-xl font-semibold mb-4">Confirmar Reserva</h2>
      <UCard>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Servicio:</span>
            <span class="font-semibold">{{ bookingStore.selectedService?.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Mascota:</span>
            <span class="font-semibold">{{ bookingStore.selectedPet?.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Fecha:</span>
            <span class="font-semibold">{{ bookingStore.selectedDate }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Hora:</span>
            <span class="font-semibold">{{ bookingStore.selectedSlot?.time }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Profesional:</span>
            <span class="font-semibold">{{ bookingStore.selectedSlot?.professional_name }}</span>
          </div>
          <UDivider />
          <div class="flex justify-between text-lg">
            <span class="font-semibold">Total:</span>
            <span class="font-bold text-blue-600">${{ bookingStore.selectedService?.price?.toLocaleString() }}</span>
          </div>
        </div>
      </UCard>

      <UFormGroup label="Notas adicionales" class="mt-4">
        <UTextarea v-model="notes" placeholder="Alguna nota especial..." />
      </UFormGroup>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between mt-8">
      <UButton
        v-if="bookingStore.step > 1"
        variant="outline"
        @click="bookingStore.prevStep()"
      >
        Anterior
      </UButton>
      <div v-else />

      <UButton
        v-if="bookingStore.step < 5"
        :disabled="!canProceed"
        @click="bookingStore.nextStep()"
      >
        Siguiente
      </UButton>
      <UButton
        v-else
        :loading="bookingStore.loading"
        @click="handleConfirm"
      >
        Confirmar Reserva
      </UButton>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const bookingStore = useBookingStore()
const router = useRouter()

const selectedDate = ref(new Date())
const notes = ref('')

const stepperItems = [
  { title: 'Servicio', description: 'Selecciona el servicio' },
  { title: 'Mascota', description: 'Elige tu mascota' },
  { title: 'Fecha', description: 'Selecciona fecha' },
  { title: 'Hora', description: 'Elige horario' },
  { title: 'Confirmar', description: 'Revisa y confirma' }
]

const canProceed = computed(() => {
  switch (bookingStore.step) {
    case 1: return bookingStore.selectedService !== null
    case 2: return bookingStore.selectedPet !== null
    case 3: return bookingStore.selectedDate !== null
    case 4: return bookingStore.selectedSlot !== null
    default: return true
  }
})

const handleDateSelect = async () => {
  const dateStr = selectedDate.value.toISOString().split('T')[0]
  bookingStore.selectDate(dateStr)
  await bookingStore.fetchAvailableSlots(
    bookingStore.selectedService.id,
    dateStr
  )
}

const handleConfirm = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  try {
    const appointment = await bookingStore.confirmBooking(
      authStore.user.id,
      notes.value
    )
    router.push(`/book/confirm/${appointment.id}`)
  } catch (error) {
    console.error('Error confirming booking:', error)
  }
}

onMounted(async () => {
  await bookingStore.fetchServices()
  if (authStore.isAuthenticated) {
    await bookingStore.fetchPets(authStore.user.id)
  }
})
</script>
