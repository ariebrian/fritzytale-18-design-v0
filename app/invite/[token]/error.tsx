'use client'

import { useEffect } from 'react'
import { ArcadiaEmblem } from '@/components/arcadia-emblem'

export default function InviteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-6 py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%), radial-gradient(55% 45% at 50% 100%, color-mix(in oklab, var(--gold) 14%, transparent), transparent 70%)',
        }}
      />
      <div className="glass-dark relative flex max-w-sm flex-col items-center gap-4 rounded-2xl px-8 py-10 text-center">
        <ArcadiaEmblem className="h-10 w-10 text-gold" />
        <h1 className="font-invitation text-2xl font-medium text-foreground">Something went wrong</h1>
        <p className="text-pretty text-sm leading-relaxed text-foreground/70">
          We couldn&apos;t load this invitation right now. Please try again shortly.
        </p>
        <button
          type="button"
          onClick={reset}
          className="glass mt-2 rounded-full px-5 py-2 text-sm font-medium text-foreground transition hover:scale-[1.02]"
        >
          Try again
        </button>
      </div>
    </main>
  )
}
