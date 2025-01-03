'use client';

import React, { useState } from 'react';

interface Template {
  html: string;
  css: string;
  preview: string;
}

export default function TextPage() {
  const [description, setDescription] = useState('');
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description,
          type: 'website',
          format: 'html'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate template');
      }

      const data = await response.json();
      setTemplate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate template');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Describe Your Template</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Template Description
                </label>
                <textarea
                  id="description"
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Describe your website template here... (e.g., 'I want a modern landing page with a hero section, feature grid, and contact form')"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Generating...' : 'Generate Template'}
                </button>
              </div>
            </form>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Template Preview</h2>
            {template ? (
              <div className="space-y-4">
                <div 
                  className="preview-container p-4 border rounded-lg"
                  dangerouslySetInnerHTML={{ __html: template.html }}
                />
                <style>{template.css}</style>
                
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => {
                      const blob = new Blob([template.html], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'template.html';
                      a.click();
                    }}
                    className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
                  >
                    Download HTML
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([template.css], { type: 'text/css' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'styles.css';
                      a.click();
                    }}
                    className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
                  >
                    Download CSS
                  </button>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">
                  Your template preview will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}