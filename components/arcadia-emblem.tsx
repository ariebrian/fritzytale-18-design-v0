interface ArcadiaEmblemProps {
  className?: string
}

/**
 * A minimal geometric crest mark used as the project's sigil.
 * Kept simple and icon-like to work as a small brand mark.
 */
export function ArcadiaEmblem({ className }: ArcadiaEmblemProps) {
  return (
    <svg
      viewBox="0 0 64 80"
      fill="none"
      className={className}
      role="img"
      aria-label="Fritzytale Arcadia sigil"
    >
      <g stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        {/* outer shield */}
        <path d="M32 4 58 20v26L32 76 6 46V20Z" opacity="0.55" />
        {/* inner diamond */}
        <path d="M32 20 46 33 32 46 18 33Z" />
        {/* center circle */}
        <circle cx="32" cy="33" r="4.5" fill="currentColor" stroke="none" />
        {/* rays / feathers below */}
        <path d="M20 52 32 58 44 52" opacity="0.85" />
        <path d="M22 60 32 65 42 60" opacity="0.6" />
        <path d="M32 46 32 66" opacity="0.7" />
      </g>
    </svg>
  )
}
