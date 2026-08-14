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

          <!-- BCV Official Exchange Rate & Currency Switcher Widget -->
          <BcvRateWidget />

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
            <div class="user-chip" :title="authStore.user?.email">
              <span class="user-chip-avatar">🐾</span>
              <span class="user-chip-email">{{ authStore.user?.email }}</span>
            </div>
            <button @click="handleLogout" class="btn-ghost btn-sm">Salir</button>
          </template>

          <template v-else>
            <NuxtLink to="/login" class="btn-ghost btn-sm">Iniciar Sesión</NuxtLink>
            <NuxtLink to="/book" class="btn-amber btn-sm">Agendar Cita</NuxtLink>
          </template>
        </div>

        <!-- Mobile controls -->
        <div class="mobile-controls">
          <BcvRateWidget />
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
              <li class="footer-schedule-item">
                <span class="schedule-tag">🏥 Urgencias:</span>
                <strong>Guardia Activa 24/7</strong>
              </li>
              <li class="footer-schedule-item">
                <span class="schedule-tag">🩺 Consultas:</span>
                <span>Lun a Sáb 08:00 - 20:00</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Developer Signature & Personal Social Networks Strip -->
        <div class="footer-dev-strip">
          <div class="dev-author-box">
            <span class="dev-icon-badge">👨‍💻</span>
            <div class="dev-meta">
              <span class="dev-lead-caption">Desarrollado y Diseñado por:</span>
              <strong class="dev-lead-name">José Vásquez</strong>
            </div>
            <a href="mailto:jvasquez978@gmail.com" class="dev-mail-pill" title="Escribir a José Vásquez">
              <svg viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
              <span>jvasquez978@gmail.com</span>
            </a>
          </div>

          <div class="dev-socials-box">
            <span class="dev-socials-caption">Redes del Desarrollador:</span>
            <div class="dev-social-buttons">
              <a href="https://wa.me/5491112345678" target="_blank" rel="noopener noreferrer" class="dev-social-btn wa" title="WhatsApp: José Vásquez">
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.764.845 2.796.845h.005c3.18 0 5.767-2.587 5.768-5.766 0-3.18-2.588-5.767-5.768-5.767zm3.385 8.163c-.144.405-.837.774-1.17.822-.311.045-.71.074-2.029-.472-1.685-.697-2.766-2.42-2.85-2.532-.084-.112-.684-.912-.684-1.739 0-.827.433-1.233.587-1.39.144-.146.338-.212.45-.212.112 0 .225.002.324.007.104.005.244-.04.382.292.144.346.491 1.198.535 1.286.044.088.073.19.015.305-.058.115-.088.187-.174.288-.088.101-.184.225-.263.303-.09.088-.183.184-.079.362.105.178.468.772 1.004 1.25 1.004.894 1.543 1.171 1.761 1.279.218.108.347.09.477-.058.13-.148.558-.65.706-.874.148-.224.296-.187.498-.112.202.075 1.284.606 1.505.717.221.111.368.166.423.259.055.093.055.539-.089.944z"/></svg>
                <span>WhatsApp</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="dev-social-btn ig" title="Instagram: José Vásquez">
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <span>Instagram</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="dev-social-btn fb" title="Facebook: José Vásquez">
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <span>Facebook</span>
              </a>
              <a href="mailto:jvasquez978@gmail.com" class="dev-social-btn ml" title="Email: jvasquez978@gmail.com">
                <svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Footer Bottom Bar -->
        <div class="footer-bottom">
          <p class="footer-copy-text">© 2026 MedVet Clinical Systems. Todos los derechos reservados.</p>
          <div class="footer-bottom-links">
            <button type="button" @click="clinicalInfoModalOpen = true" class="footer-modal-trigger-btn">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Información Clínica</span>
            </button>
            <button type="button" @click="sanitaryProtocolsModalOpen = true" class="footer-modal-trigger-btn">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Protocolos Sanitarios ISO (Venezuela)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>

    <!-- Clinical Information & ISO Protocols Modals -->
    <ClinicalInfoModal :is-open="clinicalInfoModalOpen" @close="clinicalInfoModalOpen = false" />
    <SanitaryProtocolsModal :is-open="sanitaryProtocolsModalOpen" @close="sanitaryProtocolsModalOpen = false" />

    <!-- Global Floating WhatsApp 24/7 & Speed Dial Assistance -->
    <FloatingHelp />
  </div>
