<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3'
import { Database, Monitor, Settings, User, X } from 'lucide-vue-next';
import { MonitorPageProps, Unary } from '../types';

const props = usePage<MonitorPageProps>().props
const { url, resources, user } = props.monitor

type Resource = Unary<typeof resources>
const { isMobileSidebarOpen } = defineProps<{
  isMobileSidebarOpen: boolean,
  currentResource: Resource,
}>()

const emit = defineEmits(['update:isMobileSidebarOpen', 'update:currentResource']);

const closeMobileSidebar = () => emit('update:isMobileSidebarOpen', false)

const selectResource = (resource: Resource) => {
  emit('update:currentResource', resource)
  emit('update:isMobileSidebarOpen', false)
}
</script>

<template>
  <div v-if="isMobileSidebarOpen" class="fixed inset-0 z-50 lg:hidden" @click="closeMobileSidebar">
    <div class="absolute inset-0 bg-black opacity-50"></div>
  </div>

  <div
    class="w-64 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 fixed inset-y-0 left-0 z-50 lg:z-auto"
    :class="[isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full']">
    <!-- Logo -->
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Monitor />
        </div>
        <span class="text-xl font-bold text-gray-800 dark:text-white">Monitor</span>
      </div>
      <!-- Mobile close button -->
      <button @click="closeMobileSidebar"
        class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
        <div class="w-5 h-5">
          <X />
        </div>
      </button>
    </div>

    <!-- Navigation Links -->
    <nav class="mt-6">
      <div class="px-4 space-y-2">
        <Link v-for="resource in resources" :key="resource.name" :href="`${url}${resource.routeName}`"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
          :class="{ 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700 dark:border-blue-500': resource.name == currentResource.name }"
          @click="selectResource(resource)">
        <Database />
        <span class="ml-3">
          {{ resource.title }}
        </span>
        </Link>
      </div>
    </nav>

    <!-- User Banner at Bottom -->
    <div class="absolute bottom-0 w-64 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      v-if="!!user">
      <div class="flex items-center space-x-3">
        <div
          class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ user.name }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ user.email }}</p>
        </div>
        <button class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <Settings />
        </button>
      </div>
    </div>
  </div>
</template>