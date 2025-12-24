// app/_components/agenda/RoleDisplay.tsx
'use client';

import React from 'react';
import { useAgenda } from '../../_providers/AgendaProvider';

export function RoleDisplay() {
  const { agendaData, loading, error, clearAgenda } = useAgenda();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-12 text-center">
        <div className="inline-block animate-spin text-6xl mb-4">⏳</div>
        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">Analyzing your agenda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 border-2 border-red-300 dark:border-red-800">
        <div className="flex items-start gap-4">
          <div className="text-4xl">⚠️</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">Error Processing Agenda</h3>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={clearAgenda}
              className="px-4 py-2 border-2 border-red-600 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!agendaData || agendaData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
        <div className="text-6xl mb-4">👆</div>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
          Paste your agenda above and click "Process Agenda" to extract roles
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 transform hover:scale-[1.01] transition-transform duration-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-xl">
          ✅
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Extracted Roles</h2>
      </div>
      
      <div className="space-y-3 mb-8">
        {agendaData.map((item, index) => (
          <div 
            key={item.id} 
            className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 border border-purple-100 dark:border-gray-600 hover:shadow-md transition-shadow"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-100">{item.role}</span>
            </div>
            <span className="px-4 py-2 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-medium shadow-sm">
              {item.assignee || '❓ Unassigned'}
            </span>
          </div>
        ))}
      </div>
      
      <button
        onClick={clearAgenda}
        className="w-full px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 gradient-secondary focus:ring-pink-500 text-lg"
      >
        <span className="flex items-center justify-center gap-2">
          <span>🗑️</span>
          Clear Agenda
        </span>
      </button>
    </div>
  );
}
