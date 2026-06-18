// proxy.ts - Next.js Middleware (Local Bypass)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
  // Allow everything locally for the meeting tonight
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/agenda/:path*',
    '/timer/:path*',
    '/ahh-counter/:path*',
    '/auth/login',
    '/auth/signup',
  ],
};
