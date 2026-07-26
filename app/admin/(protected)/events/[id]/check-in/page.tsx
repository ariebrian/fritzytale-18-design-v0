'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { attendanceApi, eventsApi, ApiError, type Event, type Guest } from '@/lib/api'
import { Button } from '@/components/ui/button'

type Html5QrcodeInstance = any

export default function CheckInPage() {
  const { id: eventId } = useParams<{ id: string }>()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [scannerActive, setScannerActive] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; guest?: Guest } | null>(null)
  const [loading, setLoading] = useState(false)
  const scannerRef = useRef<Html5QrcodeInstance | null>(null)
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (eventId) {
      eventsApi
        .get(eventId)
        .then(setEvent)
        .catch(() => {})
    }
    return () => {
      stopScanner()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId])

  const startScanner = async () => {
    if (!divRef.current) return

    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      scannerRef.current = new Html5Qrcode('qr-reader')
      setScannerActive(true)
      setResult(null)

      await scannerRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        handleScanSuccess,
        () => {},
      )
    } catch (err) {
      console.error('Failed to start scanner:', err)
      setScannerActive(false)
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current.clear()
      } catch {
        // ignore
      }
      scannerRef.current = null
    }
    setScannerActive(false)
  }

  const extractToken = (scannedText: string): string => {
    try {
      if (scannedText.includes('token=')) {
        const url = new URL(scannedText)
        return url.searchParams.get('token') || scannedText
      }
    } catch {
      // not a URL, fall through
    }
    return scannedText
  }

  const handleScanSuccess = async (decodedText: string) => {
    if (loading) return
    setLoading(true)
    await stopScanner()

    const token = extractToken(decodedText)

    try {
      const response = await attendanceApi.checkIn(token)
      setResult({
        success: true,
        message: `${response.guest.name} checked in successfully!`,
        guest: response.guest,
      })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Check-in failed'
      setResult({ success: false, message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <button
        onClick={() => router.push(`/admin/events/${eventId}`)}
        className="mb-4 text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back
      </button>

      {event && (
        <div className="mb-6 rounded-2xl border border-border bg-card p-6">
          <h1 className="font-display text-lg font-medium text-foreground">{event.title}</h1>
          <p className="text-sm text-muted-foreground">{new Date(event.event_date).toLocaleDateString()}</p>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-6 text-center">
          {!scannerActive ? (
            <Button onClick={startScanner} size="lg" className="px-6 text-base">
              Start Scanner
            </Button>
          ) : (
            <Button onClick={stopScanner} variant="destructive" size="lg" className="px-6 text-base">
              Stop Scanner
            </Button>
          )}
        </div>

        <div id="qr-reader" ref={divRef} className="mb-6 overflow-hidden rounded-lg" />

        {result && (
          <div
            className={`rounded-lg border p-4 ${
              result.success
                ? 'border-primary/30 bg-primary/10'
                : 'border-destructive/30 bg-destructive/10'
            }`}
          >
            <p className={`text-lg font-semibold ${result.success ? 'text-primary' : 'text-destructive'}`}>
              {result.success ? '✓ ' : '✗ '}
              {result.message}
            </p>
            {result.guest && (
              <div className="mt-2 text-sm text-foreground/80">
                <p>Guest: {result.guest.name}</p>
                <p>Type: {result.guest.guest_type}</p>
              </div>
            )}
            <button
              onClick={() => {
                setResult(null)
                startScanner()
              }}
              className="mt-4 text-sm font-medium text-primary hover:underline"
            >
              Scan Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
