<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">M</span>
            </div>
            <span class="text-xl font-bold text-gray-900">MedVet</span>
          </NuxtLink>

          <nav class="flex items-center space-x-4">
            <NuxtLink to="/book" class="text-gray-600 hover:text-gray-900">
              Reservar Cita
            </NuxtLink>
            <template v-if="authStore.isAuthenticated">
              <NuxtLink to="/dashboard" class="text-gray-600 hover:text-gray-900">
                Mi Panel
              </NuxtLink>
              <NuxtLink v-if="authStore.canAccessAdmin" to="/admin" class="text-gray-600 hover:text-gray-900">
                Admin
              </NuxtLink>
              <UButton @click="handleLogout" variant="ghost">
                Salir
              </UButton>
            </template>
            <template v-else>
              <NuxtLink to="/login">
                <UButton>Iniciar Sesión</UButton>
              </NuxtLink>
            </template>
          </nav>
        </div>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <footer class="bg-gray-800 text-white py-8 mt-16">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p>&copy; 2026 MedVet. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>
