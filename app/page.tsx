import { createCaller } from "@/lib/trpc/server";

export default async function Home() {
  const caller = await createCaller();
  const articles = await caller.article.getAll();
  const session = await caller.auth.getSession();

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-(family-name:--font-geist-sans)">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">CMS - Wortise Challenge</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">tRPC Setup Test</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Articles Query:</h3>
              <p className="text-green-600">
                Articles: {JSON.stringify(articles)}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Session Query:</h3>
              <p className="text-gray-600">
                Session: {JSON.stringify(session)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Next Steps:</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Configure Better Auth</li>
            <li>Implement authentication flow</li>
            <li>Create article CRUD operations</li>
            <li>Build UI components</li>
            <li>Add pagination and search</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
