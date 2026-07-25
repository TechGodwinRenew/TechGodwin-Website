import NextAuth, { type NextAuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions as NextAuthOptions);

export async function GET(req: Request) {
  return handler(req);
}

export async function POST(req: Request) {
  return handler(req);
}
