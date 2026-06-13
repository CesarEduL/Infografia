/**
 * Infografia — perfilado ligero de animaciones.
 * Activar: añadir ?perf=1 a la URL o llamar InfografiaPerf.enable()
 */
(function (global) {
  'use strict';

  let enabled = false;
  const log = [];

  function enable() {
    enabled = true;
    console.info('[InfografiaPerf] Medición activa. Cambia de era para ver tiempos.');
  }

  function start(label) {
    if (!enabled || !global.performance?.mark) return;
    performance.mark(label + ':start');
  }

  function end(label) {
    if (!enabled || !global.performance?.mark) return;
    const endMark = label + ':end';
    performance.mark(endMark);
    try {
      performance.measure(label, label + ':start', endMark);
      const entries = performance.getEntriesByName(label);
      const last = entries[entries.length - 1];
      if (last) {
        log.push({ label, ms: Math.round(last.duration * 10) / 10, at: Date.now() });
        if (log.length > 40) log.shift();
      }
    } catch (_) { /* mark missing */ }
  }

  function report() {
    if (!log.length) {
      console.info('[InfografiaPerf] Sin mediciones. Usa start/end o cambia de era.');
      return log;
    }
    const summary = {};
    log.forEach((e) => {
      if (!summary[e.label]) summary[e.label] = [];
      summary[e.label].push(e.ms);
    });
    const rows = Object.entries(summary).map(([label, vals]) => ({
      etiqueta: label,
      última: vals[vals.length - 1] + ' ms',
      media: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10 + ' ms',
      muestras: vals.length,
    }));
    console.table(rows);
    return log;
  }

  function wrap(fn, label) {
    return function (...args) {
      start(label);
      const out = fn.apply(this, args);
      if (out && typeof out.then === 'function') {
        return out.finally(() => { end(label); report(); });
      }
      end(label);
      return out;
    };
  }

  if (global.location?.search?.includes('perf=1')) enable();

  global.InfografiaPerf = { enable, start, end, report, wrap, isEnabled: () => enabled };
})(window);
