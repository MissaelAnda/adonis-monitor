<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from './Sidebar.vue';
import { usePage } from '@inertiajs/vue3';
import { MonitorPageProps, SerializedMonitor } from '../types';
import { Bell, Menu, Moon, Search, Sun } from 'lucide-vue-next';

const { monitor: { resources }, resource } = usePage<MonitorPageProps>().props

const isMobileSidebarOpen = ref(false)
const isDarkMode = ref(false)
const currentResource = ref(resources.find((r: SerializedMonitor) => r.name == resource)!)

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
          <div class="flex items-center justify-between px-4 sm:px-6 py-3">
            <div class="flex items-center space-x-4">
              <!-- Mobile menu button -->
              <button @click="toggleMobileSidebar"
                class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
                <div class="w-5 h-5">
                  <Menu />
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
                  <Sun />
                </div>
                <div v-else class="w-5 h-5">
                  <Moon />
                </div>
              </button>
              <button class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 relative">
                <Bell />
                <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hidden sm:block">
                <div class="w-5 h-5">
                  <Search />
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