// app/_providers/TopicsMasterProvider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Topic {
  id: string;
  text: string;
  source?: 'manual' | 'generated';
  difficulty?: 'easy' | 'hard';
  edited?: boolean;
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
  addGeneratedTopics: (texts: string[], difficulty: 'easy' | 'hard') => void;
  updateTopicText: (id: string, text: string) => void;
  replaceTopicText: (id: string, text: string) => void;
  removeTopic: (id: string) => void;
  removeUnusedTopics: () => void;
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

  const addGeneratedTopics = (texts: string[], difficulty: 'easy' | 'hard') => {
    const topics: Topic[] = texts
      .map(t => t.trim())
      .filter(Boolean)
      .map(text => ({ id: crypto.randomUUID(), text, source: 'generated' as const, difficulty }));
    if (topics.length === 0) return;
    setSession(s => ({ ...s, topics: [...s.topics, ...topics] }));
  };

  // Inline edit by the user: marks generated topics as edited (FR-006).
  const updateTopicText = (id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSession(s => ({
      ...s,
      topics: s.topics.map(t =>
        t.id === id
          ? { ...t, text: trimmed, edited: t.source === 'generated' ? true : t.edited }
          : t
      ),
    }));
  };

  // AI regeneration: swaps in fresh generated text, clearing any edited flag (FR-004).
  const replaceTopicText = (id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSession(s => ({
      ...s,
      topics: s.topics.map(t =>
        t.id === id ? { ...t, text: trimmed, edited: false } : t
      ),
    }));
  };

  const removeTopic = (id: string) =>
    setSession(s => ({ ...s, topics: s.topics.filter(t => t.id !== id) }));

  const removeUnusedTopics = () =>
    setSession(s => {
      const usedIds = new Set(s.log.map(e => e.topic.id));
      return { ...s, topics: s.topics.filter(t => usedIds.has(t.id)) };
    });

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
      value={{
        session,
        setTheme,
        addTopic,
        addGeneratedTopics,
        updateTopicText,
        replaceTopicText,
        removeTopic,
        removeUnusedTopics,
        logSpeaker,
        removeLogEntry,
        resetSession,
      }}
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
