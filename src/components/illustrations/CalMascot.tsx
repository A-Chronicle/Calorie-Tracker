import { useId } from 'react'

type Mood = 'sleepy' | 'happy' | 'cheer' | 'neutral'

interface CalMascotProps {
  mood?: Mood
  size?: number
  className?: string
}

const INK = '#2a2521'

export default function CalMascot({ mood = 'happy', size = 72, className = '' }: CalMascotProps) {
  const id = useId()

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={`Cal the mascot, feeling ${mood}`}
      className={className}
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d08a70" />
          <stop offset="100%" stopColor="#a85f4c" />
        </linearGradient>
      </defs>

      <ellipse cx="60" cy="111" rx="26" ry="5" fill="#000" opacity="0.22" />

      <path
        d="M60 40C60 26 50 16 38 15c0 13 9 23 22 25Z"
        fill="#8fb59b"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M60 40c0-14 10-24 22-25 0 13-9 23-22 25Z"
        fill="#a7c4aa"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M60 43v-9" stroke={INK} strokeWidth="3" strokeLinecap="round" />

      <path
        d="M60 38c26 0 40 18 40 38 0 21-17 32-40 32S20 97 20 76c0-20 14-38 40-38Z"
        fill={`url(#${id}-body)`}
        stroke={INK}
        strokeWidth="3"
      />

      <ellipse cx="38" cy="80" rx="7" ry="4" fill="#e8a58c" opacity="0.7" />
      <ellipse cx="82" cy="80" rx="7" ry="4" fill="#e8a58c" opacity="0.7" />

      {mood === 'sleepy' ? (
        <>
          <path d="M38 70c4 4 9 4 13 0" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M69 70c4 4 9 4 13 0" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M54 88c4 3 8 3 12 0" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
          <text x="92" y="46" fontFamily="Caveat, cursive" fontSize="16" fill={INK} opacity="0.55">
            z
          </text>
        </>
      ) : null}

      {mood === 'happy' ? (
        <>
          <path d="M38 73c4-7 9-7 13 0" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M69 73c4-7 9-7 13 0" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M48 84c6 10 18 10 24 0" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      ) : null}

      {mood === 'cheer' ? (
        <>
          <circle cx="45" cy="72" r="4.5" fill={INK} />
          <circle cx="75" cy="72" r="4.5" fill={INK} />
          <ellipse cx="60" cy="89" rx="12" ry="9" fill={INK} />
          <ellipse cx="60" cy="92" rx="7" ry="4" fill="#e8a58c" />
          <path d="M20 78c-8-4-12-11-12-18" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M100 78c8-4 12-11 12-18" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      ) : null}

      {mood === 'neutral' ? (
        <>
          <circle cx="45" cy="72" r="4" fill={INK} />
          <circle cx="75" cy="72" r="4" fill={INK} />
          <path d="M52 88h16" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </>
      ) : null}

      {mood !== 'cheer' ? (
        <>
          <path d="M22 82c-7-1-12-6-14-12" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M98 82c7-1 12-6 14-12" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      ) : null}
    </svg>
  )
}
