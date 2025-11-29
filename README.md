# Bornfidis Platform

A Next.js 14 application built with TailwindCSS for the Bornfidis platform.

> **📋 Master Architecture Blueprint**: See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the complete system design, module specifications, and development guidelines.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID_HOODIE=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_BEANIE=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_KIT=price_...

# Email Configuration (Resend or SendGrid)
# Option 1: Resend (recommended)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Option 2: SendGrid
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Admin email for booking notifications
ADMIN_EMAIL=admin@yourdomain.com

# Base URL (for production)
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### Setting up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Create Products and Prices in Stripe Dashboard
4. Copy the Price IDs and add them to your environment variables
5. Set up webhook endpoint in Stripe Dashboard:
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`

## Project Structure

- `/app` - Next.js 14 app directory with all pages
- `/components` - Reusable React components
- `/lib` - Utility functions and data
- `/app/api` - API routes (Stripe integration)
- `/app/globals.css` - Global styles with TailwindCSS and custom CSS variables

## Pages

- `/` - Home page
- `/chef` - Chef page
- `/mealprep` - Meal prep page
- `/classes` - Classes page
- `/events` - Events page
- `/shop` - Shop page with products
- `/shop/[id]` - Individual product pages
- `/shop/success` - Payment success page
- `/about` - About page
- `/contact` - Contact page
- `/legal` - Legal page

## API Routes

- `/api/stripe/create-checkout` - Creates a Stripe Checkout session
- `/api/stripe/webhook` - Handles Stripe webhook events
- `/api/book` - Handles booking form submissions, sends email notifications, and saves bookings to `/data/bookings`

## Custom Configuration

### Colors
- `--bf-green`: #004225
- `--bf-gold`: #B8860B
- `--bf-black`: #000000

### Fonts
- **Body**: Montserrat (Google Fonts)
- **Headlines**: Abril Fatface (Google Fonts)

## Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Stripe Testing

Use Stripe's test card numbers for testing:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

Any future expiration date and CVC will work.
