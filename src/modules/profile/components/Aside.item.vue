<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <li>
    <router-link
      :to="data.slug"
      class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-cerulean-100 hover:text-cerulean-600 dark:hover:bg-gray-700 group"
    >
      <component :is="data.icon" class="w-5 h-5" />
      <span class="ms-3">{{ $t(String(data?.label)) }}</span>
    </router-link>
  </li>
</template>

<script setup lang="ts">

defineProps<{
  data: any
}>()
</script>

<style scoped>
.router-link-active.router-link-exact-active{
  @apply bg-cerulean-100 text-cerulean-600
}
</style>