<script setup lang="ts">
import { CheckCircle, CircleDot, XCircle } from 'lucide-vue-next'

defineProps<{ bool?: boolean | null }>()
</script>

<template>
  <div v-if="bool === true" class="text-green-300">
    <CheckCircle />
  </div>
  <div v-else-if="bool === false" class="text-red-500">
    <XCircle />
  </div>
  <div v-else>
    <CircleDot />
  </div>
</template>