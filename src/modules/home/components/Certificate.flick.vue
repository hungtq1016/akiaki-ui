<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="py-5 md:py-10 md:px-5">
    <Flicking :options="slickOptions" :plugins="plugins">
      <CertificateItem v-for="(data, index) in certificates" :key="index" :data="data" />
      <template #viewport>
        <span class="flicking-arrow-prev before:!bg-cerulean-600 before:hover:!bg-cerulean-500 after:!bg-cerulean-600 after:hover:!bg-cerulean-500"></span>
        <span class="flicking-arrow-next before:!bg-cerulean-600 before:hover:!bg-cerulean-500 after:!bg-cerulean-600 after:hover:!bg-cerulean-500"></span>
      </template>
    </Flicking>
  </div>
</template>

<script setup lang="ts">
import '@egjs/flicking-plugins/dist/arrow.css'

import Flicking from '@egjs/vue3-flicking'
import { certificates as data } from '../services/data/data'
import { Arrow } from '@egjs/flicking-plugins'
import { slickOptions } from '../services/data/options'
import CertificateItem from './Certificate.item.vue'
import { onMounted, ref } from 'vue'
import type { TUrl, TGroupUrlResponse } from '@/modules/admin-branch/models/type'
import { get } from '@/core/services/helpers/fetcher.helper'

const plugins = [new Arrow()]

const certificates = ref<TUrl[]>(data.value)

onMounted(() => {
  get<TGroupUrlResponse>('/api/groupurls/label/certificate').then((res) => {
    if (res?.data) {
      certificates.value = res.data.urls
    }
  })
})
</script>
