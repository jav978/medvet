import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'receptionist' | 'veterinarian' | 'client'
  phone?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isReceptionist: (state) => state.user?.role === 'receptionist',
    isVeterinarian: (state) => state.user?.role === 'veterinarian',
    isClient: (state) => state.user?.role === 'client',
    canAccessAdmin: (state) => ['admin', 'receptionist'].includes(state.user?.role || '')
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      try {
        const { $feathers } = useNuxtApp()
        const result = await $feathers.authenticate({
          strategy: 'local',
          email,
          password
        })
        this.user = result.user
        this.isAuthenticated = true
        return result
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        const { $feathers } = useNuxtApp()
        await $feathers.logout()
        this.user = null
        this.isAuthenticated = false
      } catch (error) {
        throw error
      }
    },

    async reAuthenticate() {
      this.loading = true
      try {
        const { $feathers } = useNuxtApp()
        const result = await $feathers.reAuthenticate()
        this.user = result.user
        this.isAuthenticated = true
        return result
      } catch (error) {
        this.user = null
        this.isAuthenticated = false
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(data: { email: string; password: string; name: string; phone?: string }) {
      this.loading = true
      try {
        const { $feathers } = useNuxtApp()
        await $feathers.service('users').create({
          ...data,
          role: 'client',
          active: true
        })
        return await this.login(data.email, data.password)
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
