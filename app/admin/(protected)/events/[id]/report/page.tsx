'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { attendanceApi, eventsApi, type Event, type Guest, type AttendanceStats } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function AttendanceReportPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [stats, setStats] = useState<AttendanceStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) fetchData(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchData = async (eventId: string) => {
    try {
      const [eventRes, guestsRes, statsRes] = await Promise.all([
        eventsApi.get(eventId),
        attendanceApi.list(eventId),
        attendanceApi.stats(eventId),
      ])
      setEvent(eventRes)
      setGuests(guestsRes)
      setStats(statsRes)
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Loading…</p>
  }

  return (
    <div>
      <button
        onClick={() => router.push(`/admin/events/${id}`)}
        className="mb-4 text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back
      </button>

      {event && (
        <div className="mb-6 rounded-2xl border border-border bg-card p-6">
          <h1 className="font-display text-2xl font-medium text-foreground">{event.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date(event.event_date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard value={stats.total} label="Total Guests" />
          <StatCard value={stats.checkedIn} label="Checked In" accent="text-primary" />
          <StatCard value={stats.notCheckedIn} label="Not Yet" accent="text-muted-foreground" />
          <StatCard
            value={`${stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0}%`}
            label="Attendance Rate"
            accent="text-gold"
          />
        </div>
      )}

      {stats && Object.keys(stats.byType).length > 0 && (
        <div className="mb-6 rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-display text-base font-medium text-foreground">By Guest Type</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="text-center">
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-sm capitalize text-muted-foreground">{type}</p>
                <p className="text-xs text-primary">{stats.checkedInByType[type] || 0} checked in</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h3 className="font-display text-base font-medium text-foreground">Guest List ({guests.length})</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Checked In At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell>
                  <div className="font-medium text-foreground">{guest.name}</div>
                  {guest.contact && <div className="text-sm text-muted-foreground">{guest.contact}</div>}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{guest.guest_type}</Badge>
                </TableCell>
                <TableCell>
                  {guest.checked_in ? (
                    <Badge className="bg-primary/15 text-primary">Checked In</Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {guest.checked_in_at ? new Date(guest.checked_in_at).toLocaleString() : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {guests.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">No guests yet</div>
        )}
      </div>
    </div>
  )
}

function StatCard({ value, label, accent }: { value: number | string; label: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-center">
      <p className={`text-3xl font-bold text-foreground ${accent || ''}`}>{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
