<template>
  <div class="layout-root">

    <!-- Announcement & Emergency Bar -->
    <Transition name="banner-slide">
      <div v-if="showAnnounceBar" class="announce-bar" role="alert">
        <div class="announce-container">
          <div class="announce-content">
            <span class="announce-pill">
              <span class="announce-beacon"></span>
              <svg class="announce-pill-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
              </svg>
              Guardia 24/7
            </span>
            <div class="announce-text">
              <span class="announce-label">Atención Médica & Urgencias:</span>
              <a href="tel:+541112345678" class="announce-tel-badge" title="Llamar a Urgencias Médicas">
                <svg class="tel-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <span>+54 11 1234-5678</span>
              </a>
            </div>
          </div>

          <button
            type="button"
            class="announce-close-btn"
            @click="dismissAnnounceBar"
            aria-label="Ocultar aviso de guardia"
            title="Ocultar aviso"
          >
            <svg class="close-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>

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
            <MedVetIcon />
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
            <NuxtLink v-if="authStore.canAccessAdmin" to="/admin" class="nav-link" active-class="nav-link--active">Admin</NuxtLink>
          </template>
        </nav>

        <!-- Desktop right controls -->
        <div class="desktop-actions">

          <!-- BCV Official Exchange Rate & Currency Switcher Widget -->
          <BcvRateWidget />

          <!-- Dark / Light mode toggle -->
          <ThemeToggle variant="switch" />

          <template v-if="authStore.isAuthenticated">
            <UserMenuDropdown />
          </template>

          <template v-else>
            <NuxtLink to="/login" class="btn-ghost btn-sm">Iniciar Sesión</NuxtLink>
          </template>
        </div>

        <!-- Mobile controls -->
        <div class="mobile-controls">
          <BcvRateWidget />
          <ThemeToggle variant="icon" />
          <template v-if="authStore.isAuthenticated">
            <UserMenuDropdown />
          </template>
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="mobile-icon-btn"
            aria-label="Menú principal"
            :title="mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
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
            <!-- Authenticated User Profile Banner -->
            <div v-if="authStore.isAuthenticated" class="mobile-user-card">
              <div class="mobile-user-avatar">
                <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" class="mobile-avatar-img" :alt="mobileUserName" />
                <span v-else class="mobile-avatar-initial">{{ mobileUserInitial }}</span>
              </div>
              <div class="mobile-user-details">
                <div class="mobile-user-name-line">
                  <span class="mobile-user-fullname">{{ mobileUserName }}</span>
                  <span class="mobile-user-role-badge" :class="authStore.user?.role || 'client'">
                    {{ mobileUserRole }}
                  </span>
                </div>
                <span class="mobile-user-email">{{ mobileUserEmail }}</span>
              </div>
            </div>

            <NuxtLink to="/" class="mobile-nav-link" @click="mobileMenuOpen = false">
              <svg class="mobile-nav-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
              <span>Inicio</span>
            </NuxtLink>
            <NuxtLink to="/services" class="mobile-nav-link" @click="mobileMenuOpen = false">
              <svg class="mobile-nav-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/></svg>
              <span>Servicios</span>
            </NuxtLink>
            <NuxtLink to="/book" class="mobile-nav-link" @click="mobileMenuOpen = false">
              <svg class="mobile-nav-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>
              <span>Reservar Cita</span>
            </NuxtLink>

            <template v-if="authStore.isAuthenticated">
              <div class="mobile-nav-divider"></div>
              <div class="mobile-nav-section-title">Mi Cuenta</div>
              <NuxtLink to="/dashboard" class="mobile-nav-link" @click="mobileMenuOpen = false">
                <svg class="mobile-nav-icon mobile-icon--emerald" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg>
                <span>Mi Panel Clínico</span>
              </NuxtLink>
              <NuxtLink to="/pets" class="mobile-nav-link" @click="mobileMenuOpen = false">
                <svg class="mobile-nav-icon mobile-icon--tangerine" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 10.5C3.67 10.5 3 11.17 3 12s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm15 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM8.5 6C7.67 6 7 6.67 7 7.5S7.67 9 8.5 9 10 8.33 10 7.5 9.33 6 8.5 6zm7 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM12 10c-3.31 0-6 2.69-6 6 0 2.21 1.79 4 4 4h4c2.21 0 4-1.79 4-4 0-3.31-2.69-6-6-6z"/></svg>
                <span>Mis Mascotas</span>
              </NuxtLink>
              <NuxtLink to="/dashboard/payments" class="mobile-nav-link" @click="mobileMenuOpen = false">
                <svg class="mobile-nav-icon mobile-icon--blue" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/><path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"/></svg>
                <span>Pagos & Facturación</span>
              </NuxtLink>
              <NuxtLink v-if="authStore.canAccessAdmin" to="/admin" class="mobile-nav-link mobile-admin-link" @click="mobileMenuOpen = false">
                <svg class="mobile-nav-icon mobile-icon--purple" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/></svg>
                <span>Panel de Administración</span>
              </NuxtLink>
              <div class="mobile-nav-divider"></div>
              <button @click="handleLogout" class="mobile-logout">
                <svg class="mobile-nav-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"/></svg>
                <span>Cerrar Sesión</span>
              </button>
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
                <MedVetIcon />
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

        <!-- Footer Bottom Bar (Unified, Clean & Responsive) -->
        <div class="footer-bottom">
          <!-- Left Column: Copyright & Developer Signature with Natural Brand Social Icons -->
          <div class="footer-bottom-info">
            <p class="footer-copy-text">© 2026 MedVet Clinical Systems. Todos los derechos reservados.</p>
            <div class="footer-dev-credit">
              <span class="dev-tag-text">
                👨‍💻 Diseñado y Desarrollado por <a href="mailto:jvasquez978@gmail.com" class="dev-author-link" title="Contactar a José Vásquez">José Vásquez</a>
              </span>
              <div class="dev-social-icons-strip" aria-label="Redes de contacto de José Vásquez">
                <a
                  href="https://wa.me/5491112345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-icon-circle wa"
                  title="WhatsApp: José Vásquez"
                  aria-label="WhatsApp"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M12.004 2c-5.523 0-10 4.477-10 10 0 1.767.459 3.491 1.332 5.006L2 22l5.12-1.311A9.957 9.957 0 0012.004 22c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18.273c-1.554 0-3.078-.415-4.408-1.201l-.316-.188-3.272.838.871-3.188-.206-.328a8.232 8.232 0 01-1.268-4.398c0-4.562 3.711-8.273 8.273-8.273 4.562 0 8.273 3.711 8.273 8.273 0 4.562-3.711 8.273-8.273 8.273zm4.534-6.196c-.248-.124-1.47-.726-1.698-.809-.228-.083-.394-.124-.56.124-.166.248-.642.809-.787.974-.145.166-.29.186-.539.062-.248-.124-1.05-.387-2.001-1.234-.74-.66-1.24-1.475-1.385-1.724-.145-.248-.015-.382.109-.505.112-.111.248-.29.373-.435.124-.145.166-.248.248-.414.083-.166.042-.311-.021-.435-.062-.124-.56-1.349-.767-1.848-.201-.486-.406-.42-.56-.428l-.477-.008c-.166 0-.435.062-.663.311-.228.248-.871.85-.871 2.074s.892 2.405 1.016 2.571c.124.166 1.755 2.68 4.252 3.758.594.257 1.058.41 1.42.525.597.19 1.14.163 1.57.099.479-.071 1.47-.601 1.677-1.182.207-.581.207-1.078.145-1.182-.062-.104-.228-.166-.477-.29z"/></svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-icon-circle ig"
                  title="Instagram: José Vásquez"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-icon-circle fb"
                  title="Facebook: José Vásquez"
                  aria-label="Facebook"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a
                  href="mailto:jvasquez978@gmail.com"
                  class="social-icon-circle ml"
                  title="Email: jvasquez978@gmail.com"
                  aria-label="Email"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Right Column: Clinical Modals Triggers -->
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
const authStore = useAuthStore()
const router = useRouter()
const mobileMenuOpen = ref(false)
const clinicalInfoModalOpen = ref(false)
const sanitaryProtocolsModalOpen = ref(false)
const showAnnounceBar = ref(true)

