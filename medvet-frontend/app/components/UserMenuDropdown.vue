<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

// Close on outside click
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
      isOpen.value = false
    }
  }
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      isOpen.value = false
    }
  }

  window.addEventListener('click', handleClickOutside)
  window.addEventListener('keydown', handleKeyDown)
  onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside)
    window.removeEventListener('keydown', handleKeyDown)
  })
})

const handleLogout = async () => {
  closeDropdown()
  await authStore.logout()
  router.push('/login')
}

// Format display name
const displayName = computed(() => {
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

const displayInitial = computed(() => {
  const name = authStore.user?.name?.trim()
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
  if (authStore.user?.email) {
    const prefix = authStore.user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '')
    if (prefix.length >= 2) {
      return prefix.slice(0, 2).toUpperCase()
    }
    return authStore.user.email.charAt(0).toUpperCase()
  }
  return 'CL'
})

const roleLabel = computed(() => {
  const role = authStore.user?.role
  switch (role) {
    case 'admin': return 'Administrador'
    case 'veterinarian': return 'Veterinario'
    case 'receptionist': return 'Recepción'
    default: return 'Cliente'
  }
})
</script>

<template>
  <div class="user-menu-root" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
      type="button"
      class="user-menu-trigger"
      :class="{ 'is-active': isOpen }"
      @click="toggleDropdown"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      title="Opciones de perfil y cuenta"
    >
      <div class="user-avatar-badge">
        <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" class="user-avatar-img" :alt="displayName" />
        <span v-else class="user-avatar-text">{{ displayInitial }}</span>
        <span class="status-indicator"></span>
      </div>
      <div class="user-info-preview">
        <span class="user-name-preview" :title="displayName">{{ displayName }}</span>
        <span class="user-role-mini">{{ roleLabel }}</span>
      </div>
      <svg
        class="user-chevron"
        :class="{ 'rotate-180': isOpen }"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- Dropdown Popover Menu -->
    <Transition name="dropdown-anim">
      <div v-if="isOpen" class="user-dropdown-card" role="menu">
        <!-- User Identity Header -->
        <div class="dropdown-user-header">
          <div class="header-avatar">
            <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" class="header-avatar-img" :alt="displayName" />
            <span v-else class="header-avatar-initial">{{ displayInitial }}</span>
          </div>
          <div class="header-text-info">
            <div class="header-name-row">
              <h4 class="header-user-name">{{ displayName }}</h4>
              <span class="header-role-badge" :class="authStore.user?.role || 'client'">
                {{ roleLabel }}
              </span>
            </div>
            <p class="header-user-email">{{ authStore.user?.email || 'Sin correo registrado' }}</p>
          </div>
        </div>

        <div class="dropdown-divider"></div>

        <!-- Navigation Links -->
        <div class="dropdown-nav-list">
          <NuxtLink
            to="/dashboard"
            class="dropdown-item"
            @click="closeDropdown"
            role="menuitem"
          >
            <div class="item-icon-wrap item-icon--emerald">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <div class="item-content">
              <span class="item-title">Mi Panel</span>
              <span class="item-subtitle">Próximos turnos y resumen</span>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/pets"
            class="dropdown-item"
            @click="closeDropdown"
            role="menuitem"
          >
            <div class="item-icon-wrap item-icon--tangerine">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.5 10.5C3.67 10.5 3 11.17 3 12s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm15 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM8.5 6C7.67 6 7 6.67 7 7.5S7.67 9 8.5 9 10 8.33 10 7.5 9.33 6 8.5 6zm7 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM12 10c-3.31 0-6 2.69-6 6 0 2.21 1.79 4 4 4h4c2.21 0 4-1.79 4-4 0-3.31-2.69-6-6-6z"/>
              </svg>
            </div>
            <div class="item-content">
              <span class="item-title">Mis Mascotas</span>
              <span class="item-subtitle">Fichas clínicas y carnets</span>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/dashboard/payments"
            class="dropdown-item"
            @click="closeDropdown"
            role="menuitem"
          >
            <div class="item-icon-wrap item-icon--blue">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="item-content">
              <span class="item-title">Pagos & Facturación</span>
              <span class="item-subtitle">Comprobantes y aranceles</span>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/book"
            class="dropdown-item"
            @click="closeDropdown"
            role="menuitem"
          >
            <div class="item-icon-wrap item-icon--emerald">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="item-content">
              <span class="item-title">Nueva Cita</span>
              <span class="item-subtitle">Reservar turno médico</span>
            </div>
          </NuxtLink>

          <NuxtLink
            v-if="authStore.canAccessAdmin"
            to="/admin/guardia"
            class="dropdown-item"
            @click="closeDropdown"
            role="menuitem"
          >
            <div class="item-icon-wrap item-icon--tangerine">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
              </svg>
            </div>
            <div class="item-content">
              <span class="item-title">Guardia 24/7</span>
              <span class="item-subtitle">Hospitalización y relevos</span>
            </div>
          </NuxtLink>

          <NuxtLink
            v-if="authStore.canAccessAdmin"
            to="/admin"
            class="dropdown-item"
            @click="closeDropdown"
            role="menuitem"
          >
            <div class="item-icon-wrap item-icon--purple">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="item-content">
              <span class="item-title">Administración</span>
              <span class="item-subtitle">Gestión clínica y turnos</span>
            </div>
          </NuxtLink>
        </div>

        <div class="dropdown-divider"></div>

        <!-- Logout Action Button -->
        <div class="dropdown-footer">
          <button
            type="button"
            class="dropdown-logout-btn"
            @click="handleLogout"
            role="menuitem"
          >
            <svg class="logout-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.user-menu-root {
  position: relative;
  display: inline-block;
}

