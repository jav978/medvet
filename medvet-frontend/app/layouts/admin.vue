<template>
  <div class="admin-shell">

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="sidebar-overlay"
      @click="sidebarOpen = false"
    />

    <!-- ─── Sidebar ─── -->
    <aside :class="['admin-sidebar', sidebarOpen ? 'admin-sidebar--open' : '']">
      <div class="sidebar-inner">

        <!-- Brand -->
        <div class="sidebar-brand">
          <NuxtLink to="/" class="sidebar-logo">
            <div class="sidebar-logo-mark">
              <svg viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" fill="currentColor"/></svg>
            </div>
            <span class="sidebar-logo-text">Med<span>Vet</span></span>
          </NuxtLink>
          <button @click="sidebarOpen = false" class="sidebar-close lg:hidden" aria-label="Cerrar menú">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </button>
        </div>

        <!-- Section label -->
        <div class="sidebar-section-label">CENTRO CLÍNICO & GESTIÓN</div>

        <!-- Nav links -->
        <nav class="sidebar-nav">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :class="['sidebar-link', isActive(item.to) ? 'sidebar-link--active' : '']"
            @click="sidebarOpen = false"
          >
            <span class="sidebar-link-icon">
              <svg v-if="item.icon === 'home'" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
              <svg v-else-if="item.icon === 'users'" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.07-.3.1-.63.1-.97 0-1.92-1.22-3.51-2.9-4.13A5.47 5.47 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
              <svg v-else-if="item.icon === 'calendar'" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>
              <svg v-else-if="item.icon === 'services'" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2.166 4.9L10 1.954 17.834 4.9a1 1 0 01.666.94v5.308c0 4.567-2.91 8.528-7.065 9.774a1 1 0 01-.67 0C6.577 19.672 3.667 15.711 3.667 11.15V5.84a1 1 0 01.666-.94zM10 12a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
              <svg v-else-if="item.icon === 'professionals'" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"/></svg>
              <svg v-else-if="item.icon === 'schedules'" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.8 2.8a1 1 0 101.414-1.414L11 9.586V6z" clip-rule="evenodd"/></svg>
              <svg v-else-if="item.icon === 'reports'" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>
            </span>
            <span class="sidebar-link-text">{{ item.label }}</span>
            <span v-if="isActive(item.to)" class="sidebar-active-dot"></span>
          </NuxtLink>
        </nav>

        <!-- Bottom: user + logout -->
        <div class="sidebar-footer">
          <div class="sidebar-user">
            <div class="sidebar-user-avatar">
              {{ (authStore.user?.name || 'AD').slice(0, 2).toUpperCase() }}
            </div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-name">{{ authStore.user?.name || 'Administrador' }}</div>
              <div class="sidebar-user-role">Cuerpo Médico / Admin</div>
            </div>
          </div>
          <button @click="handleLogout" class="sidebar-logout" aria-label="Cerrar sesión">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"/></svg>
            <span>Salir</span>
          </button>
        </div>

      </div>
    </aside>

    <!-- ─── Main content ─── -->
    <div class="admin-body">
      <!-- Topbar -->
      <header class="admin-topbar">
        <div class="topbar-left">
          <button @click="sidebarOpen = true" class="topbar-hamburger lg:hidden" aria-label="Abrir menú">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/></svg>
          </button>
          <div class="topbar-title-block">
            <h2 class="topbar-title">{{ pageTitle }}</h2>
            <span class="topbar-live-clock font-mono-numbers">{{ currentTime }}</span>
          </div>
        </div>
        <div class="topbar-right">
          <BcvRateWidget />
          <span class="topbar-username font-semibold">{{ authStore.user?.name || 'Admin' }}</span>
          <NuxtLink to="/" class="topbar-front-link">
            <span>🌐</span>
            <span>Ver Sitio Público</span>
          </NuxtLink>
        </div>
      </header>

      <!-- Slot -->
      <main class="admin-content">
        <slot />
      </main>
    </div>

  </div>
</template>

<script setup>
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { initCurrency } = useCurrency()

const sidebarOpen = ref(false)
const currentTime = ref('')

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

let timerInterval = null

const navItems = [
  { to: '/admin',               label: 'Dashboard Clínico', icon: 'home' },
  { to: '/admin/appointments',  label: 'Gestión de Citas',  icon: 'calendar' },
  { to: '/admin/payments',      label: 'Facturación & Caja',icon: 'services' },
  { to: '/admin/reports',       label: 'Reportería & Auditoría', icon: 'reports' },
  { to: '/admin/users',         label: 'Usuarios & Tutores', icon: 'users' },
  { to: '/admin/services',      label: 'Servicios Médicos',  icon: 'services' },
  { to: '/admin/professionals', label: 'Cuerpo Médico',     icon: 'professionals' },
  { to: '/admin/schedules',     label: 'Horarios & Guardias',icon: 'schedules' },
]

