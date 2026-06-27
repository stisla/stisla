// Stisla.ScrollArea — vanilla-optional per SPEC.md §10 / V3.md §3.12.
//
// Anatomy:
//   .scroll-area[data-stisla-scroll-area][data-state="ready"]
//     (your content; OverlayScrollbars inserts an .os-viewport wrapper)
//
// OverlayScrollbars owns the scrollbar math, native-scroll preservation,
// touch / wheel forwarding, and visibility timing; this wrapper owns the
// Stisla.init() entry, the destroy contract, the opts surface, and the
// declarative data-attr API. The skin lives in the matching CSS partial
// and binds to OverlayScrollbars' emitted .os-scrollbar-* classes.
//
// Events (bubbling, all non-cancelable):
//   stisla:scroll-area:ready
//   stisla:scroll-area:destroyed
//
// Opts:
//   autoHide: 'leave'     — 'never' | 'scroll' | 'leave' | 'move'
//   autoHideDelay: 800    — ms the bar stays visible after the last interaction
//   clickScroll: true     — clicking the track jumps the handle
//   overflowX: 'scroll'   — 'hidden' | 'scroll' | 'visible' | 'visible-hidden'
//   overflowY: 'scroll'
//   theme: null           — extra class applied to the scrollbar root

import overlayScrollbarsCss from "overlayscrollbars/styles/overlayscrollbars.css?raw";
import { OverlayScrollbars } from "overlayscrollbars";
import { Component } from "../core/component.js";

const READY = "ready";

// Inject the plugin's stylesheet wrapped in `@layer foundation` so our
// component-layer rules (`@layer components` in scroll-area.css) win
// the cascade naturally. The plain `import '.../overlayscrollbars.css'`
// path lands the rules unlayered, and unlayered author rules beat
// layered ones for normal declarations — the `.os-scrollbar { --os-size:
// 0 }` reset would then override our token forwarding regardless of
// specificity. Stisla's CSS bundles declare the layer order at the top,
// so this injection slots into the existing `foundation` layer.
let _osCssInjected = false;
function _injectOverlayScrollbarsCss() {
  if (_osCssInjected || typeof document === "undefined") return;
  _osCssInjected = true;
  const style = document.createElement("style");
  style.dataset.stislaScrollAreaPluginCss = "";
  style.textContent = `@layer base { ${overlayScrollbarsCss} }`;
  document.head.appendChild(style);
}

export class ScrollArea extends Component {
  static eventNamespace = "scroll-area";
  static defaults = {
    autoHide: "leave",
    autoHideDelay: 800,
    clickScroll: true,
    overflowX: "scroll",
    overflowY: "scroll",
    theme: null,
  };

  constructor(el, opts) {
    super(el, opts);
    _injectOverlayScrollbarsCss();

    // Initialization object (not the short `OverlayScrollbars(el, opts)`
    // form) so we can disable the macOS auto-skip. Without the cancel
    // opt-out the plugin sees the overlay-style native scrollbar on
    // darwin and refuses to instrument the element; the host loses its
    // native bar paint but our overlay never renders either.
    this._os = OverlayScrollbars(
      {
        target: el,
        cancel: { nativeScrollbarsOverlaid: false, body: null },
      },
      {
        scrollbars: {
          theme: this.opts.theme || null,
          autoHide: this.opts.autoHide,
          autoHideDelay: Number(this.opts.autoHideDelay) || 800,
          clickScroll: this._coerceBool(this.opts.clickScroll),
        },
        overflow: {
          x: this.opts.overflowX,
          y: this.opts.overflowY,
        },
      },
    );

    el.dataset.state = READY;
    this.emit("ready", {}, { cancelable: false });
  }

  // === Public API =====================================================
  instance() {
    return this._os;
  }

  update() {
    this._os?.update(true);
  }

  destroy() {
    if (this._os) {
      this._os.destroy();
      this._os = null;
    }
    this.emit("destroyed", {}, { cancelable: false });
    super.destroy();
  }

  _coerceBool(v) {
    if (v === true || v === "true") return true;
    if (v === false || v === "false") return false;
    return Boolean(v);
  }
}
