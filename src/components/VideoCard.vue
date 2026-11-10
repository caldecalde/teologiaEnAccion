<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { openVideo, player } from '../stores/player';
import { youtubeThumb } from '../data/videos';

const props = defineProps<{
  youtubeId: string;
  title: string;
  serie?: string;
}>();

const state = useStore(player);
const isPlaying = computed(() => state.value.videoId === props.youtubeId);
const thumb = computed(() => youtubeThumb(props.youtubeId));

function play(event: MouseEvent) {
  openVideo(props.youtubeId, props.title, event.currentTarget as HTMLElement);
}
</script>

<template>
  <article
    class="group overflow-hidden rounded-card bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
  >
    <button
      type="button"
      class="relative block aspect-video w-full cursor-pointer overflow-hidden bg-navy-900"
      :aria-label="`Reproducir video: ${title}`"
      @click="play"
    >
      <img
        :src="thumb"
        :alt="''"
        width="480"
        height="360"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
      />
      <span class="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent" />
      <span
        class="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold-500/95 text-navy-900 shadow-lg ring-4 ring-white/25 transition duration-300 group-hover:scale-110"
      >
        <svg viewBox="0 0 24 24" class="ml-1 size-7" fill="currentColor" aria-hidden="true">
          <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
        </svg>
      </span>
      <span
        v-if="isPlaying"
        class="absolute top-3 left-3 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-navy-900"
      >
        Reproduciendo
      </span>
    </button>
    <div class="p-5">
      <p v-if="serie" class="text-xs font-semibold tracking-wider text-gold-500 uppercase">{{ serie }}</p>
      <h3 class="mt-1 text-lg leading-snug font-semibold text-navy-900">{{ title }}</h3>
    </div>
  </article>
</template>
