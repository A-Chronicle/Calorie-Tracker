import { Home, Plus, TrendingUp, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useTracker } from '../context/useTracker'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex w-20 flex-col items-center gap-0.5 rounded-full py-1.5 text-[11px] font-semibold transition-colors ${
    isActive ? 'text-white' : 'text-white/40 hover:text-white/80'
  }`

export default function BottomNav() {
  const { setLogOpen } = useTracker()

  return (
    <nav className="fixed inset-x-0 bottom-5 z-30 px-5">
      <div className="relative mx-auto flex max-w-sm items-center justify-around rounded-full border border-white/10 bg-[#14141d]/85 px-3 py-2.5 shadow-2xl shadow-black/60 backdrop-blur-xl">
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
          className="brand-gradient absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#0b0b12] text-white shadow-[0_10px_30px_-4px_rgba(255,90,78,0.7)] transition-transform hover:scale-105 active:scale-95"
          aria-label="Log a meal"
        >
          <Plus className="h-8 w-8" strokeWidth={2.6} />
        </button>
      </div>
    </nav>
  )
}
