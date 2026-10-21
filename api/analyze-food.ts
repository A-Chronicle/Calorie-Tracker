import { generateText, Output } from 'ai'
import { z } from 'zod'
import { getSessionUser } from '../server/auth.js'

const itemSchema = z.object({
  name: z.string(),
  quantity: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
})

const mealSchema = z.object({
  dishName: z.string(),
  confidence: z.number(),
  items: z.array(itemSchema),
})

export type AnalyzedMeal = z.infer<typeof mealSchema>

function parseDataUrl(dataUrl: string): { mediaType: string; data: string } {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/)
  if (!match) throw new Error('Expected a base64 image data URL')
  return { mediaType: match[1], data: match[2] }
}

export async function analyzeMeal(imageDataUrl: string, hint?: string): Promise<AnalyzedMeal> {
  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
    throw new Error('AI_UNAVAILABLE')
  }

  const model = process.env.AI_GATEWAY_MODEL ?? 'google/gemini-3.1-flash-lite'
  const { mediaType, data } = parseDataUrl(imageDataUrl)

  const { output } = await generateText({
    model,
    instructions:
      'You are a nutrition analyst for a calorie tracker. Identify every visible food, estimate a realistic serving, and return calories plus protein/carbs/fat in grams. Prefer USDA-style estimates. If the photo is not food, still return a best-effort empty items array and a low confidence.',
    output: Output.object({ schema: mealSchema }),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: hint
              ? `Analyze this meal photo. User hint: ${hint}`
              : 'Analyze this meal photo. Name the dish and list each item with estimated nutrition.',
          },
          { type: 'file', data, mediaType },
        ],
      },
    ],
  })

  if (!output) throw new Error('The model did not return a meal estimate')
  return output
}

export async function POST(request: Request) {
  // Paid model call: only signed-in users may trigger it.
  if (!(await getSessionUser(request))) {
    return Response.json({ error: 'Sign in to analyze photos' }, { status: 401 })
  }
  try {
    const body = (await request.json()) as { image?: string; hint?: string }
    if (!body.image) {
      return Response.json({ error: 'Image is required' }, { status: 400 })
    }
    const meal = await analyzeMeal(body.image, body.hint)
    return Response.json(meal)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Analysis failed'
    const status = message === 'AI_UNAVAILABLE' ? 503 : 500
    return Response.json(
      {
        error:
          message === 'AI_UNAVAILABLE'
            ? 'Add AI_GATEWAY_API_KEY to enable photo analysis.'
            : message,
      },
      { status },
    )
  }
}
