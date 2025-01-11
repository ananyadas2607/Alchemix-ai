'use client';

import React, { useState, useEffect } from 'react';
import { Bot, X, Wand2, Sparkles, Layout, Image } from 'lucide-react';

interface AIChatBubbleProps {
  onSuggestionAccept: (suggestion: string) => void;
  onClose: () => void;
  isGenerating?: boolean;
  suggestions?: string[];
}

export default function AIChatBubble({ 
  onSuggestionAccept, 
  onClose, 
  isGenerating = false,
  suggestions = [
    "Add a hero section with a large background image",
    "Include a features grid to showcase key points",
    "Add a testimonials section with client reviews",
    "Include a contact form section",
    "Add a gallery section to showcase images"
  ]
}: AIChatBubbleProps) {
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setIsTyping(true);
    let currentText = '';
    const suggestion = suggestions[currentSuggestionIndex];
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      if (charIndex < suggestion.length) {
        currentText += suggestion[charIndex];
        setDisplayedText(currentText);
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentSuggestionIndex, suggestions]);

  const handleNext = () => {
    setCurrentSuggestionIndex((prev) => (prev + 1) % suggestions.length);
  };

  return (
    <div className="bg-gray-900/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-800 max-w-md w-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-semibold">AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-gray-300 min-h-[3rem]">
          {displayedText}
          {isTyping && <span className="typing-indicator">|</span>}
        </p>
      </div>

      <div className="flex justify-between gap-2">
        <button
          onClick={() => onSuggestionAccept(suggestions[currentSuggestionIndex])}
          disabled={isTyping || isGenerating}
          className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
            isTyping || isGenerating
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-500'
          }`}
        >
          {isGenerating ? 'Generating...' : 'Accept'}
        </button>
        <button
          onClick={handleNext}
          disabled={isTyping || isGenerating}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            isTyping || isGenerating
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
} 