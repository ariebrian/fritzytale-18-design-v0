'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import QRCode from 'react-qr-code'
import { LightParticles } from '@/components/light-particles'
import { cn } from '@/lib/utils'
import type { InvitationData } from '@/lib/data/invitations'

const BG_IMAGE = '/images/invitation-bg.png'
const LOGO_IMAGE = '/images/invitation-logo.png'

type Step = 0 | 1 | 2

interface InvitationProps {
  event: InvitationData['event']
  guest: InvitationData['guest']
}

export function Invitation({ event, guest }: InvitationProps) {
  const [step, setStep] = useState<Step>(0)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const next = () => setStep((s) => Math.min(2, s + 1) as Step)
  const prev = () => setStep((s) => Math.max(0, s - 1) as Step)

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-8">
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

        <article className="relative aspect-[2/3] max-h-[90svh] w-full overflow-hidden rounded-[2rem] [@media(max-height:520px)]:aspect-auto [@media(max-height:520px)]:max-h-none">
          {/* background image, shared across all steps */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${BG_IMAGE})` }}
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

          {/* logo lockup, landing step only */}
          {step === 0 && (
            <div aria-hidden className="absolute inset-0 animate-float">
              <img
                src={LOGO_IMAGE}
                alt=""
                className="absolute inset-0 h-full w-full animate-fade-up object-cover"
              />
            </div>
          )}

          {/* content */}
          <div className="relative flex h-full flex-col px-5 pb-[16%] pt-[18%] sm:px-6">
            <div className="flex flex-1 flex-col overflow-y-auto">
              {/* m-auto centers the step when it fits, but falls back to
                  top-aligned (rather than clipping the top) once content is
                  taller than the available space */}
              <div className="m-auto w-full">
                {step === 0 && <LandingStep key="s0" guestName={guest.name} onOpen={next} />}
                {step === 1 && <ContentStep key="s1" guestName={guest.name} event={event} />}
                {step === 2 && (
                  <QRStep key="s2" qrValue={`${origin}/admin/confirm-attendance?token=${guest.qr_code_token}`} />
                )}
              </div>
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

function LandingStep({ guestName, onOpen }: { guestName: string; onOpen: () => void }) {
  return (
    <div className="flex w-full animate-fade-up flex-col items-center gap-4 text-center">
      <div className="glass w-full rounded-2xl px-6 py-5">
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-foreground/70">Dear,</p>
        <p className="mt-1 break-words font-display text-2xl font-medium tracking-wide text-foreground">
          {guestName}
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
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/80 text-primary-foreground transition-transform duration-300 group-hover:translate-x-1">
          <ArrowRight className="h-4 w-4" />
        </span>
      </button>
    </div>
  )
}

function ContentStep({
  guestName,
  event,
}: {
  guestName: string
  event: InvitationProps['event']
}) {
  const eventDate = new Date(event.event_date)
  const formattedDate = Number.isNaN(eventDate.getTime())
    ? event.event_date
    : new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(eventDate)

  return (
    <div className="flex w-full animate-fade-up flex-col justify-center gap-3">
      {/* greeting */}
      <div className="glass rounded-2xl px-5 py-4 text-center">
        <p className="break-words font-display text-base tracking-wide text-foreground">
          Dear, <span className="text-gold">{guestName}</span>
        </p>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-foreground/90">
          It is a pleasure to invite you to
        </p>
        <p className="mt-1 text-pretty font-display text-base font-medium leading-snug text-foreground">
          {event.title}
        </p>
      </div>

      {/* when + where */}
      <div className="glass-strong rounded-2xl px-5 py-4">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 shrink-0 text-gold" />
          <div className="min-w-0">
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-foreground/60">When</p>
            <p className="break-words font-display text-sm font-medium text-foreground">
              {formattedDate}
            </p>
          </div>
        </div>
        {event.location && (
          <div className="mt-3 flex items-center gap-3">
            <MapPin className="h-5 w-5 shrink-0 text-gold" />
            <div className="min-w-0">
              <p className="text-[0.6rem] uppercase tracking-[0.25em] text-foreground/60">Where</p>
              <p className="break-words font-display text-sm font-medium text-foreground">
                {event.location}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* closing */}
      <div className="glass rounded-2xl border border-primary/70 px-5 py-3 text-center">
        <p className="text-pretty text-sm leading-relaxed text-foreground">
          We sincerely hope you can join us and{' '}
          <span className="text-gold">create magic together</span>
        </p>
      </div>
    </div>
  )
}

function QRStep({ qrValue }: { qrValue: string }) {
  return (
    <div className="flex w-full animate-fade-up flex-col justify-center gap-3">
      {/* instruction */}
      <div className="glass rounded-2xl px-5 py-5 text-center">
        <p className="text-pretty font-display text-base font-medium leading-snug text-foreground">
          Show this QR Code when you visit our project!
        </p>
      </div>

      {/* qr */}
      <div className="glass-dark flex flex-col items-center gap-3 rounded-2xl px-5 py-6">
        <div className="grid place-items-center rounded-xl border border-dashed border-foreground/30 bg-foreground/5 p-3">
          <QRCode value={qrValue} size={160} level="H" fgColor="#f0f7f4" bgColor="transparent" />
        </div>
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-foreground/70">
          Scan to check in
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
