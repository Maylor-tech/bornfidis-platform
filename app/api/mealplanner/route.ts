import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { config } from '@/lib/config'
import { rateLimit } from '@/lib/rate-limit'

const openai = config.openai.apiKey
  ? new OpenAI({
      apiKey: config.openai.apiKey,
    })
  : null

interface MealPlanRequest {
  householdSize: string
  budgetLevel: string
  kitchenSetup: string
  dietPreference: string
  notes?: string
}

interface Meal {
  breakfast: string
  lunch: string
  dinner: string
}

interface DayPlan {
  day: string
  meals: Meal
  notes?: string
}

interface ShoppingListItem {
  category: string
  items: string[]
}

interface MealPlanResponse {
  plan: DayPlan[]
  shoppingList: ShoppingListItem[]
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting (5 requests per minute per IP)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!rateLimit(ip, 5, 60000)) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please try again later.',
        },
        { status: 429 }
      )
    }

    // Check if API key is configured
    if (!config.openai.apiKey || !openai) {
      return NextResponse.json(
        {
          error:
            'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file and restart the server.',
        },
        { status: 500 }
      )
    }

    const body: MealPlanRequest = await request.json()
    const { householdSize, budgetLevel, kitchenSetup, dietPreference, notes } = body

    // Validate required fields
    if (!householdSize || !budgetLevel || !kitchenSetup || !dietPreference) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Build the prompt
    const systemPrompt = `You are a professional Jamaican chef and meal planner creating affordable, realistic 7-day meal plans for cold-weather locations like Vermont, and warm climates like Jamaica. You prioritize simple prep, minimal waste, and dishes that can be batch cooked. Always reflect Bornfidis values: faith, regeneration, community, and practical excellence.

Your meal plans should:
- Be realistic for US grocery stores and Caribbean ingredients where helpful
- Include at least 2-3 meals marked as "Jamaican-inspired" (e.g., soup, stew, one-pot rice dishes)
- Account for batch cooking and meal prep
- Minimize food waste
- Be budget-conscious based on the budget level provided
- Work with the kitchen setup constraints
- Respect dietary preferences

Always return valid JSON only, no additional text or markdown formatting.`

    const userPrompt = `Create a 7-day meal plan with the following requirements:

Household Size: ${householdSize}
Budget Level: ${budgetLevel}
Kitchen Setup: ${kitchenSetup}
Diet Preference: ${dietPreference}
${notes ? `Additional Notes: ${notes}` : ''}

Generate a complete 7-day meal plan with Breakfast, Lunch, and Dinner for each day (Monday through Sunday).

For each day, provide:
- Day name (Monday, Tuesday, etc.)
- Breakfast meal description
- Lunch meal description
- Dinner meal description
- Optional notes (prep tips, batch cooking suggestions, etc.)

Also generate a categorized shopping list with all ingredients needed for the week, organized by category (e.g., Produce, Pantry, Meat/Protein, Dairy, etc.).

Return the response as a JSON object with this exact structure:
{
  "plan": [
    {
      "day": "Monday",
      "meals": {
        "breakfast": "meal description",
        "lunch": "meal description",
        "dinner": "meal description"
      },
      "notes": "optional prep note or tip"
    }
  ],
  "shoppingList": [
    {
      "category": "Produce",
      "items": ["item1", "item2", "item3"]
    },
    {
      "category": "Pantry",
      "items": ["item1", "item2"]
    }
  ]
}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.7,
    })

    const responseText = response.choices[0].message.content || '{}'

    // Parse JSON response
    let mealPlan: MealPlanResponse
    try {
      // Clean the response in case there's markdown formatting
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      mealPlan = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error('Failed to parse meal plan JSON:', parseError)
      console.error('Response text:', responseText)
      return NextResponse.json(
        { error: 'Failed to generate valid meal plan format. Please try again.' },
        { status: 500 }
      )
    }

    // Validate the response structure
    if (!mealPlan.plan || !Array.isArray(mealPlan.plan) || mealPlan.plan.length !== 7) {
      return NextResponse.json(
        { error: 'Invalid meal plan structure received. Please try again.' },
        { status: 500 }
      )
    }

    if (!mealPlan.shoppingList || !Array.isArray(mealPlan.shoppingList)) {
      return NextResponse.json(
        { error: 'Invalid shopping list structure received. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(mealPlan)
  } catch (error: any) {
    console.error('Meal planner error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Failed to generate meal plan',
      },
      { status: 500 }
    )
  }
}

