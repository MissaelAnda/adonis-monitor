<template>
  <div class="relative inline-flex group">
    <span class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
      <slot></slot>
    </span>

    <div class="
    absolute z-[10000] hidden group-hover:flex
    min-w-[100px] max-w-[min(95vw,400px)] 
    px-3 py-2 text-sm rounded-md shadow-lg
    bg-gray-100 dark:bg-gray-700 
    text-gray-800 dark:text-gray-200
    border border-gray-200 dark:border-gray-600
    transition-opacity duration-200
    bottom-full left-1/2 -translate-x-1/2 mb-2
    before:absolute before:content-[''] 
    before:top-full before:left-1/2 before:-translate-x-1/2
    before:w-3 before:h-3 before:rotate-45
    before:bg-gray-100 dark:before:bg-gray-700
    before:border-r before:border-b
    before:border-gray-200 dark:before:border-gray-600
  ">
      <div class="whitespace-normal break-words">
        <slot name="tooltip"></slot>
      </div>
    </div>
  </div>
</template>