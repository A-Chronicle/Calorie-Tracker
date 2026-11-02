import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import AuthLayout, { AuthButton, AuthError, AuthLabel } from '../components/AuthLayout'

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
    <AuthLayout
      title={
        <>
          Choose a <span className="brand-text">new password</span>
        </>
      }
    >
      {message ? (
        <div className="space-y-4">
          <div className="rounded-3xl border border-mint/30 bg-mint/10 p-5 text-sm">
            <p className="font-bold text-mint">All set</p>
            <p className="mt-1 text-white/70">{message}</p>
          </div>
          <Link
            to="/signin"
            className="brand-gradient block w-full rounded-2xl py-3.5 text-center text-sm font-bold text-white shadow-xl shadow-coral/25"
          >
            Go to sign in
          </Link>
        </div>
      ) : !token ? (
        <div className="space-y-4">
          <AuthError>This link is missing its reset code. Please use the link from your email.</AuthError>
          <Link to="/forgot" className="block text-center text-sm font-bold text-white hover:text-coral">
            Request a new link
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <AuthError>{error}</AuthError> : null}

          <AuthLabel label="New password">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field text-sm normal-case tracking-normal"
              placeholder="At least 8 characters"
            />
          </AuthLabel>

          <AuthLabel label="Confirm password">
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="field text-sm normal-case tracking-normal"
              placeholder="Type it again"
            />
          </AuthLabel>

          <AuthButton loading={loading} loadingText="Saving…">
            Save new password
          </AuthButton>
        </form>
      )}
    </AuthLayout>
  )
}
