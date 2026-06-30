// Stisla.inertSiblings — drop everything outside an element's ancestor chain
// out of the focus + AT tree by walking from el up to <body> and setting the
// inert attribute on every sibling at each level. The ancestor chain itself
// stays interactive.
//
// Used by dialog and drawer. Returns a cleanup function that removes only
// the inert attributes this call added — siblings that already had inert
// before the call keep it.

export function inertSiblings(el) {
  const added = [];
  let cur = el;
  while (cur && cur.parentElement) {
    const parent = cur.parentElement;
    for (const sibling of parent.children) {
      if (sibling === cur) continue;
      if (!sibling.hasAttribute('inert')) {
        sibling.setAttribute('inert', '');
        added.push(sibling);
      }
    }
    if (parent === document.body || parent === document.documentElement) break;
    cur = parent;
  }
  return () => {
    for (const sibling of added) sibling.removeAttribute('inert');
    added.length = 0;
  };
}
