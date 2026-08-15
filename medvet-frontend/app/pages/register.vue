<template>
  <div class="auth-page">

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

      <div class="auth-brand">
        <NuxtLink to="/" class="auth-brand-link">
          <div class="auth-brand-icon">
            <svg viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" fill="currentColor"/></svg>
          </div>
          <span class="auth-brand-name">Med<span>Vet</span></span>
        </NuxtLink>
      </div>

      <h1 class="auth-title">Crear tu Cuenta MedVet</h1>
      <p class="auth-sub">Registrá tus mascotas y agendá citas sin demoras</p>

      <div class="auth-card">
        <!-- Google Social Login Button -->
        <button
          type="button"
          class="btn-google"
          :disabled="loading || googleLoading"
          @click="handleGoogleRegister"
        >
          <span v-if="googleLoading" class="spinner-dark"></span>
          <template v-else>
            <svg class="google-icon" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Registrarse con Google</span>
          </template>
        </button>

        <div class="or-separator">
          <span class="sep-line"></span>
          <span class="sep-text">o completá tus datos</span>
          <span class="sep-line"></span>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">

          <div class="form-field">
            <label for="reg-name" class="form-label">Nombre y Apellido</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>
              <input
                id="reg-name"
                v-model="form.name"
                type="text"
                placeholder="Ej. Sofía Martínez"
                class="form-input"
                required
                autocomplete="name"
              />
            </div>
          </div>

          <div class="form-field">
            <label for="reg-email" class="form-label">Correo Electrónico</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
              <input
                id="reg-email"
                v-model="form.email"
                type="email"
                placeholder="tu@email.com"
                class="form-input"
                required
                autocomplete="email"
              />
            </div>
          </div>

          <div class="form-field">
            <label for="reg-phone" class="form-label">Teléfono de Contacto <span class="optional">(opcional)</span></label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
              <input
                id="reg-phone"
                v-model="form.phone"
                type="tel"
                placeholder="+54 11 1234-5678"
                class="form-input"
                autocomplete="tel"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="reg-pass" class="form-label">Contraseña</label>
              <div class="input-wrap">
                <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
                <input
                  id="reg-pass"
                  v-model="form.password"
                  type="password"
                  placeholder="••••••••"
                  class="form-input"
                  required
                  autocomplete="new-password"
                />
              </div>
            </div>

            <div class="form-field">
              <label for="reg-confirm" class="form-label">Confirmar Contraseña</label>
              <div class="input-wrap">
                <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
                <input
                  id="reg-confirm"
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  class="form-input"
                  required
                  autocomplete="new-password"
                />
              </div>
            </div>
          </div>

          <div v-if="error" class="form-error" role="alert">
            <svg class="error-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
            {{ error }}
          </div>

          <button type="submit" class="btn-primary submit-btn" :disabled="loading || googleLoading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Registrarse e Ingresar</span>
          </button>
        </form>

        <div class="auth-divider">
          <span>¿Ya estás registrado?</span>
          <NuxtLink to="/login" class="auth-link">Iniciar sesión</NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const googleLoading = ref(false)
const error = ref('')

const redirectUser = () => {
  const target = route.query.redirect ? String(route.query.redirect) : (authStore.canAccessAdmin ? '/admin' : '/dashboard')
  router.push(target)
}

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await authStore.register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password
    })
    redirectUser()
  } catch (err: any) {
    error.value = err?.message || 'Error al registrar la cuenta. Intentalo nuevamente.'
  } finally {
    loading.value = false
  }
}

const handleGoogleRegister = async () => {
  googleLoading.value = true
  error.value = ''
  try {
    await authStore.loginWithGoogle(form.email, form.name)
    redirectUser()
  } catch {
    error.value = 'No se pudo completar el registro con Google. Probá de nuevo.'
  } finally {
    googleLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 4vw, 3rem) 1rem;
  position: relative;
  overflow: hidden;
  background: var(--color-cream-100);
}

