/* Tour maps: turn each atlas map link in a tour into a small live map beside its text.
 *
 * A tour is plain markdown with links to preset map views on fireatlas.org
 * (…/outlets/webmap/?s=… or …/outlets/3dview/?s=…). This script finds those links
 * and replaces each with a framed copy of that view (the same URL plus &embed=1,
 * which hides the map's own panels), keeping a link to the full map underneath.
 * Without JavaScript the page is unchanged: text and links.
 *
 * Every live map is a WebGL context and browsers only allow a handful per page,
 * so maps load as they approach the viewport and only MAX_LIVE stay loaded; the
 * one farthest from view goes back to a placeholder. 3D views are heavier and
 * load on click.
 */
(function () {
  'use strict';

  var content = document.querySelector('main.content');
  if (!content || !('IntersectionObserver' in window)) return;

  var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var MAX_LIVE = coarse ? 3 : 6;

  function mapInfo(a) {
    var url;
    try { url = new URL(a.href); } catch (e) { return null; }
    if (!/(^|\.)fireatlas\.org$/.test(url.hostname)) return null;
    var m = url.pathname.match(/\/outlets\/([^/]+)\/(index\.html)?$/);
    if (!m || !url.searchParams.get('s')) return null;
    url.searchParams.set('embed', '1');
    return { src: url.href, is3d: m[1] === '3dview' };
  }

  var frames = [];   // {el, src, is3d, label, live}

  function distanceFromView(el) {
    var r = el.getBoundingClientRect();
    return Math.abs((r.top + r.bottom) / 2 - window.innerHeight / 2);
  }

  function unmount(f) {
    if (!f.live) return;
    f.live = false;
    f.el.classList.remove('is-live');
    var iframe = f.el.querySelector('iframe');
    if (iframe) iframe.remove();
  }

  function mount(f) {
    if (f.live) return;
    var live = frames.filter(function (x) { return x.live; });
    if (live.length >= MAX_LIVE) {
      live.sort(function (a, b) { return distanceFromView(b.el) - distanceFromView(a.el); });
      unmount(live[0]);
    }
    var iframe = document.createElement('iframe');
    iframe.src = f.src;
    iframe.title = f.label;
    iframe.setAttribute('allow', 'fullscreen');
    f.el.appendChild(iframe);
    f.el.classList.add('is-live');
    f.live = true;
  }

  // 2D maps load a little before they scroll into view.
  var near = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var f = frames.filter(function (x) { return x.el === entry.target; })[0];
      if (f && !f.is3d) mount(f);
    });
  }, { rootMargin: '300px 0px' });

  function buildFigure(a, info) {
    var label = a.textContent.trim() || (info.is3d ? '3D view' : 'Map');

    var figure = document.createElement('figure');
    figure.className = 'tour-map' + (info.is3d ? ' tour-map--3d' : '');

    var frame = document.createElement('div');
    frame.className = 'tour-map__frame';
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'tour-map__load';
    button.textContent = info.is3d ? 'Show 3D view' : 'Show map';
    frame.appendChild(button);

    var caption = document.createElement('figcaption');
    var name = document.createElement('span');
    name.className = 'tour-map__label';
    name.textContent = label;
    a.textContent = info.is3d ? 'Open full 3D view' : 'Open full map';
    a.target = '_blank';
    a.rel = 'noopener';
    caption.appendChild(name);
    caption.appendChild(a);

    figure.appendChild(frame);
    figure.appendChild(caption);

    var f = { el: frame, src: info.src, is3d: info.is3d, label: label, live: false };
    frames.push(f);
    button.addEventListener('click', function () { mount(f); });
    near.observe(frame);
    return figure;
  }

  // A "stop" is the paragraph that introduces a view plus the map itself, side by side.
  // The link is either at the end of that paragraph or alone in the paragraph after it.
  Array.prototype.slice.call(content.querySelectorAll('a[href]')).forEach(function (a) {
    var info = mapInfo(a);
    if (!info) return;
    var p = a.parentNode;
    if (!p || p.tagName !== 'P') return;

    var stop = p.closest('.tour-stop');
    var marker = document.createComment('');
    p.replaceChild(marker, a);
    var figure = buildFigure(a, info);
    marker.remove();

    if (stop) { stop.appendChild(figure); return; }

    var textP = p;
    if (!p.textContent.trim()) {
      // The link was alone in its paragraph: pair it with the paragraph before.
      var prev = p.previousElementSibling;
      textP = (prev && prev.tagName === 'P') ? prev : null;
    }

    stop = document.createElement('div');
    stop.className = 'tour-stop';
    (textP || p).parentNode.insertBefore(stop, textP || p);
    var text = document.createElement('div');
    text.className = 'tour-stop__text';
    stop.appendChild(text);
    if (textP) text.appendChild(textP);
    if (textP !== p) p.remove();
    stop.appendChild(figure);
  });
})();
