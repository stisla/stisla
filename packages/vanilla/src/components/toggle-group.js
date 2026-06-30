// Stisla.ToggleGroup — V3.md §3.7 segmented + multi-select container.
//
// Anatomy:
//   <div class="toggle-group" data-stisla-toggle-group role="radiogroup|group" aria-label="…">
//     <button class="toggle" role="radio|null"
//             data-state="active|null"      ← single mode
//             aria-checked="true|false"     ← single mode
//             aria-pressed="true|false"     ← multiple mode
//             data-value="…">…</button>
//   </div>
//
// Type: 'single' — radio semantics (auto-select on arrow); 'multiple' — independent press toggles.
// Type/orientation autodetect from role/class when unset.
//
// Form-data path guard: if the wrapper contains a child .toggle-input, the browser owns selection —
// bail with a dev warning.
//
// Events (bubbling, detail: { group: this, member, value }):
//   stisla:toggle-group:change  — fired post-flip
//
// Opts:
//   type / orientation (null → autodetect), loop: true, rovingFocus: true

import { Component } from '../core/component.js';

const SINGLE = 'single';
const MULTIPLE = 'multiple';
const HORIZONTAL = 'horizontal';
const VERTICAL = 'vertical';

export class ToggleGroup extends Component {
  static eventNamespace = 'toggle-group';
  static defaults = {
    type: null,
    orientation: null,
    loop: true,
    rovingFocus: true,
  };

  constructor(el, opts) {
    super(el, opts);

    if (el.querySelector(':scope > .toggle-input')) {
      console.warn(
        '[stisla] .toggle-group contains a .toggle-input (form-data path); native browser handles selection. Skipping JS attach.',
        el,
      );
      this._inert = true;
      return;
    }

    this.opts.type = this._resolveType(this.opts.type);
    this.opts.orientation = this._resolveOrientation(this.opts.orientation);

    // String coercion safety net for non-JSON attribute values.
    if (this.opts.loop === 'false') this.opts.loop = false;
    if (this.opts.rovingFocus === 'false') this.opts.rovingFocus = false;

    this._onClick = this._onClick.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    this._onFocusin = this._onFocusin.bind(this);
    this.on(el, 'click', this._onClick);
    this.on(el, 'keydown', this._onKeydown);
    this.on(el, 'focusin', this._onFocusin);

    this._initRovingTabindex();
  }

  // === Public API =======================================================

  get value() {
    if (this._inert) return null;
    if (this.opts.type === SINGLE) {
      const active = this._getMembers().find((m) => this._isActive(m));
      return active ? this._memberValue(active) : null;
    }
    return this._getMembers()
      .filter((m) => this._isActive(m))
      .map((m) => this._memberValue(m));
  }

  getMembers() {
    return this._getMembers();
  }

  select(target) {
    if (this._inert) return;
    if (this.opts.type !== SINGLE) return;
    const member = this._resolveMember(target);
    if (!member || this._isDisabled(member)) return;
    if (this._isActive(member)) return;
    this._commitSingle(member);
  }

  press(target) {
    if (this._inert) return;
    if (this.opts.type !== MULTIPLE) return;
    const member = this._resolveMember(target);
    if (!member || this._isDisabled(member)) return;
    if (this._isActive(member)) return;
    this._commitMultiple(member, true);
  }

  unpress(target) {
    if (this._inert) return;
    if (this.opts.type !== MULTIPLE) return;
    const member = this._resolveMember(target);
    if (!member || this._isDisabled(member)) return;
    if (!this._isActive(member)) return;
    this._commitMultiple(member, false);
  }

  toggle(target) {
    if (this._inert) return;
    const member = this._resolveMember(target);
    if (!member || this._isDisabled(member)) return;
    if (this.opts.type === SINGLE) {
      this.select(member);
    } else {
      this._commitMultiple(member, !this._isActive(member));
    }
  }

  // === Listeners ========================================================

  _onClick(e) {
    const member = e.target.closest('.toggle');
    if (!member || !this.el.contains(member)) return;
    if (this._getMembers().indexOf(member) === -1) return;
    if (this._isDisabled(member)) {
      e.preventDefault();
      return;
    }
    if (this.opts.type === SINGLE) {
      if (!this._isActive(member)) this._commitSingle(member);
    } else {
      this._commitMultiple(member, !this._isActive(member));
    }
  }

  _onKeydown(e) {
    const member = e.target.closest('.toggle');
    if (!member || this._getMembers().indexOf(member) === -1) return;

    const horiz = this.opts.orientation === HORIZONTAL;
    const next = horiz ? 'ArrowRight' : 'ArrowDown';
    const prev = horiz ? 'ArrowLeft' : 'ArrowUp';

    switch (e.key) {
      case next: {
        e.preventDefault();
        this._focusSibling(member, +1);
        return;
      }
      case prev: {
        e.preventDefault();
        this._focusSibling(member, -1);
        return;
      }
      case 'Home': {
        e.preventDefault();
        this._focusEdge('first');
        return;
      }
      case 'End': {
        e.preventDefault();
        this._focusEdge('last');
        return;
      }
      case ' ':
      case 'Enter': {
        // Native <button> dispatches click for Space/Enter; let it bubble rather than double-firing.
        return;
      }
    }
  }

