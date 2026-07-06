// // use tailwind utilities here to reduce bundle (i'm lazy)
// import { useEffect, type CSSProperties, type ReactNode } from "react";
// import { createFileRoute } from "@tanstack/react-router";
// import {
//   Archive,
//   ArrowRight,
//   BarChart3,
//   Bell,
//   Check,
//   CheckCheck,
//   CircleCheck,
//   GitBranch,
//   LayoutDashboard,
//   Lock,
//   Mail,
//   Package,
//   Search,
//   Settings,
//   ShoppingBag,
//   Tag,
//   Trash2,
//   Users,
// } from "lucide-react";

// export const Route = createFileRoute("/_showcase")({
//   head: () => ({
//     meta: [
//       { title: "Showcase — Stisla" },
//       {
//         name: "description",
//         content:
//           "A tilted collage of Stisla components — cards, tables, menus, forms, and charts drawn from one set of tokens.",
//       },
//     ],
//   }),
//   component: Showcase,
// });

// /* A full-bleed, tilted collage of Stisla components — the shape aikit/selia use for their
//  * social/OG previews. Everything reads the framework tokens, so it's pinned to dark here for
//  * a consistent card image regardless of the visitor's saved theme. */
// function Showcase() {
//   useEffect(() => {
//     const html = document.documentElement;
//     const had = html.classList.contains("dark");
//     html.classList.add("dark");
//     return () => {
//       if (!had) html.classList.remove("dark");
//     };
//   }, []);

//   return (
//     <div
//       aria-hidden
//       className="fixed h-full w-full top-0 left-0 overflow-hidden z-9999"
//       /* Instant dark paint before the `dark` class lands on <html> (= --color-background dark). */
//       style={{ background: "oklch(0.155 0 0)" }}
//     >
//       <div
//         className="relative h-full w-full"
//         style={{
//           maskImage:
//             "radial-gradient(ellipse 115% 115% at 50% 50%, black 62%, transparent 100%)",
//           WebkitMaskImage:
//             "radial-gradient(ellipse 115% 115% at 50% 50%, black 62%, transparent 100%)",
//         }}
//       >
//         <div
//           className="absolute left-1/2 top-1/2 flex w-[2400px] items-start gap-6"
//           style={{
//             transform: "translate(-50%, -50%) rotate(-12deg) scale(1.1)",
//             transformOrigin: "50% 50%",
//           }}
//         >
//           <Column offset={-110}>
//             <CardStat />
//             <CardToggles />
//             <CardBadges />
//             <CardProgress />
//           </Column>
//           <Column offset={-60}>
//             <CardCommand />
//             <CardProfileForm />
//             <CardStat />
//             <CardActivity />
//           </Column>
//           <Column offset={10}>
//             <CardTabs />
//             <CardRealtime />
//             <CardAlert />
//             <CardDeleteConfirm />
//             <CardSlider />
//             <CardMeter />
//             <CardProgress />
//           </Column>
//           <Column offset={70}>
//             <CardTable />
//             <CardLogin />
//             <CardAvatars />
//             <CardToggles />
//           </Column>
//           <Column offset={150}>
//             <CardSidebar />
//             <CardTeamMembers />
//             <CardProfile />
//           </Column>
//           <Column offset={230}>
//             <CardStat />
//             <CardCommand />
//             <CardMeter />
//             <CardActivity />
//           </Column>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Column({ offset, children }: { offset: number; children: ReactNode }) {
//   return (
//     <div
//       className="flex w-[360px] shrink-0 flex-col gap-6"
//       style={{ transform: `translateY(${offset}px)` }}
//     >
//       {children}
//     </div>
//   );
// }

// /* A neutral surface tile for content that isn't itself a self-contained component. Components
//  * that already bring their own surface (.card, .menu__popup, .sidebar) render bare. */
// function Panel({
//   className = "",
//   children,
// }: {
//   className?: string;
//   children: ReactNode;
// }) {
//   return (
//     <div
//       className={`rounded-xl border border-border bg-surface p-4 shadow-xl shadow-black/40 ${className}`}
//     >
//       {children}
//     </div>
//   );
// }

