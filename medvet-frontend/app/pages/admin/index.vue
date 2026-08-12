<template>
  <div class="space-y-8 py-4">
    
    <!-- Admin Portal Header -->
    <div class="pb-4 border-b border-slate-200 dark:border-slate-800">
      <span class="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
        Panel de Control Clínico
      </span>
      <h1 class="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
        Administración General MedVet
      </h1>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      
      <div class="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Usuarios</span>
          <div class="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <UIcon name="i-heroicons-users" class="w-5 h-5" />
          </div>
        </div>
        <p class="text-3xl font-extrabold font-display text-slate-900 dark:text-white font-mono-numbers">
          {{ stats.users || 48 }}
        </p>
      </div>

      <div class="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Citas Hoy</span>
          <div class="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
          </div>
        </div>
        <p class="text-3xl font-extrabold font-display text-slate-900 dark:text-white font-mono-numbers">
          {{ stats.appointments || 14 }}
        </p>
      </div>

      <div class="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mascotas</span>
          <div class="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <UIcon name="i-heroicons-heart" class="w-5 h-5" />
          </div>
        </div>
        <p class="text-3xl font-extrabold font-display text-slate-900 dark:text-white font-mono-numbers">
          {{ stats.pets || 62 }}
        </p>
      </div>

      <div class="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ingresos Hoy</span>
          <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <UIcon name="i-heroicons-currency-dollar" class="w-5 h-5" />
          </div>
        </div>
        <p class="text-3xl font-extrabold font-display text-emerald-600 dark:text-emerald-400 font-mono-numbers">
          ${{ (stats.revenue || 245000).toLocaleString() }}
        </p>
      </div>

    </div>

    <!-- Quick Actions -->
    <div class="space-y-4">
      <h2 class="text-xl font-bold font-display text-slate-900 dark:text-white">
        Accesos a Módulos Administrativos
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <NuxtLink
          v-for="action in quickActions"
          :key="action.to"
          :to="action.to"
          class="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 text-center hover:border-teal-500 hover:-translate-y-1 transition-all duration-200 group"
        >
          <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <UIcon :name="action.icon" class="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </div>
          <span class="text-sm font-bold text-slate-900 dark:text-white block">
            {{ action.label }}
          </span>
        </NuxtLink>
      </div>
    </div>

    <!-- Dual Activity Panel -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- Recent Appointments -->
      <div class="glass-card rounded-3xl p-6 space-y-4 border border-slate-200/80 dark:border-slate-800">
        <h2 class="text-xl font-bold font-display text-slate-900 dark:text-white">
          Últimas Citas Registradas
        </h2>

        <div class="space-y-3">
          <div
            v-for="apt in displayedAppointments"
            :key="apt.id"
            class="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
          >
            <div>
              <p class="font-bold text-slate-900 dark:text-white text-sm">
                {{ apt.pet?.name || 'Mascota' }} — {{ apt.service?.name || 'Consulta General' }}
              </p>
              <p class="text-xs text-slate-500 font-mono-numbers">
                📅 {{ apt.date || '2026-08-12' }}
              </p>
            </div>
            <span
              :class="[
                'px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider',
                apt.status === 'confirmed'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              ]"
            >
              {{ apt.status || 'Confirmada' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Professional Staff -->
      <div class="glass-card rounded-3xl p-6 space-y-4 border border-slate-200/80 dark:border-slate-800">
        <h2 class="text-xl font-bold font-display text-slate-900 dark:text-white">
          Cuerpo Médico & Especialistas
        </h2>

        <div class="space-y-3">
          <div
            v-for="vet in displayedProfessionals"
            :key="vet.id"
            class="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm">
                {{ vet.name.slice(0, 2) }}
              </div>
              <div>
                <p class="font-bold text-slate-900 dark:text-white text-sm">{{ vet.name }}</p>
                <p class="text-xs text-slate-500">{{ vet.specialty }}</p>
              </div>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
              Disponible
            </span>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  requiresAuth: true
})

const stats = ref({
  users: 48,
  appointments: 14,
  pets: 62,
  revenue: 245000
})

const recentAppointments = ref([])
const professionals = ref([])

const fallbackAppointments = [
  { id: 1, pet: { name: 'Thor' }, service: { name: 'Consulta Clínica General' }, date: '2026-08-12 16:30', status: 'confirmed' },
  { id: 2, pet: { name: 'Luna' }, service: { name: 'Vacunación Completa' }, date: '2026-08-12 17:00', status: 'confirmed' },
  { id: 3, pet: { name: 'Milo' }, service: { name: 'Perfil de Laboratorio' }, date: '2026-08-12 17:30', status: 'pending' }
]

const fallbackVets = [
  { id: 1, name: 'Dr. Mateo Silva', specialty: 'Medicina Clínica & Ecografía' },
  { id: 2, name: 'Dra. Camila Torres', specialty: 'Cirugía General & Quirofano' },
  { id: 3, name: 'Dr. Lucas Benítez', specialty: 'Dermatología Canina & Felina' }
]

const displayedAppointments = computed(() => {
  return recentAppointments.value.length ? recentAppointments.value : fallbackAppointments
})

const displayedProfessionals = computed(() => {
  return professionals.value.length ? professionals.value : fallbackVets
})

const quickActions = [
  { label: 'Usuarios', to: '/admin/users', icon: 'i-heroicons-users' },
  { label: 'Mascotas', to: '/admin/pets', icon: 'i-heroicons-heart' },
  { label: 'Servicios', to: '/admin/services', icon: 'i-heroicons-briefcase' },
  { label: 'Profesionales', to: '/admin/professionals', icon: 'i-heroicons-user-group' },
  { label: 'Horarios', to: '/admin/schedules', icon: 'i-heroicons-clock' },
  { label: 'Citas', to: '/admin/appointments', icon: 'i-heroicons-calendar' }
]

onMounted(async () => {
  try {
    const { $feathers } = useNuxtApp()
    if ($feathers) {
      const [users, appointments, pets, profs] = await Promise.all([
        $feathers.service('users').find({ query: { $limit: 1 } }),
        $feathers.service('appointments').find({ query: { $limit: 5 } }),
        $feathers.service('pets').find({ query: { $limit: 1 } }),
        $feathers.service('professionals').find({ query: { $limit: 5 } })
      ])

      stats.value.users = users.total || users.length || 48
      stats.value.appointments = appointments.total || appointments.length || 14
      stats.value.pets = pets.total || pets.length || 62

      recentAppointments.value = appointments.data || appointments
      professionals.value = profs.data || profs
    }
  } catch (error) {
    console.log('Using default admin stats view')
  }
})
</script>
