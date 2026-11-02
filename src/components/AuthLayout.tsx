import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface AuthLayoutProps {
  title: ReactNode
  subtitle?: string
  children: ReactNode
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-coral/30 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-plum/25 blur-[90px]" />

      <div className="relative mx-auto w-full max-w-sm animate-rise">
        <Link to="/" className="mx-auto flex w-fit items-center gap-2.5">
          <div className="brand-gradient flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-black text-white shadow-lg shadow-coral/30">
            C
          </div>
          <span className="text-lg font-extrabold tracking-tight">CAL-c</span>
        </Link>

        <h1 className="mt-8 text-center text-4xl font-black leading-[1.05] tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-3 text-center text-sm text-white/50">{subtitle}</p> : null}

        <div className="mt-8">{children}</div>
      </div>
    </div>
  )
}

export function AuthError({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral">{children}</div>
}

export function AuthButton({ loading, loadingText, children }: { loading?: boolean; loadingText: string; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="brand-gradient w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-xl shadow-coral/25 transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
    >
      {loading ? loadingText : children}
    </button>
  )
}

export function AuthLabel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wide text-white/50">
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  )
}
