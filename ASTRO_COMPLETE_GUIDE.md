# 📚 Guía Completa: Portafolio con Astro e i18n

> Guía detallada para entender completamente cómo funciona este proyecto de portafolio desarrollado con Astro, incluyendo el sistema de internacionalización.

---

## 📑 Índice

1. [¿Qué es Astro?](#qué-es-astro)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Configuración Principal](#configuración-principal)
4. [Sistema de Internacionalización (i18n)](#sistema-de-internacionalización)
5. [Componentes Astro](#componentes-astro)
6. [Layouts](#layouts)
7. [Páginas y Routing](#páginas-y-routing)
8. [Gestión de Datos (CV)](#gestión-de-datos)
9. [Estilos y Temas](#estilos-y-temas)
10. [Flujo de Renderizado](#flujo-de-renderizado)
11. [Optimizaciones](#optimizaciones)

---

## 🚀 ¿Qué es Astro?

### Concepto Básico

**Astro** es un framework web moderno que se enfoca en:
- **Enviar menos JavaScript al navegador**: Por defecto, los componentes se renderizan en el servidor
- **Arquitectura de Islas**: Solo las partes interactivas cargan JavaScript
- **Agnóstico de frameworks**: Puedes usar React, Vue, Svelte, etc., juntos
- **Optimización automática**: Images, fonts, CSS, etc.

### Filosofía Principal

```
HTML estático + Islas de interactividad = Sitio ultrarrápido
```

### Componentes `.astro`

Un archivo `.astro` tiene dos partes:

```astro
---
// 1. SCRIPT (Frontmatter): Se ejecuta en el SERVIDOR
import Component from './Component.astro'
const data = await fetch('api.com')
---

<!-- 2. TEMPLATE: HTML que se envía al cliente -->
<div>
  <h1>{data.title}</h1>
  <Component />
</div>

<style>
  /* 3. ESTILOS: Automáticamente con scope */
  h1 { color: blue; }
</style>

<script>
  // 4. SCRIPTS: Se ejecutan en el NAVEGADOR
  console.log('Hola desde el cliente')
</script>
```

**Regla de Oro**: 
- ✅ **Frontmatter** (`---`) = Servidor (Node.js)
- ✅ **Template** = HTML generado
- ✅ **Script sin `---`** = Cliente (Navegador)

---

## 📁 Estructura del Proyecto

```
minimalist-portfolio/
│
├── public/                      # Archivos estáticos (se copian tal cual)
│   ├── favicon.svg
│   ├── me.jpg                   # Tu foto
│   └── robots.txt
│
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── Analytics.astro      # Google Analytics
│   │   ├── KeyboardManager.astro # Atajos de teclado
│   │   ├── LanguageSelector.astro # Selector ES/EN
│   │   ├── Section.astro        # Wrapper de secciones
│   │   └── ThemeIcon.astro      # Cambio tema claro/oscuro
│   │   └── sections/            # Secciones del CV
│   │       ├── About.astro
│   │       ├── Education.astro
│   │       ├── Experience.astro
│   │       ├── Hero.astro
│   │       ├── Projects.astro
│   │       └── Skills.astro
│   │
│   ├── i18n/                    # Sistema de traducciones
│   │   ├── es.json              # Textos en español
│   │   ├── en.json              # Textos en inglés
│   │   └── utils.ts             # Funciones helper i18n
│   │
│   ├── icons/                   # Iconos SVG como componentes
│   │   ├── GitHub.astro
│   │   ├── LinkedIn.astro
│   │   ├── Mail.astro
│   │   └── ... (más iconos)
│   │
│   ├── layouts/                 # Templates de página
│   │   └── Layout.astro         # Layout principal
│   │
│   ├── pages/                   # ROUTING AUTOMÁTICO
│   │   ├── index.astro          # → / (español)
│   │   └── en/
│   │       └── index.astro      # → /en (inglés)
│   │
│   ├── env.d.ts                 # Tipos de TypeScript
│   └── types.d.ts               # Tipos personalizados
│
├── cv.json                      # Datos del CV en español
├── cv.en.json                   # Datos del CV en inglés
├── astro.config.mjs             # Configuración de Astro
├── tsconfig.json                # Configuración TypeScript
└── package.json                 # Dependencias
```

### ⚡ Concepto Clave: Routing Basado en Archivos

```
src/pages/index.astro       → tu-sitio.com/
src/pages/about.astro       → tu-sitio.com/about
src/pages/en/index.astro    → tu-sitio.com/en
src/pages/blog/post.astro   → tu-sitio.com/blog/post
```

---

## ⚙️ Configuración Principal

### `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  // URL base del sitio (para producción)
  site: 'https://github.com/Emerson147',
  
  // Configuración de internacionalización
  i18n: {
    defaultLocale: 'es',           // Idioma por defecto
    locales: ['es', 'en'],         // Idiomas disponibles
    routing: {
      prefixDefaultLocale: false   // 'es' no tiene prefijo /es
    }
  }
});
```

**¿Qué hace esta configuración?**

1. **`defaultLocale: 'es'`**: El español es el idioma principal
2. **`locales: ['es', 'en']`**: Soporta español e inglés
3. **`prefixDefaultLocale: false`**: 
   - ✅ Español: `tusite.com/` (SIN `/es`)
   - ✅ Inglés: `tusite.com/en` (CON `/en`)

### `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@cv": ["./cv.json"],        // Alias para importar CV
      "@/*": ["./src/*"]           // Alias para importar desde src/
    }
  }
}
```

**Path Aliases**: Permiten importaciones limpias

```typescript
// ❌ Sin alias
import Hero from '../../../components/sections/Hero.astro'

// ✅ Con alias
import Hero from '@/components/sections/Hero.astro'
import { basics } from '@cv'
```

---

## 🌐 Sistema de Internacionalización

### Arquitectura i18n

```
┌─────────────────────────────────────────┐
│  Usuario visita /en                     │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  Astro detecta idioma desde URL         │
│  → getLangFromUrl(Astro.url)            │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  Se carga el CV correspondiente:        │
│  → cv.en.json (si lang = 'en')          │
│  → cv.json (si lang = 'es')             │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  Se obtienen las traducciones de UI:    │
│  → useTranslations('en')                │
│  → t('about.title') = 'About me'        │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  Se renderiza la página en inglés       │
└─────────────────────────────────────────┘
```

### Archivos de Traducción

**`src/i18n/es.json`**
```json
{
  "nav": {
    "about": "Sobre mi",
    "experience": "Experiencia laboral"
  },
  "hero": {
    "available": "Disponible para trabajar"
  }
}
```

**`src/i18n/en.json`**
```json
{
  "nav": {
    "about": "About me",
    "experience": "Work experience"
  },
  "hero": {
    "available": "Available for work"
  }
}
```

### Utilidades i18n: `src/i18n/utils.ts`

```typescript
import es from './es.json';
import en from './en.json';

// 1. Definición de idiomas disponibles
export const languages = {
  es: 'Español',
  en: 'English',
};

export const defaultLang = 'es';

// 2. Diccionario de traducciones
export const ui = {
  es,
  en,
} as const;

// 3. Detectar idioma desde la URL
export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  // url = "https://site.com/en/about"
  // pathname = "/en/about"
  // split('/') = ['', 'en', 'about']
  // lang = 'en'
  
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

// 4. Hook para obtener traducciones
export function useTranslations(lang: keyof typeof ui) {
  return function t(key: string) {
    // key = "nav.about"
    const keys = key.split('.');  // ['nav', 'about']
    let value: any = ui[lang];    // { nav: {...}, hero: {...} }
    
    // Navegar por el objeto anidado
    for (const k of keys) {
      value = value?.[k];  // value.nav → value.nav.about
    }
    
    return value || key;  // Retorna traducción o la key si no existe
  }
}

// 5. Cargar el CV según el idioma
export function getCV(lang: keyof typeof ui) {
  if (lang === 'en') {
    return import('../../cv.en.json').then(m => m.default);
  }
  return import('../../cv.json').then(m => m.default);
}
```

**Ejemplo de uso:**

```astro
---
import { useTranslations } from '@/i18n/utils';

const lang = 'en';
const t = useTranslations(lang);

console.log(t('nav.about'));  // → "About me"
console.log(t('hero.available'));  // → "Available for work"
---
```

---

## 🧩 Componentes Astro

### Anatomía de un Componente

**`src/components/sections/About.astro`**

```astro
---
// ═══════════════════════════════════════
// FRONTMATTER (Se ejecuta en el SERVIDOR)
// ═══════════════════════════════════════

// 1. Imports
import Section from "../Section.astro";
import { useTranslations } from '@/i18n/utils';

// 2. Definición de Props (TypeScript)
interface Props {
  lang?: string;  // Signo ? = opcional
}

// 3. Recibir props
const { lang = 'es' } = Astro.props;  // Default = 'es'

// 4. Lógica de servidor
const t = useTranslations(lang as 'es' | 'en');

// 5. Cargar datos dinámicamente
const cvModule = lang === 'en' 
  ? await import('../../../cv.en.json')
  : await import('../../../cv.json');

const { basics } = cvModule.default;
const { summary } = basics;
---

<!-- ═══════════════════════════════════════ -->
<!-- TEMPLATE (HTML que se renderiza)        -->
<!-- ═══════════════════════════════════════ -->

<Section title={t('about.title')} id="sobre-mi">
   <p>{summary}</p>
</Section>
```

**Flujo de ejecución:**

```
1. Usuario visita /en
2. Astro renderiza About.astro con lang='en'
3. SERVIDOR ejecuta:
   - t = useTranslations('en')
   - cvModule = import cv.en.json
   - title = "About me"
4. SERVIDOR genera HTML:
   <section>
     <h2>About me</h2>
     <p>Computer Science Graduate...</p>
   </section>
5. NAVEGADOR recibe HTML puro (sin JavaScript)
```

### Componente con Interactividad: `ThemeIcon.astro`

```astro
---
// NO hay lógica de servidor aquí
---

<button id="theme-toggle" title="Cambiar tema">
  <!-- SVG del ícono -->
</button>

<style>
  button {
    /* Estilos con scope automático */
  }
</style>

<script>
  // ═══════════════════════════════════════
  // Este código se ejecuta en el NAVEGADOR
  // ═══════════════════════════════════════
  
  const themeToggle = document.getElementById('theme-toggle');
  
  themeToggle?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
  
  // Cargar tema guardado
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }
</script>
```

**Importante**: El `<script>` **sin** `---` se ejecuta en el navegador.

### Props en Astro

```astro
---
// Definir tipos de props (TypeScript)
interface Props {
  title: string;        // Requerido
  description?: string; // Opcional
  count?: number;       // Opcional
}

// Recibir props con valores por defecto
const { 
  title, 
  description = 'Sin descripción',
  count = 0 
} = Astro.props;
---

<div>
  <h1>{title}</h1>
  <p>{description}</p>
  <span>Cantidad: {count}</span>
</div>
```

**Uso:**
```astro
<Component title="Hola" count={5} />
<!-- description usará el valor por defecto -->
```

---

## 📐 Layouts

### `src/layouts/Layout.astro`

Un **Layout** es una plantilla que envuelve el contenido de las páginas.

```astro
---
interface Props {
  title: string;
  description: string;
  lang?: string;
  basics?: any;
}

const { title, description, lang = 'es', basics } = Astro.props;
const { image, url } = basics || {};
const locale = lang === 'en' ? 'en_US' : 'es_PE';
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <title>{title}</title>
    <meta name="description" content={description} />
    
    <!-- Open Graph para redes sociales -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:locale" content={locale} />
    
    <!-- JSON-LD para SEO -->
    {basics && (
      <script type="application/ld+json" set:html={JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": basics.name,
        "jobTitle": basics.label,
        // ... más datos estructurados
      })} />
    )}
  </head>
  
  <body>
    <!-- slot = donde se inserta el contenido de la página -->
    <slot />
  </body>
</html>

<style is:global>
  /* Estilos globales (sin scope) */
  html {
    font-family: monospace;
    background: #fff;
  }
  
  html.dark {
    background: #1a1a1a;
    color: #e5e5e5;
  }
</style>
```

### El poder del `<slot />`

```astro
<!-- Layout.astro -->
<div class="container">
  <slot />  <!-- Aquí se inserta el contenido -->
</div>

<!-- index.astro -->
<Layout>
  <h1>Hola Mundo</h1>  <!-- Esto va al slot -->
</Layout>

<!-- Resultado final: -->
<div class="container">
  <h1>Hola Mundo</h1>
</div>
```

---

## 🗺️ Páginas y Routing

### `src/pages/index.astro` (Español - Ruta `/`)

```astro
---
import Layout from '@/layouts/Layout.astro';
import Hero from '@/components/sections/Hero.astro';
import About from '@/components/sections/About.astro';
import LanguageSelector from '@/components/LanguageSelector.astro';
import ThemeIcon from '@/components/ThemeIcon.astro';

// Importar CV en español
import { basics } from "@cv"
const { name, label, summary } = basics
---

<Layout 
  title={`CV de ${name} - ${label}`} 
  description={summary}
  lang="es"
  basics={basics}
>
  <header class="no-print">
    <nav>
      <LanguageSelector />
      <ThemeIcon />
    </nav>
  </header>

  <main>
    <Hero />
    <About />
    <!-- Más secciones... -->
  </main>
</Layout>

<style>
  header {
    padding: 1rem 2rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  
  @media print {
    .no-print {
      display: none !important;
    }
  }
</style>
```

### `src/pages/en/index.astro` (Inglés - Ruta `/en`)

```astro
---
import Layout from '@/layouts/Layout.astro';
import Hero from '@/components/sections/Hero.astro';
import About from '@/components/sections/About.astro';
import LanguageSelector from '@/components/LanguageSelector.astro';

// Importar CV en inglés
import cvData from '../../../cv.en.json';
const { basics } = cvData;
const { name, label, summary } = basics;
---

<Layout 
  title={`CV of ${name} - ${label}`} 
  description={summary}
  lang="en"
  basics={basics}
>
  <header class="no-print">
    <nav>
      <LanguageSelector />
      <ThemeIcon />
    </nav>
  </header>

  <main>
    <!-- ¡IMPORTANTE! Pasar lang="en" a cada componente -->
    <Hero lang="en" />
    <About lang="en" />
    <Experience lang="en" />
  </main>
</Layout>
```

**¿Por qué pasar `lang="en"` a cada componente?**

Cada componente necesita saber en qué idioma renderizarse para:
1. Cargar el CV correcto (`cv.json` vs `cv.en.json`)
2. Usar las traducciones correctas (`t('about.title')`)

---

## 📊 Gestión de Datos (CV)

### Formato JSON Resume

Ambos `cv.json` y `cv.en.json` siguen el estándar **JSON Resume**.

```json
{
  "basics": {
    "name": "Emerson Quijada Rafael",
    "label": "Full Stack Developer",
    "image": "/me.jpg",
    "email": "emersontec147@gmail.com",
    "phone": "+51 935611092",
    "summary": "Descripción profesional...",
    "location": {
      "city": "Huancayo",
      "region": "Peru"
    },
    "profiles": [
      {
        "network": "LinkedIn",
        "url": "https://linkedin.com/in/migattedev"
      }
    ]
  },
  "work": [
    {
      "name": "Empresa",
      "position": "Cargo",
      "startDate": "2024-01-01",
      "endDate": "2025-01-01",
      "summary": "Descripción del trabajo",
      "highlights": [
        "Logro 1",
        "Logro 2"
      ]
    }
  ],
  "education": [...],
  "skills": [...],
  "projects": [...]
}
```

### Importación Dinámica de CV

```astro
---
// Método 1: Importación estática (solo un idioma)
import { basics } from '@cv'  // Siempre cv.json

// Método 2: Importación dinámica (multiidioma)
const cvModule = lang === 'en' 
  ? await import('../../../cv.en.json')
  : await import('../../../cv.json');

const { basics, work, education } = cvModule.default;
---
```

**¿Por qué `await import()`?**

- Es una **importación dinámica** que se resuelve en tiempo de ejecución
- Permite elegir qué archivo cargar según una condición
- `await` espera a que el archivo se cargue
- `.default` accede al contenido del JSON

---

## 🎨 Estilos y Temas

### Scoped Styles (Por defecto)

```astro
<div class="container">
  <h1>Hola</h1>
</div>

<style>
  /* Estos estilos SOLO afectan a este componente */
  .container {
    background: blue;
  }
  
  h1 {
    color: white;
  }
</style>

<!-- Astro genera algo como: -->
<div class="container astro-ABC123">
  <h1 class="astro-ABC123">Hola</h1>
</div>

<style>
  .container.astro-ABC123 { background: blue; }
  h1.astro-ABC123 { color: white; }
</style>
```

### Global Styles

```astro
<style is:global>
  /* Estos estilos afectan TODO el sitio */
  body {
    margin: 0;
  }
  
  html.dark {
    background: #1a1a1a;
    color: #e5e5e5;
  }
</style>
```

### Sistema de Tema Oscuro

**1. Clase CSS:**
```css
/* Tema claro (por defecto) */
html {
  background: #fff;
  color: #111;
}

/* Tema oscuro */
html.dark {
  background: #1a1a1a;
  color: #e5e5e5;
}
```

**2. JavaScript para toggle:**
```javascript
const toggleTheme = () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

// Cargar tema guardado al inicio
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
}
```

**3. Flujo completo:**
```
1. Usuario hace clic en botón
2. Se ejecuta toggleTheme()
3. Se agrega/quita clase 'dark' a <html>
4. CSS cambia automáticamente los colores
5. Se guarda preferencia en localStorage
6. En próxima visita, se carga tema guardado
```

---

## 🔄 Flujo de Renderizado

### Ciclo de Vida Completo

```
┌─────────────────────────────────────────────┐
│ 1. USUARIO VISITA /en                       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 2. ASTRO DETECTA RUTA                       │
│    → src/pages/en/index.astro               │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 3. EJECUTA FRONTMATTER (SERVIDOR)           │
│    - Importa componentes                    │
│    - Carga cv.en.json                       │
│    - Prepara datos                          │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 4. RENDERIZA LAYOUT                         │
│    <Layout lang="en" title="..." />         │
│    - Genera <html lang="en">                │
│    - Inserta meta tags                      │
│    - Prepara <head>                         │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 5. RENDERIZA COMPONENTES HIJOS              │
│    <Hero lang="en" />                       │
│    - Ejecuta frontmatter de Hero            │
│    - Carga traducciones: t('hero.title')    │
│    - Genera HTML del componente             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 6. COMPILA ESTILOS                          │
│    - Genera CSS con scope                   │
│    - Minimiza y optimiza                    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 7. PROCESA SCRIPTS                          │
│    <script> dentro de componentes           │
│    - Bundlea JavaScript                     │
│    - Optimiza código                        │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 8. GENERA HTML FINAL                        │
│    <!DOCTYPE html>                          │
│    <html lang="en">                         │
│      <head>...</head>                       │
│      <body>                                 │
│        <!-- Contenido completo -->          │
│      </body>                                │
│    </html>                                  │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 9. ENVÍA AL NAVEGADOR                       │
│    - HTML estático                          │
│    - CSS minimizado                         │
│    - JavaScript solo para interactividad    │
└─────────────────────────────────────────────┘
```

### Ejemplo Paso a Paso

**Entrada: Usuario visita `/en`**

```astro
<!-- src/pages/en/index.astro -->
---
const cvData = await import('../../cv.en.json');
const { name } = cvData.default.basics;  // "Emerson"
---

<Layout title={`CV of ${name}`}>
  <Hero lang="en" />
</Layout>
```

**Salida: HTML generado**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>CV of Emerson</title>
    <meta name="description" content="...">
  </head>
  <body>
    <section>
      <h1>Emerson Quijada Rafael</h1>
      <h2>Full Stack Developer</h2>
      <button id="download-cv-btn">Download CV</button>
    </section>
  </body>
</html>
```

---

## ⚡ Optimizaciones

### 1. Zero JavaScript por Defecto

```astro
<!-- Este componente NO envía JavaScript al cliente -->
<div>
  <h1>Hola Mundo</h1>
</div>
```

Resultado: **HTML puro**, carga instantánea.

### 2. Hidratación Parcial (Directivas)

```astro
---
import InteractiveComponent from './Interactive.jsx'
---

<!-- Solo carga JS cuando es visible -->
<InteractiveComponent client:visible />

<!-- Carga JS cuando la página carga -->
<InteractiveComponent client:load />

<!-- Carga JS cuando hay interacción -->
<InteractiveComponent client:idle />
```

### 3. Optimización de Imágenes

```astro
---
import { Image } from 'astro:assets'
import foto from './foto.jpg'
---

<!-- Astro optimiza automáticamente -->
<Image src={foto} alt="Foto" />
```

Genera:
- WebP automático
- Lazy loading
- Responsive images
- Tamaños optimizados

### 4. Preload de Recursos Críticos

```astro
<link rel="preload" as="image" href={image} />
```

Carga la imagen antes de que el navegador la necesite.

### 5. CSS Optimizado

```astro
<style>
  /* Astro automáticamente:
     - Hace scope de los estilos
     - Minimiza el CSS
     - Elimina CSS no usado
     - Agrupa estilos comunes
  */
</style>
```

---

## 🔍 Conceptos Avanzados

### 1. Astro.props

```astro
---
// Astro.props contiene todas las props pasadas al componente
const { title, count = 0 } = Astro.props;
---
```

### 2. Astro.url

```astro
---
// Información sobre la URL actual
const pathname = Astro.url.pathname;  // "/en/about"
const host = Astro.url.host;          // "localhost:4321"
---
```

### 3. set:html (Peligroso - solo para datos confiables)

```astro
---
const jsonData = JSON.stringify({ name: "Emerson" });
---

<!-- Inserta HTML sin escapar -->
<script type="application/ld+json" set:html={jsonData} />
```

⚠️ **Nunca uses `set:html` con datos de usuarios** (riesgo XSS)

### 4. Expresiones en Template

```astro
---
const items = ['A', 'B', 'C'];
const isActive = true;
---

<!-- Operador ternario -->
<div class={isActive ? 'active' : 'inactive'}>

<!-- Map -->
{items.map(item => <li>{item}</li>)}

<!-- Conditional rendering -->
{isActive && <p>Activo</p>}

<!-- class:list (muy útil) -->
<div class:list={['base', { active: isActive, disabled: !isActive }]}>
```

---

## 📝 Ejemplo Completo Comentado

```astro
---
// ════════════════════════════════════════
// FRONTMATTER - Se ejecuta en el SERVIDOR
// ════════════════════════════════════════

// 1. Imports
import Layout from '@/layouts/Layout.astro';
import Section from '@/components/Section.astro';
import { useTranslations } from '@/i18n/utils';

// 2. Tipos TypeScript (opcional pero recomendado)
interface Props {
  lang?: 'es' | 'en';
}

// 3. Obtener props con valores por defecto
const { lang = 'es' } = Astro.props;

// 4. Configurar traducciones
const t = useTranslations(lang);

// 5. Cargar datos dinámicamente (CLAVE DEL i18n)
const cvModule = lang === 'en' 
  ? await import('../../cv.en.json')
  : await import('../../cv.json');

// 6. Extraer datos necesarios
const { basics, work } = cvModule.default;
const { name, email } = basics;

// 7. Transformar datos si es necesario
const recentWork = work.slice(0, 3);
const formattedEmail = email.toLowerCase();
---

<!-- ════════════════════════════════════════ -->
<!-- TEMPLATE - HTML que se genera           -->
<!-- ════════════════════════════════════════ -->

<Layout 
  title={`CV - ${name}`}
  lang={lang}
>
  <Section title={t('experience.title')}>
    <ul>
      {recentWork.map(job => (
        <li>
          <h3>{job.name}</h3>
          <p>{job.position}</p>
          <time>{new Date(job.startDate).getFullYear()}</time>
        </li>
      ))}
    </ul>
  </Section>
  
  <a href={`mailto:${formattedEmail}`}>
    {t('contact.email')}
  </a>
</Layout>

<!-- ════════════════════════════════════════ -->
<!-- ESTILOS - Con scope automático          -->
<!-- ════════════════════════════════════════ -->

<style>
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 1rem;
    border-left: 3px solid blue;
    padding-left: 1rem;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    li {
      border-left-width: 2px;
    }
  }
  
  /* Tema oscuro */
  :global(html.dark) li {
    border-left-color: lightblue;
  }
</style>

<!-- ════════════════════════════════════════ -->
<!-- SCRIPTS - Se ejecutan en el NAVEGADOR   -->
<!-- ════════════════════════════════════════ -->

<script>
  // Este código corre en el cliente
  const links = document.querySelectorAll('a[href^="mailto:"]');
  
  links.forEach(link => {
    link.addEventListener('click', () => {
      console.log('Email link clicked');
    });
  });
</script>
```

---

## 🎓 Resumen de Conceptos Clave

### ✅ Astro Build Time vs Runtime

| Concepto | Cuándo se ejecuta | Dónde |
|----------|-------------------|-------|
| Frontmatter (`---`) | Build time | Servidor |
| Template (`<div>`) | Build time | Genera HTML |
| `<style>` | Build time | Genera CSS |
| `<script>` | Runtime | Navegador |

### ✅ Imports

```astro
---
// Componentes Astro
import Header from './Header.astro'

// JSON (se convierte en objeto JS)
import data from './data.json'

// TypeScript/JavaScript
import { helper } from './utils.ts'

// Alias configurados en tsconfig.json
import Component from '@/components/Component.astro'
import { basics } from '@cv'

// Importación dinámica (async)
const module = await import('./dynamic.json')
---
```

### ✅ Pasar Datos

```astro
---
const usuario = { nombre: "Ana", edad: 25 }
---

<!-- String -->
<Component title="Hola" />

<!-- Number -->
<Component count={5} />

<!-- Boolean -->
<Component active={true} />

<!-- Object -->
<Component user={usuario} />

<!-- Expression -->
<Component date={new Date()} />
```

### ✅ Renderizado Condicional

```astro
---
const isLoggedIn = true;
const items = [1, 2, 3];
---

<!-- AND operator -->
{isLoggedIn && <p>Bienvenido</p>}

<!-- Ternario -->
{isLoggedIn ? <p>Logout</p> : <p>Login</p>}

<!-- Map -->
{items.map(item => <li>{item}</li>)}

<!-- Guard clause -->
{items.length > 0 && (
  <ul>
    {items.map(item => <li>{item}</li>)}
  </ul>
)}
```

---

## 🚀 Comandos de Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev
# → http://localhost:4321

# Construir para producción
pnpm build
# → Genera carpeta dist/

# Vista previa de build
pnpm preview

# Verificar tipos TypeScript
pnpm astro check
```

---

## 📚 Recursos Adicionales

- **Documentación Oficial**: https://docs.astro.build
- **JSON Resume**: https://jsonresume.org/schema/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

## 🎯 Checklist de Entendimiento

- [ ] Entiendo la diferencia entre frontmatter y template
- [ ] Sé cuándo usar `<script>` vs código en `---`
- [ ] Comprendo el routing basado en archivos
- [ ] Entiendo cómo funciona el sistema i18n
- [ ] Sé cómo pasar props entre componentes
- [ ] Comprendo la importación dinámica de datos
- [ ] Entiendo el scope de CSS en Astro
- [ ] Sé cómo funciona el tema oscuro
- [ ] Comprendo el flujo completo de renderizado

---

**¡Ahora entiendes completamente tu proyecto Astro! 🎉**
