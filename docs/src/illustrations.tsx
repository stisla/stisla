/* Stisla illustration set — 21 soft volumetric metaphors for empty states, dialogs, status
 * screens, and onboarding. Authored as React components: every colour lives in the
 * .illustration component (driven by --illus-accent / --illus-badge via the .il-* paint hooks),
 * so the JSX carries shape only. Each piece gets a unique `useId()` so gradient ids never
 * collide when several render on one page. viewBox 200x200. */
import { useId, type ReactNode } from "react";

/* Three accent-shaded gradients shared by every piece, keyed off a per-instance id. */
function Defs({ u }: { u: string }) {
  return (
    <defs>
      <linearGradient id={`gl-${u}`} x1=".15" y1=".05" x2=".85" y2=".95">
        <stop className="il-g0" offset="0" />
        <stop className="il-g1" offset="1" />
      </linearGradient>
      <linearGradient id={`gm-${u}`} x1=".15" y1=".05" x2=".85" y2=".95">
        <stop className="il-g1" offset="0" />
        <stop className="il-g2" offset="1" />
      </linearGradient>
      <linearGradient id={`gd-${u}`} x1=".15" y1=".05" x2=".85" y2=".95">
        <stop className="il-g2" offset="0" />
        <stop className="il-g3" offset="1" />
      </linearGradient>
    </defs>
  );
}

/* Soft backing disc the object floats on. */
function Stage() {
  return (
    <>
      <circle className="il-disc-o" cx="100" cy="94" r="72" />
      <circle className="il-disc-i" cx="100" cy="94" r="55" />
    </>
  );
}

type Pip = { cx: number; cy: number };

/* Additive pip: a Stisla squircle on a white sticker-ring, in the accent hue. */
function Plus({ cx, cy }: Pip) {
  return (
    <g className="il-badge">
      <rect x={cx - 15} y={cy - 15} width="30" height="30" rx="11" fill="#fff" />
      <rect x={cx - 13} y={cy - 13} width="26" height="26" rx="9" fill="var(--_b)" />
      <rect x={cx - 6} y={cy - 1.6} width="12" height="3.2" rx="1.6" fill="#fff" />
      <rect x={cx - 1.6} y={cy - 6} width="3.2" height="12" rx="1.6" fill="#fff" />
    </g>
  );
}

function Dot({ cx, cy }: Pip) {
  return (
    <g className="il-badge">
      <circle cx={cx} cy={cy} r="11" fill="var(--_b)" />
    </g>
  );
}

/* Outer SVG frame shared by every illustration. */
function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 200 200" className="illustration illustration--animate" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

function Folder() {
  const u = useId();
  return (
    <Frame label="Empty folder">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <path d="M46 74h30l10 12h64a9 9 0 0 1 9 9v38a9 9 0 0 1-9 9H46a9 9 0 0 1-9-9V83a9 9 0 0 1 9-9z" fill={`url(#gm-${u})`} />
        <path d="M40 98h120a4 4 0 0 1 4 4l-6 36a10 10 0 0 1-10 9H52a10 10 0 0 1-10-9l-6-36a4 4 0 0 1 4-4z" fill={`url(#gl-${u})`} />
        <rect x="48" y="101" width="104" height="5" rx="2.5" fill="#fff" opacity=".3" />
      </g>
      <Plus cx={150} cy={70} />
    </Frame>
  );
}

function Search() {
  const u = useId();
  return (
    <Frame label="No results found">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <path d="M69 48h47l18 18v69a9 9 0 0 1-9 9H69a9 9 0 0 1-9-9V57a9 9 0 0 1 9-9z" fill={`url(#gl-${u})`} />
        <path d="M116 48l18 18h-9a9 9 0 0 1-9-9z" fill={`url(#gd-${u})`} />
        <rect x="72" y="74" width="42" height="5" rx="2.5" fill="var(--_a)" opacity=".32" />
        <rect x="72" y="86" width="52" height="5" rx="2.5" fill="var(--_a)" opacity=".26" />
        <rect x="72" y="98" width="34" height="5" rx="2.5" fill="var(--_a)" opacity=".2" />
        <line x1="142" y1="134" x2="158" y2="150" stroke={`url(#gd-${u})`} strokeWidth="9" strokeLinecap="round" />
        <circle cx="124" cy="116" r="23" fill="#fff" opacity=".4" />
        <circle cx="124" cy="116" r="23" fill="none" stroke={`url(#gd-${u})`} strokeWidth="7" />
      </g>
    </Frame>
  );
}

