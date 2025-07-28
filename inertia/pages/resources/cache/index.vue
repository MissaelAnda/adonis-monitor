<script lang="ts" setup>
import { DateTime } from 'luxon';
import ResourceIndex, { Fields } from '~/components/ResourceIndex.vue';
import Tooltip from '~/components/Tooltip.vue';
import { MonitorPageProps } from '~/types';

defineProps<MonitorPageProps>()

const fields: Fields = [
  { name: 'event', title: 'Event' },
  { name: 'store', title: 'Store' },
  { name: 'key', title: 'Key' },
  { name: 'graced', title: 'Graced' },
]

const verbColors = (verb: string) => ({
  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': verb == 'cleared',
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': verb == 'hit',
  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300': verb == 'miss',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': verb == 'PATCH',
  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': verb == 'written',
  'border-green-700 bg-green-400': verb == 'HEAD',
})
</script>

<template>
  <ResourceIndex :fields :pagination :entries>
    <template #event="{ entry }">
      <span class="rounded px-3 py-1" :class="verbColors(entry.payload.event)">
        {{ entry.payload.event }}
      </span>
    </template>
    <template #store="{ entry }">{{ entry.payload.store }}</template>
    <template #key="{ entry }">{{ entry.payload.key }}</template>
    <template #graced="{ entry }">
      <div v-if="entry.payload.graced === true" class="text-green-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="m9 11 3 3L22 4" />
        </svg>
      </div>
      <div v-else-if="entry.payload.graced === false" class="text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
      </div>
      <div v-else>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      </div>
    </template>
    <template #ts="{ entry }">
      <Tooltip>
        <span>{{ DateTime.fromISO(entry.ts).toRelative({ style: 'short' }) }}</span>
        <template #tooltip>{{ DateTime.fromISO(entry.ts).toFormat('yyyy-LL-dd HH:mm:ii ZZZZ') }}</template>
      </Tooltip>
    </template>
  </ResourceIndex>
</template>
