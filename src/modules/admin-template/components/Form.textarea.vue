<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <label class="text-black-900 mb-3 block text-sm font-medium dark:text-gray-50">
      <slot>
        {{ $t('form.default_title') }}
      </slot>
    </label>
    <textarea
      rows="6"
      v-model="model"
      :disabled="disabled"
      :placeholder="placeholder"
      :class="{ '!border-red-600': hasError }"
      class="dark:border-zinc-950 dark:bg-zinc-900 dark:text-gray-50 text-gray-900 w-full rounded-lg border border-gray-100 bg-transparent px-5 py-3 font-normal outline-none transition disabled:cursor-default disabled:!bg-gray-100 disabled:!text-gray-600 dark:disabled:!bg-stone-950 dark:disabled:!text-gray-50"
    >
    </textarea>
  </div>
</template>

<script setup lang="ts">
import { i18n } from '@/core/services/base/translation'
import type { ModelRef } from 'vue'

defineProps({
  hasError: {
    type: Boolean,
    default: false,
    required: false
  },
  disabled: {
    type: Boolean,
    default: false,
    required: false
  },
  placeholder: {
    type: String,
    default: i18n.global.t('form.place_holder.default'),
    required: false
  }
})

const model: ModelRef<string> = defineModel({ required: true })
</script>
