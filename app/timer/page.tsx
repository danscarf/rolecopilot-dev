// app/timer/page.tsx
'use client';

import React, { useState } from 'react';
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
  const [showScript, setShowScript] = useState(false);
  const [showLog, setShowLog] = useState(true);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-6xl">⏱️</span>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Smart Timer
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Professional meeting timer with color cards and automatic logging
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Timer Display (Takes 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timer Display Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
              <TimerDisplay />
              <TimerControls />
            </div>

            {/* Collapsible Script Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => setShowScript(!showScript)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📜</span>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Timer's Script
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {showScript ? 'Hide' : 'Show'}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
                      showScript ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {showScript && (
                <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700">
                  <TimerScript />
                </div>
              )}
            </div>

            {/* Collapsible Log Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => setShowLog(!showLog)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Timer Log
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {showLog ? 'Hide' : 'Show'}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
                      showLog ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {showLog && (
                <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700">
                  <LogEntry />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-6">
            {/* Preset Selector */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🎯</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Select Timer
                </h2>
              </div>
              <PresetSelector />
              {selectedPreset?.type === 'Custom' && (
                <div className="mt-4">
                  <CustomInput />
                </div>
              )}
            </div>

            {/* Timer Report */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📋</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Timer's Report
                </h2>
              </div>
              <TimerReport />
            </div>
          </div>
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
