import { Camera, Home, TrendingUp, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useTracker } from '../context/useTracker'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-col items-center gap-1 text-[11px] font-medium ${
    isActive ? 'text-neutral-950' : 'text-neutral-400'
  }`

export default function BottomNav() {
  const { setLogOpen } = useTracker()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-black/5 bg-white/90 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-md items-end justify-around px-6 pb-5 pt-2">
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
          className="absolute left-1/2 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-950 text-white shadow-lg shadow-black/20 ring-4 ring-[#f6f3ee]"
          aria-label="Log a meal"
        >
          <Camera className="h-7 w-7" />
        </button>
      </div>
    </nav>
  )
}