const { initCurrency } = useCurrency()

onMounted(() => {
  initCurrency()
  try {
    if (sessionStorage.getItem('medvet_hide_emergency_bar') === 'true') {
      showAnnounceBar.value = false
    }
  } catch (e) {}
})

const dismissAnnounceBar = () => {
  showAnnounceBar.value = false
  try {
    sessionStorage.setItem('medvet_hide_emergency_bar', 'true')
  } catch (e) {}
}

const mobileUserName = computed(() => {
  const name = authStore.user?.name?.trim()
  if (name && name.toLowerCase() !== 'usuario' && name.toLowerCase() !== 'user') {
    return name
  }
  if (authStore.user?.email) {
    const prefix = authStore.user.email.split('@')[0]
    if (prefix && prefix.toLowerCase() !== 'usuario' && prefix.toLowerCase() !== 'user') {
      const cleaned = prefix.replace(/[._-]+/g, ' ')
      return cleaned
        .split(' ')
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    }
  }
  return 'Javier Silva'
})

const mobileUserEmail = computed(() => {
  return authStore.user?.email || 'javier.silva@gmail.com'
})

const mobileUserInitial = computed(() => {
  const name = mobileUserName.value.trim()
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    if (name.length >= 2) {
      return name.slice(0, 2).toUpperCase()
    }
    return name.charAt(0).toUpperCase()
  }
  return 'JS'
})

