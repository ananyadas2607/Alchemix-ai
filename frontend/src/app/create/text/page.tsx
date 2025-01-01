'use client';
import React, { useState } from 'react';

export default function TextPage() {
  const [description, setDescription] = useState('');
  const [template, setTemplate] = useState(null);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Here you would typically send the description to your template generation API
    console.log('Generating template from description:', description);
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
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Generate Template
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Template Preview</h2>
            {template ? (
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {/* Template preview content */}
                <img src={template} alt="Generated template" className="w-full h-full object-contain" />
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