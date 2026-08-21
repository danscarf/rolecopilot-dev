// app/_lib/useRealSession.ts
'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';

/**
 * Whether a genuine Supabase session exists.
 *
 * SupabaseAuthProvider seeds a mock session so every page stays open, so it
 * cannot be used to decide whether AI features (which need a real, server-
 * verifiable token) are available. This reads the actual session instead.
 */
export function useRealSession(): { signedIn: boolean; checking: boolean } {
  const [signedIn, setSignedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSignedIn(Boolean(data.session?.access_token));
        setChecking(false);
      })
      .catch(() => {
        if (!active) return;
        setSignedIn(false);
        setChecking(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setSignedIn(Boolean(session?.access_token));
      setChecking(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return { signedIn, checking };
}