const mobileUserRole = computed(() => {
  switch (authStore.user?.role) {
    case 'admin': return 'Administrador'
    case 'veterinarian': return 'Veterinario'
    case 'receptionist': return 'Recepción'
    default: return 'Cliente / Tutor'
  }
})

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
  width: 100%;
  max-width: 100%;
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
   ANNOUNCEMENT & EMERGENCY BAR
──────────────────────────────────────── */
.announce-bar {
  position: relative;
  z-index: 60;
  background: linear-gradient(90deg, #092c1e 0%, #0c3826 50%, #092c1e 100%);
  border-bottom: 1px solid rgba(0, 245, 155, 0.15);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0.35rem 1rem;
  transition: all 0.25s ease;
}

.dark .announce-bar {
  background: linear-gradient(90deg, #04140d 0%, #082418 50%, #04140d 100%);
  border-bottom-color: rgba(0, 245, 155, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.announce-container {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 1.75rem;
}

.announce-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.65rem 0.85rem;
  text-align: center;
  padding: 0 2rem;
}

.announce-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  background: rgba(255, 122, 0, 0.16);
  border: 1px solid rgba(255, 122, 0, 0.35);
  color: #ff9d42;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
}

.dark .announce-pill {
  background: rgba(255, 122, 0, 0.22);
  border-color: rgba(255, 122, 0, 0.45);
  color: #ffaa5a;
  box-shadow: 0 0 10px rgba(255, 122, 0, 0.25);
}

.announce-beacon {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff7a00;
  box-shadow: 0 0 8px #ff7a00;
  animation: pulse-beacon 1.8s infinite ease-in-out;
}

@keyframes pulse-beacon {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.4; }
}

.announce-pill-icon {
  width: 0.75rem;
  height: 0.75rem;
}

.announce-text {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #d1fae5;
  font-weight: 500;
}

.dark .announce-text {
  color: #ecfdf5;
}

.announce-label {
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.dark .announce-label {
  color: rgba(255, 255, 255, 0.92);
}

.announce-tel-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.15rem 0.55rem;
  border-radius: 6px;
  background: rgba(0, 245, 155, 0.12);
  border: 1px solid rgba(0, 245, 155, 0.3);
  color: #5effc4;
  font-weight: 700;
  text-decoration: none;
  font-family: inherit;
  transition: all 0.2s ease;
}

.announce-tel-badge:hover {
  background: rgba(0, 245, 155, 0.22);
  border-color: #00f59b;
  color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 245, 155, 0.3);
  transform: translateY(-1px);
}

.tel-icon {
  width: 0.75rem;
  height: 0.75rem;
}

.announce-close-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 6px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.65);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.announce-close-btn:hover {
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
  transform: translateY(-50%) scale(1.05);
}

.close-icon {
  width: 0.8125rem;
  height: 0.8125rem;
}

/* Banner Transition */
.banner-slide-enter-active,
.banner-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.banner-slide-enter-from,
.banner-slide-leave-to {
  opacity: 0;
  transform: translateY(-100%);
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  overflow: hidden;
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
  background: rgba(9, 13, 11, 0.92);
  border-bottom-color: rgba(0, 245, 155, 0.2);
}

.header-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(0.75rem, 2.5vw, 2.5rem);
  height: 72px;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

