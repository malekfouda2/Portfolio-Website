import type { CSSProperties } from "react";
import SceneFrame from "./SceneFrame";

/*
 * Animated illustrations for the site, drawn in the logo's language: thick
 * round strokes in bone, with signal-green and flow-blue accents. Each scene
 * explains one idea (syncing systems, fixing a checkout, auditing a site…).
 * Motion classes live in index.css under "Illustrations".
 */

const B = "var(--bone)";
const G = "var(--signal)";
const F = "var(--flow)";
const V = "var(--violet)";
const K = "var(--void)";
const DIM = "rgba(244,247,245,0.28)";

type Timing = { d?: number; t?: number; dx?: number; dy?: number; sx?: number; sy?: number; px?: number; py?: number };
const v = ({ d, t, dx, dy, sx, sy, px, py }: Timing): CSSProperties => ({
  ...(d !== undefined && { "--d": `${d}s` }),
  ...(t !== undefined && { "--t": `${t}s` }),
  ...(dx !== undefined && { "--dx": `${dx}px` }),
  ...(dy !== undefined && { "--dy": `${dy}px` }),
  ...(sx !== undefined && { "--sx": `${sx}px` }),
  ...(sy !== undefined && { "--sy": `${sy}px` }),
  ...(px !== undefined && { "--px": `${px}px` }),
  ...(py !== undefined && { "--py": `${py}px` }),
} as CSSProperties);

export type SceneProps = { className?: string };

/** A browser/app window outline with a title bar. */
function Window({ x, y, w, h, stroke = B }: { x: number; y: number; w: number; h: number; stroke?: string }) {
  return <>
    <rect x={x} y={y} width={w} height={h} rx="14" stroke={stroke} strokeWidth="6" fill={K} />
    <line x1={x} y1={y + 24} x2={x + w} y2={y + 24} stroke={stroke} strokeWidth="4" opacity="0.5" />
    <circle cx={x + 14} cy={y + 12} r="3.5" fill={G} />
    <circle cx={x + 26} cy={y + 12} r="3.5" fill={F} />
    <circle cx={x + 38} cy={y + 12} r="3.5" fill={DIM} />
  </>;
}

/** Shopify ↔ back-office: packets flowing both ways, kept in sync. */
export function SyncScene(props: SceneProps) {
  return <SceneFrame {...props}>
    <Window x={16} y={52} w={112} h={128} />
    <path d="M50 118 H94 L90 160 H54 Z" stroke={G} strokeWidth="6" />
    <path d="M62 118 V110 C62 98 82 98 82 110 V118" stroke={G} strokeWidth="6" />
    {[58, 100, 142].map((y, i) => <g key={y}>
      <rect x="196" y={y} width="108" height="32" rx="10" stroke={B} strokeWidth="6" fill={K} />
      <circle className="sa s-blink" style={v({ d: i * 0.4, t: 1.2 })} cx="214" cy={y + 16} r="5" fill={i === 1 ? F : G} />
      <line x1="232" y1={y + 16} x2="284" y2={y + 16} stroke={DIM} strokeWidth="5" />
    </g>)}
    <line x1="134" y1="96" x2="190" y2="96" stroke={DIM} strokeWidth="5" strokeDasharray="2 10" />
    <line x1="134" y1="138" x2="190" y2="138" stroke={DIM} strokeWidth="5" strokeDasharray="2 10" />
    <circle className="sa s-travel" style={v({ t: 1.6, dx: 50 })} cx="138" cy="96" r="7" fill={G} />
    <circle className="sa s-travel" style={v({ t: 1.6, d: 0.8, dx: -50 })} cx="186" cy="138" r="7" fill={F} />
    <g className="sa s-spin" style={v({ t: 3 })}>
      <path d="M150 196 A14 14 0 1 1 164 210" stroke={G} strokeWidth="6" />
      <path d="M158 204 L164 210 L158 216" stroke={G} strokeWidth="6" />
    </g>
  </SceneFrame>;
}

