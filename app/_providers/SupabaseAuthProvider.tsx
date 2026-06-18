// app/_providers/SupabaseAuthProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../_lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: Session['user'] | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Bypassing auth for tonight's meeting
const MOCK_USER = {
  id: 'local-user',
  email: 'local@rolecopilot.dev',
} as any;

const MOCK_SESSION = {
  user: MOCK_USER,
  access_token: 'mock-token',
} as any;

export const SupabaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(MOCK_SESSION);
  const [user, setUser] = useState<Session['user'] | null>(MOCK_USER);
  const [isLoading, setIsLoading] = useState(false);

  // Still setting up the listener in case we want to revert later, 
  // but starting with a mock session for immediate local use.
  useEffect(() => {
    // If we have valid env vars, we can try to get the real session
    const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (hasSupabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setSession(session);
          setUser(session.user);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setSession(session);
          setUser(session.user);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};