@media (max-width: 480px) {
  .header-inner {
    height: 62px;
    gap: 0.5rem;
  }
  .brand-tagline {
    display: none;
  }
  .brand-name {
    font-size: 1.2rem;
  }
  .brand-icon {
    width: 2.15rem;
    height: 2.15rem;
  }
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
  background: rgba(0, 168, 107, 0.12);
  border: 1px solid rgba(0, 168, 107, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 3px;
}

.brand-icon img,
.brand-icon svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.dark .brand-icon {
  background: rgba(0, 245, 155, 0.12);
  border-color: rgba(0, 245, 155, 0.3);
  box-shadow: 0 0 16px rgba(0, 245, 155, 0.2);
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

.dark .nav-link { color: #cbd5e1; }

.dark .nav-link:hover {
  color: #00f59b;
  background: rgba(0, 245, 155, 0.12);
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

.btn-sm {
  font-size: 0.8125rem;
  padding: 0.5rem 1rem;
}


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
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-ink-700);
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
}

.mobile-nav-link:hover {
  background: var(--color-forest-100);
  color: var(--color-forest-800);
}

.dark .mobile-nav-link { color: #cbd5e1; }

.dark .mobile-nav-link:hover {
  background: rgba(0, 245, 155, 0.12);
  color: #00f59b;
}

/* User Card in Mobile Drawer */
.mobile-user-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(0, 168, 107, 0.08) 0%, rgba(0, 168, 107, 0.02) 100%);
  border: 1px solid rgba(0, 168, 107, 0.2);
}

.dark .mobile-user-card {
  background: linear-gradient(135deg, rgba(0, 245, 155, 0.12) 0%, rgba(0, 245, 155, 0.03) 100%);
  border-color: rgba(0, 245, 155, 0.25);
}

.mobile-user-avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #00a86b, #00704a);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 168, 107, 0.25);
}

