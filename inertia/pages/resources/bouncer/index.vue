<script setup lang="ts">
import { DateTime } from 'luxon';
import ResourceIndex, { Fields } from '~/components/ResourceIndex.vue';
import Tooltip from '~/components/Tooltip.vue';
import { MonitorPageProps } from '~/types';

defineProps<MonitorPageProps>()

const fields: Fields = [
  { name: 'user', title: 'User' },
  { name: 'action', title: 'Action' },
  { name: 'result', title: 'Result' },
  { name: 'ts', title: 'Executed At' },
]
</script>

<template>
  <ResourceIndex :fields :pagination :entries>
    <template #user="{ entry }">{{ entry.payload.user.id }}</template>
    <template #action="{ entry }">{{ entry.payload.action }}</template>
    <template #result="{ entry }">{{ entry.payload.result.authorized ? 'Allowed' : 'Denied' }}</template>
    <template #ts="{ entry }">
      <Tooltip>
        <span>{{ DateTime.fromISO(entry.ts).toRelative({ style: 'short' }) }}</span>
        <template #tooltip>{{ DateTime.fromISO(entry.ts).toFormat('yyyy-LL-dd HH:mm:ii ZZZZ') }}</template>
      </Tooltip>
    </template>
  </ResourceIndex>
</template>