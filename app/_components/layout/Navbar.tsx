// app/_components/layout/Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold hover:text-gray-300 transition-colors">
          RoleCopilot
        </Link>
        <div className="space-x-4">
          <Link
            href="/"
            className={`text-white text-lg hover:text-gray-300 transition-colors ${
              pathname === '/' ? 'underline' : ''
            }`}
          >
            Agenda Processor
          </Link>
          <Link
            href="/timer"
            className={`text-white text-lg hover:text-gray-300 transition-colors ${
              pathname === '/timer' ? 'underline' : ''
            }`}
          >
            Smart Timer
          </Link>
        </div>
      </div>
    </nav>
  );
}
