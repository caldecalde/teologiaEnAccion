export interface Video {
  /** ID del video de YouTube (lo que va después de `v=` en la URL). */
  youtubeId: string;
  title: string;
  serie?: string;
}

// TODO: reemplazar por los videos reales del canal.
export const videosDestacados: Video[] = [
  { youtubeId: 'ak06MSETeo4', title: '¿Qué es la Biblia?', serie: 'BibleProject (ejemplo)' },
  { youtubeId: 'GQI72THyO5I', title: 'Génesis (parte 1)', serie: 'BibleProject (ejemplo)' },
  { youtubeId: '3dEh25pduQ8', title: 'El Mesías', serie: 'BibleProject (ejemplo)' },
];

export function youtubeThumb(id: string, quality: 'hq' | 'maxres' = 'hq'): string {
  return `https://i.ytimg.com/vi/${id}/${quality}default.jpg`;
}
