<script setup lang="ts">
import { Link, router, usePage, WhenVisible } from '@inertiajs/vue3';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { Entry, MonitorIndexPageProps } from '../types';
import Dropdown from './Dropdown.vue';

const $toast = useToast();

export type Fields = Field[]
export type Field = {
  name: string,
  title: string,
}

const listenerRemover = ref()

onMounted(() => {
  listenerRemover.value = router.on('invalid', (event) => {
    const fullLink = event.detail.response.request?.responseURL
    return fullLink && fullLink.includes(`${monitor.url}${resourceRoute.value}`)
      && event.detail.response.status !== 204
  })
})

onUnmounted(() => listenerRemover.value?.())

const { resource, monitor } = usePage<MonitorIndexPageProps>().props

const { fields, entries, pagination } = defineProps<{
  fields: Fields,
  pagination: MonitorIndexPageProps['pagination'],
  entries: MonitorIndexPageProps['entries'],
}>()

const allEntries = ref<Required<typeof entries>>(entries!)

const resourceRoute = computed(() => monitor.resources.find(r => r.name === resource)!.routeName)
const buildUrl = (entry: Entry) => `${monitor.url}${resourceRoute.value}/${entry.id}`

const remove = (id: string) => {
  allEntries.value = allEntries.value!.filter((entry) => entry.id !== id)
  $toast.success('Successfully deleted entry!')
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow flex-1 flex flex-col min-h-0">
    <div class="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Showing {{ allEntries!.length }} of total {{ pagination!.total }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="allEntries!.length === 0" class="flex-1 flex items-center justify-center p-8">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
    </div>

    <div v-else class="hidden sm:block flex-1 min-h-0">
      <div class="overflow-x-auto h-full flex flex-col">
        <div ref="tableContainer" class="flex-1 overflow-y-auto">
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
            <tbody class="bg-white dark:bg-gray-800">
              <tr v-for="entry in allEntries" :key="entry.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                  v-for="(field, id) in fields" :key="id">
                  <slot :name="field.name" :entry="entry" />
                </td>
                <td class="py-3 whitespace-nowrap text-center text-sm font-medium relative">
                  <Link as="button" :href="buildUrl(entry)" preserve-state preserve-scroll
                    class="text-blue-600 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 mr-3 cursor-pointer">
                  View
                  </Link>
                  <Dropdown :link="buildUrl(entry)" @deleted="remove(entry.id)" />
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
                  <td colspan="100%" class="text-center py-4">
                    <template v-if="pagination!.hasMorePages">
                      <div class="w-full h-full flex justify-center">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-4"></div>
                        <span class="text-sm space-x-2 text-gray-500 dark:text-gray-400">Loading more entries...</span>
                      </div>
                    </template>
                    <template v-else>
                      <span class="text-sm space-x-2 text-gray-500 dark:text-gray-400">No more entries to load.</span>
                    </template>
                  </td>
                </tr>
              </WhenVisible>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>