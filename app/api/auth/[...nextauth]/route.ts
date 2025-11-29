import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/auth';

// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const handler = NextAuth(getAuthOptions());

export { handler as GET, handler as POST };