  _onFocusin(e) {
    // Roving tabindex: keep the focused member as the only tabbable one.
    const member = e.target.closest('.toggle');
    if (!member || this._getMembers().indexOf(member) === -1) return;
    if (!this.opts.rovingFocus) return;
    this._setRovingTo(member);
  }

  // === Internals ========================================================

  _resolveType(value) {
    if (value === SINGLE || value === MULTIPLE) return value;
    const role = this.el.getAttribute('role');
    if (role === 'radiogroup') return SINGLE;
    if (this.el.querySelector(':scope > .toggle[role="radio"]')) return SINGLE;
    return MULTIPLE;
  }

  _resolveOrientation(value) {
    if (value === HORIZONTAL || value === VERTICAL) return value;
    return this.el.classList.contains('toggle-group--vertical')
      ? VERTICAL
      : HORIZONTAL;
  }

  _getMembers() {
    // Live read so toggling members on/off doesn't strand a cached list.
    return Array.from(this.el.querySelectorAll(':scope > .toggle'));
  }

  _enabledMembers() {
    return this._getMembers().filter((m) => !this._isDisabled(m));
  }

  _isActive(member) {
    if (this.opts.type === SINGLE) {
      return member.getAttribute('aria-checked') === 'true';
    }
    return member.getAttribute('aria-pressed') === 'true';
  }

  _isDisabled(member) {
    return (
      member.disabled === true ||
      member.getAttribute('aria-disabled') === 'true'
    );
  }

  _memberValue(member) {
    if (!member) return null;
    return (
      member.getAttribute('data-value') ??
      String(this._getMembers().indexOf(member))
    );
  }

  _resolveMember(target) {
    if (target instanceof Element) return target;
    if (typeof target === 'number') {
      return this._getMembers()[target] ?? null;
    }
    if (typeof target === 'string') {
      const members = this._getMembers();
      return (
        members.find((m) => m.getAttribute('data-value') === target) ?? null
      );
    }
    return null;
  }

  _commitSingle(member) {
    const members = this._getMembers();
    const previousMember = members.find((m) => this._isActive(m)) ?? null;
    const previousValue = previousMember
      ? this._memberValue(previousMember)
      : null;
    const value = this._memberValue(member);

    const ok = this.emit('changing', {
      value,
      member,
      previousValue,
      previousMember,
    });
    if (!ok) return;

    for (const m of members) {
      if (m === member) {
        m.setAttribute('data-state', 'active');
        m.setAttribute('aria-checked', 'true');
      } else {
        m.removeAttribute('data-state');
        m.setAttribute('aria-checked', 'false');
      }
    }
    this._setRovingTo(member);
    this.emit(
      'changed',
      { value, member, previousValue, previousMember },
      { cancelable: false },
    );
  }

  _commitMultiple(member, next) {
    const action = next ? 'pressed' : 'unpressed';
    const proposedValue = next
      ? [...this.value, this._memberValue(member)]
      : this.value.filter((v) => v !== this._memberValue(member));

    const ok = this.emit('changing', {
      value: proposedValue,
      member,
      action,
    });
    if (!ok) return;

    member.setAttribute('aria-pressed', String(next));
    this._setRovingTo(member);
    this.emit(
      'changed',
      { value: this.value, member, action },
      { cancelable: false },
    );
  }

  _focusSibling(from, delta) {
    const enabled = this._enabledMembers();
    if (enabled.length === 0) return;
    let i = enabled.indexOf(from);
    // Disabled `from` — treat the cursor as just past the appropriate end so the delta lands on the
    // nearest enabled neighbor.
    if (i === -1) i = delta > 0 ? -1 : enabled.length;
    let next = i + delta;
    if (next < 0) next = this.opts.loop ? enabled.length - 1 : 0;
    if (next >= enabled.length) next = this.opts.loop ? 0 : enabled.length - 1;
    this._focusMember(enabled[next]);
  }

  _focusEdge(which) {
    const enabled = this._enabledMembers();
    if (enabled.length === 0) return;
    const target = which === 'first' ? enabled[0] : enabled[enabled.length - 1];
    this._focusMember(target);
  }

  _focusMember(member) {
    if (!member) return;
    this._setRovingTo(member);
    member.focus();
    // Single mode: WAI-ARIA radio-group pattern auto-selects on focus.
    if (this.opts.type === SINGLE && !this._isActive(member)) {
      this._commitSingle(member);
    }
  }

  _initRovingTabindex() {
    if (!this.opts.rovingFocus) return;
    const members = this._getMembers();
    if (members.length === 0) return;

    // Single mode: the active member is the canonical tab stop (falls back to first enabled).
    // Multiple mode: the first enabled member is the tab stop until the user focuses a specific one.
    let initial;
    if (this.opts.type === SINGLE) {
      initial =
        members.find((m) => this._isActive(m) && !this._isDisabled(m)) ?? null;
    }
    if (!initial) {
      initial = members.find((m) => !this._isDisabled(m)) ?? null;
    }
    if (!initial) return;
    this._setRovingTo(initial);
  }

  _setRovingTo(target) {
    if (!this.opts.rovingFocus) return;
    for (const m of this._getMembers()) {
      m.setAttribute('tabindex', m === target ? '0' : '-1');
    }
  }
}
