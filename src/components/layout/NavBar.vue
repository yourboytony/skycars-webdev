<template>
  <nav class="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <router-link to="/" class="flex items-center space-x-2 group">
            <PaperAirplaneIcon class="h-8 w-8 text-sky-blue group-hover:text-deep-blue transition-colors duration-200 transform rotate-45" />
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
          <router-link to="/login" class="nav-link">
            Log in
          </router-link>
          <router-link to="/register" class="btn-primary">
            Sign up
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center sm:hidden">
          <button
            @click="isOpen = !isOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-blue"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!isOpen" class="block h-6 w-6" />
            <XMarkIcon v-else class="block h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-full opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-full opacity-0"
    >
      <div v-if="isOpen" class="sm:hidden bg-white border-b border-gray-100">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
            :class="[
              $route.path === item.path
                ? 'text-sky-blue bg-sky-50'
                : 'text-gray-600 hover:text-gray-900'
            ]"
            @click="isOpen = false"
          >
            {{ item.name }}
          </router-link>
        </div>
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div class="px-2 space-y-1">
            <router-link
              to="/login"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              @click="isOpen = false"
            >
              Log in
            </router-link>
            <router-link
              to="/register"
              class="block px-3 py-2 rounded-md text-base font-medium bg-sky-blue text-white hover:bg-deep-blue"
              @click="isOpen = false"
            >
              Sign up
            </router-link>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PaperAirplaneIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const isOpen = ref(false)

const navigationItems = [
  { name: 'VATSIM', path: '/vatsim' },
  { name: 'Weather', path: '/weather' },
  { name: 'Flight Planning', path: '/flight-planning' },
  { name: 'Forum', path: '/forum' },
  { name: 'About', path: '/about' }
]
</script>
