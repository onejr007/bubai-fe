import React, { useState } from 'react';
import { exampleApi } from '@/services/apiService';
import { API_CONFIG } from '@/config/api';

export const ApiTestPage: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('World');

  const testHello = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await exampleApi.getHello();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const testHelloByName = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await exampleApi.getHelloByName(name);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">API Integration Test</h1>
        <p className="text-gray-600 mb-8">
          Testing connection to: <span className="font-mono text-blue-600">{API_CONFIG.baseURL}</span>
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Endpoints</h2>
          
          <div className="space-y-4">
            {/* Test 1: Simple GET */}
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">GET /api/hello</h3>
              <button
                onClick={testHello}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? 'Loading...' : 'Test Hello'}
              </button>
            </div>

            {/* Test 2: GET with parameter */}
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">GET /api/hello/{'{name}'}</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded px-3 py-2 flex-1"
                  placeholder="Enter name"
                />
                <button
                  onClick={testHelloByName}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                >
                  {loading ? 'Loading...' : 'Test Hello by Name'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-green-800 font-semibold mb-2">Success</h3>
            <pre className="bg-white p-4 rounded border overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {/* Connection Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Connection Info</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Frontend URL:</span> {API_CONFIG.appURL}</p>
            <p><span className="font-medium">Backend URL:</span> {API_CONFIG.baseURL}</p>
            <p><span className="font-medium">Environment:</span> {import.meta.env.MODE}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="font-semibold mb-3">How to Use</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Make sure backend is running at: {API_CONFIG.baseURL}</li>
            <li>Click "Test Hello" to test basic GET request</li>
            <li>Enter a name and click "Test Hello by Name" to test parameterized request</li>
            <li>Check the results below</li>
            <li>If you see CORS errors, check backend CORS configuration</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
