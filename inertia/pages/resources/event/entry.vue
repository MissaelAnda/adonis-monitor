<script setup lang="ts">
import { HandlerInfo } from '#monitor/types';
import { DateTime } from 'luxon';
import { computed } from 'vue';
import Card from '~/components/Card.vue';
import CopyToClipboard from '~/components/CopyToClipboard.vue';
import { formatHandler } from '~/helpers';
import { MonitorEntryPageProps } from '~/types';

const { entry } = defineProps<MonitorEntryPageProps>()

const date = computed(() => DateTime.fromISO(entry.ts))
</script>

<template>
  <Card>
    <template #title>
      <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Event:<span
          class="ml-3 dark:text-blue-950 text-blue-300">{{ entry.payload.event ||
            'Anonymous ability' }}</span></p>
    </template>

    <div class="w-full">
      <div class="w-full px-2 py-3 flex-1 font-bold text-gray-900 dark:text-white"
        v-if="entry.payload.listeners.length > 0">
        <span class="mr-3">Listeners:</span>
        <div>
          {{entry.payload.listeners.map((listener: HandlerInfo) => formatHandler(listener)).join(', ')}}
        </div>
      </div>
      <p class="px-2 font-bold text-gray-900 dark:text-white" v-else>This event has no listeners</p>

      <p class="px-2 my-3 font-bold text-gray-900 dark:text-white mb-4">{{ date.toHTTP() }} ({{ date.toRelative() }})
      </p>

      <CopyToClipboard class="bg-gray-300 dark:bg-gray-700 rounded py-1" :data="entry.payload.data" />
    </div>
  </Card>
</template>