<template>
  <div class="min-h-screen bg-gradient-radial from-sky-900 via-deep-blue to-black text-white">
    <nav class="fixed w-full z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
      <div class="max-w-8xl mx-auto">
        <div class="flex items-center justify-between h-20 px-6">
          <!-- Animated Logo -->
          <div class="relative h-12 w-40 cursor-pointer group">
            <div class="absolute inset-0 bg-gradient-to-r from-sky-blue to-deep-blue opacity-75 blur-lg group-hover:opacity-100 transition-all duration-300"></div>
            <div class="relative flex items-center h-full">
              <img src="@/assets/logo.svg" alt="SkyCars" class="h-8" />
            </div>
          </div>

          <!-- Navigation -->
          <div class="hidden lg:flex space-x-8">
            <TransitionGroup name="nav-items">
              <router-link
                v-for="item in navigationItems"
                :key="item.path"
                :to="item.path"
                class="relative group px-4 py-2 text-white/90 hover:text-white transition-colors duration-200"
              >
                <span class="relative z-10">{{ item.name }}</span>
                <div class="absolute inset-0 bg-white/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200"></div>
              </router-link>
            </TransitionGroup>
          </div>

          <!-- Auth Section -->
          <div class="hidden lg:flex items-center space-x-4">
            <template v-if="!authStore.isAuthenticated">
              <router-link to="/login" class="text-white/90 hover:text-white transition-colors duration-200">
                Sign In
              </router-link>
              <router-link to="/register" class="bg-sky-blue hover:bg-sky-blue/90 text-white px-6 py-2 rounded-full transition-colors duration-200">
                Get Started
              </router-link>
            </template>
            <UserMenu v-else />
          </div>

          <!-- Mobile Menu Button -->
          <button class="lg:hidden p-2 text-white/80 hover:text-white">
            <MenuIcon v-if="!isMobileMenuOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>

    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MenuIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import UserMenu from '@/components/UserMenu.vue'

const authStore = useAuthStore()
const isMobileMenuOpen = ref(false)

const navigationItems = [
  { name: 'VATSIM', path: '/vatsim' },
  { name: 'Weather', path: '/weather' },
  { name: 'Flight Planning', path: '/flight-planning' },
  { name: 'Forum', path: '/forum' },
  { name: 'About', path: '/about' }
]
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.nav-items-enter-active,
.nav-items-leave-active {
  transition: all 0.3s ease;
}

.nav-items-enter-from,
.nav-items-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
