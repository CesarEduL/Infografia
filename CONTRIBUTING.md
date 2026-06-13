# Guía para añadir infografías

## Convención de carpetas

- Una carpeta por infografía, nombrada en minúsculas y sin espacios.
- Usa guiones para separar palabras: `bosque-seco`, `deforestacion-amazonia`.
- El archivo principal siempre se llama `index.html`.

Eso genera rutas limpias:

```
bosque-seco/index.html  →  /Infografia/bosque-seco
```

## Plantilla mínima

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Título de la infografía</title>
  <link rel="stylesheet" href="../shared/motion.css">
  <style>
    /* estilos */
  </style>
</head>
<body>
  <!-- contenido -->
  <script>
    // scripts (o CDN)
  </script>
</body>
</html>
```

## Registrar en el índice

Edita `index.html` en la raíz y añade un ítem en la lista:

```html
<li>
  <a href="mi-tema/">
    <div class="title">Título visible</div>
    <div class="desc">Breve descripción</div>
  </a>
</li>
```

## Recomendaciones

- Mantén cada infografía **autocontenida** en datos y layout (sin dependencias locales salvo `shared/`).
- Usa **`shared/`** para animaciones y timeline reutilizables (ver abajo).
- Prefiere CDNs para librerías (D3, Chart.js, etc.) — **misma versión** en todas las infografías.
- Usa rutas relativas para enlaces internos (`../` para volver al índice, `../shared/` para assets comunes).
- No hace falta build ni compilación: HTML estático directo.

## Assets compartidos (`shared/`)

Animaciones y timeline centralizados para todas las infografías. El navegador los cachea entre páginas.

| Archivo | Contenido |
|---------|-----------|
| `motion.css` | Keyframes, clases `.tl-*`, tooltips, `prefers-reduced-motion` |
| `motion.js` | `InfografiaMotion.createTimeline()`, helpers UI (`pulseTimeline`, `showEraTip`, …) |
| `d3-motion.js` | Transiciones D3 (`eraTransition`, `interruptLayers`, …) — requiere D3 |

### Plantilla con timeline

```html
<head>
  <link rel="preconnect" href="https://cdnjs.cloudflare.com">
  <link rel="preload" href="../shared/motion.css" as="style">
  <link rel="stylesheet" href="../shared/motion.css">
  <style>/* estilos propios de la infografía */</style>
</head>
<body>
  <!-- HTML con .tl-wrap, #yearsRow, #periodsRow (.tl-columns) -->
  <script src="../shared/motion.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js" defer></script>
  <script src="../shared/d3-motion.js" defer></script>
  <script defer>
    const eras = [/* { name, years, subYears, … } */];

    const timeline = InfografiaMotion.createTimeline({
      eras,
      onSelect(i) {
        InfografiaMotion.showEraTip(eras[i], true);
        InfografiaMotion.pulseTimeline();
        // renderizar capas propias…
      },
      onDeselect() {
        InfografiaMotion.clearTip();
        InfografiaMotion.pulseTimeline();
      },
    });
    timeline.build();
  </script>
</body>
```

Cada infografía conserva sus propias animaciones de contenido (mapa, gráficos); `shared/` cubre el sistema de motion común.

## Publicar

```bash
git add .
git commit -m "Añadir infografía: mi-tema"
git push origin main
```

Cada push a `main` despliega automáticamente en GitHub Pages. No hace falta editar el workflow.

- **Guía de Pages:** [GITHUB_PAGES.md](GITHUB_PAGES.md)
- **Secrets y workflow:** [DEPLOY.md](DEPLOY.md)

### Si el despliegue falla

Consulta la sección [Solución de problemas](GITHUB_PAGES.md#solución-de-problemas) en `GITHUB_PAGES.md`.