.dark .mobile-user-avatar {
  background: linear-gradient(135deg, #00f59b, #00a86b);
  box-shadow: 0 4px 12px rgba(0, 245, 155, 0.3);
}

.mobile-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-avatar-initial {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.dark .mobile-avatar-initial {
  color: #040706;
}

.mobile-user-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.mobile-user-name-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.mobile-user-fullname {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-ink-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .mobile-user-fullname {
  color: #f1faf5;
}

.mobile-user-role-badge {
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: rgba(0, 168, 107, 0.12);
  color: #00a86b;
}

.dark .mobile-user-role-badge {
  background: rgba(0, 245, 155, 0.18);
  color: #00f59b;
}

.mobile-user-email {
  font-size: 0.75rem;
  color: var(--color-ink-500);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .mobile-user-email {
  color: #94a3b8;
}

.mobile-nav-section-title {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-ink-400);
  padding: 0.35rem 1rem 0.15rem 1rem;
}

.dark .mobile-nav-section-title {
  color: #64748b;
}

.mobile-nav-icon {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
  opacity: 0.85;
}

.mobile-icon--emerald { color: #00a86b; }
.dark .mobile-icon--emerald { color: #00f59b; }

.mobile-icon--tangerine { color: #ff7a00; }
.dark .mobile-icon--tangerine { color: #ffaa5a; }

.mobile-icon--blue { color: #0284c7; }
.dark .mobile-icon--blue { color: #38bdf8; }

.mobile-icon--purple { color: #9333ea; }
.dark .mobile-icon--purple { color: #c084fc; }

.mobile-nav-divider {
  height: 1px;
  background: var(--color-cream-200);
  margin: 0.5rem 0;
}

.dark .mobile-nav-divider { background: rgba(0, 245, 155, 0.15); }

.mobile-logout {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
  flex: 1 0 auto;
  width: 100%;
  max-width: 100%;
}

/* ────────────────────────────────────────
   FOOTER
──────────────────────────────────────── */
.site-footer {
  background: var(--color-cream-100);
  color: var(--color-ink-600);
  padding: 3rem 0 2rem;
  border-top: 1px solid var(--color-cream-300);
  transition: background-color 0.25s ease, border-color 0.25s ease;
  width: 100%;
  max-width: 100%;
  margin: 0;
}

.dark .site-footer {
  background-color: #090d0b;
  color: #cbd5e1;
  border-top: 1px solid rgba(0, 245, 155, 0.18);
}

.footer-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 2.5vw, 2.5rem);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
  gap: 2.5rem;
  padding-bottom: 1.75rem;
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
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  background: rgba(0, 168, 107, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(0, 168, 107, 0.25);
  padding: 3px;
}

.dark .footer-brand-icon {
  background: rgba(0, 245, 155, 0.12);
  border-color: rgba(0, 245, 155, 0.3);
  box-shadow: 0 0 16px rgba(0, 245, 155, 0.2);
}

.footer-brand-icon img,
.footer-brand-icon svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.footer-brand-name {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-ink-900);
  letter-spacing: -0.02em;
}

.dark .footer-brand-name {
  color: #f8fafc;
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
  color: #cbd5e1;
}

.footer-open {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-ink-500);
}

.dark .footer-open {
  color: #94a3b8;
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
  color: #cbd5e1;
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
  color: #cbd5e1;
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
  color: #cbd5e1;
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
   BOTTOM BAR & DEVELOPER SIGNATURE (COMPACT & UNIFIED)
──────────────────────────────────────── */
.footer-bottom {
  margin-top: 0;
  padding-top: 0.75rem;
  border-top: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1.25rem;
  font-size: 0.775rem;
  color: var(--color-ink-500);
}

.dark .footer-bottom {
  border-top: none;
  color: #64748b;
}

.footer-bottom-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.footer-copy-text {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-ink-600);
}

.dark .footer-copy-text {
  color: #94a3b8;
}

.footer-dev-credit {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.dev-tag-text {
  font-size: 0.75rem;
  color: var(--color-ink-500);
  font-weight: 500;
}

.dark .dev-tag-text {
  color: #64748b;
}

.dev-author-link {
  font-weight: 700;
  color: #059669;
  text-decoration: none;
  transition: color 0.15s ease;
}

.dev-author-link:hover {
  color: #047857;
  text-decoration: underline;
}

.dark .dev-author-link {
  color: #00f59b;
}

.dark .dev-author-link:hover {
  color: #5effc4;
}

.dev-social-icons-strip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* Natural Brand Colors for Social Icons (both Light and Dark modes) */
.social-icon-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  flex-shrink: 0;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

/* WhatsApp Icon slightly larger & prominent */
.social-icon-circle.wa {
  width: 36px;
  height: 36px;
  color: #25d366;
  background: rgba(37, 211, 102, 0.14);
  border: 1.5px solid rgba(37, 211, 102, 0.38);
}

.social-icon-circle.wa:hover {
  background: #25d366;
  color: #ffffff;
  border-color: #25d366;
  transform: translateY(-2px) scale(1.1);
  box-shadow: 0 6px 14px rgba(37, 211, 102, 0.45);
}

.social-icon-circle.ig {
  color: #e1306c;
  background: rgba(225, 48, 108, 0.12);
  border: 1px solid rgba(225, 48, 108, 0.28);
}

.social-icon-circle.ig:hover {
  background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%);
  color: #ffffff;
  border-color: transparent;
  transform: translateY(-2px) scale(1.08);
  box-shadow: 0 4px 10px rgba(225, 48, 108, 0.35);
}

.social-icon-circle.fb {
  color: #1877f2;
  background: rgba(24, 119, 242, 0.12);
  border: 1px solid rgba(24, 119, 242, 0.28);
}

.social-icon-circle.fb:hover {
  background: #1877f2;
  color: #ffffff;
  border-color: #1877f2;
  transform: translateY(-2px) scale(1.08);
  box-shadow: 0 4px 10px rgba(24, 119, 242, 0.35);
}

.social-icon-circle.ml {
  color: #ea4335;
  background: rgba(234, 67, 53, 0.12);
  border: 1px solid rgba(234, 67, 53, 0.28);
}

.social-icon-circle.ml:hover {
  background: #ea4335;
  color: #ffffff;
  border-color: #ea4335;
  transform: translateY(-2px) scale(1.08);
  box-shadow: 0 4px 10px rgba(234, 67, 53, 0.35);
}

.dark .social-icon-circle.wa {
  background: rgba(37, 211, 102, 0.18);
  border-color: rgba(37, 211, 102, 0.45);
}

.dark .social-icon-circle.ig {
  background: rgba(225, 48, 108, 0.16);
  border-color: rgba(225, 48, 108, 0.35);
}

.dark .social-icon-circle.fb {
  background: rgba(24, 119, 242, 0.16);
  border-color: rgba(24, 119, 242, 0.35);
}

.dark .social-icon-circle.ml {
  background: rgba(234, 67, 53, 0.16);
  border-color: rgba(234, 67, 53, 0.35);
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

.dark .footer-modal-trigger-btn {
  background: rgba(0, 245, 155, 0.08);
  border: 1px solid rgba(0, 245, 155, 0.3);
  color: #00f59b;
}

.dark .footer-modal-trigger-btn:hover {
  background: rgba(0, 245, 155, 0.16);
  border-color: rgba(0, 245, 155, 0.55);
  color: #5effc4;
  box-shadow: 0 0 12px rgba(0, 245, 155, 0.2);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .footer-bottom {
    padding-right: 0;
    padding-bottom: 5rem; /* Space on mobile for floating WhatsApp button */
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }

  .footer-bottom-info {
    align-items: center;
  }

  .footer-dev-credit {
    justify-content: center;
  }

  .footer-bottom-links {
    justify-content: center;
    width: 100%;
  }
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
