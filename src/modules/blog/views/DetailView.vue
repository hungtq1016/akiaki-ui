<template>
  <div>
    <div
      class="capitalize bg-cerulean-600 text-sm w-fit font-medium text-center rounded text-white py-4 px-4 mb-7.5"
    >
      {{ $t(String(blog?.category?.title)) }}
    </div>
    <div class="flex items-center my-4 flex-nowrap">
      <span class="relative mr-3">{{ $t('content.share') }}:</span>
      <ul class="flex gap-x-2">
        <li>
          <a target="_blank" :href="`https://www.facebook.com/sharer/sharer.php?u=${url}&amp;src=sdkpreparse`" class="fb-xfbml-parse-ignore">

            <SVGFacebook class="w-5 h-5 fill-cerulean-400" />
          </a>
        </li>
        <li>
          <a
            class="inline-block"
            :href="`https://twitter.com/share?url=${url}&amp;text=Hi%20everyone,%20please%20check%20this%20out:%20`"
            target="_blank"
          >
            <SVGTwitterX class="w-5 h-5" />
          </a>
        </li>
        <li>
          <button class="inline-block" style="cursor: pointer" @click="copyToClipboard">
            <ShareIcon class="w-5 h-5 text-gray-600" />
          </button>
        </li>
      </ul>
    </div>
    <h1 class="text-2xl font-bold mb-7 text-cerulean-600 capitalize">{{ blog?.title }}</h1>
    <div class="w-full h-[500px]">
      <img
        class="w-full rounded-[5px] h-full object-cover"
        :src="imageBuilderUrl(blog.imageUrl)"
        :alt="blog.title"
      />
    </div>
    <div class="py-5">
      <h4 class="text-base leading-6 font-semibold italic text-gray-900 pb-2.5 text-justify">
        {{ blog?.desc }}
      </h4>
    </div>
    <div class="py-5" v-html="blog.content" />
    <div class="py-5 flex justify-center" v-html="blog.videoEmbed"></div>
    <DetailContact />
    <CommentView :blog-id="blog.id" />
    <RelateView :slug="blog?.category?.slug" />
  </div>
</template>

<script setup lang="ts">
import SVGFacebook from '@/core/components/svg/SVG.facebook.vue'
import { useRoute, useRouter } from 'vue-router'
import { ShareIcon } from '@heroicons/vue/24/outline'
import SVGTwitterX from '@/core/components/svg/SVG.twitter.x.vue'
import DetailContact from '../components/Detail.contact.vue'
import RelateView from './RelateView.vue'
import { onMounted, ref, type Ref } from 'vue'
import type { TBlogResponse } from '@/modules/admin-blog/models/type'
import { get } from '@/core/services/helpers/fetcher.helper'
import { imageBuilderUrl } from '@/core/services/utils/util.string'
import CommentView from './CommentView.vue'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const url = new URL(window.location.href)
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(String(url))
    Swal.fire({
            title: 'Thành công!',
            text: `Copied: ${String(url)}`,
            icon: 'success',
            confirmButtonText: 'OK'
        })
  } catch ($e) {
    Swal.fire({
            title: 'Error',
            text: 'Something gone wrong',
            icon: 'error',
            confirmButtonText: 'Confirm'
        })
  }
}

const blog: Ref<TBlogResponse> = ref({} as TBlogResponse)

onMounted(() => {
  get<TBlogResponse>('/api/blogs/slug/' + route.params.slug).then((res) => {
    if (res?.data) {
      blog.value = res.data
    }else{
      router.push('/blogs')
    }
  })
})
</script>
