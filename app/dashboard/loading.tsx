export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
          {/* Header skeleton */}
          <div className="h-10 w-64 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded"></div>
          
          {/* Description skeleton */}
          <div className="h-6 w-full max-w-md bg-gray-200 dark:bg-zinc-800 animate-pulse rounded"></div>
          
          {/* Cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-lg"></div>
            ))}
          </div>
          
          {/* Table skeleton */}
          <div className="w-full mt-6">
            <div className="h-8 w-full bg-gray-200 dark:bg-zinc-800 animate-pulse rounded mb-4"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 w-full bg-gray-200 dark:bg-zinc-800 animate-pulse rounded mb-2"></div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
