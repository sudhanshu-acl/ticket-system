'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="text-red-500 text-6xl mb-4">!</div>
          <h2 className="text-3xl font-semibold text-black dark:text-zinc-50">
            Something went wrong!
          </h2>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            An error occurred while loading the dashboard. Please try again.
          </p>
          {error?.digest && (
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            className="mt-4 px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </main>
    </div>
  );
}
