import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { prisma } from '@/lib/prisma';
import { config } from '@/lib/config';

// Export as a function to avoid build-time evaluation issues
// This ensures providers are only built at runtime, not during build
export function getAuthOptions(): NextAuthOptions {
  // Build providers array at runtime (not at module load time)
  const providers: NextAuthOptions['providers'] = [];

  // Add Google provider if configured
  if (config.auth.google.enabled()) {
    providers.push(
      GoogleProvider({
        clientId: config.auth.google.clientId,
        clientSecret: config.auth.google.clientSecret,
      })
    );
  }

  // Add Email provider if configured
  if (config.auth.email.enabled()) {
    if (config.auth.email.resendApiKey) {
      // Use Resend for email (SMTP)
      providers.push(
        EmailProvider({
          server: {
            host: 'smtp.resend.com',
            port: 465,
            secure: true,
            auth: {
              user: 'resend',
              pass: config.auth.email.resendApiKey,
            },
          },
          from: config.auth.email.resendFromEmail || config.auth.email.from || 'noreply@bornfidis.com',
        })
      );
    } else if (config.auth.email.sendgridApiKey) {
      // Use SendGrid for email
      providers.push(
        EmailProvider({
          server: {
            host: 'smtp.sendgrid.net',
            port: 587,
            auth: {
              user: 'apikey',
              pass: config.auth.email.sendgridApiKey,
            },
          },
          from: config.auth.email.sendgridFromEmail || config.auth.email.from || 'noreply@bornfidis.com',
        })
      );
    } else if (config.auth.email.serverHost) {
      // Use custom SMTP
      providers.push(
        EmailProvider({
          server: {
            host: config.auth.email.serverHost,
            port: parseInt(config.auth.email.serverPort || '587'),
            auth: {
              user: config.auth.email.serverUser,
              pass: config.auth.email.serverPassword,
            },
          },
          from: config.auth.email.from || 'noreply@bornfidis.com',
        })
      );
    }
  }

  // If no providers configured, add a minimal email provider to prevent NextAuth errors
  // This allows the build to succeed even without env vars, but auth won't work until configured
  if (providers.length === 0) {
    providers.push(
      EmailProvider({
        server: {
          host: 'localhost',
          port: 587,
        },
        from: 'noreply@bornfidis.com',
      })
    );
  }

  let adapter;
  try {
    if (config.database.isConfigured() && prisma) {
      adapter = PrismaAdapter(prisma);
    }
  } catch (error) {
    // Prisma not available during build - that's ok
    console.warn('Prisma adapter not available:', error);
  }

  return {
    adapter,
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
    secret: config.auth.secret || process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production',
    debug: config.env.isDevelopment,
  };
}

// Export as const for backward compatibility (evaluated lazily)
export const authOptions = getAuthOptions();

