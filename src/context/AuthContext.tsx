import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext, type User } from './auth-context'
import { api } from '../lib/api'

// The session lives in an HttpOnly cookie set by the server. The browser never sees the token,
// so this context only mirrors who the server says is signed in.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    api<{ user: User | null }>('/auth/me')
      .then((data) => {
        if (active) setUser(data.user)
      })
      .catch(() => {
        if (active) setUser(null)
      })
      .finally(() => {
        if (active) setReady(true)
      })
    return () => {
      active = false
    }
  }, [])

  async function signIn(email: string, password: string) {
    const data = await api<{ user: User }>('/auth/signin', { method: 'POST', body: { email, password } })
    setUser(data.user)
  }

  async function signUp(name: string, email: string, password: string) {
    const data = await api<{ user: User }>('/auth/signup', {
      method: 'POST',
      body: { name, email, password },
    })
    setUser(data.user)
  }

  async function signOut() {
    try {
      await api('/auth/signout', { method: 'POST' })
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, ready, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
