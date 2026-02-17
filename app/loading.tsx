export default function Loading() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-(family-name:--font-geist-sans)">
      <main className="max-w-4xl mx-auto animate-pulse">
        <div className="h-10 w-80 bg-gray-200 dark:bg-gray-700 rounded mb-8" />

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="space-y-2">
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-52 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </main>
    </div>
  );
}
