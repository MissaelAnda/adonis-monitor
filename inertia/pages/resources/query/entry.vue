<script setup lang="ts">
import Card from '~/components/Card.vue';
import string from '@adonisjs/core/helpers/string'
import { MonitorEntryPageProps } from '~/types';
import { computed, ref } from 'vue';
import { DateTime } from 'luxon';
import CopyToClipboard from '~/components/CopyToClipboard.vue';
import Boolean from '~/components/Boolean.vue';

const { entry } = defineProps<MonitorEntryPageProps>()

const date = computed(() => DateTime.fromISO(entry.ts))

const selected = ref(0)

const currentData = computed(() => {
  switch (selected.value) {
    case 0: return entry.payload.sql;
    case 1: return entry.payload.bindings;
    case 2: return entry.payload.options;
  }
})

const selectors = ['Query', 'Bindings', 'Options']
</script>

<template>
  <Card>
    <template #title>
      <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Query Info</p>
    </template>

    <table class="dark:text-gray-200 w-full">
      <tbody class="text-align-start">
        <tr>
          <td class="font-bold px-4 py-2">Knex ID</td>
          <td>{{ entry.payload.__knexUid }}</td>
        </tr>
        <tr>
          <td class="font-bold px-4 py-2">Knex Query ID</td>
          <td>{{ entry.payload.__knexQueryUid }}</td>
        </tr>
        <tr>
          <td class="font-bold px-4 py-2">Executed At</td>
          <td>{{ date.toHTTP() }} ({{ date.toRelative() }})</td>
        </tr>
        <tr>
          <td class="font-bold px-4 py-2">Connection</td>
          <td>{{ entry.payload.connection }}</td>
        </tr>
        <tr>
          <td class="font-bold px-4 py-2">Driver</td>
          <td>{{ entry.payload.driver }}</td>
        </tr>
        <tr>
          <td class="font-bold px-4 py-2">Inside transaction</td>
          <td>
            <Boolean :bool="entry.payload.inTransaction" />
          </td>
        </tr>
        <tr>
          <td class="font-bold px-4 py-2">Timed out</td>
          <td>
            <Boolean :bool="entry.payload.timeout" />
          </td>
        </tr>
        <tr>
          <td class="font-bold px-4 py-2">Model</td>
          <td>{{ entry.payload.model }}</td>
        </tr>
        <tr>
          <td class="font-bold px-4 py-2">Duration</td>
          <td>{{ string.prettyHrTime(entry.payload.duration) }}</td>
        </tr>
      </tbody>
    </table>
  </Card>

  <Card class="mt-8">
    <template #title>
      <div class="text-lg font-bold dark:text-white cursor-pointer hover:text-blue-950 px-8"
        v-for="(selector, id) in selectors" :key="id"
        :class="{ 'underline dark:border-blue-950 text-blue-950': selected == id }" @click="selected = id">
        {{ selector }}
      </div>
    </template>

    <CopyToClipboard :data="currentData" />
  </Card>
</template>