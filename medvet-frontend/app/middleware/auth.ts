export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  // Try to re-authenticate if not authenticated
  if (!authStore.isAuthenticated) {
    try {
      await authStore.reAuthenticate()
    } catch {
      // Not authenticated
    }
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Check if route requires admin role
  if (to.meta.requiresAdmin && !authStore.canAccessAdmin) {
    return navigateTo('/dashboard')
  }
})
