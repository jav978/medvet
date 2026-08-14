<template>
  <div class="layout-root">

    <!-- Announcement bar -->
    <div class="announce-bar">
      <span class="announce-pill">Guardia 24/7</span>
      <span>Atención Veterinaria · Urgencias: <a href="tel:+541112345678" class="announce-tel">+54 11 1234-5678</a></span>
    </div>

    <!-- Mobile overlay -->
    <Transition name="fade">
      <div
        v-if="mobileMenuOpen"
        class="mobile-overlay"
        @click="mobileMenuOpen = false"
      />
    </Transition>

    <!-- Header -->
    <header class="site-header">
      <div class="header-inner">

        <!-- Brand -->
        <NuxtLink to="/" class="brand-link">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" fill="currentColor"/>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-name">Med<span class="brand-name-accent">Vet</span></span>
            <span class="brand-tagline">Clínica & Reservas</span>
          </div>
        </NuxtLink>

        <!-- Desktop nav -->
        <nav class="desktop-nav">
          <NuxtLink to="/" class="nav-link" active-class="nav-link--active">Inicio</NuxtLink>
          <NuxtLink to="/services" class="nav-link" active-class="nav-link--active">Servicios</NuxtLink>
          <NuxtLink to="/book" class="nav-link nav-link--book" active-class="nav-link--active">
            <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M6 2a1 1 0 000 2h1v1a1 1 0 002 0V4h2v1a1 1 0 002 0V4h1a1 1 0 100-2h-1V1a1 1 0 10-2 0v1H9V1a1 1 0 10-2 0v1H6zm-2 5a1 1 0 000 2h12a1 1 0 100-2H4zm0 4a1 1 0 100 2h12a1 1 0 100-2H4zm0 4a1 1 0 100 2h8a1 1 0 100-2H4z"/></svg>
            Reservar Cita
          </NuxtLink>
          <template v-if="authStore.isAuthenticated">
            <NuxtLink to="/dashboard" class="nav-link" active-class="nav-link--active">Mi Panel</NuxtLink>
            <NuxtLink to="/pets" class="nav-link" active-class="nav-link--active">Mis Mascotas</NuxtLink>
            <NuxtLink to="/dashboard/payments" class="nav-link" active-class="nav-link--active">Pagos</NuxtLink>
            <NuxtLink v-if="authStore.canAccessAdmin" to="/admin" class="nav-link" active-class="nav-link--active">Admin</NuxtLink>
          </template>
        </nav>

        <!-- Desktop right controls -->
        <div class="desktop-actions">

          <!-- Dark mode toggle -->
          <button
            @click="toggleColorMode"
            class="theme-toggle"
            :title="colorMode.value === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
            aria-label="Cambiar modo"
          >
            <span :class="['theme-toggle-thumb', colorMode.value === 'dark' ? 'theme-toggle-thumb--dark' : '']">
              <svg v-if="colorMode.value === 'dark'" class="theme-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
              <svg v-else class="theme-icon theme-icon--sun" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/></svg>
            </span>
          </button>

          <template v-if="authStore.isAuthenticated">
            <span class="user-email">{{ authStore.user?.email }}</span>
            <button @click="handleLogout" class="btn-ghost btn-sm">Salir</button>
          </template>

          <template v-else>
            <NuxtLink to="/login" class="btn-ghost btn-sm">Iniciar Sesión</NuxtLink>
            <NuxtLink to="/book" class="btn-amber btn-sm">Agendar Cita</NuxtLink>
          </template>
        </div>

        <!-- Mobile controls -->
        <div class="mobile-controls">
          <button @click="toggleColorMode" class="mobile-icon-btn" aria-label="Modo oscuro">
            <svg v-if="colorMode.value === 'dark'" class="mobile-theme-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
            <svg v-else class="mobile-theme-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/></svg>
          </button>
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="mobile-icon-btn"
            aria-label="Menú"
          >
            <svg v-if="!mobileMenuOpen" class="mobile-theme-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/></svg>
            <svg v-else class="mobile-theme-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen" class="mobile-menu">
          <nav class="mobile-nav">
            <NuxtLink to="/" class="mobile-nav-link" @click="mobileMenuOpen = false">Inicio</NuxtLink>
            <NuxtLink to="/services" class="mobile-nav-link" @click="mobileMenuOpen = false">Servicios</NuxtLink>
            <NuxtLink to="/book" class="mobile-nav-link" @click="mobileMenuOpen = false">Reservar Cita</NuxtLink>
            <template v-if="authStore.isAuthenticated">
              <NuxtLink to="/dashboard" class="mobile-nav-link" @click="mobileMenuOpen = false">Mi Panel</NuxtLink>
              <NuxtLink to="/pets" class="mobile-nav-link" @click="mobileMenuOpen = false">Mis Mascotas</NuxtLink>
              <NuxtLink to="/dashboard/payments" class="mobile-nav-link" @click="mobileMenuOpen = false">Pagos & Facturación</NuxtLink>
              <NuxtLink v-if="authStore.canAccessAdmin" to="/admin" class="mobile-nav-link" @click="mobileMenuOpen = false">Admin</NuxtLink>
              <div class="mobile-nav-divider"></div>
              <button @click="handleLogout" class="mobile-logout">Cerrar Sesión</button>
            </template>
            <template v-else>
              <div class="mobile-nav-divider"></div>
              <NuxtLink to="/login" class="btn-ghost mobile-full-btn" @click="mobileMenuOpen = false">Iniciar Sesión</NuxtLink>
              <NuxtLink to="/book" class="btn-amber mobile-full-btn" @click="mobileMenuOpen = false">Reservar Cita</NuxtLink>
            </template>
          </nav>
        </div>
      </Transition>
    </header>

    <!-- Main content -->
    <main class="site-main">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="footer-inner">

        <div class="footer-grid">
          <!-- Brand column -->
          <div class="footer-brand">
            <div class="footer-brand-logo">
              <div class="footer-brand-icon">
                <svg viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" fill="currentColor"/></svg>
              </div>
              <span class="footer-brand-name">Med<span>Vet</span></span>
            </div>
            <p class="footer-brand-desc">
              Atención médica veterinaria con empatía, tecnología y los más altos estándares clínicos.
            </p>
            <div class="footer-open">
              <span class="footer-open-dot"></span>
              <span>Clínica abierta hoy</span>
            </div>
          </div>

          <!-- Services -->
          <div class="footer-col">
            <h4 class="footer-col-title">Servicios</h4>
            <ul class="footer-links">
              <li><NuxtLink to="/services#consulta">Consulta General</NuxtLink></li>
              <li><NuxtLink to="/services#vacunacion">Vacunación & Desparasitación</NuxtLink></li>
              <li><NuxtLink to="/services#cirugia">Cirugías & Quirófano</NuxtLink></li>
              <li><NuxtLink to="/services#estetica">Peluquería & Estética</NuxtLink></li>
              <li><NuxtLink to="/services#laboratorio">Laboratorio Clínico</NuxtLink></li>
            </ul>
          </div>

          <!-- Quick links -->
          <div class="footer-col">
            <h4 class="footer-col-title">Accesos Rápidos</h4>
            <ul class="footer-links">
              <li><NuxtLink to="/book">Agendar Cita en Línea</NuxtLink></li>
              <li><NuxtLink to="/services">Catálogo de Servicios</NuxtLink></li>
              <li><NuxtLink to="/login">Acceso Clientes</NuxtLink></li>
              <li><NuxtLink to="/register">Registrar Nueva Mascota</NuxtLink></li>
              <li><NuxtLink to="/admin">Portal Veterinario</NuxtLink></li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="footer-col">
            <h4 class="footer-col-title">Contacto & Urgencias</h4>
            <ul class="footer-contact">
              <li>
                <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
                <span>Av. Libertador 4580, Buenos Aires</span>
              </li>
              <li>
                <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                <a href="tel:+541112345678">+54 11 1234-5678</a>
              </li>
              <li>
                <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                <a href="mailto:contacto@medvet.com">contacto@medvet.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2026 MedVet Clinical Systems. Todos los derechos reservados.</p>
          <div class="footer-bottom-links">
            <NuxtLink to="/services">Información Clínica</NuxtLink>
            <NuxtLink to="/book">Turnos</NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const colorMode = useColorMode()
