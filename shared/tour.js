/**
 * Infografia — tour guiado reutilizable (Driver.js).
 * Uso: const tour = InfografiaTour.create({ steps, storageKey, onDestroyed });
 */
(function (global) {
  'use strict';

  const DEFAULTS = {
    showProgress: true,
    progressText: '{{current}} de {{total}}',
    nextBtnText: 'Siguiente',
    prevBtnText: 'Anterior',
    doneBtnText: 'Listo',
    popoverClass: 'infografia-tour-popover',
    overlayOpacity: 0.72,
    smoothScroll: true,
    allowClose: true,
    overlayClickBehavior: 'close',
    stagePadding: 6,
    stageRadius: 4,
  };

  function hasSeen(key) {
    if (!key) return false;
    try { return localStorage.getItem(key) === '1'; } catch (_) { return false; }
  }

  function markSeen(key) {
    if (!key) return;
    try { localStorage.setItem(key, '1'); } catch (_) { /* ignore */ }
  }

  function getDriver() {
    return global.driver?.js?.driver;
  }

  function create(options) {
    const driverFn = getDriver();
    if (!driverFn) {
      console.error('[InfografiaTour] driver.js no cargó.');
      return null;
    }

    const storageKey = options.storageKey || null;
    const userDestroyed = options.onDestroyed;
    let instance = null;

    const config = Object.assign({}, DEFAULTS, options.config || {}, {
      steps: options.steps || [],
      onDestroyed: function () {
        if (storageKey) markSeen(storageKey);
        if (typeof userDestroyed === 'function') userDestroyed();
      },
    });

    instance = driverFn(config);

    return {
      start: function () { instance.drive(); },
      destroy: function () { instance.destroy(); },
      hasSeen: function () { return hasSeen(storageKey); },
      instance: instance,
    };
  }

  global.InfografiaTour = {
    create,
    hasSeen,
    markSeen,
  };
})(window);
