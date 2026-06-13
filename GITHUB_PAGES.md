# Guía de GitHub Pages

Cómo publicar y mantener las infografías de este repositorio en la web.

## ¿Qué es GitHub Pages?

[GitHub Pages](https://pages.github.com/) sirve archivos estáticos (HTML, CSS, JS) directamente desde un repositorio de GitHub. No hace falta servidor propio ni hosting de pago.

Este proyecto usa **GitHub Actions** para desplegar automáticamente en cada push a `main`.

---

## URLs del sitio

Como el repositorio se llama `Infografia`, la URL base es:

```
https://cesaredul.github.io/Infografia/
```

| Ruta en el repo | URL pública |
|-----------------|-------------|
| `index.html` | `https://cesaredul.github.io/Infografia/` |
| `algarrobo/index.html` | `https://cesaredul.github.io/Infografia/algarrobo/` |
| `mi-tema/index.html` | `https://cesaredul.github.io/Infografia/mi-tema/` |

**Regla:** cada carpeta con un `index.html` se convierte en una ruta del sitio. Las infografías no necesitan estar relacionadas entre sí.

> Si el repo se llamara `usuario.github.io` (repo especial), la URL base sería `https://usuario.github.io/` sin el nombre del repo. Este proyecto **no** usa ese formato.

---

## Configuración inicial (solo una vez)

### 1. Subir el código a GitHub

```bash
git add .
git commit -m "Configurar sitio de infografías"
git push -u origin main
```

### 2. Activar GitHub Pages

1. Abre el repositorio: https://github.com/CesarEduL/Infografia
2. Ve a **Settings** (pestaña del repo, no de tu cuenta)
3. En el menú lateral, entra en **Pages**
4. En **Build and deployment**:
   - **Source:** selecciona **GitHub Actions**
   - **No** elijas "Deploy from a branch"

```
Settings → Pages → Build and deployment → Source: GitHub Actions
```

Este paso es **obligatorio**. Sin él, el workflow falla con `Get Pages site failed` / `Not Found`.

### 3. Ejecutar el despliegue

El primer push a `main` ya habrá disparado el workflow. Si falló antes de activar Pages:

1. Ve a la pestaña **Actions**
2. Abre el workflow **Deploy GitHub Pages**
3. Pulsa **Re-run all jobs**

### 4. Verificar que funciona

- En **Actions**, el último run debe estar en verde
- En el run, el entorno **github-pages** muestra la URL desplegada
- Abre `https://cesaredul.github.io/Infografia/` en el navegador

El primer despliegue puede tardar 1–3 minutos.

---

## Cómo funciona el despliegue

```
push a main
    ↓
GitHub Actions ejecuta deploy-pages.yml
    ↓
Checkout del código
    ↓
Setup Pages (configure-pages)
    ↓
Empaqueta la raíz del repo (path: .)
    ↓
Deploy a GitHub Pages
    ↓
Sitio actualizado en cesaredul.github.io/Infografia/
```

### Archivo del workflow

`.github/workflows/deploy-pages.yml`

| Paso | Qué hace |
|------|----------|
| **Checkout** | Descarga el código del repo |
| **Detect Pages token** | Comprueba si existe el secret opcional `GH_PAGES_TOKEN` |
| **Enable GitHub Pages** | Solo con `GH_PAGES_TOKEN`: activa Pages por API |
| **Setup Pages** | Prepara la configuración de Pages |
| **Upload artifact** | Empaqueta los archivos estáticos (`path: .`) |
| **Deploy** | Publica el artefacto en GitHub Pages |

Al empaquetar se **excluyen** automáticamente `.git` y `.github`. Los `.md` del repo se suben pero no se muestran como páginas web salvo que alguien navegue a `/README.md` directamente.

### Cuándo se despliega

- Automáticamente en cada **push a `main`**
- Manualmente desde **Actions → Deploy GitHub Pages → Run workflow**

---

## Publicar cambios

### Nueva infografía

1. Crea `mi-tema/index.html`
2. Añade un enlace en el `index.html` de la raíz
3. Commit y push:

```bash
git add .
git commit -m "Añadir infografía: mi-tema"
git push origin main
```

No hace falta editar el workflow: `path: .` incluye todas las carpetas nuevas.

### Actualizar una infografía existente

Edita el HTML, commit y push a `main`. El sitio se actualiza solo.

---

## Vista previa local

Antes de publicar, prueba en tu máquina:

```bash
npx serve .
# o
python -m http.server 8000
```

Abre:

- `http://localhost:3000/` (serve) o `http://localhost:8000/` (python)
- `http://localhost:3000/algarrobo/`

---

## Secrets y tokens

En la mayoría de casos **no necesitas crear ningún secret**.

| Nombre | ¿Necesario? | Descripción |
|--------|-------------|-------------|
| `GITHUB_TOKEN` | Automático | Lo genera GitHub en cada run. Sirve para desplegar. |
| `GH_PAGES_TOKEN` | Opcional | PAT personal solo si quieres activar Pages por API en lugar de la UI |

Detalle técnico de secrets: [DEPLOY.md](DEPLOY.md).

---

## Solución de problemas

### `Get Pages site failed` / `Not Found`

**Causa:** Pages no está activado o la fuente no es GitHub Actions.

**Solución:**
1. **Settings → Pages → Source: GitHub Actions**
2. Reejecuta el workflow

---

### `Resource not accessible by integration` (HTTP 403)

**Causa:** el workflow intentó activar Pages con `GITHUB_TOKEN`, que no tiene permiso de administración.

**Solución:** activa Pages manualmente en **Settings → Pages** (no hace falta `GH_PAGES_TOKEN`). El paso de enable del workflow solo corre si configuraste ese secret.

---

### `Unrecognized named-value: 'secrets'` en el workflow

**Causa:** GitHub no permite `secrets` en condiciones `if:`.

**Solución:** ya corregido en el workflow actual con el paso **Detect Pages token**. Asegúrate de tener la última versión del archivo.

---

### `tar: index.html\n404.html\n... Cannot open`

**Causa:** `upload-pages-artifact` recibió una lista de archivos en lugar de un **directorio**.

**Solución:** el workflow debe usar `path: .` (directorio raíz), no una lista multilínea de archivos.

---

### El sitio no se actualiza tras un push

1. Revisa **Actions** — ¿el run terminó en verde?
2. Espera 1–3 minutos y recarga con Ctrl+Shift+R (caché)
3. Comprueba que el push fue a la rama `main`

---

### La infografía se ve mal embebida en otro sitio

Si la incrustas en un iframe, asegúrate de que el HTML tenga `viewport` y altura flexible. La infografía del algarrobo ya ocupa el alto disponible del viewport.

---

## Checklist rápido

- [ ] Repo en GitHub con rama `main`
- [ ] **Settings → Pages → Source: GitHub Actions**
- [ ] Workflow `.github/workflows/deploy-pages.yml` en el repo
- [ ] Último run de Actions en verde
- [ ] `https://cesaredul.github.io/Infografia/` carga correctamente

---

## Referencias

- [Documentación oficial de GitHub Pages](https://docs.github.com/es/pages)
- [Workflows personalizados para Pages](https://docs.github.com/es/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Guía para añadir infografías](CONTRIBUTING.md)
- [Secrets y detalles del workflow](DEPLOY.md)
