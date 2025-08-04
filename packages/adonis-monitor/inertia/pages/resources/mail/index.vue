<script setup lang="ts">
import { DateTime } from 'luxon';
import { MonitorIndexPageProps } from '../../../types';
import ResourceIndex, { Fields } from '../../../components/ResourceIndex.vue';
import Tooltip from '../../../components/Tooltip.vue';

defineProps<MonitorIndexPageProps>()

const fields: Fields = [
  { name: 'ts', title: 'Executed At' },
]
</script>

<template>
  <ResourceIndex :fields :pagination :entries>
    <template #ts="{ entry }">
      <Tooltip>
        <span>{{ DateTime.fromISO(entry.ts).toRelative({ style: 'short' }) }}</span>
        <template #tooltip>{{ DateTime.fromISO(entry.ts).toFormat('yyyy-LL-dd HH:mm:ii ZZZZ') }}</template>
      </Tooltip>
    </template>
  </ResourceIndex>
</template>