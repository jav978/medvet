<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 transition-colors">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold text-2xl sm:text-3xl">M</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Crear Cuenta</h2>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Regístrate para reservar citas</p>
      </div>

      <!-- Form Card -->
      <UCard>
        <UForm :state="form" @submit="handleRegister">
          <UFormGroup label="Nombre" name="name" class="mb-4">
            <UInput
              v-model="form.name"
              placeholder="Tu nombre completo"
              icon="i-heroicons-user"
              required
            />
          </UFormGroup>

          <UFormGroup label="Email" name="email" class="mb-4">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="tu@email.com"
              icon="i-heroicons-envelope"
              required
            />
          </UFormGroup>

          <UFormGroup label="Teléfono" name="phone" class="mb-4">
            <UInput
              v-model="form.phone"
              placeholder="+54 11 1234-5678"
              icon="i-heroicons-phone"
            />
          </UFormGroup>

          <UFormGroup label="Contraseña" name="password" class="mb-4">
            <UInput
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              icon="i-heroicons-lock-closed"
              required
            />
          </UFormGroup>

          <UFormGroup label="Confirmar Contraseña" name="confirmPassword" class="mb-6">
            <UInput
              v-model="form.confirmPassword"
              type="password"
              placeholder="••••••••"
              icon="i-heroicons-lock-closed"
              required
            />
          </UFormGroup>

          <UAlert
            v-if="error"
            color="red"
            :description="error"
            class="mb-4"
          />

          <UButton
            type="submit"
            block
            size="lg"
            :loading="loading"
          >
            Crear Cuenta
          </UButton>
        </UForm>

        <div class="mt-6 text-center">
          <p class="text-gray-600 dark:text-gray-400">
            ¿Ya tienes cuenta?
            <NuxtLink to="/login" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Inicia sesión
            </NuxtLink>
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await authStore.register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password
    })
    router.push('/dashboard')
  } catch (e) {
    error.value = 'Error al crear la cuenta. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>
