'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Code, RefreshCcw } from 'lucide-react';
import JSZip from 'jszip';

interface Template {
  html: string;
  css: string;
  preview: string;
}

export default function PreviewPage() {
  const [template, setTemplate] = useState<Template | null>(null);
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const router = useRouter();

  useEffect(() => {
    // Load template data from localStorage
    const savedTemplate = localStorage.getItem('generatedTemplate');
    if (savedTemplate) {
      setTemplate(JSON.parse(savedTemplate));
    }
  }, []);

  const handleDownload = () => {
    if (!template) return;

    // Create a zip file with HTML and CSS
    const zip = new JSZip();
    
    // Add HTML file with embedded CSS
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Generated Website</title>
          <style>${template.css}</style>
        </head>
        <body>
          ${template.html}
        </body>
      </html>
    `;
    
    zip.file('index.html', fullHtml);
    zip.file('styles.css', template.css);

    // Generate and download zip
    zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'website-template.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No template found. Please generate one first.</p>
          <button
            onClick={() => router.push('/create/text')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Create New Template
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Preview Your Website</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setView(view === 'preview' ? 'code' : 'preview')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Code className="w-4 h-4" />
                {view === 'preview' ? 'View Code' : 'View Preview'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Download className="w-4 h-4" />
                Download Template
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'preview' ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="preview-container w-full"
                 dangerouslySetInnerHTML={{ __html: template.html }} />
            <style>{template.css}</style>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">HTML</h2>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{template.html}</code>
              </pre>
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">CSS</h2>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{template.css}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}