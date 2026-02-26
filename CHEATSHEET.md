# 🚀 Referencia Rápida - Cheatsheet

> Guía de consulta rápida con comandos, sintaxis y patrones comunes

---

## 📦 Comandos Principales

```bash
# Desarrollo
pnpm dev                    # Iniciar servidor dev en localhost:4321
pnpm dev --host            # Exponer a red local
pnpm dev --port 3000       # Cambiar puerto

# Build
pnpm build                 # Construir para producción → dist/
pnpm preview               # Vista previa del build

# Validación
pnpm astro check           # Verificar errores TypeScript
pnpm astro check --watch   # Modo watch

# Astro CLI
pnpm astro add <integration>  # Agregar integración
pnpm astro sync               # Sincronizar tipos
```

---

## 📝 Sintaxis Astro Básica

### Estructura de Componente

```astro
---
// FRONTMATTER (Servidor)
import Component from './Component.astro'
const data = await fetchData()
const { prop1, prop2 } = Astro.props
---

<!-- TEMPLATE (HTML) -->
<div>
  <h1>{data.title}</h1>
  <Component prop={prop1} />
</div>

<!-- ESTILOS (Scoped por defecto) -->
<style>
  h1 { color: blue; }
</style>

<!-- SCRIPTS (Cliente) -->
<script>
  console.log('Hola desde navegador')
</script>
```

### Props

```astro
---
// Definir tipos
interface Props {
  title: string
  count?: number
  items: string[]
}

// Recibir con defaults
const { 
  title, 
  count = 0,
  items = []
} = Astro.props
---

<!-- Usar -->
<h1>{title}</h1>
<p>Count: {count}</p>
```

### Renderizado Condicional

```astro
---
const isActive = true
const items = [1, 2, 3]
---

<!-- AND -->
{isActive && <p>Activo</p>}

<!-- Ternario -->
{isActive ? <p>Sí</p> : <p>No</p>}

<!-- Guard -->
{items.length > 0 && (
  <ul>{items.map(i => <li>{i}</li>)}</ul>
)}
```

### Loops

```astro
---
const users = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Juan' }
]
---

<ul>
  {users.map(user => (
    <li key={user.id}>{user.name}</li>
  ))}
</ul>
```

### Slots

```astro
<!-- Component.astro -->
<div class="wrapper">
  <slot />  <!-- Contenido por defecto -->
  <slot name="footer" />  <!-- Slot nombrado -->
</div>

<!-- Uso -->
<Component>
  <p>Contenido principal</p>
  <div slot="footer">Footer content</div>
</Component>
```

---

## 🎨 Estilos

### Scoped (por defecto)

```astro
<div class="card">Content</div>

<style>
  .card {
    /* Solo afecta este componente */
    padding: 1rem;
  }
</style>
```

### Global

```astro
<style is:global>
  body {
    /* Afecta todo el sitio */
    margin: 0;
  }
</style>
```

### class:list

```astro
---
const isActive = true
const type = 'primary'
---

<div class:list={[
  'base',
  { active: isActive },
  `type-${type}`
]}>
  <!-- clase final: "base active type-primary" -->
</div>
```

### Variables CSS

```astro
<style>
  :root {
    --color-primary: #2563eb;
  }
  
  .card {
    background: var(--color-primary);
  }
</style>
```

---

## 📁 Imports

```astro
---
// Componente Astro
import Header from './Header.astro'

// JSON
import data from './data.json'
import { basics } from '@cv'

// TypeScript/JavaScript
import { helper } from './utils.ts'
import type { User } from './types'

// Dinámico
const module = await import(`./data.${lang}.json`)
const { default: data } = module

// Alias (configurados en tsconfig.json)
import Component from '@/components/Component.astro'
---
```

---

## 🌐 i18n Patterns

### Detectar idioma

```astro
---
const lang = Astro.url.pathname.startsWith('/en') ? 'en' : 'es'
---
```

### Cargar datos por idioma

```astro
---
const cvModule = lang === 'en' 
  ? await import('../../../cv.en.json')
  : await import('../../../cv.json')

const { basics } = cvModule.default
---
```

### Usar traducciones

```astro
---
import { useTranslations } from '@/i18n/utils'

const t = useTranslations(lang as 'es' | 'en')
---

<h1>{t('hero.title')}</h1>
```

### Links entre idiomas

```astro
<a href="/">ES</a>
<a href="/en">EN</a>
```

---

## 🔧 Astro.* API

```astro
---
// URL actual
Astro.url.pathname        // "/en/about"
Astro.url.href           // "https://site.com/en/about"

// Props del componente
Astro.props               // { title: "...", ... }

// Redirect
return Astro.redirect('/new-page')

// Response
return new Response('Hello', {
  status: 200,
  headers: { 'Content-Type': 'text/plain' }
})

// Request
Astro.request.headers.get('User-Agent')
---
```

---

## 📦 Directivas de Cliente

```astro
---
import ReactComponent from './React.jsx'
---

<!-- No carga JS -->
<ReactComponent />

<!-- Carga inmediata -->
<ReactComponent client:load />

<!-- Carga cuando es visible -->
<ReactComponent client:visible />

<!-- Carga cuando el navegador está idle -->
<ReactComponent client:idle />

<!-- Solo HTML (no hidrata) -->
<ReactComponent client:only="react" />
```

---

## 🗂️ Routing

```
src/pages/
├── index.astro              → /
├── about.astro              → /about
├── blog/
│   ├── index.astro          → /blog
│   ├── [slug].astro         → /blog/cualquier-cosa
│   └── [...path].astro      → /blog/a/b/c
└── api/
    └── data.json.ts         → /api/data.json
```

### Parámetros dinámicos

