'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMeeting, type Person } from './MeetingProvider';

export type { Person };

export type MeetingSegment = 'Speech' | 'Table Topics' | 'Evaluation';

export interface LogEntry {
  id: string;
  personId: string;
  personName: string;
  segment: MeetingSegment;
  word: string;
}

export interface AhhCounterSession {
  date: Date;
  logEntries: LogEntry[];
}

interface AhhCounterContextType {
  session: AhhCounterSession;
  words: string[];
  selectedSpeaker: Person | null;
  selectedSegment: MeetingSegment;
  selectSpeaker: (speaker: Person | null) => void;
  setSelectedSegment: (segment: MeetingSegment) => void;
  addCustomWord: (word: string) => void;
  logWord: (word: string) => void;
  undoLastLog: () => void;
}

const AhhCounterContext = createContext<AhhCounterContextType | undefined>(undefined);

const STORAGE_KEY = 'ahh-counter-session';

const DEFAULT_WORDS = ["Ah", "Um", "Er", "Uh", "Well", "So", "Like", "But", "And", "You know", "Okay", "Repeats"];

export const AhhCounterProvider = ({ children }: { children: ReactNode }) => {
  const { registerReset } = useMeeting();

  const [session, setSession] = useState<AhhCounterSession>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            date: new Date(parsed.date),
            logEntries: (parsed.logEntries ?? []).map((e: any) => ({
              id: e.id,
              personId: e.personId,
              personName: e.personName,
              segment: e.segment ?? 'Speech',
              word: e.word,
            })),
          };
        } catch (e) {
          console.error('Failed to parse saved ahh-counter session', e);
        }
      }
    }
    return { date: new Date(), logEntries: [] };
  });

  const [words, setWords] = useState<string[]>(DEFAULT_WORDS);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Person | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<MeetingSegment>('Speech');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    return registerReset(() => {
      setSession({ date: new Date(), logEntries: [] });
      setSelectedSpeaker(null);
      setWords(DEFAULT_WORDS);
      setSelectedSegment('Speech');
      localStorage.removeItem(STORAGE_KEY);
    });
  }, [registerReset]);

  const selectSpeaker = (speaker: Person | null) => setSelectedSpeaker(speaker);

  const logWord = (word: string) => {
    if (!selectedSpeaker) return;
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      personId: selectedSpeaker.id,
      personName: selectedSpeaker.name,
      segment: selectedSegment,
      word,
    };
    setSession(prev => ({ ...prev, logEntries: [...prev.logEntries, entry] }));
  };

  const addCustomWord = (word: string) => {
    const trimmed = word.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    const isNew = !words.some(w => w.toLowerCase() === lower);
    if (isNew) {
      setWords(prev => [...prev, trimmed]);
    }
    const resolvedWord = isNew ? trimmed : words.find(w => w.toLowerCase() === lower)!;
    logWord(resolvedWord);
  };

  const undoLastLog = () => {
    setSession(prev => ({ ...prev, logEntries: prev.logEntries.slice(0, -1) }));
  };

  return (
    <AhhCounterContext.Provider value={{ session, words, selectedSpeaker, selectedSegment, selectSpeaker, setSelectedSegment, addCustomWord, logWord, undoLastLog }}>
      {children}
    </AhhCounterContext.Provider>
  );
};

export const useAhhCounter = () => {
  const context = useContext(AhhCounterContext);
  if (!context) throw new Error('useAhhCounter must be used within an AhhCounterProvider');
  return context;
};
