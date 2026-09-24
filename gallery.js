/* ══════════════════════════════════════════════
   Consolidated image gallery
   Markup:  <div class="xg" data-xg aria-label="...">
              <figure class="xg-item" data-group="Group name">
                <img src="..." alt="..." loading="lazy">   (or <video src="...">)
                <figcaption>Caption</figcaption>
              </figure> ...
            </div>
   Jump links: <a class="xg-jump" href="#gallery" data-xg-open="Group name">
   Without JS the figures render as a plain grid (see gallery.css).
   ══════════════════════════════════════════════ */
(function () {
  'use strict';

  function el(tag, cls, attrs) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }
  function mediaOf(fig) { return fig.querySelector('img, video'); }
  function captionOf(fig) { var c = fig.querySelector('figcaption'); return c ? c.textContent.trim() : ''; }

  function cloneMedia(src, opts) {
    var n;
    if (src.tagName === 'VIDEO') {
      n = el('video');
      n.src = src.getAttribute('src') + (opts.thumb ? '#t=0.5' : '');
      n.muted = true; n.loop = true; n.playsInline = true;
      n.setAttribute('muted', ''); n.setAttribute('playsinline', '');
      n.preload = 'metadata';
      if (opts.controls) n.controls = true;
      if (opts.autoplay) n.autoplay = true;
    } else {
      n = el('img');
      n.src = src.getAttribute('src');
      n.alt = opts.thumb ? '' : (src.getAttribute('alt') || '');
      if (opts.thumb) n.loading = 'lazy';
    }
    return n;
  }

  function Gallery(root) {
    var items = [].slice.call(root.children).filter(function (c) { return c.classList.contains('xg-item'); });
    if (!items.length) return;
    var groups = [];
    items.forEach(function (it) {
      var g = it.getAttribute('data-group') || 'Images';
      if (groups.indexOf(g) < 0) groups.push(g);
    });
    var current = 0, dialogIndex = 0;

    /* ── Filter chips ── */
    var filters = el('div', 'xg-filters', { role: 'group', 'aria-label': 'Filter images by topic' });
    var chips = [];
    function addChip(label, value, count) {
      var b = el('button', 'xg-chip', { type: 'button', 'aria-pressed': value === '*' ? 'true' : 'false', 'data-value': value });
      b.textContent = label;
      var c = el('span', 'xg-chip-count'); c.textContent = count; b.appendChild(c);
      b.addEventListener('click', function () { filter(value); });
      filters.appendChild(b); chips.push(b);
    }
    if (groups.length > 1) {
      addChip('All', '*', items.length);
      groups.forEach(function (g) {
        addChip(g, g, items.filter(function (it) { return it.getAttribute('data-group') === g; }).length);
      });
    }

    /* ── Stage ── */
    var stage = el('div', 'xg-stage', { role: 'region', 'aria-roledescription': 'carousel', 'aria-label': root.getAttribute('aria-label') || 'Image gallery' });
    var track = el('div', 'xg-track', { tabindex: '0', 'aria-label': 'Use left and right arrow keys to browse images' });
    items.forEach(function (it, i) {
      it.classList.add('xg-slide');
      it.setAttribute('aria-roledescription', 'slide');
      var m = mediaOf(it);
      if (m) {
        if (m.tagName === 'VIDEO') { m.removeAttribute('autoplay'); m.muted = true; m.loop = true; m.playsInline = true; }
        m.addEventListener('click', function () { openDialog(i); });
      }
      track.appendChild(it);
    });
    var prev = el('button', 'xg-nav xg-prev', { type: 'button', 'aria-label': 'Previous image' }); prev.innerHTML = '&#8249;';
    var next = el('button', 'xg-nav xg-next', { type: 'button', 'aria-label': 'Next image' }); next.innerHTML = '&#8250;';
    var hud = el('div', 'xg-hud');
    var counter = el('span', 'xg-counter', { 'aria-live': 'polite' });
    var expand = el('button', 'xg-expand', { type: 'button', 'aria-label': 'View full screen' }); expand.innerHTML = '&#10530; Full screen';
    hud.appendChild(counter); hud.appendChild(expand);
    stage.appendChild(track); stage.appendChild(prev); stage.appendChild(next); stage.appendChild(hud);

    var caption = el('div', 'xg-caption');

    /* ── Filmstrip ── */
    var strip = el('div', 'xg-strip', { role: 'tablist', 'aria-label': 'Image thumbnails' });
    var thumbs = items.map(function (it, i) {
      var b = el('button', 'xg-thumb', { type: 'button', role: 'tab', 'aria-label': 'Image ' + (i + 1) + ': ' + captionOf(it) });
      var m = mediaOf(it);
      if (m) b.appendChild(cloneMedia(m, { thumb: true }));
      b.addEventListener('click', function () { go(i); });
      strip.appendChild(b);
      return b;
    });

    root.appendChild(filters); root.appendChild(stage); root.appendChild(caption); root.appendChild(strip);
    root.classList.add('is-ready');

    /* ── State ── */
    function visible() { return items.map(function (_, i) { return i; }).filter(function (i) { return !items[i].hidden; }); }

    function captionHTML(i) {
      var g = items[i].getAttribute('data-group');
      var span = document.createElement('span'); span.className = 'xg-caption-group'; span.textContent = g;
      var wrap = document.createElement('div');
      if (groups.length > 1) wrap.appendChild(span);
      wrap.appendChild(document.createTextNode(captionOf(items[i])));
      return wrap.innerHTML;
    }

    function update() {
      var vis = visible(), pos = vis.indexOf(current);
      counter.textContent = (pos + 1) + ' / ' + vis.length;
      caption.innerHTML = captionHTML(current);
      prev.disabled = pos <= 0; next.disabled = pos >= vis.length - 1;
      items.forEach(function (it, i) {
        it.setAttribute('aria-label', (vis.indexOf(i) + 1) + ' of ' + vis.length);
        var m = mediaOf(it);
        if (m && m.tagName === 'VIDEO') { if (i === current) { var p = m.play(); if (p && p.catch) p.catch(function () {}); } else m.pause(); }
      });
      thumbs.forEach(function (t, i) { t.setAttribute('aria-current', i === current ? 'true' : 'false'); t.setAttribute('aria-selected', i === current ? 'true' : 'false'); });
      // warm up neighbours so swiping never shows a blank slide
      [vis[pos - 1], vis[pos + 1]].forEach(function (j) { if (j === undefined) return; var m = mediaOf(items[j]); if (m && m.tagName === 'IMG') m.loading = 'eager'; });
      // keep the active thumbnail in view without scrolling the page
      var t = thumbs[current];
      if (t.offsetLeft < strip.scrollLeft) strip.scrollLeft = t.offsetLeft - 8;
      else if (t.offsetLeft + t.offsetWidth > strip.scrollLeft + strip.clientWidth) strip.scrollLeft = t.offsetLeft + t.offsetWidth - strip.clientWidth + 8;
    }

    function go(i, instant) {
      current = i;
      track.scrollTo({ left: items[i].offsetLeft, behavior: instant ? 'instant' : 'smooth' });
      update();
    }
    function step(d) {
      var vis = visible(), pos = vis.indexOf(current) + d;
      if (pos >= 0 && pos < vis.length) go(vis[pos]);
    }
    function filter(value) {
      items.forEach(function (it, i) {
        var show = value === '*' || it.getAttribute('data-group') === value;
        it.hidden = !show; thumbs[i].hidden = !show;
      });
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-value') === value ? 'true' : 'false'); });
      go(visible()[0], true);
    }

    // sync state when the user swipes / scrolls the stage directly
    var scrollTimer;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        var vis = visible(), w = track.clientWidth || 1;
        var idx = vis[Math.max(0, Math.min(vis.length - 1, Math.round(track.scrollLeft / w)))];
        if (idx !== current) { current = idx; update(); }
      }, 90);
    }, { passive: true });
    window.addEventListener('resize', function () { track.scrollTo({ left: items[current].offsetLeft, behavior: 'instant' }); });

    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });
    expand.addEventListener('click', function () { openDialog(current); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      else if (e.key === 'Enter') { e.preventDefault(); openDialog(current); }
    });

    /* ── Fullscreen dialog ── */
    var dialog = el('dialog', 'xg-dialog', { 'aria-label': 'Image viewer' });
    var dClose = el('button', 'xg-close', { type: 'button', 'aria-label': 'Close viewer' }); dClose.innerHTML = '&times;';
    var dCounter = el('div', 'xg-dialog-counter');
    var dMedia = el('div', 'xg-dialog-media');
    var dCaption = el('div', 'xg-dialog-caption');
    var dPrev = el('button', 'xg-nav xg-prev', { type: 'button', 'aria-label': 'Previous image' }); dPrev.innerHTML = '&#8249;';
    var dNext = el('button', 'xg-nav xg-next', { type: 'button', 'aria-label': 'Next image' }); dNext.innerHTML = '&#8250;';
    [dClose, dCounter, dMedia, dCaption, dPrev, dNext].forEach(function (n) { dialog.appendChild(n); });
    document.body.appendChild(dialog);

    function renderDialog() {
      var vis = visible(), pos = vis.indexOf(dialogIndex);
      dMedia.innerHTML = '';
      var m = mediaOf(items[dialogIndex]);
      if (m) dMedia.appendChild(cloneMedia(m, { controls: true, autoplay: true }));
      dCaption.innerHTML = captionHTML(dialogIndex);
      dCounter.textContent = (pos + 1) + ' / ' + vis.length;
      dPrev.disabled = pos <= 0; dNext.disabled = pos >= vis.length - 1;
    }
    function dStep(d) {
      var vis = visible(), pos = vis.indexOf(dialogIndex) + d;
      if (pos >= 0 && pos < vis.length) { dialogIndex = vis[pos]; renderDialog(); }
    }
    function openDialog(i) {
      dialogIndex = i; renderDialog();
      if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
      dClose.focus();
    }
    function closeDialog() { if (dialog.open) dialog.close(); }
    dialog.addEventListener('close', function () { dMedia.innerHTML = ''; go(dialogIndex, true); track.focus({ preventScroll: true }); });
    dClose.addEventListener('click', closeDialog);
    dPrev.addEventListener('click', function () { dStep(-1); });
    dNext.addEventListener('click', function () { dStep(1); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog || e.target === dMedia) closeDialog(); });
    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); dStep(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); dStep(1); }
    });
    var tx = null;
    dialog.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    dialog.addEventListener('touchend', function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(dx) > 45) dStep(dx < 0 ? 1 : -1);
    }, { passive: true });

    root._xg = { filter: filter, go: go, groups: groups };
    update();
  }

  function initAll() {
    [].forEach.call(document.querySelectorAll('[data-xg]'), function (root) { if (!root._xg) Gallery(root); });
  }

  // In-section jump links open the gallery pre-filtered to that topic
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-xg-open]');
    if (!a) return;
    var target = document.querySelector(a.getAttribute('href'));
    var root = target && (target.matches('[data-xg]') ? target : target.querySelector('[data-xg]'));
    if (!root || !root._xg) return;
    e.preventDefault();
    var g = a.getAttribute('data-xg-open');
    root._xg.filter(root._xg.groups.indexOf(g) >= 0 ? g : '*');
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    if (history.replaceState) history.replaceState(null, '', a.getAttribute('href'));
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
  else initAll();
})();
