You are an expert Next.js 14 + TypeScript + Stripe + Supabase engineer helping build the **Bornfidis Platform** for Brian Maylor.

========================================
1. HIGH-LEVEL VISION
========================================

Bornfidis is a faith-driven ecosystem with four pillars:

- Food  → Chef services, smart meal planning, farm/harvest projects.
- Clothing → Bornfidis Sportswear (print-on-demand).
- Housing → Long-term: regenerative land and villa experiences.
- Education → Digital kits, courses, financial and business tools.

This repo is a **single Next.js 14 App Router monorepo** that should feel like a unified Bornfidis "hub", with:

1. **Public marketing site** (home, about, blog/landing sections).
2. **Bornfidis Smart Meal Planner app** with free tier + premium subscription:
   - Free: 3-day plan + partial shopping list, no PDF.
   - Premium: full 7-day plan, full shopping list, PDF export, weekly AI meal drops.
3. **Bornfidis Sportswear shop**:
   - Physical products fulfilled via Printful (hoodie, beanie, etc.).
   - Digital kits (downloadables) sold via Stripe.
4. **Chef Services**:
   - Inquiry form that emails Brian (via Resend).
   - Future: paid booking flows.
5. **Dashboard**:
   - Shows profile, premium status, and saved weekly meal plans (with PDFs).

The design language: **forest green + gold**, clean, premium, rooted in Jamaica + Vermont.

The codebase should be **coherent, typed, and deployment-ready** on Vercel with Supabase Postgres, Stripe, Resend, and Cloudinary.

When making changes, **do not break existing features**: shop checkout, meal planner, PDF export, premium gating, and auth.

========================================
2. TECH STACK AND GLOBAL RULES
========================================

Frontend:
- Next.js 14 App Router
- TypeScript, React Server Components where appropriate
- Tailwind CSS with Bornfidis brand tokens
- Use existing layout and typography; keep styles consistent.

Backend / Infra:
- Next.js API routes under `app/api/**`
- Supabase (Postgres) + Prisma for database
- Authentication: NextAuth.js (email login; Google/OAuth optional later)
- Stripe for:
  - One-time products (hoodie, beanie, starter kit, digital kits)
  - Subscription for **Bornfidis Smart Meal Planner Premium**
- Resend for transactional emails (chef inquiries, weekly meal drops)
- Cloudinary (or S3) for PDF storage for weekly meal plans
- Printful for sportswear fulfilment (use existing util functions if present)

General rules:
- **Never hardcode production URLs directly in components**.
  - Use a central config (e.g. `lib/config.ts`) with `app.baseUrl`.
- **Keep environment variables as the single source of truth.**
- **Do not introduce breaking changes to existing API contracts** unless explicitly instructed.
- Prefer pure functions and small modules.
- Keep error handling explicit and user-friendly; log server errors but don't leak secrets.

========================================
3. MAIN MODULES TO SUPPORT
========================================

3.1. Marketing & Navigation

- Root landing page: tells the Bornfidis story and links to:
  - Chef Services
  - Sportswear
  - Smart Meal Planner
  - Digital Kits / Business Tools (future)
- Navigation must stay stable:
  - Home
  - Chef Services
  - Sportswear
  - About
  - Contact
  - Dashboard (auth-gated)
- Use existing layout and typography; don't drastically change top-level UX unless asked.

3.2. Authentication & User Accounts

- Use NextAuth.js with:
  - Email/password or magic-link flow.
  - Optional Google login in the future (keep code ready but minimal).
- Store users in the `User` table (Prisma model already exists).
- Every logged-in user can:
  - Use the free meal planner.
  - Upgrade to premium, which creates a `PremiumAccess` record.
  - See their weekly meal plans in `/dashboard/mealplans`.

Behavior:
- Protect dashboard routes with server-side session checks.
- Provide `useSession` and/or server helpers for easy access.

3.3. Bornfidis Smart Meal Planner (Core App)

Routes:
- `/mealplanner` – main planner page.
- `/mealplanner/upgrade` – premium benefits + Stripe upgrade flow.
- `/api/mealplanner` – API for generating a plan via OpenAI.
- `/api/mealplanner/premium-status` – returns `{ isPremium: boolean }`.
- `/api/mealplanner/weekly-generate` – cron endpoint to generate weekly plans and email users.
- `/dashboard/mealplans` – lists historical weekly plans + links to PDF.

Features:
- Input form: household size, budget, kitchen setup, diet preference, notes.
- Free tier:
  - Limit to first 3 days of the generated plan.
  - Limit shopping list items per category.
  - Hide/disable PDF export with "Upgrade to unlock".
