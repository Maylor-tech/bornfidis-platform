import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { prisma } from '@/lib/prisma';
import { config } from '@/lib/config';

// Build providers array conditionally
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

export const authOptions: NextAuthOptions = {
  adapter: config.database.isConfigured() ? PrismaAdapter(prisma) : undefined,
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
  secret: config.auth.secret || 'fallback-secret-change-in-production',
  debug: config.env.isDevelopment,
};

