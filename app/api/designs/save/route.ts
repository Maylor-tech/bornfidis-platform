import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, canvasToFile } from '@/lib/storage';
import { config } from '@/lib/config';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productType,
      designData,
      previewImageDataUrl,
      designFileDataUrl,
      userId,
    } = body;

    if (!productType || !designData) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload preview image if provided
    let previewImageUrl: string | undefined;
    if (previewImageDataUrl) {
      try {
        const previewFile = await uploadFile(previewImageDataUrl, {
          folder: 'designs/previews',
        });
        previewImageUrl = previewFile.url;
      } catch (error) {
        console.error('Failed to upload preview:', error);
        // Continue without preview
      }
    }

    // Upload design file if provided
    let designFileUrl: string | undefined;
    if (designFileDataUrl) {
      try {
        const designFile = await uploadFile(designFileDataUrl, {
          folder: 'designs/files',
        });
        designFileUrl = designFile.url;
      } catch (error) {
        console.error('Failed to upload design file:', error);
        // Continue without file
      }
    }

    // Save design to database (use Prisma if available, fallback to localStorage)
    let design;
    
    if (config.database.isConfigured()) {
      // Use Prisma to save design
      design = await prisma.design.create({
        data: {
          userId: userId || null,
          productType,
          designData: designData as any,
          previewImageUrl: previewImageUrl || null,
          designFileUrl: designFileUrl || null,
        },
      });
    } else {
      // Fallback to localStorage-based database
      const { saveDesign } = await import('@/lib/database');
      design = await saveDesign({
        userId,
        productType,
        designData,
        previewImageUrl,
        designFileUrl,
      });
    }

    return NextResponse.json({
      success: true,
      design,
    });
  } catch (error: any) {
    console.error('Save design error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save design' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (id) {
      let design;
      
      if (config.database.isConfigured()) {
        design = await prisma.design.findUnique({
          where: { id },
        });
      } else {
        const { getDesign } = await import('@/lib/database');
        design = await getDesign(id);
      }
      
      if (!design) {
        return NextResponse.json(
          { success: false, error: 'Design not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, design });
    }

    // Get all designs for user (if userId provided)
    if (userId) {
      let designs;
      
      if (config.database.isConfigured()) {
        designs = await prisma.design.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });
      } else {
        const { getDesigns } = await import('@/lib/database');
        designs = await getDesigns(userId);
      }
      
      return NextResponse.json({ success: true, designs });
    }

    return NextResponse.json(
      { success: false, error: 'Missing id or userId parameter' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Get design error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get design' },
      { status: 500 }
    );
  }
}

