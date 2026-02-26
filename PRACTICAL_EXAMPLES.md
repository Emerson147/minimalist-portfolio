# 🛠️ Guía Práctica: Casos de Uso y Ejemplos

> Ejemplos del mundo real de cómo modificar y extender tu portafolio Astro

---

## 📋 Índice de Casos de Uso

1. [Agregar una nueva sección al CV](#agregar-nueva-sección)
2. [Agregar un nuevo idioma](#agregar-nuevo-idioma)
3. [Cambiar colores del tema](#cambiar-colores)
4. [Agregar nuevos iconos](#agregar-iconos)
5. [Crear un blog](#crear-blog)
6. [Agregar animaciones](#agregar-animaciones)
7. [Integrar con CMS](#integrar-cms)
8. [Optimizar SEO](#optimizar-seo)

---

## 1. Agregar Nueva Sección

### 📝 Escenario
Quieres agregar una sección de "Certificaciones" a tu CV.

### Paso 1: Actualizar los datos del CV

**`cv.json`**
```json
{
  "basics": {...},
  "work": [...],
  "education": [...],
  "certifications": [
    {
      "name": "AWS Certified Developer",
      "issuer": "Amazon Web Services",
      "date": "2024-01-15",
      "url": "https://aws.amazon.com/certification/"
    },
    {
      "name": "React Advanced Patterns",
      "issuer": "Frontend Masters",
      "date": "2023-11-20",
      "url": "https://frontendmasters.com"
    }
  ],
  "skills": [...]
}
```

**`cv.en.json`**
```json
{
  "basics": {...},
  "certifications": [
    {
      "name": "AWS Certified Developer",
      "issuer": "Amazon Web Services",
      "date": "2024-01-15",
      "url": "https://aws.amazon.com/certification/"
    },
    {
      "name": "React Advanced Patterns",
      "issuer": "Frontend Masters",
      "date": "2023-11-20",
      "url": "https://frontendmasters.com"
    }
  ]
}
```

### Paso 2: Agregar traducciones

**`src/i18n/es.json`**
```json
{
  "nav": {...},
  "certifications": {
    "title": "Certificaciones",
    "issuedBy": "Emitido por",
    "viewCertificate": "Ver certificado"
  }
}
```

**`src/i18n/en.json`**
```json
{
  "nav": {...},
  "certifications": {
    "title": "Certifications",
    "issuedBy": "Issued by",
    "viewCertificate": "View certificate"
  }
}
```

### Paso 3: Crear el componente

**`src/components/sections/Certifications.astro`**
```astro
---
import Section from "../Section.astro";
import { useTranslations } from '@/i18n/utils';

interface Props {
  lang?: string;
}

const { lang = 'es' } = Astro.props;
const t = useTranslations(lang as 'es' | 'en');

// Cargar CV según idioma
const cvModule = lang === 'en' 
  ? await import('../../../cv.en.json')
  : await import('../../../cv.json');

const { certifications } = cvModule.default;
---

<Section title={t('certifications.title')} id="certificaciones">
  <ul>
    {certifications.map(({ name, issuer, date, url }) => {
      const certDate = new Date(date).toLocaleDateString(
        lang === 'en' ? 'en-US' : 'es-ES',
        { year: 'numeric', month: 'long' }
      );
      
      return (
        <li>
          <article>
            <header>
              <h3>
                {url ? (
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {name}
                  </a>
                ) : (
                  name
                )}
              </h3>
              <time>{certDate}</time>
            </header>
            <footer>
              <p>{t('certifications.issuedBy')}: <strong>{issuer}</strong></p>
            </footer>
          </article>
        </li>
      )
    })}
  </ul>
</Section>

<style>
  ul {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  article {
    border-left: 3px solid #2563eb;
    padding-left: 1rem;
    transition: transform 0.2s ease;
  }
  
  article:hover {
    transform: translateX(4px);
  }
  
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  h3 {
    margin: 0;
    font-size: 1.1rem;
  }
  
  a {
    color: #2563eb;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  time {
    color: #666;
    font-size: 0.9rem;
  }
  
  :global(html.dark) time {
    color: #a0a0a0;
  }
  
  footer p {
    margin: 0;
  }
</style>
```

### Paso 4: Agregar a las páginas

**`src/pages/index.astro`**
```astro
---
import Certifications from '@/components/sections/Certifications.astro';
// ... otros imports
---

<Layout>
  <main>
    <Hero />
    <About />
    <Experience />
    <Certifications />  <!-- ✅ Nueva sección -->
    <Education />
    <Projects />
    <Skills />
  </main>
</Layout>
```

**`src/pages/en/index.astro`**
```astro
---
import Certifications from '@/components/sections/Certifications.astro';
// ... otros imports
---

<Layout>
  <main>
    <Hero lang="en" />
    <About lang="en" />
    <Experience lang="en" />
    <Certifications lang="en" />  <!-- ✅ Nueva sección en inglés -->
    <Education lang="en" />
    <Projects lang="en" />
    <Skills lang="en" />
  </main>
</Layout>
```

✅ **Resultado**: Nueva sección completamente funcional y bilingüe!

---

## 2. Agregar Nuevo Idioma (Francés)

### Paso 1: Configurar Astro

**`astro.config.mjs`**
```javascript
export default defineConfig({
  site: 'https://github.com/Emerson147',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'fr'],  // ✅ Agregar francés
    routing: {
      prefixDefaultLocale: false
    }
  }
});
```

### Paso 2: Crear archivos de traducción

**`src/i18n/fr.json`**
```json
{
  "nav": {
    "about": "À propos",
    "experience": "Expérience professionnelle",
    "education": "Éducation",
    "projects": "Projets",
    "skills": "Compétences"
  },
  "hero": {
    "available": "Disponible pour travailler"
  },
  "about": {
    "title": "À propos de moi"
  },
  "experience": {
    "title": "Expérience professionnelle",
    "current": "Actuel"
  },
  "projects": {
    "title": "Projets",
    "viewProject": "Voir le projet",
    "sourceCode": "Code source"
  }
}
```

### Paso 3: Crear CV en francés

**`cv.fr.json`**
```json
{
  "basics": {
    "name": "Emerson Quijada Rafael",
    "label": "Développeur Full Stack (Java/Angular)",
    "summary": "Diplômé en informatique et étudiant en génie des systèmes...",
    // ... resto del CV traducido
  }
}
```

### Paso 4: Actualizar utilidades i18n

**`src/i18n/utils.ts`**
```typescript
import es from './es.json';
import en from './en.json';
import fr from './fr.json';  // ✅ Importar francés

export const languages = {
  es: 'Español',
  en: 'English',
  fr: 'Français',  // ✅ Agregar francés
};

export const defaultLang = 'es';

export const ui = {
  es,
  en,
  fr,  // ✅ Agregar al diccionario
} as const;

// ... resto del código igual

export function getCV(lang: keyof typeof ui) {
  if (lang === 'en') {
    return import('../../cv.en.json').then(m => m.default);
  }
  if (lang === 'fr') {  // ✅ Agregar caso francés
    return import('../../cv.fr.json').then(m => m.default);
  }
  return import('../../cv.json').then(m => m.default);
}
```

### Paso 5: Crear página en francés

**`src/pages/fr/index.astro`**
```astro
---
import Layout from '@/layouts/Layout.astro';
import Hero from '@/components/sections/Hero.astro';
import About from '@/components/sections/About.astro';
import Experience from '@/components/sections/Experience.astro';
import Education from '@/components/sections/Education.astro';
import Projects from '@/components/sections/Projects.astro';
import Skills from '@/components/sections/Skills.astro';
import LanguageSelector from '@/components/LanguageSelector.astro';
import ThemeIcon from '@/components/ThemeIcon.astro';

import cvData from '../../../cv.fr.json';
const { basics } = cvData;
const { name, label, summary } = basics;
---

<Layout 
  title={`CV de ${name} - ${label}`} 
  description={summary}
  lang="fr"
  basics={basics}
>
  <header class="no-print">
    <nav>
      <LanguageSelector />
      <ThemeIcon />
    </nav>
  </header>

  <main>
    <Hero lang="fr" />
    <About lang="fr" />
    <Experience lang="fr" />
    <Education lang="fr" />
    <Projects lang="fr" />
    <Skills lang="fr" />
  </main>
</Layout>
```

✅ **Resultado**: Sitio ahora disponible en `/`, `/en` y `/fr`!

---

## 3. Cambiar Colores del Tema

### Personalizar colores del tema claro/oscuro

**`src/layouts/Layout.astro`** (en la sección `<style is:global>`)

```astro
<style is:global>
  /* Variables CSS para fácil personalización */
  :root {
    /* Tema Claro */
    --bg-primary: #ffffff;
    --bg-secondary: #f5f5f5;
    --text-primary: #111111;
    --text-secondary: #666666;
    --accent-color: #2563eb;
    --border-color: #e5e5e5;
  }
  
  html.dark {
    /* Tema Oscuro */
    --bg-primary: #1a1a1a;
    --bg-secondary: #2a2a2a;
    --text-primary: #e5e5e5;
    --text-secondary: #a0a0a0;
    --accent-color: #3b82f6;
    --border-color: #333333;
  }
  
  /* Aplicar variables */
  html {
    background: var(--bg-primary);
    color: var(--text-primary);
  }
  
  p {
    color: var(--text-secondary);
  }
  
  a {
    color: var(--accent-color);
  }
  
  article {
    border-color: var(--border-color);
  }
</style>
```

### Usar las variables en componentes

```astro
<style>
  .card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
  }
  
  .highlight {
    color: var(--accent-color);
  }
</style>
```

✅ **Ventaja**: Cambias colores en un solo lugar!

---

## 4. Agregar Nuevos Iconos

### Paso 1: Crear componente de ícono SVG

**`src/icons/Docker.astro`**
```astro
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <!-- SVG path del ícono Docker -->
  <path d="M..."/>
</svg>

<style>
  svg {
    width: 100%;
    height: 100%;
  }
</style>
```

### Paso 2: Usar en Skills

**`src/components/sections/Skills.astro`**
```astro
---
import Docker from "@/icons/Docker.astro"
import Kubernetes from "@/icons/Kubernetes.astro"
// ... otros imports

const SKILLS_ICONS: Record<string, any> = {
  Java,
  SpringBoot,
  Docker,        // ✅ Nuevo ícono
  Kubernetes,    // ✅ Nuevo ícono
  // ... otros
}
---
```

### Paso 3: Actualizar CV

**`cv.json`**
```json
{
  "skills": [
    {
      "name": "Docker",
      "level": "Avanzado",
      "keywords": ["DevOps", "Containers", "Cloud"]
    },
    {
      "name": "Kubernetes",
      "level": "Intermedio",
      "keywords": ["Orchestration", "Cloud Native"]
    }
  ]
}
```

✅ **Resultado**: Nuevos íconos aparecen automáticamente!

---

## 5. Crear un Blog

### Paso 1: Estructura de carpetas

```
src/
├── pages/
│   ├── blog/
│   │   ├── index.astro           → /blog
│   │   ├── post-1.md             → /blog/post-1
│   │   ├── post-2.md             → /blog/post-2
│   │   └── [slug].astro          → /blog/cualquier-slug
│   └── en/
│       └── blog/
│           ├── index.astro
│           └── [slug].astro
└── content/
    └── blog/
        ├── es/
        │   ├── post-1.md
        │   └── post-2.md
        └── en/
            ├── post-1.md
            └── post-2.md
```

### Paso 2: Crear colección de contenido

**`src/content/config.ts`**
```typescript
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
```

### Paso 3: Crear post de ejemplo

**`src/content/blog/es/mi-primer-post.md`**
```markdown
---
title: "Mi primer post"
description: "Introducción a mi blog técnico"
pubDate: 2024-01-15
author: "Emerson Quijada"
tags: ["javascript", "web development"]
---

# Mi Primer Post

Este es el contenido de mi primer post...

## Código de ejemplo

\`\`\`javascript
const saludo = () => {
  console.log('Hola mundo!');
};
\`\`\`
```

### Paso 4: Página de listado de blog

**`src/pages/blog/index.astro`**
```astro
---
import { getCollection } from 'astro:content';
import Layout from '@/layouts/Layout.astro';

const posts = await getCollection('blog', ({ id }) => {
  return id.startsWith('es/');
});

const sortedPosts = posts.sort((a, b) => 
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
---

<Layout title="Blog - Emerson Quijada">
  <main>
    <h1>Blog</h1>
    <ul>
      {sortedPosts.map((post) => (
        <li>
          <article>
            <h2>
              <a href={`/blog/${post.slug.replace('es/', '')}`}>
                {post.data.title}
              </a>
            </h2>
            <time>{post.data.pubDate.toLocaleDateString('es-ES')}</time>
            <p>{post.data.description}</p>
            <div class="tags">
              {post.data.tags.map(tag => (
                <span class="tag">{tag}</span>
              ))}
            </div>
          </article>
        </li>
      ))}
    </ul>
  </main>
</Layout>
```

### Paso 5: Página individual de post

**`src/pages/blog/[slug].astro`**
```astro
---
import { getCollection } from 'astro:content';
import Layout from '@/layouts/Layout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ id }) => {
    return id.startsWith('es/');
  });
  
  return posts.map(post => ({
    params: { slug: post.slug.replace('es/', '') },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<Layout title={post.data.title}>
  <article>
    <header>
      <h1>{post.data.title}</h1>
      <time>{post.data.pubDate.toLocaleDateString('es-ES')}</time>
      <p class="author">Por {post.data.author}</p>
    </header>
    
    <Content />
    
    <footer>
      <div class="tags">
        {post.data.tags.map(tag => (
          <span class="tag">#{tag}</span>
        ))}
      </div>
    </footer>
  </article>
</Layout>

<style>
  article {
    max-width: 65ch;
    margin: 0 auto;
    padding: 2rem;
  }
  
  header h1 {
    margin-bottom: 0.5rem;
  }
  
  time {
    color: #666;
  }
  
  .tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .tag {
    background: #f0f0f0;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.875rem;
  }
</style>
```

✅ **Resultado**: Blog completo con markdown support!

---

## 6. Agregar Animaciones

### Usando CSS Animations

**`src/components/sections/Hero.astro`**
```astro
<div class="hero-content fade-in">
  <h1 class="slide-up">{name}</h1>
  <h2 class="slide-up delay-1">{label}</h2>
</div>

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .fade-in {
    animation: fadeIn 0.8s ease-out;
  }
  
  .slide-up {
    animation: slideUp 0.6s ease-out backwards;
  }
  
  .delay-1 {
    animation-delay: 0.2s;
  }
</style>
```

### Usando Intersection Observer

**`src/components/AnimateOnScroll.astro`**
```astro
<div class="animate-on-scroll">
  <slot />
</div>

<style>
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  
  .animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }
</style>

<script>
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  });
  
  const elements = document.querySelectorAll('.animate-on-scroll');
  elements.forEach(el => observer.observe(el));
</script>
```

**Uso:**
```astro
<AnimateOnScroll>
  <Section title="About">
    <p>This content animates when scrolled into view</p>
  </Section>
</AnimateOnScroll>
```

---

## 7. Integrar con CMS (Headless)

### Ejemplo con Contentful

**`astro.config.mjs`**
```javascript
export default defineConfig({
  // ... configuración existente
  integrations: [
    // Agregar integración si es necesaria
  ],
  env: {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
  }
});
```

**`.env`**
```
CONTENTFUL_SPACE_ID=tu_space_id
CONTENTFUL_ACCESS_TOKEN=tu_token
```

**`src/lib/contentful.ts`**
```typescript
import contentful from 'contentful';

export const client = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getBlogPosts() {
  const entries = await client.getEntries({
    content_type: 'blogPost',
    order: '-fields.publishDate',
  });
  
  return entries.items;
}
```

**Uso en página:**
```astro
---
import { getBlogPosts } from '@/lib/contentful';

const posts = await getBlogPosts();
---

<ul>
  {posts.map(post => (
    <li>{post.fields.title}</li>
  ))}
</ul>
```

---

## 8. Optimizar SEO

### Sitemap automático

**Instalar integración:**
```bash
pnpm add @astrojs/sitemap
```

**`astro.config.mjs`**
```javascript
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tu-dominio.com',
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
  }
});
```

### Robots.txt dinámico

**`public/robots.txt`**
```
User-agent: *
Allow: /

Sitemap: https://tu-dominio.com/sitemap-index.xml
```

### Open Graph Images dinámicas

**`src/pages/og/[...slug].png.ts`**
```typescript
import { getCollection } from 'astro:content';
import satori from 'satori';
import sharp from 'sharp';

export async function GET({ params }) {
  // Genera imagen OG dinámica para cada página
  const svg = await satori(
    {
      type: 'div',
      props: {
        children: 'Mi CV - Emerson Quijada',
        style: { fontSize: '60px' }
      }
    },
    { width: 1200, height: 630 }
  );
  
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  
  return new Response(png, {
    headers: { 'Content-Type': 'image/png' }
  });
}
```

---

## 🎓 Ejercicios Prácticos

### Ejercicio 1: Agregar sección de Hobbies
1. Crea `src/components/sections/Hobbies.astro`
2. Agrega datos en `cv.json` y `cv.en.json`
3. Crea traducciones en i18n
4. Agrégalo a ambas páginas index

### Ejercicio 2: Tema personalizado "Purple"
1. Crea nuevas variables CSS para tema morado
2. Agrega botón para cambiar a tema purple
3. Guarda preferencia en localStorage

### Ejercicio 3: Contador de visitas
1. Crea endpoint API en `src/pages/api/views.json.ts`
2. Guarda visitas en localStorage
3. Muestra contador en el footer

---

## 📚 Recursos Adicionales

- [Astro Recipes](https://docs.astro.build/en/recipes/)
- [Astro Integrations](https://astro.build/integrations/)
- [CSS Tricks - Astro](https://css-tricks.com/tag/astro/)

---

**¡Ahora tienes herramientas para personalizar completamente tu portafolio! 🚀**
