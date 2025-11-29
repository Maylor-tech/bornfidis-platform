import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { config } from '@/lib/config';
import { rateLimit } from '@/lib/rate-limit';

const openai = config.openai.apiKey
  ? new OpenAI({
      apiKey: config.openai.apiKey,
    })
  : null;

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

    const { prompt, productType, style } = await request.json();

    if (!prompt || !productType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate design prompt
    const designPrompt = `Create a ${productType} design for Bornfidis activewear brand. 
    Style: ${style || 'modern, sustainable, adventure-focused'}. 
    Colors: Coral (#CE673E), Sage Green (#87A96B), Black, White.
    Theme: ${prompt}.
    Brand message: Adapt, Explore, Empower.
    High quality, print-ready design, transparent background, 300 DPI, vector-style graphics.`;

    // Generate image using DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: designPrompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    if (!response.data || response.data.length === 0 || !response.data[0].url) {
      throw new Error('Failed to generate image');
    }

    const imageUrl = response.data[0].url;

    // Generate color palette suggestions
    const colorPrompt = `Suggest a color palette for ${prompt} design on ${productType}. 
    Base colors: Coral (#CE673E), Sage (#87A96B), Black (#000000), White (#FFFFFF). 
    Return only a JSON array of 5-7 hex color codes that complement the design. 
    Format: ["#CE673E", "#87A96B", ...]`;

    const colorResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a color palette expert for activewear. Return only a JSON array of hex colors, no other text."
        },
        {
          role: "user",
          content: colorPrompt
        }
      ],
      temperature: 0.7,
    });

    let colorPalette: string[] = [];
    try {
      const colorText = colorResponse.choices[0].message.content || '[]';
      colorPalette = JSON.parse(colorText);
    } catch (e) {
      // Fallback palette if parsing fails
      colorPalette = ['#CE673E', '#87A96B', '#000000', '#FFFFFF', '#F5F5DC'];
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      colorPalette,
    });
  } catch (error: any) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate design' 
      },
      { status: 500 }
    );
  }
}

