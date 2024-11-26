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