```astro
---
// [slug].astro
export async function getStaticPaths() {
  return [
    { params: { slug: 'post-1' } },
    { params: { slug: 'post-2' } },
  ]
}

const { slug } = Astro.params
---

<h1>Post: {slug}</h1>
```

### Rest parameters

```astro
---
// [...path].astro
const { path } = Astro.params
// URL: /blog/2024/01/post
// path = "2024/01/post"
---
```

---

## 📊 Trabajar con Datos

### Fetch en servidor

```astro
---
const response = await fetch('https://api.example.com/data')
const data = await response.json()
---

<div>{data.title}</div>
```

### Importar JSON local

```astro
---
import data from './data.json'
const { items } = data
---
```

### Transformar datos

```astro
---
import { work } from '@cv'

const recentWork = work
  .filter(job => job.endDate === null)
  .slice(0, 3)
  .map(job => ({
    ...job,
    year: new Date(job.startDate).getFullYear()
  }))
---
```

---

## 🎭 Patrones Comunes

### Layout Pattern

```astro
<!-- layouts/Base.astro -->
---
const { title } = Astro.props
---
<!DOCTYPE html>
<html>
  <head>
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>

<!-- page.astro -->
---
import Base from '@/layouts/Base.astro'
---
<Base title="Mi Página">
  <h1>Contenido</h1>
</Base>
```

### Component Composition

```astro
<!-- Card.astro -->
---
const { variant = 'default' } = Astro.props
---
<div class={`card card-${variant}`}>
  <slot name="header" />
  <slot />
  <slot name="footer" />
</div>

<!-- Uso -->
<Card variant="primary">
  <h3 slot="header">Título</h3>
  <p>Contenido</p>
  <button slot="footer">Acción</button>
</Card>
```

### Data Loading Pattern

```astro
---
interface Props {
  lang?: string
}

const { lang = 'es' } = Astro.props

// Cargar datos según idioma
async function getData(lang: string) {
  const module = await import(`../../data.${lang}.json`)
  return module.default
}

const data = await getData(lang)
---

<div>{data.content}</div>
```

---

## 🔍 Debugging

### Console logs

```astro
---
// Aparece en TERMINAL
console.log('Servidor:', Astro.url)
---

<script>
  // Aparece en CONSOLA DEL NAVEGADOR
  console.log('Cliente:', window.location)
</script>
```

### Inspeccionar props

```astro
---
console.log('Props recibidas:', Astro.props)
---

<pre>{JSON.stringify(Astro.props, null, 2)}</pre>
```

---

## 🚀 Optimización

### Lazy loading images

```astro
<img src={image} alt={alt} loading="lazy" />
```

### Preload crítico

```astro
---
const criticalImage = '/hero.jpg'
---
<link rel="preload" as="image" href={criticalImage} />
```

### Código inline crítico

```astro
<style is:inline>
  /* CSS crítico inline */
  body { margin: 0; }
</style>
```

---

## 🛠️ TypeScript

### Tipos para props

```astro
---
interface Props {
  title: string
  count?: number
  items: Array<{
    id: number
    name: string
  }>
}

const { title, count = 0, items } = Astro.props
---
```

### Type imports

```astro
---
import type { User, Post } from './types'

const users: User[] = []
const posts: Post[] = []
---
```

### Assertion

```astro
---
const data = JSON.parse(jsonString) as MyType
---
```

---

## 📱 Responsive

```astro
<style>
  /* Mobile first */
  .container {
    padding: 1rem;
  }
  
  /* Tablet */
  @media (min-width: 768px) {
    .container {
      padding: 2rem;
    }
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    .container {
      padding: 3rem;
      max-width: 1200px;
    }
  }
  
  /* Print */
  @media print {
    .no-print {
      display: none !important;
    }
  }
</style>
```

---

## 🎯 Best Practices

### ✅ DO

```astro
---
// Importar al inicio
import Component from './Component.astro'

// Lógica de servidor en frontmatter
const data = await fetchData()

// Props con tipos
interface Props {
  title: string
}
---

<!-- HTML semántico -->
<section>
  <h1>{title}</h1>
</section>
```

### ❌ DON'T

```astro
<!-- NO uses fetchData() en el template -->
<div>{await fetchData()}</div>

<!-- NO uses inline styles excesivos -->
<div style="color: red; font-size: 16px; ...">

<!-- NO olvides alt en imágenes -->
<img src={image} />
```

---

## 🔑 Keyboard Shortcuts (en VS Code)

```
Cmd/Ctrl + P         → Buscar archivo
Cmd/Ctrl + Shift + P → Command Palette
Cmd/Ctrl + B         → Toggle sidebar
Cmd/Ctrl + `         → Toggle terminal
Cmd/Ctrl + /         → Comentar línea
```

---

## 📚 Links Útiles

- **Docs oficiales**: https://docs.astro.build
- **Ejemplos**: https://astro.build/themes
- **Discord**: https://astro.build/chat
- **GitHub**: https://github.com/withastro/astro

---

## 🎓 Resumen de tu Proyecto

### Estructura de Páginas

```
/           → src/pages/index.astro      (Español)
/en         → src/pages/en/index.astro   (Inglés)
```

### Flujo i18n

```
1. Usuario visita /en
2. Detectar lang='en' desde URL
3. Cargar cv.en.json
4. Cargar i18n/en.json
5. Pasar lang="en" a componentes
6. Componentes usan t('key') para traducciones
7. Renderizar HTML en inglés
```

### Archivos Clave

```
astro.config.mjs     → Configuración i18n
cv.json / cv.en.json → Datos del CV
src/i18n/            → Traducciones
src/layouts/         → Template HTML
src/components/      → Componentes reutilizables
src/pages/           → Rutas del sitio
```

---

**¡Guarda este cheatsheet como referencia rápida! 📖**
