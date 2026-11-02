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
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-sm font-medium text-white/50">
          <span className="h-2 w-2 animate-pulse rounded-full bg-coral" />
          Loading…
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/signin" replace />
  if (!profile) return <Navigate to="/setup" replace />

  return (
    <div className="min-h-screen pb-36">
      <div className="mx-auto w-full max-w-md">
        <Outlet />
      </div>
      <BottomNav />
      <LogMealSheet />
    </div>
  )
}
