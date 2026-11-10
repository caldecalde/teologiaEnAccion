# Teología en Acción

Sitio web de la academia de teología **Teología en Acción**: enseñanza bíblica, formación y discipulado.

Está construido con [Astro](https://astro.build) e islas de [Vue 3](https://vuejs.org) solo donde hay interactividad (reproductor de video y menú móvil), con estilos en Tailwind CSS v4. El sitio se genera como HTML estático y se publica en Cloudflare Pages.

## Requisitos

- Node.js 22 o superior

## Comandos

| Comando           | Acción                                                     |
| ----------------- | ---------------------------------------------------------- |
| `npm install`     | Instala dependencias                                       |
| `npm run dev`     | Servidor de desarrollo en `http://localhost:4321`          |
| `npm run build`   | Verifica tipos (`astro check`) y genera el sitio en `dist/` |
| `npm run preview` | Sirve localmente el build de producción                    |

## Estructura

```
src/
  config/site.ts        Nombre, lema, menú, URL de donación y redes sociales
  data/secciones.ts     Tarjetas de la página de inicio (descripción + imagen)
  data/videos.ts        Videos destacados de YouTube
  lib/cfImage.ts        URLs de imágenes (Cloudflare R2 + Image Transformations)
  stores/player.ts      Estado global del reproductor de video
  layouts/BaseLayout    <head> con SEO, header, menú, footer y reproductor persistente
  components/           Componentes .astro (estáticos) y .vue (interactivos)
  pages/index.astro     Landing page
  pages/[seccion].astro Páginas "Próximamente" de cada sección
public/img/fallback/    Imágenes locales provisionales
```

### Agregar una sección real

Crea `src/pages/<slug>.astro` (por ejemplo `src/pages/galeria.astro`) usando `BaseLayout`. Esa página tiene prioridad sobre la página provisional de `[seccion].astro`.

### Agregar videos

Edita `src/data/videos.ts` y agrega el `youtubeId`, que es lo que va después de `v=` en la URL de YouTube. Para mostrar un video en cualquier página:

```astro
<VideoCard client:visible youtubeId="XXXXXXXXXXX" title="Título" serie="Serie" />
```

Al hacer clic, el video se abre en un modal. Se puede minimizar a un reproductor flotante que sigue sonando mientras se navega por el sitio.

## Imágenes en Cloudflare R2

1. Crea un bucket R2 y conéctalo a un dominio propio (ej. `img.teologiaenaccion.org`).
2. En la zona del dominio activa **Images → Transformations**.
3. Sube las imágenes al bucket respetando las rutas usadas en el código (ej. `secciones/inicio.jpg`).
4. Define `PUBLIC_IMG_BASE=https://img.teologiaenaccion.org` en las variables de entorno.

Si `PUBLIC_IMG_BASE` no está definida, se usan las imágenes de `public/img/fallback/`. Con la variable definida, `CfImage.astro` genera automáticamente el `srcset` (400/800/1200/1600 px, `format=auto`).

## Despliegue en Cloudflare Pages

- **Comando de build:** `npm run build`
- **Directorio de salida:** `dist`
- **Variables de entorno:** las de `.env.example` (`PUBLIC_SITE_URL`, `PUBLIC_IMG_BASE`, `PUBLIC_DONATE_URL`)

## Pendiente

- Logo oficial (hoy se usa uno provisional en `src/components/Logo.astro`)
- Fotos reales de cada sección y del encabezado
- IDs de los videos propios (los actuales son ejemplos de BibleProject)
- Imagen Open Graph en PNG o JPG de 1200×630 (las redes sociales no aceptan SVG)
- Destino del botón "Apoya este ministerio"
