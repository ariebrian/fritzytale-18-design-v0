'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
  QrCode,
  Sparkles,
} from 'lucide-react'
import { ArcadiaEmblem } from '@/components/arcadia-emblem'
import { LightParticles } from '@/components/light-particles'
import { cn } from '@/lib/utils'

const FOREST_PATH = '/images/forest-path.png'
const FOREST_PORTRAIT = '/images/forest-portrait.png'

const GUEST_NAME = 'fb1'

type Step = 0 | 1 | 2

export function Invitation() {
  const [step, setStep] = useState<Step>(0)

  const next = () => setStep((s) => (Math.min(2, s + 1) as Step))
  const prev = () => setStep((s) => (Math.max(0, s - 1) as Step))

  const background = step === 0 ? FOREST_PATH : FOREST_PORTRAIT

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-3 py-4 sm:px-6 sm:py-8">
      {/* ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%), radial-gradient(55% 45% at 50% 100%, color-mix(in oklab, var(--gold) 14%, transparent), transparent 70%)',
        }}
      />

      {/* purple gradient ring wrapper */}
      <div className="relative w-full max-w-[430px] rounded-[2.1rem] p-[2px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
        <div
          aria-hidden
          className="absolute inset-0 rounded-[2.1rem] opacity-90"
          style={{
            background:
              'linear-gradient(150deg, color-mix(in oklab, var(--primary) 90%, white), color-mix(in oklab, var(--primary) 55%, transparent) 45%, color-mix(in oklab, var(--gold) 60%, transparent))',
          }}
        />

        <article
          className="relative aspect-[63/96] max-h-[90svh] w-full overflow-hidden rounded-[2rem]"
        >
          {/* background image with crossfade */}
          <div
            key={background}
            className="absolute inset-0 animate-fade-up bg-cover bg-center"
            style={{ backgroundImage: `url(${background})` }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                step === 0
                  ? 'linear-gradient(180deg, rgba(8,14,11,0.55) 0%, rgba(8,14,11,0.15) 35%, rgba(8,14,11,0.35) 70%, rgba(8,14,11,0.8) 100%)'
                  : 'linear-gradient(180deg, rgba(8,14,11,0.7) 0%, rgba(8,14,11,0.5) 45%, rgba(8,14,11,0.6) 75%, rgba(8,14,11,0.88) 100%)',
            }}
          />

          <LightParticles />

          {/* content */}
          <div className="relative flex h-full flex-col p-5 sm:p-6">
            {step === 0 && <LandingStep key="s0" onOpen={next} />}
            {step === 1 && <GreetingStep key="s1" />}
            {step === 2 && <DetailsStep key="s2" />}

            {/* navigation */}
            <NavBar step={step} onPrev={prev} onNext={next} />
          </div>
        </article>
      </div>
    </main>
  )
}

/* ----------------------------- shared bits ----------------------------- */

function Brandline() {
  return (
    <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.35em] text-foreground/90">
      Fritzytale<span className="text-gold">18</span>
    </span>
  )
}

function Wordmark({ className }: { className?: string }) {
  return (
    <h1
      className={cn(
        'font-display font-semibold uppercase leading-none tracking-[0.18em] text-transparent',
        className,
      )}
      style={{
        backgroundImage:
          'linear-gradient(180deg, #fdfbff 0%, #f4ecff 45%, color-mix(in oklab, var(--gold) 70%, white) 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        textShadow: '0 2px 24px rgba(120,90,220,0.35)',
      }}
    >
      Arcadia
    </h1>
  )
}

function Footer({ variant }: { variant: 'landing' | 'card' }) {
  return (
    <div className="flex items-end justify-between gap-3 pt-4">
      <div className="font-display text-[0.62rem] font-bold uppercase leading-tight tracking-[0.22em] text-foreground/85">
        {variant === 'landing' ? (
          <>
            <p>Fritzy Rosmerian</p>
            <p>
              18<sup>th</sup> Seitansai Project
            </p>
          </>
        ) : (
          <>
            <p>Seitansai Project</p>
            <p className="text-gold">28.07.26</p>
          </>
        )}
      </div>
      <ArcadiaEmblem className="h-10 w-8 shrink-0 text-foreground/80" />
    </div>
  )
}

/* ------------------------------- steps ------------------------------- */

