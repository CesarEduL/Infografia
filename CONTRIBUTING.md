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

- Mantén cada infografía **autocontenida** (sin dependencias locales salvo que sean necesarias).
- Prefiere CDNs para librerías (D3, Chart.js, etc.).
- Usa rutas relativas para enlaces internos (`../` para volver al índice).
- No hace falta build ni compilación: HTML estático directo.

## Publicar

```bash
git add .
git commit -m "Añadir infografía: mi-tema"
git push origin main
```

No hace falta editar el workflow: despliega la raíz del repo (`path: .`). `.git` y `.github` se excluyen automáticamente.

### Si el despliegue falla

Error `Get Pages site failed`: activa **Settings → Pages → Source: GitHub Actions**, crea `GH_PAGES_TOKEN` si hace falta (ver [DEPLOY.md](DEPLOY.md)) y reejecuta el workflow.
