const INK = '#2a2521'

const items = [
  {
    label: 'tomato',
    node: (
      <>
        <circle cx="24" cy="27" r="13" fill="#c47b63" stroke={INK} strokeWidth="2.5" />
        <path
          d="M24 14c-2-5-8-6-8-6 1 5 4 7 8 8 4-1 7-3 8-8 0 0-6 1-8 6Z"
          fill="#8fb59b"
          stroke={INK}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M24 16v5" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: 'egg',
    node: (
      <>
        <path
          d="M24 9c7 0 12 9 12 17S31 39 24 39 12 34 12 26 17 9 24 9Z"
          fill="#e9e5dd"
          stroke={INK}
          strokeWidth="2.5"
        />
        <circle cx="24" cy="27" r="6" fill="#c8a878" />
      </>
    ),
  },
  {
    label: 'leaf',
    node: (
      <>
        <path d="M12 36C12 21 23 10 38 10c0 15-11 26-26 26Z" fill="#8fb59b" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M15 33c8-8 21-19 27-25" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: 'lemon',
    node: (
      <>
        <ellipse cx="24" cy="25" rx="13" ry="10" fill="#c8a878" stroke={INK} strokeWidth="2.5" />
        <path d="M11 25c-2-2-2 2 0 0M37 25c2-2 2 2 0 0" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <path d="M19 25h10" stroke={INK} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      </>
    ),
  },
  {
    label: 'bread',
    node: (
      <>
        <path
          d="M12 31c-4-11 3-19 12-19s16 8 12 19c-1 3-5 4-8 4H20c-4 0-7-1-8-4Z"
          fill="#d8b98a"
          stroke={INK}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M18 22h12M18 27h12" stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </>
    ),
  },
]

export default function IngredientsRow({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-1 ${className}`} aria-hidden="true">
      {items.map((item, index) => (
        <svg
          key={item.label}
          viewBox="0 0 48 48"
          className="h-9 w-9 animate-float"
          style={{ animationDelay: `${index * 0.35}s`, animationDuration: `${5 + index * 0.4}s` }}
        >
          {item.node}
        </svg>
      ))}
    </div>
  )
}
