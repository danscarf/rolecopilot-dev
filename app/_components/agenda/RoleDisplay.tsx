// app/_components/agenda/RoleDisplay.tsx
'use client';

import React from 'react';
import { useAgenda } from '../../_providers/AgendaProvider';

export function RoleDisplay() {
  const { agendaData, loading, error, clearAgenda } = useAgenda();

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-600 dark:text-gray-400">
        Loading roles...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Error: {error}
        <button
          onClick={clearAgenda}
          className="ml-4 px-3 py-1 border border-red-600 text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900"
        >
          Clear Error
        </button>
      </div>
    );
  }

  if (!agendaData || agendaData.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        Paste agenda text and click "Process Agenda" to see roles.
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Extracted Roles:</h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {agendaData.map((item) => (
          <li key={item.id} className="py-2 flex justify-between items-center">
            <span className="font-medium text-gray-900 dark:text-gray-100">{item.role}:</span>
            <span className="text-gray-700 dark:text-gray-300">{item.assignee || 'Unassigned'}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={clearAgenda}
        className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Clear Agenda
      </button>
    </div>
  );
}
