# Stripe CLI Installation for Windows

## Option 1: Manual Download (Recommended)

1. **Download Stripe CLI:**
   - Go to: https://github.com/stripe/stripe-cli/releases/latest
   - Download: `stripe_X.X.X_windows_x86_64.zip` (or the latest version)

2. **Extract and Install:**
   - Extract the ZIP file
   - Copy `stripe.exe` to a folder in your PATH (e.g., `C:\Program Files\Stripe\`)
   - Or add the extracted folder to your system PATH

3. **Add to PATH (if needed):**
   - Open System Properties → Environment Variables
   - Add the folder containing `stripe.exe` to your PATH
   - Restart your terminal

4. **Verify Installation:**
   ```powershell
   stripe --version
   ```

5. **Login to Stripe:**
   ```powershell
   stripe login
   ```

## Option 2: Using Chocolatey (Requires Admin)

If you have admin rights, open PowerShell as Administrator and run:
```powershell
choco install stripe-cli -y
```

## Option 3: Using Scoop

First install Scoop, then:
```powershell
scoop install stripe
```

## After Installation

### Test Webhook Locally

Once installed, you can forward Stripe webhooks to your local server:

```powershell
stripe listen --forward-to localhost:3000/api/stripe/premium-webhook
```

This will:
- Show you webhook events in real-time
- Forward them to your local server
- Give you a webhook signing secret (starts with `whsec_`)

### Add Webhook Secret to .env.local

Copy the webhook secret from the `stripe listen` output and add it to your `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Quick Start Commands

```powershell
# Login to Stripe
stripe login

# Listen for webhooks (in a separate terminal)
stripe listen --forward-to localhost:3000/api/stripe/premium-webhook

# Test a webhook event
stripe trigger checkout.session.completed
```

