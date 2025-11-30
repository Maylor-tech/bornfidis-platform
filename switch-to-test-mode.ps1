# Stripe Test Mode Switcher
# This script helps you switch from LIVE to TEST mode

Write-Host "`n🔄 Switching Stripe to TEST Mode`n" -ForegroundColor Cyan

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "❌ .env.local not found!" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Current Configuration:" -ForegroundColor Yellow
Get-Content .env.local | Select-String -Pattern "STRIPE.*KEY" | ForEach-Object {
    if ($_.Line -match 'pk_live_|sk_live_') {
        Write-Host "  ⚠️  LIVE: $($_.Line -replace '=.*', '=***')" -ForegroundColor Red
    } elseif ($_.Line -match 'pk_test_|sk_test_') {
        Write-Host "  ✅ TEST: $($_.Line -replace '=.*', '=***')" -ForegroundColor Green
    }
}

Write-Host "`n📝 To get your TEST keys:" -ForegroundColor Cyan
Write-Host "  1. Go to: https://dashboard.stripe.com/test/apikeys" -ForegroundColor White
Write-Host "  2. Make sure you're in TEST MODE (toggle in top right)" -ForegroundColor White
Write-Host "  3. Copy your keys:`n" -ForegroundColor White

# Prompt for test keys
$testSecretKey = Read-Host "Enter TEST Secret Key (sk_test_...)"
$testPublishableKey = Read-Host "Enter TEST Publishable Key (pk_test_...)"

# Validate keys
if (-not $testSecretKey.StartsWith('sk_test_')) {
    Write-Host "`n❌ Invalid secret key! Must start with 'sk_test_'" -ForegroundColor Red
    exit 1
}

if (-not $testPublishableKey.StartsWith('pk_test_')) {
    Write-Host "`n❌ Invalid publishable key! Must start with 'pk_test_'" -ForegroundColor Red
    exit 1
}

# Read current .env.local
$envContent = Get-Content .env.local -Raw

# Replace live keys with test keys
$envContent = $envContent -replace 'STRIPE_SECRET_KEY=sk_live_[^\s#]+', "STRIPE_SECRET_KEY=$testSecretKey"
$envContent = $envContent -replace 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[^\s#]+', "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$testPublishableKey"

# Write back to file
$envContent | Set-Content .env.local -NoNewline

Write-Host "`n✅ Successfully updated .env.local with TEST keys!" -ForegroundColor Green
Write-Host "`n🔄 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Restart your dev server (Ctrl+C then 'npm run dev')" -ForegroundColor White
Write-Host "  2. Visit /mealplanner/upgrade to see test mode banner" -ForegroundColor White
Write-Host "  3. Use test card: 4242 4242 4242 4242`n" -ForegroundColor White

