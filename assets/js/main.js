/* Leana Hub Guest House — page behaviour.
   GSAP + ScrollTrigger for the scroll scenes, Flip-style zoom into the room view, and the stay planner.
   Everything here enhances a page that already reads and works without it. */
(function () {
  'use strict';

  var root = document.documentElement;
  var motion = root.classList.contains('motion') && !!window.gsap;
  if (!window.gsap) root.classList.remove('motion');
  window.__lhReady = true;

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------------
     The six rooms. Photo-to-room mapping and the nicknames are a best
     reading of the Booking.com gallery: confirm with Leana before launch.
     ------------------------------------------------------------------ */
  var IMG = 'assets/img/';
  var ROOMS = [
    {
      id: 'slate', name: 'The Slate Room', nick: 'Slate', type: 'Double room with private bathroom',
      beds: 'One double bed', sleeps: 2,
      colour: { bg: '#3b4246', ghost: '#465055', ink: '#eceae4', muted: '#c3c6c4' },
      text: 'A grey feature wall, two framed prints in red and the old pine floor, with the en-suite through the door.',
      photos: [
        ['room-slate-1', 1600, 800, 'The Slate Room with its en-suite bathroom through the open door'],
        ['room-slate-2', 1200, 640, 'The bed in the Slate Room, a teal cushion against a padded headboard'],
        ['room-slate-4', 1600, 800, 'A mirror, an ottoman and the foot of the bed in the Slate Room'],
        ['room-slate-3', 1200, 640, 'Rolled towels and a reed diffuser on the bed in the Slate Room']
      ]
    },
    {
      id: 'navy', name: 'The Navy Room', nick: 'Navy', type: 'Small double room',
      beds: 'One double bed', sleeps: 2,
      colour: { bg: '#1c2440', ghost: '#283255', ink: '#ece9e2', muted: '#c2c5d6' },
      text: 'A tufted navy headboard, mustard and cobalt cushions, gilt-framed landscapes and two warm lamps.',
      photos: [
        ['room-navy-1', 1600, 800, 'The navy velvet headboard with mustard and cobalt cushions'],
        ['room-navy-2', 1600, 800, 'The Navy Room with its desk, kettle and the door to the en-suite'],
        ['room-navy-3', 1600, 800, 'The Navy Room with its wardrobe, armchair and air-conditioner']
      ]
    },
    {
      id: 'protea', name: 'The Protea Room', nick: 'Protea', type: 'Family room',
      beds: 'A large double and a single', sleeps: 3,
      colour: { bg: '#5e3236', ghost: '#6d3e42', ink: '#f1e6e2', muted: '#dcc4c0' },
      text: 'Protea prints on a charcoal wall, a striped runner, a wingback chair and a dark-wood headboard.',
      photos: [
        ['room-protea-1', 1600, 800, 'The Protea Room: protea prints above a dark-wood headboard'],
        ['room-protea-2', 1600, 800, 'The Protea Room with its basin, wingback chair and bed'],
        ['room-protea-3', 1600, 800, 'A desk, a TV and the striped runner in the Protea Room'],
        ['room-protea-4', 1600, 800, 'The beds and the wingback chair in the Protea Room']
      ]
    },
    {
      id: 'pine', name: 'The Pine Room', nick: 'Pine', type: 'Family room with garden view',
      beds: 'A large double and two singles', sleeps: 4,
      colour: { bg: '#6b4a2e', ghost: '#7a5638', ink: '#f3ebe0', muted: '#e6d4bf' },
      text: 'Room for four: a writing desk by the window, a wingback chair and a second room through the doorway.',
      photos: [
        ['room-pine-1', 1600, 800, 'The Pine Room: a desk, a TV and a second room through the doorway'],
        ['room-pine-2', 1600, 800, 'The writing desk and wingback chair on the pine floor']
      ]
    },
    {
      id: 'olive', name: 'The Olive Room', nick: 'Olive', type: 'Small double room',
      beds: 'One double bed', sleeps: 2,
      colour: { bg: '#46501f', ghost: '#545f29', ink: '#eef0e2', muted: '#d3d7ba' },
      text: 'An olive velvet headboard, tropical cushions, and an en-suite with a round iron mirror.',
      photos: [
        ['room-olive-1', 1600, 800, 'The olive velvet headboard with tropical-print cushions'],
        ['room-olive-2', 1600, 800, 'The Olive Room with the en-suite and its round mirror'],
        ['room-olive-3', 1600, 800, 'Towels and a reed diffuser on the bed in the Olive Room']
      ]
    },
    {
      id: 'linen', name: 'The Linen Room', nick: 'Linen', type: 'Budget double room',
      beds: 'One double bed', sleeps: 2,
      colour: { bg: '#d6cdbd', ghost: '#c9bea9', ink: '#2b2216', muted: '#5a4a37' },
      text: 'The simplest room in the house: soft linen, a protea cushion, lilac curtains and a reading lamp.',
      photos: [
        ['room-linen-1', 1600, 800, 'The bed in the Linen Room with a protea cushion and a lamp'],
        ['room-linen-2', 1600, 800, 'The Linen Room with lilac curtains and a bedside lamp']
      ]
    }
  ];
  var EVERY_ROOM = ['En-suite', 'Air-con', 'Bar fridge', 'Tea and coffee', 'Desk', 'TV', 'Free Wi-Fi'];
  var byId = {};
  ROOMS.forEach(function (r) { byId[r.id] = r; });

  var BOOKING = 'https://www.booking.com/hotel/za/leana-hub-guest-house.en-gb.html';
  var PHONE_WA = '27792962187';
  var TZ = 'Africa/Johannesburg';

  if (motion) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'expo.out', duration: 0.8 });
  }

  /* ---------------- navigation ---------------- */
  var nav = $('[data-nav]');
  var lastY = window.scrollY;
  function onScrollNav() {
    var y = window.scrollY;
    nav.classList.toggle('is-solid', y > 24);
    if (y > 700 && y > lastY + 4) nav.classList.add('is-hidden');
    else if (y < lastY - 4 || y < 700) nav.classList.remove('is-hidden');
    lastY = y;
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  var menu = $('[data-menu]');
  var menuBtn = $('[data-menu-open]');
  if (menu && menu.showModal) {
    menuBtn.addEventListener('click', function () { menu.showModal(); menuBtn.setAttribute('aria-expanded', 'true'); });
    $('[data-menu-close]').addEventListener('click', function () { menu.close(); });
    menu.addEventListener('close', function () { menuBtn.setAttribute('aria-expanded', 'false'); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { menu.close(); }); });
  }

  /* ---------------- 1 · hero: the arch opens to the whole lounge ---------------- */
  var hero = $('[data-hero]');
  if (motion && hero) {
    var heroImg = $('.hero__img', hero);
    var title = $('.hero__title', hero);
    var aside = $('.hero__aside', hero);
    var caption = $('[data-hero-caption]', hero);

    // load sequence: settled by 1.2s, four parts
    var intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
    intro
      .from($('[data-hero-window]', hero), { opacity: 0, duration: 1.1 }, 0)
      .from(heroImg, { scale: 1.2, duration: 1.2 }, 0)
      .from($$('.line', title), { yPercent: 60, opacity: 0, duration: 0.9, stagger: 0.09 }, 0.1)
      .from(aside.children, { y: 18, opacity: 0, duration: 0.8, stagger: 0.07 }, 0.3);

    var heroTl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 0.6,
        onUpdate: function (st) { window.dispatchEvent(new CustomEvent('lh:hero', { detail: st.progress })); }
      }
    });
    heroTl
      .fromTo(hero, { '--open': 0 }, { '--open': 1, duration: 0.72 }, 0)
      .fromTo(heroImg, { scale: 1.1 }, { scale: 1, duration: 0.72 }, 0)
      .to([title, aside], { y: -60, autoAlpha: 0, duration: 0.2 }, 0)
      .to(caption, { opacity: 1, duration: 0.12 }, 0.74)
      .to({}, { duration: 0.14 });
  }

  /* ---------------- 2 · rooms: niches pass beside the pinned title ---------------- */
  var nowCount = $('[data-now-count]'), nowName = $('[data-now-name]'), nowSleeps = $('[data-now-sleeps]'), nowOpen = $('[data-now-open]');
  function showNow(id) {
    var i = ROOMS.findIndex(function (r) { return r.id === id; });
    if (i < 0 || !nowCount) return;
    var r = ROOMS[i];
    nowCount.textContent = (i + 1) + ' of ' + ROOMS.length;
    nowName.textContent = r.name.replace('The ', 'the ');
    nowSleeps.textContent = 'sleeps ' + r.sleeps;
    nowOpen.textContent = 'Open ' + r.name.replace('The ', 'the ');
    nowOpen.setAttribute('data-open-room', r.id);
  }
  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    $$('.room').forEach(function (room) {
      ScrollTrigger.create({
        trigger: room, start: 'top 60%', end: 'bottom 60%',
        onToggle: function (st) { if (st.isActive) showNow(room.getAttribute('data-room')); }
      });
    });
  }
  if (motion) {
    $$('.room').forEach(function (room) {
      var img = $('.room__niche img', room);
      gsap.fromTo(img, { yPercent: -4 }, {
        yPercent: 4, ease: 'none',
        scrollTrigger: { trigger: room, start: 'top bottom', end: 'bottom top', scrub: true }
      });
      gsap.from($$('.room__text > *', room), {
        y: 22, opacity: 0, duration: 0.8, stagger: 0.07,
        scrollTrigger: { trigger: room, start: 'top 70%', once: true }
      });
    });
  }

  /* ---------------- room view (the reel's slider, opened like a lit niche) ----------------
     Photographs of a room: the arrows beside the arch (or a swipe, or the arrow keys).
     Rooms: the bar of six names along the bottom, each with a dot of its colour. */
  var rv = $('[data-roomview]');
  var rvArch = $('[data-rv-arch]');
  var rvImg = $('[data-rv-img]');
  var rvGhost = $('[data-rv-ghost]');
  var rvRooms = $('[data-rv-rooms]');
  var rvPhotoCount = $('[data-rv-photocount]');
  var current = 0, photo = 0;
  var lastTrigger = null;

  function srcset(p) { return IMG + p[0] + '-' + p[2] + '.webp ' + p[2] + 'w, ' + IMG + p[0] + '-' + p[1] + '.webp ' + p[1] + 'w'; }
  function src(p) { return IMG + p[0] + '-' + p[1] + '.webp'; }

  function setPhoto(p, animate, dir) {
    if (!animate || !motion) {
      rvImg.srcset = srcset(p); rvImg.src = src(p); rvImg.alt = p[3];
      return;
    }
    var shift = (dir || 0) * 6;
    gsap.to(rvImg, {
      opacity: 0, xPercent: -shift, duration: 0.2, ease: 'power2.in', overwrite: true,
      onComplete: function () {
        rvImg.srcset = srcset(p); rvImg.src = src(p); rvImg.alt = p[3];
        var show = function () { gsap.fromTo(rvImg, { opacity: 0, xPercent: shift, scale: 1.04 }, { opacity: 1, xPercent: 0, scale: 1, duration: 0.7 }); };
        if (rvImg.decode) rvImg.decode().then(show, show); else show();
      }
    });
  }

  function showPhoto(k, animate, dir) {
    var list = ROOMS[current].photos;
    photo = (k + list.length) % list.length;
    setPhoto(list[photo], animate, dir);
    rvPhotoCount.textContent = 'Photo ' + (photo + 1) + ' of ' + list.length;
  }

  if (rvRooms) {
    ROOMS.forEach(function (r, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'rvroom';
      b.innerHTML = '<span class="rvroom__dot" style="background:' + r.colour.bg + '"></span>' + r.nick;
      b.setAttribute('aria-label', r.name + ', sleeps ' + r.sleeps);
      b.addEventListener('click', function () { if (i !== current) fillRoom(i, true); });
      rvRooms.appendChild(b);
    });
  }

  function fillRoom(i, animate) {
    current = (i + ROOMS.length) % ROOMS.length;
    var r = ROOMS[current];
    rv.style.setProperty('--rv-bg', r.colour.bg);
    rv.style.setProperty('--rv-ghost', r.colour.ghost);
    rv.style.setProperty('--rv-ink', r.colour.ink);
    rv.style.setProperty('--rv-muted', r.colour.muted);
    // the room's colour world: tweened when switching rooms, set at once when opening
    if (animate && motion) gsap.to(rv, { backgroundColor: r.colour.bg, color: r.colour.ink, duration: 0.5, ease: 'power1.inOut', overwrite: 'auto' });
    else { rv.style.backgroundColor = r.colour.bg; rv.style.color = r.colour.ink; }
    rvGhost.style.color = r.colour.ghost;
    rvGhost.textContent = r.nick;
    $('[data-rv-count]').textContent = 'Room ' + (current + 1) + ' of ' + ROOMS.length;
    $('[data-rv-name]').textContent = r.name;
    $('[data-rv-type]').textContent = r.type + ' · ' + r.beds.toLowerCase() + ' · sleeps ' + r.sleeps;
    $('[data-rv-text]').textContent = r.text;
    $('[data-rv-facts]').innerHTML = EVERY_ROOM.map(function (f) { return '<li>' + f + '</li>'; }).join('');
    $$('.rvroom', rvRooms).forEach(function (b, k) { b.setAttribute('aria-current', k === current ? 'true' : 'false'); });
    var on = $$('.rvroom', rvRooms)[current];
    if (on && on.scrollIntoView && rv.open) on.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    showPhoto(0, animate, 0);
    if (animate && motion) {
      gsap.fromTo(rvGhost, { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9 });
      gsap.fromTo($$('.roomview__info > *'), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, delay: 0.1 });
    }
  }

  function openRoom(id, trigger) {
    if (!rv || !rv.showModal) return;
    if (rv.open) { fillRoom(ROOMS.findIndex(function (r) { return r.id === id; }), true); return; }
    lastTrigger = trigger || null;
    var idx = ROOMS.findIndex(function (r) { return r.id === id; });
    fillRoom(idx, false);
    rv.showModal();
    document.body.style.overflow = 'hidden';
    if (!motion) return;
    var niche = $('.room[data-room="' + id + '"] .room__niche');
    if (niche) { var nr = niche.getBoundingClientRect(); if (nr.bottom < 0 || nr.top > window.innerHeight) niche = null; }
    gsap.fromTo(rv, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out' });
    if (niche && window.innerWidth > 900) {
      var a = rvArch.getBoundingClientRect();
      var n = niche.getBoundingClientRect();
      gsap.fromTo(rvArch,
        { x: n.left - a.left, y: n.top - a.top, scale: n.width / a.width, transformOrigin: '0 0' },
        { x: 0, y: 0, scale: 1, duration: 1.1, ease: 'expo.inOut', clearProps: 'transform' });
    } else {
      gsap.fromTo(rvArch, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, clearProps: 'transform' });
    }
    gsap.fromTo(rvGhost, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, delay: 0.25 });
    gsap.fromTo($$('.roomview__info > *, .roomview__arrow, .roomview__photocount, .roomview__rooms'), { opacity: 0 },
      { opacity: 1, duration: 0.7, stagger: 0.04, delay: 0.45 });
  }

  function closeRoom() {
    var done = function () {
      rv.close();
      document.body.style.overflow = '';
      if (window.gsap) gsap.set(rv, { clearProps: 'opacity' });
      if (lastTrigger) lastTrigger.focus({ preventScroll: true });
    };
    if (motion) gsap.to(rv, { opacity: 0, duration: 0.28, ease: 'power2.in', onComplete: done });
    else done();
  }

  if (rv) {
    $$('[data-open-room]').forEach(function (b) {
      b.addEventListener('click', function () { openRoom(b.getAttribute('data-open-room'), b); });
    });
    // a key clicked in the hero (assets/js/keys.js)
    window.addEventListener('lh:open-room', function (e) { openRoom(e.detail, null); });
    $('[data-rv-close]').addEventListener('click', closeRoom);
    $$('[data-rv-photo]').forEach(function (b) {
      b.addEventListener('click', function () { var d = parseInt(b.getAttribute('data-rv-photo'), 10); showPhoto(photo + d, true, d); });
    });
    rv.addEventListener('cancel', function (e) { e.preventDefault(); closeRoom(); });
    rv.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); showPhoto(photo + 1, true, 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); showPhoto(photo - 1, true, -1); }
    });
    // swipe across the arch to change the photograph
    var sx = null, sy = null;
    rvArch.addEventListener('pointerdown', function (e) { sx = e.clientX; sy = e.clientY; });
    rvArch.addEventListener('pointerup', function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      sx = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) showPhoto(photo + (dx < 0 ? 1 : -1), true, dx < 0 ? 1 : -1);
    });
    rvArch.addEventListener('pointercancel', function () { sx = null; });
    $('[data-rv-book]').addEventListener('click', function () {
      planner.selectRoom(ROOMS[current].id);
      lastTrigger = null;
      closeRoom();
      setTimeout(function () { $('#plan').scrollIntoView({ behavior: motion ? 'smooth' : 'auto' }); }, motion ? 320 : 0);
    });
  }

  /* ---------------- 3 · the house: close-ups settle, cards arrive ---------------- */
  if (motion) {
    $$('[data-frame]').forEach(function (f) {
      gsap.fromTo($('.frame__bg img', f), { scale: 1.12 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true }
      });
      gsap.from($$('.frame__card > *', f), {
        y: 24, opacity: 0, duration: 0.8, stagger: 0.07,
        scrollTrigger: { trigger: f, start: 'top 55%', once: true }
      });
    });
  }

  /* ---------------- 4 · the garden: three photographs rise at their own speeds ---------------- */
  var garden = $('[data-garden]');
  if (motion && garden && window.matchMedia('(min-width: 701px)').matches) {
    var gtl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: $('.garden__photos', garden), start: 'top bottom', end: 'bottom bottom', scrub: 0.5 }
    });
    $$('.garden__ph', garden).forEach(function (ph) {
      var rate = parseFloat(ph.getAttribute('data-rise')) || 1;
      var isCentre = ph.classList.contains('garden__ph--centre');
      gtl.fromTo(ph, { y: 260 * rate, scale: isCentre ? 0.82 : 1, transformOrigin: '50% 0%' }, { y: 0, scale: 1 }, 0);
    });
  }
  if (motion && garden) {
    gsap.from($$('.garden__head > *', garden), {
      y: 24, opacity: 0, duration: 0.8, stagger: 0.08,
      scrollTrigger: { trigger: garden, start: 'top 80%', once: true }
    });
  }

  /* ---------------- 5 · included: the active row changes the photograph ---------------- */
  var inc = $('[data-included]');
  if (inc) {
    var rows = $$('.inc', inc);
    var pics = $$('.included__media img', inc);
    var setActive = function (row) {
      if (row.classList.contains('is-active')) return;
      rows.forEach(function (r) {
        var on = r === row;
        r.classList.toggle('is-active', on);
        $('.inc__row', r).setAttribute('aria-expanded', on ? 'true' : 'false');
      });
      var key = row.getAttribute('data-key');
      pics.forEach(function (p) { p.classList.toggle('is-on', p.getAttribute('data-for') === key); });
    };
    rows.forEach(function (row) {
      var btn = $('.inc__row', row);
      btn.addEventListener('click', function () { setActive(row); });
      btn.addEventListener('focus', function () { if (window.matchMedia('(min-width: 901px)').matches) setActive(row); });
      if (window.matchMedia('(hover: hover)').matches) btn.addEventListener('mouseenter', function () { setActive(row); });
    });
    if (window.gsap && window.ScrollTrigger && window.matchMedia('(min-width: 901px)').matches) {
      gsap.registerPlugin(ScrollTrigger);
      rows.forEach(function (row) {
        ScrollTrigger.create({
          trigger: row, start: 'top 58%', end: 'bottom 58%',
          onEnter: function () { setActive(row); }, onEnterBack: function () { setActive(row); }
        });
      });
    }
    if (motion) {
      gsap.from([$('.included__title', inc)].concat(rows), {
        y: 22, opacity: 0, duration: 0.7, stagger: 0.06,
        scrollTrigger: { trigger: inc, start: 'top 75%', once: true }
      });
    }
  }

  /* ---------------- 6 · the band of place names: runs only while on screen ---------------- */
  var band = $('.band');
  if (band && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { band.classList.toggle('is-paused', !e.isIntersecting); });
    }).observe(band);
  }

  /* ---------------- 7 · the stay planner ---------------- */
  function saNow() {
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(new Date());
    var o = {};
    parts.forEach(function (p) { o[p.type] = p.value; });
    return { ymd: o.year + '-' + o.month + '-' + o.day, h: parseInt(o.hour, 10) % 24, m: parseInt(o.minute, 10), hm: (o.hour === '24' ? '00' : o.hour) + ':' + o.minute };
  }
  function addDays(ymd, n) {
    var d = new Date(ymd + 'T12:00:00Z');
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function nice(ymd, long) {
    var d = new Date(ymd + 'T12:00:00Z');
    return new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', weekday: long ? 'long' : 'short', day: 'numeric', month: long ? 'long' : 'short' }).format(d);
  }

  var planner = (function () {
    var form = $('[data-planner]');
    var api = { selectRoom: function () {} };
    if (!form) return api;
    var state = { nights: 1, adults: 2, children: 0, room: null };
    var arrive = $('[data-arrive]', form);
    var chipsBox = $('[data-roomchips]', form);
    var now = saNow();
    var first = now.h >= 22 ? addDays(now.ymd, 1) : now.ymd;
    arrive.min = now.ymd;
    arrive.max = addDays(now.ymd, 500);
    arrive.value = first;

    var LIMITS = { nights: [1, 30], adults: [1, 12], children: [0, 8] };

    ROOMS.forEach(function (r) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false');
      b.setAttribute('data-chip', r.id);
      b.innerHTML = '<span class="chip__name">' + r.name.replace('The ', '') + '</span><span class="chip__cap"><span class="chip__type">' + r.type + ' · </span>sleeps ' + r.sleeps + '</span>';
      b.addEventListener('click', function () {
        state.room = state.room === r.id ? null : r.id;
        render();
      });
      chipsBox.appendChild(b);
    });

    $$('[data-step]', form).forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-step');
        var v = state[k] + parseInt(b.getAttribute('data-dir'), 10);
        state[k] = Math.max(LIMITS[k][0], Math.min(LIMITS[k][1], v));
        render();
      });
    });
    arrive.addEventListener('change', render);
    arrive.addEventListener('input', render);

    function roomsNeeded(party) {
      var caps = ROOMS.map(function (r) { return r; }).sort(function (a, b) { return b.sleeps - a.sleeps; });
      var picked = [], total = 0;
      for (var i = 0; i < caps.length && total < party; i++) { picked.push(caps[i]); total += caps[i].sleeps; }
      return { picked: picked, total: total };
    }
    function list(names) {
      if (names.length === 1) return names[0];
      return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
    }

    function render() {
      var party = state.adults + state.children;
      ['nights', 'adults', 'children'].forEach(function (k) {
        $('[data-val="' + k + '"]', form).textContent = state[k];
        $$('[data-step="' + k + '"]', form).forEach(function (b) {
          var dir = parseInt(b.getAttribute('data-dir'), 10);
          b.disabled = dir < 0 ? state[k] <= LIMITS[k][0] : state[k] >= LIMITS[k][1];
        });
      });

      var a = arrive.value && arrive.value >= arrive.min ? arrive.value : null;
      var out = a ? addDays(a, state.nights) : null;
      var datesEl = $('[data-dates]', form);
      if (a) {
        datesEl.textContent = 'Arrive ' + nice(a, true) + ' and check in between 14:00 and 22:00. Leave ' +
          nice(out, true) + ' by 10:00, after ' + state.nights + (state.nights === 1 ? ' night.' : ' nights.');
      } else {
        datesEl.textContent = 'Pick your arrival date to see your check-in and check-out times.';
      }

      var fit = $('[data-fit]', form);
      var noRooms = 1;
      var fits = ROOMS.filter(function (r) { return r.sleeps >= party; });
      if (party <= 2) fit.textContent = 'Every room sleeps two. Choose one below, or leave it to Leana.';
      else if (fits.length) fit.textContent = 'For ' + party + ', choose ' + list(fits.map(function (r) { return 'the ' + r.name.replace('The ', ''); })) + '. There are no cots or extra beds.';
      else {
        var need = roomsNeeded(party);
        noRooms = need.picked.length;
        if (need.total < party) {
          fit.innerHTML = 'The whole house sleeps 15. For a group of ' + party + ', call Leana on <a class="link" href="tel:+27792962187">079 296 2187</a>.';
        } else {
          fit.textContent = 'No single room sleeps ' + party + '. Book ' + noRooms + ' rooms: ' +
            list(need.picked.map(function (r) { return 'the ' + r.name.replace('The ', ''); })) + ' sleep ' + need.total + ' together.';
        }
      }
      if (state.room && byId[state.room].sleeps < party && noRooms === 1) state.room = null;

      $$('[data-chip]', chipsBox).forEach(function (c) {
        var r = byId[c.getAttribute('data-chip')];
        var unfit = r.sleeps < party && noRooms === 1;
        c.classList.toggle('is-unfit', unfit);
        c.setAttribute('aria-checked', state.room === r.id ? 'true' : 'false');
        c.setAttribute('aria-disabled', unfit ? 'true' : 'false');
      });

      // Booking.com: the dates and party travel with the form
      $('[data-checkout]', form).value = out || '';
      $('[data-adults]', form).value = state.adults;
      $('[data-children]', form).value = state.children;
      $('[data-norooms]', form).value = noRooms;

      // WhatsApp: the same details, written out for Leana
      var msg = 'Hello Leana, I would like to stay at Leana Hub Guest House.';
      if (a) msg += '\nArriving: ' + nice(a) + '\nLeaving: ' + nice(out) + ' (' + state.nights + (state.nights === 1 ? ' night)' : ' nights)');
      msg += '\nGuests: ' + state.adults + (state.adults === 1 ? ' adult' : ' adults') +
        (state.children ? ', ' + state.children + (state.children === 1 ? ' child' : ' children') : '');
      if (state.room) msg += '\nRoom: ' + byId[state.room].name + ' (' + byId[state.room].type.toLowerCase() + '), if it is free';
      msg += '\nIs this available? Thank you.';
      $('[data-whatsapp]', form).href = 'https://wa.me/' + PHONE_WA + '?text=' + encodeURIComponent(msg);
    }

    form.addEventListener('submit', function () { render(); });
    api.selectRoom = function (id) {
      state.room = id;
      var r = byId[id];
      if (state.adults + state.children > r.sleeps) { state.adults = Math.min(state.adults, r.sleeps); state.children = Math.max(0, r.sleeps - state.adults); }
      render();
    };
    render();
    return api;
  })();

  // the live line: what time it is at the house and whether check-in is open
  var nowEl = $('[data-now]');
  function tick() {
    if (!nowEl) return;
    var n = saNow();
    var t = n.h * 60 + n.m;
    var line;
    if (t < 14 * 60) line = 'It’s ' + n.hm + ' in Potchefstroom. Check-in opens at 14:00 today and runs until 22:00.';
    else if (t < 22 * 60) line = 'It’s ' + n.hm + ' in Potchefstroom. Check-in is open now, until 22:00.';
    else line = 'It’s ' + n.hm + ' in Potchefstroom. Check-in has closed for today; on your way? Call 079 296 2187.';
    nowEl.textContent = line;
  }
  tick();
  setInterval(tick, 30000);
  var yearEl = $('[data-year]');
  if (yearEl) yearEl.textContent = saNow().ymd.slice(0, 4);

  /* ---------------- entrances for the remaining sections ---------------- */
  if (motion) {
    var groups = [
      ['.rooms__note'],
      ['.around__title', '.around__text', '.around__map'],
      ['.plan__title', '.plan__now', '.plan__rating', '.plan__photo', '.planner'],
    ];
    groups.forEach(function (sels) {
      var els = [];
      sels.forEach(function (s) { els = els.concat($$(s)); });
      if (!els.length) return;
      gsap.from(els, {
        y: 24, opacity: 0, duration: 0.8, stagger: 0.07,
        scrollTrigger: { trigger: els[0], start: 'top 88%', once: true }
      });
    });
    // the last screens rise without fading, so nothing down there can be left invisible
    [['.faq__title', '.faq__text'], ['.contact__title', '.contact__phone span', '.contact__foot']].forEach(function (sels) {
      var els = [];
      sels.forEach(function (q) { els = els.concat($$(q)); });
      gsap.from(els, { y: 32, duration: 0.9, stagger: 0.08, scrollTrigger: { trigger: els[0], start: 'top 92%', once: true } });
    });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
})();
