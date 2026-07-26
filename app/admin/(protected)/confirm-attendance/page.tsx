'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAdminAuth } from '@/components/admin/auth-provider'
import { attendanceApi, publicApi, ApiError, type Guest, type InvitationData } from '@/lib/api'
import { Button } from '@/components/ui/button'

export default function ConfirmAttendancePage() {
  return (
    <Suspense fallback={<p className="py-12 text-center text-sm text-muted-foreground">Loading…</p>}>
      <ConfirmAttendanceContent />
    </Suspense>
  )
}

function ConfirmAttendanceContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const { user } = useAdminAuth()
  const router = useRouter()

  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; guest?: Guest } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    publicApi
      .getInvitation(token)
      .then(setInvitation)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Invalid QR code'))
      .finally(() => setLoading(false))
  }, [token])

  const handleConfirm = async () => {
    if (!token) return
    setConfirming(true)
    setResult(null)

    try {
      const response = await attendanceApi.checkIn(token)
      setResult({ success: true, message: `${response.guest.name} checked in successfully!`, guest: response.guest })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Check-in failed'
      setResult({ success: false, message })
    } finally {
      setConfirming(false)
    }
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <h1 className="mb-2 font-display text-xl font-medium text-destructive">Invalid Link</h1>
        <p className="text-sm text-muted-foreground">No QR code token provided</p>
      </div>
    )
  }

  if (loading) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Loading…</p>
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <h1 className="mb-2 font-display text-xl font-medium text-destructive">Error</h1>
        <p className="text-sm text-muted-foreground">{error}</p>
        <button onClick={() => router.push('/admin')} className="mt-4 text-sm text-primary hover:underline">
          Go to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md">
      <p className="mb-4 text-center text-sm text-muted-foreground">
        Logged in as {user?.display_name || user?.username}
      </p>

      <div className="rounded-2xl border border-border bg-card p-6">
        {invitation && (
          <>
            <div className="mb-6 text-center">
              <h2 className="font-display text-xl font-medium text-foreground">{invitation.event.title}</h2>
              <p className="text-sm text-muted-foreground">
                {new Date(invitation.event.event_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className="mb-6 border-y border-border py-4">
              <p className="text-sm text-muted-foreground">Guest</p>
              <p className="text-lg font-semibold text-foreground">{invitation.guest.name}</p>
            </div>

            {!result ? (
              <Button onClick={handleConfirm} disabled={confirming} className="w-full justify-center text-base" size="lg">
                {confirming ? 'Confirming…' : '✓ Confirm Check-In'}
              </Button>
            ) : (
              <div
                className={`rounded-lg border p-4 text-center font-semibold ${
                  result.success
                    ? 'border-primary/30 bg-primary/10 text-primary'
                    : 'border-destructive/30 bg-destructive/10 text-destructive'
                }`}
              >
                {result.success ? '✓ ' : '✗ '}
                {result.message}
              </div>
            )}

            {result && (
              <button
                onClick={() => {
                  setResult(null)
                  router.back()
                }}
                className="mt-4 w-full text-center text-sm text-primary hover:underline"
              >
                ← Scan Another
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
