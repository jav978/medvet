export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt'
  ],

  ui: {
    theme: {
      colors: {
        primary: '#1A73E8',
        secondary: '#34A853',
        accent: '#FBBC04'
      }
    }
  },

  runtimeConfig: {
    public: {
      apiURL: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3030'
    }
  },

  app: {
    head: {
      title: 'MedVet - Sistema de Reservas Veterinarias',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sistema de reservas para clínicas veterinarias' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
