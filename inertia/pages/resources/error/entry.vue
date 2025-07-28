<script setup lang="ts">
import { MonitorPageProps } from '~/types';

const { entry } = defineProps<MonitorPageProps>()
</script>

<template>
  <h1>Entry {{ entry!.id }}</h1>

  <pre>{{ JSON.stringify(entry, undefined, 2).replaceAll('\\n', '\n') }}</pre>
</template>