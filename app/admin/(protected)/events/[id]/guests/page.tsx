'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import QRCode from 'react-qr-code'
import {
  eventsApi,
  guestsApi,
  fanbasesApi,
  donorsApi,
  ApiError,
  type Event,
  type Guest,
  type Fanbase,
  type Donor,
} from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function getOrigin() {
  return typeof window !== 'undefined' ? window.location.origin : ''
}

export default function GuestManagementPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [event, setEvent] = useState<Event | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [fanbases, setFanbases] = useState<Fanbase[]>([])
  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showAddForm, setShowAddForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newGuest, setNewGuest] = useState({
    name: '',
    contact: '',
    guest_type: 'fanbase' as Guest['guest_type'],
    fanbase_id: '',
    donor_id: '',
  })

  const [showNewFanbase, setShowNewFanbase] = useState(false)
  const [newFanbaseName, setNewFanbaseName] = useState('')
  const [showNewDonor, setShowNewDonor] = useState(false)
  const [newDonorName, setNewDonorName] = useState('')

  useEffect(() => {
    if (id) fetchData(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchData = async (eventId: string) => {
    try {
      const [eventRes, guestsRes, fanbasesRes, donorsRes] = await Promise.all([
        eventsApi.get(eventId),
        guestsApi.list(eventId),
        fanbasesApi.list(),
        donorsApi.list(),
      ])
      setEvent(eventRes)
      setGuests(guestsRes)
      setFanbases(fanbasesRes)
      setDonors(donorsRes)
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddGuest = async (e: FormEvent) => {
    e.preventDefault()
    if (!id) return
    setError('')
    setSubmitting(true)

    try {
      await guestsApi.create(id, {
        name: newGuest.name,
        contact: newGuest.contact || undefined,
        guest_type: newGuest.guest_type,
        fanbase_id: newGuest.guest_type === 'fanbase' ? newGuest.fanbase_id : undefined,
        donor_id: newGuest.guest_type === 'donor' ? newGuest.donor_id : undefined,
      })
      setNewGuest({ name: '', contact: '', guest_type: 'fanbase', fanbase_id: '', donor_id: '' })
      setShowAddForm(false)
      fetchData(id)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to add guest')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddFanbase = async () => {
    if (!newFanbaseName.trim()) return
    const created = await fanbasesApi.create({ name: newFanbaseName.trim() })
    setFanbases((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
    setNewGuest((g) => ({ ...g, fanbase_id: created.id }))
    setNewFanbaseName('')
    setShowNewFanbase(false)
  }

  const handleAddDonor = async () => {
    if (!newDonorName.trim()) return
    const created = await donorsApi.create({ name: newDonorName.trim() })
    setDonors((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
    setNewGuest((g) => ({ ...g, donor_id: created.id }))
    setNewDonorName('')
    setShowNewDonor(false)
  }

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm('Are you sure you want to remove this guest?')) return
    try {
      await guestsApi.delete(guestId)
      if (id) fetchData(id)
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to remove guest')
    }
  }

  if (loading) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Loading…</p>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push(`/admin/events/${id}`)}
            className="mb-1 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back
          </button>
          <h1 className="font-display text-2xl font-medium text-foreground">
            Guests — {event?.title}
          </h1>
        </div>
        <Button onClick={() => setShowAddForm((s) => !s)}>
          {showAddForm ? 'Cancel' : 'Add Guest'}
        </Button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddGuest}
          className="mb-6 space-y-4 rounded-2xl border border-border bg-card p-6"
        >
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input
                required
                value={newGuest.name}
                onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Contact</Label>
              <Input
                value={newGuest.contact}
                onChange={(e) => setNewGuest({ ...newGuest, contact: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Guest Type *</Label>
              <Select
                value={newGuest.guest_type}
                onValueChange={(value) =>
                  setNewGuest({
                    ...newGuest,
                    guest_type: (value ?? 'fanbase') as Guest['guest_type'],
                    fanbase_id: '',
                    donor_id: '',
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fanbase">Fanbase</SelectItem>
                  <SelectItem value="donor">Donor</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newGuest.guest_type === 'fanbase' && (
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Fanbase *</Label>
                <div className="flex gap-2">
                  <Select
                    value={newGuest.fanbase_id}
                    onValueChange={(value) => setNewGuest({ ...newGuest, fanbase_id: value ?? '' })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select fanbase" />
                    </SelectTrigger>
                    <SelectContent>
                      {fanbases.map((fb) => (
                        <SelectItem key={fb.id} value={fb.id}>
                          {fb.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" onClick={() => setShowNewFanbase((s) => !s)}>
                    + New
                  </Button>
                </div>
                {showNewFanbase && (
                  <div className="flex gap-2 pt-1">
                    <Input
                      placeholder="New fanbase name"
                      value={newFanbaseName}
                      onChange={(e) => setNewFanbaseName(e.target.value)}
                    />
                    <Button type="button" size="sm" onClick={handleAddFanbase}>
                      Add
                    </Button>
                  </div>
                )}
              </div>
            )}

            {newGuest.guest_type === 'donor' && (
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Donor *</Label>
                <div className="flex gap-2">
                  <Select
                    value={newGuest.donor_id}
                    onValueChange={(value) => setNewGuest({ ...newGuest, donor_id: value ?? '' })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select donor" />
                    </SelectTrigger>
                    <SelectContent>
                      {donors.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" onClick={() => setShowNewDonor((s) => !s)}>
                    + New
                  </Button>
                </div>
                {showNewDonor && (
                  <div className="flex gap-2 pt-1">
                    <Input
                      placeholder="New donor name"
                      value={newDonorName}
                      onChange={(e) => setNewDonorName(e.target.value)}
                    />
                    <Button type="button" size="sm" onClick={handleAddDonor}>
                      Add
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add Guest'}
            </Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>QR</TableHead>
              <TableHead>Invitation</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                  {(guest.guest_type === 'fanbase' || guest.guest_type === 'donor') && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {guest.guest_type === 'fanbase' ? guest.fanbases?.name || '-' : guest.donors?.name || '-'}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {guest.guest_type === 'member' || guest.guest_type === 'guest' ? (
                    <Badge variant="outline">Reusable QR</Badge>
                  ) : guest.checked_in ? (
                    <Badge className="bg-primary/15 text-primary">Checked In</Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="grid h-14 w-14 place-items-center rounded-md bg-white p-1">
                    <QRCode
                      value={`${getOrigin()}/admin/confirm-attendance?token=${guest.qr_code_token}`}
                      size={48}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <a
                    href={`${getOrigin()}/invite/${guest.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    View Invitation
                  </a>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => handleDeleteGuest(guest.id)}
                    className="text-sm text-destructive hover:underline"
                  >
                    Remove
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {guests.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">No guests added yet</div>
        )}
      </div>

      <div className="mt-4">
        <Link href={`/admin/events/${id}/report`} className="text-sm text-primary hover:underline">
          View attendance report →
        </Link>
      </div>
    </div>
  )
}
