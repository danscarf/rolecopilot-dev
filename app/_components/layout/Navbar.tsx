// app/_components/layout/Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="backdrop-blur-lg bg-gray-900/95 dark:bg-gray-900/95 px-6 py-4 shadow-2xl w-full fixed top-0 z-50 border-b border-gray-800/50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold hover:text-purple-400 transition-colors flex items-center gap-2">
          <span className="text-3xl">🎯</span>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">RoleCopilot</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className={`px-4 py-2 rounded-lg text-base font-medium transition-all ${
              pathname === '/' 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            📋 Agenda
          </Link>
          <Link
            href="/timer"
            className={`px-4 py-2 rounded-lg text-base font-medium transition-all ${
              pathname === '/timer' 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            ⏱️ Timer
          </Link>
        </div>
      </div>
    </nav>
  );
}
