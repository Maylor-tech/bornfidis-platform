# Bornfidis Platform - Setup Guide

## Overview

This is a complete Next.js 14 platform for Bornfidis, featuring:
- **Chef Services**: Booking system with Calendly integration
- **Sportswear Shop**: Printful product sync and e-commerce
- **User Dashboard**: Orders, bookings, and profile management
- **Authentication**: NextAuth with Google and Email providers
- **Payments**: Stripe integration with webhooks
- **Database**: Prisma ORM with MySQL (PlanetScale/Supabase compatible)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Prisma ORM
- MySQL (PlanetScale or Supabase)
- Stripe
- Printful API
- NextAuth

## Brand Colors

- **Gold**: `#D4AF37` (bf-gold)
- **Forest Green**: `#013220` (bf-green)

## Prerequisites

1. Node.js 18+ installed
2. MySQL database (or PlanetScale/Supabase account)
3. Stripe account
4. Printful account (optional, for product sync)
5. Calendly account (optional, for chef bookings)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/bornfidis"
# For PlanetScale: mysql://username:password@host/database?sslaccept=strict
# For Supabase: postgresql://user:password@host:5432/database

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Provider (optional)
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@bornfidis.com"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Printful
PRINTFUL_API_KEY="your-printful-api-key"

# Calendly
NEXT_PUBLIC_CALENDLY_URL="https://calendly.com/your-username"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## Project Structure

```
/app
  /api
    /auth          # NextAuth routes
    /products      # Product API
    /printful      # Printful integration
    /checkout      # Stripe checkout
    /orders        # Order management
    /bookings      # Booking management
    /stripe        # Stripe webhooks
  /chef            # Chef services page
  /sportswear      # Sportswear shop
  /checkout        # Checkout flow
  /dashboard       # User dashboard
  /login           # Login page
  /register        # Registration page
/components        # React components
/lib               # Utilities and Prisma client
/prisma            # Prisma schema
/utils             # Helper functions
```

## Key Features

### 1. Chef Services (`/chef`)
- Calendly booking widget integration
- Service type selection
- Booking management in dashboard

### 2. Sportswear Shop (`/sportswear`)
- Printful product sync
- Product catalog display
- Individual product pages
- Shopping cart functionality

### 3. User Dashboard (`/dashboard`)
- View orders and order history
- Manage bookings
- Update profile information
- Track order status

### 4. Authentication
- Google OAuth login
- Email magic link authentication
- Protected routes
- Session management

### 5. Payments
- Stripe Checkout integration
- Webhook handling for order confirmation
- Automatic Printful order creation
- Order status tracking

## API Routes

- `GET /api/products` - Fetch all products
- `GET /api/products/[id]` - Get single product
- `POST /api/printful` - Create Printful order
- `POST /api/checkout` - Create Stripe checkout session
- `GET /api/orders` - Get user orders
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking

## Stripe Webhook Setup

1. Install Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
2. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET` in `.env.local`
3. For production, add webhook endpoint in Stripe Dashboard

## Printful Integration

1. Get API key from Printful Dashboard
2. Add to `PRINTFUL_API_KEY` in `.env.local`
3. Products will sync automatically on first load
4. Orders are automatically created in Printful after successful payment

## Calendly Integration

1. Create a Calendly account
2. Get your Calendly URL
3. Add to `NEXT_PUBLIC_CALENDLY_URL` in `.env.local`
4. The booking widget will appear on `/chef` page

## Next Steps

1. Customize brand colors and styling in `tailwind.config.js`
2. Add your logo to `/public/images/logo/logo.png`
3. Set up production database (PlanetScale or Supabase)
4. Configure production environment variables
5. Set up domain and deploy (Vercel recommended)

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database credentials
- Ensure database exists

### NextAuth Issues
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure OAuth providers are configured correctly

### Stripe Issues
- Verify API keys are correct (test vs live)
- Check webhook secret matches
- Ensure webhook endpoint is accessible

### Printful Issues
- Verify API key is correct
- Check product sync endpoint
- Ensure Printful store is connected

## Support

For issues or questions, refer to:
- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs
- Stripe Documentation: https://stripe.com/docs
- Printful API Docs: https://developers.printful.com/




