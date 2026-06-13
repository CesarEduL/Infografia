# Infografías

Colección de infografías interactivas publicadas con [GitHub Pages](https://pages.github.com/).

**Sitio:** https://cesaredul.github.io/Infografia/

## Infografías publicadas

| Ruta | Título |
|------|--------|
| [/algarrobo](https://cesaredul.github.io/Infografia/algarrobo/) | Algarrobo en crisis — Perú |

## Estructura del repositorio

```
Infografia/
├── index.html              # Índice con enlaces a todas las infografías
├── 404.html                # Página de error
├── algarrobo/
│   └── index.html          # → /algarrobo
└── otrainfografia/         # (ejemplo futuro)
    └── index.html          # → /otrainfografia
```

Cada carpeta con `index.html` genera una ruta: `/Infografia/nombre-carpeta/`.

## Documentación

| Archivo | Contenido |
|---------|-----------|
| [GITHUB_PAGES.md](GITHUB_PAGES.md) | **Guía completa:** activar Pages, desplegar, URLs, troubleshooting |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Cómo crear y añadir infografías |
| [DEPLOY.md](DEPLOY.md) | Referencia técnica: secrets, workflow, errores |

## Inicio rápido

### Primera vez (activar GitHub Pages)

1. **Settings → Pages → Build and deployment → Source:** **GitHub Actions**
2. Push a `main` o reejecuta el workflow en **Actions**

Guía detallada: [GITHUB_PAGES.md](GITHUB_PAGES.md#configuración-inicial-solo-una-vez)

### Añadir una infografía

1. Crea `mi-tema/index.html`
2. Enlázala en el `index.html` de la raíz
3. `git push origin main` — se despliega solo

Ver [CONTRIBUTING.md](CONTRIBUTING.md).

### Vista previa local

```bash
npx serve .
# o
python -m http.server 8000
```

Luego visita `http://localhost:8000/algarrobo/`.