/* ── Trigger Button ── */
.user-menu-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.35rem 0.75rem 0.35rem 0.45rem;
  border-radius: 999px;
  background: var(--color-cream-100, #f8faf9);
  border: 1px solid var(--color-cream-300, rgba(0, 0, 0, 0.08));
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.user-menu-trigger:hover,
.user-menu-trigger.is-active {
  background: #ffffff;
  border-color: #00a86b;
  box-shadow: 0 3px 10px rgba(0, 168, 107, 0.12);
}

.dark .user-menu-trigger {
  background: rgba(16, 28, 22, 0.85);
  border-color: rgba(0, 245, 155, 0.22);
}

.dark .user-menu-trigger:hover,
.dark .user-menu-trigger.is-active {
  background: rgba(16, 28, 22, 1);
  border-color: #00f59b;
  box-shadow: 0 0 14px rgba(0, 245, 155, 0.25);
}

/* Avatar Badge */
.user-avatar-badge {
  position: relative;
  width: 2.125rem;
  height: 2.125rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #00a86b 0%, #00704a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 5px rgba(0, 168, 107, 0.25);
  overflow: visible;
}

.dark .user-avatar-badge {
  background: linear-gradient(135deg, #00f59b 0%, #00a86b 100%);
}

.user-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.user-avatar-text {
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
}

.dark .user-avatar-text {
  color: #040706;
}

.status-indicator {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: #10b981;
  border: 1.5px solid #ffffff;
  z-index: 2;
}

.dark .status-indicator {
  border-color: #040706;
}

/* User Info Preview */
.user-info-preview {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  line-height: 1.2;
}

.user-name-preview {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-ink-900, #0f172a);
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .user-name-preview {
  color: #f1f5f9;
}

.user-role-mini {
  font-size: 0.6875rem;
  font-weight: 500;
  color: #00a86b;
}

.dark .user-role-mini {
  color: #00f59b;
}

.user-chevron {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--color-ink-400, #94a3b8);
  transition: transform 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
}

.user-menu-trigger:hover .user-chevron {
  color: #00a86b;
}

.dark .user-menu-trigger:hover .user-chevron {
  color: #00f59b;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* ── Popover Menu Card ── */
.user-dropdown-card {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 280px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 18px;
  box-shadow: 0 12px 36px -4px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04);
  z-index: 100;
  overflow: hidden;
  animation: dropdownIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dark .user-dropdown-card {
  background: #0d1611;
  border-color: rgba(0, 245, 155, 0.2);
  box-shadow: 0 16px 40px -4px rgba(0, 0, 0, 0.6), 0 0 24px rgba(0, 245, 155, 0.1);
}

/* Header in dropdown */
.dropdown-user-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1rem 0.875rem 1rem;
  background: linear-gradient(to bottom, var(--color-cream-100, #f8faf9), transparent);
}

.dark .dropdown-user-header {
  background: linear-gradient(to bottom, rgba(16, 28, 22, 0.9), transparent);
}

.header-avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #00a86b, #00704a);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.dark .header-avatar {
  background: linear-gradient(135deg, #00f59b, #00a86b);
}

.header-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-avatar-initial {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.dark .header-avatar-initial {
  color: #040706;
}

.header-text-info {
  flex: 1;
  min-width: 0;
}

.header-name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.header-user-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-ink-900, #0f172a);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .header-user-name {
  color: #ffffff;
}

.header-role-badge {
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: rgba(0, 168, 107, 0.12);
  color: #00a86b;
}

.dark .header-role-badge {
  background: rgba(0, 245, 155, 0.15);
  color: #00f59b;
}

.header-role-badge.admin {
  background: rgba(147, 51, 234, 0.12);
  color: #9333ea;
}

.dark .header-role-badge.admin {
  background: rgba(192, 132, 252, 0.2);
  color: #c084fc;
}

.header-user-email {
  font-size: 0.75rem;
  color: var(--color-ink-500, #64748b);
  margin: 0.15rem 0 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .header-user-email {
  color: #94a3b8;
}

.dropdown-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin: 0.25rem 0;
}

.dark .dropdown-divider {
  background: rgba(255, 255, 255, 0.08);
}

/* Nav links in dropdown */
.dropdown-nav-list {
  padding: 0.35rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.65rem;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.15s ease;
}

.dropdown-item:hover {
  background: var(--color-cream-200, #f1f5f3);
}

.dark .dropdown-item:hover {
  background: rgba(0, 245, 155, 0.1);
}

.item-icon-wrap {
  width: 1.875rem;
  height: 1.875rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-icon-wrap svg {
  width: 1rem;
  height: 1rem;
}

.item-icon--emerald {
  background: rgba(0, 168, 107, 0.12);
  color: #00a86b;
}

.dark .item-icon--emerald {
  background: rgba(0, 245, 155, 0.18);
  color: #00f59b;
}

.item-icon--tangerine {
  background: rgba(255, 122, 0, 0.12);
  color: #ff7a00;
}

.dark .item-icon--tangerine {
  background: rgba(255, 122, 0, 0.2);
  color: #ff9d42;
}

.item-icon--blue {
  background: rgba(14, 165, 233, 0.12);
  color: #0284c7;
}

.dark .item-icon--blue {
  background: rgba(14, 165, 233, 0.2);
  color: #38bdf8;
}

.item-icon--purple {
  background: rgba(147, 51, 234, 0.12);
  color: #9333ea;
}

.dark .item-icon--purple {
  background: rgba(192, 132, 252, 0.2);
  color: #c084fc;
}

.item-content {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.item-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-ink-800, #1e293b);
}

.dark .item-title {
  color: #f1f5f9;
}

.item-subtitle {
  font-size: 0.6875rem;
  color: var(--color-ink-400, #94a3b8);
}

.dark .item-subtitle {
  color: #64748b;
}

/* Footer / Logout */
.dropdown-footer {
  padding: 0.35rem 0.5rem 0.5rem 0.5rem;
}

.dropdown-logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.55rem;
  border-radius: 10px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  background: rgba(239, 68, 68, 0.05);
  color: #ef4444;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dropdown-logout-btn:hover {
  background: #ef4444;
  color: #ffffff;
  border-color: #ef4444;
}

.logout-icon {
  width: 0.95rem;
  height: 0.95rem;
}

/* Transitions */
.dropdown-anim-enter-active,
.dropdown-anim-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-anim-enter-from,
.dropdown-anim-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

@media (max-width: 640px) {
  .user-info-preview {
    display: none;
  }
  .user-menu-trigger {
    padding: 0.25rem;
    gap: 0.25rem;
  }
  .user-dropdown-card {
    right: -0.5rem;
    width: min(290px, calc(100vw - 1.5rem));
  }
}
</style>