/** A broken checkout being mended: cart → payment → confirmed. */
export function CheckoutScene(props: SceneProps) {
  return <SceneFrame {...props}>
    <path d="M18 84 H40 L54 150 H116 L128 104 H46" stroke={B} strokeWidth="7" />
    <circle cx="64" cy="170" r="8" fill={B} />
    <circle cx="106" cy="170" r="8" fill={B} />
    <path className="sa s-march" style={v({ t: 1.2 })} d="M132 128 H160" stroke={G} strokeWidth="6" />
    <rect x="164" y="98" width="76" height="52" rx="10" stroke={F} strokeWidth="6" fill={K} />
    <line x1="164" y1="114" x2="240" y2="114" stroke={F} strokeWidth="6" />
    <line x1="176" y1="134" x2="200" y2="134" stroke={DIM} strokeWidth="5" />
    <path className="sa s-march" style={v({ t: 1.2, d: 0.3 })} d="M244 124 H258" stroke={G} strokeWidth="6" />
    <circle className="sa s-pop" style={v({ t: 3.2, d: 0.6 })} cx="286" cy="124" r="26" fill={G} />
    <path className="sa s-draw" style={v({ t: 3.2, d: 0.9 })} pathLength={100} d="M274 125 L283 134 L299 114" stroke={K} strokeWidth="7" />
    <g className="sa s-spin" style={v({ t: 4 })}>
      <circle cx="202" cy="56" r="20" stroke={B} strokeWidth="11" strokeDasharray="6.5 6.3" />
      <circle cx="202" cy="56" r="8" stroke={B} strokeWidth="5" />
    </g>
    <path className="sa s-march" style={v({ t: 1.2 })} d="M202 82 V94" stroke={G} strokeWidth="5" />
  </SceneFrame>;
}

/** A page being scanned, issues flagged, then sorted into a priority list. */
export function AuditScene(props: SceneProps) {
  return <SceneFrame {...props}>
    <Window x={14} y={36} w={196} h={168} />
    {[80, 104, 128, 152, 176].map((y, i) => <rect key={y} x="32" y={y} width={[140, 110, 150, 96, 128][i]} height="10" rx="5" fill={DIM} />)}
    {[[176, 84], [150, 132], [132, 180]].map(([x, y], i) => <circle key={i} className="sa s-pop" style={v({ t: 4.2, d: 0.6 + i * 0.9 })} cx={x} cy={y} r="8" fill={V} />)}
    <g className="sa s-scan" style={v({ t: 4.2, sx: 104, sy: 70 })}>
      <circle cx="70" cy="96" r="24" stroke={G} strokeWidth="7" fill="rgba(26,255,110,0.08)" />
      <path d="M88 114 L104 130" stroke={G} strokeWidth="9" />
    </g>
    {[0, 1, 2].map((i) => <g key={i} className="sa s-slide" style={v({ t: 4.2, d: 1.4 + i * 0.35 })}>
      <circle cx="240" cy={82 + i * 44} r="11" fill={[V, F, G][i]} />
      <rect x="258" y={76 + i * 44} width={[50, 40, 30][i]} height="12" rx="6" fill={B} />
    </g>)}
  </SceneFrame>;
}

/** An operations dashboard filling in: KPIs, bars growing, a trend line drawing. */
export function DashboardScene(props: SceneProps) {
  return <SceneFrame {...props}>
    <Window x={10} y={24} w={300} h={192} />
    <rect x="22" y="60" width="44" height="144" rx="8" fill="rgba(244,247,245,0.07)" />
    {[0, 1, 2].map((i) => <rect key={i} x="30" y={72 + i * 26} width="28" height="8" rx="4" fill={i === 0 ? G : DIM} />)}
    {[0, 1, 2].map((i) => <g key={i}>
      <rect x={80 + i * 74} y="60" width="64" height="38" rx="8" stroke={DIM} strokeWidth="4" />
      <rect className="sa s-grow" style={v({ t: 3.6, d: i * 0.2 })} x={90 + i * 74} y="80" width={[34, 24, 40][i]} height="8" rx="4" fill={[G, F, B][i]} />
    </g>)}
    {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} className="sa s-grow" style={v({ t: 3.6, d: 0.3 + i * 0.12 })} x={84 + i * 22} y={200 - [48, 72, 56, 88, 64, 94][i]} width="14" height={[48, 72, 56, 88, 64, 94][i]} rx="4" fill={i % 2 ? F : G} />)}
    <rect x="224" y="110" width="76" height="94" rx="8" stroke={DIM} strokeWidth="4" />
    <path className="sa s-draw" style={v({ t: 3.6, d: 0.5 })} pathLength={100} d="M232 186 L248 164 L262 172 L278 138 L292 124" stroke={G} strokeWidth="5" />
  </SceneFrame>;
}

