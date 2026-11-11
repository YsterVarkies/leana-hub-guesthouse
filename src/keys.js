/* Leana Hub — the six room keys, floating around the hero arch.
   Each brass key hangs on an arch-shaped tag in its room's colour, with the room's name on it.
   Hover a key to lift it; click it to open that room (main.js listens for `lh:open-room`).
   Source module; bundled to assets/js/keys.js with `npm run build`.
   Runs only when the page has motion on (html.motion) and WebGL is available. */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Vector2, Color, Raycaster,
  TorusGeometry, CylinderGeometry, BoxGeometry, SphereGeometry, ExtrudeGeometry, Shape, Path,
  MeshPhysicalMaterial, MeshStandardMaterial, CanvasTexture,
  HemisphereLight, DirectionalLight, AmbientLight, PMREMGenerator,
  SRGBColorSpace, ACESFilmicToneMapping, MathUtils
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const ROOMS = [
  { id: 'slate', name: 'Slate', bg: '#3b4246', ink: '#eceae4' },
  { id: 'navy', name: 'Navy', bg: '#1c2440', ink: '#ece9e2' },
  { id: 'protea', name: 'Protea', bg: '#5e3236', ink: '#f1e6e2' },
  { id: 'pine', name: 'Pine', bg: '#6b4a2e', ink: '#f3ebe0' },
  { id: 'olive', name: 'Olive', bg: '#46501f', ink: '#eef0e2' },
  { id: 'linen', name: 'Linen', bg: '#d6cdbd', ink: '#2b2216' }
];

const canvas = document.querySelector('[data-keys]');
const root = document.documentElement;

function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
  catch (e) { return false; }
}

if (canvas && root.classList.contains('motion') && webglOK()) {
  const ready = document.fonts && document.fonts.load ? document.fonts.load('800 80px Unbounded').catch(() => null) : Promise.resolve();
  Promise.race([ready, new Promise((r) => setTimeout(r, 1500))]).then(init);
}

