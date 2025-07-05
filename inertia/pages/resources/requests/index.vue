<script lang="ts" setup>
import { Entry } from '#monitor/types';

const { pagination } = defineProps<{
  pagination: Entry<'request'>,
}>()
</script>

<template>
  <div>
    <div v-for="(entry, id) in pagination" :key="id">
      <pre>{{ entry }}</pre>
    </div>
  </div>
</template>
