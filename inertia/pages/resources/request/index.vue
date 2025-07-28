<script lang="ts" setup>
import ResourceIndex, { Fields } from '~/components/ResourceIndex.vue';
import string from '@adonisjs/core/helpers/string'
import { DateTime } from 'luxon';
import { MonitorPageProps } from '~/types';
import Tooltip from '~/components/Tooltip.vue';
import ExecutedAt from '~/components/ExecutedAt.vue';

defineProps<MonitorPageProps>()

const verbColors = (verb: string) => ({
  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': verb == 'GET',
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': verb == 'POST',
  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300': verb == 'PUT',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': verb == 'PATCH',
  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': verb == 'DELETE',
  'border-green-700 bg-green-400': verb == 'HEAD',
  'border-gray-300 bg-gray-100': verb == 'OPTIONS',
})

const statusColors = (status: number) => ({
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': (status >= 100 && status < 200) || (status >= 300 && status < 400),
  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': status >= 200 && status < 300,
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': status >= 400 && status < 500,
  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': status >= 500,
})

const fields: Fields = [
  { name: 'method', title: 'Method' },
  { name: 'url', title: 'URL' },
  { name: 'status', title: 'Status' },
  { name: 'duration', title: 'Duration' },
  { name: 'ts', title: 'Executed At' },
]
</script>

<template>
  <ResourceIndex :fields="fields" :pagination :entries>
    <template #method="{ entry }">
      <span class="rounded px-3 py-1" :class="verbColors(entry.payload.request.method)">
        {{ entry.payload.request.method }}
      </span>
    </template>
    <template #url="{ entry }">
      <a target="_blank" class="hover:text-blue-300 visited:text-blue-200 hover:underline"
        :href="entry.payload.request.url">{{
          entry.payload.request.url }}</a>
    </template>
    <template #status="{ entry }">
      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
        :class="statusColors(entry.payload.response.status)">
        {{ entry.payload.response.status }}
      </span>
    </template>
    <template #duration="{ entry }">{{ string.prettyHrTime(entry.payload.duration) }}</template>
    <template #ts="{ entry }">
      <ExecutedAt :ts="entry.ts" />
    </template>
  </ResourceIndex>
</template>
