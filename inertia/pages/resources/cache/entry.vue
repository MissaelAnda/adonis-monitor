<script setup lang="ts">
import { MonitorPageProps } from '~/types';

const { entry } = defineProps<MonitorPageProps>()
</script>

<template>
  <h1>Entry {{ entry!.id }}</h1>

  <pre>{{ entry }}</pre>
</template>