const authStore = useAuthStore()
const router = useRouter()
const mobileMenuOpen = ref(false)

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const handleLogout = async () => {
  await authStore.logout()
  mobileMenuOpen.value = false
  router.push('/')
}
</script>

<style scoped>
/* ────────────────────────────────────────
   LAYOUT ROOT
──────────────────────────────────────── */
.layout-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-cream-100);
  color: var(--color-ink-900);
  transition: background-color 0.25s ease, color 0.25s ease;
}

.dark .layout-root {
  background-color: #040706;
  color: #e7f2f1;
}

/* ────────────────────────────────────────
   ANNOUNCEMENT BAR
──────────────────────────────────────── */
.announce-bar {
  background: var(--color-forest-900);
  color: rgba(200, 232, 200, 0.75);
  font-size: 0.72rem;
  font-weight: 500;
  padding: 0.45rem 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  letter-spacing: 0.01em;
}

.announce-pill {
  display: inline-flex;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  background: rgba(255, 122, 0, 0.18);
  border: 1px solid rgba(255, 122, 0, 0.35);
  color: var(--color-joy-tangerine);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.announce-tel {
  color: var(--color-forest-400);
  text-decoration: none;
  font-weight: 600;
}

.announce-tel:hover {
  color: var(--color-forest-200);
}

/* ────────────────────────────────────────
   HEADER
──────────────────────────────────────── */
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(244, 247, 245, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-cream-200);
  transition: background 0.25s ease;
}

