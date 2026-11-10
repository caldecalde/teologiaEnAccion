/**
 * Construye URLs de imagen para Cloudflare R2 + Image Transformations.
 *
 * - Con PUBLIC_IMG_BASE definido (p. ej. https://img.teologiaenaccion.org) las imágenes
 *   se sirven desde R2 redimensionadas por Cloudflare: /cdn-cgi/image/<opciones>/<ruta>.
 * - Sin PUBLIC_IMG_BASE se usan los archivos locales de public/img/fallback/<ruta>,
 *   así se puede desarrollar sin depender de Cloudflare.
 */

const IMG_BASE = (import.meta.env.PUBLIC_IMG_BASE ?? '').replace(/\/+$/, '');

export const DEFAULT_WIDTHS = [400, 800, 1200, 1600];

export interface CfImageOptions {
  width?: number;
  quality?: number;
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
}

const clean = (path: string) => path.replace(/^\/+/, '');

/** Los SVG no se redimensionan: se sirven tal cual. */
const isVector = (path: string) => path.toLowerCase().endsWith('.svg');

export function usesCloudflare(path: string): boolean {
  return IMG_BASE !== '' && !isVector(path);
}

export function cfImageUrl(path: string, { width, quality = 80, fit = 'cover' }: CfImageOptions = {}): string {
  const p = clean(path);

  if (!IMG_BASE) return `/img/fallback/${p}`;
  if (isVector(p)) return `${IMG_BASE}/${p}`;

  const opts = [width && `width=${width}`, `quality=${quality}`, `fit=${fit}`, 'format=auto']
    .filter(Boolean)
    .join(',');

  return `${IMG_BASE}/cdn-cgi/image/${opts}/${p}`;
}

export function cfImageSrcset(path: string, widths: number[] = DEFAULT_WIDTHS, opts: CfImageOptions = {}): string | undefined {
  if (!usesCloudflare(path)) return undefined;
  return widths.map((w) => `${cfImageUrl(path, { ...opts, width: w })} ${w}w`).join(', ');
}