function LandingStep({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex h-full animate-fade-up flex-col">
      {/* header */}
      <div className="flex items-start justify-between">
        <Brandline />
        <span className="font-display text-lg font-semibold tracking-[0.2em] text-foreground/95">
          ARCADIA
        </span>
      </div>

      {/* middle boxes */}
      <div className="flex flex-1 flex-col justify-center gap-4">
        <div className="glass rounded-2xl px-6 py-5">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-foreground/60">Dear,</p>
          <p className="mt-1 font-display text-2xl font-medium tracking-wide text-foreground">
            {GUEST_NAME}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="glass-strong group flex items-center justify-between rounded-2xl px-6 py-5 text-left transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="font-display text-xl font-medium tracking-wide text-foreground">
            Open Invitation
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/80 text-primary-foreground transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>
      </div>

      <Footer variant="landing" />
    </div>
  )
}

function GreetingStep() {
  return (
    <div className="flex h-full animate-fade-up flex-col">
      {/* header */}
      <div className="flex flex-col items-center pt-2 text-center">
        <Brandline />
        <Wordmark className="mt-2 text-5xl sm:text-6xl" />
      </div>

      {/* message */}
      <div className="flex flex-1 items-center justify-center py-4">
        <div className="glass-strong w-full rounded-3xl px-6 py-8 text-center">
          <p className="font-display text-lg tracking-wide text-foreground">
            Dear, <span className="text-gold">{GUEST_NAME}</span>
          </p>
          <p className="mt-5 text-pretty text-base leading-relaxed text-foreground">
            It is a pleasure for inviting you to
          </p>
          <p className="mt-2 text-pretty font-display text-xl font-medium leading-snug text-foreground">
            Fritzy Rosmerian 18th Birthday Project
          </p>
          <Sparkles className="mx-auto mt-5 h-5 w-5 text-gold" />
        </div>
      </div>

      <Footer variant="card" />
    </div>
  )
}

function DetailsStep() {
  return (
    <div className="flex h-full animate-fade-up flex-col">
      <div className="flex flex-col items-center text-center">
        <Brandline />
        <Wordmark className="mt-1 text-4xl sm:text-5xl" />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-3 py-3">
        {/* when + where */}
        <div className="glass-strong rounded-2xl px-5 py-4">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.25em] text-foreground/55">When</p>
              <p className="font-display text-base font-medium text-foreground">
                Saturday, August 2nd 2026
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <MapPin className="h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.25em] text-foreground/55">Where</p>
              <p className="font-display text-base font-medium text-foreground">
                CGV fX Sudirman, Lt 7
              </p>
            </div>
          </div>
        </div>

        {/* QR */}
        <div className="glass-strong flex flex-col items-center rounded-2xl px-5 py-4">
          <div className="grid h-24 w-24 place-items-center rounded-xl border border-dashed border-foreground/30 bg-foreground/5">
            <QrCode className="h-12 w-12 text-foreground/80" />
          </div>
          <p className="mt-2 text-[0.6rem] uppercase tracking-[0.3em] text-foreground/60">
            Scan to check in
          </p>
        </div>

        {/* closing */}
        <div className="rounded-2xl border border-primary/70 bg-primary/10 px-5 py-4 text-center backdrop-blur-md">
          <p className="text-pretty text-base leading-relaxed text-foreground">
            We sincerely hope you can join us and{' '}
            <span className="text-gold">create magic together</span>
          </p>
        </div>
      </div>

      <Footer variant="card" />
    </div>
  )
}

/* ----------------------------- nav bar ----------------------------- */

function NavBar({
  step,
  onPrev,
  onNext,
}: {
  step: Step
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="mt-3 flex items-center justify-between">
      <button
        type="button"
        onClick={onPrev}
        disabled={step === 0}
        aria-label="Previous"
        className="grid h-9 w-9 place-items-center rounded-full glass text-foreground transition disabled:cursor-not-allowed disabled:opacity-30 hover:enabled:scale-105"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-2" role="tablist" aria-label="Invitation pages">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-current={i === step}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === step ? 'w-6 bg-gold' : 'w-1.5 bg-foreground/40',
            )}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={step === 2}
        aria-label="Next"
        className="grid h-9 w-9 place-items-center rounded-full glass text-foreground transition disabled:cursor-not-allowed disabled:opacity-30 hover:enabled:scale-105"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}
