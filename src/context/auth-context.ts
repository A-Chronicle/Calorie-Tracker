import { createContext } from 'react'

export interface User {
  name: string
  email: string
}

export interface AuthContextType {
  user: User | null
  ready: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)
