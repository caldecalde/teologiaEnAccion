import { nav, type IconName } from '../config/site';

export interface Seccion {
  title: string;
  description: string;
  href: string;
  icon: IconName;
  /** Ruta relativa dentro del bucket R2 (o de public/img/fallback). */
  image: string;
  imageAlt: string;
}

const detalles: Record<string, Pick<Seccion, 'description' | 'image' | 'imageAlt'>> = {
  '/': {
    description: 'Presentación del ministerio y contenidos destacados.',
    image: 'secciones/inicio.svg',
    imageAlt: 'Amanecer sobre las montañas',
  },
  '/discipulados': {
    description: 'Programas de formación cristiana integral.',
    image: 'secciones/discipulados.svg',
    imageAlt: 'Grupo estudiando la Biblia',
  },
  '/series-biblicas': {
    description: 'Enseñanzas y estudios organizados por temas.',
    image: 'secciones/series-biblicas.svg',
    imageAlt: 'Biblia abierta sobre una mesa',
  },
  '/escuela-de-teologia': {
    description:
      'Cursos de formación bíblica y teológica (p. ej. hermenéutica, exégesis, apologética).',
    image: 'secciones/escuela-de-teologia.svg',
    imageAlt: 'Libros de teología en una biblioteca',
  },
  '/adoracion': {
    description: 'Enseñanza bíblica y formación para el ministerio de alabanza.',
    image: 'secciones/adoracion.svg',
    imageAlt: 'Congregación adorando con las manos alzadas',
  },
  '/galeria': {
    description: 'Fotografías y actividades del ministerio.',
    image: 'secciones/galeria.svg',
    imageAlt: 'Cámara grabando una enseñanza',
  },
  '/sobre-nosotros': {
    description: 'Misión, visión y presentación del fundador.',
    image: 'secciones/sobre-nosotros.svg',
    imageAlt: 'Montañas al atardecer',
  },
  '/contacto': {
    description: 'Consultas, invitaciones y colaboraciones.',
    image: 'secciones/contacto.svg',
    imageAlt: 'Escritorio con libreta y computadora',
  },
};

export const secciones: Seccion[] = nav.map((item) => ({
  title: item.label,
  href: item.href,
  icon: item.icon,
  ...detalles[item.href]!,
}));
