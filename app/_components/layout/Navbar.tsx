// app/_components/layout/Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Import useRouter
import { useAuth } from '../../_providers/SupabaseAuthProvider'; // Import useAuth
import { supabase } from '../../_lib/supabase'; // Import supabase client

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter(); // Initialize useRouter
  const { user, isLoading } = useAuth(); // Get user and isLoading from useAuth

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login'); // Redirect to login page after logout
  };

  return (
    <nav className="backdrop-blur-lg bg-gray-900/95 dark:bg-gray-900/95 px-6 py-4 shadow-2xl w-full fixed top-0 z-50 border-b border-gray-800/50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold hover:text-purple-400 transition-colors flex items-center gap-2">
          <span className="text-3xl">🎯</span>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">RoleCopilot</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/agenda" // Changed from "/"
            className={`px-4 py-2 rounded-lg text-base font-medium transition-all ${
              pathname === '/agenda' // Changed from "/"
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
          <Link
            href="/ahh-counter"
            className={`px-4 py-2 rounded-lg text-base font-medium transition-all ${
              pathname === '/ahh-counter'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            🎤 Ahh Counter
          </Link>

          {!isLoading && (
            user ? (
              <>
                <span className="text-gray-300 text-sm hidden md:block">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-base font-medium transition-all bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`px-4 py-2 rounded-lg text-base font-medium transition-all ${
                    pathname === '/auth/login'
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className={`px-4 py-2 rounded-lg text-base font-medium transition-all ${
                    pathname === '/auth/signup'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
