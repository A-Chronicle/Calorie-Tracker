import { useId } from 'react'

export type KoalaMood = 'sleepy' | 'happy' | 'cheer' | 'nudge'

interface KoalaMascotProps {
  mood?: KoalaMood
  size?: number
  className?: string
}

const INK = '#2a2521'
const FUR = '#b9b2a6'
const FUR_LIGHT = '#cfc8bb'
const FACE = '#e9e5dd'
const SAGE = '#8fb59b'

export default function KoalaMascot({ mood = 'happy', size = 72, className = '' }: KoalaMascotProps) {
  const id = useId()

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={`Koa the koala, feeling ${mood}`}
      className={className}
    >
      <defs>
        <linearGradient id={`${id}-fur`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={FUR_LIGHT} />
          <stop offset="100%" stopColor={FUR} />
        </linearGradient>
      </defs>

      <ellipse cx="60" cy="112" rx="28" ry="5" fill="#000" opacity="0.2" />

      <circle cx="30" cy="40" r="19" fill={`url(#${id}-fur)`} stroke={INK} strokeWidth="3" />
      <circle cx="90" cy="40" r="19" fill={`url(#${id}-fur)`} stroke={INK} strokeWidth="3" />
      <circle cx="30" cy="40" r="10" fill={FACE} />
      <circle cx="90" cy="40" r="10" fill={FACE} />

      <path
        d="M34 92c-7 8-5 17 6 19 8 1 14-5 14-11l6-14-10-7-16 13Z"
        fill={FUR}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M86 92c7 8 5 17-6 19-8 1-14-5-14-11l-6-14 10-7 16 13Z"
        fill={FUR}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      <ellipse cx="60" cy="58" rx="38" ry="34" fill={`url(#${id}-fur)`} stroke={INK} strokeWidth="3" />
      <ellipse cx="60" cy="67" rx="25" ry="22" fill={FACE} />
      <ellipse cx="60" cy="62" rx="8.5" ry="11" fill={INK} />

      {mood === 'sleepy' ? (
        <>
          <path d="M40 54c3 4 7 4 10 0" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M70 54c3 4 7 4 10 0" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M54 80c4 2 8 2 12 0" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
          <text x="94" y="26" fontFamily="Caveat, cursive" fontSize="17" fill={INK} opacity="0.5">
            z
          </text>
        </>
      ) : null}

      {mood === 'happy' ? (
        <>
          <path d="M40 54c3-4 7-4 10 0" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M70 54c3-4 7-4 10 0" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M54 81c4 4 8 4 12 0" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      ) : null}

      {mood === 'cheer' ? (
        <>
          <circle cx="45" cy="53" r="4" fill={INK} />
          <circle cx="75" cy="53" r="4" fill={INK} />
          <circle cx="46.5" cy="51.5" r="1.3" fill={FACE} />
          <circle cx="76.5" cy="51.5" r="1.3" fill={FACE} />
          <path d="M51 79c4 8 14 8 18 0" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="38" cy="68" rx="5" ry="3" fill="#e8a58c" opacity="0.55" />
          <ellipse cx="82" cy="68" rx="5" ry="3" fill="#e8a58c" opacity="0.55" />
        </>
      ) : null}

      {mood === 'nudge' ? (
        <>
          <circle cx="45" cy="54" r="3.5" fill={INK} />
          <circle cx="75" cy="54" r="3.5" fill={INK} />
          <path d="M39 46c4-3 8-3 11 0" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M70 46c3-3 7-3 11 0" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M55 82c3-2 7-2 10 0" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      ) : null}

      <path d="M100 98c-7-8-5-17 4-21 2 9 1 16-4 21Z" fill={SAGE} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M100 98c2-6 2-13 4-20" stroke={INK} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
