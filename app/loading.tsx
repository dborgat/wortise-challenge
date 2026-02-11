export default function Loading() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-(family-name:--font-geist-sans)">
      <main className="max-w-4xl mx-auto animate-pulse">
        <div className="h-10 w-80 bg-gray-200 rounded mb-8" />

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="h-6 w-36 bg-gray-200 rounded mb-4" />
          <div className="space-y-2">
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-56 bg-gray-200 rounded" />
            <div className="h-4 w-52 bg-gray-200 rounded" />
          </div>
        </div>
      </main>
    </div>
  );
}
