// Stisla.Toast — V3.md §3.7 reference implementation.
//
// Anatomy:
//   .toast-region[data-stisla-toast-region][--placement modifier]
//     .toast[data-stisla-toast][data-state="open|closed"]
//       .toast__icon
//       .toast__content > .toast__header / .toast__body / .toast__action
//       .toast__close[data-stisla-toast-dismiss]
//
// Events (bubbling, detail: { toast: this }):
//   stisla:toast:opening / opened / closing / closed / updated
//
// Opts (defaults below):
//   autohide:     true        — auto-dismisses after `delay` ms
//   delay:        4000        — autohide window
//   pauseOnHover: true        — clear timer on mouseenter, resume on mouseleave
//   pauseOnFocus: true        — same for focusin/focusout
//
// Two activation paths:
//   1. Markup-first — author writes .toast with data-stisla-toast; a trigger
//      ([data-stisla-toast-trigger="<id>"]) calls open() and starts the timer.
//   2. Imperative — Stisla.toast({...}) builds the node, mounts it into a region (auto-creating one
//      if absent), opens it, and removes it from the DOM after close.
//
// Promise integration: Stisla.toast.promise(p, { loading, success, error, description, delay }).

import { Component, getInstance } from "../core/component.js";
import { readOpts } from "../core/init.js";
import { waitForTransition } from "../core/transition.js";

const STATE_OPEN = "open";
const STATE_CLOSED = "closed";
const INTENT_KEYS = ["primary", "success", "warning", "danger", "info"];
const DEFAULT_REGION_NAME = "default";
const DEFAULT_REGION_PLACEMENT = "top-center";
const VARIANT_ICONS = {
  success: "circle-check",
  danger: "circle-x",
  warning: "triangle-alert",
  info: "info",
};
// Neutral default — bell is semantic for a notification surface and fills the required icon column.
const DEFAULT_ICON = "bell";

export class Toast extends Component {
  static eventNamespace = "toast";
  static defaults = {
    autohide: true,
    delay: 4000,
    pauseOnHover: true,
    pauseOnFocus: true,
  };

  constructor(el, opts) {
    super(el, opts);

    // Coerce string-form opts from the attribute reader.
    if (this.opts.autohide === "false") this.opts.autohide = false;
    if (this.opts.autohide === "true") this.opts.autohide = true;
    if (typeof this.opts.delay === "string") {
      const n = Number(this.opts.delay);
      if (!Number.isNaN(n)) this.opts.delay = n;
    }

    if (!el.dataset.state) el.dataset.state = STATE_CLOSED;
    el.setAttribute(
      "aria-hidden",
      el.dataset.state === STATE_OPEN ? "false" : "true",
    );

    this._timer = null;
    this._timerStartedAt = 0;
    this._timerRemaining = 0;
    this._owned = false;

    if (this.opts.pauseOnHover) {
      this.on(el, "mouseenter", () => this._pauseTimer());
      this.on(el, "mouseleave", () => this._resumeTimer());
    }
    if (this.opts.pauseOnFocus) {
      this.on(el, "focusin", () => this._pauseTimer());
      this.on(el, "focusout", () => this._resumeTimer());
    }
  }

  open() {
    if (!this.el) return this;
    if (this.el.dataset.state === STATE_OPEN) {
      // Re-trigger restarts the timer.
      this._clearTimer();
      if (this.opts.autohide) this._startTimer(this.opts.delay);
      return this;
    }
    if (!this.emit("opening")) return this;

    // Force reflow so the closed → open transition runs.
    void this.el.offsetWidth;

    requestAnimationFrame(() => {
      if (!this.el) return;
      this.el.dataset.state = STATE_OPEN;
      this.el.setAttribute("aria-hidden", "false");
      this._announce();

      if (this.opts.autohide) this._startTimer(this.opts.delay);

      waitForTransition(this.el).then(() => {
        if (!this.el) return;
        this.emit("opened", {}, { cancelable: false });
      });
    });
    return this;
  }

  close() {
    if (!this.el) return this;
    if (this.el.dataset.state !== STATE_OPEN) return this;
    if (!this.emit("closing")) return this;

    this._clearTimer();
    this.el.dataset.state = STATE_CLOSED;
    this.el.setAttribute("aria-hidden", "true");

    waitForTransition(this.el).then(() => {
      if (!this.el) return;
      const node = this.el;
      const owned = this._owned;
      this.emit("closed", {}, { cancelable: false });
      if (owned) {
        this.destroy();
        node.remove();
      }
    });
    return this;
  }