.dark .site-header {
  background: rgba(4, 7, 6, 0.85);
  border-bottom-color: rgba(0, 245, 155, 0.15);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 68px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

/* Brand */
.brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  flex-shrink: 0;
  transition: opacity 0.15s ease;
}

.brand-link:hover { opacity: 0.85; }

.brand-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  background: #00a86b;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-icon svg {
  width: 1.2rem;
  height: 1.2rem;
}

.dark .brand-icon {
  background: #00f59b;
  color: #040706;
  box-shadow: 0 0 16px rgba(0, 245, 155, 0.4);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand-name {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-ink-900);
}

.dark .brand-name { color: #f1faf5; }

.brand-name-accent { color: #00a86b; }

.dark .brand-name-accent { color: #00f59b; }

.brand-tagline {
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink-400);
  margin-top: 0.05rem;
}

/* Desktop nav */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
}

@media (max-width: 900px) {
  .desktop-nav { display: none; }
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.85rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-ink-500);
  text-decoration: none;
  transition: color 0.15s ease, background 0.15s ease;
}

.nav-link:hover {
  color: var(--color-forest-800);
  background: var(--color-forest-100);
}

.dark .nav-link { color: #8ca395; }

.dark .nav-link:hover {
  color: #ffffff;
  background: rgba(0, 245, 155, 0.1);
}

.nav-link--active {
  color: #00a86b !important;
  font-weight: 600;
  background: var(--color-forest-100) !important;
}

.dark .nav-link--active {
  color: #00f59b !important;
  background: rgba(0, 245, 155, 0.14) !important;
}

.nav-link--book {
  color: var(--color-forest-800);
  font-weight: 600;
}

.nav-icon {
  width: 0.9rem;
  height: 0.9rem;
  flex-shrink: 0;
}

/* Desktop action buttons */
.desktop-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .desktop-actions { display: none; }
}

.user-email {
  font-size: 0.8rem;
  color: var(--color-ink-500);
}

.btn-sm {
  font-size: 0.8125rem;
  padding: 0.5rem 1rem;
}

/* Theme toggle */
.theme-toggle {
  width: 3.5rem;
  height: 1.875rem;
  border-radius: 999px;
  background: var(--color-cream-200);
  border: 1.5px solid var(--color-cream-300);
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.2rem;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.dark .theme-toggle {
  background: rgba(16, 28, 22, 0.8);
  border-color: rgba(0, 245, 155, 0.28);
}

.theme-toggle-thumb {
  width: 1.375rem;
  height: 1.375rem;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(0);
  transition: transform 0.2s ease;
}

.theme-toggle-thumb--dark {
  transform: translateX(1.6rem);
  background: #00f59b;
  box-shadow: 0 0 12px rgba(0, 245, 155, 0.8);
}

.theme-icon { width: 0.75rem; height: 0.75rem; color: #040706; }
.theme-icon--sun { color: var(--color-amber-600); }

/* Mobile controls */
.mobile-controls {
  display: none;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

@media (max-width: 900px) {
  .mobile-controls { display: flex; }
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 7, 6, 0.7);
  backdrop-filter: blur(8px);
  z-index: 40;
}

.mobile-icon-btn {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 10px;
  background: var(--color-cream-200);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-ink-700);
  transition: background 0.15s ease;
}

.mobile-icon-btn:hover { background: var(--color-cream-300); }

.dark .mobile-icon-btn {
  background: rgba(16, 28, 22, 0.8);
  border: 1px solid rgba(0, 245, 155, 0.2);
  color: #00f59b;
}

.mobile-theme-icon { width: 1.125rem; height: 1.125rem; }

/* Mobile menu */
.mobile-menu {
  border-top: 1px solid var(--color-cream-200);
  background: var(--color-cream-50);
}

.dark .mobile-menu {
  border-top-color: rgba(0, 245, 155, 0.15);
  background: #060c09;
}

.mobile-nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mobile-nav-link {
  display: block;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-ink-700);
  text-decoration: none;
  transition: background 0.15s ease;
}

