import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { Heart, Volume2, VolumeX } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { useTracker } from '../context/useTracker'
import { localDateKey, shiftDateKey } from '../lib/dates'
import PixelKoala, { type KoalaFrame } from './illustrations/PixelKoala'

type Moment = 'idle' | 'logged' | 'within' | 'exact' | 'milestone' | 'over'
type SoundKind = 'chirp' | 'happy' | 'celebrate' | 'nudge'

const SIZE = 80
const MARGIN = 12
const BOTTOM_CLEARANCE = 104
const MILESTONES = [3, 7, 14, 30, 60, 100, 365]
const CONFETTI_COLORS = ['#c47b63', '#c8a878', '#8fb59b', '#a092bd', '#e9e5dd']

const PET_LINES = [
  'Koo-koo! That tickles.',
  "You're doing great.",
  'Mmm, eucalyptus.',
  'I believe in you.',
  'One meal at a time.',
  'Tap me anytime for a pep talk.',
]

const OVER_LINES = [
  "It's okay. Tomorrow's a fresh page.",
  "One day doesn't define you.",
  'Water, rest, and we go again.',
]

const CONFETTI_BURST = Array.from({ length: 18 }, (_, index) => {
  const angle = (index / 18) * Math.PI * 2
  const distance = 46 + (index % 5) * 13
  return {
    dx: Math.cos(angle) * distance,
    dy: Math.sin(angle) * distance - 10,
    rot: (index % 2 === 0 ? 1 : -1) * (120 + index * 17),
    delay: (index % 6) * 0.035,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
  }
})

const HEART_BURST = [
  { dx: -20, delay: 0 },
  { dx: 2, delay: 0.08 },
  { dx: 22, delay: 0.16 },
]

interface Point {
  x: number
  y: number
}

function bounds(width: number, height: number) {
  return {
    minX: MARGIN,
    maxX: Math.max(MARGIN, width - SIZE - MARGIN),
    minY: MARGIN,
    maxY: Math.max(MARGIN, height - SIZE - BOTTOM_CLEARANCE),
  }
}

function viewportSize() {
  if (typeof window === 'undefined') return { w: 1024, h: 768 }
  return { w: window.innerWidth, h: window.innerHeight }
}

function randomPoint(): Point {
  const { minX, maxX, minY, maxY } = bounds(window.innerWidth, window.innerHeight)
  return {
    x: minX + Math.random() * (maxX - minX),
    y: minY + Math.random() * (maxY - minY),
  }
}

function messageFor(moment: Moment, streak: number): string {
  switch (moment) {
    case 'milestone':
      return `${streak} days in a row. You're unstoppable!`
    case 'exact':
      return 'Right on your goal. Beautifully balanced.'
    case 'within':
      return 'You stayed within your goal today. That is a win.'
    case 'over':
      return "A little over today — no drama. Tomorrow's a fresh page."
    case 'logged':
      return "Nice start. I'm right here cheering for you."
    default:
      return 'Nothing logged yet. Shall we find something tasty?'
  }
}

function useKoaSound(enabled: boolean) {
  const contextRef = useRef<AudioContext | null>(null)
  const unlocked = useRef(false)

  const getContext = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null
    if (!contextRef.current) {
      try {
        contextRef.current = new window.AudioContext()
      } catch {
        return null
      }
    }
    if (contextRef.current.state === 'suspended') {
      void contextRef.current.resume().catch(() => undefined)
    }
    return contextRef.current
  }, [])

  const unlock = useCallback(() => {
    unlocked.current = true
    getContext()
  }, [getContext])

  const play = useCallback(
    (kind: SoundKind, force = false) => {
      if (!enabled && !force) return
      if (!unlocked.current && !force) return
      const context = getContext()
      if (!context) return

      const notes: Array<[number, number, number]> =
        kind === 'chirp'
          ? [
              [880, 0, 0.08],
              [1245, 0.09, 0.12],
            ]
          : kind === 'happy'
            ? [
                [523.25, 0, 0.12],
                [659.25, 0.11, 0.12],
                [783.99, 0.22, 0.2],
              ]
            : kind === 'celebrate'
              ? [
                  [523.25, 0, 0.12],
                  [659.25, 0.1, 0.12],
                  [783.99, 0.2, 0.12],
                  [1046.5, 0.3, 0.26],
                ]
              : [
                  [349.23, 0, 0.16],
                  [261.63, 0.14, 0.22],
                ]

      const volume = kind === 'celebrate' ? 0.075 : kind === 'nudge' ? 0.05 : 0.06
      const start = context.currentTime + 0.01

      notes.forEach(([frequency, offset, duration]) => {
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        const at = start + offset

        oscillator.type = kind === 'nudge' ? 'triangle' : 'sine'
        oscillator.frequency.setValueAtTime(frequency, at)
        oscillator.frequency.exponentialRampToValueAtTime(
          frequency * (kind === 'nudge' ? 0.9 : 1.05),
          at + duration,
        )
        gain.gain.setValueAtTime(0.0001, at)
        gain.gain.exponentialRampToValueAtTime(volume, at + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, at + duration)
        oscillator.connect(gain)
        gain.connect(context.destination)
        oscillator.start(at)
        oscillator.stop(at + duration + 0.04)
      })
    },
    [enabled, getContext],
  )

  useEffect(() => {
    return () => {
      if (contextRef.current) {
        void contextRef.current.close().catch(() => undefined)
        contextRef.current = null
      }
    }
  }, [])

  return { play, unlock }
}

