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

Cada infografía vive en su propia carpeta. La URL se genera automáticamente a partir del nombre de la carpeta.

## Añadir una infografía nueva

1. Crea una carpeta con el slug de la ruta (ej. `mi-tema/`).
2. Coloca un `index.html` autocontenido dentro (estilos y scripts inline o por CDN).
3. Agrega un enlace en `index.html` de la raíz.
4. Haz commit y push a `main` — el workflow despliega automáticamente.

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para más detalle.

## Vista previa local

Abre los archivos directamente en el navegador o usa un servidor estático:

```bash
npx serve .
# o
python -m http.server 8000
```

Luego visita `http://localhost:8000/algarrobo/`.

## Despliegue

El workflow `.github/workflows/deploy-pages.yml` publica el sitio en cada push a `main`.

**Secrets, entornos y configuración:** ver [DEPLOY.md](DEPLOY.md).

### Primera vez (obligatorio)

Si el workflow falla con `Get Pages site failed` / `Not Found`, GitHub Pages aún no está activado. Haz esto **una vez**:

1. Ve a **Settings → Pages** en el repositorio.
2. En **Build and deployment → Source**, selecciona **GitHub Actions** (no "Deploy from a branch").
3. (Opcional) Crea el secret `GH_PAGES_TOKEN` — ver [DEPLOY.md](DEPLOY.md).
4. Vuelve a **Actions**, abre el workflow fallido y pulsa **Re-run all jobs**.

### Añadir carpetas al despliegue

Cuando crees una infografía nueva, agrégala en `.github/workflows/deploy-pages.yml` bajo `Upload artifact → path`:

```yaml
path: |
  index.html
  404.html
  algarrobo
  mi-nueva-infografia
```
