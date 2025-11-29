import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';

// Safely import Prisma - only if available (may not be during build)
let PrismaAdapter: any = null;
let prisma: any = null;

try {
  const prismaModule = require('@/lib/prisma');
  prisma = prismaModule.prisma;
  const adapterModule = require('@auth/prisma-adapter');
  PrismaAdapter = adapterModule.PrismaAdapter;
} catch (error) {
  // Prisma not available during build - that's ok, we'll use undefined adapter
}

// Build providers array at build time (must be evaluable during build)
// This is used by other API routes that need authOptions
const providers: NextAuthOptions['providers'] = [];

// Add Google provider if configured (evaluated at build time)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// Add Email provider if configured (evaluated at build time)
if (process.env.RESEND_API_KEY) {
  providers.push(
    EmailProvider({
      server: {
        host: 'smtp.resend.com',
        port: 465,
        secure: true,
        auth: {
          user: 'resend',
          pass: process.env.RESEND_API_KEY,
        },
      },
      from: process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM || 'noreply@bornfidis.com',
    })
  );
} else if (process.env.SENDGRID_API_KEY) {
  providers.push(
    EmailProvider({
      server: {
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      },
      from: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM || 'noreply@bornfidis.com',
    })
  );
} else if (process.env.EMAIL_SERVER_HOST) {
  providers.push(
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@bornfidis.com',
    })
  );
}

// Always include a fallback credentials provider to prevent empty providers array
providers.push(
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      // Fallback provider - returns null to indicate no auth
      return null;
    },
  })
);

// Export authOptions for use in other API routes
// Built statically at build time to avoid runtime evaluation issues
export const authOptions: NextAuthOptions = {
  adapter: (process.env.DATABASE_URL && PrismaAdapter && prisma) ? PrismaAdapter(prisma) : undefined,
  providers,
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production',
  debug: process.env.NODE_ENV === 'development',
};

