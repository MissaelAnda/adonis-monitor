<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { EllipsisVertical, Trash } from 'lucide-vue-next';
import { onMounted, onUnmounted, ref } from 'vue';

const { link } = defineProps<{ link: string }>()

const emit = defineEmits(['deleted'])

const active = ref(false)
const handleClickOutside = (event: Event) => {
  // @ts-ignore
  if (active.value && !event.target!.closest('.relative')) {
    active.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))
</script>

<template>
  <button class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer"
    @click="active = !active" @keydown.escape="active = false">
    <div class="w-4 h-4">
      <EllipsisVertical :size="18" />
    </div>
  </button>

  <div v-if="active"
    class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-50 overflow-hidden">
    <div class="py-1">
      <Link as="button" :href="link" @finish="emit('deleted')" method="delete"
        class="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer">
      <div class="w-4 h-4 mr-3">
        <Trash :size="18" />
      </div>
      Delete
      </Link>
    </div>
  </div>
</template>