function Envelope() {
  const u = useId();
  return (
    <Frame label="No messages">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <rect x="44" y="80" width="112" height="62" rx="14" fill={`url(#gm-${u})`} />
        <rect x="62" y="56" width="76" height="58" rx="13" fill={`url(#gl-${u})`} />
        <rect x="74" y="74" width="52" height="5" rx="2.5" fill="var(--_a)" opacity=".3" />
        <rect x="74" y="86" width="40" height="5" rx="2.5" fill="var(--_a)" opacity=".24" />
        <path d="M44 92v39a11 11 0 0 0 11 11h90a11 11 0 0 0 11-11V92l-56 36z" fill={`url(#gd-${u})`} />
        <path d="M44 92l56 36 56-36" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="3" strokeLinejoin="round" />
      </g>
    </Frame>
  );
}

function Box() {
  const u = useId();
  return (
    <Frame label="Empty box">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <path d="M100 60l56 29-56 29-56-29z" fill={`url(#gl-${u})`} />
        <path d="M44 89l56 29v50l-56-29z" fill={`url(#gm-${u})`} />
        <path d="M156 89l-56 29v50l56-29z" fill={`url(#gd-${u})`} />
        <path d="M100 60l-22 11 56 29 22-11z" fill="#fff" opacity=".18" />
        <path d="M100 118v50" stroke="#fff" strokeOpacity=".18" strokeWidth="2" strokeLinecap="round" />
      </g>
      <Plus cx={150} cy={70} />
    </Frame>
  );
}

function Calendar() {
  const u = useId();
  return (
    <Frame label="No events">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <rect x="76" y="54" width="9" height="20" rx="4.5" fill={`url(#gm-${u})`} />
        <rect x="115" y="54" width="9" height="20" rx="4.5" fill={`url(#gm-${u})`} />
        <rect x="52" y="64" width="96" height="82" rx="18" fill={`url(#gl-${u})`} />
        <path d="M52 82a18 18 0 0 1 18-18h60a18 18 0 0 1 18 18v6H52z" fill={`url(#gd-${u})`} />
        <text x="100" y="125" textAnchor="middle" fontSize="34" fontWeight="800" fill="var(--_a)" opacity=".8">14</text>
      </g>
      <Plus cx={150} cy={70} />
    </Frame>
  );
}

function Error404() {
  const u = useId();
  return (
    <Frame label="Page not found">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <rect x="46" y="58" width="108" height="84" rx="16" fill={`url(#gl-${u})`} />
        <path d="M46 74a16 16 0 0 1 16-16h76a16 16 0 0 1 16 16v6H46z" fill={`url(#gd-${u})`} />
        <circle cx="60" cy="69" r="3" fill="#fff" opacity=".5" />
        <circle cx="71" cy="69" r="3" fill="#fff" opacity=".5" />
        <circle cx="82" cy="69" r="3" fill="#fff" opacity=".5" />
        <text x="100" y="123" textAnchor="middle" fontSize="36" fontWeight="800" fill="var(--_a)" opacity=".75">404</text>
      </g>
    </Frame>
  );
}

function Offline() {
  const u = useId();
  return (
    <Frame label="No connection">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <g fill={`url(#gl-${u})`}>
          <circle cx="76" cy="98" r="20" />
          <circle cx="102" cy="90" r="27" />
          <circle cx="124" cy="104" r="18" />
          <rect x="62" y="100" width="74" height="24" rx="12" />
        </g>
        <path d="M64 66l68 68" stroke="#fff" strokeOpacity=".5" strokeWidth="6" strokeLinecap="round" />
        <path d="M66 60l68 68" stroke={`url(#gd-${u})`} strokeWidth="6" strokeLinecap="round" />
      </g>
    </Frame>
  );
}

function Upload() {
  const u = useId();
  return (
    <Frame label="Upload files">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <g fill={`url(#gl-${u})`}>
          <circle cx="78" cy="112" r="19" />
          <circle cx="104" cy="104" r="26" />
          <circle cx="126" cy="116" r="17" />
          <rect x="66" y="114" width="72" height="22" rx="11" />
        </g>
        <g fill={`url(#gd-${u})`}>
          <rect x="95" y="92" width="14" height="40" rx="7" />
          <path d="M102 78l18 20H84z" />
        </g>
      </g>
      <Plus cx={150} cy={70} />
    </Frame>
  );
}

