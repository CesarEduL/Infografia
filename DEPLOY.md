# Despliegue — referencia técnica

Guía técnica de secrets, tokens y el workflow de GitHub Actions.

**Tutorial paso a paso:** [GITHUB_PAGES.md](GITHUB_PAGES.md)

---

## Resumen

| Nombre | ¿Obligatorio? | Dónde se define | Uso |
|--------|---------------|-----------------|-----|
| Activación manual de Pages | **Sí (primera vez)** | **Settings → Pages** | Elegir **GitHub Actions** como fuente |
| `GITHUB_TOKEN` | Sí (automático) | Lo inyecta GitHub en cada run | Subir artefacto y desplegar |
| `GH_PAGES_TOKEN` | No | **Settings → Secrets and variables → Actions** | Activar Pages por API (alternativa a la UI) |
| Entorno `github-pages` | Sí (automático) | **Settings → Environments** | Destino del despliegue |

---

## `GITHUB_TOKEN` (automático)

- **No lo creas tú.** GitHub lo genera en cada ejecución.
- Permisos del workflow (definidos en `deploy-pages.yml`):

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

- Sirve para **desplegar** una vez Pages está activado.
- **No sirve** para activar Pages la primera vez (error 403).

---

## `GH_PAGES_TOKEN` (opcional)

PAT con permisos de administración del repositorio. Solo necesario si quieres que el workflow active Pages por API en lugar de hacerlo desde la UI.

### Crear un fine-grained token

1. GitHub → tu avatar → **Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. **Repository access:** Only select repositories → `Infografia`
3. Permisos:
   - **Administration:** Read and write
   - **Pages:** Read and write
4. Genera y copia el token.

### Guardarlo

**Infografia → Settings → Secrets and variables → Actions → New repository secret**

| Name | Value |
|------|-------|
| `GH_PAGES_TOKEN` | el PAT que copiaste |

---

## Cómo lee el workflow los secrets

GitHub **no permite** usar `secrets` en condiciones `if:`. El workflow usa un paso intermedio:

```yaml
- name: Detect Pages token
  id: pages-token
  env:
    GH_PAGES_TOKEN: ${{ secrets.GH_PAGES_TOKEN }}
  run: |
    if [ -n "$GH_PAGES_TOKEN" ]; then
      echo "present=true" >> "$GITHUB_OUTPUT"
    else
      echo "present=false" >> "$GITHUB_OUTPUT"
    fi

- name: Enable GitHub Pages (workflow)
  if: steps.pages-token.outputs.present == 'true'
  env:
    GH_TOKEN: ${{ secrets.GH_PAGES_TOKEN }}
```

| Paso | Token | Condición |
|------|-------|-----------|
| Detect Pages token | vía `env` | Siempre |
| Enable GitHub Pages | `GH_PAGES_TOKEN` | Solo si `present == true` |
| Setup Pages | PAT o `github.token` | `enablement` solo con PAT |
| Deploy | PAT o `github.token` | Siempre |

---

## Artefacto

```yaml
- uses: actions/upload-pages-artifact@v3
  with:
    path: .
```

- `path` debe ser un **directorio**, no una lista de archivos.
- `.git` y `.github` se excluyen al empaquetar.
- Las infografías nuevas se incluyen solas; no hace falta editar el workflow.

---

## Entorno `github-pages`

```yaml
environment:
  name: github-pages
  url: ${{ steps.deployment.outputs.page_url }}
```

GitHub lo crea al primer despliegue correcto. Opcional en **Settings → Environments → github-pages**:

- Limitar despliegues a `main`
- Añadir revisores obligatorios

---

## Errores frecuentes

| Error | Causa | Solución |
|-------|-------|----------|
| `Get Pages site failed` / `Not Found` | Pages no activado | **Settings → Pages → GitHub Actions** |
| `Resource not accessible by integration` (403) | `GITHUB_TOKEN` no puede activar Pages | Activar desde la UI o usar `GH_PAGES_TOKEN` |
| `Unrecognized named-value: 'secrets'` | `secrets` en un `if:` | Usar output de paso intermedio (ya corregido) |
| `tar: index.html\n... Cannot open` | `path` con lista de archivos | Usar `path: .` |

Más contexto: [GITHUB_PAGES.md](GITHUB_PAGES.md#solución-de-problemas)

---

## URLs

- Índice: `https://cesaredul.github.io/Infografia/`
- Algarrobo: `https://cesaredul.github.io/Infografia/algarrobo/`

La URL exacta aparece en cada run de Actions, en el entorno **github-pages**.
