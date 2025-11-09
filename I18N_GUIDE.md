# Sistema de Internacionalización (i18n)

Este portafolio ahora cuenta con soporte completo para múltiples idiomas (Español e Inglés).

## 🌐 Estructura

```
src/
├── i18n/
│   ├── es.json          # Traducciones en español
│   ├── en.json          # Traducciones en inglés
│   └── utils.ts         # Utilidades para i18n
├── pages/
│   ├── index.astro      # Página principal en español
│   └── en/
│       └── index.astro  # Página en inglés
cv.json                   # CV en español
cv.en.json               # CV en inglés
```

## 🚀 Rutas

- **Español (predeterminado)**: `/` o `https://tu-dominio.com`
- **Inglés**: `/en` o `https://tu-dominio.com/en`

## 🎨 Características

- ✅ Cambio de idioma sin alterar el diseño
- ✅ Selector de idioma en la navegación (ES/EN)
- ✅ URLs limpias (español sin prefijo `/es`)
- ✅ Contenido completamente traducido (CV y UI)
- ✅ SEO optimizado para cada idioma
- ✅ Metadatos específicos por idioma

## 📝 Cómo usar

### Cambiar idioma desde la interfaz

En la esquina superior derecha encontrarás botones **ES** y **EN** que te permiten cambiar entre idiomas.

### Agregar nuevos idiomas

1. Crea un nuevo archivo de traducciones en `src/i18n/{idioma}.json`
2. Crea un nuevo archivo CV en `cv.{idioma}.json`
3. Actualiza `astro.config.mjs`:
   ```javascript
   i18n: {
     defaultLocale: 'es',
     locales: ['es', 'en', 'fr'], // Agrega el nuevo idioma
   }
   ```
4. Crea la carpeta de páginas `src/pages/{idioma}/`
5. Actualiza `src/i18n/utils.ts` para incluir el nuevo idioma

### Editar traducciones

Simplemente modifica los archivos JSON en `src/i18n/`:

**src/i18n/es.json**
```json
{
  "nav": {
    "about": "Sobre mi",
    "experience": "Experiencia laboral"
  }
}
```

**src/i18n/en.json**
```json
{
  "nav": {
    "about": "About me",
    "experience": "Work experience"
  }
}
```

## 🛠️ Desarrollo

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Construir para producción
pnpm build
```

## 📄 Actualizar contenido del CV

### Para español
Edita `cv.json`

### Para inglés
Edita `cv.en.json`

Ambos archivos siguen el mismo formato JSON Resume, solo cambia el contenido traducido.
