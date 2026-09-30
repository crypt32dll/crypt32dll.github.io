import { cn } from '@/lib/utils'

type Props = {
  slug: string
  className?: string
}

/**
 * Hand-drawn schematic covers — flat editorial diagrams, not stock 3D glass.
 * Colors follow theme tokens so light/dark stay coherent.
 */
export function ProjectCover({ slug, className }: Props) {
  return (
    <div
      className={cn('absolute inset-0 overflow-hidden bg-paper-elevated text-ink', className)}
      aria-hidden
    >
      <svg
        viewBox="0 0 640 480"
        className="size-full"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
      >
        <rect width="640" height="480" fill="var(--color-paper-elevated)" />
        <CoverArt slug={slug} />
      </svg>
    </div>
  )
}

function CoverArt({ slug }: { slug: string }) {
  switch (slug) {
    case 'composable-commerce':
      return <CommerceDiagram />
    case 'structured-content':
      return <ContentDiagram />
    case 'frontend-platform':
      return <PlatformDiagram />
    case 'performance-architecture':
      return <PerformanceDiagram />
    default:
      return <FallbackDiagram />
  }
}

function Grid() {
  return (
    <g opacity="0.14" stroke="currentColor" strokeWidth="1">
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`v${i}`} x1={40 + i * 48} y1={24} x2={40 + i * 48} y2={456} />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <line key={`h${i}`} x1={24} y1={40 + i * 44} x2={616} y2={40 + i * 44} />
      ))}
    </g>
  )
}

function Node({
  x,
  y,
  w,
  h,
  label,
}: {
  x: number
  y: number
  w: number
  h: number
  label: string
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="2"
        fill="var(--color-paper)"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
      />
      <text
        x={x + 12}
        y={y + 22}
        fill="var(--color-accent)"
        fontFamily="var(--font-display), ui-sans-serif, system-ui, sans-serif"
        fontSize="11"
        fontWeight="600"
        letterSpacing="0.12em"
      >
        {label}
      </text>
    </g>
  )
}

function CommerceDiagram() {
  return (
    <g>
      <Grid />
      <path
        d="M180 140 H280 V220 H360 V160 H460"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.75"
        strokeDasharray="4 6"
      />
      <path
        d="M180 300 H280 V220 M360 300 H460 V160"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.25"
      />
      <Node x={72} y={108} w={108} h={64} label="STORE" />
      <Node x={280} y={188} w={80} h={48} label="API" />
      <Node x={460} y={128} w={108} h={64} label="CMS" />
      <Node x={72} y={268} w={108} h={64} label="AUTH" />
      <Node x={460} y={268} w={108} h={64} label="CART" />
      <circle cx={280} cy={220} r="4" fill="var(--color-accent)" />
      <circle cx={360} cy={220} r="4" fill="var(--color-accent)" />
    </g>
  )
}

function ContentDiagram() {
  return (
    <g>
      <Grid />
      <Node x={72} y={72} w={200} h={56} label="COLLECTION" />
      <path
        d="M120 128 V168 H200 V200 M120 168 H280 V200 M120 168 H400 V200"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
      />
      <Node x={88} y={200} w={140} h={48} label="ENTRY" />
      <Node x={248} y={200} w={140} h={48} label="ENTRY" />
      <Node x={408} y={200} w={140} h={48} label="ENTRY" />
      <path
        d="M158 248 V288 H120 V320 M158 288 H200 V320 M318 248 V288 M478 248 V288"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1.25"
      />
      <rect
        x={88}
        y={320}
        width={72}
        height={36}
        rx="2"
        fill="var(--color-paper)"
        stroke="currentColor"
        strokeOpacity="0.45"
      />
      <rect
        x={172}
        y={320}
        width={72}
        height={36}
        rx="2"
        fill="var(--color-paper)"
        stroke="currentColor"
        strokeOpacity="0.45"
      />
      <rect
        x={278}
        y={288}
        width={80}
        height={28}
        rx="2"
        fill="color-mix(in srgb, var(--color-accent) 22%, var(--color-paper))"
        stroke="var(--color-accent)"
      />
      <rect
        x={438}
        y={288}
        width={80}
        height={28}
        rx="2"
        fill="color-mix(in srgb, var(--color-accent) 22%, var(--color-paper))"
        stroke="var(--color-accent)"
      />
      <text
        x={72}
        y={420}
        fill="currentColor"
        fillOpacity="0.45"
        fontFamily="var(--font-display), ui-sans-serif, system-ui, sans-serif"
        fontSize="12"
        letterSpacing="0.18em"
      >
        SCHEMA → CHANNELS
      </text>
    </g>
  )
}