.mobile-nav-link:hover {
  background: var(--color-forest-100);
  color: var(--color-forest-800);
}

.dark .mobile-nav-link { color: #8ca395; }

.dark .mobile-nav-link:hover {
  background: rgba(0, 245, 155, 0.1);
  color: #ffffff;
}

.mobile-nav-divider {
  height: 1px;
  background: var(--color-cream-200);
  margin: 0.5rem 0;
}

.dark .mobile-nav-divider { background: rgba(0, 245, 155, 0.15); }

.mobile-logout {
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  background: rgba(255, 122, 0, 0.12);
  border: 1px solid rgba(255, 122, 0, 0.25);
  color: var(--color-joy-tangerine);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;
}

.mobile-logout:hover {
  background: rgba(255, 122, 0, 0.2);
}

.mobile-full-btn {
  width: 100%;
  justify-content: center;
  margin-top: 0.25rem;
}

/* ────────────────────────────────────────
   MAIN
──────────────────────────────────────── */
.site-main {
  flex: 1;
}

/* ────────────────────────────────────────
   FOOTER
──────────────────────────────────────── */
.site-footer {
  background: #020403;
  color: rgba(223, 240, 238, 0.55);
  padding: 4rem 0 2.5rem;
  border-top: 1px solid rgba(0, 245, 155, 0.1);
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
  gap: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(0, 245, 155, 0.12);
}

@media (max-width: 900px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .footer-brand { grid-column: 1 / -1; }
}

@media (max-width: 560px) {
  .footer-grid { grid-template-columns: 1fr; }
}

/* Brand */
.footer-brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.875rem;
}

.footer-brand-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 10px;
  background: rgba(0, 245, 155, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(0, 245, 155, 0.3);
}

.footer-brand-icon svg {
  width: 1.1rem;
  height: 1.1rem;
  fill: #00f59b;
}

.footer-brand-name {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: #f1faf5;
  letter-spacing: -0.02em;
}

.footer-brand-name span {
  color: #00f59b;
}

.footer-brand-desc {
  font-size: 0.8125rem;
  line-height: 1.65;
  margin: 0 0 1rem;
  max-width: 280px;
}

.footer-open {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: rgba(223, 240, 238, 0.4);
}

.footer-open-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00f59b;
  animation: pulse-ring 2.5s infinite;
  flex-shrink: 0;
}

/* Cols */
.footer-col-title {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: rgba(200, 232, 200, 0.5);
  margin: 0 0 1rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-links li a {
  font-size: 0.8125rem;
  color: rgba(200, 232, 200, 0.45);
  text-decoration: none;
  transition: color 0.15s ease;
}

.footer-links li a:hover {
  color: #00f59b;
}

/* Contact */
.footer-contact {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-contact li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.8rem;
  color: rgba(200, 232, 200, 0.45);
}

.footer-contact li a {
  color: inherit;
  text-decoration: none;
  transition: color 0.15s ease;
}

.footer-contact li a:hover {
  color: #00f59b;
}

.contact-icon {
  width: 1rem;
  height: 1rem;
  color: #00f59b;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

/* Bottom bar */
.footer-bottom {
  padding-top: 1.75rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: rgba(200, 232, 200, 0.25);
}

.footer-bottom-links {
  display: flex;
  gap: 1.5rem;
}

.footer-bottom-links a {
  color: inherit;
  text-decoration: none;
  transition: color 0.15s ease;
}

.footer-bottom-links a:hover {
  color: #00f59b;
}

/* ────────────────────────────────────────
   TRANSITIONS
──────────────────────────────────────── */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.22s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
