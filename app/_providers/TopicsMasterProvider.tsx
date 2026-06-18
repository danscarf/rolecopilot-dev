// app/_providers/TopicsMasterProvider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Topic {
  id: string;
  text: string;
}

export interface TopicLogEntry {
  id: string;
  speakerName: string;
  topic: Topic;
  timestamp: Date;
}

export interface TopicsMasterSession {
  date: Date;
  theme: string;
  topics: Topic[];
  log: TopicLogEntry[];
}

interface TopicsMasterContextType {
  session: TopicsMasterSession;
  setTheme: (theme: string) => void;
  addTopic: (text: string) => void;
  removeTopic: (id: string) => void;
  logSpeaker: (speakerName: string, topic: Topic) => void;
  removeLogEntry: (id: string) => void;
  resetSession: () => void;
}

const TopicsMasterContext = createContext<TopicsMasterContextType | undefined>(undefined);

const STORAGE_KEY = 'topics-master-session';

const freshSession = (): TopicsMasterSession => ({
  date: new Date(),
  theme: '',
  topics: [],
  log: [],
});

export const TopicsMasterProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<TopicsMasterSession>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...parsed,
            date: new Date(parsed.date),
            log: parsed.log.map((e: { timestamp: string; [key: string]: unknown }) => ({
              ...e,
              timestamp: new Date(e.timestamp),
            })),
          };
        } catch {
          // ignore parse errors
        }
      }
    }
    return freshSession();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const setTheme = (theme: string) =>
    setSession(s => ({ ...s, theme }));

  const addTopic = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSession(s => ({
      ...s,
      topics: [...s.topics, { id: crypto.randomUUID(), text: trimmed }],
    }));
  };

  const removeTopic = (id: string) =>
    setSession(s => ({ ...s, topics: s.topics.filter(t => t.id !== id) }));

  const logSpeaker = (speakerName: string, topic: Topic) => {
    const trimmed = speakerName.trim();
    if (!trimmed) return;
    const entry: TopicLogEntry = {
      id: crypto.randomUUID(),
      speakerName: trimmed,
      topic,
      timestamp: new Date(),
    };
    setSession(s => ({ ...s, log: [...s.log, entry] }));
  };

  const removeLogEntry = (id: string) =>
    setSession(s => ({ ...s, log: s.log.filter(e => e.id !== id) }));

  const resetSession = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(freshSession());
  };

  return (
    <TopicsMasterContext.Provider
      value={{ session, setTheme, addTopic, removeTopic, logSpeaker, removeLogEntry, resetSession }}
    >
      {children}
    </TopicsMasterContext.Provider>
  );
};

export const useTopicsMaster = () => {
  const ctx = useContext(TopicsMasterContext);
  if (!ctx) throw new Error('useTopicsMaster must be used within TopicsMasterProvider');
  return ctx;
};
