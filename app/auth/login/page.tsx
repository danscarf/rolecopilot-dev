// app/auth/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { supabase } from '../../../app/_lib/supabase'; // Import supabase client
import { useAuth } from '../../_providers/SupabaseAuthProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter(); // Initialize useRouter
  const { session, isLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && session) {
      console.log('User already logged in, redirecting to home...');
      router.push('/');
    }
  }, [session, isLoading, router]);

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Don't show login form if already logged in (while redirecting)
  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-lg">Redirecting...</div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login response:', { data, error });

      if (error) {
        console.error('Login error:', error);
        setMessage(`Error: ${error.message}`);
      } else if (data.session) {
        console.log('Login successful! Session:', data.session);
        setMessage('Logged in successfully!');
        setTimeout(() => {
          router.push('/'); // Redirect to home page or dashboard
        }, 500);
      } else {
        setMessage('Login failed: No session returned');
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setMessage(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    }
    setLoading(false);
  };

  // Dev-only: Quick demo login
  const handleDemoLogin = async () => {
    const demoEmail = 'demo@rolecopilot.dev';
    const demoPassword = 'demo123456';
    
    setLoading(true);
    setMessage('Creating/logging into demo account...');

    try {
      console.log('Demo login: Attempting sign in...');
      // Try to sign in first
      let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      // If user doesn't exist, create it
      if (signInError) {
        console.log('Demo login: User does not exist, creating...', signInError.message);
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: demoEmail,
          password: demoPassword,
        });
        
        if (signUpError) {
          console.error('Demo login: Sign up failed:', signUpError);
          setMessage(`Demo signup failed: ${signUpError.message}`);
          setLoading(false);
          return;
        }

        console.log('Demo login: User created, signing in...', signUpData);
        // Try signing in again after signup
        const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
          email: demoEmail,
          password: demoPassword,
        });

        if (retryError) {
          console.error('Demo login: Retry sign in failed:', retryError);
          setMessage(`Demo login failed: ${retryError.message}`);
          setLoading(false);
          return;
        }

        signInData = retryData;
      }

      console.log('Demo login: Success!', signInData);
      setMessage('Demo login successful!');
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (err) {
      console.error('Demo login: Unexpected error:', err);
      setMessage(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-black dark:text-white">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm p-2 border"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm p-2 border"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {/* Dev-only: Quick demo login button */}
        {process.env.NODE_ENV === 'development' && (
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2 px-4 border-2 border-yellow-500 rounded-md shadow-sm text-sm font-medium text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            🚀 Quick Demo Login (Dev Only)
          </button>
        )}
        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes('successful') || message.includes('Success') ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        <div className="text-center text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <a href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign Up</a>
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Forgot password?{' '}
            <a href="/auth/reset-password" className="font-medium text-indigo-600 hover:text-indigo-500">Reset it</a>
          </p>
        </div>
      </div>
    </div>
  );
}
