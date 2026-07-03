// app/_components/layout/Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  const navLink = (href: string, label: string, activeColor = 'bg-purple-600 shadow-purple-500/50') => (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg text-base font-medium transition-all ${
        pathname === href
          ? `${activeColor} text-white shadow-lg`
          : 'text-gray-300 hover:text-white hover:bg-gray-800'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="backdrop-blur-lg bg-gray-900/95 dark:bg-gray-900/95 px-6 py-4 shadow-2xl w-full fixed top-0 z-50 border-b border-gray-800/50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold hover:text-purple-400 transition-colors flex items-center gap-2">
          <span className="text-3xl">🎯</span>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">RoleCopilot</span>
        </Link>
        <div className="flex items-center gap-2">
          {navLink('/agenda', '📋 Agenda')}
          {navLink('/timer', '⏱️ Timer')}
          {navLink('/ahh-counter', '🎤 Ahh Counter')}
          {navLink('/grammarian', '📖 Grammarian')}
          {navLink('/topics-master', '🎯 Topics Master', 'bg-emerald-600 shadow-emerald-500/50')}
        </div>
      </div>
    </nav>
  );
}
