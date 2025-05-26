'use client';

import { useState, useTransition } from 'react';

interface ResearchData {
  query: string;
  summary: string;
  sources_consulted?: string[];
}

export default function ResearchPage() {
  const [query, setQuery] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition(); // isPending can be used as isLoading

  const handleResearch = async () => {
    setError(null);
    setSummary(null);

    startTransition(async () => {
      try {
        const response = await fetch('http://localhost:8000/research', { // Assuming backend is on port 8000
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: query }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data: ResearchData = await response.json();
        setSummary(data.summary);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      }
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24 bg-gray-50">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
          Deep Research Agent
        </h1>
        
        <div className="space-y-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your research topic..."
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            disabled={isPending}
          />
          <button
            onClick={handleResearch}
            disabled={isPending || !query.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Researching...' : 'Research'}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {summary && !error && (
          <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Research Summary:</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{summary}</p>
          </div>
        )}
      </div>
    </main>
  );
}
