'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DrawingPad from '@/components/DrawingPad';

export default function TextPage() {
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'draw'
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 55000); // Increase timeout to 55 seconds

      const response = await fetch('/api/generate-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description,
          style_preferences: 'simple and minimal', // Simplify request
          features: ['basic'], // Reduce features
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem('generatedTemplate', JSON.stringify(data));
      router.push('/preview');
    } catch (err: unknown) {
      console.error('Error:', err);
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Request took too long. Please try with a simpler description.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to generate template');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateGenerate = (template: string) => {
    // Store the generated template
    localStorage.setItem('generatedTemplate', JSON.stringify({
      html: '',  // You might want to generate HTML based on the drawing
      css: '',   // You might want to generate CSS based on the drawing
      preview: template
    }));
    
    // Navigate to preview
    router.push('/preview');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Create Your Website Template</h1>
        
        {/* Custom Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg shadow p-1">
            <button
              onClick={() => setActiveTab('text')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'text'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Describe in Text
            </button>
            <button
              onClick={() => setActiveTab('draw')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'draw'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Draw Layout
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'text' ? (
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
                    {isLoading ? 'Generating (this may take up to 1 minute)...' : 'Generate Template'}
                  </button>
                </div>
              </form>
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <DrawingPad onTemplateGenerate={handleTemplateGenerate} />
          )}
        </div>
      </div>
    </div>
  );
}