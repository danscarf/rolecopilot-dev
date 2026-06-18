// app/ahh-counter/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../_providers/SupabaseAuthProvider';
import { AhhCounterProvider } from '../_providers/AhhCounterProvider';
import { SpeakerList } from '../_components/ahh-counter/SpeakerList';
import { AhhCounterControls } from '../_components/ahh-counter/AhhCounterControls';
import { AhhCounterReport } from '../_components/ahh-counter/AhhCounterReport';
import { AhhCounterScript } from '../_components/ahh-counter/AhhCounterScript';

function AhhCounterPageContent() {
    const [showScript, setShowScript] = React.useState(false);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <span className="text-6xl">🎤</span>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Ah-Counter
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Track filler words and generate meeting reports with ease
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 h-full">
                            <SpeakerList />
                        </div>
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                            <AhhCounterControls />
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                            <AhhCounterReport />
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
                                        Ah-Counter&apos;s Script
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
                </div>
            </div>
        </div>
    );
}

export default function AhhCounterPage() {
  const router = useRouter();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !session) {
      console.log('Not authenticated, redirecting to login...');
      router.push('/auth/login?redirectedFrom=/ahh-counter');
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
    <AhhCounterProvider>
      <AhhCounterPageContent />
    </AhhCounterProvider>
  );
}
