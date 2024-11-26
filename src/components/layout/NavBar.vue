<template>
  <nav class="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <PaperAirplaneIcon class="h-8 w-8 text-blue-600 transform rotate-45" />
            <span class="text-xl font-bold text-blue-600">SkyCars</span>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden sm:flex sm:space-x-8 items-center">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            :class="{ 'text-blue-600': $route.path === item.path }"
          >
            {{ item.name }}
          </router-link>
        </div>

        <!-- Auth Buttons -->
        <div class="hidden sm:flex sm:items-center sm:space-x-4">
          <router-link
            to="/login"
            class="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
          >
            Log in
          </router-link>
          <router-link
            to="/register"
            class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
          >
            Sign up
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline'

const navigationItems = [
  { name: 'VATSIM', path: '/vatsim' },
  { name: 'Weather', path: '/weather' },
  { name: 'Flight Planning', path: '/flight-planning' },
  { name: 'Forum', path: '/forum' },
  { name: 'About', path: '/about' }
]
</script>
