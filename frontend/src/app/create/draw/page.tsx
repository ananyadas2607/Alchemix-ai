// src/app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DrawingPad from '@/components/DrawingPad';

export default function DrawPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleTemplateGenerate = async (template: string) => {
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
          description: "Generate a website based on this layout sketch",
          style_preferences: 'simple and minimal',
          features: ['basic'],
          layout_image: template  // This is the base64 image from the canvas
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
          setError('Request took too long. Please try with a simpler drawing.');
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
            Draw Your Layout
          </h1>
          
          <div className="space-y-6">
            <DrawingPad onTemplateGenerate={handleTemplateGenerate} />

            {error && (
              <div className="mt-6 p-4 bg-red-900/50 border border-red-800 rounded-xl text-red-200">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}