/** Ongoing care: a shield with a live heartbeat and a turning gear. */
export function MaintenanceScene(props: SceneProps) {
  return <SceneFrame {...props}>
    <path d="M160 26 L236 54 V112 C236 160 204 196 160 214 C116 196 84 160 84 112 V54 Z" stroke={B} strokeWidth="7" fill={K} />
    <path className="sa s-draw" style={v({ t: 2.4 })} pathLength={100} d="M100 124 H132 L144 96 L160 150 L174 112 L184 124 H220" stroke={G} strokeWidth="7" />
    <g className="sa s-spin" style={v({ t: 6 })}>
      <circle cx="262" cy="62" r="22" stroke={F} strokeWidth="12" strokeDasharray="7 6.8" />
      <circle cx="262" cy="62" r="9" stroke={F} strokeWidth="6" />
    </g>
    <g className="sa s-spin" style={v({ t: 6 })}>
      <circle cx="58" cy="176" r="15" stroke={DIM} strokeWidth="9" strokeDasharray="5 5.2" />
    </g>
    <circle className="sa s-pop" style={v({ t: 2.4, d: 1 })} cx="222" cy="186" r="16" fill={G} />
    <path d="M214 186 L220 192 L231 180" stroke={K} strokeWidth="5" />
  </SceneFrame>;
}

/** White-label delivery: your agency's front, my build layer working behind it. */
export function WhiteLabelScene(props: SceneProps) {
  return <SceneFrame {...props}>
    <g className="sa s-peek" style={v({ t: 3.4, px: -24, py: 14 })}>
      <rect x="128" y="40" width="160" height="136" rx="16" stroke={F} strokeWidth="6" fill={K} />
      <path d="M176 92 L160 108 L176 124" stroke={F} strokeWidth="7" />
      <path d="M240 92 L256 108 L240 124" stroke={F} strokeWidth="7" />
      <line x1="200" y1="90" x2="214" y2="126" stroke={F} strokeWidth="6" />
    </g>
    <rect x="34" y="72" width="170" height="140" rx="16" stroke={B} strokeWidth="6" fill={K} />
    <circle cx="70" cy="108" r="16" fill={G} />
    <rect x="96" y="100" width="80" height="12" rx="6" fill={B} />
    {[136, 158, 180].map((y, i) => <rect key={y} x="54" y={y} width={[128, 100, 116][i]} height="9" rx="4.5" fill={DIM} />)}
    <g className="sa s-bob" style={v({ t: 2.2 })}>
      <rect x="150" y="54" width="66" height="26" rx="13" fill={G} />
      <circle cx="166" cy="67" r="5" fill={K} />
      <rect x="176" y="63" width="30" height="8" rx="4" fill={K} />
    </g>
  </SceneFrame>;
}

/** A Shopify storefront assembling itself: awning, products, a bouncing bag. */
export function StoreScene(props: SceneProps) {
  return <SceneFrame {...props}>
    <rect x="40" y="74" width="240" height="140" rx="14" stroke={B} strokeWidth="6" fill={K} />
    <path d="M34 74 H286 L270 44 H50 Z" stroke={B} strokeWidth="6" fill={K} />
    <path d="M40 74 C40 92 76 92 76 74 C76 92 112 92 112 74 C112 92 148 92 148 74 C148 92 184 92 184 74 C184 92 220 92 220 74 C220 92 256 92 256 74 C256 92 280 92 280 74" stroke={G} strokeWidth="6" fill="rgba(26,255,110,0.12)" />
    {[0, 1, 2].map((i) => <g key={i} className="sa s-drop" style={v({ t: 4, d: i * 0.3 })}>
      <rect x={60 + i * 72} y="112" width="56" height="74" rx="10" stroke={DIM} strokeWidth="4" />
      <circle cx={88 + i * 72} cy="138" r="14" fill={[G, F, B][i]} />
      <rect x={70 + i * 72} y="164" width="36" height="8" rx="4" fill={DIM} />
    </g>)}
    <g className="sa s-bob" style={v({ t: 1.6, dy: -12 })}>
      <path d="M252 22 H290 L286 60 H256 Z" stroke={G} strokeWidth="6" fill={K} />
      <path d="M262 22 V16 C262 6 280 6 280 16 V22" stroke={G} strokeWidth="5" />
    </g>
  </SceneFrame>;
}

