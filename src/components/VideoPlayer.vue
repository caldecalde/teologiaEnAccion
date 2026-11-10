<script setup lang="ts">
/**
 * Reproductor global de YouTube. Vive en el layout con `transition:persist`,
 * así que sigue sonando al navegar entre páginas.
 *
 * Modal ↔ mini se cambia solo con clases CSS sobre el MISMO contenedor:
 * el iframe nunca se desmonta, por lo que el video no se reinicia al minimizar.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useStore } from '@nanostores/vue';
import { closeVideo, expandVideo, minimizeVideo, player } from '../stores/player';

// Astro pasa `data-astro-transition-persist` como prop; si Vue lo hereda en el <div> raíz,
// habría dos elementos con el mismo id de persistencia y la navegación fallaría.
defineOptions({ inheritAttrs: false });

const state = useStore(player);
const dialog = ref<HTMLElement | null>(null);
const closeBtn = ref<HTMLButtonElement | null>(null);

const isOpen = computed(() => state.value.mode !== 'closed' && !!state.value.videoId);
const isModal = computed(() => state.value.mode === 'modal');
const embedUrl = computed(() =>
  state.value.videoId
    ? `https://www.youtube-nocookie.com/embed/${state.value.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    : '',
);

watch(isModal, async (modal) => {
  document.documentElement.style.overflow = modal ? 'hidden' : '';
  if (modal) {
    await nextTick();
    closeBtn.value?.focus();
  }
});

function onKeydown(e: KeyboardEvent) {
  if (!isModal.value) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    closeVideo();
    return;
  }

  // Mantiene el foco dentro del modal.
  if (e.key === 'Tab' && dialog.value) {
    const focusables = dialog.value.querySelectorAll<HTMLElement>('button, iframe');
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

// Al navegar a otra página con el modal abierto, se pasa a modo mini.
function onNavigate() {
  if (isModal.value) minimizeVideo();
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown);
  document.addEventListener('astro:before-preparation', onNavigate);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown);
  document.removeEventListener('astro:before-preparation', onNavigate);
  document.documentElement.style.overflow = '';
});
</script>

<template>
  <div v-if="isOpen">
    <Transition name="fade">
      <div
        v-if="isModal"
        class="fixed inset-0 z-[90] bg-navy-950/85 backdrop-blur-sm"
        aria-hidden="true"
        @click="closeVideo"
      />
    </Transition>

    <div
      ref="dialog"
      :role="isModal ? 'dialog' : 'region'"
      :aria-modal="isModal ? 'true' : undefined"
      :aria-label="`Video: ${state.title}`"
      class="player fixed z-[100] overflow-hidden bg-black shadow-2xl"
      :class="isModal ? 'player--modal' : 'player--mini'"
    >
      <div class="flex items-center gap-2 bg-navy-900 px-3 py-2 text-white">
        <p class="min-w-0 flex-1 truncate text-sm font-medium">{{ state.title }}</p>
        <button
          v-if="isModal"
          type="button"
          class="ctrl"
          aria-label="Minimizar video"
          title="Minimizar"
          @click="minimizeVideo"
        >
          <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />
          </svg>
        </button>
        <button v-else type="button" class="ctrl" aria-label="Expandir video" title="Expandir" @click="expandVideo">
          <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>
        <button ref="closeBtn" type="button" class="ctrl" aria-label="Cerrar video" title="Cerrar" @click="closeVideo">
          <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="aspect-video w-full">
        <iframe
          :key="state.videoId ?? ''"
          :src="embedUrl"
          :title="state.title"
          class="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.player {
  transition:
    width 0.3s ease,
    left 0.3s ease,
    right 0.3s ease,
    bottom 0.3s ease,
    transform 0.3s ease,
    border-radius 0.3s ease;
}

.player--modal {
  top: 50%;
  left: 50%;
  width: min(92vw, 960px);
  transform: translate(-50%, -50%);
  border-radius: 0.75rem;
}

/* Mini en móvil: anclado abajo a lo ancho. */
.player--mini {
  left: 0.5rem;
  right: 0.5rem;
  bottom: 0.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 0 0 2px var(--color-gold-500), 0 20px 40px -10px rgb(0 0 0 / 0.5);
}

/* Mini en tablet/PC: esquina inferior derecha. */
@media (min-width: 640px) {
  .player--mini {
    left: auto;
    right: 1.25rem;
    bottom: 1.25rem;
    width: 360px;
  }
}

.ctrl {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  padding: 0.375rem;
  color: var(--color-gold-300);
  cursor: pointer;
  transition: background-color 0.2s;
}

.ctrl:hover {
  background-color: rgb(255 255 255 / 0.12);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
