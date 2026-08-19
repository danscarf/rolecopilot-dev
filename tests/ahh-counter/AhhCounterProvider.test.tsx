// tests/ahh-counter/AhhCounterProvider.test.tsx
import React, { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { AhhCounterProvider, useAhhCounter } from '../../app/_providers/AhhCounterProvider';
import { MeetingProvider, useMeeting } from '../../app/_providers/MeetingProvider';

function AllProviders({ children }: { children: ReactNode }) {
  return (
    <MeetingProvider>
      <AhhCounterProvider>{children}</AhhCounterProvider>
    </MeetingProvider>
  );
}

describe('AhhCounterProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should log a word for a selected speaker', () => {
    const { result } = renderHook(
      () => ({ ahh: useAhhCounter(), meeting: useMeeting() }),
      { wrapper: AllProviders }
    );

    act(() => {
      const person = result.current.meeting.addPerson('John Doe');
      result.current.ahh.selectSpeaker(person);
    });

    act(() => {
      result.current.ahh.logWord('um');
    });

    expect(result.current.ahh.session.logEntries.length).toBe(1);
    expect(result.current.ahh.session.logEntries[0].personName).toBe('John Doe');
    expect(result.current.ahh.session.logEntries[0].word).toBe('um');
  });

  it('should undo the last log entry', () => {
    const { result } = renderHook(
      () => ({ ahh: useAhhCounter(), meeting: useMeeting() }),
      { wrapper: AllProviders }
    );

    act(() => {
      const person = result.current.meeting.addPerson('Jane Doe');
      result.current.ahh.selectSpeaker(person);
    });

    act(() => {
      result.current.ahh.logWord('um');
    });

    act(() => {
      result.current.ahh.logWord('ah');
    });

    expect(result.current.ahh.session.logEntries.length).toBe(2);

    act(() => {
      result.current.ahh.undoLastLog();
    });

    expect(result.current.ahh.session.logEntries.length).toBe(1);
    expect(result.current.ahh.session.logEntries[0].word).toBe('um');
  });
});
