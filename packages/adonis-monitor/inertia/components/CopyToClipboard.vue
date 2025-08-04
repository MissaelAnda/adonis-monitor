<script setup lang="ts">
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { Copy } from 'lucide-vue-next';

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
      <Copy :size="30" />
    </div>
    <VueJsonPretty :data="data" class="w-full dark:text-white mb-2 mx-2" />
  </div>
</template>