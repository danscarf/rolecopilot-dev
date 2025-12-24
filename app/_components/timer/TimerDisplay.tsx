// app/_components/timer/TimerDisplay.tsx
'use client';

import React from 'react';
import { useTimer } from '../../_providers/TimerProvider';

export function TimerDisplay() {
  const { elapsedTime, colorSignal } = useTimer();

  // Format elapsed time into MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Determine background color based on signal
  // eslint-disable-next-line security/detect-object-injection
  const backgroundColorClass = {
    none: 'bg-white dark:bg-black',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  }[colorSignal];

  // eslint-disable-next-line security/detect-object-injection
  const textColorClass = {
    none: 'text-black dark:text-white',
    green: 'text-white',
    yellow: 'text-black',
    red: 'text-white',
  }[colorSignal];

  return (
    <div className={`flex flex-col items-center justify-center h-full w-full transition-colors duration-500 ${backgroundColorClass}`}>
      <p className={`text-9xl font-bold ${textColorClass}`}>
        {formatTime(elapsedTime)}
      </p>
    </div>
  );
}
