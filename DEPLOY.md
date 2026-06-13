# Despliegue — secrets y entornos

Guía de configuración para publicar el sitio con GitHub Actions.

## Resumen rápido

| Nombre | ¿Obligatorio? | Dónde se define | Uso |
|--------|---------------|-----------------|-----|
| `GITHUB_TOKEN` | Sí (automático) | Lo inyecta GitHub en cada run | Desplegar artefacto, llamadas a la API |
| `GH_PAGES_TOKEN` | No (recomendado si falla el auto-enable) | **Settings → Secrets and variables → Actions** | Activar Pages y `configure-pages` con `enablement` |
| Entorno `github-pages` | Sí (automático) | **Settings → Environments** | Destino del despliegue |

No hace falta ningún secret para un despliegue normal si Pages ya está activado con **GitHub Actions** como fuente.

---

## Secrets del repositorio

### `GITHUB_TOKEN` (automático)

- **No lo creas tú.** GitHub lo genera en cada ejecución del workflow.
- El workflow lo referencia como `secrets.GITHUB_TOKEN` y `github.token`.
- Permisos requeridos (ya definidos en el workflow):
  - `contents: read`
  - `pages: write`
  - `id-token: write`

### `GH_PAGES_TOKEN` (opcional)

PAT (Personal Access Token) para habilitar GitHub Pages cuando el token por defecto no basta.

**Cuándo usarlo:** si ves `Get Pages site failed` / `Not Found` y ya activaste **Settings → Pages → Source: GitHub Actions**.

#### Cómo crearlo

1. GitHub → **Settings** (tu cuenta) → **Developer settings → Personal access tokens → Fine-grained tokens** (o Classic).
2. Permisos mínimos sobre el repo `Infografia`:
   - **Repository permissions → Administration:** Read and write
   - **Repository permissions → Pages:** Read and write
3. Copia el token.
4. En el repo **Infografia → Settings → Secrets and variables → Actions → New repository secret**:
   - **Name:** `GH_PAGES_TOKEN`
   - **Secret:** pega el token

El workflow lo lee en los pasos de enable, setup y deploy.

---

## Entorno de GitHub Actions

### `github-pages`

El job `deploy` usa:

```yaml
environment:
  name: github-pages
```

GitHub crea este entorno la primera vez que despliegas con Actions. No necesitas variables ni secrets ahí salvo que quieras reglas de aprobación manual.

Opcional en **Settings → Environments → github-pages**:
- **Deployment branches:** limitar a `main`
- **Required reviewers:** si quieres aprobar cada publicación a mano

---

## Variables de entorno en el workflow

El workflow define a nivel de job:

| Variable | Valor | Paso que la usa |
|----------|-------|-----------------|
| `GH_TOKEN` | `secrets.GH_PAGES_TOKEN` o `secrets.GITHUB_TOKEN` | Enable GitHub Pages (`gh api`) |
| `PAGES_ENABLE_TOKEN` | `secrets.GH_PAGES_TOKEN` (vacío si no existe) | Referencia interna |

Los pasos `configure-pages` y `deploy-pages` reciben el token explícitamente:

```yaml
token: ${{ secrets.GH_PAGES_TOKEN || github.token }}
```

`enablement` en `configure-pages` solo se activa si existe `GH_PAGES_TOKEN`.

---

## Configuración manual (primera vez)

Aunque el workflow intente activar Pages por API, en algunos repos hace falta:

1. **Settings → Pages → Build and deployment → Source:** **GitHub Actions**
2. (Opcional) Añadir secret `GH_PAGES_TOKEN` si el paso de enable sigue fallando
3. **Actions → Deploy GitHub Pages → Re-run all jobs**

---

## Añadir infografías al artefacto

Edita `.github/workflows/deploy-pages.yml` en `Upload artifact → path`:

```yaml
path: |
  index.html
  404.html
  algarrobo
  mi-nueva-infografia
```

---

## URL publicada

Tras un despliegue correcto:

- Índice: `https://cesaredul.github.io/Infografia/`
- Algarrobo: `https://cesaredul.github.io/Infografia/algarrobo/`

La URL exacta también aparece en el run del workflow, en el entorno **github-pages**.
