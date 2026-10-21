import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/useAuth'
import AppShell from './components/AppShell'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Setup from './pages/Setup'
import Dashboard from './pages/Dashboard'
import Progress from './pages/Progress'
import Profile from './pages/Profile'

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth()
  if (!ready) return null
  if (user) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <div className="min-h-screen text-ink">
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route path="/setup" element={<Setup />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </div>
  )
}