  toggle() {
    return this.el?.dataset.state === STATE_OPEN ? this.close() : this.open();
  }

  // In-place content patch. Used by promise() to swap loading → settled.
  update(patch = {}) {
    if (!this.el) return this;

    if (patch.title !== undefined)
      this._setText(".toast__header", patch.title, "content-top");
    if (patch.description !== undefined)
      this._setText(".toast__body", patch.description, "before-action");

    if (patch.variant !== undefined) {
      for (const v of INTENT_KEYS) this.el.classList.remove(`toast--${v}`);
      if (patch.variant) this.el.classList.add(`toast--${patch.variant}`);
      const isAssertive = patch.variant === "danger";
      this.el.setAttribute("role", isAssertive ? "alert" : "status");
      this.el.setAttribute("aria-live", isAssertive ? "assertive" : "polite");
    }

    if (patch.icon !== undefined) this._setIcon(patch.icon);

    if (patch.autohide !== undefined) this.opts.autohide = patch.autohide;
    if (patch.delay !== undefined) this.opts.delay = patch.delay;

    this._clearTimer();
    if (this.opts.autohide && this.el.dataset.state === STATE_OPEN) {
      this._startTimer(this.opts.delay);
    }

    refreshLucideIcons();

    if (
      (patch.title !== undefined || patch.description !== undefined) &&
      this.el.dataset.state === STATE_OPEN
    ) {
      this._announce();
    }

    this.emit("updated", { patch }, { cancelable: false });
    return this;
  }

  destroy() {
    this._clearTimer();
    super.destroy();
  }

  // === Internals ========================================================
  _startTimer(delay) {
    if (!delay || delay <= 0) return;
    this._timerStartedAt = Date.now();
    this._timerRemaining = delay;
    this._timer = setTimeout(() => this.close(), delay);
  }

  _pauseTimer() {
    if (!this._timer) return;
    clearTimeout(this._timer);
    this._timer = null;
    const elapsed = Date.now() - this._timerStartedAt;
    this._timerRemaining = Math.max(0, this._timerRemaining - elapsed);
  }

  _resumeTimer() {
    if (this._timer || !this._timerRemaining || !this.opts.autohide) return;
    this._startTimer(this._timerRemaining);
  }

  _clearTimer() {
    if (this._timer) clearTimeout(this._timer);
    this._timer = null;
    this._timerRemaining = 0;
  }

  _setText(selector, value, placement) {
    let node = this.el.querySelector(selector);
    if (value === null || value === "") {
      node?.remove();
      return;
    }
    if (!node) {
      node = document.createElement("div");
      node.className = selector.replace(".", "");
      this._insertPart(node, placement);
    }
    node.textContent = value;
  }

  _setIcon(icon) {
    let slot = this.el.querySelector(".toast__icon");
    if (icon === null) {
      // Icon column is required — fall back to default rather than remove.
      icon = buildLucideIcon(DEFAULT_ICON);
    }
    if (!slot) {
      slot = document.createElement("div");
      slot.className = "toast__icon";
      this.el.prepend(slot);
    }
    slot.replaceChildren(icon);
  }

  // Route the toast's text through a persistent polite live region so it is
  // announced on open. Each toast is inserted into its region already fully
  // populated, and a polite live region added to the DOM pre-populated is not
  // reliably announced by screen readers — which is why previously only the
  // danger toast (role="alert") spoke. Danger toasts keep announcing via their
  // own role="alert" node and are skipped here to avoid a double read.
  _announce() {
    if (!this.el || this.el.classList.contains("toast--danger")) return;
    const header = this.el.querySelector(".toast__header");
    const body = this.el.querySelector(".toast__body");
    const parts = [header, body]
      .map((n) => (n ? n.textContent.trim() : ""))
      .filter(Boolean);
    if (parts.length) announcePolite(parts.join(". "));
  }

  // All content parts (header/body/action) live inside .toast__content — the middle grid column.
  _insertPart(node, placement) {
    let content = this.el.querySelector(".toast__content");
    if (!content) {
      content = document.createElement("div");
      content.className = "toast__content";
      // Insert .toast__content as the icon's next sibling so column order stays icon → content → close.
      const icon = this.el.querySelector(".toast__icon");
      if (icon) icon.after(content);
      else this.el.prepend(content);
    }

    if (placement === "content-top") {
      content.prepend(node);
      return;
    }
    if (placement === "before-action") {
      const action = content.querySelector(".toast__action");
      if (action) content.insertBefore(node, action);
      else content.appendChild(node);
      return;
    }
    content.appendChild(node);
  }

}

