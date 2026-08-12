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
        <div class="sidebar-section-label">PANEL CLÍNICO</div>

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
            </span>
            <span>{{ item.label }}</span>
            <span v-if="isActive(item.to)" class="sidebar-active-bar"></span>
          </NuxtLink>
        </nav>

        <!-- Bottom: user + logout -->
        <div class="sidebar-footer">
          <div class="sidebar-user">
            <div class="sidebar-user-avatar">
              {{ authStore.user?.name?.slice(0, 2) || 'AD' }}
            </div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-name">{{ authStore.user?.name || 'Administrador' }}</div>
              <div class="sidebar-user-role">Admin del Sistema</div>
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
          <h1 class="topbar-title">{{ pageTitle }}</h1>
        </div>
        <div class="topbar-right">
          <span class="topbar-username">{{ authStore.user?.name }}</span>
          <NuxtLink to="/" class="topbar-front-link">← Ver sitio</NuxtLink>
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

const sidebarOpen = ref(false)

const navItems = [
  { to: '/admin',               label: 'Dashboard',     icon: 'home' },
  { to: '/admin/users',         label: 'Usuarios',      icon: 'users' },
  { to: '/admin/appointments',  label: 'Citas',         icon: 'calendar' },
  { to: '/admin/services',      label: 'Servicios',     icon: 'services' },
  { to: '/admin/professionals', label: 'Profesionales', icon: 'professionals' },
  { to: '/admin/schedules',     label: 'Horarios',      icon: 'schedules' },
]

const pageTitle = computed(() => {
  const titles = {
    '/admin':               'Dashboard Clínico',
    '/admin/users':         'Gestión de Usuarios',
    '/admin/appointments':  'Gestión de Citas',
    '/admin/services':      'Gestión de Servicios',
    '/admin/professionals': 'Cuerpo Médico',
    '/admin/schedules':     'Gestión de Horarios'
  }
  return titles[route.path] || 'Admin'
})

const isActive = (path) =>
  path === '/admin' ? route.path === '/admin' : route.path.startsWith(path)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

onMounted(async () => {
  try {
    await authStore.reAuthenticate()
    if (!authStore.canAccessAdmin) router.push('/dashboard')
  } catch {
    router.push('/login')
  }
})
</script>

<style scoped>
/* ── Shell ── */
.admin-shell {
  display: flex;
  min-height: 100vh;
  background: var(--color-cream-100);
}

/* ── Sidebar ── */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.45);
  z-index: 40;
  backdrop-filter: blur(4px);
}

.admin-sidebar {
  width: 256px;
  flex-shrink: 0;
  background: #080c16; /* Midnight Premium dark */
  border-right: 1px solid rgba(99, 102, 241, 0.12);
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
  padding: 1.5rem 1rem;
  gap: 0;
}

/* Brand */
.sidebar-brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(99, 102, 241, 0.15);
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
  background: var(--color-amber-600); /* Índigo */
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.sidebar-logo-mark svg { width: 1.125rem; height: 1.125rem; }

.sidebar-logo-text {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
}

.sidebar-logo-text span { color: var(--color-forest-600); }

.sidebar-close {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
}
.sidebar-close svg { width: 1.25rem; height: 1.25rem; }
.sidebar-close:hover { color: #fff; }

/* Section label */
.sidebar-section-label {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.25);
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
}

/* Nav */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem;
  border-radius: 12px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
  transition: all 0.15s ease;
  position: relative;
}

.sidebar-link:hover {
  background: rgba(99, 102, 241, 0.08);
  color: #ffffff;
}

.sidebar-link--active {
  background: rgba(99, 102, 241, 0.15);
  color: #ffffff;
  font-weight: 600;
}

.sidebar-link-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.sidebar-link-icon svg {
  width: 100%;
  height: 100%;
}

.sidebar-active-bar {
  position: absolute;
  left: 0;
  top: 25%;
  bottom: 25%;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: var(--color-forest-600);
  box-shadow: 0 0 8px var(--color-forest-600);
}

/* Footer */
.sidebar-footer {
  margin-top: auto;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(99, 102, 241, 0.12);
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
}

.sidebar-user-avatar {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-amber-600) 0%, var(--color-forest-600) 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.75rem;
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.sidebar-user-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.sidebar-user-role {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.35);
}

.sidebar-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  background: transparent;
  border: 1px solid rgba(99, 102, 241, 0.18);
  color: rgba(255, 255, 255, 0.45);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  width: 100%;
}
.sidebar-logout:hover {
  border-color: rgba(239, 68, 68, 0.4);
  color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
}
.sidebar-logout svg { width: 1rem; height: 1rem; }

/* ── Admin body ── */
.admin-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100vh;
}

/* Topbar */
.admin-topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-cream-200);
  padding: 0.875rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dark .admin-topbar {
  background: rgba(3, 7, 18, 0.85);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.topbar-hamburger {
  background: transparent;
  border: none;
  color: var(--color-ink-600);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
}
.topbar-hamburger svg { width: 1.25rem; height: 1.25rem; }

.topbar-title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-ink-900);
  margin: 0;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.topbar-username {
  font-size: 0.8125rem;
  color: var(--color-ink-500);
  display: none;
}
@media (min-width: 640px) { .topbar-username { display: block; } }

.topbar-front-link {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-amber-600);
  text-decoration: none;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  border: 1.5px solid rgba(99, 102, 241, 0.25);
  transition: all 0.15s;
}
.topbar-front-link:hover {
  background: var(--color-amber-100);
  border-color: var(--color-amber-400);
}

/* Admin content */
.admin-content {
  flex: 1;
  padding: 2rem 1.5rem;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
}
</style>
