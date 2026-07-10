<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 dark:bg-gray-950 text-white transform transition-transform duration-200 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="p-4">
        <div class="flex items-center justify-between mb-8">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">M</span>
            </div>
            <span class="text-xl font-bold">MedVet</span>
          </NuxtLink>
          <button @click="sidebarOpen = false" class="lg:hidden text-gray-400 hover:text-white">
            <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
          </button>
        </div>

        <nav class="space-y-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :class="[
              'flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors',
              isActive(item.to)
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            ]"
            @click="sidebarOpen = false"
          >
            <UIcon :name="item.icon" class="w-5 h-5" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div class="px-4 sm:px-6 py-4 flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <button
              @click="sidebarOpen = true"
              class="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <UIcon name="i-heroicons-bars-3" class="w-6 h-6" />
            </button>
            <h1 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {{ pageTitle }}
            </h1>
          </div>
          <div class="flex items-center space-x-3">
            <UColorModeButton />
            <span class="hidden sm:block text-gray-600 dark:text-gray-300">
              {{ authStore.user?.name }}
            </span>
            <UButton @click="handleLogout" variant="ghost" size="sm" icon="i-heroicons-arrow-right-on-rectangle">
              <span class="hidden sm:inline">Salir</span>
            </UButton>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-4 sm:p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const sidebarOpen = ref(false)

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'i-heroicons-home' },
  { to: '/admin/users', label: 'Usuarios', icon: 'i-heroicons-users' },
  { to: '/admin/pets', label: 'Mascotas', icon: 'i-heroicons-heart' },
  { to: '/admin/services', label: 'Servicios', icon: 'i-heroicons-briefcase' },
  { to: '/admin/professionals', label: 'Profesionales', icon: 'i-heroicons-user-group' },
  { to: '/admin/schedules', label: 'Horarios', icon: 'i-heroicons-clock' },
  { to: '/admin/appointments', label: 'Citas', icon: 'i-heroicons-calendar' }
]

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

const isActive = (path) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

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