.auth-deco {
  position: absolute;
  top: -80px;
  right: -80px;
  width: clamp(240px, 30vw, 360px);
  height: clamp(240px, 30vw, 360px);
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
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.auth-brand {
  margin-bottom: 1.25rem;
}

.auth-brand-link {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  transition: opacity 0.15s;
}

.auth-brand-link:hover { opacity: 0.85; }

.auth-brand-icon {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 14px;
  background: rgba(0, 168, 107, 0.12);
  border: 1px solid rgba(0, 168, 107, 0.25);
  color: #00a86b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .auth-brand-icon {
  background: rgba(0, 245, 155, 0.15);
  border-color: rgba(0, 245, 155, 0.3);
  color: #00f59b;
}

.auth-brand-icon svg { width: 1.35rem; height: 1.35rem; fill: currentColor; }

.auth-brand-name {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3vw, 1.625rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-ink-900);
}

.dark .auth-brand-name {
  color: #f1faf5;
}

.auth-brand-name span { color: #00a86b; }
.dark .auth-brand-name span { color: #00f59b; }

.auth-title {
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 3.5vw + 0.25rem, 1.75rem);
  font-weight: 800;
  color: var(--color-ink-900);
  text-align: center;
  margin: 0 0 0.4rem;
  line-height: 1.25;
}

.dark .auth-title {
  color: #f1faf5;
}

.auth-sub {
  font-size: clamp(0.8125rem, 1vw + 0.5rem, 0.875rem);
  color: var(--color-ink-500);
  text-align: center;
  margin: 0 0 1.25rem;
  line-height: 1.4;
}

.dark .auth-sub {
  color: #cbd5e1;
}

.auth-card {
  width: 100%;
  background: var(--color-cream-50);
  border: 1px solid var(--color-cream-200);
  border-radius: clamp(16px, 3vw, 24px);
  padding: clamp(1.25rem, 4vw, 2rem);
  box-shadow: 0 16px 48px -12px rgba(15, 23, 42, 0.08);
}

.dark .auth-card {
  background: #0a110e;
  border-color: rgba(0, 245, 155, 0.18);
  box-shadow: 0 16px 48px -12px rgba(0,0,0,0.5);
}

/* Google Button */
.btn-google {
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border: 1.5px solid var(--color-cream-300);
  border-radius: 12px;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-ink-800);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.dark .btn-google {
  background: #101c17;
  border-color: rgba(0, 245, 155, 0.2);
  color: #f1faf5;
}

.btn-google:hover:not(:disabled) {
  border-color: #00a86b;
  background: #f8faf9;
  transform: translateY(-1px);
}

.dark .btn-google:hover:not(:disabled) {
  border-color: #00f59b;
  background: #14241e;
}

.btn-google:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.google-icon {
  width: 1.15rem;
  height: 1.15rem;
  flex-shrink: 0;
}

.or-separator {
  display: flex;
  align-items: center;
  margin: 1.25rem 0;
  gap: 0.75rem;
}

.sep-line {
  flex: 1;
  height: 1px;
  background: var(--color-cream-300);
}

.dark .sep-line {
  background: rgba(0, 245, 155, 0.12);
}

.sep-text {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-ink-400);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.875rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-ink-700);
}

.dark .form-label { color: #a3b8ad; }

.optional {
  font-weight: 400;
  color: var(--color-ink-400);
}

.input-wrap { position: relative; }

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
  padding: 0.7rem 0.875rem 0.7rem 2.5rem;
  border-radius: 12px;
  border: 1.5px solid var(--color-cream-300);
  background: var(--color-cream-100);
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-ink-900);
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
  outline: none;
}

.dark .form-input {
  background: #060c09;
  border-color: rgba(0, 245, 155, 0.2);
  color: #f1faf5;
}

.form-input::placeholder { color: var(--color-ink-400); }

.form-input:focus {
  border-color: #00a86b;
  box-shadow: 0 0 0 3px rgba(0, 168, 107, 0.15);
}

.dark .form-input:focus {
  border-color: #00f59b;
  box-shadow: 0 0 0 3px rgba(0, 245, 155, 0.2);
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
}

.submit-btn {
  width: 100%;
  justify-content: center;
  padding-top: 0.875rem;
  padding-bottom: 0.875rem;
  margin-top: 0.25rem;
  font-size: 0.9375rem;
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

.spinner-dark {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(0, 168, 107, 0.2);
  border-top-color: #00a86b;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

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

.dark .auth-divider {
  border-top-color: rgba(0, 245, 155, 0.12);
  color: #cbd5e1;
}

.auth-link {
  color: #00a86b;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.15s;
}

.dark .auth-link {
  color: #00f59b;
}

.auth-link:hover { text-decoration: underline; }
</style>
