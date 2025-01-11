'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Bot, X, Layout, Image, Grid, Users, Phone, Palette, Undo, Check } from 'lucide-react';

interface Suggestion {
  text: string;
  icon: React.ReactNode;
  category: string;
}

interface AIChatBubbleProps {
  onSuggestionAccept: (suggestion: string) => void;
  onClose: () => void;
  isGenerating?: boolean;
  onUndo?: () => void;
}

export default function AIChatBubble({ 
  onSuggestionAccept, 
  onClose, 
  isGenerating = false,
  onUndo
}: AIChatBubbleProps) {
  const suggestions: Suggestion[] = [
    {
      text: "Add a modern hero section with a captivating background image",
      icon: <Layout className="w-4 h-4" />,
      category: "Layout"
    },
    {
      text: "Include an interactive features grid with hover effects",
      icon: <Grid className="w-4 h-4" />,
      category: "Features"
    },
    {
      text: "Add a testimonials carousel with client photos",
      icon: <Users className="w-4 h-4" />,
      category: "Social Proof"
    },
    {
      text: "Create an image gallery with lightbox effect",
      icon: <Image className="w-4 h-4" />,
      category: "Gallery"
    },
    {
      text: "Add a modern contact form with animated inputs",
      icon: <Phone className="w-4 h-4" />,
      category: "Contact"
    },
    {
      text: "Update the color scheme to a modern gradient palette",
      icon: <Palette className="w-4 h-4" />,
      category: "Style"
    }
  ];

  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showUndoConfirm, setShowUndoConfirm] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');

  const typeText = useCallback((text: string) => {
    setIsTyping(true);
    setDisplayedText('');
    
    const chars = text.split('');
    let currentIndex = 0;

    const typeChar = () => {
      if (currentIndex < chars.length) {
        setDisplayedText(prev => prev + chars[currentIndex]);
        currentIndex++;
        setTimeout(typeChar, 30 + Math.random() * 20);
      } else {
        setIsTyping(false);
      }
    };

    setTimeout(typeChar, 1000);
  }, []);

  useEffect(() => {
    const appearanceTimer = setTimeout(() => {
      setIsVisible(true);
      setShowSuggestions(true);
    }, 300);

    return () => clearTimeout(appearanceTimer);
  }, []);

  useEffect(() => {
    if (isVisible && !showSuggestions) {
      const suggestion = suggestions[currentSuggestionIndex].text;
      typeText(suggestion);
    }

    return () => {
      setDisplayedText('');
      setIsTyping(false);
    };
  }, [currentSuggestionIndex, suggestions, typeText, isVisible, showSuggestions]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setShowSuggestions(false);
    setCurrentSuggestionIndex(suggestions.indexOf(suggestion));
    setLastAction(suggestion.text);
    onSuggestionAccept(suggestion.text);
    setShowUndoConfirm(true);
    
    setTimeout(() => {
      setShowUndoConfirm(false);
      setShowSuggestions(true);
    }, 10000);
  };

  const handleUndo = () => {
    if (onUndo) {
      onUndo();
    }
    setShowUndoConfirm(false);
    setShowSuggestions(true);
    setDisplayedText('Changes undone. What else would you like to try?');
  };

  const handleConfirm = () => {
    setShowUndoConfirm(false);
    setShowSuggestions(true);
    setDisplayedText('Great! What else would you like to add to your website?');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gray-900/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-800 max-w-md w-full animate-fadeIn">
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

      {showUndoConfirm ? (
        <div className="space-y-4">
          <p className="text-gray-300">
            {isGenerating ? 'Generating your changes...' : 'How do you like the changes?'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleUndo}
              disabled={isGenerating}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all
                ${isGenerating 
                  ? 'bg-gray-800/50 text-gray-400 cursor-not-allowed' 
                  : 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30'}`}
            >
              <Undo className="w-4 h-4" />
              Cancel Changes
            </button>
            <button
              onClick={handleConfirm}
              disabled={isGenerating}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all
                ${isGenerating 
                  ? 'bg-gray-800/50 text-gray-400 cursor-not-allowed' 
                  : 'bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-600/30'}`}
            >
              <Check className="w-4 h-4" />
              Keep Changes
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center">
            This option will disappear in a few seconds
          </p>
        </div>
      ) : showSuggestions ? (
        <div className="space-y-3">
          <p className="text-gray-300 mb-4">What would you like to add to your website?</p>
          <div className="grid grid-cols-1 gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isGenerating}
                className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                  isGenerating
                    ? 'bg-gray-800/50 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                }`}
              >
                <span className="p-2 rounded-lg bg-gray-700">{suggestion.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{suggestion.text}</p>
                  <p className="text-xs text-gray-400">{suggestion.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-300 min-h-[3rem] leading-relaxed">
              {displayedText}
              {isTyping && <span className="typing-indicator" aria-hidden="true" />}
            </p>
          </div>

          <div className="flex justify-between gap-2">
            <button
              onClick={() => setShowSuggestions(true)}
              className="flex-1 px-4 py-2 rounded-xl font-medium bg-purple-600 text-white hover:bg-purple-500 transition-all"
            >
              Show More Suggestions
            </button>
          </div>
        </>
      )}

      <style>{typingIndicatorStyles}</style>
    </div>
  );
}

const typingIndicatorStyles = `
  .typing-indicator {
    display: inline-block;
    width: 2px;
    height: 1.2em;
    background-color: currentColor;
    margin-left: 2px;
    vertical-align: middle;
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }

  @keyframes fadeIn {
    from { 
      opacity: 0;
      transform: translateY(10px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
`; 