'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Brush, Eraser, RotateCcw, Download, PenTool } from 'lucide-react';
import { generateTemplateFromDrawing } from '@/lib/utils/templateGenerator';

interface Tool {
  name: 'brush' | 'eraser';
  size: number;
  color: string;
}

interface DrawingPadProps {
  onTemplateGenerate: (template: string) => void;
}

export default function DrawingPad({ onTemplateGenerate }: DrawingPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>({
    name: 'brush',
    size: 2,
    color: '#000000'
  });
  const [drawingHistory, setDrawingHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state
    const initialState = context.getImageData(0, 0, canvas.width, canvas.height);
    setDrawingHistory([initialState]);
    setHistoryIndex(0);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e 
      ? e.touches[0].clientX - rect.left 
      : e.clientX - rect.left;
    const y = 'touches' in e 
      ? e.touches[0].clientY - rect.top 
      : e.clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e 
      ? e.touches[0].clientX - rect.left 
      : e.clientX - rect.left;
    const y = 'touches' in e 
      ? e.touches[0].clientY - rect.top 
      : e.clientY - rect.top;

    context.lineTo(x, y);
    context.strokeStyle = currentTool.name === 'eraser' ? '#ffffff' : currentTool.color;
    context.lineWidth = currentTool.size;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.closePath();
    setIsDrawing(false);

    // Save state to history
    const newState = context.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = drawingHistory.slice(0, historyIndex + 1);
    setDrawingHistory([...newHistory, newState]);
    setHistoryIndex(historyIndex + 1);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Save cleared state
    const clearedState = context.getImageData(0, 0, canvas.width, canvas.height);
    setDrawingHistory([...drawingHistory, clearedState]);
    setHistoryIndex(historyIndex + 1);
  };

  const undoLastAction = () => {
    if (historyIndex <= 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const newIndex = historyIndex - 1;
    context.putImageData(drawingHistory[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'website-sketch.png';
    link.href = dataURL;
    link.click();
  };

  const generateTemplate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const template = generateTemplateFromDrawing(canvas);
    onTemplateGenerate(template);
  }, [onTemplateGenerate]);

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg p-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4 p-2 bg-gray-50 rounded-lg">
        <div className="flex space-x-4">
          <button
            onClick={() => setCurrentTool({ ...currentTool, name: 'brush' })}
            className={`p-2 rounded ${currentTool.name === 'brush' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'}`}
          >
            <PenTool className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentTool({ ...currentTool, name: 'eraser' })}
            className={`p-2 rounded ${currentTool.name === 'eraser' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'}`}
          >
            <Eraser className="w-5 h-5" />
          </button>
          <input
            type="color"
            value={currentTool.color}
            onChange={(e) => setCurrentTool({ ...currentTool, color: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer"
          />
          <select
            value={currentTool.size}
            onChange={(e) => setCurrentTool({ ...currentTool, size: Number(e.target.value) })}
            className="p-1 border rounded"
          >
            <option value="2">Small</option>
            <option value="5">Medium</option>
            <option value="10">Large</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={undoLastAction}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={clearCanvas}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
          >
            Clear
          </button>
          <button
            onClick={downloadDrawing}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border border-gray-200 rounded-lg touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-500">
        <p>Draw your website layout here. Use the toolbar to:</p>
        <ul className="list-disc list-inside mt-2">
          <li>Switch between pen and eraser</li>
          <li>Change colors and brush size</li>
          <li>Undo actions or clear the canvas</li>
          <li>Download your sketch</li>
        </ul>
      </div>
    </div>
  );
}