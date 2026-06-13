# Despliegue — secrets y entornos

Guía de configuración para publicar el sitio con GitHub Actions.

## Resumen rápido

| Nombre | ¿Obligatorio? | Dónde se define | Uso |
|--------|---------------|-----------------|-----|
| Activación manual de Pages | **Sí (primera vez)** | **Settings → Pages** | Elegir **GitHub Actions** como fuente |
| `GITHUB_TOKEN` | Sí (automático) | Lo inyecta GitHub en cada run | Subir artefacto y desplegar |
| `GH_PAGES_TOKEN` | No | **Settings → Secrets and variables → Actions** | Activar Pages por API (alternativa a la UI) |
| Entorno `github-pages` | Sí (automático) | **Settings → Environments** | Destino del despliegue |

---

## Error 403: `Resource not accessible by integration`

Si ves esto en el paso **Enable GitHub Pages**:

```
gh: Resource not accessible by integration (HTTP 403)
```

**Causa:** el `GITHUB_TOKEN` que genera GitHub Actions **no puede** crear ni configurar el sitio de Pages (falta permiso de administración del repo).

**Solución (elige una):**

### Opción A — Manual (recomendada)

1. Repo **Infografia → Settings → Pages**
2. **Build and deployment → Source:** **GitHub Actions**
3. **Actions → Deploy GitHub Pages → Re-run all jobs**

No necesitas ningún secret extra.

### Opción B — PAT en `GH_PAGES_TOKEN`

Si prefieres que el workflow active Pages por API:

1. Crea un PAT (ver abajo)
2. Guárdalo como secret `GH_PAGES_TOKEN`
3. Reejecuta el workflow

El paso de enable **solo se ejecuta** si existe ese secret.

---

## Secrets del repositorio

### `GITHUB_TOKEN` (automático)

- **No lo creas tú.** GitHub lo genera en cada ejecución.
- Permisos del workflow (ya definidos):
  - `contents: read`
  - `pages: write`
  - `id-token: write`
- Sirve para **desplegar** una vez Pages está activado.
- **No sirve** para activar Pages la primera vez (403).

### `GH_PAGES_TOKEN` (opcional)

PAT con permisos de administración del repositorio.

**Cuándo usarlo:** solo si quieres que el workflow llame a la API para activar Pages. Si activaste Pages desde la UI (opción A), no hace falta.

#### Cómo crearlo

**Fine-grained token** (recomendado):

1. GitHub → tu avatar → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**
2. **Repository access:** Only select repositories → `Infografia`
3. Permisos:
   - **Administration:** Read and write
   - **Pages:** Read and write
4. Genera y copia el token.

**Classic token** (alternativa):

1. **Personal access tokens → Tokens (classic) → Generate new token**
2. Scope: **`repo`** (acceso completo al repositorio)

#### Guardarlo

**Infografia → Settings → Secrets and variables → Actions → New repository secret**

| Name | Value |
|------|-------|
| `GH_PAGES_TOKEN` | el PAT que copiaste |

---

## Cómo lee el workflow los secrets

```yaml
# Solo si existe GH_PAGES_TOKEN — activar Pages por API
- name: Enable GitHub Pages (workflow)
  if: ${{ secrets.GH_PAGES_TOKEN != '' }}
  env:
    GH_TOKEN: ${{ secrets.GH_PAGES_TOKEN }}

# configure-pages: enablement solo con PAT
- uses: actions/configure-pages@v5
  with:
    token: ${{ secrets.GH_PAGES_TOKEN || github.token }}
    enablement: ${{ secrets.GH_PAGES_TOKEN != '' }}

# deploy-pages: PAT o token por defecto
- uses: actions/deploy-pages@v4
  with:
    token: ${{ secrets.GH_PAGES_TOKEN || github.token }}
```

| Paso | Token usado | Condición |
|------|-------------|-----------|
| Enable GitHub Pages | `secrets.GH_PAGES_TOKEN` | Solo si el secret existe |
| Setup Pages | PAT o `github.token` | `enablement` solo con PAT |
| Deploy | PAT o `github.token` | Siempre |

---

## Entorno `github-pages`

El job declara:

```yaml
environment:
  name: github-pages
```

GitHub lo crea al primer despliegue correcto. No requiere secrets propios.

Opcional en **Settings → Environments → github-pages**:
- Limitar despliegues a la rama `main`
- Añadir revisores obligatorios

---

## Checklist primera publicación

- [ ] **Settings → Pages → Source: GitHub Actions**
- [ ] Push a `main` o ejecutar el workflow manualmente
- [ ] (Solo si quieres auto-enable por API) Secret `GH_PAGES_TOKEN` creado
- [ ] Run en verde en **Actions**
- [ ] Sitio accesible en `https://cesaredul.github.io/Infografia/`

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

- Índice: `https://cesaredul.github.io/Infografia/`
- Algarrobo: `https://cesaredul.github.io/Infografia/algarrobo/`

La URL exacta aparece en el run del workflow, en el entorno **github-pages**.