const pageTitle = computed(() => {
  const titles = {
    '/admin':               'Dashboard Clínico',
    '/admin/users':         'Gestión de Usuarios',
    '/admin/appointments':  'Gestión de Citas',
    '/admin/payments':      'Facturación & Control de Caja',
    '/admin/reports':       'Centro de Reportería & Auditoría',
    '/admin/services':      'Gestión de Servicios',
    '/admin/professionals': 'Cuerpo Médico',
    '/admin/schedules':     'Gestión de Horarios'
  }
  return titles[route.path] || 'Administración MedVet'
})

const isActive = (path) =>
  path === '/admin' ? route.path === '/admin' : route.path.startsWith(path)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

onMounted(async () => {
  updateTime()
  timerInterval = setInterval(updateTime, 1000)
  try {
    await authStore.reAuthenticate()
    if (!authStore.canAccessAdmin) router.push('/dashboard')
  } catch {
    router.push('/login')
  }
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
/* ── Shell ── */
.admin-shell {
  display: flex;
  min-height: 100vh;
  background: var(--color-cream-100);
}

.dark .admin-shell {
  background: #040706;
}

/* ── Sidebar ── */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 40;
  backdrop-filter: blur(4px);
}

.admin-sidebar {
  width: 260px;
  flex-shrink: 0;
  background: #060c09;
  border-right: 1px solid rgba(0, 245, 155, 0.12);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 50;
}

@media (max-width: 1023px) {
  .admin-sidebar {
    position: fixed;
    inset-y: 0;
    left: 0;
    transform: translateX(-100%);
    transition: transform 0.22s ease;
  }
  .admin-sidebar--open {
    transform: translateX(0);
  }
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.5rem 1.15rem;
  gap: 0;
}

/* Brand */
.sidebar-brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgba(0, 245, 155, 0.15);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
}

.sidebar-logo-mark {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 10px;
  background: #00f59b;
  color: #040706;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 16px rgba(0, 245, 155, 0.4);
}

.sidebar-logo-mark svg { width: 1.15rem; height: 1.15rem; }

.sidebar-logo-text {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 800;
  color: #f1faf5;
  letter-spacing: -0.02em;
}

.sidebar-logo-text span { color: #00f59b; }

.sidebar-close {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
}
.sidebar-close svg { width: 1.25rem; height: 1.25rem; }
.sidebar-close:hover { color: #00f59b; }

/* Section label */
.sidebar-section-label {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #5c7365;
  margin-bottom: 0.75rem;
  padding-left: 0.65rem;
}

/* Nav */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex-grow: 1;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.85rem;
  border-radius: 12px;
  text-decoration: none;
  font-size: 0.84rem;
  font-weight: 500;
  color: #8ca395;
  transition: all 0.18s ease;
  position: relative;
}

.sidebar-link:hover {
  background: rgba(0, 245, 155, 0.08);
  color: #00f59b;
}

.sidebar-link--active {
  background: rgba(0, 245, 155, 0.14);
  color: #00f59b;
  font-weight: 700;
}

.sidebar-link-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar-link-icon svg { width: 1.15rem; height: 1.15rem; }

.sidebar-link-text { flex: 1; }

.sidebar-active-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00f59b;
  box-shadow: 0 0 8px #00f59b;
}

/* Footer */
.sidebar-footer {
  padding-top: 1.25rem;
  border-top: 1px solid rgba(0, 245, 155, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
}

.sidebar-user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  background: #00f59b;
  color: #040706;
  font-weight: 800;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar-user-info { min-width: 0; }
.sidebar-user-name { font-size: 0.78rem; font-weight: 700; color: #f1faf5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sidebar-user-role { font-size: 0.65rem; color: #5c7365; }

.sidebar-logout {
  background: transparent;
  border: none;
  color: #5c7365;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.72rem;
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.sidebar-logout:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.sidebar-logout svg { width: 0.95rem; height: 0.95rem; }

/* ── Main content ── */
.admin-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.admin-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.15rem 2rem;
  background: var(--color-cream-50);
  border-bottom: 1px solid var(--color-cream-200);
}

.dark .admin-topbar {
  background: #060c09;
  border-bottom-color: rgba(0, 245, 155, 0.12);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.topbar-title-block {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.topbar-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
}

.dark .topbar-title { color: #f1faf5; }

.topbar-live-clock {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  background: rgba(0, 168, 107, 0.1);
  color: #00a86b;
}

.dark .topbar-live-clock {
  background: rgba(0, 245, 155, 0.12);
  color: #00f59b;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.topbar-username {
  font-size: 0.8125rem;
  color: var(--color-ink-700);
}

.dark .topbar-username { color: #d6e8de; }

.topbar-front-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #00a86b;
  text-decoration: none;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 168, 107, 0.2);
}

.dark .topbar-front-link {
  color: #00f59b;
  border-color: rgba(0, 245, 155, 0.25);
}

.admin-content {
  padding: 2rem;
  flex: 1;
}

@media (max-width: 640px) {
  .admin-content { padding: 1.25rem; }
}
</style>
