<template>
  <div class="min-h-screen pt-20">
    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center space-y-6">
        <h1 class="text-5xl font-bold text-white">
          Welcome to SkyCars
        </h1>
        <p class="text-xl text-white/80 max-w-2xl mx-auto">
          Your premier aviation community hub for flight tracking, planning, and connecting with fellow pilots
        </p>
        <div class="flex justify-center gap-4 pt-4">
          <router-link 
            to="/flight-planning" 
            class="bg-sky-blue hover:bg-sky-blue/90 text-white px-8 py-3 rounded-lg 
                   transition-all duration-300 transform hover:scale-105"
          >
            Start Flying
          </router-link>
          <router-link 
            to="/vatsim" 
            class="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg 
                   backdrop-blur-sm transition-all duration-300"
          >
            Track Flights
          </router-link>
        </div>
      </div>

      <!-- Feature Cards -->
      <div class="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="feature in features" 
          :key="feature.title"
          class="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 
                 hover:bg-white/10 transition-all duration-300"
        >
          <component 
            :is="feature.icon" 
            class="h-10 w-10 text-sky-blue mb-4" 
          />
          <h3 class="text-xl font-semibold text-white mb-2">{{ feature.title }}</h3>
          <p class="text-white/70">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GlobeAltIcon, CloudIcon, UsersIcon } from '@heroicons/vue/24/outline'

const features = [
  {
    title: 'Live VATSIM Data',
    description: 'Track real-time flights and connect with the VATSIM network',
    icon: GlobeAltIcon
  },
  {
    title: 'Weather Integration',
    description: 'Access live weather data and forecasts for your routes',
    icon: CloudIcon
  },
  {
    title: 'Community Hub',
    description: 'Connect with fellow aviation enthusiasts and share experiences',
    icon: UsersIcon
  }
]
</script>
