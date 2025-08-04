<script lang="ts" setup>
import ExecutedAt from '../../../components/ExecutedAt.vue';
import ResourceIndex, { Fields } from '../../../components/ResourceIndex.vue';
import { MonitorIndexPageProps } from '../../../types';

defineProps<MonitorIndexPageProps>()

const fields: Fields = [
  { name: 'event', title: 'Event' },
  { name: 'store', title: 'Store' },
  { name: 'key', title: 'Key' },
  { name: 'graced', title: 'Graced' },
  { name: 'ts', title: 'Executed At' },
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
      <Boolean :bool="entry.payload.graced" />
    </template>
    <template #ts="{ entry }">
      <ExecutedAt :ts="entry.ts" />
    </template>
  </ResourceIndex>
</template>
