# 🎨 Guía Visual: Arquitectura del Proyecto

> Diagramas y explicaciones visuales para entender el flujo de datos y la arquitectura del portafolio

---

## 📊 Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO EN NAVEGADOR                      │
│                                                              │
│  ┌──────────────┐              ┌──────────────┐            │
│  │   / (español) │              │  /en (inglés) │            │
│  └───────┬──────┘              └──────┬───────┘            │
└──────────┼─────────────────────────────┼──────────────────┘
           │                             │
           │  HTTP Request               │  HTTP Request
           │                             │
           ▼                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      ASTRO SERVER                            │
│                                                              │
│  ┌─────────────────┐           ┌─────────────────┐         │
│  │ pages/index.astro│           │pages/en/index.astro│       │
│  │    lang='es'     │           │    lang='en'     │         │
│  └────────┬─────────┘           └────────┬────────┘         │
│           │                              │                   │
│           ├──────────────────────────────┤                   │
│           │                              │                   │
│           ▼                              ▼                   │
│  ┌─────────────────────────────────────────────────┐       │
│  │         LAYOUT + COMPONENTS                      │       │
│  │  - Layout.astro (HTML structure)                │       │
│  │  - Hero, About, Experience, etc.                │       │
│  └─────────────────┬────────────────────────────────┘       │
│                    │                                         │
│                    ▼                                         │
│  ┌─────────────────────────────────────────────────┐       │
│  │         DATA LOADING                             │       │
│  │                                                  │       │
│  │  lang='es' → cv.json + i18n/es.json             │       │
│  │  lang='en' → cv.en.json + i18n/en.json          │       │
│  └─────────────────┬────────────────────────────────┘       │
│                    │                                         │
│                    ▼                                         │
│  ┌─────────────────────────────────────────────────┐       │
│  │         HTML GENERATION                          │       │
│  │  - Renderiza componentes                        │       │
│  │  - Aplica traducciones                          │       │
│  │  - Compila CSS                                  │       │
│  │  - Bundlea JS (minimal)                         │       │
│  └─────────────────┬────────────────────────────────┘       │
└────────────────────┼──────────────────────────────────────┘
                     │
                     │  HTTP Response
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                HTML + CSS + JS (minimal)                     │
│                                                              │
│  <!DOCTYPE html>                                             │
│  <html lang="es">                                            │
│    <head>...</head>                                          │
│    <body>                                                    │
│      <header>...</header>                                    │
│      <main>                                                  │
│        <section>CV Content</section>                         │
│      </main>                                                 │
│    </body>                                                   │
│  </html>                                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos i18n

```
Usuario visita URL
       │
       ▼
┌──────────────┐
│  Detectar    │
│   Idioma     │────► /     → lang = 'es'
│  (desde URL) │────► /en   → lang = 'en'
└──────┬───────┘────► /fr   → lang = 'es' (fallback)
       │
       ▼
┌────────────────────────────────────────┐
│  Cargar Datos según Idioma             │
│                                        │
│  IF lang === 'en':                     │
│    ├─► cv.en.json                      │
│    └─► i18n/en.json                    │
│  ELSE:                                 │
│    ├─► cv.json                         │
│    └─► i18n/es.json                    │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  Función useTranslations(lang)         │
│                                        │
│  const t = useTranslations('en')      │
│                                        │
│  t('about.title')                      │
│     │                                  │
│     ├─► Busca en i18n/en.json          │
│     │     { "about": { "title": ... }} │
│     │                                  │
│     └─► Retorna: "About me"            │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  Renderizar Componentes                │
│                                        │
│  <Section title={t('about.title')}>   │
│  <p>{basics.summary}</p>               │
│  </Section>                            │
│                                        │
│  HTML generado:                        │
│  <section>                             │
│    <h2>About me</h2>                   │
│    <p>Computer Science Graduate...</p> │
│  </section>                            │
└────────────────────────────────────────┘
```

---

## 🧩 Jerarquía de Componentes

