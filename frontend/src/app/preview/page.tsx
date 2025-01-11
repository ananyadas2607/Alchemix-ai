'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Code, RefreshCw, Bot, MessageSquarePlus, Share2 } from 'lucide-react';
import JSZip from 'jszip';
import AIChatBubble from '@/components/AIChatBubble';
import InteractiveImageGenerator from '@/components/InteractiveImageGenerator';

interface Template {
  html: string;
  css: string;
}

declare global {
  interface Window {
    removeSection?: (sectionId: string) => void;
  }
}

const commonStyles = `
  .remove-section-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid #e5e7eb;
    color: #4b5563;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    opacity: 0;
    z-index: 50;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .remove-section-btn:hover {
    background-color: #ef4444;
    color: white;
    border-color: #ef4444;
    transform: scale(1.05);
  }
  
  section:hover .remove-section-btn {
    opacity: 1;
  }
  
  section {
    position: relative;
  }

  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(10px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }

  .animate-fade-in-out {
    animation: fadeInOut 2s ease-in-out forwards;
  }
`;

const aiChatStyles = `
  .ai-chat-container {
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function PreviewPage() {
  const [template, setTemplate] = useState<Template | null>(null);
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [showAIChat, setShowAIChat] = useState(true);
  const [selectedImageType, setSelectedImageType] = useState<'hero' | 'feature' | 'profile' | 'gallery' | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for template in URL
    const params = new URLSearchParams(window.location.search);
    const templateParam = params.get('template');
    
    if (templateParam) {
      try {
        const decodedTemplate = JSON.parse(decodeURIComponent(templateParam));
        setTemplate(decodedTemplate);
        localStorage.setItem('generatedTemplate', JSON.stringify(decodedTemplate));
      } catch (err) {
        console.error('Failed to load template from URL:', err);
        // Fall back to localStorage
        const savedTemplate = localStorage.getItem('generatedTemplate');
        if (savedTemplate) {
          setTemplate(JSON.parse(savedTemplate));
        }
      }
    } else {
      // No URL template, load from localStorage
      const savedTemplate = localStorage.getItem('generatedTemplate');
      if (savedTemplate) {
        setTemplate(JSON.parse(savedTemplate));
      }
    }

    // Bind removeSection to window
    window.removeSection = removeSection;

    // Cleanup
    return () => {
      delete window.removeSection;
    };
  }, []);

  const handleSuggestion = async (suggestion: string) => {
    if (!template) return;
    
    try {
      setIsGenerating(true);
      const parser = new DOMParser();
      const doc = parser.parseFromString(template.html, 'text/html');

      const sectionType = suggestion.toLowerCase().includes('hero') ? 'hero' :
                         suggestion.toLowerCase().includes('features') ? 'features' :
                         suggestion.toLowerCase().includes('testimonials') ? 'testimonials' :
                         suggestion.toLowerCase().includes('gallery') ? 'gallery' :
                         suggestion.toLowerCase().includes('contact') ? 'contact' : null;

      if (!sectionType) return;

      const newSection = document.createElement('section');
      const sectionId = `section-${Date.now()}`;
      newSection.id = sectionId;
      newSection.className = `${sectionType}-section relative`;
      
      let sectionContent = `
        <button 
          onclick="window.removeSection('${sectionId}')" 
          class="remove-section-btn" 
          title="Remove section"
          aria-label="Remove section"
        >
          ×
        </button>
        <div class="container mx-auto px-4 py-16">
          ${sectionType === 'hero' ? `
            <h1 class="text-4xl font-bold mb-4">Welcome to Our Website</h1>
            <p class="text-lg mb-8">Discover amazing features and services</p>
            <img src="https://picsum.photos/1200/600" alt="Hero image" class="w-full rounded-lg shadow-lg">
          ` : sectionType === 'features' ? `
            <h2 class="text-3xl font-bold mb-8 text-center">Our Features</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="p-6 bg-white rounded-lg shadow-lg">
                <h3 class="text-xl font-semibold mb-2">Feature 1</h3>
                <p>Description of feature 1</p>
              </div>
              <div class="p-6 bg-white rounded-lg shadow-lg">
                <h3 class="text-xl font-semibold mb-2">Feature 2</h3>
                <p>Description of feature 2</p>
              </div>
              <div class="p-6 bg-white rounded-lg shadow-lg">
                <h3 class="text-xl font-semibold mb-2">Feature 3</h3>
                <p>Description of feature 3</p>
              </div>
            </div>
          ` : ''}
        </div>
      `;

      newSection.innerHTML = sectionContent;

      if (sectionType === 'hero') {
        doc.body.insertBefore(newSection, doc.body.firstChild);
      } else {
        doc.body.appendChild(newSection);
      }

      const updatedTemplate = {
        ...template,
        html: doc.body.innerHTML
      };

      setTemplate(updatedTemplate);
      localStorage.setItem('generatedTemplate', JSON.stringify(updatedTemplate));
    } catch (error) {
      console.error('Error updating template:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageGenerated = (imageUrl: string) => {
    if (!template || !selectedImageType) return;

    // Update the HTML with the new image URL
    let updatedHtml = template.html;
    switch (selectedImageType) {
      case 'hero':
        updatedHtml = updatedHtml.replace(
          /(src=["'])(https:\/\/picsum\.photos\/seed\/hero\/[^"']*)(["'])/,
          `$1${imageUrl}$3`
        );
        break;
      case 'feature':
        updatedHtml = updatedHtml.replace(
          /(src=["'])(https:\/\/picsum\.photos\/seed\/feature[^"']*)(["'])/,
          `$1${imageUrl}$3`
        );
        break;
      // Add other cases as needed
    }

    setTemplate({
      ...template,
      html: updatedHtml
    });
    localStorage.setItem('generatedTemplate', JSON.stringify({
      ...template,
      html: updatedHtml
    }));

    setSelectedImageType(null);
  };

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

  const handleShare = async () => {
    if (!template) return;
    
    // Create a shareable URL by encoding the template data
    const templateData = {
      html: template.html,
      css: template.css
    };
    
    const encodedData = encodeURIComponent(JSON.stringify(templateData));
    // Use environment variable for the URL, fallback to window.location.origin
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const url = `${baseUrl}/preview?template=${encodedData}`;
    setShareUrl(url);
    setShowShareModal(true);
    
    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      alert('URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleChatToggle = () => {
    setShowAIChat(prev => !prev);
  };

  const syncTemplateWithBackend = async (templateData: Template) => {
    try {
      const response = await fetch('/api/template/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData)
      });

      if (!response.ok) {
        throw new Error('Failed to sync template with backend');
      }

      return await response.json();
    } catch (error) {
      console.error('Error syncing with backend:', error);
      throw error;
    }
  };

  const handleUndo = async () => {
    if (!template) return;
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(template.html, 'text/html');
      
      const sections = doc.getElementsByTagName('section');
      
      if (sections.length > 0) {
        const lastSection = sections[sections.length - 1];
        lastSection.remove();
        
        const updatedTemplate = {
          ...template,
          html: doc.body.innerHTML
        };
        
        // Update local state
        setTemplate(updatedTemplate);
        localStorage.setItem('generatedTemplate', JSON.stringify(updatedTemplate));

        // Sync with backend
        await syncTemplateWithBackend(updatedTemplate);

        // Show feedback
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'fixed bottom-24 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out';
        feedbackDiv.textContent = 'Changes undone successfully';
        document.body.appendChild(feedbackDiv);

        setTimeout(() => {
          feedbackDiv.remove();
        }, 2000);
      }
    } catch (error) {
      console.error('Error undoing changes:', error);
    }
  };

  const removeSection = async (sectionId: string) => {
    if (!template) return;
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(template.html, 'text/html');
      
      const sectionToRemove = doc.getElementById(sectionId);
      if (sectionToRemove) {
        sectionToRemove.remove();
        
        const updatedTemplate = {
          ...template,
          html: doc.body.innerHTML
        };
        
        // Update local state
        setTemplate(updatedTemplate);
        localStorage.setItem('generatedTemplate', JSON.stringify(updatedTemplate));

        // Sync with backend
        await syncTemplateWithBackend(updatedTemplate);

        // Show feedback
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'fixed bottom-24 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out';
        feedbackDiv.textContent = 'Section removed successfully';
        document.body.appendChild(feedbackDiv);

        setTimeout(() => {
          feedbackDiv.remove();
        }, 2000);
      }
    } catch (error) {
      console.error('Error removing section:', error);
    }
  };

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No template found. Please generate one first.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Create New Template
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Preview Your Website</h1>
            <div className="flex gap-4">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Share2 className="w-4 h-4" />
                Share Template
              </button>
              <button
                onClick={handleChatToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showAIChat 
                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                    : 'bg-purple-800 text-purple-200 hover:bg-purple-700'
                }`}
              >
                <Bot className="w-4 h-4" />
                {showAIChat ? 'Hide AI Assistant' : 'Show AI Assistant'}
              </button>
              <button
                onClick={() => setView(view === 'preview' ? 'code' : 'preview')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
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
        {selectedImageType && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 max-w-lg w-full border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-white">Generate {selectedImageType} Image</h3>
              <InteractiveImageGenerator
                type={selectedImageType}
                onImageGenerated={handleImageGenerated}
              />
              <button
                onClick={() => setSelectedImageType(null)}
                className="mt-4 text-gray-400 hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {view === 'preview' ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="preview-container w-full"
                 dangerouslySetInnerHTML={{ __html: template.html }} />
            <style>
              {template.css}
              {commonStyles}
            </style>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">HTML</h2>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-800">
                <code>{template.html}</code>
              </pre>
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">CSS</h2>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-800">
                <code>{template.css}</code>
              </pre>
            </div>
          </div>
        )}

        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 max-w-lg w-full border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-white">Share Template</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Chat Bubble */}
      {showAIChat && (
        <div className="fixed bottom-4 right-4">
          <AIChatBubble
            onSuggestionAccept={handleSuggestion}
            onClose={() => setShowAIChat(false)}
            isGenerating={isGenerating}
            onUndo={handleUndo}
          />
        </div>
      )}

      {/* Floating button to show AI chat */}
      {!showAIChat && (
        <button
          onClick={() => setShowAIChat(true)}
          className="fixed bottom-4 right-4 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-500 transition-colors"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}

      {/* Add the styles */}
      <style>
        {commonStyles}
        {aiChatStyles}
      </style>
    </div>
  );
}