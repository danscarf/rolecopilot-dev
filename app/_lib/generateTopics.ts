// app/_lib/generateTopics.ts
// Client-side helper for the /generate-topics API route.
import { supabase } from './supabase';

export interface GenerateTopicsParams {
  theme?: string;
  wordOfTheDay?: string;
  count: number;
  difficulty: 'easy' | 'hard';
  /** Existing question texts the new ones must differ from. */
  avoid?: string[];
}

export const SIGN_IN_MESSAGE = 'Please sign in to generate table topics questions.';

/** Reads the real Supabase session (the auth provider mocks one, so don't use it here). */
export async function getAccessToken(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
}

export async function generateTopics(params: GenerateTopicsParams): Promise<string[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error(SIGN_IN_MESSAGE);
  }

  const res = await fetch('/generate-topics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || `Generation failed (${res.status}).`);
  }
  if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
    throw new Error('No questions were generated. Please try again.');
  }
  return data.questions;
}
