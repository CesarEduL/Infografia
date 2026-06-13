/**
 * Infografia — transiciones D3 compartidas.
 * Requiere: d3 (global) y motion.js (InfografiaMotion).
 */
(function (global) {
  'use strict';

  const d3 = global.d3;
  if (!d3) return;

  const ERA_DUR = 680;
  const ERA_STAGGER = 55;
  const eraEase = d3.easeCubicInOut;
  const eraSpring = d3.easeBackOut.overshoot(1.15);

  function eraTransition(animate, delay) {
    delay = delay || 0;
    return animate
      ? d3.transition().duration(ERA_DUR).delay(delay).ease(eraEase)
      : d3.transition().duration(0);
  }

  function eraSpringTransition(animate, delay) {
    delay = delay || 0;
    return animate
      ? d3.transition().duration(ERA_DUR + 120).delay(delay).ease(eraSpring)
      : d3.transition().duration(0);
  }

  /** Cancela transiciones en curso antes de iniciar una nueva era. */
  function interruptLayers(svg, layerIds) {
    (layerIds || ['#routesG', '#markersG', '#zoomG']).forEach((id) => {
      const sel = svg.select(id);
      if (!sel.empty()) sel.interrupt();
    });
  }

  global.InfografiaD3Motion = {
    ERA_DUR,
    ERA_STAGGER,
    eraEase,
    eraSpring,
    eraTransition,
    eraSpringTransition,
    interruptLayers,
  };
})(window);
