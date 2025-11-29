# Customization System Setup Guide

## Quick Start

This guide will help you set up the AI-powered customization system for Bornfidis.

## Prerequisites

1. Node.js 18+ installed
2. Next.js 14 project set up
3. API keys for services (see below)

## Installation

### 1. Install Dependencies

```bash
npm install
```

New dependencies added:
- `fabric` - Canvas library for design tool
- `axios` - HTTP client for API calls
- `openai` - OpenAI API client

### 2. Install TypeScript Types (if needed)

```bash
npm install --save-dev @types/fabric
```

## Environment Variables

Add these to your `.env.local` file:

```env
# AI Services
OPENAI_API_KEY=sk-your-openai-api-key

# Print-on-Demand
PRINTFUL_API_KEY=your-printful-api-key
# OR
PRINTIFY_API_KEY=your-printify-api-key
PRINTIFY_SHOP_ID=your-shop-id

# Payment (already configured)
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Storage (for design files)
# Option 1: AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=bornfidis-designs

# Option 2: Cloudinary
CLOUDINARY_URL=cloudinary://your-cloudinary-url

# Database (if using)
DATABASE_URL=postgresql://...
# OR
MONGODB_URI=mongodb://...
```

## Getting API Keys

### OpenAI API Key
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Go to API Keys section
4. Create a new secret key
5. Copy and add to `.env.local`

### Printful API Key
1. Go to https://www.printful.com/
2. Create an account
3. Go to Dashboard → Stores → API
4. Generate API key
5. Copy and add to `.env.local`

### Printify API Key (Alternative)
1. Go to https://www.printify.com/
2. Create an account
3. Go to Settings → API
4. Generate API key
5. Copy and add to `.env.local`

## File Structure

```
bornfidis-platform/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   └── generate/
│   │   │       └── route.ts          # AI design generation
│   │   ├── chef/
│   │   │   └── generate-menu/
│   │   │       └── route.ts          # AI menu generation
│   │   └── orders/
│   │       └── create/
│   │           └── route.ts          # Order processing
│   └── customize/
│       └── page.tsx                   # Main customization page
├── components/
│   ├── DesignCanvas.tsx              # Design tool canvas
│   ├── AIDesignAssistant.tsx         # AI design helper
│   └── ChefCustomizer.tsx            # Chef service customizer
├── lib/
│   └── printful.ts                   # Printful API integration
└── CUSTOMIZATION_SYSTEM.md            # Full documentation
```

## Testing the System

### 1. Test AI Design Generation

```bash
# Start the dev server
npm run dev

# Navigate to http://localhost:3000/customize
# Select "Custom Clothing"
# Use the AI Design Assistant to generate a design
```

### 2. Test Chef Menu Generation

```bash
# Navigate to http://localhost:3000/customize
# Select "Chef Services"
# Fill in preferences
# Click "Generate AI Menu"
```

### 3. Test Order Processing

```bash
# Create a design
# Add to cart
# Complete checkout
# Check Printful dashboard for order
```

## Product Templates

You'll need to create product template images for the design canvas:

1. Create templates in `/public/templates/`:
   - `oversized-hoodie-template.png`
   - `classic-hoodie-template.png`
   - `t-shirt-template.png`
   - `jacket-template.png`
   - `leggings-template.png`

2. Template specifications:
   - Size: 800x1000px (or proportional)
   - Format: PNG with transparent background
   - Shows product outline/shape
   - Design areas clearly marked

## Printful Product Setup

### 1. Connect Your Store
- Go to Printful Dashboard
- Add your store (WooCommerce, Shopify, or Custom API)
- Authorize connection

### 2. Sync Products
- Go to Products section
- Select products you want to offer
- Sync to your store

### 3. Configure Variants
- Set up size variants
- Configure print areas
- Set pricing

### 4. Test Order
- Create a test order
- Verify design placement
- Check print quality

## Webhook Setup

### Printful Webhooks

1. Go to Printful Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/printful`
3. Select events:
   - `order:created`
   - `order:updated`
   - `package:shipped`
   - `package:returned`

### Create Webhook Handler

Create `/app/api/webhooks/printful/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/database';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-printful-signature');
  const body = await request.json();

  // Verify webhook signature (implement verification)
  
  const { type, data } = body;

  switch (type) {
    case 'order:created':
      await updateOrderStatus(data.order.id, 'processing');
      break;
    case 'package:shipped':
      await updateOrderStatus(data.order.id, 'shipped', {
        tracking: data.shipment.tracking_number,
      });
      break;
    // Handle other events
  }

  return NextResponse.json({ received: true });
}
```

## Database Setup (Optional)

If you want to save designs and orders:

### PostgreSQL (Supabase)

```sql
-- Create tables (see CUSTOMIZATION_SYSTEM.md for full schema)
CREATE TABLE designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  product_type VARCHAR(50),
  design_data JSONB,
  preview_image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  design_id UUID REFERENCES designs(id),
  printful_order_id VARCHAR(255),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Troubleshooting

### AI Generation Not Working
- Check OpenAI API key is correct
- Verify you have credits in OpenAI account
- Check API rate limits

### Printful Orders Failing
- Verify Printful API key
- Check product variant IDs match
- Ensure design files are accessible URLs
- Check Printful account has sufficient balance

### Design Canvas Not Loading
- Check fabric.js is installed
- Verify product templates exist
- Check browser console for errors

### Chef Menu Generation Issues
- Verify OpenAI API key
- Check prompt formatting
- Ensure JSON parsing is working

## Next Steps

1. **Customize Brand Colors**: Update colors in `tailwind.config.js`
2. **Add More Products**: Extend product mapping in `lib/printful.ts`
3. **Enhance AI Prompts**: Refine prompts in API routes
4. **Add Database**: Implement full database integration
5. **Add Analytics**: Track design usage and conversions
6. **Mobile Optimization**: Ensure design tool works on mobile

## Support

For issues or questions:
- Check `CUSTOMIZATION_SYSTEM.md` for full documentation
- Review API documentation for Printful/OpenAI
- Check Next.js and React documentation

---

**Ready to customize!** 🎨

