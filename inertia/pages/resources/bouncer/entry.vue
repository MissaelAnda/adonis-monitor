<script setup lang="ts">
import { DateTime } from 'luxon';
import { computed } from 'vue';
import Card from '~/components/Card.vue';
import CopyToClipboard from '~/components/CopyToClipboard.vue';
import { MonitorEntryPageProps } from '~/types';

const { entry } = defineProps<MonitorEntryPageProps>()

const date = computed(() => DateTime.fromISO(entry.ts))
</script>

<template>
  <Card>
    <template #title>
      <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Action:<span
          class="ml-3 dark:text-blue-950 text-blue-300">{{ entry.payload.action ||
            'Anonymous ability' }}</span></p>
    </template>

    <table class="dark:text-gray-200 w-full">
      <tbody class="text-align-start">
        <tr>
          <td class="font-bold px-4 py-2">User</td>
          <td>{{ entry.payload.user?.id || 'Unauthenticated.' }}</td>
        </tr>
        <tr>
          <td class="font-bold px-4 py-2">Result</td>
          <td>
            <span class="font-lg text-green-200 bg-green-600 rounded px-2 py-1"
              :class="{ 'text-red-100 bg-red-700': !entry.payload.response.authorized }">{{
                entry.payload.response.authorized ? 'Allowed' : 'Denied' }}
            </span>
          </td>
        </tr>
        <tr v-if="!!entry.payload.response.message">
          <td class="font-bold px-4 py-2">Message</td>
          <td>{{ entry.payload.response.message }}</td>
        </tr>
        <tr v-if="!!entry.payload.response.status">
          <td class="font-bold px-4 py-2">Status Code</td>
          <td>{{ entry.payload.response.status }}</td>
        </tr>
        <tr>
          <td class="font-bold px-4 py-2">Executed At</td>
          <td>{{ date.toHTTP() }} ({{ date.toRelative() }})</td>
        </tr>
      </tbody>
    </table>
  </Card>

  <Card class="mt-4">
    <template #title>
      <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Parameters</p>
    </template>

    <CopyToClipboard :data="entry.payload.parameters" />
  </Card>
</template>