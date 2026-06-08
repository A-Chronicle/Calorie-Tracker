import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface User {
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('calorie-tracker-user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  async function signIn(email: string, password: string) {
    const stored = localStorage.getItem('calorie-tracker-users')
    const users: Record<string, { name: string; password: string }> = stored ? JSON.parse(stored) : {}
    const record = users[email]
    if (!record || record.password !== password) {
      throw new Error('Invalid email or password')
    }
    const u = { name: record.name, email }
    localStorage.setItem('calorie-tracker-user', JSON.stringify(u))
    setUser(u)
  }

  async function signUp(name: string, email: string, password: string) {
    const stored = localStorage.getItem('calorie-tracker-users')
    const users: Record<string, { name: string; password: string }> = stored ? JSON.parse(stored) : {}
    if (users[email]) {
      throw new Error('An account with this email already exists')
    }
    users[email] = { name, password }
    localStorage.setItem('calorie-tracker-users', JSON.stringify(users))
    const u = { name, email }
    localStorage.setItem('calorie-tracker-user', JSON.stringify(u))
    setUser(u)
  }

  function signOut() {
    localStorage.removeItem('calorie-tracker-user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
