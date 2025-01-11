'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';

export default function TextPage() {
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
      const timeoutId = setTimeout(() => controller.abort(), 55000);

      const response = await fetch('/api/generate-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description,
          style_preferences: 'simple and minimal',
          features: ['basic'],
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-800">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-6">
            Describe Your Website
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <textarea
                rows={6}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Describe your dream website... (e.g., 'Create a modern landing page for a tech startup with a hero section, feature highlights, and a contact form')"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
                {isLoading ? 'Generating...' : 'Generate Template'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-800 rounded-xl text-red-200">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}