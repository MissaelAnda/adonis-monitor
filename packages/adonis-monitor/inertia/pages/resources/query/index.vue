<script setup lang="ts">
import string from '@adonisjs/core/helpers/string'
import { MonitorIndexPageProps } from '../../../types';
import ResourceIndex, { Fields } from '../../../components/ResourceIndex.vue';
import Tooltip from '../../../components/Tooltip.vue';
import ExecutedAt from '../../../components/ExecutedAt.vue';

defineProps<MonitorIndexPageProps>()

const fields: Fields = [
  { name: 'method', title: 'Method' },
  { name: 'sql', title: 'Query' },
  { name: 'duration', title: 'Duration' },
  { name: 'ts', title: 'Executed At' },
]
</script>

<template>
  <ResourceIndex :fields :pagination :entries>

    <template #method="{ entry }">{{ entry.payload.method.toUpperCase() }}</template>
    <template #sql="{ entry }">
      <Tooltip>
        <span class="truncate">{{ entry.payload.sql }}</span>
        <template #tooltip>{{ entry.payload.sql }}</template>
      </Tooltip>
    </template>
    <template #duration="{ entry }">{{ string.prettyHrTime(entry.payload.duration) }}</template>
    <template #ts="{ entry }">
      <ExecutedAt :ts="entry.ts" />
    </template>
  </ResourceIndex>
</template>