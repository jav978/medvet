<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-white">
      <div class="p-4">
        <NuxtLink to="/" class="flex items-center space-x-2 mb-8">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">M</span>
          </div>
          <span class="text-xl font-bold">MedVet Admin</span>
        </NuxtLink>

        <nav class="space-y-2">
          <NuxtLink to="/admin" class="block px-4 py-2 rounded-lg hover:bg-gray-800">
            Dashboard
          </NuxtLink>
          <NuxtLink to="/admin/users" class="block px-4 py-2 rounded-lg hover:bg-gray-800">
            Usuarios
          </NuxtLink>
          <NuxtLink to="/admin/pets" class="block px-4 py-2 rounded-lg hover:bg-gray-800">
            Mascotas
          </NuxtLink>
          <NuxtLink to="/admin/services" class="block px-4 py-2 rounded-lg hover:bg-gray-800">
            Servicios
          </NuxtLink>
          <NuxtLink to="/admin/professionals" class="block px-4 py-2 rounded-lg hover:bg-gray-800">
            Profesionales
          </NuxtLink>
          <NuxtLink to="/admin/schedules" class="block px-4 py-2 rounded-lg hover:bg-gray-800">
            Horarios
          </NuxtLink>
          <NuxtLink to="/admin/appointments" class="block px-4 py-2 rounded-lg hover:bg-gray-800">
            Citas
          </NuxtLink>
        </nav>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <header class="bg-white shadow-sm">
        <div class="px-6 py-4 flex justify-between items-center">
          <h1 class="text-xl font-semibold text-gray-900">
            {{ pageTitle }}
          </h1>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">{{ authStore.user?.name }}</span>
            <UButton @click="handleLogout" variant="ghost" size="sm">
              Salir
            </UButton>
          </div>
        </div>
      </header>

      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const pageTitle = computed(() => {
  const titles = {
    '/admin': 'Dashboard',
    '/admin/users': 'Gestión de Usuarios',
    '/admin/pets': 'Gestión de Mascotas',
    '/admin/services': 'Gestión de Servicios',
    '/admin/professionals': 'Gestión de Profesionales',
    '/admin/schedules': 'Gestión de Horarios',
    '/admin/appointments': 'Gestión de Citas'
  }
  return titles[route.path] || 'Admin'
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

// Protect admin routes
onMounted(async () => {
  try {
    await authStore.reAuthenticate()
    if (!authStore.canAccessAdmin) {
      router.push('/dashboard')
    }
  } catch {
    router.push('/login')
  }
})
</script>
