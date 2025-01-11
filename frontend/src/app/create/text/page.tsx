'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';

export default function TextPage() {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const sampleTemplates = [
    {
      title: "Modern Business",
      description: "Create a professional business website with a sleek hero section, services overview, client testimonials, and a contact form. Use modern gradients and clean typography.",
      preview: `
        <div class="relative overflow-hidden rounded-xl">
          <img src="https://picsum.photos/800/400?business" alt="Business Template" class="w-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-black/80 p-6 flex flex-col justify-end">
            <h3 class="text-2xl font-bold text-white mb-2">Modern Business</h3>
            <div class="flex gap-2 mb-4">
              <span class="px-2 py-1 bg-purple-500/30 rounded-full text-xs text-purple-200">Hero Section</span>
              <span class="px-2 py-1 bg-purple-500/30 rounded-full text-xs text-purple-200">Services Grid</span>
              <span class="px-2 py-1 bg-purple-500/30 rounded-full text-xs text-purple-200">Testimonials</span>
            </div>
          </div>
        </div>
      `
    },
    {
      title: "Portfolio",
      description: "Design a creative portfolio with a dynamic hero section, project gallery with hover effects, skills showcase, and contact information. Include smooth animations and a minimal color scheme.",
      preview: `
        <div class="relative overflow-hidden rounded-xl">
          <img src="https://picsum.photos/800/400?portfolio" alt="Portfolio Template" class="w-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-r from-pink-900/90 to-black/80 p-6 flex flex-col justify-end">
            <h3 class="text-2xl font-bold text-white mb-2">Portfolio</h3>
            <div class="flex gap-2 mb-4">
              <span class="px-2 py-1 bg-pink-500/30 rounded-full text-xs text-pink-200">Gallery</span>
              <span class="px-2 py-1 bg-pink-500/30 rounded-full text-xs text-pink-200">Projects</span>
              <span class="px-2 py-1 bg-pink-500/30 rounded-full text-xs text-pink-200">Skills</span>
            </div>
          </div>
        </div>
      `
    },
    {
      title: "Restaurant",
      description: "Build a restaurant website with an appetizing hero image, menu section, reservation form, and location details. Use warm colors and elegant typography.",
      preview: `
        <div class="relative overflow-hidden rounded-xl">
          <img src="https://picsum.photos/800/400?restaurant" alt="Restaurant Template" class="w-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-r from-orange-900/90 to-black/80 p-6 flex flex-col justify-end">
            <h3 class="text-2xl font-bold text-white mb-2">Restaurant</h3>
            <div class="flex gap-2 mb-4">
              <span class="px-2 py-1 bg-orange-500/30 rounded-full text-xs text-orange-200">Menu</span>
              <span class="px-2 py-1 bg-orange-500/30 rounded-full text-xs text-orange-200">Reservations</span>
              <span class="px-2 py-1 bg-orange-500/30 rounded-full text-xs text-orange-200">Location</span>
            </div>
          </div>
        </div>
      `
    },
    {
      title: "E-commerce",
      description: "Generate an e-commerce landing page with featured products, categories grid, special offers section, and newsletter signup. Include trust badges and customer reviews.",
      preview: `
        <div class="relative overflow-hidden rounded-xl">
          <img src="https://picsum.photos/800/400?ecommerce" alt="E-commerce Template" class="w-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-black/80 p-6 flex flex-col justify-end">
            <h3 class="text-2xl font-bold text-white mb-2">E-commerce</h3>
            <div class="flex gap-2 mb-4">
              <span class="px-2 py-1 bg-blue-500/30 rounded-full text-xs text-blue-200">Products</span>
              <span class="px-2 py-1 bg-blue-500/30 rounded-full text-xs text-blue-200">Categories</span>
              <span class="px-2 py-1 bg-blue-500/30 rounded-full text-xs text-blue-200">Reviews</span>
            </div>
          </div>
        </div>
      `
    }
  ];

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
          
          <div className="mb-8">
            <h2 className="text-xl text-purple-300 mb-4">Quick Start Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => setDescription(template.description)}
                  className="text-left p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700 transition-all hover:scale-[1.02]"
                >
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">{template.title}</h3>
                  <p className="text-sm text-gray-400">{template.description}</p>
                </button>
              ))}
            </div>
          </div>
          
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

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-8">
              Template Gallery
            </h2>
            <div className="grid grid-cols-1 gap-8">
              {sampleTemplates.map((template, index) => (
                <div key={index} className="space-y-4">
                  <div 
                    dangerouslySetInnerHTML={{ __html: template.preview }} 
                    className="transform transition-transform hover:scale-[1.02]"
                    onClick={() => setDescription(template.description)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}