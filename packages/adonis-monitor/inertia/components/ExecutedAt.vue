<script setup lang="ts">
import { DateTime } from 'luxon';
import Tooltip from './Tooltip.vue';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const { ts } = defineProps<{ ts: string }>()

const timer = ref<NodeJS.Timeout | null>(null)
const keyRef = ref(1)

onMounted(() => timer.value = setInterval(() => { keyRef.value++ }, 1000 * 60)) // Update the diff every minute
onUnmounted(() => timer.value ? clearTimeout(timer.value) : null)

const date = computed(() => DateTime.fromISO(ts))
</script>

<template>
  <Tooltip :key="keyRef">
    <span>{{ date.toRelative({ style: 'short' }) }}</span>
    <template #tooltip>{{ date.toFormat('yyyy-LL-dd HH:mm:ii ZZZZ') }}</template>
  </Tooltip>
</template>