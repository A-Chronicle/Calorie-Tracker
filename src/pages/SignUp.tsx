import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import AuthLayout, { AuthButton, AuthError, AuthLabel } from '../components/AuthLayout'

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
    <AuthLayout
      title={
        <>
          Let&apos;s get you
          <br />
          <span className="brand-text">started.</span>
        </>
      }
      subtitle="Photo meals. Daily ring. Real macros."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? <AuthError>{error}</AuthError> : null}

        <AuthLabel label="Full name">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field text-sm normal-case tracking-normal"
            placeholder="Anshika"
          />
        </AuthLabel>

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
            placeholder="At least 8 characters"
          />
        </AuthLabel>

        <AuthButton loading={loading} loadingText="Creating account…">
          Sign up
        </AuthButton>
      </form>

      <p className="mt-8 text-center text-sm text-white/50">
        Already have an account?{' '}
        <Link to="/signin" className="font-bold text-white hover:text-coral">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