</template>

<script setup>
const colorMode = useColorMode()
const authStore = useAuthStore()
const router = useRouter()
const mobileMenuOpen = ref(false)
const clinicalInfoModalOpen = ref(false)
const sanitaryProtocolsModalOpen = ref(false)

const { initCurrency } = useCurrency()

onMounted(() => {
  initCurrency()
})

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
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 2.5vw, 2.5rem);
  height: 72px;
  display: flex;
  align-items: center;
  gap: 1.25rem;
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
  gap: 0.35rem;
  flex: 1;
  margin: 0 0.5rem;
  min-width: 0;
}

@media (max-width: 1040px) {
  .desktop-nav { display: none; }
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.65rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-ink-500);
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: color 0.15s ease, background 0.15s ease;
}

@media (min-width: 1280px) {
  .nav-link {
    padding: 0.45rem 0.85rem;
  }
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

@media (max-width: 1040px) {
  .desktop-actions { display: none; }
}

.user-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: var(--color-cream-200);
  border: 1px solid var(--color-cream-300);
  max-width: 180px;
}

.dark .user-chip {
  background: rgba(16, 28, 22, 0.6);
  border-color: rgba(0, 245, 155, 0.2);
}

.user-chip-avatar {
  font-size: 0.85rem;
  flex-shrink: 0;
}

.user-chip-email {
  font-size: 0.78rem;
  color: var(--color-ink-700);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .user-chip-email {
  color: #c8e0d4;
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

@media (max-width: 1040px) {
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
  max-width: 1440px;
  margin: 0 auto;
  padding: 1.25rem clamp(1.25rem, 2.5vw, 2.5rem);
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
  background: var(--color-cream-100);
  color: var(--color-ink-600);
  padding: 4rem 0 2.5rem;
  border-top: 1px solid var(--color-cream-300);
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.dark .site-footer {
  background: #020403;
  color: rgba(223, 240, 238, 0.55);
  border-top: 1px solid rgba(0, 245, 155, 0.1);
}

.footer-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 2.5vw, 2.5rem);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
  gap: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid var(--color-cream-300);
}

.dark .footer-grid {
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
  background: rgba(0, 168, 107, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(0, 168, 107, 0.25);
}

.dark .footer-brand-icon {
  background: rgba(0, 245, 155, 0.15);
  border-color: rgba(0, 245, 155, 0.3);
}

.footer-brand-icon svg {
  width: 1.1rem;
  height: 1.1rem;
  fill: #00a86b;
}

.dark .footer-brand-icon svg {
  fill: #00f59b;
}

.footer-brand-name {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-ink-900);
  letter-spacing: -0.02em;
}

.dark .footer-brand-name {
  color: #f1faf5;
}

.footer-brand-name span {
  color: #00a86b;
}

.dark .footer-brand-name span {
  color: #00f59b;
}

.footer-brand-desc {
  font-size: 0.8125rem;
  line-height: 1.65;
  margin: 0 0 1rem;
  max-width: 280px;
  color: var(--color-ink-500);
}

.dark .footer-brand-desc {
  color: rgba(223, 240, 238, 0.55);
}

.footer-open {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-ink-500);
}

.dark .footer-open {
  color: rgba(223, 240, 238, 0.4);
}

.footer-open-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00a86b;
  animation: pulse-ring 2.5s infinite;
  flex-shrink: 0;
}

.dark .footer-open-dot {
  background: #00f59b;
}

/* Cols */
.footer-col-title {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--color-ink-900);
  margin: 0 0 1rem;
}

.dark .footer-col-title {
  color: rgba(200, 232, 200, 0.5);
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
  color: var(--color-ink-600);
  text-decoration: none;
  transition: color 0.15s ease;
}

.footer-links li a:hover {
  color: #00a86b;
}

.dark .footer-links li a {
  color: rgba(200, 232, 200, 0.45);
}

.dark .footer-links li a:hover {
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
  color: var(--color-ink-600);
}

.dark .footer-contact li {
  color: rgba(200, 232, 200, 0.45);
}

.footer-contact li a {
  color: inherit;
  text-decoration: none;
  transition: color 0.15s ease;
}

.footer-contact li a:hover {
  color: #00a86b;
}

.dark .footer-contact li a:hover {
  color: #00f59b;
}

.contact-icon {
  width: 1rem;
  height: 1rem;
  color: #00a86b;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.footer-schedule-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.775rem;
}

