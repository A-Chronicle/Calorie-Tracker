import { useMemo, useRef, useState, type FormEvent } from 'react'
import { Camera, Search, X } from 'lucide-react'
import { useTracker } from '../context/useTracker'
import { compressImage } from '../lib/image'
import { isoOnDate } from '../lib/dates'
import { foodToItem, parseMealQuery, searchFoods, suggestedMealType, sumItems } from '../lib/foods'
import type { MealSource, MealType, NutrientItem } from '../types'

type Tab = 'scan' | 'search' | 'manual'

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

export default function LogMealSheet() {
  const { logOpen, setLogOpen, addMeal, selectedDate } = useTracker()
  const fileRef = useRef<HTMLInputElement>(null)
  const [tab, setTab] = useState<Tab>('scan')
  const [mealType, setMealType] = useState<MealType>(suggestedMealType)
  const [photo, setPhoto] = useState<string>()
  const [hint, setHint] = useState('')
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<NutrientItem[]>([])
  const [manualName, setManualName] = useState('')
  const [manualCalories, setManualCalories] = useState('')
  const [manualProtein, setManualProtein] = useState('')
  const [manualCarbs, setManualCarbs] = useState('')
  const [manualFat, setManualFat] = useState('')
  const [error, setError] = useState('')
  const [analyzing, setAnalyzing] = useState(false)

  const totals = useMemo(() => sumItems(items), [items])
  const results = query.trim() ? searchFoods(query) : searchFoods('chicken').slice(0, 6)

  function reset() {
    setTab('scan')
    setMealType(suggestedMealType())
    setPhoto(undefined)
    setHint('')
    setQuery('')
    setItems([])
    setManualName('')
    setManualCalories('')
    setManualProtein('')
    setManualCarbs('')
    setManualFat('')
    setError('')
    setAnalyzing(false)
  }

  function close() {
    reset()
    setLogOpen(false)
  }

  async function onPickPhoto(file: File) {
    setError('')
    const dataUrl = await compressImage(file)
    setPhoto(dataUrl)
  }

  async function analyzePhoto() {
    if (!photo) return
    setAnalyzing(true)
    setError('')
    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: photo, hint }),
      })
      if (response.ok) {
        const data = (await response.json()) as {
          dishName: string
          items: NutrientItem[]
        }
        setItems(data.items)
        if (data.dishName) setManualName(data.dishName)
        setAnalyzing(false)
        return
      }
    } catch {
      /* fall through to local estimate */
    }

    const guessed = parseMealQuery(hint)
    if (guessed.length) {
      setItems(guessed)
      setManualName(hint)
    } else {
      setError(
        'Photo analysis needs an AI Gateway key. Describe the meal below and we will estimate from the food library.',
      )
    }
    setAnalyzing(false)
  }

  function addFoodFromSearch(id: string) {
    const match = results.find((f) => f.id === id)
    if (!match) return
    setItems((prev) => [...prev, foodToItem(match)])
    setQuery('')
  }

  async function saveMeal(meal: Parameters<typeof addMeal>[0]) {
    try {
      await addMeal(meal)
      close()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this meal')
    }
  }

  function logFromItems(source: MealSource) {
    if (!items.length) {
      setError('Add at least one food')
      return
    }
    void saveMeal({
      name: manualName.trim() || items.map((i) => i.name).join(', '),
      mealType,
      protein: totals.protein,
      carbs: totals.carbs,
      fat: totals.fat,
      calories: Math.round(totals.calories),
      photo,
      loggedAt: isoOnDate(selectedDate),
      source,
      items,
    })
  }

  function logManual(e: FormEvent) {
    e.preventDefault()
    const calories = Number(manualCalories)
    if (!manualName.trim() || !calories) {
      setError('Name and calories are required')
      return
    }
    void saveMeal({
      name: manualName.trim(),
      mealType,
      calories: Math.round(calories),
      protein: Number(manualProtein) || 0,
      carbs: Number(manualCarbs) || 0,
      fat: Number(manualFat) || 0,
      photo,
      loggedAt: isoOnDate(selectedDate),
      source: 'manual',
    })
  }

  if (!logOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-rise">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col rounded-t-[32px] border-t border-white/10 bg-[#14141d] shadow-2xl">
        <div className="flex items-center justify-between px-5 pt-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Add to today</p>
            <h2 className="text-2xl font-extrabold tracking-tight">Log meal</h2>
          </div>
          <button type="button" onClick={close} className="rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 flex gap-1 px-5">
          {MEAL_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setMealType(type)}
              className={`flex-1 rounded-full px-2 py-1.5 text-xs font-semibold capitalize transition-all ${
                mealType === type ? 'brand-gradient text-white shadow-lg shadow-coral/25' : 'bg-white/5 text-white/50 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-1 rounded-full bg-white/5 p-1 mx-5">
          {(['scan', 'search', 'manual'] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold capitalize transition-colors ${
                tab === id ? 'bg-white/15 text-white shadow-sm' : 'text-white/45 hover:text-white/80'
              }`}
            >
              {id}
            </button>
          ))}
        </div>

        <div className="mt-4 flex-1 overflow-y-auto px-5 pb-8">
          {error ? (
            <p className="mb-3 rounded-2xl border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>
          ) : null}

          {tab === 'scan' ? (
            <div className="space-y-4">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void onPickPhoto(file)
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-48 w-full flex-col items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-white/15 bg-white/[0.03] transition-colors hover:border-coral/50"
              >
                {photo ? (
                  <img src={photo} alt="Meal preview" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <span className="brand-gradient flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-coral/30">
                      <Camera className="h-6 w-6 text-white" />
                    </span>
                    <p className="mt-3 text-sm font-bold text-white">Snap or upload a meal</p>
                    <p className="text-xs text-white/40">We estimate calories from the photo</p>
                  </>
                )}
              </button>
              <input
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                placeholder="Optional hint: 2 roti and dal"
                className="field text-sm"
              />
              <button
                type="button"
                disabled={!photo || analyzing}
                onClick={() => void analyzePhoto()}
                className="w-full rounded-2xl bg-white py-3.5 text-sm font-bold text-night shadow-lg transition-transform active:scale-[0.99] disabled:opacity-40"
              >
                {analyzing ? 'Analyzing…' : 'Analyze meal'}
              </button>
              {items.length ? <ItemList items={items} totals={totals} /> : null}
              {items.length ? (
                <button
                  type="button"
                  onClick={() => logFromItems(photo ? 'ai' : 'scan')}
                  className="w-full rounded-2xl bg-mint py-3.5 text-sm font-bold text-night shadow-lg shadow-mint/25 transition-transform active:scale-[0.99]"
                >
                  Add {Math.round(totals.calories)} kcal
                </button>
              ) : null}
            </div>
          ) : null}

          {tab === 'search' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 focus-within:border-coral/60">
                <Search className="h-4 w-4 text-white/40" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search roti, eggs, biryani…"
                  className="w-full bg-transparent py-1 text-sm text-white outline-none placeholder:text-white/30"
                />
              </div>
              <div className="space-y-2">
                {results.map((food) => (
                  <button
                    key={food.id}
                    type="button"
                    onClick={() => addFoodFromSearch(food.id)}
                    className="flex w-full items-center justify-between rounded-2xl border border-white/[0.07] bg-panel px-4 py-3 text-left transition-colors hover:border-coral/40"
                  >
                    <span>
                      <span className="block font-semibold text-white">{food.name}</span>
                      <span className="text-xs text-white/40">{food.serving}</span>
                    </span>
                    <span className="rounded-full bg-amber/15 px-2.5 py-1 text-xs font-bold text-amber">{food.calories} kcal</span>
                  </button>
                ))}
              </div>
              {items.length ? <ItemList items={items} totals={totals} /> : null}
              {items.length ? (
                <button
                  type="button"
                  onClick={() => logFromItems('search')}
                  className="w-full rounded-2xl bg-white py-3.5 text-sm font-bold text-night shadow-lg transition-transform active:scale-[0.99]"
                >
                  Add {Math.round(totals.calories)} kcal
                </button>
              ) : null}
            </div>
          ) : null}

          {tab === 'manual' ? (
            <form onSubmit={logManual} className="space-y-3">
              <Field label="Food name" value={manualName} onChange={setManualName} placeholder="Homemade pasta" />
              <Field
                label="Calories"
                value={manualCalories}
                onChange={setManualCalories}
                type="number"
                placeholder="450"
              />
              <div className="grid grid-cols-3 gap-2">
                <Field label="Protein" value={manualProtein} onChange={setManualProtein} type="number" placeholder="g" />
                <Field label="Carbs" value={manualCarbs} onChange={setManualCarbs} type="number" placeholder="g" />
                <Field label="Fat" value={manualFat} onChange={setManualFat} type="number" placeholder="g" />
              </div>
              <button type="submit" className="brand-gradient w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-lg shadow-coral/25 transition-transform active:scale-[0.99]">
                Save meal
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function ItemList({
  items,
  totals,
}: {
  items: NutrientItem[]
  totals: { calories: number; protein: number; carbs: number; fat: number }
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-panel p-4">
      {items.map((item, index) => (
        <div key={`${item.name}-${index}`} className="flex justify-between py-1.5 text-sm">
          <span className="text-white/80">
            {item.name}
            <span className="ml-1 text-xs text-white/35">{item.quantity}</span>
          </span>
          <span className="font-semibold text-white">{item.calories} kcal</span>
        </div>
      ))}
      <p className="mt-2 border-t border-white/10 pt-2 text-xs font-medium text-white/50">
        P {Math.round(totals.protein)}g · C {Math.round(totals.carbs)}g · F {Math.round(totals.fat)}g
      </p>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wide text-white/45">
      <span className="mb-1.5 block">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field text-sm"
      />
    </label>
  )
}
