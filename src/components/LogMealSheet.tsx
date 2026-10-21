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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col rounded-t-3xl bg-[#f6f3ee] shadow-2xl">
        <div className="flex items-center justify-between px-5 pt-4">
          <h2 className="text-lg font-bold">Log meal</h2>
          <button type="button" onClick={close} className="rounded-full p-2 hover:bg-white" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 flex gap-1 px-5">
          {MEAL_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setMealType(type)}
              className={`flex-1 rounded-full px-2 py-1.5 text-xs font-semibold capitalize ${
                mealType === type ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-2 px-5">
          {(['scan', 'search', 'manual'] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize ${
                tab === id ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-500'
              }`}
            >
              {id}
            </button>
          ))}
        </div>

        <div className="mt-4 flex-1 overflow-y-auto px-5 pb-8">
          {error ? (
            <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
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
                className="flex h-44 w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-neutral-300 bg-white"
              >
                {photo ? (
                  <img src={photo} alt="Meal preview" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <Camera className="h-8 w-8 text-neutral-400" />
                    <p className="mt-2 text-sm font-medium text-neutral-600">Snap or upload a meal</p>
                    <p className="text-xs text-neutral-400">Cal AI-style photo estimate</p>
                  </>
                )}
              </button>
              <input
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                placeholder="Optional hint: 2 roti and dal"
                className="w-full rounded-2xl border-0 bg-white px-4 py-3 text-sm outline-none ring-1 ring-black/5"
              />
              <button
                type="button"
                disabled={!photo || analyzing}
                onClick={() => void analyzePhoto()}
                className="w-full rounded-2xl bg-neutral-950 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {analyzing ? 'Analyzing…' : 'Analyze meal'}
              </button>
              {items.length ? <ItemList items={items} totals={totals} /> : null}
              {items.length ? (
                <button
                  type="button"
                  onClick={() => logFromItems(photo ? 'ai' : 'scan')}
                  className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white"
                >
                  Add {Math.round(totals.calories)} kcal
                </button>
              ) : null}
            </div>
          ) : null}

          {tab === 'search' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ring-black/5">
                <Search className="h-4 w-4 text-neutral-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search roti, eggs, biryani…"
                  className="w-full bg-transparent py-1 text-sm outline-none"
                />
              </div>
              <div className="space-y-2">
                {results.map((food) => (
                  <button
                    key={food.id}
                    type="button"
                    onClick={() => addFoodFromSearch(food.id)}
                    className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-left ring-1 ring-black/4"
                  >
                    <span>
                      <span className="block font-medium text-neutral-900">{food.name}</span>
                      <span className="text-xs text-neutral-500">{food.serving}</span>
                    </span>
                    <span className="text-sm font-semibold">{food.calories} kcal</span>
                  </button>
                ))}
              </div>
              {items.length ? <ItemList items={items} totals={totals} /> : null}
              {items.length ? (
                <button
                  type="button"
                  onClick={() => logFromItems('search')}
                  className="w-full rounded-2xl bg-neutral-950 py-3 text-sm font-semibold text-white"
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
              <button type="submit" className="w-full rounded-2xl bg-neutral-950 py-3 text-sm font-semibold text-white">
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
    <div className="rounded-2xl bg-white p-4 ring-1 ring-black/4">
      {items.map((item, index) => (
        <div key={`${item.name}-${index}`} className="flex justify-between py-1.5 text-sm">
          <span className="text-neutral-700">
            {item.name}
            <span className="ml-1 text-xs text-neutral-400">{item.quantity}</span>
          </span>
          <span className="font-medium">{item.calories} kcal</span>
        </div>
      ))}
      <p className="mt-2 border-t border-neutral-100 pt-2 text-xs text-neutral-500">
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
    <label className="block text-xs font-medium text-neutral-500">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-2xl bg-white px-3 py-2.5 text-sm text-neutral-950 outline-none ring-1 ring-black/5"
      />
    </label>
  )
}
