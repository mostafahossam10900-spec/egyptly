// Honest decorative illustrations (no photographs) until image rights are confirmed — DECISIONS R-07.

const PALETTES: Record<string, [string, string, string]> = {
  'red-sea': ['#0f5c6e', '#2c8c99', '#e8c98a'],
  'south-sinai': ['#7a3b2e', '#c46a3d', '#f0c27b'],
  cairo: ['#1f2a44', '#3c4a6b', '#d1ac5e'],
  giza: ['#5b4227', '#c9953f', '#f3d9a0'],
  luxor: ['#3d2b4a', '#a0603a', '#efc983'],
  aswan: ['#21445a', '#3f7e8c', '#e9c27f'],
  alexandria: ['#1d3f5e', '#4c7fa6', '#e9e1cf'],
  matrouh: ['#1b6a7a', '#73b5b8', '#f5e7c4'],
  fayoum: ['#3b5a3a', '#88a35e', '#ecd9a5'],
  'new-valley': ['#6b4a2b', '#d2a26a', '#f7e8cc'],
}

type Motif = 'pyramids' | 'sea' | 'city' | 'temple' | 'desert'
const MOTIF: Record<string, Motif> = {
  'red-sea': 'sea', 'south-sinai': 'sea', cairo: 'city', giza: 'pyramids', luxor: 'temple',
  aswan: 'temple', alexandria: 'sea', matrouh: 'sea', fayoum: 'desert', 'new-valley': 'desert',
}

export function DestinationArt({ governorate, className = '' }: { governorate: string; className?: string }) {
  const [dark, mid, light] = PALETTES[governorate] ?? PALETTES.cairo
  const motif = MOTIF[governorate] ?? 'desert'
  const gid = `g-${governorate}`
  return (
    <svg viewBox="0 0 320 160" role="presentation" aria-hidden="true" className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mid} />
          <stop offset="1" stopColor={light} />
        </linearGradient>
      </defs>
      <rect width="320" height="160" fill={`url(#${gid})`} />
      <circle cx="250" cy="48" r="20" fill={light} opacity=".9" />
      {motif === 'pyramids' && (
        <g fill={dark}>
          <path d="M40 160 L120 50 L200 160 Z" opacity=".85" />
          <path d="M150 160 L215 75 L280 160 Z" />
        </g>
      )}
      {motif === 'temple' && (
        <g fill={dark}>
          <rect x="70" y="80" width="180" height="80" opacity=".85" />
          {[85, 120, 155, 190, 225].map((x) => (
            <rect key={x} x={x} y="62" width="14" height="98" />
          ))}
          <rect x="62" y="56" width="196" height="10" />
        </g>
      )}
      {motif === 'city' && (
        <g fill={dark}>
          <rect x="40" y="95" width="40" height="65" />
          <path d="M100 160 V90 a25 25 0 0 1 50 0 V160 Z" />
          <rect x="122" y="40" width="6" height="40" />
          <rect x="170" y="70" width="12" height="90" />
          <rect x="200" y="100" width="70" height="60" opacity=".85" />
        </g>
      )}
      {motif === 'sea' && (
        <g>
          <path d="M0 110 Q40 100 80 110 T160 110 T240 110 T320 110 V160 H0 Z" fill={dark} opacity=".85" />
          <path d="M0 130 Q40 120 80 130 T160 130 T240 130 T320 130 V160 H0 Z" fill={dark} />
        </g>
      )}
      {motif === 'desert' && (
        <g fill={dark}>
          <path d="M0 160 Q80 90 160 130 T320 110 V160 Z" opacity=".8" />
          <path d="M0 160 Q120 120 200 145 T320 140 V160 Z" />
        </g>
      )}
    </svg>
  )
}

export function HeroArt({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 400 480" role="img" aria-label={label} className="h-full w-full">
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d6b80" />
          <stop offset=".55" stopColor="#d9a65a" />
          <stop offset="1" stopColor="#f2d39a" />
        </linearGradient>
        <linearGradient id="hero-p1" x1="0" y1="0" x2="1" y2="0">
          <stop offset=".5" stopColor="#b9853f" />
          <stop offset=".5" stopColor="#8a5e2b" />
        </linearGradient>
        <linearGradient id="hero-p2" x1="0" y1="0" x2="1" y2="0">
          <stop offset=".5" stopColor="#c99550" />
          <stop offset=".5" stopColor="#9a6a33" />
        </linearGradient>
      </defs>
      <rect width="400" height="480" fill="url(#hero-sky)" />
      <circle cx="300" cy="170" r="34" fill="#f8e2b0" opacity=".9" />
      <path d="M30 400 L170 210 L310 400 Z" fill="url(#hero-p1)" />
      <path d="M230 400 L320 280 L410 400 Z" fill="url(#hero-p2)" />
      <path d="M0 395 Q200 370 400 395 V480 H0 Z" fill="#c8964f" />
      <path d="M0 420 Q200 400 400 425 V480 H0 Z" fill="#a8783c" />
    </svg>
  )
}
