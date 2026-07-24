'use client'

import { useEffect, useState } from 'react'

interface LightParticlesProps {
  count?: number
}

interface Particle {
  id: number
  left: number
  top: number
  size: number
  delay: number
  duration: number
  opacity: number
}

/**
 * Subtle drifting light-dust particles to reinforce the enchanted-forest mood.
 * Generated after mount to avoid SSR/client hydration mismatches, and
 * disabled under prefers-reduced-motion (see globals.css).
 */
export function LightParticles({ count = 22 }: LightParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: count }).map((_, i) => {
        const size = 2 + Math.random() * 4
        return {
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size,
          delay: Math.random() * 8,
          duration: 7 + Math.random() * 9,
          opacity: 0.25 + Math.random() * 0.5,
        }
      }),
    )
  }, [count])

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="arc-particle absolute rounded-full bg-gold"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            boxShadow: '0 0 8px 1px color-mix(in oklab, var(--gold) 70%, transparent)',
            animation: `arc-drift ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
