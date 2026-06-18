// app/topics-master/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../_providers/SupabaseAuthProvider';
import { TopicsMasterProvider, useTopicsMaster } from '../_providers/TopicsMasterProvider';
import { TopicsSetup } from '../_components/topics-master/TopicsSetup';
import { TopicsLog } from '../_components/topics-master/TopicsLog';
import { TopicsScript } from '../_components/topics-master/TopicsScript';

function TopicsMasterPageContent() {
  const [showScript, setShowScript] = React.useState(false);
  const { session, resetSession } = useTopicsMaster();

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-6xl">🎯</span>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
              Table Topics Master
            </h1>
          </div>
          {session.theme && (
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Theme: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{session.theme}</span>
            </p>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Setup panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 h-full">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Setup</h2>
              <TopicsSetup />
            </div>
          </div>

          {/* Log panel + script */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
              <TopicsLog />
            </div>

            {/* Reset */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (confirm('Reset the entire session? This cannot be undone.')) resetSession();
                }}
                className="px-4 py-2 text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-xl transition-colors"
              >
                Reset Session
              </button>
            </div>

            {/* Collapsible Script */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => setShowScript(!showScript)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📜</span>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Topicsmaster Script
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {showScript ? 'Hide' : 'Show'}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${showScript ? 'rotate-180' : ''}`}
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
                  <TopicsScript />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TopicsMasterPage() {
  const router = useRouter();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/auth/login?redirectedFrom=/topics-master');
    }
  }, [session, isLoading, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-xl">Loading...</div></div>;
  }

  if (!session) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-xl">Redirecting to login...</div></div>;
  }

  return (
    <TopicsMasterProvider>
      <TopicsMasterPageContent />
    </TopicsMasterProvider>
  );
}
