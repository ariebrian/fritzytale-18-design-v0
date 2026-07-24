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
import { LightParticles } from '@/components/light-particles'
import { cn } from '@/lib/utils'

const BG_LANDING = '/images/arcadia-landing.jpg'
const BG_CONTENT = '/images/arcadia-content.jpg'

const GUEST_NAME = 'fb1'

type Step = 0 | 1 | 2

export function Invitation() {
  const [step, setStep] = useState<Step>(0)

  const next = () => setStep((s) => Math.min(2, s + 1) as Step)
  const prev = () => setStep((s) => Math.max(0, s - 1) as Step)

  const background = step === 0 ? BG_LANDING : BG_CONTENT

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

        <article className="relative aspect-[2/3] max-h-[90svh] w-full overflow-hidden rounded-[2rem]">
          {/* background image with crossfade */}
          <div
            key={background}
            className="absolute inset-0 animate-fade-up bg-cover bg-center"
            style={{ backgroundImage: `url(${background})` }}
          />

          {/* subtle center scrim so glass cards stay legible while keeping
              the baked-in branding at the top and bottom visible */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(75% 55% at 50% 52%, rgba(8,14,11,0.5) 0%, rgba(8,14,11,0.12) 55%, transparent 80%)',
            }}
          />

          <LightParticles />

          {/* content */}
          <div className="relative flex h-full flex-col px-5 pb-[16%] pt-[18%] sm:px-6">
            <div className="flex flex-1 items-center justify-center">
              {step === 0 && <LandingStep key="s0" onOpen={next} />}
              {step === 1 && <GreetingStep key="s1" />}
              {step === 2 && <DetailsStep key="s2" />}
            </div>

            {/* navigation */}
            <NavBar step={step} onPrev={prev} onNext={next} />
          </div>
        </article>
      </div>
    </main>
  )
}

/* ------------------------------- steps ------------------------------- */

function LandingStep({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex w-full animate-fade-up flex-col items-center gap-4 text-center">
      <div className="glass w-full rounded-2xl px-6 py-5">
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-foreground/70">Dear,</p>
        <p className="mt-1 font-display text-2xl font-medium tracking-wide text-foreground">
          {GUEST_NAME}
        </p>
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="glass-strong group flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-5 transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="font-display text-xl font-medium tracking-wide text-foreground">
          Open Invitation
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/80 text-primary-foreground transition-transform duration-300 group-hover:translate-x-1">
          <ArrowRight className="h-4 w-4" />
        </span>
      </button>
    </div>
  )
}

function GreetingStep() {
  return (
    <div className="flex w-full animate-fade-up items-center justify-center">
      <div className="glass-dark w-full rounded-3xl px-6 py-8 text-center">
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
  )
}

function DetailsStep() {
  return (
    <div className="flex w-full animate-fade-up flex-col justify-center gap-3">
      {/* when + where */}
      <div className="glass-dark rounded-2xl px-5 py-4">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 shrink-0 text-gold" />
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-foreground/60">When</p>
            <p className="font-display text-base font-medium text-foreground">
              Saturday, August 2nd 2026
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <MapPin className="h-5 w-5 shrink-0 text-gold" />
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-foreground/60">Where</p>
            <p className="font-display text-base font-medium text-foreground">
              CGV fX Sudirman, Lt 7
            </p>
          </div>
        </div>
      </div>

      {/* QR */}
      <div className="glass-dark flex flex-col items-center rounded-2xl px-5 py-4">
        <div className="grid h-24 w-24 place-items-center rounded-xl border border-dashed border-foreground/30 bg-foreground/5">
          <QrCode className="h-12 w-12 text-foreground/80" />
        </div>
        <p className="mt-2 text-[0.6rem] uppercase tracking-[0.3em] text-foreground/70">
          Scan to check in
        </p>
      </div>

      {/* closing */}
      <div className="glass-dark rounded-2xl border border-primary/70 px-5 py-4 text-center">
        <p className="text-pretty text-base leading-relaxed text-foreground">
          We sincerely hope you can join us and{' '}
          <span className="text-gold">create magic together</span>
        </p>
      </div>
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
    <div className="mt-3 flex justify-center">
      <div className="glass flex items-center gap-3 rounded-full px-3 py-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={step === 0}
          aria-label="Previous"
          className="grid h-8 w-8 place-items-center rounded-full text-foreground transition disabled:cursor-not-allowed disabled:opacity-30 hover:enabled:scale-110"
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
          className="grid h-8 w-8 place-items-center rounded-full text-foreground transition disabled:cursor-not-allowed disabled:opacity-30 hover:enabled:scale-110"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