```
src/pages/index.astro (Ruta: /)
│
├─► Layout.astro
│   │
│   ├─► <head>
│   │   ├─► Meta tags
│   │   ├─► JSON-LD structured data
│   │   └─► Analytics.astro
│   │
│   └─► <body>
│       └─► <slot /> ◄─────────┐
│                               │
│       Contenido insertado:    │
│                               │
│       ├─► <header>            │
│       │   ├─► LanguageSelector.astro
│       │   └─► ThemeIcon.astro
│       │
│       └─► <main>
│           ├─► Hero.astro
│           │   ├─► Section.astro
│           │   ├─► Mail.astro (icon)
│           │   ├─► Phone.astro (icon)
│           │   └─► GitHub.astro (icon)
│           │
│           ├─► About.astro
│           │   └─► Section.astro
│           │
│           ├─► Experience.astro
│           │   └─► Section.astro
│           │       └─► work[].map() ◄── cv.json
│           │
│           ├─► Education.astro
│           │   └─► Section.astro
│           │       └─► education[].map() ◄── cv.json
│           │
│           ├─► Projects.astro
│           │   └─► Section.astro
│           │       └─► projects[].map() ◄── cv.json
│           │
│           └─► Skills.astro
│               └─► Section.astro
│                   └─► skills[].map() ◄── cv.json
│                       └─► SKILLS_ICONS[name]
```

---

## 💾 Flujo de Importación de Datos

### Método 1: Importación Estática (Páginas en Español)

```
src/pages/index.astro
       │
       │ import { basics } from "@cv"
       ▼
┌──────────────────┐
│   tsconfig.json  │
│   "@cv" apunta a │
│   "./cv.json"    │
└────────┬─────────┘
         │
         ▼
     cv.json ───────► { basics: {...}, work: [...] }
         │
         │ Extraer datos
         ▼
    const { name, label, summary } = basics
         │
         │ Pasar a componentes
         ▼
    <Layout title={...} basics={basics} />
```

### Método 2: Importación Dinámica (Componentes Multiidioma)

```
Component.astro recibe prop: lang="en"
       │
       ▼
const cvModule = lang === 'en' 
  ? await import('../../../cv.en.json')
  : await import('../../../cv.json')
       │
       ├─► lang='en' ──► import cv.en.json
       │                      │
       │                      ▼
       │                 { default: { basics: {...} } }
       │
       └─► lang='es' ──► import cv.json
                              │
                              ▼
                         { default: { basics: {...} } }
       │
       ▼
const { basics, work } = cvModule.default
       │
       ▼
Datos listos para usar en el template
```

---

## 🎨 Sistema de Estilos

```
┌──────────────────────────────────────────────────────────┐
│                   ESTILOS EN ASTRO                        │
└──────────────────────────────────────────────────────────┘

Componente: Header.astro
┌──────────────────────────────────────┐
│ <header class="main">                │
│   <h1>Title</h1>                     │
│ </header>                            │
│                                      │
│ <style>                              │
│   .main { color: blue; }             │
│   h1 { font-size: 2rem; }            │
│ </style>                             │
└──────────────┬───────────────────────┘
               │
               │ ASTRO PROCESA
               ▼
┌──────────────────────────────────────┐
│ HTML GENERADO:                       │
│ <header class="main astro-HASH123">  │
│   <h1 class="astro-HASH123">Title</h1>│
│ </header>                            │
│                                      │
│ CSS GENERADO:                        │
│ .main.astro-HASH123 {                │
│   color: blue;                       │
│ }                                    │
│ h1.astro-HASH123 {                   │
│   font-size: 2rem;                   │
│ }                                    │
└──────────────────────────────────────┘

RESULTADO: ✅ Estilos NO afectan otros componentes


Layout.astro - Estilos Globales
┌──────────────────────────────────────┐
│ <style is:global>                    │
│   body { margin: 0; }                │
│   html.dark { background: #1a1a1a; } │
│ </style>                             │
└──────────────┬───────────────────────┘
               │
               │ ASTRO PROCESA
               ▼
┌──────────────────────────────────────┐
│ CSS GENERADO (sin hash):             │
│ body {                               │
│   margin: 0;                         │
│ }                                    │
│ html.dark {                          │
│   background: #1a1a1a;               │
│ }                                    │
└──────────────────────────────────────┘

RESULTADO: ✅ Estilos afectan TODO el sitio
```

---

## 🌓 Sistema de Tema Oscuro

