export type IconName =
  | 'lucide:house'
  | 'lucide:users'
  | 'lucide:book-open'
  | 'lucide:graduation-cap'
  | 'lucide:heart'
  | 'lucide:image'
  | 'lucide:info'
  | 'lucide:mail';

export interface NavItem {
  label: string;
  href: string;
  icon: IconName;
}

export const site = {
  name: 'Teología en Acción',
  tagline: ['Enseñanza bíblica', 'Formación', 'Discipulado'],
  description:
    'Academia de teología: enseñanza bíblica, discipulado, series bíblicas y formación teológica para la iglesia.',
  locale: 'es',
  donateUrl: import.meta.env.PUBLIC_DONATE_URL || '#apoyo',
  social: {
    youtube: 'https://www.youtube.com/',
    facebook: '',
    instagram: '',
  },
} as const;

export const nav: NavItem[] = [
  { label: 'Inicio', href: '/', icon: 'lucide:house' },
  { label: 'Discipulados', href: '/discipulados', icon: 'lucide:users' },
  { label: 'Series bíblicas', href: '/series-biblicas', icon: 'lucide:book-open' },
  { label: 'Escuela de Teología', href: '/escuela-de-teologia', icon: 'lucide:graduation-cap' },
  { label: 'Adoración', href: '/adoracion', icon: 'lucide:heart' },
  { label: 'Galería', href: '/galeria', icon: 'lucide:image' },
  { label: 'Sobre nosotros', href: '/sobre-nosotros', icon: 'lucide:info' },
  { label: 'Contacto', href: '/contacto', icon: 'lucide:mail' },
];

/** Normaliza rutas para comparar el ítem activo ("/galeria/" === "/galeria"). */
export function isActive(href: string, pathname: string): boolean {
  const clean = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);
  return clean(href) === clean(pathname);
}
