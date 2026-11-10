import { atom } from 'nanostores';

export type PlayerMode = 'closed' | 'modal' | 'mini';

export interface PlayerState {
  videoId: string | null;
  title: string;
  mode: PlayerMode;
}

export const player = atom<PlayerState>({ videoId: null, title: '', mode: 'closed' });

/** Elemento que abrió el reproductor, para devolverle el foco al cerrar. */
let opener: HTMLElement | null = null;

export function openVideo(videoId: string, title: string, trigger?: HTMLElement | null) {
  opener = trigger ?? null;
  player.set({ videoId, title, mode: 'modal' });
}

export function minimizeVideo() {
  player.set({ ...player.get(), mode: 'mini' });
}

export function expandVideo() {
  player.set({ ...player.get(), mode: 'modal' });
}

export function closeVideo() {
  player.set({ videoId: null, title: '', mode: 'closed' });
  if (opener?.isConnected) opener.focus();
  opener = null;
}
