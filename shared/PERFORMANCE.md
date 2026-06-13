# Rendimiento de animaciones — Infografia

Análisis del perfil de coste en `algarrobo` y recomendación sobre librerías externas.

## Ranking de coste (mayor → menor)

| # | Componente | Coste | Por qué |
|---|------------|-------|---------|
| 1 | **Blur SVG** (`feGaussianBlur` en regiones + `filter: url(#glow)`) | Muy alto | Cada frame repinta bitmaps filtrados; no va por GPU como `transform` |
| 2 | **`renderEraLayers` destroy/recreate** | Alto | `selectAll('*').remove()` en rutas y marcadores en cada cambio de era |
| 3 | **`getTotalLength()`** en rutas animadas | Medio-alto | Fuerza cálculo de geometría SVG sincrónicamente |
| 4 | **`filter: brightness` en `.map-area`** (era-pulse) | Medio | Repinta toda el área del mapa |
| 5 | **`dotRing` infinito** en punto activo | Medio-bajo | Animación continua en GPU |
| 6 | **Timeline CSS** (transform/opacity) | Bajo | Bien optimizado con `translate3d` y `shared/motion.css` |
| 7 | **D3 transitions** (opacity, stroke, r) | Bajo-medio | Aceptable con `interruptLayers()` |

## ¿GSAP / Motion One ayudarían?

**No para la velocidad pura (FPS).** El cuello de botella está en filtros SVG y repintado del mapa, no en la orquestación de tweens.

| Librería | ¿Compensa aquí? | Motivo |
|----------|-----------------|--------|
| GSAP (~50 KB) | No prioritario | Ya tienes D3 transitions + CSS; no elimina coste de blur SVG |
| Motion One (~5 KB) | No prioritario | Igual; útil si migras todo el timeline a una sola API |
| React/Vue | No | Añade runtime sin mejorar composición GPU |

**Sí compensa** si en el futuro necesitas timelines encadenados muy complejos (scroll-driven, secuencias de 20+ pasos). Para 5 eras + mapa D3, el stack actual es adecuado.

## Optimizaciones aplicadas

1. **Caché de features** por región — evita `find()` repetido
2. **Data join D3** en rutas/marcadores — reutiliza nodos en lugar de borrar todo
3. **`mapPulse` con overlay** — sustituye `filter: brightness` por capa semitransparente
4. **`dotRing` finito** (2 pulsos) — mismo efecto inicial, sin GPU continua
5. **`will-change` solo temporal** — no permanente en marcas de año
6. **`InfografiaPerf`** — medición opcional con `?perf=1` en la URL

## Cómo medir

```
https://…/algarrobo/?perf=1
```

Abre la consola, cambia de era varias veces. Verás tabla con duración de `era-transition`, `era-layers`, `timeline-update`.

## Si aún hay tirones

1. Reducir `stdDeviation` en blur de regiones (visual más sutil, mucho más fluido)
2. Quitar `filter: url(#glow)` de rutas durante el trazo animado
3. En móvil: clase `.perf-lite` que desactiva blur de regiones (ya preparado en CSS)
