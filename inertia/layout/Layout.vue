<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from './Sidebar.vue';
import { usePage } from '@inertiajs/vue3';
import { MonitorPageProps } from '~/types';

const { monitor: { resources }, resource } = usePage<MonitorPageProps>().props

const isMobileSidebarOpen = ref(false)
const isDarkMode = ref(false)
const currentResource = ref(resources.find(r => r.name == resource)!)

const toggleMobileSidebar = () => { isMobileSidebarOpen.value = !isMobileSidebarOpen.value }
const toggleDarkMode = () => { isDarkMode.value = !isDarkMode.value }
</script>

<template>
  <div :data-theme="{ 'dark': isDarkMode }">
    <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar v-model:is-mobile-sidebar-open="isMobileSidebarOpen" v-model:current-resource="currentResource" />

      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between px-4 sm:px-6 py-4">
            <div class="flex items-center space-x-4">
              <!-- Mobile menu button -->
              <button @click="toggleMobileSidebar"
                class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <div class="w-5 h-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                </div>
              </button>
              <div>
                <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{{ currentResource.title }}</h1>
              </div>
            </div>

            <div class="flex items-center space-x-2 sm:space-x-4">
              <!-- Dark mode toggle button -->
              <button @click="toggleDarkMode"
                class="p-2 rounded-lg transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <div v-if="isDarkMode" class="w-5 h-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                </div>
                <div v-else class="w-5 h-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                </div>
              </button>
              <button class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="m13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hidden sm:block">
                <div class="w-5 h-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </header>

        <main class="flex-1 flex flex-col overflow-hidden p-4 sm:p-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>