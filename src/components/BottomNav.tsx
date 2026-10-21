import { Camera, Home, TrendingUp, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useTracker } from '../context/useTracker'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-col items-center gap-1 rounded-2xl px-4 py-1.5 text-[11px] font-semibold transition-colors ${
    isActive ? 'bg-ink text-white' : 'text-neutral-400 hover:text-ink'
  }`

export default function BottomNav() {
  const { setLogOpen } = useTracker()

  return (
    <nav className="fixed inset-x-0 bottom-4 z-30 px-5">
      <div className="relative mx-auto flex max-w-sm items-center justify-between rounded-[28px] bg-white/90 px-3 py-2 shadow-xl shadow-ink/10 ring-1 ring-black/5 backdrop-blur-md">
        <NavLink to="/dashboard" className={linkClass}>
          <Home className="h-5 w-5" />
          Home
        </NavLink>
        <NavLink to="/progress" className={linkClass}>
          <TrendingUp className="h-5 w-5" />
          Progress
        </NavLink>
        <div className="w-16" aria-hidden="true" />
        <NavLink to="/profile" className={linkClass}>
          <User className="h-5 w-5" />
          Profile
        </NavLink>
        <button
          type="button"
          onClick={() => setLogOpen(true)}
          className="absolute left-1/2 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full brand-gradient text-white shadow-lg shadow-coral/40 transition-transform active:scale-95"
          aria-label="Log a meal"
        >
          <span className="absolute inset-0 rounded-full brand-gradient animate-pulse-ring" aria-hidden="true" />
          <Camera className="relative h-7 w-7" />
        </button>
      </div>
    </nav>
  )
}
