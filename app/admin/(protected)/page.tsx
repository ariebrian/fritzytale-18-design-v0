'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { eventsApi, type Event } from '@/lib/api'
import { buttonVariants } from '@/components/ui/button'

export default function AdminDashboardPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    eventsApi
      .list()
      .then(setEvents)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-foreground">Events</h1>
        <Link href="/admin/events/new" className={buttonVariants({ size: 'default' })}>
          Create Event
        </Link>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading…</p>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">No events yet</p>
          <Link href="/admin/events/new" className="mt-2 inline-block text-sm text-primary hover:underline">
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/admin/events/${event.id}`}
              className="block rounded-2xl border border-border bg-card p-5 transition hover:border-primary/50"
            >
              <h3 className="font-display text-base font-medium text-foreground">{event.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{formatDate(event.event_date)}</p>
              {event.location && <p className="text-sm text-muted-foreground">{event.location}</p>}
              {event.description && (
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground/80">{event.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
