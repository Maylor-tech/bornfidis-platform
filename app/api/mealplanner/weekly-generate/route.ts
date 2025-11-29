import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { config } from '@/lib/config'
import { prisma } from '@/lib/prisma'
import { generateMealPlanPDF } from '@/lib/pdf-generator'
import { uploadFile } from '@/lib/storage'
import { Resend } from 'resend'

const openai = config.openai.apiKey
  ? new OpenAI({
      apiKey: config.openai.apiKey,
    })
  : null

const resend = config.auth.email.resendApiKey
  ? new Resend(config.auth.email.resendApiKey)
  : null

interface MealPlanResponse {
  plan: Array<{
    day: string
    meals: {
      breakfast: string
      lunch: string
      dinner: string
    }
    notes?: string
  }>
  shoppingList: Array<{
    category: string
    items: string[]
  }>
}

async function generateMealPlanForUser(userId: string, userEmail: string): Promise<void> {
  try {
    // Build the prompt (using default preferences for weekly drops)
    const systemPrompt = `You are a professional Jamaican chef and meal planner creating affordable, realistic 7-day meal plans for cold-weather locations like Vermont, and warm climates like Jamaica. You prioritize simple prep, minimal waste, and dishes that can be batch cooked. Always reflect Bornfidis values: faith, regeneration, community, and practical excellence.

Your meal plans should:
- Be realistic for US grocery stores and Caribbean ingredients where helpful
- Include at least 2-3 meals marked as "Jamaican-inspired" (e.g., soup, stew, one-pot rice dishes)
- Account for batch cooking and meal prep
- Minimize food waste
- Be budget-conscious
- Work with standard kitchen setups
- Include variety and seasonal ingredients

Always return valid JSON only, no additional text or markdown formatting.`

    const userPrompt = `Create a fresh 7-day meal plan for this week. Use moderate budget level and assume a fully equipped kitchen. Include variety and seasonal ingredients. Generate a complete 7-day meal plan with Breakfast, Lunch, and Dinner for each day (Monday through Sunday).

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

    if (!openai) {
      throw new Error('OpenAI not configured')
    }

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
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      mealPlan = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error(`Failed to parse meal plan JSON for user ${userId}:`, parseError)
      throw new Error('Failed to generate valid meal plan format')
    }

    // Validate the response structure
    if (!mealPlan.plan || !Array.isArray(mealPlan.plan) || mealPlan.plan.length !== 7) {
      throw new Error('Invalid meal plan structure received')
    }

    if (!mealPlan.shoppingList || !Array.isArray(mealPlan.shoppingList)) {
      throw new Error('Invalid shopping list structure received')
    }

    // Generate PDF
    const pdfArrayBuffer = generateMealPlanPDF(mealPlan)
    // Convert ArrayBuffer to Buffer for Node.js
    const pdfBuffer = Buffer.from(pdfArrayBuffer)

    // Upload PDF to storage
    let pdfUrl: string | undefined
    try {
      // For server-side, pass Buffer directly (storage.ts handles File/Blob/string)
      // Convert Buffer to base64 data URL for upload
      const base64Pdf = pdfBuffer.toString('base64')
      const dataUrl = `data:application/pdf;base64,${base64Pdf}`
      
      const uploadResult = await uploadFile(dataUrl, {
        folder: 'meal-plans',
        publicId: `meal-plan-${userId}-${Date.now()}`,
      })
      pdfUrl = uploadResult.url || uploadResult.secureUrl
    } catch (uploadError) {
      console.error(`Failed to upload PDF for user ${userId}:`, uploadError)
      // Continue without PDF URL - will be null in database
    }

    // Save to database
    await prisma.weeklyMealPlan.create({
      data: {
        userId,
        pdfUrl: pdfUrl || null,
        json: mealPlan as any,
      },
    })

    // Send email if Resend is configured
    if (resend && userEmail) {
      try {
        const baseUrl = config.app.baseUrl || 'http://localhost:3000'
        const viewUrl = `${baseUrl}/dashboard/mealplans`

        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background-color: #0A3D2F; color: white; padding: 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Bornfidis</h1>
      <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Weekly Meal Plan</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 30px; background-color: #FAF8F2;">
      <p style="font-size: 16px; line-height: 1.6; color: #1A1A1A; margin: 0 0 15px 0;">
        Your weekly nourishment is ready.
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #666; margin: 0;">
        We've prepared a personalized 7-day meal plan with shopping list, crafted with
        wisdom and care for your household.
      </p>
    </div>

    <!-- Scripture Divider -->
    <div style="border-top: 2px solid #D4AF37; padding: 20px; text-align: center; background-color: #E7EFE5;">
      <p style="font-style: italic; font-size: 16px; color: #0A3D2F; margin: 10px 0;">
        "Wisdom prepares the table." — Proverbs 9:1
      </p>
    </div>

    <!-- CTA Button -->
    <div style="padding: 30px; text-align: center;">
      <a href="${viewUrl}" style="display: inline-block; background-color: #0A3D2F; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
        View Your Meal Plan
      </a>
    </div>

    <!-- Footer -->
    <div style="padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd;">
      <p style="margin: 5px 0;">Bornfidis Smart Meal Planner</p>
      <p style="margin: 5px 0;">Adapt. Explore. Empower.</p>
    </div>
  </div>
</body>
</html>
        `

        await resend.emails.send({
          from: config.auth.email.resendFromEmail || config.auth.email.from || 'noreply@bornfidis.com',
          to: userEmail,
          subject: '🌿 Your Weekly Bornfidis Meal Plan is Ready!',
          html: emailHtml,
        })

        console.log(`Email sent to ${userEmail} for user ${userId}`)
      } catch (emailError) {
        console.error(`Failed to send email to ${userEmail}:`, emailError)
        // Don't fail the whole process if email fails
      }
    }

    console.log(`Weekly meal plan generated successfully for user ${userId}`)
  } catch (error) {
    console.error(`Error generating meal plan for user ${userId}:`, error)
    throw error
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if OpenAI is configured
    if (!config.openai.apiKey || !openai) {
      return NextResponse.json(
        {
          error:
            'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.',
        },
        { status: 500 }
      )
    }

    // Verify this is a cron job request (Vercel cron jobs include a secret header)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all premium users
    const premiumUsers = await prisma.premiumAccess.findMany({
      where: {
        active: true,
      },
      include: {
        user: true,
      },
    })

    if (premiumUsers.length === 0) {
      return NextResponse.json({
        message: 'No premium users found',
        processed: 0,
      })
    }

    console.log(`Processing weekly meal plans for ${premiumUsers.length} premium users`)

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Process each user
    for (const premiumAccess of premiumUsers) {
      try {
        const user = premiumAccess.user
        if (!user || !user.email) {
          results.failed++
          results.errors.push(`User ${premiumAccess.userId} has no email`)
          continue
        }

        await generateMealPlanForUser(user.id, user.email)
        results.success++
      } catch (error) {
        results.failed++
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        results.errors.push(`User ${premiumAccess.userId}: ${errorMessage}`)
        console.error(`Failed to process user ${premiumAccess.userId}:`, error)
      }
    }

    return NextResponse.json({
      message: 'Weekly meal plan generation completed',
      processed: premiumUsers.length,
      success: results.success,
      failed: results.failed,
      errors: results.errors,
    })
  } catch (error) {
    console.error('Error in weekly meal plan generation:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

