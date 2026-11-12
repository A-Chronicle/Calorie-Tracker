import type { MealType } from '../../types'

const INK = '#2a2521'
const CREAM = '#e9e5dd'
const CLAY = '#c47b63'
const SAND = '#c8a878'
const SAGE = '#8fb59b'
const SAGE_LIGHT = '#a7c4aa'

interface MealIconProps {
  type: MealType
  size?: number
  className?: string
}

export default function MealIcon({ type, size = 28, className = '' }: MealIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} aria-hidden="true">
      {type === 'breakfast' ? (
        <>
          <circle cx="20" cy="21" r="13" fill={CREAM} stroke={INK} strokeWidth="2" />
          <circle cx="20" cy="21" r="6" fill={SAND} stroke={INK} strokeWidth="2" />
          <path d="M14 13c-2-2 1-4 0-6M20 11c-2-2 1-4 0-6" stroke={INK} strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
        </>
      ) : null}

      {type === 'lunch' ? (
        <>
          <path d="M7 20h26c0 8.5-6 13-13 13S7 28.5 7 20Z" fill={SAGE} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <path d="M7 20h26" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          <path d="M20 18c-3-6 4-9 6-12 3 5 1 10-6 12Z" fill={SAGE_LIGHT} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="14" cy="26" r="2" fill={CLAY} />
          <circle cx="24" cy="27" r="2" fill={SAND} />
        </>
      ) : null}

      {type === 'dinner' ? (
        <>
          <path d="M7 21h26c0 8.5-6 13-13 13S7 29.5 7 21Z" fill={CLAY} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <path d="M7 21h26" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          <path d="M15 14c-2-3 2-5 0-8M21 13c-2-3 2-5 0-8M27 14c-2-3 2-5 0-8" stroke={INK} strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
        </>
      ) : null}

      {type === 'snack' ? (
        <>
          <path d="M20 14c-8 0-12 6-12 12s6 10 12 10 12-4 12-10-4-12-12-12Z" fill={CLAY} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <path d="M20 14c0-4 2-6 5-7" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          <path d="M20 16c-1-4-4-6-7-6 0 4 3 6 7 6Z" fill={SAGE} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
        </>
      ) : null}
    </svg>
  )
}
