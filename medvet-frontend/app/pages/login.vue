<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 transition-colors">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold text-2xl sm:text-3xl">M</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Iniciar Sesión</h2>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Accede a tu cuenta de MedVet</p>
      </div>

      <!-- Form Card -->
      <UCard>
        <UForm :state="form" @submit="handleLogin">
          <UFormGroup label="Email" name="email" class="mb-4">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="tu@email.com"
              icon="i-heroicons-envelope"
              required
            />
          </UFormGroup>

          <UFormGroup label="Contraseña" name="password" class="mb-6">
            <UInput
              v-model="form.password"
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
            Iniciar Sesión
          </UButton>
        </UForm>

        <div class="mt-6 text-center">
          <p class="text-gray-600 dark:text-gray-400">
            ¿No tienes cuenta?
            <NuxtLink to="/register" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Regístrate aquí
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
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.login(form.email, form.password)
    router.push('/dashboard')
  } catch (e) {
    error.value = 'Credenciales incorrectas. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>
