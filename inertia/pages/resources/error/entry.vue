<script setup lang="ts">
import { DateTime } from 'luxon';
import { computed, ref } from 'vue';
import Card from '~/components/Card.vue';
import CopyToClipboard from '~/components/CopyToClipboard.vue';
import { MonitorEntryPageProps } from '~/types';

const { entry } = defineProps<MonitorEntryPageProps>()

const date = computed(() => DateTime.fromISO(entry.ts))
const fixedAt = computed(() => !!entry.payload.resolvedAt ? DateTime.fromISO(entry.payload.resolvedAt) : null)

const stackTrace = computed(() => entry.payload.error.stack.split('\n').slice(1))

const selected = ref(0)
const selectors = ['Message', 'Stack Trace']
</script>

<template>
  <Card>
    <template #title>
      <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Error info</p>
    </template>

    <table class="dark:text-gray-200 w-full">
      <tbody class="text-align-start">
        <tr>
          <td class="font-bold px-4 py-2">Occurred At</td>
          <td>{{ date.toHTTP() }} ({{ date.toRelative() }})</td>
        </tr>
        <tr v-if="!!entry.payload.error?.class">
          <td class="font-bold px-4 py-2">Error type</td>
          <td>{{ entry.payload.error.class }}</td>
        </tr>
        <tr v-if="!!entry.payload.error?.code">
          <td class="font-bold px-4 py-2">Error code</td>
          <td>{{ entry.payload.error.code }}</td>
        </tr>
        <tr v-if="!!entry.payload.error?.status">
          <td class="font-bold px-4 py-2">Error status</td>
          <td>
            <span class="bg-red-100 text-red-200 dark:bg-red-900 dark:text-red-300 rounded px-3 py-1">
              {{ entry.payload.error.status }}
            </span>
          </td>
        </tr>
        <tr>
          <td colspan="2" v-if="!fixedAt">
            <button class="my-1 ml-3 font-bold px-4 py-2 bg-blue-700 rounded cursor-pointer dark:text-white">Mark as
              fixed</button>
          </td>
          <template v-else>
            <td class="font-bold px-4 py-2">Fixed At</td>
            <td>{{ fixedAt.toHTTP() }} ({{ fixedAt.toRelative() }})</td>
          </template>
        </tr>
      </tbody>
    </table>
  </Card>

  <Card class="mt-4">
    <template #title>
      <div class="text-lg font-bold dark:text-white cursor-pointer hover:text-blue-950 px-8"
        v-for="(selector, id) in selectors" :key="id"
        :class="{ 'underline dark:border-blue-950 text-blue-950': selected == id }" @click="selected = id">
        {{ selector }}
      </div>
    </template>

    <p v-if="selected == 0" class="font-bold text-red-900 ">{{ entry.payload.message }}</p>

    <table v-else-if="selected == 1" class="w-full font-bold text-red-900 ">
      <tbody>
        <tr v-for="(trace, i) in stackTrace">
          <td class="border-gray-300 px-3 py-2" :class="{ 'border-b': i + 1 != stackTrace.length }">{{ trace.trim() }}</td>
        </tr>
      </tbody>
    </table>

    <!-- TODO: extract a fragment of the code where the error was thrown if code is not bundled -->
  </Card>
</template>