<template>
  <div class="bg-gray-200 dark:bg-gray-800 rounded-lg shadow">
    <div class="flex items-center justify-between bg-gray-300 dark:bg-gray-600 p-4 sm:p-6 rounded-t-lg">
      <slot name="title"></slot>
    </div>
    <div class="mt-2 sm:mt-4 flex items-center py-2 px-4">
      <slot></slot>
    </div>
  </div>
</template>