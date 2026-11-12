export function ScribbleUnderline({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 12" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 8c22-6 44-6 64-2 16 3 32 2 52-4"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2Z" fill="currentColor" />
    </svg>
  )
}

export function Steam({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 40" fill="none" className={className} aria-hidden="true">
      <path d="M12 36c-7-7 7-10 0-18M12 18C5 11 19 8 12 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
