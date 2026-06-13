/**
 * Infografia — helpers de motion y timeline (sin dependencia de D3).
 * Uso: const tl = InfografiaMotion.createTimeline({ eras, onSelect, onDeselect });
 */
(function (global) {
  'use strict';

  const ERA_YEAR_FADE = 300;
  const ERA_YEAR_STAGGER = 55;
  const ERA_SEG_STAGGER = 90;

  function $(id) { return document.getElementById(id); }

  function isMobile() {
    return global.matchMedia('(max-width:768px)').matches;
  }

  function reflow(el) { void el.offsetWidth; }

  function clearWillChange(el) {
    if (el) el.classList.remove('motion-will-change', 'motion-will-change-filter');
  }

  function bindWillChangeCleanup() {
    document.addEventListener('animationend', (e) => {
      const t = e.target;
      if (t.classList?.contains('era-pulse') ||
          t.classList?.contains('tip-in') ||
          t.classList?.contains('tip-out') ||
          t.classList?.contains('dot-bump') ||
          t.classList?.contains('stat-in')) {
        clearWillChange(t);
      }
    });
  }

  function pulseTimeline(selector) {
    const w = document.querySelector(selector || '.tl-wrap');
    if (!w) return;
    w.classList.remove('era-shift');
    reflow(w);
    w.classList.add('era-shift');
    w.addEventListener('animationend', () => w.classList.remove('era-shift'), { once: true });
  }

  function flashMapArea(mapAreaId) {
    const el = $(mapAreaId || 'mapArea');
    if (!el) return;
    el.classList.add('motion-target');
    el.classList.remove('era-pulse');
    reflow(el);
    el.classList.add('era-pulse');
    clearTimeout(el._pulseT);
    el._pulseT = setTimeout(() => el.classList.remove('era-pulse'), 900);
  }

  function animateSidebarStats(era, ids) {
    const y = $(ids?.year || 'sideYear');
    const n = $(ids?.note || 'sideNote');
    if (!y || !n || !era) return;
    y.classList.remove('stat-in', 'motion-will-change');
    n.classList.remove('stat-in', 'motion-will-change');
    reflow(y);
    y.textContent = era.years;
    n.textContent = era.note.substring(0, 90) + '…';
    y.classList.add('stat-in', 'motion-will-change');
    n.classList.add('stat-in', 'motion-will-change');
  }

  function showEraTip(era, animate, ids) {
    if (isMobile()) {
      const tip = $(ids?.tipBox || 'tipBox');
      if (tip) tip.style.display = 'none';
      return;
    }
    const tip = $(ids?.tipBox || 'tipBox');
    const title = $(ids?.tipTitle || 'tipTitle');
    const body = $(ids?.tipBody || 'tipBody');
    if (!tip || !era) return;
    tip.style.display = 'block';
    tip.classList.remove('tip-in', 'tip-out', 'motion-will-change');
    if (animate) {
      reflow(tip);
      tip.classList.add('tip-in', 'motion-will-change');
    }
    if (title) title.textContent = era.years;
    if (body) body.textContent = era.note;
  }

  function clearTip(ids, defaults) {
    const tip = $(ids?.tipBox || 'tipBox');
    const year = $(ids?.sideYear || 'sideYear');
    const note = $(ids?.sideNote || 'sideNote');
    const d = defaults || {};
    if (tip && tip.style.display !== 'none') {
      tip.classList.remove('tip-in');
      tip.classList.add('tip-out', 'motion-will-change');
      tip.addEventListener('animationend', () => {
        tip.style.display = 'none';
        tip.classList.remove('tip-out', 'motion-will-change');
      }, { once: true });
    }
    if (year) year.textContent = d.year || '—';
    if (note) note.textContent = d.note || 'Selecciona un período en el timeline para ver detalles.';
  }

  function updateMobileEraBar(activeEra, eras, ids) {
    const bar = $(ids?.bar || 'mobileEraBar');
    const yearEl = $(ids?.year || 'mobileEraYear');
    const noteEl = $(ids?.note || 'mobileEraNote');
    if (!bar || !yearEl || !noteEl) return;
    if (activeEra < 0) {
      bar.classList.remove('has-era');
      yearEl.textContent = '';
      noteEl.textContent = '';
      yearEl.classList.remove('stat-in', 'motion-will-change');
      noteEl.classList.remove('stat-in', 'motion-will-change');
      return;
    }
    const era = eras[activeEra];
    const wasActive = bar.classList.contains('has-era');
    bar.classList.add('has-era');
    if (wasActive) {
      yearEl.classList.remove('stat-in', 'motion-will-change');
      noteEl.classList.remove('stat-in', 'motion-will-change');
      reflow(yearEl);
    }
    yearEl.textContent = era.years;
    noteEl.textContent = era.note;
    if (wasActive) {
      yearEl.classList.add('stat-in', 'motion-will-change');
      noteEl.classList.add('stat-in', 'motion-will-change');
    }
  }

  function anchorClass(i, n) {
    if (i === 0) return 'anchor-left';
    if (i === n - 1) return 'anchor-right';
    return 'anchor-center';
  }

  function yearX(x, anchor, el) {
    if (anchor === 'anchor-center') return x - el.offsetWidth / 2;
    if (anchor === 'anchor-right') return x - el.offsetWidth;
    return x;
  }

  function createTimeline(options) {
    const eras = options.eras || [];
    const ids = Object.assign({
      columnsRow: 'periodsRow',
      yearsRow: 'yearsRow',
      tlScroll: 'tlScroll',
    }, options.ids || {});

    let activeEra = options.initialEra ?? -1;
    let timelineReady = false;

    function getActiveEra() { return activeEra; }
    function setActiveEra(i) { activeEra = i; }

    function layoutYearMarks(preserveAnim) {
      if (activeEra < 0) return;
      const yr = $(ids.yearsRow);
      const cols = document.querySelectorAll('.tl-col');
      const eraEl = cols[activeEra]?.querySelector('.tl-era');
      if (!yr || !eraEl) return;
      const cr = $(ids.columnsRow);
      if (cr) yr.style.width = cr.offsetWidth + 'px';
      const rowLeft = yr.getBoundingClientRect().left;
      const er = eraEl.getBoundingClientRect();
      const relLeft = er.left - rowLeft;
      const era = eras[activeEra];
      const n = era.subYears.length;
      const marks = yr.querySelectorAll('.tl-year-mark');
      const inset = Math.max(2, n >= 4 ? 4 : 6);

      era.subYears.forEach((_, i) => {
        const sp = marks[i];
        if (!sp) return;
        let x;
        if (n === 1) x = relLeft + er.width / 2;
        else x = relLeft + inset + (i / (n - 1)) * (er.width - 2 * inset);

        const anchor = anchorClass(i, n);
        const anim = preserveAnim && (
          sp.classList.contains('tl-year-show') ? ' tl-year-show' :
          sp.classList.contains('tl-year-enter') ? ' tl-year-enter' : ''
        );
        sp.className = 'tl-year-mark ' + anchor + (anim || '');
        sp.style.setProperty('--year-x', yearX(x, anchor, sp) + 'px');
      });
    }

    function updateYearMarks(animate) {
      const yr = $(ids.yearsRow);
      if (!yr) return;
      if (activeEra < 0) {
        if (animate) {
          yr.classList.add('is-updating');
          setTimeout(() => { yr.innerHTML = ''; yr.classList.remove('is-updating'); }, 320);
        } else {
          yr.innerHTML = '';
        }
        return;
      }
      const era = eras[activeEra];
      const build = () => {
        yr.innerHTML = '';
        era.subYears.forEach((y) => {
          const sp = document.createElement('span');
          sp.className = 'tl-year-mark' + (animate ? ' tl-year-enter' : ' tl-year-show');
          sp.textContent = y;
          yr.appendChild(sp);
        });
        yr.classList.remove('is-updating');
        requestAnimationFrame(() => requestAnimationFrame(() => {
          layoutYearMarks(animate);
          if (animate) {
            yr.querySelectorAll('.tl-year-mark').forEach((sp, i) => {
              sp.classList.add('motion-will-change');
              setTimeout(() => {
                sp.classList.remove('tl-year-enter');
                sp.classList.add('tl-year-show');
              }, 60 + i * ERA_YEAR_STAGGER);
            });
          }
        }));
      };
      if (animate) {
        yr.classList.add('is-updating');
        setTimeout(build, ERA_YEAR_FADE);
      } else {
        build();
      }
    }

    function updateTL() {
      if (!timelineReady) { build(); return; }
      if (global.InfografiaPerf?.isEnabled?.()) global.InfografiaPerf.start('timeline-update');
      document.querySelectorAll('.tl-dot').forEach((d, i) => {
        const on = i === activeEra;
        d.classList.toggle('active', on);
        if (on) {
          d.classList.remove('dot-bump', 'motion-will-change');
          reflow(d);
          d.classList.add('dot-bump', 'motion-will-change');
        }
      });
      document.querySelectorAll('.tl-era').forEach((e, i) => e.classList.toggle('active', i === activeEra));
      document.querySelectorAll('.tl-seg').forEach((s, i) => {
        const on = activeEra > i;
        s.classList.toggle('active', on);
        s.style.setProperty('--seg-delay', on ? (i * ERA_SEG_STAGGER) + 'ms' : '0ms');
      });
      updateYearMarks(true);
      if (global.InfografiaPerf?.isEnabled?.()) {
        global.InfografiaPerf.end('timeline-update');
        global.InfografiaPerf.report();
      }
    }

    function build() {
      const cr = $(ids.columnsRow);
      const yr = $(ids.yearsRow);
      if (!cr) return;
      cr.innerHTML = '';
      cr.className = 'tl-columns';
      if (yr) yr.innerHTML = '';
      const inner = cr.closest('.tl-inner');
      if (inner) inner.style.setProperty('--era-count', eras.length);

      eras.forEach((e, i) => {
        const col = document.createElement('div');
        col.className = 'tl-col';

        const track = document.createElement('div');
        track.className = 'tl-dot-track';

        const d = document.createElement('div');
        d.className = 'tl-dot' + (i === activeEra ? ' active' : '');
        d.onclick = () => select(i);
        track.appendChild(d);

        if (i < eras.length - 1) {
          const s = document.createElement('div');
          s.className = 'tl-seg';
          track.appendChild(s);
        }
        col.appendChild(track);

        const ep = document.createElement('div');
        ep.className = 'tl-era' + (i === activeEra ? ' active' : '');
        ep.innerHTML = `<div class="tl-era-name">${e.name}</div><div class="tl-era-years">${e.years}</div>`;
        ep.onclick = () => select(i);
        col.appendChild(ep);

        cr.appendChild(col);
      });
      timelineReady = true;
      updateYearMarks(false);
    }

    function scrollIntoView(i) {
      if (!isMobile()) return;
      const scroll = $(ids.tlScroll);
      const col = document.querySelectorAll('.tl-col')[i];
      if (scroll && col) col.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setTimeout(() => layoutYearMarks(true), 400);
    }

    function select(i) {
      const prev = activeEra;
      if (activeEra === i) {
        activeEra = -1;
        updateTL();
        if (options.onDeselect) options.onDeselect(prev);
        return;
      }
      activeEra = i;
      updateTL();
      if (options.onSelect) options.onSelect(i, prev);
      scrollIntoView(i);
    }

    return {
      build,
      select,
      updateTL,
      layoutYearMarks,
      getActiveEra,
      setActiveEra,
      isMobile,
    };
  }

  bindWillChangeCleanup();

  global.InfografiaMotion = {
    ERA_YEAR_FADE,
    ERA_YEAR_STAGGER,
    ERA_SEG_STAGGER,
    isMobile,
    pulseTimeline,
    flashMapArea,
    animateSidebarStats,
    showEraTip,
    clearTip,
    updateMobileEraBar,
    createTimeline,
  };
})(window);