function PlatformDiagram() {
  const tiles = [
    { x: 80, y: 80, w: 160, h: 100 },
    { x: 260, y: 100, w: 140, h: 90 },
    { x: 420, y: 70, w: 150, h: 110 },
    { x: 120, y: 220, w: 180, h: 100 },
    { x: 330, y: 230, w: 200, h: 110 },
  ]
  return (
    <g>
      <Grid />
      {tiles.map((tile, i) => (
        <g key={tile.x}>
          <rect
            x={tile.x}
            y={tile.y}
            width={tile.w}
            height={tile.h}
            rx="2"
            fill="var(--color-paper)"
            stroke={i % 2 === 0 ? 'var(--color-accent)' : 'currentColor'}
            strokeOpacity={i % 2 === 0 ? 1 : 0.35}
            strokeWidth="1.5"
          />
          <line
            x1={tile.x + 14}
            y1={tile.y + 22}
            x2={tile.x + tile.w - 14}
            y2={tile.y + 22}
            stroke="currentColor"
            strokeOpacity="0.25"
          />
          <line
            x1={tile.x + 14}
            y1={tile.y + 36}
            x2={tile.x + tile.w * 0.55}
            y2={tile.y + 36}
            stroke="currentColor"
            strokeOpacity="0.18"
          />
          <rect
            x={tile.x + 14}
            y={tile.y + tile.h - 28}
            width={28}
            height={12}
            rx="1"
            fill="var(--color-accent)"
            opacity={0.85}
          />
          <rect
            x={tile.x + 48}
            y={tile.y + tile.h - 28}
            width={18}
            height={12}
            rx="1"
            fill="currentColor"
            opacity={0.2}
          />
        </g>
      ))}
      <text
        x={80}
        y={400}
        fill="var(--color-accent)"
        fontFamily="var(--font-display), ui-sans-serif, system-ui, sans-serif"
        fontSize="11"
        fontWeight="600"
        letterSpacing="0.16em"
      >
        TOKENS · COMPONENTS · GATES
      </text>
    </g>
  )
}

function PerformanceDiagram() {
  const bars = [
    { y: 120, w: 420, label: 'TTFB' },
    { y: 180, w: 520, label: 'LCP' },
    { y: 240, w: 280, label: 'INP' },
    { y: 300, w: 360, label: 'CLS' },
  ]
  return (
    <g>
      <Grid />
      <line
        x1={120}
        y1={88}
        x2={120}
        y2={360}
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      {bars.map((bar) => (
        <g key={bar.label}>
          <text
            x={48}
            y={bar.y + 18}
            fill="var(--color-accent)"
            fontFamily="var(--font-display), ui-sans-serif, system-ui, sans-serif"
            fontSize="12"
            fontWeight="600"
            letterSpacing="0.08em"
          >
            {bar.label}
          </text>
          <rect
            x={120}
            y={bar.y}
            width={bar.w}
            height={28}
            rx="2"
            fill="color-mix(in srgb, var(--color-accent) 28%, var(--color-paper))"
            stroke="var(--color-accent)"
            strokeWidth="1.25"
          />
          <rect
            x={120}
            y={bar.y}
            width={Math.max(36, bar.w * 0.18)}
            height={28}
            rx="2"
            fill="var(--color-accent)"
            opacity="0.9"
          />
        </g>
      ))}
      <text
        x={120}
        y={400}
        fill="currentColor"
        fillOpacity="0.4"
        fontFamily="var(--font-display), ui-sans-serif, system-ui, sans-serif"
        fontSize="12"
        letterSpacing="0.18em"
      >
        BUDGET · TRACE · HOLD
      </text>
    </g>
  )
}

function FallbackDiagram() {
  return (
    <g>
      <Grid />
      <rect
        x={160}
        y={140}
        width={320}
        height={200}
        rx="2"
        fill="var(--color-paper)"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
      />
    </g>
  )
}
