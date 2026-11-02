import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import AuthLayout, { AuthButton, AuthError, AuthLabel } from '../components/AuthLayout'

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
    <AuthLayout
      title={
        <>
          Snap. Log.
          <br />
          <span className="brand-text">Stay on track.</span>
        </>
      }
      subtitle="Welcome back. Your streak is waiting."
    >
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

        <AuthLabel label="Password">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field text-sm normal-case tracking-normal"
            placeholder="Enter your password"
          />
        </AuthLabel>

        <div className="text-right">
          <Link to="/forgot" className="text-sm font-medium text-white/50 transition-colors hover:text-coral">
            Forgot password?
          </Link>
        </div>

        <AuthButton loading={loading} loadingText="Signing in…">
          Sign in
        </AuthButton>
      </form>

      <p className="mt-8 text-center text-sm text-white/50">
        New here?{' '}
        <Link to="/signup" className="font-bold text-white hover:text-coral">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}
