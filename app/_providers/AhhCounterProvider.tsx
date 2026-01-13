// app/_providers/AhhCounterProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// From data-model.md
export interface Speaker {
  id: string;
  name: string;
}

export interface AhCounterLogEntry {
  id: string;
  speaker: Speaker;
  fillerWord: string;
  timestamp: Date;
}

export interface AhhCounterSession {
  date: Date;
  speakers: Speaker[];
  logEntries: AhCounterLogEntry[];
}

interface AhhCounterContextType {
  session: AhhCounterSession;
  addSpeaker: (name: string) => void;
  logFillerWord: (speaker: Speaker, fillerWord: string) => void;
  undoLastLog: () => void;
}

const AhhCounterContext = createContext<AhhCounterContextType | undefined>(undefined);

export const AhhCounterProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AhhCounterSession>({
    date: new Date(),
    speakers: [],
    logEntries: [],
  });

  const addSpeaker = (name: string) => {
    const newSpeaker: Speaker = {
      id: crypto.randomUUID(),
      name,
    };
    setSession(prevSession => ({
      ...prevSession,
      speakers: [...prevSession.speakers, newSpeaker],
    }));
  };

  const logFillerWord = (speaker: Speaker, fillerWord: string) => {
    const newLogEntry: AhCounterLogEntry = {
      id: crypto.randomUUID(),
      speaker,
      fillerWord,
      timestamp: new Date(),
    };
    setSession(prevSession => ({
      ...prevSession,
      logEntries: [...prevSession.logEntries, newLogEntry],
    }));
  };

  const undoLastLog = () => {
    setSession(prevSession => ({
      ...prevSession,
      logEntries: prevSession.logEntries.slice(0, -1),
    }));
  };

  const value = {
    session,
    addSpeaker,
    logFillerWord,
    undoLastLog,
  };

  return <AhhCounterContext.Provider value={value}>{children}</AhhCounterContext.Provider>;
};

export const useAhhCounter = () => {
  const context = useContext(AhhCounterContext);
  if (context === undefined) {
    throw new Error('useAhhCounter must be used within an AhhCounterProvider');
  }
  return context;
};