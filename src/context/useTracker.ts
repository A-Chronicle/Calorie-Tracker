import { useContext } from 'react'
import { TrackerContext } from './tracker-context'

export function useTracker() {
  const ctx = useContext(TrackerContext)
  if (!ctx) throw new Error('useTracker must be used within TrackerProvider')
  return ctx
}
