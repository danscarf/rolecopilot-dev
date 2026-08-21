// app/_lib/supabaseServer.ts
// Server-side Supabase session validation for API routes that spend AI credits.
//
// The browser client stores its session in localStorage (not cookies), so route
// handlers cannot read it from the request cookie jar. Clients therefore send the
// access token as `Authorization: Bearer <token>` and we verify it here.
import { createClient, type User } from '@supabase/supabase-js';

export type AuthFailure = 'unconfigured' | 'missing-token' | 'invalid-token';

export interface AuthResult {
  user: User | null;
  failure: AuthFailure | null;
}

function readBearerToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  const token = match?.[1]?.trim();
  return token ? token : null;
}

/**
 * Verifies the caller's Supabase access token.
 * Returns the authenticated user, or the reason verification failed.
 */
export async function getRequestUser(request: Request): Promise<AuthResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return { user: null, failure: 'unconfigured' };
  }

  const token = readBearerToken(request);
  if (!token) {
    return { user: null, failure: 'missing-token' };
  }

  const client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const { data, error } = await client.auth.getUser(token);
    if (error || !data?.user) {
      return { user: null, failure: 'invalid-token' };
    }
    return { user: data.user, failure: null };
  } catch {
    return { user: null, failure: 'invalid-token' };
  }
}
