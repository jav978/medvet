<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Mobile menu overlay -->
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="mobileMenuOpen = false"
    />

    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">M</span>
            </div>
            <span class="text-xl font-bold text-gray-900 dark:text-white">MedVet</span>
          </NuxtLink>

          <!-- Desktop nav -->
          <nav class="hidden lg:flex items-center space-x-6">
            <NuxtLink to="/book" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Reservar Cita
            </NuxtLink>
            <template v-if="authStore.isAuthenticated">
              <NuxtLink to="/dashboard" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Mi Panel
              </NuxtLink>
              <NuxtLink v-if="authStore.canAccessAdmin" to="/admin" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Admin
              </NuxtLink>
              <UColorModeButton />
              <UButton @click="handleLogout" variant="ghost" size="sm">
                Salir
              </UButton>
            </template>
            <template v-else>
              <UColorModeButton />
              <NuxtLink to="/login">
                <UButton>Iniciar Sesión</UButton>
              </NuxtLink>
            </template>
          </nav>

          <!-- Mobile menu button -->
          <div class="flex items-center space-x-3 lg:hidden">
            <UColorModeButton />
            <button
              @click="mobileMenuOpen = true"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <UIcon name="i-heroicons-bars-3" class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile nav -->
      <div
        :class="[
          'lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
          mobileMenuOpen ? 'block' : 'hidden'
        ]"
      >
        <nav class="px-4 py-4 space-y-3">
          <NuxtLink
            to="/book"
            class="block py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            @click="mobileMenuOpen = false"
          >
            Reservar Cita
          </NuxtLink>
          <template v-if="authStore.isAuthenticated">
            <NuxtLink
              to="/dashboard"
              class="block py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              @click="mobileMenuOpen = false"
            >
              Mi Panel
            </NuxtLink>
            <NuxtLink
              v-if="authStore.canAccessAdmin"
              to="/admin"
              class="block py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              @click="mobileMenuOpen = false"
            >
              Admin
            </NuxtLink>
            <UButton @click="handleLogout" variant="ghost" block>
              Salir
            </UButton>
          </template>
          <template v-else>
            <NuxtLink to="/login" @click="mobileMenuOpen = false">
              <UButton block>Iniciar Sesión</UButton>
            </NuxtLink>
          </template>
        </nav>
      </div>
    </header>

    <!-- Main -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 dark:bg-gray-950 text-gray-300 py-8 mt-16 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold">M</span>
              </div>
              <span class="text-lg font-bold text-white">MedVet</span>
            </div>
            <p class="text-sm text-gray-400">
              Sistema de reservas para clínicas veterinarias.
            </p>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Enlaces</h3>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/book" class="hover:text-white transition-colors">Reservar Cita</NuxtLink></li>
              <li><NuxtLink to="/login" class="hover:text-white transition-colors">Iniciar Sesión</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Contacto</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li>contacto@medvet.com</li>
              <li>+54 11 1234-5678</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 MedVet. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const router = useRouter()

const mobileMenuOpen = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  mobileMenuOpen.value = false
  router.push('/')
}
</script>