```
┌────────────────────────────────────────────────────┐
│              TOGGLE TEMA OSCURO                     │
└────────────────────────────────────────────────────┘

Estado Inicial (Carga de Página)
       │
       ▼
┌──────────────────────────────────┐
│  <script> en ThemeIcon.astro     │
│                                  │
│  1. Leer localStorage            │
│     const theme =                │
│       localStorage.getItem()     │
└──────────────┬───────────────────┘
               │
               ├─► theme = 'dark' ──► html.classList.add('dark')
               │
               └─► theme = null ────► (tema claro por defecto)
               │
               ▼
┌──────────────────────────────────┐
│  CSS Reacciona:                  │
│                                  │
│  html {                          │
│    background: #fff;             │
│  }                               │
│  html.dark {                     │
│    background: #1a1a1a;          │
│  }                               │
└──────────────────────────────────┘


Usuario hace CLICK en botón
       │
       ▼
┌──────────────────────────────────┐
│  Event Listener                  │
│                                  │
│  button.addEventListener('click')│
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  Toggle clase 'dark'             │
│                                  │
│  const isDark =                  │
│    html.classList.toggle('dark') │
└──────────────┬───────────────────┘
               │
               ├─► isDark = true ──► Guardar 'dark' en localStorage
               │
               └─► isDark = false ─► Guardar 'light' en localStorage
               │
               ▼
┌──────────────────────────────────┐
│  CSS Cambia Automáticamente      │
│                                  │
│  Clase añadida → Estilos oscuros │
│  Clase quitada → Estilos claros  │
└──────────────────────────────────┘
```

---

## 🔀 Selector de Idioma - Flujo Completo

```
┌────────────────────────────────────────────────────┐
│          COMPONENTE LanguageSelector.astro         │
└────────────────────────────────────────────────────┘

RENDERIZADO EN SERVIDOR
       │
       ▼
┌──────────────────────────────────┐
│  Detectar idioma actual          │
│                                  │
│  const currentPath =             │
│    Astro.url.pathname            │
│                                  │
│  '/en/about' → lang = 'en'       │
│  '/about'    → lang = 'es'       │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  Generar botones                 │
│                                  │
│  FOR EACH lang in ['es', 'en']   │
│    ├─► href = lang === 'es'      │
│    │      ? '/'                  │
│    │      : '/en'                │
│    │                             │
│    └─► isActive =                │
│          lang === currentLang    │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  HTML GENERADO                   │
│                                  │
│  <div class="language-selector"> │
│    <a href="/"                   │
│       class="lang-button active">│
│       ES                         │
│    </a>                          │
│    <a href="/en"                 │
│       class="lang-button">       │
│       EN                         │
│    </a>                          │
│  </div>                          │
└──────────────────────────────────┘

USUARIO HACE CLICK
       │
       ▼
┌──────────────────────────────────┐
│  Navegación Normal (Sin JS)      │
│                                  │
│  Click en "EN"                   │
│    └─► href="/en"                │
│          └─► Navegador va a /en  │
│                └─► Astro renderiza│
│                    pages/en/      │
│                    index.astro    │
└──────────────────────────────────┘
```

---

## 📱 Responsive Design

```
┌────────────────────────────────────────────────────┐
│                 BREAKPOINTS                         │
└────────────────────────────────────────────────────┘

Mobile First Approach
       │
       ▼
┌──────────────────────────────────┐
│  Estilos Base (Mobile)           │
│                                  │
│  .container {                    │
│    padding: 1rem;                │
│    flex-direction: column;       │
│  }                               │
└──────────────┬───────────────────┘
               │
               │ @media (min-width: 768px)
               ▼
┌──────────────────────────────────┐
│  Tablet                          │
│                                  │
│  .container {                    │
│    padding: 2rem;                │
│    flex-direction: row;          │
│  }                               │
└──────────────┬───────────────────┘
               │
               │ @media (min-width: 1024px)
               ▼
┌──────────────────────────────────┐
│  Desktop                         │
│                                  │
│  .container {                    │
│    max-width: 1200px;            │
│    margin: 0 auto;               │
│  }                               │
└──────────────────────────────────┘
```

---

## 🖨️ Print Styles