function Trash() {
  const u = useId();
  return (
    <Frame label="Trash is empty">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <path d="M68 86h64l-6 64a9 9 0 0 1-9 8H83a9 9 0 0 1-9-8z" fill={`url(#gl-${u})`} />
        <g fill="var(--_a)" opacity=".28">
          <rect x="88" y="100" width="5" height="42" rx="2.5" />
          <rect x="107" y="100" width="5" height="42" rx="2.5" />
        </g>
        <rect x="58" y="74" width="84" height="13" rx="6.5" fill={`url(#gd-${u})`} />
        <rect x="86" y="64" width="28" height="10" rx="5" fill={`url(#gd-${u})`} />
      </g>
    </Frame>
  );
}

function Rocket() {
  const u = useId();
  return (
    <Frame label="Get started">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <path d="M76 132l-12 6 4-22z" fill={`url(#gd-${u})`} />
        <path d="M124 132l12 6-4-22z" fill={`url(#gd-${u})`} />
        <path d="M100 48c16 0 26 24 26 50l-5 28H79l-5-28c0-26 10-50 26-50z" fill={`url(#gl-${u})`} />
        <circle cx="100" cy="86" r="11" fill={`url(#gd-${u})`} />
        <circle cx="100" cy="86" r="5" fill="#fff" opacity=".55" />
        <path d="M90 126h20l-4 14a6 6 0 0 1-12 0z" fill="var(--_b)" />
      </g>
    </Frame>
  );
}

function Chart() {
  const u = useId();
  return (
    <Frame label="No data">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <rect x="46" y="58" width="108" height="84" rx="16" fill={`url(#gl-${u})`} />
        <line x1="60" y1="128" x2="140" y2="128" stroke="var(--_a)" strokeWidth="3" strokeLinecap="round" opacity=".3" />
        <g fill={`url(#gm-${u})`}>
          <rect x="66" y="108" width="14" height="20" rx="4" />
          <rect x="90" y="98" width="14" height="30" rx="4" />
          <rect x="114" y="114" width="14" height="14" rx="4" />
        </g>
      </g>
    </Frame>
  );
}

function Lock() {
  const u = useId();
  return (
    <Frame label="Locked">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <path d="M80 92V80a20 20 0 0 1 40 0v12" fill="none" stroke={`url(#gd-${u})`} strokeWidth="10" strokeLinecap="round" />
        <rect x="64" y="90" width="72" height="58" rx="16" fill={`url(#gl-${u})`} />
        <circle cx="100" cy="114" r="7" fill={`url(#gd-${u})`} />
        <rect x="97" y="118" width="6" height="16" rx="3" fill={`url(#gd-${u})`} />
      </g>
    </Frame>
  );
}

function Success() {
  const u = useId();
  return (
    <Frame label="Success">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <circle cx="100" cy="96" r="42" fill={`url(#gm-${u})`} />
        <path d="M78 97l15 15 30-33" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Frame>
  );
}

function Warning() {
  const u = useId();
  return (
    <Frame label="Warning">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <path d="M100 54q5 0 8 5l44 76q4 7-4 7H52q-8 0-4-7l44-76q3-5 8-5z" fill={`url(#gm-${u})`} />
        <rect x="95" y="84" width="10" height="34" rx="5" fill="#fff" />
        <circle cx="100" cy="129" r="5.5" fill="#fff" />
      </g>
    </Frame>
  );
}

function Celebrate() {
  const u = useId();
  return (
    <Frame label="Celebrate">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <rect x="60" y="94" width="80" height="52" rx="10" fill={`url(#gl-${u})`} />
        <rect x="54" y="80" width="92" height="20" rx="8" fill={`url(#gd-${u})`} />
        <rect x="90" y="80" width="20" height="66" fill={`url(#gm-${u})`} />
        <path d="M100 80c-3-16-26-16-20-2 4 9 20 2 20 2zM100 80c3-16 26-16 20-2-4 9-20 2-20 2z" fill={`url(#gd-${u})`} />
      </g>
    </Frame>
  );
}

