// app/timer/page.tsx
'use client';

import React from 'react';
import { TimerProvider, useTimer } from '../_providers/TimerProvider';
import { TimerDisplay } from '../_components/timer/TimerDisplay';
import { TimerControls } from '../_components/timer/TimerControls';
import { PresetSelector } from '../_components/timer/PresetSelector';
import { CustomInput } from '../_components/timer/CustomInput';
import { LogEntry } from '../_components/timer/LogEntry';
import { TimerReport } from '../_components/timer/TimerReport';
import { TimerScript } from '../_components/timer/TimerScript';

function TimerPageContent() {
  const { selectedPreset } = useTimer();

  return (
    <div className="flex flex-col md:flex-row min-h-screen pt-16">
      {/* Main Timer Display Area */}
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <TimerDisplay />
        <TimerControls />
        <div className="mt-4 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md">
          <LogEntry />
        </div>
      </div>

      {/* Sidebar / Controls Area */}
      <div className="w-full md:w-1/3 p-4 bg-gray-100 dark:bg-gray-900 overflow-y-auto border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700">
        <PresetSelector />
        {selectedPreset?.type === 'Custom' && (
          <div className="mt-4">
            <CustomInput />
          </div>
        )}
        <div className="mt-6">
          <TimerReport />
        </div>
        <div className="mt-6">
          <TimerScript />
        </div>
      </div>
    </div>
  );
}

export default function TimerPage() {
  return (
    <TimerProvider>
      <TimerPageContent />
    </TimerProvider>
  );
}