/** WordPress: content blocks stacking into a page, a plugin snapping into place. */
export function WordPressScene(props: SceneProps) {
  return <SceneFrame {...props}>
    <rect x="30" y="26" width="190" height="190" rx="14" stroke={B} strokeWidth="6" fill={K} />
    <rect className="sa s-drop" style={v({ t: 4.4 })} x="46" y="42" width="158" height="26" rx="8" fill={F} />
    <rect className="sa s-drop" style={v({ t: 4.4, d: 0.3 })} x="46" y="78" width="158" height="58" rx="8" stroke={DIM} strokeWidth="4" fill="rgba(244,247,245,0.06)" />
    <rect className="sa s-drop" style={v({ t: 4.4, d: 0.6 })} x="46" y="146" width="74" height="54" rx="8" fill={G} />
    <rect className="sa s-drop" style={v({ t: 4.4, d: 0.9 })} x="130" y="146" width="74" height="54" rx="8" stroke={B} strokeWidth="4" />
    <path d="M240 98 H300 V158 H240 V138 C228 138 228 118 240 118 Z" stroke={DIM} strokeWidth="4" strokeDasharray="4 8" />
    <g className="sa s-snap" style={v({ t: 3.4 })}>
      <path d="M240 98 H258 C258 86 278 86 278 98 H300 V158 H240 V138 C228 138 228 118 240 118 Z" fill={G} stroke={K} strokeWidth="3" />
    </g>
  </SceneFrame>;
}

/** Custom business systems: a spreadsheet's rows flowing through into an app. */
export function SystemsScene(props: SceneProps) {
  return <SceneFrame {...props}>
    <rect x="14" y="76" width="82" height="88" rx="12" stroke={B} strokeWidth="6" fill={K} />
    <path d="M14 106 H96 M14 134 H96 M42 76 V164 M70 76 V164" stroke={DIM} strokeWidth="4" />
    <circle cx="160" cy="120" r="30" stroke={F} strokeWidth="6" fill={K} />
    <g className="sa s-spin" style={v({ t: 5 })}>
      <circle cx="160" cy="120" r="14" stroke={F} strokeWidth="9" strokeDasharray="5 4" />
    </g>
    <rect x="222" y="70" width="86" height="100" rx="12" stroke={G} strokeWidth="6" fill={K} />
    <rect x="234" y="84" width="62" height="12" rx="6" fill={G} />
    {[0, 1, 2].map((i) => <rect key={i} className="sa s-slide" style={v({ t: 3.6, d: 1 + i * 0.25 })} x="234" y={106 + i * 18} width={[62, 44, 54][i]} height="10" rx="5" fill={DIM} />)}
    <line x1="100" y1="120" x2="126" y2="120" stroke={DIM} strokeWidth="5" strokeDasharray="2 9" />
    <line x1="194" y1="120" x2="218" y2="120" stroke={DIM} strokeWidth="5" strokeDasharray="2 9" />
    <rect className="sa s-travel" style={v({ t: 1.8, dx: 26 })} x="98" y="114" width="12" height="12" rx="3" fill={B} />
    <circle className="sa s-travel" style={v({ t: 1.8, d: 0.9, dx: 24 })} cx="196" cy="120" r="7" fill={G} />
  </SceneFrame>;
}

/** Cairo at the centre, arcs reaching the GCC, Europe and the USA. */
export function GlobeScene(props: SceneProps) {
  const pin = { x: 176, y: 124 };
  const places = [
    { x: 238, y: 150, label: "GCC", below: true },
    { x: 132, y: 70, label: "Europe", below: false },
    { x: 84, y: 150, label: "USA", below: true },
  ];
  return <SceneFrame {...props}>
    <circle cx="160" cy="120" r="100" stroke={B} strokeWidth="6" fill={K} />
    <ellipse cx="160" cy="120" rx="44" ry="100" stroke={DIM} strokeWidth="4" />
    <ellipse cx="160" cy="120" rx="82" ry="100" stroke={DIM} strokeWidth="3" />
    <path d="M64 92 H256 M64 148 H256 M60 120 H260" stroke={DIM} strokeWidth="3" />
    {places.map((place, i) => {
      const cx = (pin.x + place.x) / 2;
      const cy = Math.min(pin.y, place.y) - 44;
      return <g key={place.label}>
        <path className="sa s-draw" style={v({ t: 3.6, d: i * 0.5 })} pathLength={100} d={`M${pin.x} ${pin.y} Q${cx} ${cy} ${place.x} ${place.y}`} stroke={F} strokeWidth="5" />
        <circle className="sa s-pop" style={v({ t: 3.6, d: 0.8 + i * 0.5 })} cx={place.x} cy={place.y} r="8" fill={F} />
        <text x={place.x} y={place.below ? place.y + 28 : place.y - 16} textAnchor="middle" fill={B} stroke={K} strokeWidth="5" paintOrder="stroke" fontSize="15" fontWeight="700" fontFamily="Hanken Grotesk Variable, sans-serif">{place.label}</text>
      </g>;
    })}
    <g className="sa s-bob" style={v({ t: 1.8, dy: -6 })}>
      <path d={`M${pin.x} ${pin.y} C${pin.x - 18} ${pin.y - 20} ${pin.x - 14} ${pin.y - 40} ${pin.x} ${pin.y - 40} C${pin.x + 14} ${pin.y - 40} ${pin.x + 18} ${pin.y - 20} ${pin.x} ${pin.y} Z`} fill={G} />
      <circle cx={pin.x} cy={pin.y - 26} r="6" fill={K} />
    </g>
    <text x={pin.x + 14} y={pin.y + 22} textAnchor="start" fill={G} stroke={K} strokeWidth="5" paintOrder="stroke" fontSize="16" fontWeight="800" fontFamily="Hanken Grotesk Variable, sans-serif">Cairo</text>
  </SceneFrame>;
}

