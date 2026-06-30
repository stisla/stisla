// Stisla.Component — base class for vanilla JS components (V3.md §3.7).
//
// Contract for every Stisla.X:
//   1. Class-based: new Stisla.X(el, opts).
//   2. .destroy() detaches every listener and clears the WeakMap stash.
//   3. emit() dispatches namespaced CustomEvents — no callback opts.
//   4. State via data-state="open|closed|active" (Radix-aligned) or boolean
//      data-* attributes (Stisla-original); never is-* classes.
//
// Subclasses set:
//   static eventNamespace = 'dialog'          // → 'stisla:dialog:<name>'
//   static defaults = { backdrop: true, ... } // merged with opts
//
// Re-init on the same element destroys the old instance first. In dev,
// surfaces a console.warn so accidental double-instantiation is visible.

const INSTANCES = new WeakMap();

const isDev =
  typeof import.meta !== 'undefined' &&
  import.meta.env &&
  import.meta.env.DEV;

export class Component {
  static eventNamespace = '';
  static defaults = {};

  static getOrCreate(el, opts) {
    return INSTANCES.get(el) ?? new this(el, opts);
  }

  constructor(el, opts = {}) {
    if (!el) throw new Error('Stisla.Component requires an element');

    const existing = INSTANCES.get(el);
    if (existing) {
      if (isDev) {
        console.warn(
          '[stisla] re-initializing component on element; old instance destroyed',
          el,
        );
      }
      existing.destroy();
    }

    this.el = el;
    this.opts = { ...this.constructor.defaults, ...opts };
    this._listeners = [];
    INSTANCES.set(el, this);
  }

  on(target, type, handler, listenerOpts) {
    target.addEventListener(type, handler, listenerOpts);
    this._listeners.push([target, type, handler, listenerOpts]);
  }

  emit(name, detail = {}, { cancelable = true, bubbles = true } = {}) {
    const event = new CustomEvent(
      `stisla:${this.constructor.eventNamespace}:${name}`,
      { bubbles, cancelable, detail },
    );
    this.el.dispatchEvent(event);
    return !event.defaultPrevented;
  }

  destroy() {
    if (!this.el) return;
    for (const [target, type, handler, listenerOpts] of this._listeners) {
      target.removeEventListener(type, handler, listenerOpts);
    }
    this._listeners.length = 0;
    INSTANCES.delete(this.el);
    this.el = null;
  }
}

export function getInstance(el) {
  return INSTANCES.get(el);
}
