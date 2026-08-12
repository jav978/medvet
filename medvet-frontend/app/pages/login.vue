<template>
  <div class="auth-page">

    <!-- Decorative paw — top right -->
    <div class="auth-deco" aria-hidden="true">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="128" rx="38" ry="32" fill="currentColor"/>
        <ellipse cx="58"  cy="90"  rx="18" ry="22" fill="currentColor"/>
        <ellipse cx="88"  cy="72"  rx="17" ry="21" fill="currentColor"/>
        <ellipse cx="118" cy="72"  rx="17" ry="21" fill="currentColor"/>
        <ellipse cx="146" cy="90"  rx="18" ry="22" fill="currentColor"/>
      </svg>
    </div>

    <div class="auth-wrap">

      <!-- Brand mark -->
      <div class="auth-brand">
        <NuxtLink to="/" class="auth-brand-link">
          <div class="auth-brand-icon">
            <svg viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" fill="currentColor"/></svg>
          </div>
          <span class="auth-brand-name">Med<span>Vet</span></span>
        </NuxtLink>
      </div>

      <h1 class="auth-title">Bienvenido de nuevo</h1>
      <p class="auth-sub">Accedé a tu historial clínico y gestión de citas</p>

      <!-- Form card -->
      <div class="auth-card">
        <form @submit.prevent="handleLogin" class="auth-form">

          <div class="form-field">
            <label for="login-email" class="form-label">Correo Electrónico</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
              <input
                id="login-email"
                v-model="form.email"
                type="email"
                placeholder="nombre@ejemplo.com"
                class="form-input"
                required
                autocomplete="email"
              />
            </div>
          </div>

          <div class="form-field">
            <label for="login-password" class="form-label">Contraseña</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
              <input
                id="login-password"
                v-model="form.password"
                type="password"
                placeholder="••••••••"
                class="form-input"
                required
                autocomplete="current-password"
              />
            </div>
          </div>

          <div v-if="error" class="form-error" role="alert">
            <svg class="error-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
            {{ error }}
          </div>

          <button
            type="submit"
            class="btn-primary submit-btn"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner"></span>
            <span v-else>Iniciar Sesión</span>
          </button>
        </form>

        <div class="auth-divider">
          <span>¿Aún no tienes cuenta?</span>
          <NuxtLink to="/register" class="auth-link">Crear cuenta gratis</NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(form.email, form.password)
    router.push('/dashboard')
  } catch {
    error.value = 'Credenciales incorrectas. Verificá tu email y contraseña.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  position: relative;
  overflow: hidden;
  background: var(--color-cream-100);
}

.auth-deco {
  position: absolute;
  top: -80px;
  right: -80px;
  width: 360px;
  height: 360px;
  color: var(--color-forest-200);
  opacity: 0.3;
  pointer-events: none;
}

.dark .auth-deco {
  color: var(--color-forest-900);
  opacity: 0.15;
}

.auth-wrap {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.auth-brand {
  margin-bottom: 1.75rem;
  text-align: center;
}

.auth-brand-link {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  transition: opacity 0.15s;
}

.auth-brand-link:hover { opacity: 0.8; }

.auth-brand-icon {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 14px;
  background: var(--color-amber-600);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
}

.auth-brand-icon svg { width: 1.25rem; height: 1.25rem; }

.auth-brand-name {
  font-family: var(--font-display);
  font-size: 1.625rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-ink-900);
}

.auth-brand-name span { color: var(--color-forest-600); }

.auth-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-ink-900);
  text-align: center;
  margin: 0 0 0.4rem;
}

.auth-sub {
  font-size: 0.875rem;
  color: var(--color-ink-500);
  text-align: center;
  margin: 0 0 1.75rem;
}

.auth-card {
  width: 100%;
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 16px 48px -12px rgba(15, 23, 42, 0.08);
}

.dark .auth-card {
  box-shadow: 0 16px 48px -12px rgba(0,0,0,0.35);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-ink-700);
}

.input-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: var(--color-ink-400);
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 0.75rem 0.875rem 0.75rem 2.5rem;
  border-radius: 12px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-100);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--color-ink-900);
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
  outline: none;
}

.form-input::placeholder { color: var(--color-ink-400); }

.form-input:focus {
  border-color: var(--color-amber-500);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.form-error {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.8125rem;
  color: #ef4444;
}

.error-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
  color: currentColor;
}

.submit-btn {
  width: 100%;
  justify-content: center;
  padding-top: 0.875rem;
  padding-bottom: 0.875rem;
  margin-top: 0.25rem;
  font-size: 1rem;
}

.submit-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-divider {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-cream-200);
  text-align: center;
  font-size: 0.8125rem;
  color: var(--color-ink-500);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.auth-link {
  color: var(--color-amber-600);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.15s;
}

.auth-link:hover { color: var(--color-amber-500); }
</style>
