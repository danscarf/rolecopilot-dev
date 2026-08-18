'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMeeting, type Person } from './MeetingProvider';

export type { Person };

export interface WordOfTheDay {
  word: string;
  meaning: string;
  example: string;
}

export interface ImproperUsageEntry {
  id: string;
  speaker: Person;
  improperUse: string;
  suggestion: string;
  timestamp: Date;
}

export interface OutstandingLanguageEntry {
  id: string;
  speaker: Person;
  phrase: string;
  timestamp: Date;
}

export interface WotdUsageEntry {
  id: string;
  speaker: Person;
  usedAt: Date;
}

export interface GrammarianSession {
  date: Date;
  wordOfTheDay: WordOfTheDay;
  improperUsages: ImproperUsageEntry[];
  outstandingLanguage: OutstandingLanguageEntry[];
  wotdUsages: WotdUsageEntry[];
}

interface GrammarianContextType {
  session: GrammarianSession;
  selectedSpeaker: Person | null;
  selectSpeaker: (speaker: Person | null) => void;
  setWordOfTheDay: (wotd: WordOfTheDay) => void;
  logImproperUsage: (speaker: Person, improperUse: string, suggestion: string) => void;
  logOutstandingLanguage: (speaker: Person, phrase: string) => void;
  logWotdUsage: (speaker: Person) => void;
  removeImproperUsage: (id: string) => void;
  removeOutstandingLanguage: (id: string) => void;
  removeWotdUsage: (id: string) => void;
  undoLastObservation: () => void;
  resetSession: () => void;
}

const GrammarianContext = createContext<GrammarianContextType | undefined>(undefined);

const STORAGE_KEY = 'grammarian-session';

const emptySession = (): GrammarianSession => ({
  date: new Date(),
  wordOfTheDay: { word: '', meaning: '', example: '' },
  improperUsages: [],
  outstandingLanguage: [],
  wotdUsages: [],
});

export const GrammarianProvider = ({ children }: { children: ReactNode }) => {
  const { registerReset } = useMeeting();

  const [session, setSession] = useState<GrammarianSession>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...emptySession(),
            ...parsed,
            date: new Date(parsed.date),
            improperUsages: (parsed.improperUsages ?? []).map((e: any) => ({ ...e, timestamp: new Date(e.timestamp) })),
            outstandingLanguage: (parsed.outstandingLanguage ?? []).map((e: any) => ({ ...e, timestamp: new Date(e.timestamp) })),
            wotdUsages: (parsed.wotdUsages ?? []).map((e: any) => ({ ...e, usedAt: new Date(e.usedAt) })),
          };
        } catch (e) {
          console.error('Failed to parse saved grammarian session', e);
        }
      }
    }
    return emptySession();
  });

  const [selectedSpeaker, setSelectedSpeaker] = useState<Person | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    return registerReset(() => {
      setSession(emptySession());
      setSelectedSpeaker(null);
      localStorage.removeItem(STORAGE_KEY);
    });
  }, [registerReset]);

  const selectSpeaker = (speaker: Person | null) => setSelectedSpeaker(speaker);

  const setWordOfTheDay = (wotd: WordOfTheDay) => {
    setSession(prev => ({ ...prev, wordOfTheDay: wotd }));
  };

  const logImproperUsage = (speaker: Person, improperUse: string, suggestion: string) => {
    const entry: ImproperUsageEntry = {
      id: crypto.randomUUID(),
      speaker,
      improperUse,
      suggestion,
      timestamp: new Date(),
    };
    setSession(prev => ({ ...prev, improperUsages: [...prev.improperUsages, entry] }));
  };

  const logOutstandingLanguage = (speaker: Person, phrase: string) => {
    const entry: OutstandingLanguageEntry = {
      id: crypto.randomUUID(),
      speaker,
      phrase,
      timestamp: new Date(),
    };
    setSession(prev => ({ ...prev, outstandingLanguage: [...prev.outstandingLanguage, entry] }));
  };

  const logWotdUsage = (speaker: Person) => {
    setSession(prev => {
      if (prev.wotdUsages.some(u => u.speaker.id === speaker.id)) return prev;
      const entry: WotdUsageEntry = { id: crypto.randomUUID(), speaker, usedAt: new Date() };
      return { ...prev, wotdUsages: [...prev.wotdUsages, entry] };
    });
  };

  const removeImproperUsage = (id: string) => {
    setSession(prev => ({ ...prev, improperUsages: prev.improperUsages.filter(e => e.id !== id) }));
  };

  const removeOutstandingLanguage = (id: string) => {
    setSession(prev => ({ ...prev, outstandingLanguage: prev.outstandingLanguage.filter(e => e.id !== id) }));
  };

  const removeWotdUsage = (id: string) => {
    setSession(prev => ({ ...prev, wotdUsages: prev.wotdUsages.filter(e => e.id !== id) }));
  };

  const undoLastObservation = () => {
    setSession(prev => {
      const candidates: Array<{ list: 'improper' | 'outstanding' | 'wotd'; id: string; time: number }> = [];
      const last = <T,>(arr: T[]): T | undefined => arr[arr.length - 1];
      const iu = last(prev.improperUsages);
      const ol = last(prev.outstandingLanguage);
      const wu = last(prev.wotdUsages);
      if (iu) candidates.push({ list: 'improper', id: iu.id, time: iu.timestamp.getTime() });
      if (ol) candidates.push({ list: 'outstanding', id: ol.id, time: ol.timestamp.getTime() });
      if (wu) candidates.push({ list: 'wotd', id: wu.id, time: wu.usedAt.getTime() });
      if (candidates.length === 0) return prev;
      const target = candidates.reduce((a, b) => (b.time > a.time ? b : a));
      switch (target.list) {
        case 'improper': return { ...prev, improperUsages: prev.improperUsages.filter(e => e.id !== target.id) };
        case 'outstanding': return { ...prev, outstandingLanguage: prev.outstandingLanguage.filter(e => e.id !== target.id) };
        case 'wotd': return { ...prev, wotdUsages: prev.wotdUsages.filter(e => e.id !== target.id) };
      }
    });
  };

  const resetSession = () => {
    setSelectedSpeaker(null);
    setSession(emptySession());
    localStorage.removeItem(STORAGE_KEY);
  };

  const value: GrammarianContextType = {
    session,
    selectedSpeaker,
    selectSpeaker,
    setWordOfTheDay,
    logImproperUsage,
    logOutstandingLanguage,
    logWotdUsage,
    removeImproperUsage,
    removeOutstandingLanguage,
    removeWotdUsage,
    undoLastObservation,
    resetSession,
  };

  return <GrammarianContext.Provider value={value}>{children}</GrammarianContext.Provider>;
};

export const useGrammarian = () => {
  const context = useContext(GrammarianContext);
  if (!context) throw new Error('useGrammarian must be used within a GrammarianProvider');
  return context;
};