// function Avatar({
//   initials,
//   bg,
//   size = "sm",
// }: {
//   initials: string;
//   bg: string;
//   size?: "sm" | "lg" | "base";
// }) {
//   const mod = size === "base" ? "" : `avatar--${size}`;
//   return (
//     <span className={`avatar ${mod} avatar--circle`}>
//       <span
//         className="avatar__fallback"
//         style={{ background: bg, color: "white" }}
//       >
//         {initials}
//       </span>
//     </span>
//   );
// }

// /* ── Cards ─────────────────────────────────────────────────────────────── */

// function CardStat() {
//   return (
//     <div className="card">
//       <div className="card__header">
//         <span className="card__title">Monthly revenue</span>
//         <div className="card__action">
//           <span className="badge badge--soft badge--success">+12.5%</span>
//         </div>
//       </div>
//       <div className="card__body">
//         <div className="text-3xl font-semibold tracking-tight">$48,290</div>
//         <p className="card__text text-muted-foreground">
//           8,142 orders across web and retail.
//         </p>
//       </div>
//     </div>
//   );
// }

// function CardActivity() {
//   const rows = [
//     {
//       initials: "SR",
//       bg: "var(--color-primary)",
//       name: "Sonya Ryan",
//       action: "assigned you to Q3 roadmap",
//       time: "12 minutes ago",
//     },
//     {
//       initials: "GB",
//       bg: "var(--color-info)",
//       name: "Gilberto Botsford",
//       action: "left 3 comments on Checkout",
//       time: "1 hour ago",
//     },
//     {
//       initials: "MC",
//       bg: "var(--color-success)",
//       name: "Marcus Chen",
//       action: "merged pull request #248",
//       time: "Yesterday",
//     },
//   ];
//   return (
//     <div className="card">
//       {rows.map((r) => (
//         <div key={r.name} className="media media--seamless items-start">
//           <div className="media__figure mt-0.5">
//             <Avatar initials={r.initials} bg={r.bg} />
//           </div>
//           <div className="media__content">
//             <div className="media__title">
//               {r.name}{" "}
//               <span className="font-normal text-muted-foreground">
//                 {r.action}
//               </span>
//             </div>
//             <div className="media__meta mt-1">{r.time}</div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// function CardMenu() {
//   return (
//    <div className="flex gap-4">
//     <div
//       className="menu__popup flex-1"
//       role="menu"
//       data-state="open"
//       style={{ position: "relative", top: "auto", left: "auto" }}
//     >
//       <div className="menu__group" role="group" aria-labelledby="sc-menu-head">
//         <h3 className="menu__group-label" id="sc-menu-head">
//           Notifications
//         </h3>
//         <button type="button" className="menu__item" role="menuitem">
//           <CheckCheck />
//           Mark all as read
//         </button>
//         <button type="button" className="menu__item" role="menuitem">
//           <Archive />
//           Archive read
//         </button>
//         <button type="button" className="menu__item" role="menuitem">
//           <Settings />
//           Settings
//         </button>
//       </div>
//       <hr className="menu__separator" role="separator" />
//       <button
//         type="button"
//         className="menu__item menu__item--danger"
//         role="menuitem"
//       >
//         <Trash2 />
//         Clear inbox
//       </button>
//     </div>
// <div
//       className="menu__popup flex-1"
//       role="menu"
//       data-state="open"
//       style={{ position: "relative", top: "auto", left: "auto" }}
//     >
//       <div className="menu__group" role="group" aria-labelledby="sc-menu-head">
//         <h3 className="menu__group-label" id="sc-menu-head">
//           Notifications
//         </h3>
//         <button type="button" className="menu__item" role="menuitem">
//           <CheckCheck />
//           Mark all as read
//         </button>
//         <button type="button" className="menu__item" role="menuitem">
//           <Archive />
//           Archive read
//         </button>
//         <button type="button" className="menu__item" role="menuitem">
//           <Settings />
//           Settings
//         </button>
//       </div>
//       <hr className="menu__separator" role="separator" />
//       <button
//         type="button"
//         className="menu__item menu__item--danger"
//         role="menuitem"
//       >
//         <Trash2 />
//         Clear inbox
//       </button>
//     </div>
//    </div>
//   );
// }

