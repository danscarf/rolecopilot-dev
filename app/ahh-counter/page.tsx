// app/ahh-counter/page.tsx
'use client';

import React from 'react';
import { AhhCounterProvider } from '../_providers/AhhCounterProvider';
import { SpeakerList } from '../_components/ahh-counter/SpeakerList';
import { AhhCounterControls } from '../_components/ahh-counter/AhhCounterControls';

import { AhhCounterScript } from '../_components/ahh-counter/AhhCounterScript';

function AhhCounterPageContent() {
    const [showScript, setShowScript] = React.useState(false);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold">Ahh Counter</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="md:col-span-1">
                    <SpeakerList />
                </div>
                <div className="md:col-span-2">
                    <AhhCounterControls />
                </div>
            </div>
            <div className="mt-4">
                <AhhCounterReport />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mt-4">
              <button
                onClick={() => setShowScript(!showScript)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📜</span>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Ah-Counter's Script
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
                  <AhhCounterScript />
                </div>
              )}
            </div>
        </div>
    );
}


export default function AhhCounterPage() {
  return (
    <AhhCounterProvider>
      <AhhCounterPageContent />
    </AhhCounterProvider>
  );
}