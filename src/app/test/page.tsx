'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testFinViz = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/stocks/test');
      setResult(response.data);
    } catch (err: any) {
      console.error('Error testing FinViz:', err);
      setError(err.message || 'An error occurred');
      setResult(err.response?.data || null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">FinViz API Test</h1>
      
      <div className="mb-6">
        <Button onClick={testFinViz} disabled={loading}>
          {loading ? 'Testing...' : 'Test FinViz Connection'}
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Status</h3>
                <p>{result.success ? 'Success' : 'Failed'}</p>
              </div>
              
              {result.success && (
                <>
                  <div>
                    <h3 className="font-semibold">URL</h3>
                    <p>{result.url}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">HTTP Status</h3>
                    <p>{result.status}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Content Type</h3>
                    <p>{result.contentType}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Content Length</h3>
                    <p>{result.contentLength} characters</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">HTML Preview</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-xs">
                      {result.htmlPreview}
                    </pre>
                  </div>
                </>
              )}
              
              {!result.success && result.response && (
                <>
                  <div>
                    <h3 className="font-semibold">Error Response</h3>
                    <p>Status: {result.response.status} {result.response.statusText}</p>
                    
                    <h4 className="font-semibold mt-2">Headers</h4>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-40 text-xs">
                      {JSON.stringify(result.response.headers, null, 2)}
                    </pre>
                    
                    <h4 className="font-semibold mt-2">Data</h4>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-40 text-xs">
                      {result.response.data}
                    </pre>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 