function init() {
  const hero = canvas.closest('[data-hero]');
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.9;

  const camera = new PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0, 16);

  // warm light, as in the lounge photograph
  scene.add(new HemisphereLight(0xfff1dc, 0x2b2216, 0.7));
  scene.add(new AmbientLight(0xffffff, 0.12));
  const key = new DirectionalLight(0xfff0d2, 2.2); key.position.set(-5, 6, 8); scene.add(key);
  const rim = new DirectionalLight(0xffd59a, 1.4); rim.position.set(6, 2, -6); scene.add(rim);

  /* ---------- the brass key ---------- */
  const brass = new MeshPhysicalMaterial({ color: '#c99a3e', metalness: 1, roughness: 0.3, clearcoat: 0.25, clearcoatRoughness: 0.4, transparent: true });

  function brassKey(mat) {
    const g = new Group();
    const add = (geo, x, y, z = 0, rx = 0, rz = 0) => { const m = new Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, 0, rz); g.add(m); return m; };
    // a trefoil bow
    for (let i = 0; i < 3; i++) {
      const a = Math.PI / 2 + (i * Math.PI * 2) / 3;
      add(new TorusGeometry(0.22, 0.062, 14, 40), Math.cos(a) * 0.19, Math.sin(a) * 0.19);
    }
    add(new SphereGeometry(0.085, 16, 12), 0, 0);
    // collar and shaft
    add(new CylinderGeometry(0.1, 0.1, 0.13, 20), 0, -0.47);
    add(new CylinderGeometry(0.085, 0.085, 0.06, 20), 0, -0.62);
    add(new CylinderGeometry(0.06, 0.06, 1.55, 16), 0, -1.38);
    // the bit
    add(new BoxGeometry(0.34, 0.26, 0.07), 0.19, -1.92);
    add(new BoxGeometry(0.14, 0.11, 0.075), 0.41, -1.99);
    add(new SphereGeometry(0.07, 14, 10), 0, -2.16);
    return g;
  }

  /* ---------- the arch-shaped tag, in the room's colour, with its name ---------- */
  const TAG_W = 0.92, TAG_SIDE = 0.86, TAG_R = TAG_W / 2;
  function tagShape() {
    const s = new Shape();
    s.moveTo(-TAG_R, 0);
    s.lineTo(TAG_R, 0);
    s.lineTo(TAG_R, TAG_SIDE);
    s.absarc(0, TAG_SIDE, TAG_R, 0, Math.PI, false);
    s.lineTo(-TAG_R, 0);
    const hole = new Path();
    hole.absarc(0, TAG_SIDE + 0.16, 0.075, 0, Math.PI * 2, true);
    s.holes.push(hole);
    return s;
  }
  const tagGeo = new ExtrudeGeometry(tagShape(), { depth: 0.1, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3, curveSegments: 40 });
  const H = TAG_SIDE + TAG_R;
  function tagTexture(room) {
    const W = 512, Hc = Math.round(512 * (H / TAG_W));
    const c = document.createElement('canvas'); c.width = W; c.height = Hc;
    const g = c.getContext('2d');
    g.fillStyle = room.bg; g.fillRect(0, 0, W, Hc);
    g.fillStyle = room.ink;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    let size = 120;
    g.font = `800 ${size}px Unbounded, "Arial Black", sans-serif`;
    while (g.measureText(room.name.toUpperCase()).width > W * 0.78 && size > 40) { size -= 4; g.font = `800 ${size}px Unbounded, "Arial Black", sans-serif`; }
    g.fillText(room.name.toUpperCase(), W / 2, Hc * 0.62);
    g.font = `500 ${Math.round(size * 0.34)}px Onest, sans-serif`;
    g.globalAlpha = 0.8;
    g.fillText('LEANA HUB', W / 2, Hc * 0.62 + size * 0.78);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    // the extrusion's cap UVs are shape coordinates: map the tag's box onto 0..1
    t.repeat.set(1 / TAG_W, 1 / H);
    t.offset.set(TAG_R / TAG_W, 0);
    return t;
  }
  function roomTag(room) {
    const face = new MeshStandardMaterial({ map: tagTexture(room), roughness: 0.6, transparent: true });
    const side = new MeshStandardMaterial({ color: new Color(room.bg).offsetHSL(0, 0, -0.06), roughness: 0.6, transparent: true });
    const m = new Mesh(tagGeo, [face, side]);
    m.position.set(0, -(TAG_SIDE + 0.16), -0.05);   // its hole sits on the pivot
    return m;
  }

  function keyOnTag(room) {
    const unit = new Group();
    const inner = new Group();                        // centres the key and tag on the unit's origin
    inner.position.set(-0.8, 0.45, 0);
    unit.add(inner);
    const mat = brass.clone();                        // each key fades on its own
    const k = brassKey(mat);
    k.rotation.z = Math.PI / 2 + 0.25;                // key lies across, bow on the left
    inner.add(k);
    const ring = new Mesh(new TorusGeometry(0.13, 0.025, 10, 32), mat);
    ring.position.set(-0.05, -0.36, 0);
    ring.rotation.y = Math.PI / 2;
    inner.add(ring);
    const pivot = new Group();
    pivot.position.set(-0.05, -0.42, 0);
    pivot.add(roomTag(room));
    inner.add(pivot);
    unit.userData = { room, pivot };
    return unit;
  }

  /* ---------- the arrangement: around the arch, never over the words ---------- */
  // [nx, ny, depth, scale] — viewport units (-1..1), ny up; one key per room, in order
  const DESKTOP = [
    [-0.25, 0.5, 1.2, 1.0],
    [0.3, 0.54, -1.5, 0.85],
    [-0.34, 0.02, 0.4, 0.92],
    [0.34, 0.1, 0.9, 0.88],
    [0.21, -0.56, 2.2, 0.82],
    [-0.17, -0.8, 2.8, 0.78]
  ];
  // phone: four smaller keys against the arch's sides, clear of the title above and the words below
  const PHONE = [
    [-0.56, 0.36, 0.6, 0.5],
    [0.58, 0.28, -0.6, 0.46],
    [-0.58, -0.14, 1.2, 0.48],
    [0.56, -0.2, 1.6, 0.5],
    null,
    null
  ];

  const group = new Group();
  scene.add(group);
  let items = [];

  function build() {
    items.forEach((it) => group.remove(it.unit));
    items = [];
    const phone = window.innerWidth <= 900;
    const layout = phone ? PHONE : DESKTOP;
    const vh = 2 * Math.tan(MathUtils.degToRad(camera.fov / 2));
    ROOMS.forEach((room, i) => {
      if (!layout[i]) return;
      const [nx, ny, z, sc] = layout[i];
      const unit = keyOnTag(room);
      const dist = camera.position.z - z;
      const h = vh * dist, w = h * camera.aspect;
      const base = { x: nx * w / 2, y: ny * h / 2, z };
      const s = sc * (h / 11);
      unit.scale.setScalar(s);
      unit.position.set(base.x, base.y, base.z);
      const tilt = (Math.random() - 0.5) * 0.7;
      unit.rotation.set((Math.random() - 0.5) * 0.3, 0, tilt);
      group.add(unit);
      items.push({
        unit, base, s, tilt, room,
        phase: Math.random() * Math.PI * 2,
        sway: 0.35 + Math.random() * 0.35,
        out: new Vector2(Math.sign(nx || 0.1) * (0.8 + Math.random()), 0.6 + Math.random() * 0.8),
        enter: 0, hover: 0
      });
    });
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    build();
  }

  /* ---------- input: pointer parallax, hover and click; scroll progress from main.js ---------- */
  const pointer = new Vector2(), smooth = new Vector2(), ndc = new Vector2(-5, -5);
  const ray = new Raycaster();
  let hovered = null, progress = 0, shownProgress = 0;
  const tip = document.createElement('div');
  tip.className = 'keytip';
  tip.setAttribute('aria-hidden', 'true');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) document.body.appendChild(tip);

  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    tip.style.transform = `translate(${Math.min(e.clientX + 16, window.innerWidth - 220)}px, ${e.clientY + 16}px)`;
  }, { passive: true });
  canvas.addEventListener('pointerleave', () => { ndc.set(-5, -5); });
  window.addEventListener('pointermove', (e) => {
    pointer.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
  }, { passive: true });
  canvas.addEventListener('click', (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    const hit = pick();
    if (hit) window.dispatchEvent(new CustomEvent('lh:open-room', { detail: hit.room.id }));
  });
  window.addEventListener('lh:hero', (e) => { progress = e.detail || 0; });

  function pick() {
    if (shownProgress > 0.25) return null;
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(items.map((it) => it.unit), true);
    if (!hits.length) return null;
    let o = hits[0].object;
    while (o && !o.userData.room) o = o.parent;
    return o ? items.find((it) => it.unit === o) : null;
  }

  let running = false, visible = true, raf = 0, t0 = performance.now(), last = t0;
  function loop(now) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const t = (now - t0) / 1000;
    smooth.lerp(pointer, 0.05);
    shownProgress += (progress - shownProgress) * 0.12;
    const p = Math.min(1, shownProgress / 0.55);              // gone before the window is fully open

    const h = pick();
    if (h !== hovered) {
      hovered = h;
      canvas.style.cursor = h ? 'pointer' : '';
      tip.textContent = h ? 'Open the ' + h.room.name + ' Room' : '';
      tip.classList.toggle('is-on', !!h);
    }

    group.rotation.y = smooth.x * 0.08;
    group.rotation.x = -smooth.y * 0.05;
    items.forEach((it, i) => {
      it.enter = Math.min(1, it.enter + dt / (0.9 + i * 0.12));
      const e = 1 - Math.pow(1 - it.enter, 4);
      it.hover += ((hovered === it ? 1 : 0) - it.hover) * 0.12;
      const bob = Math.sin(t * 0.7 + it.phase) * 0.1 * it.s;
      it.unit.position.set(
        it.base.x + it.out.x * p * 4 * it.s,
        it.base.y + bob + it.out.y * p * 5 * it.s - (1 - e) * 1.2 * it.s,
        it.base.z + p * 2 + it.hover * 0.8
      );
      it.unit.scale.setScalar(it.s * (1 + it.hover * 0.1));
      // a slow turn that keeps the name readable, squared to the visitor on hover
      it.unit.rotation.y = Math.sin(t * 0.35 + it.phase) * it.sway * (1 - it.hover);
      it.unit.rotation.z = it.tilt * (1 - it.hover * 0.7);
      it.unit.userData.pivot.rotation.z = Math.sin(t * 1.4 + it.phase) * 0.09 * (1 - it.hover);
      const op = e * (1 - p);
      it.unit.traverse((m) => { if (m.material) [].concat(m.material).forEach((mm) => { mm.opacity = op; }); });
      it.unit.visible = op > 0.01;
    });
    renderer.render(scene, camera);
  }
  function start() { if (!running && visible && !document.hidden) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  new IntersectionObserver((es) => {
    visible = es[0].isIntersecting;
    visible ? start() : stop();
  }).observe(hero || canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });

  resize();
  start();
}
