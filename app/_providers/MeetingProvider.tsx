'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';

export type Segment = 'Speech' | 'Evaluation';

export interface Person {
  id: string;
  name: string;
  role?: string;
  segments: Segment[];
}

interface MeetingContextType {
  people: Person[];
  addPerson: (name: string, role?: string) => Person;
  removePerson: (id: string) => void;
  toggleSegment: (id: string, segment: Segment) => void;
  resetMeeting: () => void;
  registerReset: (fn: () => void) => () => void;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

const STORAGE_KEY = 'meeting-session';

export const MeetingProvider = ({ children }: { children: ReactNode }) => {
  const [people, setPeople] = useState<Person[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
            const parsed: Person[] = JSON.parse(saved);
            return parsed.map(p => ({ ...p, segments: p.segments ?? [] }));
          } catch {}
      }
    }
    return [];
  });

  const resets = useRef<Array<() => void>>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
  }, [people]);

  const addPerson = (name: string, role?: string): Person => {
    const person: Person = { id: crypto.randomUUID(), name, role, segments: [] };
    setPeople(prev => [...prev, person]);
    return person;
  };

  const removePerson = (id: string) => {
    setPeople(prev => prev.filter(p => p.id !== id));
  };

  const toggleSegment = (id: string, segment: Segment) => {
    setPeople(prev => prev.map(p =>
      p.id !== id ? p : {
        ...p,
        segments: p.segments.includes(segment)
          ? p.segments.filter(s => s !== segment)
          : [...p.segments, segment],
      }
    ));
  };

  const registerReset = useCallback((fn: () => void): (() => void) => {
    resets.current.push(fn);
    return () => { resets.current = resets.current.filter(f => f !== fn); };
  }, []);

  const resetMeeting = () => {
    setPeople([]);
    localStorage.removeItem(STORAGE_KEY);
    resets.current.forEach(fn => fn());
  };

  return (
    <MeetingContext.Provider value={{ people, addPerson, removePerson, toggleSegment, resetMeeting, registerReset }}>
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (!context) throw new Error('useMeeting must be used within a MeetingProvider');
  return context;
};