.schedule-tag {
  font-weight: 700;
  color: #00a86b;
}

.dark .schedule-tag {
  color: #00f59b;
}

/* ────────────────────────────────────────
   DEVELOPER SIGNATURE & PERSONAL SOCIALS STRIP
──────────────────────────────────────── */
.footer-dev-strip {
  margin-top: 2rem;
  padding: 1rem 1.25rem;
  background: rgba(0, 168, 107, 0.04);
  border: 1px solid rgba(0, 168, 107, 0.12);
  border-radius: 0.875rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

:global(.dark) .footer-dev-strip {
  background: rgba(0, 245, 155, 0.03);
  border-color: rgba(0, 245, 155, 0.15);
}

.dev-author-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.dev-icon-badge {
  font-size: 1.25rem;
  line-height: 1;
}

.dev-meta {
  display: flex;
  flex-direction: column;
}

.dev-lead-caption {
  font-size: 0.675rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
  color: #059669;
}

:global(.dark) .dev-lead-caption {
  color: #00f59b;
}

.dev-lead-name {
  font-size: 0.925rem;
  font-weight: 700;
  color: var(--color-ink-900);
}

:global(.dark) .dev-lead-name {
  color: #f1f5f9;
}

.dev-mail-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  background: rgba(2, 132, 199, 0.08);
  border: 1px solid rgba(2, 132, 199, 0.2);
  border-radius: 9999px;
  color: #0284c7;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.dev-mail-pill:hover {
  background: rgba(2, 132, 199, 0.16);
  color: #0369a1;
  border-color: #0284c7;
}

:global(.dark) .dev-mail-pill {
  background: rgba(56, 189, 248, 0.1);
  border-color: rgba(56, 189, 248, 0.25);
  color: #38bdf8;
}

:global(.dark) .dev-mail-pill:hover {
  background: rgba(56, 189, 248, 0.2);
  color: #7dd3fc;
  border-color: #38bdf8;
}

.dev-socials-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.dev-socials-caption {
  font-size: 0.725rem;
  font-weight: 600;
  color: var(--color-ink-600);
}

:global(.dark) .dev-socials-caption {
  color: rgba(223, 240, 238, 0.7);
}

.dev-social-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.dev-social-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.5rem;
  text-decoration: none;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

:global(.dark) .dev-social-btn {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #94a3b8;
}

.dev-social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

.dev-social-btn.wa:hover {
  background: #25d366;
  color: #ffffff;
  border-color: #25d366;
}

.dev-social-btn.ig:hover {
  background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%);
  color: #ffffff;
  border-color: #d6249f;
}

.dev-social-btn.fb:hover {
  background: #1877f2;
  color: #ffffff;
  border-color: #1877f2;
}

.dev-social-btn.ml:hover {
  background: #0ea5e9;
  color: #ffffff;
  border-color: #0ea5e9;
}

/* ────────────────────────────────────────
   BOTTOM BAR & MODAL TRIGGER BUTTONS
──────────────────────────────────────── */
.footer-bottom {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-size: 0.775rem;
  color: var(--color-ink-500);
  padding-right: 5rem; /* Safe area for floating WhatsApp button */
}

@media (max-width: 768px) {
  .footer-bottom {
    padding-right: 0;
    padding-bottom: 4.5rem; /* Space on mobile for floating button */
    flex-direction: column;
    align-items: flex-start;
  }
}

:global(.dark) .footer-bottom {
  border-top-color: rgba(255, 255, 255, 0.08);
  color: rgba(200, 232, 200, 0.5);
}

.footer-copy-text {
  margin: 0;
}

.footer-bottom-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.footer-modal-trigger-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #334155;
}

.footer-modal-trigger-btn:hover {
  color: #047857;
  background: #ecfdf5;
  border-color: #6ee7b7;
  transform: translateY(-1px);
}

:global(.dark) .footer-modal-trigger-btn {
  background: rgba(0, 245, 155, 0.08);
  border: 1px solid rgba(0, 245, 155, 0.3);
  color: #00f59b;
}

:global(.dark) .footer-modal-trigger-btn:hover {
  background: rgba(0, 245, 155, 0.16);
  border-color: rgba(0, 245, 155, 0.55);
  color: #5effc4;
  box-shadow: 0 0 12px rgba(0, 245, 155, 0.2);
  transform: translateY(-1px);
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
