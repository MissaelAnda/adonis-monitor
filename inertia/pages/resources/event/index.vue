<script setup lang="ts">
import { DateTime } from 'luxon';
import ResourceIndex, { Fields } from '~/components/ResourceIndex.vue';
import Tooltip from '~/components/Tooltip.vue';
import { MonitorPageProps } from '~/types';

defineProps<MonitorPageProps>()

const fields: Fields = [
  { name: 'event', title: 'Event' },
  { name: 'listeners', title: 'Listeners' },
  { name: 'ts', title: 'Executed At' },
]
</script>

<template>
  <ResourceIndex :fields :pagination :entries>
    <template #event="{ entry }">{{ entry.payload.event }}</template>
    <template #listeners="{ entry }">{{ entry.payload.listeners.length }}</template>
    <template #ts="{ entry }">
      <Tooltip>
        <span>{{ DateTime.fromISO(entry.ts).toRelative({ style: 'short' }) }}</span>
        <template #tooltip>{{ DateTime.fromISO(entry.ts).toFormat('yyyy-LL-dd HH:mm:ii ZZZZ') }}</template>
      </Tooltip>
    </template>
  </ResourceIndex>
</template>