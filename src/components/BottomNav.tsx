import { Home, Plus, TrendingUp, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useTracker } from '../context/useTracker'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex w-20 flex-col items-center gap-0.5 py-1 text-[11px] font-semibold transition-colors ${
    isActive ? 'text-ink' : 'text-neutral-400 hover:text-ink'
  }`

export default function BottomNav() {
  const { setLogOpen } = useTracker()

  return (
    <nav className="fixed inset-x-0 bottom-5 z-30 px-5">
      <div className="relative mx-auto flex max-w-sm items-center justify-around rounded-full bg-white px-3 py-2.5 shadow-xl shadow-ink/10 ring-1 ring-black/5">
        <NavLink to="/dashboard" className={linkClass}>
          <Home className="h-5 w-5" />
          Home
        </NavLink>
        <NavLink to="/progress" className={linkClass}>
          <TrendingUp className="h-5 w-5" />
          Progress
        </NavLink>
        <div className="w-28" aria-hidden="true" />
        <NavLink to="/profile" className={linkClass}>
          <User className="h-5 w-5" />
          Profile
        </NavLink>
        <button
          type="button"
          onClick={() => setLogOpen(true)}
          className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-white shadow-lg shadow-ink/30 transition-transform active:scale-95"
          aria-label="Log a meal"
        >
          <Plus className="h-7 w-7" />
        </button>
      </div>
    </nav>
  )
}