/** A message on its way: a paper plane looping into an envelope. */
export function SendScene(props: SceneProps) {
  return <SceneFrame {...props}>
    <path d="M30 170 C90 110 150 190 230 120" stroke={DIM} strokeWidth="4" strokeDasharray="3 10" />
    <rect x="206" y="104" width="96" height="70" rx="12" stroke={B} strokeWidth="6" fill={K} />
    <path d="M208 108 L254 144 L300 108" stroke={B} strokeWidth="6" />
    <circle className="sa s-pop" style={v({ t: 3.4, d: 2.6 })} cx="296" cy="104" r="12" fill={G} />
    <g className="sa s-fly" style={v({ t: 3.4 })}>
      <path d="M60 110 L116 88 L96 134 L86 116 Z" fill={G} stroke={K} strokeWidth="3" />
      <path d="M86 116 L116 88" stroke={K} strokeWidth="3" />
    </g>
  </SceneFrame>;
}

/** Full-stack: interface, logic and data as three floating layers. */
export function StackScene(props: SceneProps) {
  const plate = (y: number) => `M160 ${y} L270 ${y + 40} L160 ${y + 80} L50 ${y + 40} Z`;
  return <SceneFrame {...props} viewBox="0 0 320 280">
    <g className="sa s-bob" style={v({ t: 3.2, d: 0.6, dy: -6 })}>
      <path d={plate(168)} stroke={B} strokeWidth="6" fill={K} />
      <ellipse cx="160" cy="208" rx="30" ry="11" stroke={B} strokeWidth="5" />
      <path d="M130 208 V220 C130 232 190 232 190 220 V208" stroke={B} strokeWidth="5" />
    </g>
    <g className="sa s-bob" style={v({ t: 3.2, d: 0.3, dy: -10 })}>
      <path d={plate(96)} stroke={F} strokeWidth="6" fill={K} />
      <path d="M140 128 L128 136 L140 144 M180 128 L192 136 L180 144" stroke={F} strokeWidth="6" />
    </g>
    <g className="sa s-bob" style={v({ t: 3.2, dy: -14 })}>
      <path d={plate(24)} stroke={G} strokeWidth="6" fill={K} />
      <rect x="128" y="54" width="64" height="20" rx="6" fill={G} />
    </g>
  </SceneFrame>;
}

export const serviceScenes: Record<string, (props: SceneProps) => JSX.Element> = {
  "shopify-development": StoreScene,
  "wordpress-woocommerce": WordPressScene,
  "custom-business-systems": SystemsScene,
  "white-label-development": WhiteLabelScene,
  "maintenance-performance-security": MaintenanceScene,
};

export const solutionScenes: Record<string, (props: SceneProps) => JSX.Element> = {
  "shopify-api-integration-developer": SyncScene,
  "shopify-maintenance-support": MaintenanceScene,
  "woocommerce-checkout-payment-shipping": CheckoutScene,
  "custom-dashboard-development": DashboardScene,
  "white-label-ecommerce-development": WhiteLabelScene,
  "website-technical-audit": AuditScene,
};

/** Picks the illustration for a service or solution slug, with a sensible default. */
export function sceneFor(slug: string): (props: SceneProps) => JSX.Element {
  return serviceScenes[slug] ?? solutionScenes[slug] ?? SystemsScene;
}
