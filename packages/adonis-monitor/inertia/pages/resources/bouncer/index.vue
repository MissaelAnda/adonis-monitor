<script setup lang="ts">
import ExecutedAt from '../../../components/ExecutedAt.vue';
import ResourceIndex, { Fields } from '../../../components/ResourceIndex.vue';
import { MonitorIndexPageProps } from '../../../types';

const { entries } = defineProps<MonitorIndexPageProps>()

const fields: Fields = [
  { name: 'user', title: 'User' },
  { name: 'action', title: 'Action' },
  { name: 'result', title: 'Result' },
  { name: 'ts', title: 'Executed At' },
]
</script>

<template>
  <ResourceIndex :fields :pagination :entries>
    <template #user="{ entry }">{{ entry.payload.user?.id || 'Unauthenticated' }}</template>
    <template #action="{ entry }">{{ entry.payload.action || 'Anonymous ability' }}</template>
    <template #result="{ entry }">
      <span class="font-lg text-green-200 bg-green-600 rounded px-2 py-1"
        :class="{ 'text-red-100 bg-red-700': !entry.payload.response.authorized }">{{
          entry.payload.response.authorized ? 'Allowed' : 'Denied' }}
      </span>
    </template>
    <template #ts="{ entry }">
      <ExecutedAt :ts="entry.ts" />
    </template>
  </ResourceIndex>
</template>