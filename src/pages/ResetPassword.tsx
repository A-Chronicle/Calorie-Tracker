import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const data = await api<{ message: string }>('/auth/reset', {
        method: 'POST',
        body: { token, password },
      })
      setMessage(data.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-lg font-extrabold text-white shadow-xl">
          C
        </div>
        <p className="mt-3 text-center text-sm font-bold tracking-[0.3em] text-neutral-500">CAL-c</p>
        <h1 className="mt-4 text-center text-3xl font-bold tracking-tight">
          Choose a <span>new password</span>
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        {message ? (
          <div className="space-y-4">
            <div className="rounded-2xl bg-mint/15 px-4 py-4 text-sm text-ink">
              <p className="font-semibold">All set</p>
              <p className="mt-1 text-neutral-600">{message}</p>
            </div>
            <Link
              to="/signin"
              className="block w-full rounded-2xl bg-ink py-3 text-center text-sm font-semibold text-white shadow-lg"
            >
              Go to sign in
            </Link>
          </div>
        ) : !token ? (
          <div className="space-y-4">
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              This link is missing its reset code. Please use the link from your email.
            </div>
            <Link to="/forgot" className="block text-center text-sm font-semibold text-ink">
              Request a new link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

            <label className="block text-sm font-medium">
              New password
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-2xl bg-white px-3 py-2.5 outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-ink/30"
                placeholder="At least 8 characters"
              />
            </label>

            <label className="block text-sm font-medium">
              Confirm password
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 block w-full rounded-2xl bg-white px-3 py-2.5 outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-ink/30"
                placeholder="Type it again"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-ink py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-50"
            >
              {loading ? 'Saving…' : 'Save new password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
