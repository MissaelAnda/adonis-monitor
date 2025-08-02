<script setup lang="ts">
import Card from '~/components/Card.vue';
import { MonitorEntryPageProps } from '~/types';
import { computed } from 'vue';
import { DateTime } from 'luxon';
import CopyToClipboard from '~/components/CopyToClipboard.vue';

const { entry } = defineProps<MonitorEntryPageProps>()

const date = computed(() => DateTime.fromISO(entry.ts))

const verbColors = (verb: string) => ({
  'border-green-700 bg-green-400': verb == 'TRACE',
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': verb == 'DEBUG',
  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': verb == 'INFO',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': verb == 'WARN',
  'bg-red-100 text-red-500 dark:bg-red-600 dark:text-red-200': verb == 'ERROR',
  'bg-red-500 text-red-800 dark:bg-red-900 dark:text-red-600': verb == 'FATAL',
})
</script>

<template>
  <Card>
    <template #title>
      <div class="block">
        <p>
          <span class="rounded px-3 py-1" :class="verbColors(entry.payload.level)">{{ entry.payload.level }}</span>
          <span class="ml-4 font-bold text-gray-900 dark:text-white">{{entry.payload.args.find((arg:
            any) => typeof arg == 'string') ||
            entry.payload.args[0]}}</span>
        </p>
        <p class="mt-4 text-gray-900 dark:text-white">
          <span class="font-bold mr-2">Executed At:</span>
          <span>{{ date.toHTTP() }} ({{ date.toRelative() }})</span>
        </p>
      </div>
    </template>

    <p class="font-bold text-gray-900 dark:text-white mr-4">Args:</p>
    <CopyToClipboard :data="entry.payload.args" />
  </Card>
</template>