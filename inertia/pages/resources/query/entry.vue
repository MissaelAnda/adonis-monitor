<script setup lang="ts">
import { MonitorPageProps } from '~/types';

const { entry } = defineProps<MonitorPageProps>()
</script>

<template>
  <pre>{{ entry }}</pre>
</template>