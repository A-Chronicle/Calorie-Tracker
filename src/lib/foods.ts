import type { Food, NutrientItem } from '../types'

export const FOODS: Food[] = [
  { id: 'roti', name: 'Roti / chapati', aliases: ['roti', 'chapati', 'phulka'], serving: '1 piece (40g)', calories: 120, protein: 3.1, carbs: 18, fat: 3.7 },
  { id: 'naan', name: 'Naan', aliases: ['naan', 'butter naan'], serving: '1 piece', calories: 262, protein: 7.3, carbs: 45, fat: 5.1 },
  { id: 'rice', name: 'Steamed rice', aliases: ['rice', 'white rice', 'chawal'], serving: '1 cup cooked', calories: 206, protein: 4.3, carbs: 45, fat: 0.4 },
  { id: 'brown-rice', name: 'Brown rice', aliases: ['brown rice'], serving: '1 cup cooked', calories: 216, protein: 5, carbs: 45, fat: 1.8 },
  { id: 'dal', name: 'Dal tadka', aliases: ['dal', 'daal', 'lentil', 'dal tadka'], serving: '1 cup', calories: 198, protein: 12, carbs: 28, fat: 5.2 },
  { id: 'dal-makhani', name: 'Dal makhani', aliases: ['dal makhani'], serving: '1 cup', calories: 320, protein: 14, carbs: 26, fat: 18 },
  { id: 'rajma', name: 'Rajma', aliases: ['rajma', 'kidney beans'], serving: '1 cup', calories: 240, protein: 13, carbs: 38, fat: 4 },
  { id: 'chole', name: 'Chole', aliases: ['chole', 'chana masala', 'chickpeas'], serving: '1 cup', calories: 270, protein: 12, carbs: 36, fat: 8 },
  { id: 'paneer-tikka', name: 'Paneer tikka', aliases: ['paneer tikka', 'paneer'], serving: '150g', calories: 265, protein: 18, carbs: 8, fat: 18 },
  { id: 'palak-paneer', name: 'Palak paneer', aliases: ['palak paneer', 'saag paneer'], serving: '1 cup', calories: 290, protein: 14, carbs: 12, fat: 22 },
  { id: 'butter-chicken', name: 'Butter chicken', aliases: ['butter chicken', 'murgh makhani'], serving: '1 cup', calories: 438, protein: 28, carbs: 12, fat: 31 },
  { id: 'chicken-curry', name: 'Chicken curry', aliases: ['chicken curry'], serving: '1 cup', calories: 243, protein: 24, carbs: 8, fat: 13 },
  { id: 'biryani', name: 'Chicken biryani', aliases: ['biryani', 'chicken biryani'], serving: '1 plate', calories: 520, protein: 26, carbs: 62, fat: 18 },
  { id: 'idli', name: 'Idli', aliases: ['idli'], serving: '2 pieces', calories: 78, protein: 2.4, carbs: 16, fat: 0.4 },
  { id: 'dosa', name: 'Masala dosa', aliases: ['dosa', 'masala dosa'], serving: '1 dosa', calories: 307, protein: 6, carbs: 42, fat: 12 },
  { id: 'poha', name: 'Poha', aliases: ['poha'], serving: '1 bowl', calories: 250, protein: 5, carbs: 42, fat: 7 },
  { id: 'upma', name: 'Upma', aliases: ['upma'], serving: '1 bowl', calories: 220, protein: 6, carbs: 36, fat: 6 },
  { id: 'samosa', name: 'Samosa', aliases: ['samosa'], serving: '1 piece', calories: 262, protein: 4, carbs: 24, fat: 17 },
  { id: 'chai', name: 'Masala chai with milk', aliases: ['chai', 'tea', 'masala chai'], serving: '1 cup', calories: 95, protein: 3, carbs: 14, fat: 3 },
  { id: 'paratha', name: 'Aloo paratha', aliases: ['paratha', 'aloo paratha'], serving: '1 piece', calories: 290, protein: 6, carbs: 38, fat: 12 },
  { id: 'curd', name: 'Curd / yogurt', aliases: ['curd', 'dahi', 'yogurt'], serving: '1 cup', calories: 150, protein: 8, carbs: 12, fat: 8 },
  { id: 'egg', name: 'Boiled egg', aliases: ['egg', 'boiled egg', 'eggs'], serving: '1 large', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
  { id: 'omelette', name: 'Omelette (2 eggs)', aliases: ['omelette', 'omelet'], serving: '2 eggs', calories: 186, protein: 13, carbs: 1, fat: 14 },
  { id: 'scrambled', name: 'Scrambled eggs', aliases: ['scrambled eggs'], serving: '2 eggs', calories: 198, protein: 13, carbs: 2, fat: 15 },
  { id: 'oatmeal', name: 'Oatmeal with milk', aliases: ['oatmeal', 'oats', 'porridge'], serving: '1 bowl', calories: 220, protein: 8, carbs: 34, fat: 5 },
  { id: 'banana', name: 'Banana', aliases: ['banana'], serving: '1 medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { id: 'apple', name: 'Apple', aliases: ['apple'], serving: '1 medium', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { id: 'orange', name: 'Orange', aliases: ['orange'], serving: '1 medium', calories: 62, protein: 1.2, carbs: 15, fat: 0.2 },
  { id: 'avocado', name: 'Avocado', aliases: ['avocado'], serving: '1/2 fruit', calories: 160, protein: 2, carbs: 9, fat: 15 },
  { id: 'avocado-toast', name: 'Avocado toast', aliases: ['avocado toast'], serving: '1 slice', calories: 240, protein: 6, carbs: 22, fat: 14 },
  { id: 'greek-yogurt', name: 'Greek yogurt', aliases: ['greek yogurt'], serving: '170g', calories: 100, protein: 17, carbs: 6, fat: 0.7 },
  { id: 'protein-shake', name: 'Protein shake', aliases: ['protein shake', 'whey'], serving: '1 scoop with water', calories: 120, protein: 24, carbs: 3, fat: 1.5 },
  { id: 'chicken-breast', name: 'Grilled chicken breast', aliases: ['chicken breast', 'grilled chicken', 'chicken'], serving: '150g', calories: 248, protein: 46, carbs: 0, fat: 5.4 },
  { id: 'salmon', name: 'Baked salmon', aliases: ['salmon'], serving: '150g', calories: 280, protein: 30, carbs: 0, fat: 18 },
  { id: 'tuna', name: 'Tuna (canned in water)', aliases: ['tuna'], serving: '1 can (120g)', calories: 132, protein: 29, carbs: 0, fat: 1 },
  { id: 'beef', name: 'Lean beef steak', aliases: ['steak', 'beef'], serving: '150g', calories: 250, protein: 36, carbs: 0, fat: 11 },
  { id: 'tofu', name: 'Tofu stir fry', aliases: ['tofu'], serving: '150g', calories: 190, protein: 16, carbs: 8, fat: 11 },
  { id: 'salad', name: 'Garden salad with dressing', aliases: ['salad', 'green salad'], serving: '1 bowl', calories: 180, protein: 4, carbs: 12, fat: 13 },
  { id: 'caesar', name: 'Chicken caesar salad', aliases: ['caesar', 'caesar salad'], serving: '1 bowl', calories: 470, protein: 32, carbs: 16, fat: 31 },
  { id: 'sandwich', name: 'Turkey sandwich', aliases: ['sandwich', 'turkey sandwich'], serving: '1 sandwich', calories: 320, protein: 22, carbs: 34, fat: 10 },
  { id: 'burger', name: 'Cheeseburger', aliases: ['burger', 'cheeseburger', 'hamburger'], serving: '1 burger', calories: 535, protein: 25, carbs: 40, fat: 30 },
  { id: 'pizza', name: 'Pizza slice (cheese)', aliases: ['pizza', 'pizza slice'], serving: '1 slice', calories: 285, protein: 12, carbs: 36, fat: 10 },
  { id: 'pasta', name: 'Pasta marinara', aliases: ['pasta', 'spaghetti'], serving: '1 bowl', calories: 380, protein: 13, carbs: 68, fat: 6 },
  { id: 'pasta-alfredo', name: 'Pasta alfredo', aliases: ['alfredo', 'pasta alfredo'], serving: '1 bowl', calories: 620, protein: 18, carbs: 56, fat: 36 },
  { id: 'ramen', name: 'Ramen bowl', aliases: ['ramen', 'noodles'], serving: '1 bowl', calories: 430, protein: 12, carbs: 62, fat: 14 },
  { id: 'sushi', name: 'Sushi roll (8 pcs)', aliases: ['sushi', 'california roll'], serving: '8 pieces', calories: 300, protein: 9, carbs: 46, fat: 8 },
  { id: 'fried-rice', name: 'Chicken fried rice', aliases: ['fried rice'], serving: '1 plate', calories: 430, protein: 18, carbs: 58, fat: 14 },
  { id: 'fries', name: 'French fries', aliases: ['fries', 'french fries'], serving: 'medium', calories: 365, protein: 4, carbs: 48, fat: 17 },
  { id: 'chips', name: 'Potato chips', aliases: ['chips', 'crisps'], serving: '1 small bag (28g)', calories: 152, protein: 2, carbs: 15, fat: 10 },
  { id: 'chocolate', name: 'Dark chocolate', aliases: ['chocolate', 'dark chocolate'], serving: '30g', calories: 170, protein: 2, carbs: 13, fat: 12 },
  { id: 'ice-cream', name: 'Ice cream', aliases: ['ice cream'], serving: '1 scoop', calories: 137, protein: 2.3, carbs: 16, fat: 7 },
  { id: 'almonds', name: 'Almonds', aliases: ['almonds', 'almond'], serving: '28g (23 nuts)', calories: 164, protein: 6, carbs: 6, fat: 14 },
  { id: 'peanut-butter', name: 'Peanut butter', aliases: ['peanut butter'], serving: '2 tbsp', calories: 188, protein: 8, carbs: 6, fat: 16 },
  { id: 'bread', name: 'Whole wheat bread', aliases: ['bread', 'toast', 'slice'], serving: '1 slice', calories: 81, protein: 4, carbs: 14, fat: 1.1 },
  { id: 'milk', name: 'Whole milk', aliases: ['milk'], serving: '1 cup', calories: 149, protein: 8, carbs: 12, fat: 8 },
  { id: 'coffee', name: 'Black coffee', aliases: ['coffee', 'americano'], serving: '1 cup', calories: 5, protein: 0.3, carbs: 0, fat: 0 },
  { id: 'latte', name: 'Caffe latte', aliases: ['latte', 'cafe latte'], serving: '12 oz', calories: 190, protein: 10, carbs: 18, fat: 7 },
  { id: 'smoothie', name: 'Fruit smoothie', aliases: ['smoothie'], serving: '16 oz', calories: 280, protein: 4, carbs: 62, fat: 1 },
  { id: 'quinoa', name: 'Quinoa', aliases: ['quinoa'], serving: '1 cup cooked', calories: 222, protein: 8, carbs: 39, fat: 3.6 },
  { id: 'broccoli', name: 'Steamed broccoli', aliases: ['broccoli'], serving: '1 cup', calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
  { id: 'sweet-potato', name: 'Baked sweet potato', aliases: ['sweet potato'], serving: '1 medium', calories: 103, protein: 2.3, carbs: 24, fat: 0.2 },
  { id: 'potato', name: 'Baked potato', aliases: ['potato', 'baked potato'], serving: '1 medium', calories: 161, protein: 4.3, carbs: 37, fat: 0.2 },
  { id: 'hummus', name: 'Hummus with veggies', aliases: ['hummus'], serving: '1/4 cup + veg', calories: 180, protein: 6, carbs: 16, fat: 10 },
  { id: 'wrap', name: 'Chicken wrap', aliases: ['wrap', 'chicken wrap'], serving: '1 wrap', calories: 410, protein: 28, carbs: 38, fat: 16 },
  { id: 'burrito', name: 'Bean burrito', aliases: ['burrito'], serving: '1 burrito', calories: 430, protein: 16, carbs: 62, fat: 13 },
  { id: 'pho', name: 'Pho (beef)', aliases: ['pho'], serving: '1 bowl', calories: 350, protein: 25, carbs: 40, fat: 8 },
  { id: 'pad-thai', name: 'Pad thai', aliases: ['pad thai'], serving: '1 plate', calories: 530, protein: 18, carbs: 72, fat: 18 },
  { id: 'falafel', name: 'Falafel pita', aliases: ['falafel'], serving: '1 pita', calories: 430, protein: 14, carbs: 54, fat: 18 },
  { id: 'granola', name: 'Granola with milk', aliases: ['granola'], serving: '1 bowl', calories: 310, protein: 9, carbs: 46, fat: 11 },
  { id: 'pancake', name: 'Pancakes with syrup', aliases: ['pancake', 'pancakes'], serving: '2 pancakes', calories: 350, protein: 8, carbs: 58, fat: 10 },
  { id: 'bagel', name: 'Bagel with cream cheese', aliases: ['bagel'], serving: '1 bagel', calories: 360, protein: 12, carbs: 56, fat: 10 },
  { id: 'coke', name: 'Cola', aliases: ['coke', 'cola', 'soda'], serving: '12 oz', calories: 140, protein: 0, carbs: 39, fat: 0 },
  { id: 'beer', name: 'Beer', aliases: ['beer'], serving: '12 oz', calories: 153, protein: 1.6, carbs: 13, fat: 0 },
  { id: 'wine', name: 'Red wine', aliases: ['wine'], serving: '5 oz', calories: 125, protein: 0.1, carbs: 4, fat: 0 },
]

function scoreFood(food: Food, query: string): number {
  const q = query.trim().toLowerCase()
  if (!q) return 0
  if (food.name.toLowerCase() === q) return 100
  if (food.aliases.some((a) => a === q)) return 95
  if (food.name.toLowerCase().startsWith(q)) return 80
  if (food.aliases.some((a) => a.startsWith(q))) return 75
  if (food.name.toLowerCase().includes(q)) return 60
  if (food.aliases.some((a) => a.includes(q))) return 55
  const tokens = q.split(/\s+/)
  const hay = `${food.name} ${food.aliases.join(' ')}`.toLowerCase()
  const hits = tokens.filter((t) => t.length > 1 && hay.includes(t)).length
  return hits ? 20 + hits * 10 : 0
}

export function searchFoods(query: string, limit = 12): Food[] {
  return FOODS.map((food) => ({ food, score: scoreFood(food, query) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.food)
}

export function foodToItem(food: Food, servings = 1): NutrientItem {
  const round = (n: number) => Math.round(n * 10) / 10
  return {
    name: food.name,
    quantity: servings === 1 ? food.serving : `${servings} × ${food.serving}`,
    calories: Math.round(food.calories * servings),
    protein: round(food.protein * servings),
    carbs: round(food.carbs * servings),
    fat: round(food.fat * servings),
  }
}

export function sumItems(items: NutrientItem[]): Omit<NutrientItem, 'name' | 'quantity'> {
  return items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )
}

const SPLIT = /\s+(?:and|&|,)\s+/i

export function parseMealQuery(query: string): NutrientItem[] {
  const chunks = query
    .split(SPLIT)
    .map((c) => c.trim())
    .filter(Boolean)
  const items: NutrientItem[] = []
  for (const chunk of chunks) {
    const match = chunk.match(/^(\d+(?:\.\d+)?)\s*(?:x|×)?\s*(.+)$/i)
    const servings = match ? Number(match[1]) : 1
    const name = match ? match[2] : chunk
    const [food] = searchFoods(name, 1)
    if (food) items.push(foodToItem(food, servings))
  }
  return items
}

export function suggestedMealType(date = new Date()): 'breakfast' | 'lunch' | 'dinner' | 'snack' {
  const hour = date.getHours()
  if (hour < 11) return 'breakfast'
  if (hour < 15) return 'lunch'
  if (hour < 21) return 'dinner'
  return 'snack'
}
