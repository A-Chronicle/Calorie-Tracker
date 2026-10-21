import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [devLink, setDevLink] = useState<string>()
  const [devNote, setDevNote] = useState<string>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api<{ message: string; devLink?: string; devNote?: string }>('/auth/forgot', { method: 'POST', body: { email } })
      setMessage(data.message)
      setDevLink(data.devLink)
      setDevNote(data.devNote)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl brand-gradient text-lg font-extrabold text-white shadow-xl shadow-coral/40">
          C
        </div>
        <p className="mt-3 text-center text-sm font-bold tracking-[0.3em] text-neutral-500">CAL-c</p>
        <h1 className="mt-4 text-center text-3xl font-bold tracking-tight">
          Forgot your <span className="brand-text">password?</span>
        </h1>
        <p className="mt-2 text-center text-sm text-neutral-500">
          Enter your email and we&apos;ll send you a link to choose a new one.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        {message ? (
          <div className="rounded-2xl bg-mint/15 px-4 py-4 text-sm text-ink">
            <p className="font-semibold">Check your inbox</p>
            <p className="mt-1 text-neutral-600">{message}</p>
            {devNote ? <p className="mt-4 rounded-xl bg-white p-3 text-xs font-medium text-amber">{devNote}</p> : null}
            {devLink ? (
              <div className="mt-4 rounded-xl bg-white p-3 text-xs text-neutral-600">
                <p className="font-semibold text-amber">Local testing only: no email is sent in development.</p>
                <a href={devLink} className="mt-2 block break-all font-medium text-ink underline">
                  Open reset link
                </a>
              </div>
            ) : null}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl brand-gradient py-3 text-sm font-semibold text-white shadow-lg shadow-coral/25 disabled:opacity-50"
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-neutral-500">
          Remembered it?{' '}
          <Link to="/signin" className="font-semibold text-ink">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
