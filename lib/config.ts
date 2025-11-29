/**
 * Centralized configuration management
 * All environment variables are validated and typed here
 */

// Validate required environment variables
function getEnvVar(key: string, required: boolean = true): string {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Please add it to your .env.local file.`
    );
  }
  return value || '';
}

// Validate optional environment variables
function getOptionalEnvVar(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

/**
 * Configuration object with all environment variables
 */
export const config = {
  // AI Services
  openai: {
    apiKey: getEnvVar('OPENAI_API_KEY', false), // Optional for development
    enabled: getOptionalEnvVar('NEXT_PUBLIC_ENABLE_AI', 'true') === 'true',
  },

  // Stripe Configuration
  stripe: {
    secretKey: getEnvVar('STRIPE_SECRET_KEY', false), // Optional for development
    publishableKey: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', false),
    webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET', false),
    priceIds: {
      hoodie: getOptionalEnvVar('NEXT_PUBLIC_STRIPE_PRICE_ID_HOODIE'),
      beanie: getOptionalEnvVar('NEXT_PUBLIC_STRIPE_PRICE_ID_BEANIE'),
      kit: getOptionalEnvVar('NEXT_PUBLIC_STRIPE_PRICE_ID_KIT'),
      premium: getOptionalEnvVar('NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID'),
    },
    isConfigured: () => {
      return !!(
        process.env.STRIPE_SECRET_KEY &&
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );
    },
  },

  // Printful Configuration
  printful: {
    apiKey: getEnvVar('PRINTFUL_API_KEY', false), // Optional for development
    webhookSecret: getEnvVar('PRINTFUL_WEBHOOK_SECRET', false),
    apiUrl: 'https://api.printful.com',
    isConfigured: () => !!process.env.PRINTFUL_API_KEY,
  },

  // Database Configuration
  database: {
    url: getEnvVar('DATABASE_URL', false), // Optional - uses localStorage fallback
    isConfigured: () => !!process.env.DATABASE_URL,
  },

  // NextAuth Configuration
  auth: {
    secret: getEnvVar('NEXTAUTH_SECRET', false),
    url: getOptionalEnvVar('NEXTAUTH_URL', 'http://localhost:3000'),
    google: {
      clientId: getOptionalEnvVar('GOOGLE_CLIENT_ID'),
      clientSecret: getOptionalEnvVar('GOOGLE_CLIENT_SECRET'),
      enabled: () => !!(
        process.env.GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_SECRET
      ),
    },
    email: {
      // Resend
      resendApiKey: getOptionalEnvVar('RESEND_API_KEY'),
      resendFromEmail: getOptionalEnvVar('RESEND_FROM_EMAIL'),
      // SendGrid
      sendgridApiKey: getOptionalEnvVar('SENDGRID_API_KEY'),
      sendgridFromEmail: getOptionalEnvVar('SENDGRID_FROM_EMAIL'),
      // SMTP
      serverHost: getOptionalEnvVar('EMAIL_SERVER_HOST'),
      serverPort: getOptionalEnvVar('EMAIL_SERVER_PORT'),
      serverUser: getOptionalEnvVar('EMAIL_SERVER_USER'),
      serverPassword: getOptionalEnvVar('EMAIL_SERVER_PASSWORD'),
      from: getOptionalEnvVar('EMAIL_FROM'),
      enabled: () => !!(
        process.env.RESEND_API_KEY ||
        process.env.SENDGRID_API_KEY ||
        process.env.EMAIL_SERVER_HOST
      ),
    },
    isConfigured: () => !!process.env.NEXTAUTH_SECRET,
  },

  // File Storage Configuration
  storage: {
    cloudinary: {
      url: getOptionalEnvVar('CLOUDINARY_URL'),
      uploadPreset: getOptionalEnvVar('CLOUDINARY_UPLOAD_PRESET', 'bornfidis_designs'),
      enabled: () => !!process.env.CLOUDINARY_URL,
    },
    s3: {
      accessKeyId: getOptionalEnvVar('AWS_ACCESS_KEY_ID'),
      secretAccessKey: getOptionalEnvVar('AWS_SECRET_ACCESS_KEY'),
      bucket: getOptionalEnvVar('AWS_S3_BUCKET'),
      region: getOptionalEnvVar('AWS_REGION', 'us-east-1'),
      enabled: () => !!(
        process.env.AWS_ACCESS_KEY_ID &&
        process.env.AWS_SECRET_ACCESS_KEY &&
        process.env.AWS_S3_BUCKET
      ),
    },
    // Defaults to localStorage if no cloud storage configured
    provider: () => {
      if (config.storage.cloudinary.enabled()) return 'cloudinary';
      if (config.storage.s3.enabled()) return 's3';
      return 'local';
    },
  },

  // Application URLs
  app: {
    baseUrl: getOptionalEnvVar('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000'),
    url: getOptionalEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  },

  // Admin Configuration
  admin: {
    email: getOptionalEnvVar('ADMIN_EMAIL', 'admin@bornfidis.com'),
  },

  // Analytics
  analytics: {
    googleAnalyticsId: getOptionalEnvVar('NEXT_PUBLIC_GA_ID'),
    plausibleDomain: getOptionalEnvVar('NEXT_PUBLIC_PLAUSIBLE_DOMAIN'),
  },

  // Feature Flags
  features: {
    ai: getOptionalEnvVar('NEXT_PUBLIC_ENABLE_AI', 'true') === 'true',
    customization: getOptionalEnvVar('NEXT_PUBLIC_ENABLE_CUSTOMIZATION', 'true') === 'true',
    bookings: getOptionalEnvVar('NEXT_PUBLIC_ENABLE_BOOKINGS', 'true') === 'true',
  },

  // Environment
  env: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    nodeEnv: process.env.NODE_ENV || 'development',
  },
} as const;

/**
 * Validate configuration on startup
 */
export function validateConfig() {
  const errors: string[] = [];

  // Warn about missing critical configs (but don't fail in development)
  if (config.env.isProduction) {
    if (!config.stripe.isConfigured()) {
      errors.push('Stripe is not configured. Payment processing will not work.');
    }
    if (!config.database.isConfigured()) {
      errors.push('Database is not configured. Using localStorage fallback (not recommended for production).');
    }
    if (!config.auth.isConfigured()) {
      errors.push('NextAuth secret is not configured. Authentication will not work.');
    }
  }

  // Warn about optional but recommended configs
  if (!config.openai.apiKey && config.features.ai) {
    console.warn('⚠️  OpenAI API key not configured. AI features will not work.');
  }

  if (!config.printful.isConfigured()) {
    console.warn('⚠️  Printful API key not configured. Order fulfillment will not work.');
  }

  if (!config.storage.cloudinary.enabled() && !config.storage.s3.enabled()) {
    console.warn('⚠️  No cloud storage configured. Using localStorage (not recommended for production).');
  }

  if (errors.length > 0) {
    console.error('❌ Configuration errors:');
    errors.forEach(error => console.error(`   - ${error}`));
  }

  return errors.length === 0;
}

// Export individual config sections for convenience
export const {
  openai,
  stripe,
  printful,
  database,
  auth,
  storage,
  app,
  admin,
  analytics,
  features,
  env,
} = config;


