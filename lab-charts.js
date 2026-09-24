/* ══════════════════════════════════════════════
   LabCharts: interactive Chart.js charts for the lab-data pages
   (genetics.html, assay-protocols.html). Replaces the old static
   canvas engine while keeping its call signatures, so each page's
   data stays exactly where it was.

   LabCharts.bar(id, data, opts)            single or grouped bars, error bars, significance
   LabCharts.line(id, series, xLabels, opts) lines with error bars, dashed series
   LabCharts.heatmap(id, rows, cols, matrix, opts)  sortable HTML heatmap with hover readout
   LabCharts.dual(id, cfg)                  dual-axis lines with a highlighted window

   Charts are created when they scroll into view, follow light/dark
   theme, and honour prefers-reduced-motion.
   ══════════════════════════════════════════════ */
(function () {
  'use strict';
  var FONT = "'IBM Plex Sans', -apple-system, sans-serif";
  var MONO = "'IBM Plex Mono', Menlo, monospace";
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var charts = [];

  /* ── helpers ── */
  function alpha(hex, a) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return hex;
    var n = parseInt(m[1], 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  // Text colours follow the chart card's real background, not just the page theme
  // (several chart cards are hard-coded white even in dark mode).
  function palette(node) {
    var el = node, bg = null;
    while (el && el.nodeType === 1) {
      var c = getComputedStyle(el).backgroundColor;
      var m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(c);
      if (m && (m[4] === undefined || +m[4] > 0.5)) { bg = [+m[1], +m[2], +m[3]]; break; }
      el = el.parentElement;
    }
    if (!bg) bg = document.documentElement.classList.contains('dark') ? [17, 19, 24] : [250, 250, 247];
    var dark = (0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]) < 128;
    return dark
      ? { ink: '#e8e6e1', mid: '#9ca3af', grid: 'rgba(255,255,255,0.08)', axis: 'rgba(255,255,255,0.18)', dark: true }
      : { ink: '#0f1419', mid: '#6b7280', grid: 'rgba(15,20,25,0.07)', axis: 'rgba(15,20,25,0.18)', dark: false };
  }
  function fmt(v) { return (Math.abs(v) < 1 && v !== 0) ? (+v).toPrecision(2) : (+v).toLocaleString(undefined, { maximumFractionDigits: 1 }); }

  // Wrap the canvas in a sized box so Chart.js controls both the drawing
  // buffer and the displayed size (prevents stretched text).
  function box(canvas) {
    if (canvas.parentElement.classList.contains('lc-box')) return canvas.parentElement;
    var h = parseInt(canvas.getAttribute('height'), 10) || 320;
    var b = document.createElement('div');
    b.className = 'lc-box';
    b.style.height = Math.max(h, 280) + 'px';
    canvas.parentNode.insertBefore(b, canvas);
    b.appendChild(canvas);
    canvas.removeAttribute('width'); canvas.removeAttribute('height');
    canvas.setAttribute('role', 'img');
    return b;
  }

  // Create on first scroll into view (charts animate when seen; hidden tabs cost nothing)
  function whenVisible(node, fn) {
    if (!('IntersectionObserver' in window)) return fn();
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); fn(); }
    }, { rootMargin: '200px 0px' });
    io.observe(node);
  }

  /* ── plugins: error bars, significance stars, highlighted window ── */
  var errorBars = {
    id: 'lcErrorBars',
    afterDatasetsDraw: function (chart) {
      var ctx = chart.ctx, pal = chart.$lcPal || palette(chart.canvas);
      chart.data.datasets.forEach(function (ds, i) {
        if (!chart.isDatasetVisible(i)) return;
        var meta = chart.getDatasetMeta(i), ys = chart.scales[meta.yAxisID];
        meta.data.forEach(function (el, j) {
          var v = ds.data[j], e = ds.errorBars && ds.errorBars[j], sig = ds.sig && ds.sig[j];
          if (v == null) return;
          var top = el.y;
          if (e) {
            var hi = ys.getPixelForValue(v + e), lo = ys.getPixelForValue(Math.max(v - e, ys.min));
            var half = el.width ? Math.min(6, el.width / 4) : 4;
            ctx.save();
            ctx.strokeStyle = pal.dark ? 'rgba(232,230,225,0.75)' : 'rgba(15,20,25,0.65)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(el.x, lo); ctx.lineTo(el.x, hi);
            ctx.moveTo(el.x - half, hi); ctx.lineTo(el.x + half, hi);
            ctx.moveTo(el.x - half, lo); ctx.lineTo(el.x + half, lo);
            ctx.stroke(); ctx.restore();
            top = Math.min(top, hi);
          }
          if (sig) {
            ctx.save();
            ctx.fillStyle = pal.ink; ctx.font = '600 11px ' + MONO; ctx.textAlign = 'center';
            ctx.fillText(sig, el.x, top - 5);
            ctx.restore();
          }
        });
      });
    }
  };
  var windowZone = {
    id: 'lcWindow',
    beforeDatasetsDraw: function (chart, args, o) {
      if (!o || o.from == null) return;
      var x = chart.scales.x, a = chart.chartArea, ctx = chart.ctx;
      var x1 = x.getPixelForValue(o.from), x2 = x.getPixelForValue(o.to);
      ctx.save();
      ctx.fillStyle = 'rgba(39,174,96,0.09)'; ctx.fillRect(x1, a.top, x2 - x1, a.bottom - a.top);
      ctx.setLineDash([4, 3]); ctx.strokeStyle = 'rgba(39,174,96,0.8)'; ctx.strokeRect(x1, a.top, x2 - x1, a.bottom - a.top);
      ctx.setLineDash([]); ctx.fillStyle = '#27ae60'; ctx.font = '600 10px ' + MONO; ctx.textAlign = 'center';
      ctx.fillText((o.label || '').toUpperCase(), (x1 + x2) / 2, a.top + 14);
      ctx.restore();
    }
  };

  /* ── shared options ── */
  function baseOptions(pal, o) {
    return {
      responsive: true, maintainAspectRatio: false,
      animation: reduced ? false : { duration: 700, easing: 'easeOutCubic' },
      interaction: { mode: o.grouped ? 'index' : 'nearest', intersect: !o.grouped },
      layout: { padding: { top: 18, right: 6 } },
      plugins: {
        title: o.title ? { display: true, text: o.title, color: pal.ink, align: 'start', font: { family: FONT, size: 13, weight: '600' }, padding: { bottom: 10 } } : { display: false },
        legend: {
          display: !!o.legend, position: 'top', align: 'start',
          labels: { color: pal.ink, font: { family: FONT, size: 11 }, usePointStyle: true, pointStyle: 'rectRounded', boxWidth: 10, boxHeight: 10, padding: 12 }
        },
        tooltip: {
          backgroundColor: 'rgba(15,20,25,0.94)', titleColor: '#fff', bodyColor: '#e8e6e1',
          titleFont: { family: FONT, size: 12, weight: '600' }, bodyFont: { family: MONO, size: 11.5 },
          padding: 10, cornerRadius: 6, boxPadding: 4, usePointStyle: true,
          callbacks: {
            label: function (c) {
              var ds = c.dataset, e = ds.errorBars && ds.errorBars[c.dataIndex], s = ds.sig && ds.sig[c.dataIndex];
              var name = ds.fullLabel || ds.label || '';
              return (name ? name + ': ' : '') + fmt(c.parsed.y) + (e ? ' ± ' + fmt(e) : '') + (s ? '   ' + s : '');
            }
          }
        },
        lcWindow: o.window || {}
      },
      scales: {
        x: {
          title: { display: !!o.xLabel, text: o.xLabel, color: pal.mid, font: { family: FONT, size: 11 } },
          ticks: { color: pal.ink, font: { family: FONT, size: 11 }, maxRotation: 45, autoSkip: false },
          grid: { display: false }, border: { color: pal.axis }
        },
        y: {
          beginAtZero: true, max: o.maxVal || undefined,
          title: { display: !!o.yLabel, text: o.yLabel, color: pal.mid, font: { family: FONT, size: 11 } },
          ticks: { color: pal.mid, font: { family: MONO, size: 10.5 } },
          grid: { color: pal.grid }, border: { display: false }
        }
      }
    };
  }

  function make(id, build) {
    var canvas = typeof id === 'string' ? document.getElementById(id) : id;
    if (!canvas || !window.Chart) return;
    var b = box(canvas);
    whenVisible(b, function () {
      var pal = palette(b);
      var cfg = build(pal);
      cfg.plugins = [errorBars, windowZone];
      var ch = new Chart(canvas, cfg);
      ch.$lcPal = pal; ch.$lcBuild = build;
      charts.push(ch);
    });
  }

  /* ── public API ── */
  function bar(id, data, opts) {
    opts = opts || {};
    var grouped = Array.isArray(data[0].val);
    make(id, function (pal) {
      var datasets;
      if (grouped) {
        var n = data[0].val.length;
        datasets = [];
        for (var k = 0; k < n; k++) {
          var col = (opts.colors && opts.colors[k]) || '#c0392b';
          datasets.push({
            label: (opts.legend && opts.legend[k]) || ('Series ' + (k + 1)),
            data: data.map(function (d) { return d.val[k]; }),
            errorBars: data.map(function (d) { return d.err && d.err[0] ? d.err[0][k] : null; }),
            backgroundColor: alpha(col, 0.82), hoverBackgroundColor: col,
            borderRadius: 3, maxBarThickness: 34, categoryPercentage: 0.78, barPercentage: 0.92
          });
        }
      } else {
        datasets = [{
          label: opts.yLabel || '', fullLabel: opts.yLabel || '',
          data: data.map(function (d) { return d.val; }),
          errorBars: data.map(function (d) { return d.err || null; }),
          sig: data.map(function (d) { return d.sig || ''; }),
          backgroundColor: data.map(function (d) { return alpha(d.color || '#c0392b', 0.82); }),
          hoverBackgroundColor: data.map(function (d) { return d.color || '#c0392b'; }),
          borderRadius: 3, maxBarThickness: 46
        }];
      }
      return {
        type: 'bar',
        data: { labels: data.map(function (d) { return d.label; }), datasets: datasets },
        options: baseOptions(pal, { grouped: grouped, legend: grouped && opts.legend, title: opts.title, yLabel: opts.yLabel, xLabel: opts.xLabel, maxVal: opts.maxVal })
      };
    });
  }

  function line(id, series, xLabels, opts) {
    opts = opts || {};
    make(id, function (pal) {
      return {
        type: 'line',
        data: {
          labels: xLabels,
          datasets: series.map(function (s, i) {
            var col = (opts.colors && opts.colors[i]) || '#c0392b';
            return {
              label: (opts.legend && opts.legend[i]) || s.label, fullLabel: s.label,
              data: s.data, errorBars: s.err || null,
              borderColor: col, backgroundColor: col, borderWidth: 2.2,
              borderDash: s.dashed ? [6, 4] : [], tension: 0.3,
              pointRadius: 3.5, pointHoverRadius: 6, pointBackgroundColor: '#fff', pointBorderWidth: 2
            };
          })
        },
        options: baseOptions(pal, { grouped: true, legend: true, title: opts.title, yLabel: opts.yLabel, xLabel: opts.xLabel, maxVal: opts.maxVal })
      };
    });
  }

  function dual(id, cfg) {
    make(id, function (pal) {
      var o = baseOptions(pal, { grouped: true, legend: true, title: cfg.title, xLabel: cfg.xLabel,
        window: cfg.window ? { from: cfg.window[0], to: cfg.window[1], label: cfg.windowLabel || 'Optimal' } : null });
      o.scales.y.max = 100;
      o.scales.y.title = { display: true, text: cfg.a.axis, color: cfg.a.color, font: { family: FONT, size: 11 } };
      o.scales.y.ticks.color = cfg.a.color;
      o.scales.y1 = {
        position: 'right', beginAtZero: true, max: 100,
        title: { display: true, text: cfg.b.axis, color: cfg.b.color, font: { family: FONT, size: 11 } },
        ticks: { color: cfg.b.color, font: { family: MONO, size: 10.5 } }, grid: { display: false }, border: { display: false }
      };
      function ds(s, axis, dashed) {
        return { label: s.label, fullLabel: s.label, data: s.data, errorBars: s.err || null, yAxisID: axis,
          borderColor: s.color, backgroundColor: s.color, borderWidth: 2.5, borderDash: dashed ? [6, 4] : [], tension: 0.3,
          pointRadius: 4, pointHoverRadius: 7, pointBackgroundColor: '#fff', pointBorderWidth: 2 };
      }
      return { type: 'line', data: { labels: cfg.labels, datasets: [ds(cfg.a, 'y', false), ds(cfg.b, 'y1', true)] }, options: o };
    });
  }

  // Heatmap as an accessible HTML table: hover for a readout, click a column to sort rows.
  function heatColor(v, lo, hi) {
    var t, r, g, b;
    if (v > 0) { t = Math.min(v / hi, 1); r = 192 + 28 * (1 - t); g = 57 + 163 * (1 - t); b = 43 + 177 * (1 - t); }
    else { t = Math.min(Math.abs(v) / Math.abs(lo), 1); r = 41 + 179 * (1 - t); g = 128 + 92 * (1 - t); b = 185 + 35 * (1 - t); }
    return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
  }
  function heatmap(id, rows, cols, matrix, opts) {
    opts = opts || {};
    var canvas = typeof id === 'string' ? document.getElementById(id) : id;
    if (!canvas) return;
    var lo = opts.min != null ? opts.min : -2, hi = opts.max != null ? opts.max : 9, unit = opts.unit || '';
    var wrap = document.createElement('div');
    wrap.className = 'lc-heat';
    var order = rows.map(function (_, i) { return i; }), sortCol = -1;

    var scroll = document.createElement('div'); scroll.className = 'lc-heat-scroll';
    var table = document.createElement('table'); table.className = 'lc-heat-table';
    var cap = document.createElement('caption'); cap.textContent = (opts.title || 'Heatmap') + '. Select a column header to sort rows by that column.';
    table.appendChild(cap);
    var thead = document.createElement('thead'), hr = document.createElement('tr');
    var corner = document.createElement('th'); corner.textContent = opts.rowLabel || ''; corner.className = 'lc-heat-corner'; hr.appendChild(corner);
    var colHeads = cols.map(function (c, ci) {
      var th = document.createElement('th'); th.scope = 'col';
      var btn = document.createElement('button'); btn.type = 'button'; btn.textContent = c;
      btn.setAttribute('aria-label', 'Sort rows by ' + c);
      btn.addEventListener('click', function () { sortBy(ci); });
      th.appendChild(btn); hr.appendChild(th); return th;
    });
    thead.appendChild(hr); table.appendChild(thead);
    var tbody = document.createElement('tbody'); table.appendChild(tbody);
    var tip = document.createElement('div'); tip.className = 'lc-tip'; tip.setAttribute('role', 'status');

    var rowEls = rows.map(function (r, ri) {
      var tr = document.createElement('tr');
      var th = document.createElement('th'); th.scope = 'row'; th.textContent = r; tr.appendChild(th);
      cols.forEach(function (c, ci) {
        var v = matrix[ri][ci], td = document.createElement('td');
        td.style.background = heatColor(v, lo, hi);
        td.style.color = Math.abs(v) > 4 ? '#fff' : '#0f1419';
        td.textContent = (v > 0 ? '+' : '') + v.toFixed(1);
        td.tabIndex = 0;
        var fold = Math.pow(2, v), txt = r + ' · ' + c + ': ' + (v > 0 ? '+' : '') + v.toFixed(1) + ' ' + unit +
          (unit.indexOf('log') >= 0 ? '  (' + (fold >= 1 ? fmt(fold) + '× up' : fmt(1 / fold) + '× down') + ')' : '');
        td.setAttribute('aria-label', txt);
        function show() {
          wrap.classList.add('is-hover');
          th.classList.add('is-on'); colHeads[ci].classList.add('is-on'); td.classList.add('is-on');
          tip.textContent = txt; tip.classList.add('is-on');
          var rb = td.getBoundingClientRect(), wb = wrap.getBoundingClientRect();
          tip.style.left = Math.max(4, Math.min(rb.left - wb.left + rb.width / 2, wb.width - 4)) + 'px';
          tip.style.top = (rb.top - wb.top - 6) + 'px';
        }
        function hide() {
          wrap.classList.remove('is-hover');
          th.classList.remove('is-on'); colHeads[ci].classList.remove('is-on'); td.classList.remove('is-on');
          tip.classList.remove('is-on');
        }
        td.addEventListener('mouseenter', show); td.addEventListener('focus', show);
        td.addEventListener('mouseleave', hide); td.addEventListener('blur', hide);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
      return tr;
    });

    function sortBy(ci) {
      sortCol = sortCol === ci ? -1 : ci;
      order = rows.map(function (_, i) { return i; });
      if (sortCol >= 0) order.sort(function (a, b) { return matrix[b][ci] - matrix[a][ci]; });
      order.forEach(function (i) { tbody.appendChild(rowEls[i]); });
      colHeads.forEach(function (h, i) { h.setAttribute('aria-sort', i === sortCol ? 'descending' : 'none'); h.classList.toggle('is-sorted', i === sortCol); });
    }

    scroll.appendChild(table);
    var legend = document.createElement('div'); legend.className = 'lc-heat-legend';
    legend.innerHTML = '<span>' + lo + '</span><span class="lc-heat-ramp" style="background:linear-gradient(90deg,' +
      heatColor(lo, lo, hi) + ',' + heatColor(0, lo, hi) + ' ' + Math.round(100 * -lo / (hi - lo)) + '%,' + heatColor(hi, lo, hi) + ')"></span><span>+' + hi + '</span><span class="lc-heat-unit">' + unit + '</span>';
    wrap.appendChild(scroll); wrap.appendChild(legend); wrap.appendChild(tip);
    canvas.parentNode.replaceChild(wrap, canvas);
  }

  /* ── styles (injected once) ── */
  var css = document.createElement('style');
  css.textContent =
    '.lc-box{position:relative;width:100%}' +
    '.chart-container .lc-box>canvas,.lc-box>canvas{display:block;width:100%!important;height:100%!important;max-width:100%}' +
    '.lc-heat{position:relative;font-family:' + MONO + '}' +
    '.lc-heat-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}' +
    '.lc-heat-table{border-collapse:separate;border-spacing:2px;width:100%;min-width:420px;font-size:11px}' +
    '.lc-heat-table caption{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}' +
    '.lc-heat-table th{font-weight:500;color:#0f1419;padding:4px 8px;white-space:nowrap;transition:color .15s}' +
    '.lc-heat-table tbody th{text-align:right}' +
    '.lc-heat-table thead button{font:inherit;font-size:10.5px;color:inherit;background:none;border:0;border-bottom:1px dashed transparent;padding:2px 0;cursor:pointer}' +
    '.lc-heat-table thead button:hover,.lc-heat-table th.is-sorted button{border-bottom-color:#c0392b;color:#c0392b}' +
    '.lc-heat-table th.is-sorted button::after{content:" \\2193"}' +
    '.lc-heat-table td{text-align:center;padding:7px 4px;border-radius:3px;font-variant-numeric:tabular-nums;transition:opacity .15s,box-shadow .15s;outline:none;cursor:default}' +
    '.lc-heat.is-hover td{opacity:.45}.lc-heat.is-hover td.is-on{opacity:1;box-shadow:0 0 0 2px #0f1419}' +
    '.lc-heat-table th.is-on{color:#c0392b}' +
    '.lc-heat-legend{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:10.5px;color:#6b7280}' +
    '.lc-heat-ramp{flex:0 1 180px;height:10px;border-radius:2px}' +
    '.lc-heat-unit{margin-left:4px}' +
    '.lc-tip{position:absolute;transform:translate(-50%,-100%);background:rgba(15,20,25,.94);color:#fff;font-size:11.5px;padding:7px 10px;border-radius:6px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .12s;z-index:5}' +
    '.lc-tip.is-on{opacity:1}' +
    '@media (prefers-reduced-motion: reduce){.lc-heat-table td,.lc-tip{transition:none}}';
  document.head.appendChild(css);

  /* ── re-theme charts when dark mode is toggled ── */
  new MutationObserver(function () {
    charts.forEach(function (ch) {
      var pal = palette(ch.canvas.parentElement);
      if (pal.dark === ch.$lcPal.dark) return;
      ch.$lcPal = pal;
      var fresh = ch.$lcBuild(pal).options;
      ch.options.plugins.title = fresh.plugins.title;
      ch.options.plugins.legend.labels.color = pal.ink;
      Object.keys(fresh.scales).forEach(function (k) { if (ch.options.scales[k]) ch.options.scales[k] = fresh.scales[k]; });
      ch.update('none');
    });
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  window.LabCharts = { bar: bar, line: line, heatmap: heatmap, dual: dual };
})();
