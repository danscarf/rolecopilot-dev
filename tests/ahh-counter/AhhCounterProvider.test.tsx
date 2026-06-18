// tests/ahh-counter/AhhCounterProvider.test.tsx
import { renderHook, act } from '@testing-library/react';
import { AhhCounterProvider, useAhhCounter } from '../../app/_providers/AhhCounterProvider';

describe('AhhCounterProvider', () => {
  it('should add a speaker', () => {
    const { result } = renderHook(() => useAhhCounter(), {
      wrapper: AhhCounterProvider,
    });

    act(() => {
      result.current.addSpeaker('John Doe');
    });

    expect(result.current.session.speakers.length).toBe(1);
    expect(result.current.session.speakers[0].name).toBe('John Doe');
  });

  it('should log a filler word', () => {
    const { result } = renderHook(() => useAhhCounter(), {
      wrapper: AhhCounterProvider,
    });

    act(() => {
      result.current.addSpeaker('Jane Doe');
    });

    const speaker = result.current.session.speakers[0];

    act(() => {
      result.current.logFillerWord(speaker, 'um');
    });

    expect(result.current.session.logEntries.length).toBe(1);
    expect(result.current.session.logEntries[0].speaker.name).toBe('Jane Doe');
    expect(result.current.session.logEntries[0].fillerWord).toBe('um');
  });

  it('should undo the last log entry', () => {
    const { result } = renderHook(() => useAhhCounter(), {
      wrapper: AhhCounterProvider,
    });

    act(() => {
      result.current.addSpeaker('Jane Doe');
    });

    const speaker = result.current.session.speakers[0];

    act(() => {
      result.current.logFillerWord(speaker, 'um');
    });

    act(() => {
      result.current.logFillerWord(speaker, 'ah');
    });

    expect(result.current.session.logEntries.length).toBe(2);

    act(() => {
      result.current.undoLastLog();
    });

    expect(result.current.session.logEntries.length).toBe(1);
    expect(result.current.session.logEntries[0].fillerWord).toBe('um');
  });
});
