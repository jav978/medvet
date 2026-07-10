<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold text-3xl">M</span>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
        <p class="text-gray-600 mt-2">Accede a tu cuenta de MedVet</p>
      </div>

      <UCard>
        <UForm :state="form" @submit="handleLogin">
          <UFormGroup label="Email" name="email" class="mb-4">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="tu@email.com"
              required
            />
          </UFormGroup>

          <UFormGroup label="Contraseña" name="password" class="mb-6">
            <UInput
              v-model="form.password"
              type="password"
              placeholder="••••••••"
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
            :loading="loading"
          >
            Iniciar Sesión
          </UButton>
        </UForm>

        <div class="mt-6 text-center">
          <p class="text-gray-600">
            ¿No tienes cuenta?
            <NuxtLink to="/register" class="text-blue-600 hover:underline">
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
