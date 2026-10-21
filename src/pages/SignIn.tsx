import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl brand-gradient text-lg font-extrabold text-white shadow-xl shadow-coral/40">C</div>
        <p className="mt-3 text-center text-sm font-bold tracking-[0.3em] text-neutral-500">CAL-c</p>
        <h1 className="mt-3 text-center text-3xl font-bold tracking-tight">Snap. Log. <span className="brand-text">Stay on track.</span></h1>
        <p className="mt-2 text-center text-sm text-neutral-500">Sign in to continue</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : null}

          <label className="block text-sm font-medium">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-2xl bg-white px-3 py-2.5 outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-coral/60"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm font-medium">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-2xl bg-white px-3 py-2.5 outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-coral/60"
              placeholder="Enter your password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl brand-gradient py-3 shadow-lg shadow-coral/25 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-neutral-950">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
