import { useEffect, useRef, useState } from "react";
import { useLocation } from "@tanstack/react-router";

/* Table of contents — built at runtime from the rendered doc, not at build time.
 * Doc pages are hand-authored JSX (<section><h2>…</h2></section>), so there's no
 * static format to parse; a DOM scan after render keeps the TOC fully decoupled
 * from authoring (new pages get one for free). Mirrors what the legacy docs did
 * in site.js. Client-only: SSR renders an empty rail, it fills on hydrate. */

export type TocEntry = {
  id: string;
  text: string;
  level: 2 | 3;
  children: TocEntry[];
};

/* GitHub-style slug: lowercased, non-word stripped, spaces → hyphens. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function useToc(): {
  entries: TocEntry[];
  activeId: string | null;
  scanned: boolean;
} {
  const { pathname } = useLocation();
  const [entries, setEntries] = useState<TocEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  /* False until the first client scan runs (SSR + first render). Lets the rail
   * show a skeleton in that window, then settle to the real ToC — never resets,
   * so client-side navigation doesn't reflash the skeleton. */
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const container = document.querySelector(".main-container");
    if (!container) {
      setEntries([]);
      setActiveId(null);
      return;
    }

    /* Heading order drives both the rail and the active-pick rules below. The
     * set is rebuilt by scan() whenever content changes (route code-splits in
     * after the effect runs, demos mutate the DOM), so it lives in closure
     * state the observers share rather than being captured once. */
    let ids: string[] = [];
    let sig = "";
    const visible = new Set<string>();
    let io: IntersectionObserver | null = null;

    /* Active-pick rules, in order (ported from the legacy site.js scrollspy):
     *   1. Scrolled to the bottom of the document → last heading wins. A short
     *      final section's heading may never reach the top-third trigger band,
     *      so without this it could never go active.
     *   2. Topmost heading currently inside the trigger band.
     *   3. Last heading whose top is above the viewport (keeps the most
     *      recently passed section lit between far-apart headings).
     *   4. First heading (page is scrolled above all of them). */
    const pickActive = (): string | null => {
      if (!ids.length) return null;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (atBottom) return ids[ids.length - 1];
      let pick = ids.find((id) => visible.has(id));
      if (!pick) {
        const above = ids.filter((id) => {
          const el = document.getElementById(id);
          return el && el.getBoundingClientRect().top < 0;
        });
        pick = above[above.length - 1] || ids[0];
      }
      return pick ?? null;
    };
    const updateActive = () => setActiveId(pickActive());

    const scan = () => {
      /* Skip headings inside demo viewers (.not-prose) — sample content. */
      const headings = Array.from(
        container.querySelectorAll<HTMLHeadingElement>("h2, h3"),
      ).filter((h) => !h.closest(".not-prose"));

      /* Bail early if the heading set is unchanged — demos mutate the DOM
       * constantly and we don't want to rebuild the tree / rewire the observer
       * on every keystroke in a sample. */
      const nextSig = headings
        .map((h) => `${h.tagName}:${h.textContent?.trim() ?? ""}`)
        .join("|");
      if (nextSig === sig) return;
      sig = nextSig;

      /* Assign a stable id to each heading (anchor target) if it has none. */
      const seen = new Set<string>();
      const flat = headings.map((h) => {
        let id = h.id;
        if (!id) {
          const base = slugify(h.textContent ?? "") || "section";
          id = base;
          let n = 1;
          while (seen.has(id)) id = `${base}-${++n}`;
          h.id = id;
        }
        seen.add(id);
        return {
          el: h,
          id,
          text: h.textContent?.trim() ?? "",
          level: (h.tagName === "H2" ? 2 : 3) as 2 | 3,
        };
      });

      /* Nest h3s under the preceding h2. */
      const tree: TocEntry[] = [];
      for (const item of flat) {
        const entry: TocEntry = {
          id: item.id,
          text: item.text,
          level: item.level,
          children: [],
        };
        if (item.level === 3 && tree.length) {
          tree[tree.length - 1].children.push(entry);
        } else {
          tree.push(entry);
        }
      }
      setEntries(tree);
      ids = flat.map((i) => i.id);

      /* Rewire the observer onto the current headings. */
      io?.disconnect();
      visible.clear();
      if (flat.length === 0) {
        setActiveId(null);
        return;
      }
      io = new IntersectionObserver(
        (records) => {
          for (const r of records) {
            if (r.isIntersecting) visible.add(r.target.id);
            else visible.delete(r.target.id);
          }
          updateActive();
        },
        { rootMargin: "0px 0px -66% 0px", threshold: 0 },
      );
      flat.forEach((i) => io!.observe(i.el));
      updateActive();
    };

    scan();
    setScanned(true);

    /* Re-scan when the content actually changes. Route components code-split in
     * after this effect first runs, so a one-shot scan on navigation would miss
     * them; this catches the content arriving (and any later DOM changes).
     * Coalesced to one rAF so a burst of mutations triggers a single scan. */
    let scanPending = false;
    const mo = new MutationObserver(() => {
      if (scanPending) return;
      scanPending = true;
      requestAnimationFrame(() => {
        scanPending = false;
        scan();
      });
    });
    mo.observe(container, { childList: true, subtree: true });

    /* The observer only fires when a heading crosses the trigger band; rules 1
     * and 3 also need re-evaluating on plain scroll (reaching the bottom, or
     * passing a heading off the top). rAF-throttled. */
    let scrollPending = false;
    const onScroll = () => {
      if (scrollPending) return;
      scrollPending = true;
      requestAnimationFrame(() => {
        scrollPending = false;
        updateActive();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io?.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return { entries, activeId, scanned };
}

/* Presentational TOC tree. Reused by the desktop rail and the mobile strip. */
export function Toc({
  entries,
  activeId,
  title,
  onNavigate,
}: {
  entries: TocEntry[];
  activeId: string | null;
  title?: boolean;
  onNavigate?: () => void;
}) {
  const navRef = useRef<HTMLElement>(null);

  /* Keep the active link in view when the rail itself scrolls (long ToCs). Only
   * the rail is scrolled — never the page — so we adjust this nav's own scrollTop
   * rather than calling scrollIntoView (which would also scroll ancestors/window).
   * No-ops on the mobile strip and short ToCs, where the nav doesn't overflow. */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !activeId || nav.scrollHeight <= nav.clientHeight) return;
    const link = nav.querySelector<HTMLElement>('[aria-current="true"]');
    if (!link) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const margin = 24;
    const behavior: ScrollBehavior = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
      ? "auto"
      : "smooth";

    if (linkRect.top < navRect.top + margin) {
      nav.scrollTo({
        top: nav.scrollTop + (linkRect.top - navRect.top) - margin,
        behavior,
      });
    } else if (linkRect.bottom > navRect.bottom - margin) {
      nav.scrollTo({
        top: nav.scrollTop + (linkRect.bottom - navRect.bottom) + margin,
        behavior,
      });
    }
  }, [activeId]);

  return (
    <nav ref={navRef} className="site-toc" aria-label="On this page">
      {title && <p className="site-toc__title">On this page</p>}
      <ul className="site-toc__list">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              className="site-toc__link"
              href={`#${entry.id}`}
              aria-current={activeId === entry.id ? "true" : undefined}
              onClick={onNavigate}
            >
              {entry.text}
            </a>
            {entry.children.length > 0 && (
              <ul className="site-toc__sublist">
                {entry.children.map((child) => (
                  <li key={child.id}>
                    <a
                      className="site-toc__link"
                      href={`#${child.id}`}
                      aria-current={activeId === child.id ? "true" : undefined}
                      onClick={onNavigate}
                    >
                      {child.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
