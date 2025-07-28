<script setup lang="ts">
import { Link, usePage, WhenVisible } from '@inertiajs/vue3';
import { computed, onMounted, ref } from 'vue';
import { Entry, MonitorPageProps } from '~/types';
import Dropdown from '~/components/Dropdown.vue';

export type Fields = Field[]
export type Field = {
  name: string,
  title: string,
}

const { resource, monitor } = usePage<MonitorPageProps>().props

const { fields, entries, pagination } = defineProps<{
  fields: Fields,
  pagination: MonitorPageProps['pagination'],
  entries: MonitorPageProps['entries'],
}>()

const allEntries = ref<Required<typeof entries>>(entries!)

const resourceRoute = computed(() => monitor.resources.find(r => r.name === resource)!.routeName)
const buildUrl = (entry: Entry) => `${monitor.url}${resourceRoute.value}/${entry!.id}`
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow flex-1 flex flex-col min-h-0">
    <div class="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <!-- <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2> -->
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Showing {{ allEntries!.length }} of total {{ pagination!.total }}
            <!-- <span v-if="isLoading" class="ml-2 text-blue-500">Loading...</span> -->
          </span>
          <!-- <button
            class="px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Export All
          </button> -->
        </div>
      </div>
    </div>

    <div v-if="allEntries!.length === 0" class="flex-1 flex items-center justify-center p-8">
      <div class="text-gray-400 dark:text-gray-500 mb-2">
        <div class="w-12 h-12 mx-auto mb-4 opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
      <!-- <p class="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search terms or clear the search to see all
        orders.</p> -->
    </div>

    <div v-else class="hidden sm:block flex-1 min-h-0">
      <div class="overflow-x-auto h-full flex flex-col">
        <table class="w-full flex-shrink-0">
          <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                v-for="field in fields" :key="field.name">
                {{ field.title }}
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
        </table>

        <div ref="tableContainer" class="flex-1 overflow-y-auto">
          <table class="w-full">
            <tbody class="bg-white dark:bg-gray-800">
              <tr v-for="entry in allEntries" :key="entry.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                  v-for="(field, id) in fields" :key="id">
                  <slot :name="field.name" :entry="entry" />
                </td>
                <td class="py-3 whitespace-nowrap text-center text-sm font-medium">
                  <Link as="button" :href="buildUrl(entry)" preserve-state preserve-scroll
                    class="text-blue-600 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 mr-3 pointer">
                  View
                  </Link>
                  <Dropdown />
                </td>
              </tr>

              <WhenVisible :always="pagination!.hasMorePages" :params="{
                preserveUrl: true,
                data: { page: pagination!.currentPage + 1 },
                only: ['pagination', 'entries'],
                async: true,
                onFinish: () => allEntries = [...allEntries!, ...(entries ?? [])],
              }">
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:border-gray-700">
                  <template v-if="pagination!.hasMorePages">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span class="text-sm">Loading more entries...</span>
                  </template>
                  <template v-else>
                    <span class="text-sm space-x-2 text-gray-500 dark:text-gray-400">No more entries to load.</span>
                  </template>
                </tr>
              </WhenVisible>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>