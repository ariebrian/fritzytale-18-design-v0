'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { eventsApi, ApiError, type Event } from '@/lib/api'
import { Button } from '@/components/ui/button'

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!id) return
    eventsApi
      .get(id)
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!event || !confirm('Are you sure you want to delete this event?')) return
    try {
      await eventsApi.delete(event.id)
      router.push('/admin')
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to delete event')
    }
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  if (loading) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Loading…</p>
  }

  if (!event) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Event not found</p>
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <h1 className="font-display text-2xl font-medium text-foreground">{event.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{formatDate(event.event_date)}</p>
          {event.location && <p className="text-sm text-muted-foreground">{event.location}</p>}
          {event.description && <p className="mt-3 text-sm text-muted-foreground/90">{event.description}</p>}
        </div>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          Delete
        </Button>
      </div>

      <h2 className="mb-3 font-display text-lg font-medium text-foreground">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href={`/admin/events/${event.id}/guests`}
          className="block rounded-2xl border border-border bg-card p-5 transition hover:border-primary/50"
        >
          <div className="font-medium text-foreground">Guest Management</div>
          <div className="mt-1 text-sm text-muted-foreground">Add &amp; manage guests</div>
        </Link>
        <Link
          href={`/admin/events/${event.id}/report`}
          className="block rounded-2xl border border-border bg-card p-5 transition hover:border-primary/50"
        >
          <div className="font-medium text-foreground">Attendance Report</div>
          <div className="mt-1 text-sm text-muted-foreground">View check-in stats</div>
        </Link>
        <Link
          href={`/admin/events/${event.id}/check-in`}
          className="block rounded-2xl border border-border bg-card p-5 transition hover:border-primary/50"
        >
          <div className="font-medium text-foreground">Scan QR</div>
          <div className="mt-1 text-sm text-muted-foreground">Check guests in at the door</div>
        </Link>
      </div>
    </div>
  )
}
