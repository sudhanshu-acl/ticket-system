'use client';

import React, { useState } from 'react';
import SystemArchitectureGraph from '@/app/components/SystemArchitectureGraph';
import DynamicArchitectureGraph from '@/app/components/DynamicArchitectureGraph';

export default function ArchitecturePage() {
  const [dynamicMode, setDynamicMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dynamicGraph, setDynamicGraph] = useState<{ nodes: any[]; edges: any[] } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/architecture/generate');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate architecture');
      }

      setDynamicGraph(result.data);
      setDynamicMode(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Architecture Topology</h1>
          <p className="mt-1 text-sm text-slate-600">
            Interactive visualization mapping the request cycle to the folder structure layers.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setDynamicMode(false)}
            className={`px-4 py-2 rounded-md transition-colors ${!dynamicMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Static View
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${dynamicMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'} disabled:bg-purple-300 disabled:text-white`}
          >
            {loading ? 'Generating...' : '✨ Generate Dynamic AI Map'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="h-[750px] w-full relative">
          {loading && (
            <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-purple-700 font-medium">Scanning folders and asking Gemini to build architecture...</p>
            </div>
          )}

          {!dynamicMode ? (
            <SystemArchitectureGraph />
          ) : (
            dynamicGraph && (
              <DynamicArchitectureGraph
                initialNodes={dynamicGraph.nodes}
                initialEdges={dynamicGraph.edges}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
