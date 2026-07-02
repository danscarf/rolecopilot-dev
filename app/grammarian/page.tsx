// app/grammarian/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../_providers/SupabaseAuthProvider';
import { GrammarianProvider, useGrammarian } from '../_providers/GrammarianProvider';
import { SpeakerList } from '../_components/shared/SpeakerList';
import { ImproperUsage } from '../_components/grammarian/ImproperUsage';
import { OutstandingLanguage } from '../_components/grammarian/OutstandingLanguage';
import { WordOfTheDay } from '../_components/grammarian/WordOfTheDay';
import { GrammarianReport } from '../_components/grammarian/GrammarianReport';
import { GrammarianScript } from '../_components/grammarian/GrammarianScript';

function GrammarianPageContent() {
  const { session, selectedSpeaker, addSpeaker, selectSpeaker, undoLastObservation, resetSession } = useGrammarian();
  const [showScript, setShowScript] = useState(false);

  const observationCount =
    session.improperUsages.length + session.outstandingLanguage.length + session.wotdUsages.length;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-6xl">📖</span>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Grammarian
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Track language observations and the Word of the Day
          </p>
        </div>

        {/* Session controls */}
        <div className="mb-6 flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={undoLastObservation}
            disabled={observationCount === 0}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ↶ Undo last observation
          </button>
          <button
            onClick={() => {
              if (confirm('Start a new session? All current observations and speakers will be cleared.')) {
                resetSession();
              }
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Start New Session
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Speakers */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
              <SpeakerList
                speakers={session.speakers}
                selectedSpeaker={selectedSpeaker}
                onAdd={addSpeaker}
                onSelect={selectSpeaker}
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
              <WordOfTheDay />
            </div>
          </div>

          {/* Right column: Observations + Report + Script */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                <ImproperUsage />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                <OutstandingLanguage />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📋</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Grammarian&apos;s Report
                </h2>
              </div>
              <GrammarianReport />
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
                    Grammarian&apos;s Script
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
                  <GrammarianScript />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GrammarianPage() {
  const router = useRouter();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/auth/login?redirectedFrom=/grammarian');
    }
  }, [session, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <GrammarianProvider>
      <GrammarianPageContent />
    </GrammarianProvider>
  );
}