// === Imperative helper ===================================================
// Stisla.toast({ title, description, variant, icon, action, autohide, delay, region, … })

export function toast(opts = {}) {
  const region = resolveRegion(opts.region);
  const el = buildToastNode(opts);
  region.appendChild(el);
  refreshLucideIcons();

  const instance = new Toast(el, normalizeInstanceOpts(opts));
  instance._owned = true;
  // Open on next frame so the closed → open transition runs.
  requestAnimationFrame(() => instance.open());
  return instance;
}

toast.success = (title, opts = {}) =>
  toast({ ...opts, title, variant: "success" });
toast.error = (title, opts = {}) =>
  toast({ ...opts, title, variant: "danger" });
toast.warning = (title, opts = {}) =>
  toast({ ...opts, title, variant: "warning" });
toast.info = (title, opts = {}) => toast({ ...opts, title, variant: "info" });

// Stisla.toast.promise(promise, { loading, success, error, description, delay })
// Shows a loading toast (spinner icon, no autohide), updates on settle. The original promise is not
// intercepted.
toast.promise = (promise, opts = {}) => {
  const desc = opts.description;
  const descOf = (key, arg) => {
    if (desc == null) return undefined;
    if (typeof desc === "object") {
      const v = desc[key];
      return typeof v === "function" ? v(arg) : v;
    }
    return desc;
  };

  const t = toast({
    title: opts.loading,
    description: descOf("loading"),
    icon: buildSpinnerNode(),
    autohide: false,
    region: opts.region,
  });

  const delay = opts.delay ?? Toast.defaults.delay;

  Promise.resolve(promise).then(
    (data) => {
      const title =
        typeof opts.success === "function" ? opts.success(data) : opts.success;
      t.update({
        title,
        description: descOf("success", data),
        variant: "success",
        icon: buildLucideIcon(VARIANT_ICONS.success),
        autohide: true,
        delay,
      });
    },
    (err) => {
      const title =
        typeof opts.error === "function" ? opts.error(err) : opts.error;
      t.update({
        title,
        description: descOf("error", err),
        variant: "danger",
        icon: buildLucideIcon(VARIANT_ICONS.danger),
        autohide: true,
        delay,
      });
    },
  );

  return t;
};

// === DOM builders ========================================================
function buildToastNode(opts) {
  const root = document.createElement("div");
  root.className = "toast";
  if (opts.variant) root.classList.add(`toast--${opts.variant}`);
  root.dataset.stislaToast = "";
  root.dataset.state = STATE_CLOSED;
  root.setAttribute("role", opts.variant === "danger" ? "alert" : "status");
  root.setAttribute(
    "aria-live",
    opts.variant === "danger" ? "assertive" : "polite",
  );
  root.setAttribute("aria-atomic", "true");
  root.setAttribute("aria-hidden", "true");

  // Col 1 — icon (required). Falls back to bell when the consumer doesn't provide one + no variant.
  const iconNode =
    opts.icon !== undefined && opts.icon !== null
      ? opts.icon
      : buildLucideIcon(
          opts.variant ? VARIANT_ICONS[opts.variant] : DEFAULT_ICON,
        );
  const iconSlot = document.createElement("div");
  iconSlot.className = "toast__icon";
  iconSlot.appendChild(iconNode);
  root.appendChild(iconSlot);

  // Col 2 — content stack.
  const content = document.createElement("div");
  content.className = "toast__content";

  if (opts.title) {
    const header = document.createElement("div");
    header.className = "toast__header";
    header.textContent = opts.title;
    content.appendChild(header);
  }

  if (opts.description) {
    const body = document.createElement("div");
    body.className = "toast__body";
    body.textContent = opts.description;
    content.appendChild(body);
  }

  if (opts.action && opts.action.label) {
    const action = document.createElement("div");
    action.className = "toast__action";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "button button--sm button--ghost button--neutral button--flush-start";
    btn.textContent = opts.action.label;
    btn.addEventListener("click", (e) => {
      try {
        opts.action.onClick?.(e);
      } finally {
        if (opts.action.dismissOnClick !== false) {
          getInstance(root)?.close();
        }
      }
    });
    action.appendChild(btn);
    content.appendChild(action);
  }

  root.appendChild(content);

  // Col 3 — close chip.
  const close = document.createElement("button");
  close.type = "button";
  close.className = "toast__close";
  close.dataset.stislaToastDismiss = "";
  close.setAttribute("aria-label", "Close");
  close.appendChild(buildLucideIcon("x"));
  root.appendChild(close);

  return root;
}

