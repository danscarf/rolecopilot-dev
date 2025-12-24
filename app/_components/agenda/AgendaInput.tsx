// app/_components/agenda/AgendaInput.tsx
'use client';

import React, { useState } from 'react';
import { useAgenda } from '../../_providers/AgendaProvider';

export function AgendaInput() {
  const [inputText, setInputText] = useState<string>('');
  const [attendeeNames, setAttendeeNames] = useState<string>('');
  const { processAgenda, loading } = useAgenda();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const namesArray = attendeeNames.split(',').map(name => name.trim()).filter(name => name.length > 0);
    processAgenda(inputText, namesArray);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 space-y-6 transform hover:scale-[1.01] transition-transform duration-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
          ✨
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Input Agenda</h2>
      </div>
      
      <div>
        <label htmlFor="agenda-text" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
          Meeting Agenda
        </label>
        <textarea
          id="agenda-text"
          rows={10}
          className="w-full resize-none rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g., Toastmaster: John Doe, Speaker: Jane Smith, Evaluator: Alex Johnson..."
          disabled={loading}
        ></textarea>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Paste your meeting agenda in any format - plain text or HTML
        </p>
      </div>
      
      <div>
        <label htmlFor="attendee-names" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
          Attendee Names (Optional)
        </label>
        <input
          type="text"
          id="attendee-names"
          className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200"
          value={attendeeNames}
          onChange={(e) => setAttendeeNames(e.target.value)}
          placeholder="John Doe, Jane Smith, Alex Johnson"
          disabled={loading}
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Comma-separated names for better PII handling and accuracy
        </p>
      </div>
      
      <button
        type="submit"
        className="w-full px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 gradient-primary focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
        disabled={loading || inputText.trim().length === 0}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>🚀</span>
            Process Agenda
          </span>
        )}
      </button>
    </form>
  );
}
