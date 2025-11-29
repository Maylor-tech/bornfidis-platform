// Quick script to create .env.local file
const fs = require('fs');
const path = require('path');

const envContent = `# Environment Variables for Bornfidis Platform
# Replace placeholder values with your actual API keys

# AI Services (Required for AI design generation)
OPENAI_API_KEY=sk-placeholder-replace-with-your-key

# Print-on-Demand (Required for order processing)
PRINTFUL_API_KEY=placeholder-replace-with-your-key

# Payment Processing (Required for checkout)
STRIPE_SECRET_KEY=sk_test_placeholder-replace-with-your-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder-replace-with-your-key

# Optional: File Storage (for production)
# CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Optional: Webhooks
# PRINTFUL_WEBHOOK_SECRET=your-webhook-secret
`;

const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file!');
  console.log('📝 Please edit it and add your API keys');
} else {
  console.log('⚠️  .env.local already exists - not overwriting');
  console.log('📝 Please check it has all required variables');
}

