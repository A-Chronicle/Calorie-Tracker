import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useTracker } from '../context/useTracker'
import BottomNav from './BottomNav'
import LogMealSheet from './LogMealSheet'

export default function AppShell() {
  const { user, ready } = useAuth()
  const { profile } = useTracker()

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f3ee]">
        <p className="text-sm text-neutral-500">Loading…</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/signin" replace />
  if (!profile) return <Navigate to="/setup" replace />

  return (
    <div className="min-h-screen bg-[#f6f3ee] pb-28">
      <div className="mx-auto w-full max-w-md">
        <Outlet />
      </div>
      <BottomNav />
      <LogMealSheet />
    </div>
  )
}
