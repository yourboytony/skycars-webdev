<template>
  <div class="min-h-screen bg-gray-50 pt-16">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Profile header -->
      <div class="bg-white shadow">
        <div class="px-4 py-5 sm:p-6">
          <div class="sm:flex sm:items-center sm:justify-between">
            <div class="sm:flex sm:space-x-4 items-center">
              <!-- Profile Image -->
              <div class="mb-4 sm:mb-0">
                <div v-if="authStore.user?.avatar" class="relative">
                  <img
                    :src="authStore.user.avatar"
                    class="h-24 w-24 rounded-full"
                    alt="Profile"
                  />
                  <button
                    @click="triggerImageUpload"
                    class="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg"
                  >
                    <PencilIcon class="h-4 w-4 text-gray-500" />
                  </button>
                </div>
                <div v-else class="h-24 w-24 rounded-full bg-sky-blue text-white flex items-center justify-center text-3xl">
                  {{ authStore.user?.name?.charAt(0).toUpperCase() }}
                </div>
              </div>

              <!-- Profile Info -->
              <div>
                <h1 class="text-2xl font-bold text-gray-900">
                  {{ authStore.user?.name }}
                </h1>
                <p class="text-sm text-gray-500">
                  {{ authStore.user?.email }}
                </p>
              </div>
            </div>

            <!-- Edit Profile Button -->
            <button
              @click="isEditing = true"
              class="mt-4 sm:mt-0 btn-primary"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <!-- Profile Content -->
      <div class="mt-6">
        <div class="bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <!-- Profile Form -->
            <form v-if="isEditing" @submit.prevent="handleSubmit">
              <div class="space-y-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-blue focus:ring-sky-blue sm:text-sm"
                  />
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-blue focus:ring-sky-blue sm:text-sm"
                  />
                </div>

                <div>
                  <label for="bio" class="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    v-model="form.bio"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-blue focus:ring-sky-blue sm:text-sm"
                  ></textarea>
                </div>

                <div class="flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="cancelEdit"
                    class="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="btn-primary"
                  >
                    {{ loading ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </div>
            </form>

            <!-- Profile Display -->
            <div v-else class="space-y-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Bio</h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{ authStore.user?.bio || 'No bio added yet.' }}
                </p>
              </div>

              <div>
                <h3 class="text-lg font-medium text-gray-900">Flight Statistics</h3>
                <dl class="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Flights</dt>
                    <dd class="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                  </div>
                  <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt class="text-sm font-medium text-gray-500 truncate">Flight Hours</dt>
                    <dd class="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                  </div>
                  <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt class="text-sm font-medium text-gray-500 truncate">Favorite Aircraft</dt>
                    <dd class="mt-1 text-3xl font-semibold text-gray-900">-</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PencilIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isEditing = ref(false)
const loading = ref(false)

const form = ref({
  name: '',
  email: '',
  bio: ''
})

onMounted(() => {
  if (authStore.user) {
    form.value = {
      name: authStore.user.name,
      email: authStore.user.email,
      bio: authStore.user.bio || ''
    }
  }
})

function cancelEdit() {
  isEditing.value = false
  if (authStore.user) {
    form.value = {
      name: authStore.user.name,
      email: authStore.user.email,
      bio: authStore.user.bio || ''
    }
  }
}

async function handleSubmit() {
  loading.value = true
  try {
    await authStore.updateProfile(form.value)
    isEditing.value = false
  } catch (error) {
    console.error('Failed to update profile:', error)
  } finally {
    loading.value = false
  }
}

function triggerImageUpload() {
  console.log('Image upload triggered')
}
</script>