// function CardSidebar() {
//   return (
//     <div className="card">
//       <aside className="sidebar w-full">
//         <header className="sidebar__header">
//           <a className="sidebar__brand" href="#">
//             <span>Meridian</span>
//           </a>
//         </header>
//         <div className="sidebar__content">
//           <nav className="sidebar__menu">
//             <div className="sidebar__group">
//               <span className="sidebar__group-title">Store</span>
//               <ul className="sidebar__list">
//                 <li className="sidebar__item">
//                   <a className="sidebar__button" href="#" aria-current="page">
//                     <LayoutDashboard />
//                     <span>Dashboard</span>
//                   </a>
//                 </li>
//                 <li className="sidebar__item">
//                   <a className="sidebar__button" href="#">
//                     <ShoppingBag />
//                     <span>Orders</span>
//                   </a>
//                   <span className="sidebar__item-action">
//                     <span className="badge badge--primary">8</span>
//                   </span>
//                 </li>
//                 <li className="sidebar__item">
//                   <a className="sidebar__button" href="#">
//                     <Package />
//                     <span>Products</span>
//                   </a>
//                 </li>
//                 <li className="sidebar__item">
//                   <a className="sidebar__button" href="#">
//                     <Users />
//                     <span>Customers</span>
//                   </a>
//                 </li>
//               </ul>
//             </div>
//             <div className="sidebar__group">
//               <span className="sidebar__group-title">Insights</span>
//               <ul className="sidebar__list">
//                 <li className="sidebar__item">
//                   <a className="sidebar__button" href="#">
//                     <BarChart3 />
//                     <span>Reports</span>
//                   </a>
//                 </li>
//                 <li className="sidebar__item">
//                   <a className="sidebar__button" href="#">
//                     <Settings />
//                     <span>Settings</span>
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </nav>
//         </div>
//       </aside>
//     </div>
//   );
// }