function buildLucideIcon(name) {
  const i = document.createElement("i");
  i.setAttribute("data-lucide", name);
  return i;
}

function buildSpinnerNode() {
  const s = document.createElement("span");
  s.className = "spinner spinner--sm";
  s.setAttribute("role", "status");
  s.setAttribute("aria-label", "Loading");
  return s;
}

function normalizeInstanceOpts(opts) {
  const out = {};
  if (opts.autohide !== undefined) out.autohide = opts.autohide;
  if (opts.delay !== undefined) out.delay = opts.delay;
  if (opts.pauseOnHover !== undefined) out.pauseOnHover = opts.pauseOnHover;
  if (opts.pauseOnFocus !== undefined) out.pauseOnFocus = opts.pauseOnFocus;
  return out;
}

function resolveRegion(target) {
  if (target instanceof HTMLElement) return target;
  if (typeof target === "string") {
    const found = document.querySelector(target);
    if (found) return found;
  }
  // Prefer the named default region if one exists.
  const named = document.querySelector(
    `[data-stisla-toast-region="${DEFAULT_REGION_NAME}"]`,
  );
  if (named) return named;
  // Otherwise the first region on the page.
  const first = document.querySelector(".toast-region");
  if (first) return first;
  // None found — create a default one in <body>.
  const region = document.createElement("div");
  region.className = `toast-region toast-region--${DEFAULT_REGION_PLACEMENT}`;
  region.setAttribute("role", "region");
  region.setAttribute("aria-label", "Notifications");
  region.dataset.stislaToastRegion = DEFAULT_REGION_NAME;
  document.body.appendChild(region);
  return region;
}

// Persistent, initially-empty polite live region shared by every toast. Unlike
// a toast node (inserted already-populated, so the polite announcement is
// dropped), this region lives empty in <body>; appending a line to it fires a
// fresh announcement each time. One node per message so several toasts opening
// in the same frame each announce instead of overwriting one another.
let politeAnnouncer = null;

function announcePolite(message) {
  if (typeof document === "undefined" || !message) return;
  if (!politeAnnouncer || !politeAnnouncer.isConnected) {
    politeAnnouncer = document.createElement("div");
    politeAnnouncer.dataset.stislaToastAnnouncer = "";
    politeAnnouncer.setAttribute("aria-live", "polite");
    // Visually hidden, but present in the accessibility tree.
    politeAnnouncer.style.cssText =
      "position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0;";
    document.body.appendChild(politeAnnouncer);
  }
  const line = document.createElement("div");
  line.textContent = message;
  politeAnnouncer.appendChild(line);
  setTimeout(() => line.remove(), 1000);
}

function refreshLucideIcons() {
  if (typeof window === "undefined") return;
  const lib = window.lucide;
  if (lib && typeof lib.createIcons === "function") {
    try {
      lib.createIcons({ nameAttr: "data-lucide" });
    } catch (e) {
      /* noop */
    }
  }
}

// === Module-level delegated handlers =====================================
if (
  typeof document !== "undefined" &&
  typeof window !== "undefined" &&
  !window.__stislaToastBound
) {
  window.__stislaToastBound = true;

  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-stisla-toast-trigger]");
    if (opener) {
      const id = opener.getAttribute("data-stisla-toast-trigger");
      const toastEl = id && document.getElementById(id);
      if (toastEl && toastEl.classList.contains("toast")) {
        e.preventDefault();
        const opts = readOpts(toastEl, "toast", Toast);
        const existing = getInstance(toastEl);
        const inst = existing ?? new Toast(toastEl, opts);
        if (existing) Object.assign(existing.opts, opts);
        inst.open();
      }
      return;
    }

    const dismiss = e.target.closest("[data-stisla-toast-dismiss]");
    if (dismiss) {
      const toastEl = dismiss.closest(".toast");
      const inst = toastEl && getInstance(toastEl);
      inst?.close();
    }
  });
}
