<script setup lang="ts">
import { DateTime } from 'luxon';
import ResourceIndex, { Fields } from '~/components/ResourceIndex.vue';
import Tooltip from '~/components/Tooltip.vue';
import { MonitorPageProps } from '~/types';

defineProps<MonitorPageProps>()

const verbColors = (verb: string) => ({
  'border-green-700 bg-green-400': verb == 'TRACE',
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': verb == 'DEBUG',
  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': verb == 'INFO',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': verb == 'WARN',
  'bg-red-100 text-red-500 dark:bg-red-600 dark:text-red-200': verb == 'ERROR',
  'bg-red-500 text-red-800 dark:bg-red-900 dark:text-red-600': verb == 'FATAL',
})

const fields: Fields = [
  { name: 'level', title: 'Level' },
  { name: 'message', title: 'Message' },
  { name: 'args', title: 'Arguments' },
  { name: 'ts', title: 'Executed At' },
]
</script>

<template>
  <ResourceIndex :fields :pagination :entries>
    <template #level="{ entry }">
      <span class="rounded px-3 py-1" :class="verbColors(entry.payload.level)">
        {{ entry.payload.level }}
      </span>
    </template>
    <template #message="{ entry }">{{entry.payload.args.find((arg: any) => typeof arg == 'string') ||
      entry.payload.args[0]}}</template>
    <template #args="{ entry }">{{ entry.payload.args.length }}</template>
    <template #ts="{ entry }">
      <Tooltip>
        <span>{{ DateTime.fromISO(entry.ts).toRelative({ style: 'short' }) }}</span>
        <template #tooltip>{{ DateTime.fromISO(entry.ts).toFormat('yyyy-LL-dd HH:mm:ii ZZZZ') }}</template>
      </Tooltip>
    </template>
  </ResourceIndex>
</template>