```
┌────────────────────────────────────────────────────┐
│              MODO IMPRESIÓN                         │
└────────────────────────────────────────────────────┘

Pantalla Normal
       │
       ▼
┌──────────────────────────────────┐
│  Elementos visibles:             │
│                                  │
│  ✅ <header class="no-print">    │
│  ✅ Selector de idioma           │
│  ✅ Botón tema oscuro            │
│  ✅ Contenido principal          │
│  ❌ Elementos .print (hidden)    │
└──────────────────────────────────┘

Usuario imprime (Ctrl+P)
       │
       ▼
┌──────────────────────────────────┐
│  @media print activa             │
│                                  │
│  .no-print {                     │
│    display: none !important;     │
│  }                               │
│                                  │
│  .print {                        │
│    display: block !important;    │
│  }                               │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  Elementos en PDF:               │
│                                  │
│  ❌ Header con botones           │
│  ❌ Selector de idioma           │
│  ❌ Botón tema oscuro            │
│  ✅ Contenido principal          │
│  ✅ Info de contacto (.print)    │
│                                  │
│  Además:                         │
│  - Forzar tema claro             │
│  - Evitar page-break en articles │
└──────────────────────────────────┘
```

---

## 🚀 Build Process

```
┌────────────────────────────────────────────────────┐
│              pnpm build                             │
└────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  1. TypeScript Check             │
│     astro check                  │
│     ✅ Validar tipos             │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  2. Escanear páginas             │
│     src/pages/**/*.astro         │
│                                  │
│     index.astro → /              │
│     en/index.astro → /en         │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  3. Renderizar cada página       │
│                                  │
│     Para cada ruta:              │
│     ├─► Ejecutar frontmatter     │
│     ├─► Cargar datos             │
│     ├─► Renderizar componentes   │
│     └─► Generar HTML             │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  4. Optimizar Assets             │
│                                  │
│     ├─► Minificar CSS            │
│     ├─► Bundlear JS              │
│     ├─► Optimizar imágenes       │
│     └─► Copiar public/           │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  5. Generar dist/                │
│                                  │
│     dist/                        │
│     ├─► index.html               │
│     ├─► en/                      │
│     │   └─► index.html           │
│     ├─► _astro/                  │
│     │   ├─► styles.hash.css      │
│     │   └─► scripts.hash.js      │
│     └─► (archivos de public/)    │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  ✅ Listo para Deploy            │
│                                  │
│     - Archivos estáticos         │
│     - Sin servidor necesario     │
│     - Extremadamente rápido      │
└──────────────────────────────────┘
```

---

## 🎯 Puntos Clave para Recordar

### 1. **Frontmatter vs Template vs Scripts**

```
┌─────────────────────────────────────────┐
│  ---                                    │
│  // SERVIDOR (Node.js)                  │
│  const data = await fetch()             │
│  ---                                    │
│                                         │
│  <!-- TEMPLATE (HTML generado) -->     │
│  <div>{data}</div>                      │
│                                         │
│  <script>                               │
│    // CLIENTE (Navegador)               │
│    console.log('Hola')                  │
│  </script>                              │
└─────────────────────────────────────────┘
```

### 2. **Props Flow**

```
Parent.astro
    │
    │ <Child name="Ana" age={25} />
    │
    ▼
Child.astro
    │
    │ const { name, age } = Astro.props
    │
    ▼
    Usar en template
```

### 3. **Importación Dinámica**

```
// ❌ Estática - siempre carga el mismo archivo
import data from './data.json'

// ✅ Dinámica - decide en runtime
const data = await import(`./data.${lang}.json`)
```

### 4. **Routing**

```
src/pages/
├── index.astro          → /
├── about.astro          → /about
└── en/
    ├── index.astro      → /en
    └── about.astro      → /en/about
```

### 5. **i18n Pattern**

```
1. Detectar idioma (URL)
2. Cargar datos del idioma
3. Pasar idioma a componentes
4. Componentes cargan traducciones
5. Renderizar en el idioma correcto
```

---

## 📚 Recursos Visuales Adicionales

### Debugging Tips

```
En Frontmatter (servidor):
console.log() → Aparece en TERMINAL

En <script> (cliente):
console.log() → Aparece en CONSOLA DEL NAVEGADOR
```

### Performance

```
Astro genera:
✅ HTML estático
✅ CSS mínimo
✅ JavaScript solo donde se necesita

Resultado:
⚡ Carga ultrarrápida
⚡ SEO perfecto
⚡ Accesible sin JS
```

---

**¡Domina estas visualizaciones y entenderás completamente cómo fluye la información en tu proyecto! 🎨**
