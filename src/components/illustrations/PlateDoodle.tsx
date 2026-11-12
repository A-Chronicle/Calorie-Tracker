interface PlateDoodleProps {
  className?: string
}

export default function PlateDoodle({ className = '' }: PlateDoodleProps) {
  return (
    <svg viewBox="0 0 220 160" fill="none" className={className} aria-hidden="true">
      <ellipse cx="110" cy="98" rx="70" ry="42" stroke="currentColor" strokeWidth="3" />
      <ellipse cx="110" cy="98" rx="50" ry="28" stroke="currentColor" strokeWidth="2.5" opacity="0.65" />

      <path
        d="M34 132V96M26 96V70M34 96V70M42 96V70M26 70v8c0 7 16 7 16 0v-8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M190 132V82c0-9 7-15 9-22M190 92c4-1 7-4 9-8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path d="M96 40c-6-8 6-12 0-20M110 36c-6-8 6-12 0-20M124 40c-6-8 6-12 0-20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />

      <path d="M110 78c-16 0-26 8-26 8s10 8 26 8 26-8 26-8-10-8-26-8Z" stroke="currentColor" strokeWidth="2.5" opacity="0.6" />
      <path d="M98 84c3-3 9-3 12 0s9 3 12 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

      <path d="M188 26l3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8Z" fill="currentColor" opacity="0.55" />
    </svg>
  )
}
