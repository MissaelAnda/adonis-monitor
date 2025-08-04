<script setup lang="ts">
import { DateTime } from 'luxon';
import { computed } from 'vue';
import { MonitorEntryPageProps } from '../../../types';
import Card from '../../../components/Card.vue';
import Boolean from '../../../components/Boolean.vue';

const { entry } = defineProps<MonitorEntryPageProps>()

const verbColors = (verb: string) => ({
  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': verb == 'cleared',
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': verb == 'hit',
  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300': verb == 'miss',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': verb == 'PATCH',
  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': verb == 'written',
  'border-green-700 bg-green-400': verb == 'HEAD',
})

const date = computed(() => DateTime.fromISO(entry.ts))
</script>

<template>
  <Card>
    <template #title>
      <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Cache Data</p>
    </template>

    <table class="w-full dark:text-white">
      <thead>
        <tr>
          <th>Type</th>
          <th>Store</th>
          <th>Key</th>
          <th>Graced</th>
          <th>Executed At</th>
        </tr>
      </thead>
      <tbody class="text-center">
        <tr>
          <td class="pt-6 pb-2">
            <span class="rounded px-3 py-1" :class="verbColors(entry.payload.event)">
              {{ entry.payload.event }}
            </span>
          </td>
          <td>{{ entry.payload.store }}</td>
          <td>{{ entry.payload.key }}</td>
          <td class="flex justify-center align-middle h-full">
            <Boolean :bool="entry.payload.graced" />
          </td>
          <td>{{ date.toHTTP() }} ({{ date.toRelative() }})</td>
        </tr>
      </tbody>
    </table>
  </Card>
</template>