export default function KoaRoamer() {
  const { user } = useAuth()
  const { profile, meals, dayMeals, totals, selectedDate } = useTracker()
  const email = user?.email ?? 'guest'

  const [viewport, setViewport] = useState(viewportSize)
  const [pos, setPos] = useState<Point>(() => {
    const { maxX, maxY } = bounds(viewport.w, viewport.h)
    return { x: maxX, y: maxY }
  })
  const [facing, setFacing] = useState<1 | -1>(-1)
  const [moving, setMoving] = useState(false)
  const [walkStep, setWalkStep] = useState<'walk1' | 'walk2'>('walk1')
  const [travel, setTravel] = useState(2200)
  const [paused, setPaused] = useState(false)
  const [napping, setNapping] = useState(false)
  const [perched, setPerched] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [bubble, setBubble] = useState<string | null>(null)
  const [celebrate, setCelebrate] = useState(false)
  const [showHearts, setShowHearts] = useState(false)
  const [burst, setBurst] = useState(0)
  const [heartBurst, setHeartBurst] = useState(0)
  const [soundOn, setSoundOn] = useState(() => {
    if (typeof window === 'undefined') return true
    try {
      return localStorage.getItem('koa:sound') !== 'off'
    } catch {
      return true
    }
  })
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const rootRef = useRef<HTMLDivElement | null>(null)
  const posRef = useRef(pos)
  const bubbleTimer = useRef<number | null>(null)
  const heartsTimer = useRef<number | null>(null)
  const celebrateTimer = useRef<number | null>(null)
  const napTimer = useRef<number | null>(null)
  const perchTimer = useRef<number | null>(null)
  const lastPet = useRef(0)
  const lastSpoke = useRef(0)
  const moves = useRef(0)
  const drag = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  })

  const { play, unlock } = useKoaSound(soundOn)

  const streak = useMemo(() => {
    const logged = new Set(meals.map((m) => localDateKey(new Date(m.loggedAt))))
    let count = 0
    let cursor = selectedDate
    while (logged.has(cursor)) {
      count += 1
      cursor = shiftDateKey(cursor, -1)
    }
    return count
  }, [meals, selectedDate])

  const moment = useMemo<Moment>(() => {
    if (!profile) return 'idle'
    if (dayMeals.length === 0) return 'idle'
    if (MILESTONES.includes(streak)) return 'milestone'

    const goal = profile.calorieGoal
    const closeToGoal = Math.abs(totals.calories - goal) <= Math.max(30, goal * 0.02)
    if (closeToGoal) return 'exact'
    if (totals.calories <= goal && dayMeals.length >= 2) return 'within'
    if (totals.calories > goal) return 'over'
    return 'logged'
  }, [profile, dayMeals.length, totals.calories, streak])

  const celebrating = moment === 'milestone' || moment === 'exact' || moment === 'within'
  const celebrationText = messageFor(moment, streak)

  const wake = useCallback(() => {
    if (napTimer.current) {
      window.clearTimeout(napTimer.current)
      napTimer.current = null
    }
    setNapping(false)
  }, [])

  const speak = useCallback(
    (text: string, duration = 3800) => {
      wake()
      setBubble(text)
      setPaused(true)
      lastSpoke.current = Date.now()
      if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current)
      bubbleTimer.current = window.setTimeout(() => {
        setBubble(null)
        setPaused(false)
      }, duration)
    },
    [wake],
  )

  const nap = useCallback(() => {
    if (napTimer.current) window.clearTimeout(napTimer.current)
    if (perchTimer.current) {
      window.clearTimeout(perchTimer.current)
      perchTimer.current = null
    }
    setPerched(false)
    setNapping(true)
    napTimer.current = window.setTimeout(() => {
      napTimer.current = null
      setNapping(false)
      speak('*yawn*... five more minutes?', 2600)
    }, 7000 + Math.random() * 4000)
  }, [speak])

  const perchPoint = useCallback((): Point | null => {
    const target = document.querySelector<HTMLElement>('[data-koa-perch]')
    if (!target) return null
    const rect = target.getBoundingClientRect()
    const { minX, maxX } = bounds(window.innerWidth, window.innerHeight)
    return {
      x: Math.min(Math.max(rect.left + rect.width / 2 - SIZE / 2, minX), maxX),
      y: Math.min(
        Math.max(rect.top - SIZE + 10, MARGIN),
        Math.max(MARGIN, window.innerHeight - SIZE - MARGIN),
      ),
    }
  }, [])

  const perch = useCallback((): boolean => {
    const target = perchPoint()
    if (!target) return false

    const from = posRef.current
    const dx = target.x - from.x
    const duration = Math.round(
      Math.min(5200, Math.max(1200, Math.hypot(dx, target.y - from.y) * 11)),
    )

    if (Math.abs(dx) > 6) setFacing(dx < 0 ? -1 : 1)
    posRef.current = target
    setTravel(duration)
    setPos(target)
    setMoving(true)
    setPerched(true)

    if (perchTimer.current) window.clearTimeout(perchTimer.current)
    perchTimer.current = window.setTimeout(() => {
      perchTimer.current = null
      setPerched(false)
    }, duration + 5200)

    return true
  }, [perchPoint])

  useEffect(() => {
    posRef.current = pos
  }, [pos])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const onResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setViewport({ w: width, h: height })
      setPos((current) => {
        const { minX, maxX, minY, maxY } = bounds(width, height)
        return {
          x: Math.min(Math.max(current.x, minX), maxX),
          y: Math.min(Math.max(current.y, minY), maxY),
        }
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!soundOn) return
    const onPointerDown = () => {
      unlock()
    }
    window.addEventListener('pointerdown', onPointerDown, { once: true })
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [soundOn, unlock])

  useEffect(() => {
    if (paused || reducedMotion || moving || napping || perched || dragging) return

    const timer = window.setTimeout(() => {
      if (napping || perched || dragging) return

      moves.current += 1
      const action = moves.current
      if (action % 2 === 0) play('chirp')

      if (action % 4 === 0 && perch()) return
      if (action % 5 === 0 && Math.random() < 0.45) {
        nap()
        return
      }

      const from = posRef.current
      const target = randomPoint()
      const dx = target.x - from.x
      const distance = Math.hypot(dx, target.y - from.y)
      if (Math.abs(dx) > 6) setFacing(dx < 0 ? -1 : 1)
      setTravel(Math.round(Math.min(5200, Math.max(1500, distance * 11))))
      posRef.current = target
      setPos(target)
      setMoving(true)
    }, 900 + Math.random() * 2200)

    return () => window.clearTimeout(timer)
  }, [paused, reducedMotion, moving, napping, perched, dragging, perch, nap, play])

  useEffect(() => {
    if (!moving || reducedMotion) return
    const timer = window.setInterval(() => {
      setWalkStep((step) => (step === 'walk1' ? 'walk2' : 'walk1'))
    }, 260)
    return () => window.clearInterval(timer)
  }, [moving, reducedMotion])

  useEffect(() => {
    if (!moving) return
    const timer = window.setTimeout(() => setMoving(false), travel + 120)
    return () => window.clearTimeout(timer)
  }, [moving, travel])

  useEffect(() => {
    if (!celebrating) return
    const key = `koa:${email}:${selectedDate}:${moment}`

    const start = window.setTimeout(() => {
      try {
        if (localStorage.getItem(key)) return
        localStorage.setItem(key, '1')
      } catch {
        /* Storage can be blocked; celebrate anyway. */
      }

      setCelebrate(true)
      setBurst((value) => value + 1)
      speak(celebrationText, 4800)
      play('celebrate')

      if (celebrateTimer.current) window.clearTimeout(celebrateTimer.current)
      celebrateTimer.current = window.setTimeout(() => setCelebrate(false), 1800)
    }, 0)

    return () => window.clearTimeout(start)
  }, [celebrating, moment, selectedDate, celebrationText, speak, play, email])

  useEffect(() => {
    let greeted = false
    try {
      greeted = sessionStorage.getItem('koa:greeted') === '1'
    } catch {
      /* ignore */
    }
    if (greeted) return

    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem('koa:greeted', '1')
      } catch {
        /* ignore */
      }
      if (Date.now() - lastSpoke.current < 5000) return
      speak("Hi, I'm Koa! Tap me to say hello, or tug me somewhere new.", 4200)
      play('chirp')
    }, 2200)

    return () => window.clearTimeout(timer)
  }, [speak, play])

  useEffect(() => {
    return () => {
      if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current)
      if (heartsTimer.current) window.clearTimeout(heartsTimer.current)
      if (celebrateTimer.current) window.clearTimeout(celebrateTimer.current)
      if (napTimer.current) window.clearTimeout(napTimer.current)
      if (perchTimer.current) window.clearTimeout(perchTimer.current)
    }
  }, [])

  if (!profile) return null

  const frame: KoalaFrame = napping
    ? 'sleep'
    : celebrate || showHearts
      ? 'cheer'
      : perched && !moving
        ? 'seat'
        : moving && !reducedMotion
          ? walkStep
          : moment === 'over'
            ? 'grumpy'
            : 'idle'

  const motionClass =
    celebrate || showHearts
      ? 'animate-koa-cheer'
      : moving && !reducedMotion
        ? 'koa-walk'
        : frame === 'seat' || frame === 'sleep'
          ? ''
          : 'koa-breathe'

  const center = pos.x + SIZE / 2
  const bubbleWidth = 192
  const wantedLeft = Math.min(
    Math.max(center - bubbleWidth / 2, 8),
    Math.max(8, viewport.w - bubbleWidth - 8),
  )
  const bubbleOffset = wantedLeft + bubbleWidth / 2 - center
  const bubbleBelow = pos.y < 96
  const tailLeft = Math.min(94, Math.max(6, ((center - wantedLeft) / bubbleWidth) * 100))

  function pet() {
    const now = Date.now()
    if (now - lastPet.current < 450) return
    lastPet.current = now

    if (soundOn) {
      unlock()
      play(moment === 'over' ? 'nudge' : 'chirp')
    }
    setShowHearts(true)
    setHeartBurst((value) => value + 1)
    if (heartsTimer.current) window.clearTimeout(heartsTimer.current)
    heartsTimer.current = window.setTimeout(() => setShowHearts(false), 1100)

    const lines = moment === 'over' ? OVER_LINES : PET_LINES
    speak(lines[Math.floor(Math.random() * lines.length)], 3200)
  }

  function toggleSound(event: MouseEvent) {
    event.stopPropagation()
    const next = !soundOn
    setSoundOn(next)
    try {
      localStorage.setItem('koa:sound', next ? 'on' : 'off')
    } catch {
      /* ignore */
    }
    if (next) {
      unlock()
      play('chirp', true)
    }
  }

  function onPointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if (drag.current.pointerId !== -1) return
    wake()
    if (perchTimer.current) {
      window.clearTimeout(perchTimer.current)
      perchTimer.current = null
    }
    setPerched(false)
    setMoving(false)

    const root = rootRef.current
    const rect = root?.getBoundingClientRect()
    const originX = rect ? Math.round(rect.left) : posRef.current.x
    const originY = rect ? Math.round(rect.top) : posRef.current.y

    posRef.current = { x: originX, y: originY }
    setPos({ x: originX, y: originY })
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX,
      originY,
      moved: false,
    }
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const current = drag.current
    if (current.pointerId !== event.pointerId) return

    const dx = event.clientX - current.startX
    const dy = event.clientY - current.startY
    if (!current.moved && Math.hypot(dx, dy) < 5) return
    current.moved = true

    const { minX, maxX, minY, maxY } = bounds(window.innerWidth, window.innerHeight)
    const next = {
      x: Math.min(Math.max(current.originX + dx, minX), maxX),
      y: Math.min(Math.max(current.originY + dy, minY), maxY),
    }
    posRef.current = next
    setPos(next)
  }

  function finishDrag(event: ReactPointerEvent<HTMLButtonElement>, allowPet: boolean) {
    const current = drag.current
    if (current.pointerId !== event.pointerId) return
    const wasMoved = current.moved
    current.pointerId = -1
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setDragging(false)
    if (allowPet && !wasMoved) pet()
  }

  return (
    <div
      ref={rootRef}
      className={`fixed left-0 top-0 will-change-transform ${perched ? 'z-40' : 'z-20'}`}
      style={{
        width: SIZE,
        height: SIZE,
        transform: `translate3d(${Math.round(pos.x)}px, ${Math.round(pos.y)}px, 0)`,
        transition: dragging || reducedMotion ? 'none' : `transform ${travel}ms linear`,
      }}
    >
      {celebrate ? (
        <div key={burst} className="pointer-events-none absolute inset-0" aria-hidden="true">
          {CONFETTI_BURST.map((piece, index) => (
            <span
              key={index}
              className="koa-confetti absolute left-1/2 top-1/2 block h-2 w-1.5 rounded-sm"
              style={
                {
                  backgroundColor: piece.color,
                  animationDelay: `${piece.delay}s`,
                  '--dx': `${piece.dx}px`,
                  '--dy': `${piece.dy}px`,
                  '--rot': `${piece.rot}deg`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ) : null}

      {showHearts ? (
        <div key={heartBurst} className="pointer-events-none absolute inset-0" aria-hidden="true">
          {HEART_BURST.map((heart, index) => (
            <Heart
              key={index}
              className="koa-heart absolute left-1/2 top-1/3 h-3.5 w-3.5 fill-coral text-coral"
              style={
                {
                  animationDelay: `${heart.delay}s`,
                  '--dx': `${heart.dx}px`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ) : null}

      {napping ? (
        <div className="pointer-events-none absolute -top-1 right-0 h-12 w-12" aria-hidden="true">
          <span className="koa-zzz absolute bottom-0 right-1 font-hand text-sm font-semibold text-cream/80">
            z
          </span>
          <span
            className="koa-zzz absolute bottom-2 right-4 font-hand text-base font-semibold text-cream/70"
            style={{ animationDelay: '0.6s' }}
          >
            z
          </span>
          <span
            className="koa-zzz absolute bottom-4 right-7 font-hand text-lg font-semibold text-cream/60"
            style={{ animationDelay: '1.2s' }}
          >
            Z
          </span>
        </div>
      ) : null}

      {bubble ? (
        <div
          role="status"
          aria-live="polite"
          className={`koa-bubble pointer-events-none absolute left-1/2 w-48 -translate-x-1/2 rounded-2xl border border-white/10 bg-panel/95 px-3 py-2 text-center shadow-xl shadow-black/40 backdrop-blur ${
            bubbleBelow ? 'top-full mt-3' : 'bottom-full mb-3'
          }`}
          style={{ marginLeft: `${bubbleOffset}px` }}
        >
          <p className="font-hand text-base leading-none text-coral">Koa</p>
          <p className="mt-1 text-[13px] font-medium leading-snug text-cream">{bubble}</p>
          <span
            className={`absolute h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-white/10 bg-panel ${
              bubbleBelow ? '-top-1.5 border-l border-t' : '-bottom-1.5 border-b border-r'
            }`}
            style={{ left: `${tailLeft}%` }}
          />
        </div>
      ) : null}

      <div className="h-full w-full" style={{ transform: `scaleX(${facing})` }}>
        <button
          type="button"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={(event) => finishDrag(event, true)}
          onPointerCancel={(event) => finishDrag(event, false)}
          onContextMenu={(event) => event.preventDefault()}
          onClick={(event) => {
            if (event.detail === 0) pet()
          }}
          aria-label="Pet or drag Koa the koala"
          title="Pet or drag Koa"
          className="pointer-events-auto block h-full w-full cursor-grab touch-none select-none rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/70 focus-visible:ring-offset-2 focus-visible:ring-offset-night active:cursor-grabbing"
        >
          <PixelKoala
            frame={frame}
            size={SIZE}
            className={`${motionClass} drop-shadow-[0_4px_0_rgba(0,0,0,0.25)]`}
          />
        </button>
      </div>

      <button
        type="button"
        onClick={toggleSound}
        aria-label="Koa sound"
        aria-pressed={soundOn}
        title={soundOn ? 'Mute Koa' : 'Unmute Koa'}
        className="pointer-events-auto absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-panel/95 text-white/60 shadow-lg transition-colors hover:text-cream"
      >
        {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </button>
    </div>
  )
}
