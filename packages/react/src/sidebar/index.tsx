import type {
  AnchorHTMLAttributes,
  ElementType,
  HTMLAttributes,
  Ref,
} from "react";
import {
  composer,
  sidebar,
  sidebarKnobs,
  type SidebarKnob,
  type Tune,
} from "@stisla/style";

/* Sidebar — compound React wrapper. THIN by design: every component here resolves to the same
 * BEM classes + --sidebar-* vars a vanilla author would type by hand (ARCHITECTURE §5B). No
 * styling lives here — sidebar.css owns it. The dot-notation API (<Sidebar.Header/> etc.) is
 * purely React ergonomics over that shared CSS.
 *
 * Knob inheritance is CSS, not React: set a knob via `tune` on the root and the cascade
 * distributes it to every inner part. A `tune` on a sub-part overrides just that subtree
 * (closer in the cascade) — the "one vs all" override with no second system.
 *
 * Interactive behavior (submenu toggle, collapse animation) is the separate @stisla/vanilla
 * layer (Phase 5 stage 3). These wrappers render structure + styling only; `collapsed` here is
 * the static [data-collapsed] attribute. */

type TuneProp = { tune?: Tune<SidebarKnob> };

/* React's HTMLAttributes allows data-* only on intrinsic JSX elements, not on a custom component's
 * props. Sidebar parts carry state via data-* (data-state, data-collapsing), so allow them. */
type DataAttrs = { [key: `data-${string}`]: string | number | boolean | undefined };

/* Shared props for the plain structural parts: tune + native attributes of the rendered tag. */
type PartProps = TuneProp & HTMLAttributes<HTMLElement> & DataAttrs;

/* Factory for the structural sub-parts that are just <tag class + tune>. Each gets its own
 * composer bound to its BEM base but the SHARED knob namespace, so `tune` is typed identically
 * everywhere. */
function part(base: string, Tag: ElementType) {
  // variants: {} (not omitted) so V infers as empty — otherwise TS widens to the VariantDefs
  // index signature, which collides with the typed `tune` prop.
  const compose = composer({ base, variants: {}, knobPrefix: "sidebar", knobs: sidebarKnobs });
  function Part({ tune, className, style, ...rest }: PartProps) {
    const c = compose({ tune, className });
    return <Tag className={c.className} style={{ ...c.style, ...style }} {...rest} />;
  }
  Part.displayName = base;
  return Part;
}

/* === Root === */
type SidebarComposerProps = NonNullable<Parameters<typeof sidebar>[0]>;
export type SidebarProps = SidebarComposerProps &
  Omit<HTMLAttributes<HTMLElement>, keyof SidebarComposerProps> &
  DataAttrs & {
    ref?: Ref<HTMLElement>;
    /* Rail / mini mode → the [data-collapsed] attribute (a state, not a class). */
    collapsed?: boolean;
  };

function SidebarRoot({
  ref,
  size,
  tune,
  className,
  style,
  collapsed,
  children,
  ...rest
}: SidebarProps) {
  const c = sidebar({ size, tune, className });
  return (
    <aside
      ref={ref}
      className={c.className}
      style={{ ...c.style, ...style }}
      data-collapsed={collapsed ? "" : undefined}
      {...rest}
    >
      {children}
    </aside>
  );
}
SidebarRoot.displayName = "Sidebar";

/* === Brand (default <a>, the wordmark link) === */
export type SidebarBrandProps = TuneProp &
  AnchorHTMLAttributes<HTMLAnchorElement> & { ref?: Ref<HTMLAnchorElement> };
const brandCompose = composer({
  base: "sidebar__brand",
  variants: {},
  knobPrefix: "sidebar",
  knobs: sidebarKnobs,
});
function SidebarBrand({ ref, tune, className, style, ...rest }: SidebarBrandProps) {
  const c = brandCompose({ tune, className });
  return <a ref={ref} className={c.className} style={{ ...c.style, ...style }} {...rest} />;
}
SidebarBrand.displayName = "Sidebar.Brand";

/* === Button (item) — polymorphic: <a> when given href, else <button> === */
export type SidebarButtonProps = TuneProp &
  HTMLAttributes<HTMLElement> &
  DataAttrs & {
    ref?: Ref<HTMLElement>;
    href?: string;
  };
const buttonCompose = composer({
  base: "sidebar__button",
  variants: {},
  knobPrefix: "sidebar",
  knobs: sidebarKnobs,
});
function SidebarButton({
  ref,
  href,
  tune,
  className,
  style,
  children,
  ...rest
}: SidebarButtonProps) {
  const c = buttonCompose({ tune, className });
  const shared = { className: c.className, style: { ...c.style, ...style }, ...rest };
  return href != null ? (
    <a ref={ref as Ref<HTMLAnchorElement>} href={href} {...shared}>
      {children}
    </a>
  ) : (
    <button ref={ref as Ref<HTMLButtonElement>} type="button" {...shared}>
      {children}
    </button>
  );
}
SidebarButton.displayName = "Sidebar.Button";

/* === Item action — default <span> (badge holder); `as="button"` for the submenu-toggle case === */
export type SidebarItemActionProps = PartProps & { as?: "span" | "button" };
const itemActionCompose = composer({
  base: "sidebar__item-action",
  variants: {},
  knobPrefix: "sidebar",
  knobs: sidebarKnobs,
});
function SidebarItemAction({
  as = "span",
  tune,
  className,
  style,
  children,
  ...rest
}: SidebarItemActionProps) {
  const c = itemActionCompose({ tune, className });
  const shared = { className: c.className, style: { ...c.style, ...style }, ...rest };
  return as === "button" ? (
    <button type="button" {...shared}>
      {children}
    </button>
  ) : (
    <span {...shared}>{children}</span>
  );
}
SidebarItemAction.displayName = "Sidebar.ItemAction";

/* === Plain structural parts === */
const Header = part("sidebar__header", "header");
const Content = part("sidebar__content", "div");
const Footer = part("sidebar__footer", "footer");
const Menu = part("sidebar__menu", "nav");
const Group = part("sidebar__group", "div");
const GroupTitle = part("sidebar__group-title", "span");
const GroupAction = part("sidebar__group-action", "div");
const List = part("sidebar__list", "ul");
const Item = part("sidebar__item", "li");
const Submenu = part("sidebar__submenu", "div");
const Caret = part("sidebar__caret", "span");

/* === Compound assembly (dot-notation API) === */
export const Sidebar = Object.assign(SidebarRoot, {
  Header,
  Brand: SidebarBrand,
  Content,
  Footer,
  Menu,
  Group,
  GroupTitle,
  GroupAction,
  List,
  Item,
  Button: SidebarButton,
  ItemAction: SidebarItemAction,
  Submenu,
  Caret,
});
