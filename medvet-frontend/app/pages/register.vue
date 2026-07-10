<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold text-3xl">M</span>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
        <p class="text-gray-600 mt-2">Regístrate para reservar citas</p>
      </div>

      <UCard>
        <UForm :state="form" @submit="handleRegister">
          <UFormGroup label="Nombre" name="name" class="mb-4">
            <UInput
              v-model="form.name"
              placeholder="Tu nombre completo"
              required
            />
          </UFormGroup>

          <UFormGroup label="Email" name="email" class="mb-4">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="tu@email.com"
              required
            />
          </UFormGroup>

          <UFormGroup label="Teléfono" name="phone" class="mb-4">
            <UInput
              v-model="form.phone"
              placeholder="+54 11 1234-5678"
            />
          </UFormGroup>

          <UFormGroup label="Contraseña" name="password" class="mb-4">
            <UInput
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              required
            />
          </UFormGroup>

          <UFormGroup label="Confirmar Contraseña" name="confirmPassword" class="mb-6">
            <UInput
              v-model="form.confirmPassword"
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
            Crear Cuenta
          </UButton>
        </UForm>

        <div class="mt-6 text-center">
          <p class="text-gray-600">
            ¿Ya tienes cuenta?
            <NuxtLink to="/login" class="text-blue-600 hover:underline">
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
