<template>
  <div class="flex flex-col gap-10">
    <TableView
      v-bind:="{ headers, items, pagination, paginationOptions, fetch }"
      route="services"
      key="services"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { paginationOptions, headers } from '../services/data/service'
import { pagination, items, fetch } from '../services/logictics/service'
import TableView from '@/modules/admin/views/TableView.vue'

onMounted(async () => {
  await fetch()
})

</script>
