// Stisla.waitForTransition — resolve once the element's CSS transition has
// settled, with a setTimeout safety net so the caller can't strand.
//
// Used by dialog, drawer, menu, tooltip, popover, and toast for the
// "flip data-state → wait for the close transition → tear down DOM" path.
//
// Behavior:
//   - Null / missing element resolves on the next microtask.
//   - prefers-reduced-motion resolves on the next frame (no transition to wait on).
//   - transition-duration: 0 resolves on the next frame.
//   - Otherwise listens for transitionend on el and resolves there; falls
//     back to a setTimeout(duration × 1.5 + 50ms) so an interrupted or
//     never-firing transitionend (display:none mid-flight, browser quirk,
//     fractional rounding) doesn't strand the caller.

export function waitForTransition(el) {
  return new Promise((resolve) => {
    if (!el) return resolve();
    const reduced =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      requestAnimationFrame(() => resolve());
      return;
    }
    const cs = getComputedStyle(el);
    const durations = cs.transitionDuration
      .split(',')
      .map((s) => parseFloat(s) || 0);
    const total = durations.length ? Math.max(...durations) : 0;
    if (total === 0) {
      requestAnimationFrame(() => resolve());
      return;
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.removeEventListener('transitionend', onEnd);
      clearTimeout(fallback);
      resolve();
    };
    const onEnd = (e) => {
      if (e.target === el) finish();
    };
    el.addEventListener('transitionend', onEnd);
    const fallback = setTimeout(finish, total * 1000 * 1.5 + 50);
  });
}
