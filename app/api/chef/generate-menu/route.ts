import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { config } from '@/lib/config';
import { rateLimit } from '@/lib/rate-limit';

const openai = config.openai.apiKey
  ? new OpenAI({
      apiKey: config.openai.apiKey,
    })
  : null;

interface MenuRequest {
  serviceType: string;
  preferences: {
    dietary: string[];
    cuisine: string;
    spiceLevel: string;
    portionSize: string;
    allergies: string[];
    favoriteIngredients: string[];
    dislikedIngredients: string[];
    numberOfGuests?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting (5 requests per minute per IP)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!rateLimit(ip, 5, 60000)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Please try again later.' 
        },
        { status: 429 }
      );
    }

    // Check if API key is configured
    if (!config.openai.apiKey || !openai) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file and restart the server.' 
        },
        { status: 500 }
      );
    }

    const { serviceType, preferences }: MenuRequest = await request.json();

    if (!serviceType) {
      return NextResponse.json(
        { success: false, error: 'Service type is required' },
        { status: 400 }
      );
    }

    // Build menu generation prompt
    const menuPrompt = `Generate a custom menu for a ${serviceType} service with the following preferences:
    
    Dietary Requirements: ${preferences.dietary.join(', ') || 'None specified'}
    Cuisine Style: ${preferences.cuisine || 'Not specified'}
    Spice Level: ${preferences.spiceLevel}
    Allergies: ${preferences.allergies.join(', ') || 'None'}
    Favorite Ingredients: ${preferences.favoriteIngredients.join(', ') || 'None'}
    Disliked Ingredients: ${preferences.dislikedIngredients.join(', ') || 'None'}
    Number of Guests: ${preferences.numberOfGuests || 'Not specified'}
    
    This is for Bornfidis Chef Services by Chef Brian Maylor, known for:
    - Caribbean and Mediterranean fusion cuisine
    - Farm-to-table, seasonal ingredients
    - Sustainable, regenerative cooking practices
    - Bold, vibrant flavors
    
    Generate a complete menu with 3-5 courses. For each course, provide:
    - Name of the dish
    - Description (2-3 sentences)
    - Key ingredients (list)
    - Dietary tags
    - Estimated prep time
    
    Also provide:
    - Total estimated cost (in USD)
    - Total prep time
    - Shopping list of ingredients
    
    Return the response as a JSON object with this structure:
    {
      "courses": [
        {
          "name": "Dish Name",
          "description": "Description",
          "ingredients": ["ingredient1", "ingredient2"],
          "dietary": ["tag1", "tag2"],
          "prepTime": "30 minutes"
        }
      ],
      "estimatedCost": 150.00,
      "prepTime": "2 hours",
      "shoppingList": ["item1", "item2"]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert chef and menu planner. Always return valid JSON only, no additional text."
        },
        {
          role: "user",
          content: menuPrompt
        }
      ],
      temperature: 0.7,
    });

    const menuText = response.choices[0].message.content || '{}';
    
    // Parse JSON response
    let menu;
    try {
      // Clean the response in case there's markdown formatting
      const cleanedText = menuText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      menu = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse menu JSON:', parseError);
      return NextResponse.json(
        { success: false, error: 'Failed to generate valid menu format' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      menu,
    });
  } catch (error: any) {
    console.error('Menu generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate menu' 
      },
      { status: 500 }
    );
  }
}