function Shield() {
  const u = useId();
  return (
    <Frame label="Secure">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <path d="M100 50l40 16v28c0 28-20 44-40 52-20-8-40-24-40-52V66z" fill={`url(#gd-${u})`} />
        <path d="M100 61l29 11v21c0 21-15 33-29 39-14-6-29-18-29-39V72z" fill={`url(#gl-${u})`} />
        <path d="M86 94l10 11 23-26" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Frame>
  );
}

function Bell() {
  const u = useId();
  return (
    <Frame label="Notifications">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <path d="M100 58a34 34 0 0 1 34 34v22l10 14H56l10-14V92a34 34 0 0 1 34-34z" fill={`url(#gl-${u})`} strokeLinejoin="round" />
        <circle cx="100" cy="54" r="7" fill={`url(#gd-${u})`} />
        <path d="M88 128a12 12 0 0 0 24 0z" fill={`url(#gd-${u})`} />
      </g>
      <Dot cx={146} cy={72} />
    </Frame>
  );
}

function Settings() {
  const u = useId();
  return (
    <Frame label="Settings">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <g fill={`url(#gm-${u})`}>
          <path d="M92 70l2-18h12l2 18z" />
          <path d="M92 70l2-18h12l2 18z" transform="rotate(45 100 96)" />
          <path d="M92 70l2-18h12l2 18z" transform="rotate(90 100 96)" />
          <path d="M92 70l2-18h12l2 18z" transform="rotate(135 100 96)" />
          <path d="M92 70l2-18h12l2 18z" transform="rotate(180 100 96)" />
          <path d="M92 70l2-18h12l2 18z" transform="rotate(225 100 96)" />
          <path d="M92 70l2-18h12l2 18z" transform="rotate(270 100 96)" />
          <path d="M92 70l2-18h12l2 18z" transform="rotate(315 100 96)" />
        </g>
        <circle cx="100" cy="96" r="32" fill={`url(#gl-${u})`} />
        <circle cx="100" cy="96" r="12" fill="#fff" opacity=".5" />
      </g>
    </Frame>
  );
}

function Media() {
  const u = useId();
  return (
    <Frame label="Media">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <rect x="52" y="62" width="96" height="72" rx="14" fill={`url(#gl-${u})`} />
        <circle cx="78" cy="84" r="8" fill="#fff" opacity=".55" />
        <path d="M58 130l26-28 14 14 20-24 24 38z" fill={`url(#gd-${u})`} />
      </g>
    </Frame>
  );
}

function Chat() {
  const u = useId();
  return (
    <Frame label="Chat">
      <Defs u={u} />
      <Stage />
      <g className="il-obj">
        <path d="M72 66H128A20 20 0 0 1 148 86V104A20 20 0 0 1 128 124H96L72 142L80 124H72A20 20 0 0 1 52 104V86A20 20 0 0 1 72 66Z" fill={`url(#gl-${u})`} />
        <circle cx="80" cy="95" r="5.5" fill="#fff" />
        <circle cx="100" cy="95" r="5.5" fill="#fff" />
        <circle cx="120" cy="95" r="5.5" fill="#fff" />
      </g>
    </Frame>
  );
}

export type Illustration = {
  name: string;
  label: string;
  Component: () => ReactNode;
};

export const ILLUSTRATIONS: Illustration[] = [
  { name: "folder", label: "Folder", Component: Folder },
  { name: "search", label: "No results", Component: Search },
  { name: "envelope", label: "No messages", Component: Envelope },
  { name: "box", label: "Empty", Component: Box },
  { name: "calendar", label: "No events", Component: Calendar },
  { name: "error404", label: "404", Component: Error404 },
  { name: "offline", label: "No connection", Component: Offline },
  { name: "upload", label: "Upload", Component: Upload },
  { name: "trash", label: "Trash", Component: Trash },
  { name: "rocket", label: "Get started", Component: Rocket },
  { name: "chart", label: "No data", Component: Chart },
  { name: "lock", label: "Locked", Component: Lock },
  { name: "success", label: "Success", Component: Success },
  { name: "warning", label: "Warning", Component: Warning },
  { name: "celebrate", label: "Celebrate", Component: Celebrate },
  { name: "shield", label: "Secure", Component: Shield },
  { name: "bell", label: "Notifications", Component: Bell },
  { name: "settings", label: "Settings", Component: Settings },
  { name: "media", label: "Media", Component: Media },
  { name: "chat", label: "Chat", Component: Chat },
];
