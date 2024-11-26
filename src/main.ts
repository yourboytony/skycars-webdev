import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'

// Import global styles
import './assets/main.css'
import 'tailwindcss/tailwind.css'

// Import routes
import { routes } from './router'

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash }
    }
    return { top: 0 }
  }
})

// Create Pinia store
const pinia = createPinia()

// Create Vue app
const app = createApp(App)

// Register plugins
app.use(router)
app.use(pinia)
app.use(VueQueryPlugin, {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000 // 5 minutes
    }
  }
})

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Component:', instance)
  console.error('Info:', info)
}

// Mount app
app.mount('#app')

// Export for testing
export { app, router, pinia }
