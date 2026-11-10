<script setup lang="ts">
/**
 * Botón hamburguesa + panel lateral para móvil/tablet.
 * Los enlaces llegan por slot desde Astro (con sus iconos ya renderizados).
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const open = ref(false);
const toggleBtn = ref<HTMLButtonElement | null>(null);

function close() {
  open.value = false;
}

function onPanelClick(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('a')) close();
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    close();
    toggleBtn.value?.focus();
  }
}

watch(open, (value) => {
  document.documentElement.style.overflow = value ? 'hidden' : '';
});

onMounted(() => document.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown);
  document.documentElement.style.overflow = '';
});
</script>

<template>
  <button
    ref="toggleBtn"
    type="button"
    class="inline-flex size-11 items-center justify-center rounded-lg border border-gold-500/40 text-gold-300 transition hover:bg-white/10"
    :aria-expanded="open"
    aria-controls="mobile-menu"
    :aria-label="open ? 'Cerrar menú' : 'Abrir menú'"
    @click="open = !open"
  >
    <svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path v-if="!open" d="M4 6h16M4 12h16M4 18h16" />
      <path v-else d="M18 6 6 18M6 6l12 12" />
    </svg>
  </button>

  <Transition name="backdrop">
    <div v-if="open" class="fixed inset-0 z-40 bg-navy-950/60" aria-hidden="true" @click="close" />
  </Transition>

  <nav
    id="mobile-menu"
    aria-label="Menú principal"
    class="fixed top-0 right-0 z-50 flex h-dvh w-[min(85vw,320px)] flex-col bg-navy-900 shadow-2xl transition-[transform,visibility] duration-300"
    :class="open ? 'translate-x-0' : 'invisible translate-x-full'"
    @click="onPanelClick"
  >
    <div class="flex items-center justify-between border-b border-white/10 px-5 py-4">
      <span class="font-display text-lg font-semibold tracking-wide text-gold-300">Menú</span>
      <button
        type="button"
        class="inline-flex size-10 items-center justify-center rounded-lg text-white/80 hover:bg-white/10"
        aria-label="Cerrar menú"
        @click="close"
      >
        <svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="flex-1 overflow-y-auto p-3">
      <slot />
    </div>
  </nav>
</template>

<style scoped>
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}
</style>
