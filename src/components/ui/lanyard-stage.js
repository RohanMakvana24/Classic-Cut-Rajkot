import * as THREE from 'three';

// One context/environment for the deck. Resting cards keep their last render;
// a moving card only redraws its own target, then the four light image planes.
const stages = new WeakMap();

class LanyardStage {
  constructor(element, buildEnvironment) {
    this.element = element;
    this.rigs = new Set();
    this.frame = 0;
    this.dirtyBounds = true;
    this.visible = false;
    this.disposed = false;
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.autoClear = false;
    this.renderer.setClearColor(0, 0);
    this.environment = buildEnvironment(this.renderer);
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(0, 1, 1, 0, -1, 1);
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.canvas = this.renderer.domElement;
    this.canvas.className = 'lanyard-stage-canvas';
    this.canvas.setAttribute('aria-hidden', 'true');
    element.appendChild(this.canvas);
    this.onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(this.frame); this.frame = 0; }
      else { this.dirtyBounds = true; this.request(); }
    };
    this.onContextLost = event => {
      event.preventDefault();
      for (const rig of [...this.rigs]) rig.canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
    };
    this.canvas.addEventListener('webglcontextlost', this.onContextLost);
    document.addEventListener('visibilitychange', this.onVisibility);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(element);
    this.visibilityObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible) { this.dirtyBounds = true; this.request(); }
      else { cancelAnimationFrame(this.frame); this.frame = 0; }
    });
    this.visibilityObserver.observe(element);
    this.resize();
  }

  resize() {
    // Keep the canvas in scrolling content coordinates. Native scrolling can then
    // move the cached deck on the compositor without a WebGL redraw per scroll.
    const track = this.element.querySelector('.community-deck__track');
    const width = Math.max(1, this.element.clientWidth, track?.offsetWidth || 0);
    const height = Math.max(1, this.element.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(1200000 / (width * height)));
    if (width === this.width && height === this.height && dpr === this.dpr) return;
    this.width = width; this.height = height; this.dpr = dpr;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.camera.right = width; this.camera.top = height; this.camera.updateProjectionMatrix();
    for (const rig of this.rigs) { rig.dirty = true; this.sizeTarget(rig); }
    this.dirtyBounds = true;
    this.request();
  }

  sizeTarget(rig) {
    const width = Math.max(1, Math.round(rig.width * this.dpr));
    const height = Math.max(1, Math.round(rig.height * this.dpr));
    if (rig.target?.width === width && rig.target?.height === height) return;
    if (rig.target) rig.target.setSize(width, height);
    else {
      rig.target = new THREE.WebGLRenderTarget(width, height, {
        type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
        depthBuffer: true, stencilBuffer: false, samples: Math.min(2, this.renderer.capabilities.maxSamples),
      });
      rig.target.texture.colorSpace = THREE.LinearSRGBColorSpace;
      rig.material.map = rig.target.texture;
      rig.material.needsUpdate = true;
    }
    rig.dirty = true;
  }

  measure() {
    const stage = this.element.getBoundingClientRect();
    for (const rig of this.rigs) {
      const box = rig.canvas.getBoundingClientRect();
      const x = box.left - stage.left + this.element.scrollLeft, y = box.top - stage.top + this.element.scrollTop;
      rig.inView = x < this.width && x + box.width > 0 && y < this.height && y + box.height > 0;
      rig.plane.position.set(x + box.width / 2, this.height - y - box.height / 2, 0);
      rig.plane.scale.set(box.width, box.height, 1);
      rig.plane.renderOrder = rig.container.closest('[data-active]')?.dataset.active === 'true' ? 100 : rig.index;
      rig.plane.visible = rig.inView && rig.ready && rig.painted;
    }
    this.dirtyBounds = false;
  }

  request() {
    if (this.frame || this.disposed || !this.visible || document.hidden) return;
    this.frame = requestAnimationFrame(() => this.flush());
  }

  flush() {
    this.frame = 0;
    if (this.disposed || !this.visible || document.hidden) return;
    if (this.dirtyBounds) this.measure();
    const firstPaints = [];
    for (const rig of this.rigs) {
      if (!rig.inView || !rig.ready || !rig.dirty || !rig.scene || !rig.camera) continue;
      if (!rig.warmed) {
        if (!rig.compiling) {
          rig.compiling = true;
          this.renderer.compileAsync(rig.scene, rig.camera).then(() => {
            if (this.disposed || !this.rigs.has(rig)) return;
            rig.warmed = true; this.request();
          }).catch(() => {
            if (!this.disposed) rig.canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
          });
        }
        continue;
      }
      this.renderer.setRenderTarget(rig.target);
      this.renderer.clear();
      this.renderer.render(rig.scene, rig.camera);
      rig.dirty = false;
      rig.plane.visible = true;
      if (!rig.painted) { rig.painted = true; firstPaints.push(rig); }
    }
    this.renderer.setRenderTarget(null);
    this.renderer.setViewport(0, 0, this.width, this.height);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    for (const rig of firstPaints) { rig.onReady?.(); rig.onReady = null; }
  }

  register(container) {
    const canvas = document.createElement('canvas');
    const material = new THREE.MeshBasicMaterial({ transparent: true, depthTest: false, depthWrite: false });
    const plane = new THREE.Mesh(this.geometry, material);
    plane.visible = false;
    const rig = { container, canvas, material, plane, index: this.rigs.size, width: 1, height: 1, scene: null, camera: null, target: null, ready: false, painted: false, warmed: false, compiling: false, dirty: true, inView: false, onReady: null };
    this.rigs.add(rig); this.scene.add(plane);
    const hub = this;
    const adapter = {
      domElement: canvas,
      getEnvironment: () => ({ texture: hub.environment.texture, dispose() {} }),
      setPixelRatio() {},
      setSize(width, height) {
        if (rig.width === width && rig.height === height) return;
        rig.width = width; rig.height = height;
        canvas.width = Math.round(width); canvas.height = Math.round(height);
        hub.sizeTarget(rig); hub.dirtyBounds = true; hub.request();
      },
      setReady(callback) { rig.ready = true; rig.onReady = callback; hub.request(); },
      render(scene, camera) {
        rig.scene = scene; rig.camera = camera; rig.dirty = true;
        const selected = container.closest('[data-active]')?.dataset.active === 'true';
        rig.plane.renderOrder = selected ? 100 : rig.index;
        hub.request();
      },
      dispose() {
        hub.rigs.delete(rig); hub.scene.remove(plane); material.dispose(); rig.target?.dispose();
        if (!hub.rigs.size) hub.dispose(); else { hub.dirtyBounds = true; hub.request(); }
      },
      forceContextLoss() {},
    };
    return new Proxy(adapter, {
      get(target, key) { if (key in target) return target[key]; const value = hub.renderer[key]; return typeof value === 'function' ? value.bind(hub.renderer) : value; },
      set(target, key, value) { if (key in target) target[key] = value; else hub.renderer[key] = value; return true; },
    });
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect(); this.visibilityObserver.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.canvas.removeEventListener('webglcontextlost', this.onContextLost);
    this.geometry.dispose(); this.environment.dispose();
    this.renderer.dispose(); this.renderer.forceContextLoss(); this.canvas.remove();
    stages.delete(this.element);
  }
}

export function acquireLanyardRenderer(stage, container, buildEnvironment) {
  let hub = stages.get(stage);
  if (!hub) { hub = new LanyardStage(stage, buildEnvironment); stages.set(stage, hub); }
  return hub.register(container);
}
