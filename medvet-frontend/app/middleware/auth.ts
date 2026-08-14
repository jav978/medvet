export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  // Try to re-authenticate if not currently authenticated
  if (!authStore.isAuthenticated) {
    try {
      await authStore.reAuthenticate()
    } catch {
      // Unauthenticated session
    }
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  // Check if route requires admin/staff permissions
  if (to.meta.requiresAdmin && !authStore.canAccessAdmin) {
    return navigateTo('/dashboard')
  }
})
