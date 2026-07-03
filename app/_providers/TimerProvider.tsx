import React, { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { logEvent } from '../_lib/analytics';
import { useAuth } from './SupabaseAuthProvider';

// Define the shape of a Timer Preset
export interface TimerPreset {
  name: string;
  type: 'Speech' | 'Evaluation' | 'Table Topics' | 'Custom';
  greenTime: number; // seconds
  yellowTime: number; // seconds
  redTime: number; // seconds
  gracePeriod: { under: number; over: number }; // seconds
}

// Define the shape of a Logged Timer Session
export interface LoggedTimerSession {
  id: string;
  speakerName: string | null;
  presetName: string;
  timeRequirement: string; // e.g., "5-7 min"
  duration: number; // seconds
  isWithinTime: boolean | null;
  timestamp: Date;
  userId?: string;
}

interface TimerContextType {
  isRunning: boolean;
  elapsedTime: number;
  colorSignal: 'none' | 'green' | 'yellow' | 'red';
  selectedPreset: TimerPreset | null;
  loggedTimes: LoggedTimerSession[];
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  selectPreset: (preset: TimerPreset | null) => void;
  logTime: (speakerName: string | null) => void;
  removeLoggedTime: (id: string) => void;
  clearLoggedTimes: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const MAX_TIMER_DURATION = 7200;
const STORAGE_KEY = 'timer-logged-times';

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [colorSignal, setColorSignal] = useState<'none' | 'green' | 'yellow' | 'red'>('none');
  const [selectedPreset, setSelectedPreset] = useState<TimerPreset | null>(null);
  
  const [loggedTimes, setLoggedTimes] = useState<LoggedTimerSession[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved).map((t: any) => ({ ...t, timestamp: new Date(t.timestamp) }));
        } catch (e) {
          console.error('Failed to parse saved timer sessions', e);
        }
      }
    }
    return [];
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedTimes));
  }, [loggedTimes]);

  const stopTimer = useCallback(() => setIsRunning(false), []);
  const startTimer = useCallback(() => setIsRunning(true), []);
  
  const resetTimer = useCallback(() => {
    stopTimer();
    setElapsedTime(0);
    setColorSignal('none');
  }, [stopTimer]);

  const calculateIsWithinTime = useCallback((duration: number, preset: TimerPreset): boolean => {
    const minTime = preset.greenTime - preset.gracePeriod.under;
    const maxTime = preset.redTime + preset.gracePeriod.over;
    return duration >= minTime && duration <= maxTime;
  }, []);

  const formatTimeRequirement = useCallback((preset: TimerPreset): string => {
    if (preset.type === 'Table Topics') {
      return `${preset.greenTime / 60} - ${preset.redTime / 60} min`;
    }
    return `${preset.greenTime / 60}-${preset.redTime / 60} min`;
  }, []);

  const selectPreset = useCallback((preset: TimerPreset | null) => {
    setSelectedPreset(preset);
  }, []);

  const logTime = useCallback(async (speakerName: string | null) => {
    if (selectedPreset) {
      const isWithinTime = calculateIsWithinTime(elapsedTime, selectedPreset);
      
      const newSession: LoggedTimerSession = {
        id: crypto.randomUUID(),
        speakerName: speakerName,
        presetName: selectedPreset.name,
        timeRequirement: formatTimeRequirement(selectedPreset),
        duration: elapsedTime,
        isWithinTime: isWithinTime,
        timestamp: new Date(),
        userId: user?.id || 'local-user',
      };

      setLoggedTimes(prev => [...prev, newSession]);
      resetTimer();
    }
  }, [selectedPreset, elapsedTime, calculateIsWithinTime, formatTimeRequirement, resetTimer, user]);

  const removeLoggedTime = useCallback((id: string) => {
    setLoggedTimes(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearLoggedTimes = useCallback(() => {
    setLoggedTimes([]);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  useEffect(() => {
    if (isRunning && elapsedTime >= MAX_TIMER_DURATION) {
      stopTimer();
    }
  }, [isRunning, elapsedTime, stopTimer]);

  useEffect(() => {
    if (selectedPreset) {
      if (elapsedTime >= selectedPreset.redTime) setColorSignal('red');
      else if (elapsedTime >= selectedPreset.yellowTime) setColorSignal('yellow');
      else if (elapsedTime >= selectedPreset.greenTime) setColorSignal('green');
      else setColorSignal('none');
    } else setColorSignal('none');
  }, [elapsedTime, selectedPreset]);
  
  const value = {
    isRunning, elapsedTime, colorSignal, selectedPreset, loggedTimes,
    startTimer, stopTimer, resetTimer, selectPreset, logTime,
    removeLoggedTime, clearLoggedTimes,
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) throw new Error('useTimer must be used within a TimerProvider');
  return context;
};
