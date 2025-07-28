<script setup lang="ts">
import { DateTime } from 'luxon';
import { computed, ref } from 'vue';
import string from '@adonisjs/core/helpers/string'
import Card from '~/components/Card.vue';
import { MonitorEntryPageProps } from '~/types';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { formatHandler } from '~/helpers';
import { middleware } from '#start/kernel';
import { HandlerInfo } from '#monitor/types';

const { entry } = defineProps<MonitorEntryPageProps>()
const $toast = useToast();

const selected = ref(0)

const date = computed(() => DateTime.fromISO(entry.ts))
const currentData = computed(() => {
  switch (selected.value) {
    case 0: return entry.payload.request.body;
    case 1: return entry.payload.request.headers;
    case 2: return {
      queryStringParams: entry.payload.request.qs,
      routeParams: entry.payload.request.params,
    };
    case 3: return entry.payload.response.body;
  }
})

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(currentData.value, undefined, 2))
    $toast.success('Copied to clipboard!')
  } catch (e) {
    $toast.error('Failed to copy to clipboard', e)
  }
}

const verbColors = (verb: string) => ({
  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': verb == 'GET',
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': verb == 'POST',
  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300': verb == 'PUT',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': verb == 'PATCH',
  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': verb == 'DELETE',
  'border-green-700 bg-green-400': verb == 'HEAD',
  'border-gray-300 bg-gray-100': verb == 'OPTIONS',
})

const statusColors = (status: number) => ({
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': (status >= 100 && status < 200) || (status >= 300 && status < 400),
  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': status >= 200 && status < 300,
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': status >= 400 && status < 500,
  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': status >= 500,
})

const selectors = ['Payload', 'Headers', 'Params', 'Response']
</script>

<template>
  <Card class="mb-6">
    <template #title>
      <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Request Data</p>
    </template>

    <table class="dark:text-gray-200 w-full">
      <tbody class="text-align-start">
        <tr>
          <td class="font-bold px-4 py-2">Request ID</td>
          <td>{{ entry.payload.request.id }}</td>
        </tr>
        <tr>
          <td class="font-bold px-4 py-2">Executed At</td>
          <td>{{ date.toHTTP() }} ({{ date.toRelative() }})</td>
        </tr>
        <tr>
          <td class="font-bold px-4 py-2">Method</td>
          <td>
            <span class="rounded px-3 py-1" :class="verbColors(entry.payload.request.method)">
              {{ entry.payload.request.method }}
            </span>
          </td>
        </tr>
        <template v-if="!!entry.payload.route">
          <tr>
            <td class="font-bold px-4 py-2">Method</td>
            <td>{{ formatHandler(entry.payload.route?.handler) }}</td>
          </tr>
          <tr>
            <td class="font-bold px-4 py-2">Middleware</td>
            <td>{{entry.payload.route?.middleware.map((middleware: HandlerInfo) => formatHandler(middleware)).join(', ')
            }}</td>
          </tr>
        </template>
        <tr>
          <td class="font-bold px-4 py-2">Route</td>
          <td>{{ entry.payload.request.url }}</td>
        </tr>
        <tr>
          <td class="font-bold px-4 py-2">Status</td>
          <td>
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
              :class="statusColors(entry.payload.response.status)">
              {{ entry.payload.response.status }}
            </span>
          </td>
        </tr>
        <tr>
          <td class="font-bold px-4 py-2">Duration</td>
          <td>{{ string.prettyHrTime(entry.payload.duration) }}</td>
        </tr>
        <tr>
          <td class="font-bold px-4 py-2">Ip{{ entry.payload.request.ips.length > 1 ? 's' : '' }}</td>
          <td>{{ entry.payload.request.ips.join(', ') }}</td>
        </tr>
      </tbody>
    </table>
  </Card>

  <Card v-if="!!entry.payload.user">
    <template #title>
      <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Authenticated User</p>
    </template>

    <table class="dark:text-gray-200 w-full">
      <tbody class="text-align-start">
        <tr>
          <td class="font-bold px-4 py-2">User id</td>
          <td>{{ entry.payload.user.id }}</td>
        </tr>
        <tr>
          <td class="font-bold px-4 py-2">Guard</td>
          <td>{{ entry.payload.user.guard }}</td>
        </tr>
      </tbody>
    </table>
  </Card>

  <Card>
    <template #title>
      <div class="text-lg font-bold dark:text-white cursor-pointer hover:text-blue-950"
        v-for="(selector, id) in selectors" :key="id"
        :class="{ 'underline dark:border-blue-950 text-blue-950': selected == id }" @click="selected = id">{{ selector
        }}</div>
    </template>

    <div class="w-full relative">
      <div @click="copyToClipboard"
        class="dark:text-white w-8 h-8 absolute top-0 right-2 cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-600 rounded z-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      </div>
      <VueJsonPretty :data="currentData" class="w-full dark:text-white mb-2 mx-2" />
    </div>
  </Card>
</template>