// function CardTable() {
//   const orders = [
//     {
//       id: "#10428",
//       initials: "AC",
//       bg: "var(--color-primary)",
//       name: "Acme Corp",
//       total: "$1,490.00",
//       status: "Processing",
//       tone: "badge--primary",
//     },
//     {
//       id: "#10427",
//       initials: "SR",
//       bg: "var(--color-info)",
//       name: "Sonya Ryan",
//       total: "$312.50",
//       status: "Shipped",
//       tone: "badge--info",
//     },
//     {
//       id: "#10425",
//       initials: "MC",
//       bg: "var(--color-success)",
//       name: "Marcus Chen",
//       total: "$2,780.00",
//       status: "Completed",
//       tone: "badge--success",
//     },
//     {
//       id: "#10422",
//       initials: "GB",
//       bg: "var(--color-danger)",
//       name: "Gil Botsford",
//       total: "$86.00",
//       status: "Refunded",
//       tone: "badge--danger",
//     },
//   ];
//   return (
//     <div className="card">
//       <div className="table-responsive">
//         <table className="table table--hover table--align-middle">
//           <thead className="table__head--alt">
//             <tr>
//               <th scope="col">Order</th>
//               <th scope="col">Customer</th>
//               <th scope="col">Status</th>
//               <th scope="col" className="text-end">
//                 Total
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((o) => (
//               <tr key={o.id}>
//                 <th scope="row">
//                   <a href="#" className="link">
//                     <code>{o.id}</code>
//                   </a>
//                 </th>
//                 <td>
//                   <div className="flex items-center gap-2.5 w-34">
//                     <Avatar initials={o.initials} bg={o.bg} />
//                     <span className="font-medium">{o.name}</span>
//                   </div>
//                 </td>
//                 <td>
//                   <span className={`badge badge--soft ${o.tone}`}>
//                     {o.status}
//                   </span>
//                 </td>
//                 <td className="text-end font-semibold">{o.total}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// function CardProfileForm() {
//   return (
//     <Panel>
//       <div className="mb-4 flex items-start justify-between">
//         <div>
//           <h3 className="text-base font-semibold">Settings</h3>
//           <p className="text-xs text-muted-foreground">
//             Change your name, bio, and others.
//           </p>
//         </div>
//         <span className="badge badge--soft badge--primary">Profile</span>
//       </div>
//       <div className="flex flex-col gap-4">
//         <div className="field">
//           <label htmlFor="sc-name" className="field__label">
//             Name
//           </label>
//           <input
//             id="sc-name"
//             type="text"
//             className="input"
//             defaultValue="Rizal Fakhri"
//             readOnly
//           />
//         </div>
//         <div className="field">
//           <label htmlFor="sc-bio" className="field__label">
//             Bio
//           </label>
//           <textarea
//             id="sc-bio"
//             className="textarea"
//             rows={2}
//             defaultValue="UI/UX designer building calm, composable interfaces."
//             readOnly
//             style={{ height: "auto" }}
//           />
//           <p className="field__description">Max. 400 characters.</p>
//         </div>
//         <div className="flex justify-end">
//           <button type="button" className="button button--primary">
//             Save changes
//           </button>
//         </div>
//       </div>
//     </Panel>
//   );
// }

// function CardDeleteConfirm() {
//   return (
//     <Panel>
//       <div className="flex flex-col gap-3">
//         <h3 className="text-base font-semibold">
//           Delete this conversation?
//         </h3>
//         <p className="text-xs leading-relaxed text-muted-foreground">
//           Messages, attachments, and tool runs from this thread will be
//           permanently removed. This cannot be undone.
//         </p>
//         <div className="mt-1 flex items-center justify-end gap-2">
//           <button type="button" className="button button--ghost button--neutral">
//             Cancel
//           </button>
//           <button type="button" className="button button--danger">
//             Delete
//           </button>
//         </div>
//       </div>
//     </Panel>
//   );
// }

// function CardCommand() {
//   const items = [
//     { icon: LayoutDashboard, label: "Go to Dashboard", active: true },
//     { icon: ShoppingBag, label: "View orders" },
//     { icon: Users, label: "Invite a teammate" },
//     { icon: Settings, label: "Open settings" },
//   ];
//   return (
//     <Panel className="p-2">
//       <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2">
//         <Search className="size-4 text-muted-foreground" />
//         <span className="text-sm text-muted-foreground">
//           Search or run a command…
//         </span>
//         <span className="ms-auto rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
//           ⌘K
//         </span>
//       </div>
//       <div className="mt-1.5 flex flex-col">
//         <span className="px-3 pb-1 pt-2 text-xs font-medium text-muted-foreground">
//           Actions
//         </span>
//         {items.map((it) => (
//           <div
//             key={it.label}
//             className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${
//               it.active ? "bg-accent text-foreground" : "text-foreground"
//             }`}
//           >
//             <it.icon className="size-4 text-muted-foreground" />
//             <span>{it.label}</span>
//             {it.active ? (
//               <ArrowRight className="ms-auto size-3.5 text-muted-foreground" />
//             ) : null}
//           </div>
//         ))}
//       </div>
//     </Panel>
//   );
// }

// function CardRealtime() {
//   const heights = [
//     0.3, 0.55, 0.4, 0.7, 0.5, 0.85, 0.6, 0.45, 0.95, 0.7, 0.5, 0.8, 0.6, 0.4,
//     0.75, 0.9, 0.55, 0.65, 0.85, 0.5, 0.7, 0.45, 0.6, 0.95, 0.7, 0.5, 0.8, 0.6,
//   ];
//   return (
//     <Panel>
//       <div className="flex items-start justify-between">
//         <div>
//           <h3 className="text-sm font-semibold">Realtime</h3>
//           <p className="text-xs text-muted-foreground">See what users visit</p>
//         </div>
//         <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
//           <span
//             className="size-2 rounded-full bg-success"
//             style={{
//               boxShadow: "0 0 0 3px color-mix(in oklch, var(--color-success) 25%, transparent)",
//             }}
//           />
//           Live
//         </span>
//       </div>
//       <div className="mt-3 flex items-baseline gap-2">
//         <span className="text-3xl font-semibold tabular-nums">832</span>
//         <span className="text-xs text-muted-foreground">users right now</span>
//       </div>
//       <div className="mt-4 flex h-16 items-end gap-1">
//         {heights.map((h, i) => (
//           <div
//             key={i}
//             className={`flex-1 rounded-full ${
//               i < 18 ? "bg-primary" : "bg-surface-3"
//             }`}
//             style={{ height: `${h * 100}%` }}
//           />
//         ))}
//       </div>
//     </Panel>
//   );
// }

// function CardTeamMembers() {
//   const members = [
//     { initials: "JR", bg: "var(--color-primary)", name: "Jane Randy", email: "jane@example.com" },
//     { initials: "AD", bg: "var(--color-info)", name: "Andy Daniel", email: "andy@example.com" },
//     { initials: "MH", bg: "var(--color-success)", name: "Maggie Hudson", email: "maggie@example.com" },
//     { initials: "ON", bg: "var(--color-warning)", name: "Olivia Nam", email: "olivia@example.com" },
//   ];
//   return (
//     <Panel>
//       <div className="mb-3">
//         <h3 className="text-sm font-semibold">Team members</h3>
//         <p className="text-xs text-muted-foreground">
//           Members can access this workspace.
//         </p>
//       </div>
//       <div className="flex flex-col gap-1">
//         {members.map((m) => (
//           <div key={m.name} className="flex items-center gap-3 py-1.5">
//             <Avatar initials={m.initials} bg={m.bg} />
//             <div className="min-w-0 flex-1">
//               <div className="truncate text-sm font-medium">{m.name}</div>
//               <div className="truncate text-xs text-muted-foreground">
//                 {m.email}
//               </div>
//             </div>
//             <button
//               type="button"
//               className="button button--soft button--neutral button--sm"
//             >
//               Edit
//             </button>
//           </div>
//         ))}
//       </div>
//     </Panel>
//   );
// }

// function CardLogin() {
//   return (
//     <Panel>
//       <div className="flex flex-col gap-1 text-center">
//         <h3 className="text-base font-semibold">Sign in to your account</h3>
//         <p className="text-xs text-muted-foreground">
//           Continue with Google or GitHub.
//         </p>
//       </div>
//       <div className="mt-4 flex flex-col gap-2">
//         <button
//           type="button"
//           className="button button--outline button--neutral button--block"
//         >
//           <svg role="img" className="fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
//           Continue with Google
//         </button>
//         <button type="button" className="button button--neutral button--outline button--block">
//           <svg role="img" className="fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
//           Continue with GitHub
//         </button>
//       </div>
//       <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
//         <span className="h-px flex-1 bg-border" />
//         or
//         <span className="h-px flex-1 bg-border" />
//       </div>
//       <div className="field">
//         <label htmlFor="sc-login-email" className="field__label">
//           Email
//         </label>
//         <input
//           id="sc-login-email"
//           type="email"
//           className="input"
//           placeholder="you@example.com"
//           readOnly
//         />
//       </div>
//       <button
//         type="button"
//         className="button button--primary button--block mt-3"
//       >
//         <Lock className="size-4" />
//         Continue
//       </button>
//     </Panel>
//   );
// }

// function CardTabs() {
//   return (
//     <Panel>
//       <div className="tabs" data-stisla-tabs>
//         <div className="tabs__list" role="tablist">
//           <button
//             type="button"
//             className="tabs__trigger"
//             data-state="active"
//             data-value="profile"
//           >
//             Profile
//           </button>
//           <button
//             type="button"
//             className="tabs__trigger"
//             data-state="inactive"
//             data-value="security"
//           >
//             Security
//           </button>
//           <button
//             type="button"
//             className="tabs__trigger"
//             data-state="inactive"
//             data-value="privacy"
//           >
//             Privacy
//           </button>
//         </div>
//         <div
//           className="tabs__panel"
//           data-state="active"
//           data-value="profile"
//         >
//           <p className="text-sm text-muted-foreground">
//             Public details shown on your profile and comments across the
//             workspace.
//           </p>
//         </div>
//       </div>
//     </Panel>
//   );
// }

// function CardProgress() {
//   return (
//     <Panel>
//       <div className="flex flex-col gap-4">
//         <div
//           className="progress progress--block"
//           role="progressbar"
//           aria-label="Storage"
//           aria-valuenow={72}
//           aria-valuemin={0}
//           aria-valuemax={100}
//         >
//           <span className="progress__label">Storage</span>
//           <span className="progress__value">72%</span>
//           <div className="progress__track">
//             <div className="progress__bar" style={{ width: "72%" }} />
//           </div>
//         </div>
//         <div
//           className="progress progress--block"
//           role="progressbar"
//           aria-label="Bandwidth"
//           aria-valuenow={38}
//           aria-valuemin={0}
//           aria-valuemax={100}
//         >
//           <span className="progress__label">Bandwidth</span>
//           <span className="progress__value">38%</span>
//           <div className="progress__track">
//             <div
//               className="progress__bar progress__bar--success"
//               style={{ width: "38%" }}
//             />
//           </div>
//         </div>
//       </div>
//     </Panel>
//   );
// }

// function CardMeter() {
//   return (
//     <Panel>
//       <div
//         className="meter meter--block"
//         role="meter"
//         aria-label="Memory"
//         aria-valuenow={14.2}
//         aria-valuemin={0}
//         aria-valuemax={16}
//         aria-valuetext="14.2 GB of 16 GB used"
//       >
//         <span className="meter__label">Memory</span>
//         <span className="meter__value">14.2 GB of 16 GB</span>
//         <div className="meter__track">
//           <div
//             className="meter__bar meter__bar--warning"
//             style={{ width: "89%" }}
//           />
//         </div>
//       </div>
//       <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
//         <div className="rounded-lg border border-border bg-surface-2 p-3">
//           <div className="text-xs text-muted-foreground">Uptime</div>
//           <div className="mt-1 text-lg font-semibold tabular-nums">99.98%</div>
//         </div>
//         <div className="rounded-lg border border-border bg-surface-2 p-3">
//           <div className="text-xs text-muted-foreground">Latency</div>
//           <div className="mt-1 text-lg font-semibold tabular-nums">42ms</div>
//         </div>
//       </div>
//     </Panel>
//   );
// }

// function CardAlert() {
//   return (
//     <div className="alert alert--success">
//       <CircleCheck className="alert__icon" />
//         <div className="alert__title">Deployment complete</div>
//         <div className="alert__description">
//           meridian-web shipped to production in 1m 12s.
//         </div>
//     </div>
//   );
// }

// function CardToggles() {
//   const rows = [
//     { id: "sc-t1", label: "Email notifications", checked: true },
//     { id: "sc-t2", label: "Desktop push", checked: false },
//     { id: "sc-t3", label: "Weekly digest", checked: true },
//   ];
//   return (
//     <Panel>
//       <div className="mb-3 flex items-center gap-2">
//         <Bell className="size-4 text-muted-foreground" />
//         <h3 className="text-sm font-semibold">Preferences</h3>
//       </div>
//       <div className="field">
//         {rows.map((r) => (
//           <div key={r.id} className="field__item justify-between py-1.5">
//             <label className="field__label" htmlFor={r.id}>
//               {r.label}
//             </label>
//             <input
//               className="switch"
//               type="checkbox"
//               role="switch"
//               id={r.id}
//               defaultChecked={r.checked}
//               readOnly
//             />
//           </div>
//         ))}
//         <div className="field__item mt-1 border-t border-border pt-3">
//           <input
//             className="checkbox"
//             type="checkbox"
//             id="sc-agree"
//             defaultChecked
//             readOnly
//           />
//           <label className="field__label" htmlFor="sc-agree">
//             I agree to the terms
//           </label>
//         </div>
//       </div>
//     </Panel>
//   );
// }

// function CardSlider() {
//   return (
//     <Panel>
//       <div className="field">
//         <div className="flex items-center justify-between">
//           <label className="field__label" htmlFor="sc-brightness">
//             Brightness
//           </label>
//           <span className="text-xs tabular-nums text-muted-foreground">
//             64%
//           </span>
//         </div>
//         <div
//           className="slider"
//           id="sc-brightness"
//           style={{ "--slider-fraction": 0.64 } as CSSProperties}
//         >
//           <div className="slider__track">
//             <div className="slider__range" />
//           </div>
//           <div className="slider__thumb" />
//         </div>
//       </div>
//     </Panel>
//   );
// }

// function CardBadges() {
//   return (
//     <Panel>
//       <div className="mb-2.5 flex items-center gap-2">
//         <Tag className="size-4 text-muted-foreground" />
//         <h3 className="text-sm font-semibold">Labels</h3>
//       </div>
//       <div className="flex flex-wrap gap-1.5">
//         <span className="badge badge--primary">shipping</span>
//         <span className="badge badge--soft badge--success">paid</span>
//         <span className="badge badge--soft badge--warning">pending</span>
//         <span className="badge badge--soft badge--danger">refunded</span>
//         <span className="badge badge--soft badge--info">wholesale</span>
//         <span className="badge badge--soft badge--primary">priority</span>
//         <span className="badge badge--soft badge--success">verified</span>
//       </div>
//     </Panel>
//   );
// }

// function CardAvatars() {
//   return (
//     <Panel>
//       <div className="flex items-center justify-between">
//         <div>
//           <h3 className="text-sm font-semibold">Contributors</h3>
//           <p className="text-xs text-muted-foreground">14 people this week</p>
//         </div>
//         <button
//           type="button"
//           className="button button--neutral button--sm"
//         >
//           Invite
//         </button>
//       </div>
//       <div className="mt-3 flex items-center">
//         <div className="avatar-group">
//           {[
//             ["JR", "var(--color-primary)"],
//             ["AD", "var(--color-info)"],
//             ["MH", "var(--color-success)"],
//             ["ON", "var(--color-warning)"],
//             ["EC", "var(--color-danger)"],
//           ].map(([initials, bg]) => (
//             <Avatar key={initials} initials={initials} bg={bg} />
//           ))}
//           <span className="avatar avatar--sm avatar--circle avatar-group__more">
//             +9
//           </span>
//         </div>
//       </div>
//     </Panel>
//   );
// }

// function CardProfile() {
//   return (
//     <div className="card">
//       <div className="card__body items-center text-center">
//         <Avatar initials="JM" bg="var(--color-primary)" size="lg" />
//         <div className="mt-3">
//           <div className="text-base font-semibold">John Morton</div>
//           <div className="text-xs text-muted-foreground">
//             UI/UX designer, 6+ years
//           </div>
//         </div>
//         <div className="mt-4 grid w-full grid-cols-3 divide-x divide-border rounded-lg border border-border bg-surface-2">
//           {[
//             ["Posts", "785"],
//             ["Followers", "12k"],
//             ["Rating", "4.9"],
//           ].map(([label, value]) => (
//             <div key={label} className="px-2 py-2.5">
//               <div className="text-sm font-semibold tabular-nums">{value}</div>
//               <div className="text-[11px] text-muted-foreground">{label}</div>
//             </div>
//           ))}
//         </div>
//         <div className="mt-3 flex w-full gap-2">
//           <button
//             type="button"
//             className="button button--primary button--block"
//           >
//             Follow
//           </button>
//           <button
//             type="button"
//             className="button button--outline button--neutral button--block"
//           >
//             Message
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
