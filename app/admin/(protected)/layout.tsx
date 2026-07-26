'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAdminAuth } from '@/components/admin/auth-provider'
import { Button } from '@/components/ui/button'

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/admin/login')
  }, [loading, user, router])

  const handleLogout = async () => {
    await logout()
    router.replace('/admin/login')
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background">
      <nav className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/admin" className="font-display text-sm font-medium tracking-wide text-foreground">
            FF Invitation Admin
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Hi, {user.display_name || user.username}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  )
}
