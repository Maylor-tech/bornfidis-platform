import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

// CRITICAL: Mark as fully dynamic - prevents any build-time evaluation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Build providers array - using process.env directly (available at build time)
const providers: NextAuthOptions['providers'] = [];

// Google OAuth provider (if configured)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// Email provider (Resend)
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
      from: process.env.RESEND_FROM_EMAIL || 'noreply@bornfidis.com',
    })
  );
} 
// Email provider (SendGrid)
else if (process.env.SENDGRID_API_KEY) {
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
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@bornfidis.com',
    })
  );
}
// Email provider (Custom SMTP)
else if (process.env.EMAIL_SERVER_HOST) {
  providers.push(
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
          user: process.env.EMAIL_SERVER_USER || '',
          pass: process.env.EMAIL_SERVER_PASSWORD || '',
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@bornfidis.com',
    })
  );
}

// ALWAYS include fallback credentials provider (prevents empty providers array)
providers.push(
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize() {
      // Fallback - always returns null (no auth via this provider)
      return null;
    },
  })
);

// authOptions - NOT exported (causes build errors if exported)
const authOptions: NextAuthOptions = {
  adapter: process.env.DATABASE_URL ? PrismaAdapter(prisma) : undefined,
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

// Create handler
const handler = NextAuth(authOptions);

// Export handlers
export { handler as GET, handler as POST };
