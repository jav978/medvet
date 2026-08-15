<script setup lang="ts">
const props = defineProps<{
  variant?: 'switch' | 'icon'
}>()

const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

const toggle = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <ClientOnly>
    <button
      v-if="props.variant === 'icon'"
      type="button"
      class="theme-icon-btn"
      :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      @click="toggle"
    >
      <svg v-if="isDark" class="theme-icon-svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
      </svg>
      <svg v-else class="theme-icon-svg theme-icon-svg--sun" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
      </svg>
    </button>

    <button
      v-else
      type="button"
      class="theme-toggle"
      :class="{ 'theme-toggle--dark': isDark }"
      :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      @click="toggle"
    >
      <span class="theme-toggle-thumb">
        <svg v-if="isDark" class="theme-toggle-icon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
        </svg>
        <svg v-else class="theme-toggle-icon theme-toggle-icon--sun" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
        </svg>
      </span>
    </button>

    <template #fallback>
      <span v-if="props.variant === 'icon'" class="theme-icon-btn" aria-hidden="true">
        <svg class="theme-icon-svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
        </svg>
      </span>
      <span v-else class="theme-toggle" aria-hidden="true">
        <span class="theme-toggle-thumb">
          <svg class="theme-toggle-icon" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
          </svg>
        </span>
      </span>
    </template>
  </ClientOnly>
</template>

<style scoped>
/* ── Pill switch (desktop) ── */
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
  flex-shrink: 0;
  transition: background 0.25s ease, border-color 0.25s ease;
}

.dark .theme-toggle {
  background: rgba(16, 28, 22, 0.8);
  border-color: rgba(0, 245, 155, 0.28);
}

.theme-toggle-thumb {
  width: 1.375rem;
  height: 1.375rem;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(0);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.25s ease, box-shadow 0.25s ease;
}

.theme-toggle--dark .theme-toggle-thumb {
  transform: translateX(1.6rem);
  background: #00f59b;
  box-shadow: 0 0 12px rgba(0, 245, 155, 0.8);
}

.theme-toggle-icon {
  width: 0.75rem;
  height: 0.75rem;
  color: #040706;
}

.theme-toggle-icon--sun {
  color: var(--color-amber-600);
}

.dark .theme-toggle-icon--sun {
  color: #032014;
}

/* ── Icon button (mobile / admin topbar) ── */
.theme-icon-btn {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 10px;
  background: var(--color-cream-200);
  border: 1px solid var(--color-cream-300);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-ink-700);
  flex-shrink: 0;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.theme-icon-btn:hover {
  background: var(--color-cream-300);
  color: #00a86b;
}

.dark .theme-icon-btn {
  background: rgba(16, 28, 22, 0.8);
  border: 1px solid rgba(0, 245, 155, 0.2);
  color: #00f59b;
}

.dark .theme-icon-btn:hover {
  background: rgba(0, 245, 155, 0.12);
  border-color: rgba(0, 245, 155, 0.4);
  color: #5effc4;
}

.theme-icon-svg {
  width: 1.125rem;
  height: 1.125rem;
}

.theme-icon-svg--sun {
  color: var(--color-amber-600);
}

.dark .theme-icon-svg--sun {
  color: inherit;
}
</style>
