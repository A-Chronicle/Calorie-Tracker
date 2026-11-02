import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import AuthLayout, { AuthButton, AuthError, AuthLabel } from '../components/AuthLayout'

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
    <AuthLayout
      title={
        <>
          Forgot your <span className="brand-text">password?</span>
        </>
      }
      subtitle="Enter your email and we'll send you a link to choose a new one."
    >
      {message ? (
        <div className="rounded-3xl border border-mint/30 bg-mint/10 p-5 text-sm">
          <p className="font-bold text-mint">Check your inbox</p>
          <p className="mt-1 text-white/70">{message}</p>
          {devNote ? <p className="mt-4 rounded-2xl bg-white/5 p-3 text-xs font-medium text-amber">{devNote}</p> : null}
          {devLink ? (
            <div className="mt-4 rounded-2xl bg-white/5 p-3 text-xs text-white/60">
              <p className="font-semibold text-amber">Local testing only: no email is sent in development.</p>
              <a href={devLink} className="mt-2 block break-all font-semibold text-white underline">
                Open reset link
              </a>
            </div>
          ) : null}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <AuthError>{error}</AuthError> : null}

          <AuthLabel label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field text-sm normal-case tracking-normal"
              placeholder="you@example.com"
            />
          </AuthLabel>

          <AuthButton loading={loading} loadingText="Sending…">
            Send reset link
          </AuthButton>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-white/50">
        Remembered it?{' '}
        <Link to="/signin" className="font-bold text-white hover:text-coral">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
