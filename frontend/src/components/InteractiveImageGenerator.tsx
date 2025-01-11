'use client';

import React, { useState, useEffect } from 'react';
import { ImagePlus, RefreshCw, Check, Sparkles, Camera, Palette } from 'lucide-react';

interface ImageGeneratorProps {
  onImageGenerated: (imageUrl: string) => void;
  type: 'hero' | 'feature' | 'profile' | 'gallery';
  size?: { width: number; height: number };
}

export default function InteractiveImageGenerator({ 
  onImageGenerated, 
  type,
  size = { width: 400, height: 400 }
}: ImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [imageHistory, setImageHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [style, setStyle] = useState<'natural' | 'vibrant' | 'minimal'>('natural');
  const [showTooltip, setShowTooltip] = useState(false);

  const generateImage = (styleType: 'natural' | 'vibrant' | 'minimal' = style) => {
    setIsGenerating(true);
    setStyle(styleType);
    
    // Generate a random seed for unique images
    const seed = Math.floor(Math.random() * 1000);
    
    // Create URL based on image type and style
    let imageUrl = '';
    const styleParams = {
      natural: '',
      vibrant: '?grayscale',
      minimal: '?blur=2'
    };
    
    switch (type) {
      case 'hero':
        imageUrl = `https://picsum.photos/seed/${seed}/1920/1080${styleParams[styleType]}`;
        break;
      case 'feature':
        imageUrl = `https://picsum.photos/seed/${seed}/300/300${styleParams[styleType]}`;
        break;
      case 'profile':
        imageUrl = `https://picsum.photos/seed/${seed}/400/400${styleParams[styleType]}`;
        break;
      case 'gallery':
        imageUrl = `https://picsum.photos/seed/${seed}/800/600${styleParams[styleType]}`;
        break;
      default:
        imageUrl = `https://picsum.photos/seed/${seed}/${size.width}/${size.height}${styleParams[styleType]}`;
    }

    // Add loading animation
    setTimeout(() => {
      setCurrentImage(imageUrl);
      setImageHistory(prev => [...prev, imageUrl]);
      setHistoryIndex(prev => prev + 1);
      setIsGenerating(false);
      
      // Show tooltip briefly
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }, 800);
  };

  const acceptImage = () => {
    if (currentImage) {
      // Add acceptance animation
      const container = document.querySelector('.image-container');
      container?.classList.add('scale-acceptance');
      setTimeout(() => {
        container?.classList.remove('scale-acceptance');
        onImageGenerated(currentImage);
      }, 300);
    }
  };

  const undoImage = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setCurrentImage(imageHistory[historyIndex - 1]);
    }
  };

  const redoImage = () => {
    if (historyIndex < imageHistory.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setCurrentImage(imageHistory[historyIndex + 1]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Style selector */}
      <div className="flex justify-center space-x-2 mb-4">
        <button
          onClick={() => generateImage('natural')}
          className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-all ${
            style === 'natural' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          } hover:shadow-md`}
        >
          <Camera className="w-4 h-4" />
          <span>Natural</span>
        </button>
        <button
          onClick={() => generateImage('vibrant')}
          className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-all ${
            style === 'vibrant' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
          } hover:shadow-md`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Vibrant</span>
        </button>
        <button
          onClick={() => generateImage('minimal')}
          className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-all ${
            style === 'minimal' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
          } hover:shadow-md`}
        >
          <Palette className="w-4 h-4" />
          <span>Minimal</span>
        </button>
      </div>

      <div className="relative group image-container">
        {currentImage ? (
          <div className="relative transform transition-all duration-300 hover:scale-[1.02]">
            <img
              src={currentImage}
              alt="Generated content"
              className="rounded-lg shadow-lg w-full h-full object-cover transition-shadow duration-300 hover:shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end justify-center pb-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => undoImage()}
                  disabled={historyIndex <= 0}
                  className={`p-2 bg-white/90 rounded-full hover:bg-white transition-colors ${
                    historyIndex <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title="Undo"
                >
                  <RefreshCw className="w-5 h-5 text-gray-700 transform rotate-[-90deg]" />
                </button>
                <button
                  onClick={() => generateImage()}
                  disabled={isGenerating}
                  className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                  title="Generate new"
                >
                  <RefreshCw className={`w-5 h-5 text-gray-700 ${isGenerating ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={acceptImage}
                  className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
                  title="Accept image"
                >
                  <Check className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => redoImage()}
                  disabled={historyIndex >= imageHistory.length - 1}
                  className={`p-2 bg-white/90 rounded-full hover:bg-white transition-colors ${
                    historyIndex >= imageHistory.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title="Redo"
                >
                  <RefreshCw className="w-5 h-5 text-gray-700 transform rotate-90" />
                </button>
              </div>
            </div>
            
            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/75 text-white px-4 py-2 rounded-full text-sm animate-fade-in-out">
                Hover to see options
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => generateImage()}
            disabled={isGenerating}
            className="w-full h-full min-h-[300px] border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300 flex flex-col items-center justify-center p-4 group"
          >
            {isGenerating ? (
              <div className="flex flex-col items-center">
                <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mb-2" />
                <span className="text-sm text-purple-600">Generating the perfect image...</span>
              </div>
            ) : (
              <>
                <ImagePlus className="w-8 h-8 text-gray-400 mb-2 group-hover:text-purple-500 transition-colors" />
                <span className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors">
                  Click to generate {type} image
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
} 