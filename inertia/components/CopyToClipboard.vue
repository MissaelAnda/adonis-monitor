<script setup lang="ts">
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

const $toast = useToast();

const { data } = defineProps<{ data: any }>()

const copyToClipboard = async () => {
  const dataToCopy = typeof data == 'object' ? JSON.stringify(data, undefined, 2) : data

  try {
    await navigator.clipboard.writeText(dataToCopy)
    $toast.success('Copied to clipboard!')
  } catch (e) {
    $toast.error('Failed to copy to clipboard', e)
  }
}
</script>

<template>
  <div class="w-full relative">
    <div @click="copyToClipboard"
      class="dark:text-white w-8 h-8 absolute top-0 right-2 cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-600 rounded z-10">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
    </div>
    <VueJsonPretty :data="data" class="w-full dark:text-white mb-2 mx-2" />
  </div>
</template>