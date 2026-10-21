import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      await signUp(name, email, password)
      navigate('/setup')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          CAL-c
        </p>
        <h1 className="mt-3 text-center text-3xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-2 text-center text-sm text-neutral-500">Photo meals. Daily ring. Real macros.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : null}

          <label className="block text-sm font-medium">
            Full name
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-2xl bg-white px-3 py-2.5 outline-none ring-1 ring-black/5"
              placeholder="Anshika"
            />
          </label>

          <label className="block text-sm font-medium">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-2xl bg-white px-3 py-2.5 outline-none ring-1 ring-black/5"
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
              className="mt-1 block w-full rounded-2xl bg-white px-3 py-2.5 outline-none ring-1 ring-black/5"
              placeholder="At least 8 characters"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-neutral-950 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <Link to="/signin" className="font-semibold text-neutral-950">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
