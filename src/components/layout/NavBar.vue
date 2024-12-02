<template>
  <nav class="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <router-link to="/" class="flex items-center space-x-2 group">
            <span class="text-xl font-bold text-sky-blue group-hover:text-deep-blue transition-colors duration-200">SkyCars</span>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden sm:flex sm:space-x-8 items-center">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === item.path }"
          >
            {{ item.name }}
          </router-link>
        </div>

        <!-- Auth Buttons -->
        <div class="hidden sm:flex sm:items-center sm:space-x-4">
          <template v-if="!authStore.isAuthenticated">
            <router-link to="/login" class="nav-link">
              Log in
            </router-link>
            <router-link to="/register" class="btn-primary">
              Sign up
            </router-link>
          </template>

          <div v-else class="relative">
            <button
              @click="toggleDropdown"
              class="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <div class="h-8 w-8 rounded-full bg-sky-blue text-white flex items-center justify-center">
                {{ authStore.user?.name?.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm font-medium">{{ authStore.user?.name }}</span>
            </button>

            <div
              v-if="isDropdownOpen"
              class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            >
              <div class="py-1">
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="closeDropdown"
                >
                  Your Profile
                </router-link>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="sm:hidden">
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="p-2 text-gray-400 hover:text-gray-500"
          >
            <span class="sr-only">Open menu</span>
            <span v-if="!isMobileMenuOpen">☰</span>
            <span v-else>✕</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="isMobileMenuOpen" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          :class="{ 'bg-gray-50': $route.path === item.path }"
          @click="isMobileMenuOpen = false"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isDropdownOpen = ref(false)
const isMobileMenuOpen = ref(false)

const navigationItems = [
  { name: 'VATSIM', path: '/vatsim' },
  { name: 'Weather', path: '/weather' },
  { name: 'Flight Planning', path: '/flight-planning' },
  { name: 'Forum', path: '/forum' },
  { name: 'About', path: '/about' }
]

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function closeDropdown() {
  isDropdownOpen.value = false
}

async function handleLogout() {
  await authStore.logout()
  closeDropdown()
  router.push('/')
}
</script>