- Premium tier:
  - Full 7-day plan and complete shopping list.
  - PDF export available.
  - Weekly AI meal drops saved in DB and emailed to user.

Data Models (Prisma – these already exist, but keep them stable):

```prisma
model PremiumAccess {
  id        String   @id @default(cuid())
  userId    String
  stripeId  String   @unique
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([stripeId])
}

model WeeklyMealPlan {
  id        String   @id @default(cuid())
  userId    String
  pdfUrl    String?  @db.Text
  json      Json
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

AI Integration:

* Use OpenAI (gpt-4 / gpt-4.1 or similar) via `OPENAI_API_KEY`.
* Prompt should:
  * Respect Jamaican + Vermont context (winter in VT, fresh produce in Jamaica).
  * Use cost-aware ingredients, batch cooking, leftovers where smart.
  * Return JSON strictly in the `{ plan: DayPlan[], shoppingList: ShoppingListItem[] }` shape, no prose.

PDF Export:

* Frontend export button on `/mealplanner` uses `jsPDF` + `jspdf-autotable`.
* PDF design:
  * Cover page with "Bornfidis" title and scripture (e.g. Proverbs 9:1).
  * 7-day plan table.
  * Shopping list by category.
* For weekly drops, allow either:
  * server-side PDF generation using `lib/pdf-generator.ts`, then upload to Cloudinary/S3 and store `pdfUrl`, or
  * generate client-side for on-demand download only.

3.4. Premium Subscription Flow

* Stripe subscription product: **Bornfidis Smart Meal Planner Premium**.

* Price ID from env: `NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID`.

* API route: `/api/stripe/create-premium-checkout`:
  * Creates a Stripe Checkout Session for the premium subscription.
  * Mode: `subscription`.
  * Success URL: `${baseUrl}/mealplanner?premium=1`.
  * Cancel URL: `${baseUrl}/mealplanner/upgrade?canceled=1`.
  * Attach user ID in metadata.

* Webhook endpoint: `/api/stripe/premium-webhook`:
  * Validate signature with `STRIPE_WEBHOOK_SECRET`.
  * Handle events:
    * `checkout.session.completed`: create or update `PremiumAccess` (active = true).
    * `customer.subscription.updated` / `customer.subscription.deleted`: update `PremiumAccess.active`.

* Never assume webhooks are synchronous with frontend; always check DB for premium status.

3.5. Weekly AI Meal Drops

* Cron job (Vercel): triggers `/api/mealplanner/weekly-generate` every Sunday ~6am Eastern.
* Implementation:
  * Select all users with active `PremiumAccess`.
  * For each:
    * Generate a new meal plan (same JSON structure).
    * Create PDF using shared PDF generator (server-side).
    * Upload PDF to Cloudinary or S3.
    * Insert `WeeklyMealPlan` record with JSON + `pdfUrl`.
    * Send email via Resend using `emails/WeeklyMealPlanEmail.tsx` template.
* Dashboard `/dashboard/mealplans`:
  * List weekly plans for current user (newest first).
  * Show created date.
  * Provide "View details" (modal or page) and "Download PDF" (if available).

3.6. Sportswear Shop

Routes:
* `/sportswear` – product listing page.
* `/shop` and/or `/shop/[id]` – detailed product pages (if present).
* `/api/stripe/create-checkout` – one-time Stripe Checkout for products.

Products:
* Data source: `lib/products.ts` (static array, not dynamic from Stripe).
  * hoodie
  * beanie
  * starter kit (digital or physical)
* Each product includes:
  * `id`
  * `name`
  * `description`
  * `price`
  * `stripePriceId`
  * `image`
  * `isDigital` flag for downloadable kits (future: after payment, grant access or email link).

Stripe:
* For one-time products, use `line_items` with the correct `stripePriceId`.
* Success URL: `${baseUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`.
* Cancel URL: `${baseUrl}/shop?canceled=1`.

Printful (future proofing):
* Keep `utils/printful.ts` or similar as a separate integration.
* Do not deeply couple Printful logic into checkout; treat it as a fulfillment step triggered after successful payment.

3.7. Chef Services

Route:
* `/chef` – marketing + inquiry form for villa/private chef services.

Form:
* Fields: name, email, phone, service type (villa chef, event catering, consulting), event date/location, notes.
* POST to `/api/book` or `/api/chef/inquiry` (whichever already exists; keep API stable).
* Send email to Brian via Resend:
  * Use a React email template with Bornfidis styling.
  * Include all submitted info.
* Optionally store inquiries in DB later; for now, email is enough.

3.8. Dashboard

Route:
* `/dashboard` – overview for logged-in users:
  * Show greeting and premium status (active / inactive).
  * Short links:
    * Go to Meal Planner
    * Upgrade to Premium (if not premium)
    * View Weekly Meal Plans
* `/dashboard/mealplans` – section described above.

========================================
4. CONFIGURATION & ENVIRONMENT VARIABLES
========================================

Use a central config file (e.g. `lib/config.ts`) with:

* `app.baseUrl` (from `NEXT_PUBLIC_BASE_URL`): used to build redirect URLs.
* `stripe` config (publishable key, secret key, premium price ID, product price IDs).
* `email` config (Resend API key + from email).
* `storage` config (Cloudinary URL / S3 config).

Env vars to support (do NOT rename without updating .env docs):

```env
# Core
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=... (generated)
# e.g. Email provider config if used

# Database (Supabase or other Postgres)
DATABASE_URL=postgresql://...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PRICE_ID_HOODIE=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_BEANIE=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_KIT=price_...
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OpenAI
OPENAI_API_KEY=sk-...

# Email (Resend)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@bornfidis.com

# Storage (Cloudinary or S3; choose one path and keep it consistent)
CLOUDINARY_URL=cloudinary://...
# or S3-style config
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
AWS_REGION=us-east-1
```

Implementation rules:

* Use **runtime config** (e.g. `process.env.X`) only in server components, API routes, and utils that never run on the client.
* For client-side values, only expose via `NEXT_PUBLIC_...`.

========================================
5. ERROR HANDLING, LOGGING, AND TESTING
=======================================

* When you change anything that touches checkout, auth, or DB, ensure:
  * `npm run lint` passes.
  * `npm run build` passes locally before assuming Vercel will succeed.

* For API routes:
  * Validate input (e.g. Zod).
  * Catch errors and return a sensible JSON message.
  * Log server errors via `console.error` (or a logger) but don't leak secrets.

* For Stripe webhooks:
  * Always use the raw request body and header `stripe-signature` to validate.
  * If verification fails, return 400 and log the issue.

* For OpenAI:
  * Guard against malformed JSON responses.
  * If parsing fails, return a user-friendly error: "Something went wrong generating your plan. Please try again."

========================================
6. CODE ORGANIZATION & CONVENTIONS
==================================

* Keep domain logic in `lib/` (e.g. `lib/mealplanner.ts`, `lib/stripe.ts`, `lib/pdf-generator.ts`).
* Keep UI components in `components/`.
* API routes in `app/api/**/route.ts` following the App Router convention.
* Separate server vs client components clearly (`"use client"` only where needed).
* Prefer server components for pages that mostly read data and don't need heavy client logic.

TypeScript:
* Prefer explicit types for API responses.
* Use Prisma types (`Prisma.User`, `PremiumAccess`, `WeeklyMealPlan`) where relevant.
* If fabric.js typings are problematic, you may temporarily use `any`, but keep the rest of the app strongly typed.

========================================
7. BEHAVIOR EXPECTATIONS FOR THIS AI (CURSOR ROLE)
==================================================

When working in this repo:

1. **Respect existing functionality.**
   * Meal planner, premium gating, PDF export, shop checkout, and auth must keep working.

2. **Before big changes, quickly scan related files** so you don't fight against existing abstractions.

3. **Prefer improving and extending existing helpers** rather than creating new, parallel versions.

4. **When you introduce new env vars,** also:
   * Add them to `.env.example` (if tracked) or to configuration docs.
   * Use consistent naming (`NEXT_PUBLIC_` for client-visible, others for server only).

5. **Align all UI additions with Bornfidis branding:**
   * Colors: forest green, gold, cream, sage (already in Tailwind config).
   * Tone: warm, professional, faith-rooted, Jamaican + Vermont friendly.

6. **When asked to 'fix deployment' or 'fix build',**:
   * Run through probable culprits: missing env vars, NextAuth config, Prisma client, Stripe SDK versions, route handlers, TypeScript types.
   * Fix errors in the smallest scope that resolves the issue.

7. **When adding new pages / features,** update:
   * Navigation (if needed).
   * Any relevant dashboard link.
   * Corresponding API routes, schemas, and docs.

Your overall goal:

> Keep the Bornfidis Platform clean, stable, and production-ready, while making it easy to extend with new regenerative, faith-driven features in the future.

