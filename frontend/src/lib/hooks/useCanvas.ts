import { useRef, useState, useCallback, RefObject } from 'react';
import { generateTemplateFromDrawing } from '@/lib/utils/templateGenerator';
import { DrawEvent, TemplateGenerateCallback, isTouchEvent } from '@/types/canvas';

export const useCanvas = (
  canvasRef: RefObject<HTMLCanvasElement>,
  onTemplateGenerate: TemplateGenerateCallback
) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const lastPos = useRef({ x: 0, y: 0 });

  const startDrawing = useCallback((e: DrawEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Handle both mouse and touch events
    const clientX = isTouchEvent(e) ? e.touches[0].clientX : e.clientX;
    const clientY = isTouchEvent(e) ? e.touches[0].clientY : e.clientY;
    
    lastPos.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
    
    setIsDrawing(true);
  }, []);

  const draw = useCallback((e: DrawEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    
    // Handle both mouse and touch events
    const clientX = isTouchEvent(e) ? e.touches[0].clientX : e.clientX;
    const clientY = isTouchEvent(e) ? e.touches[0].clientY : e.clientY;
    
    const currentPos = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };

    ctx.beginPath();
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.stroke();
    
    lastPos.current = currentPos;
  }, [isDrawing, currentColor, brushSize]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const generateTemplate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const template = generateTemplateFromDrawing(canvas);
    onTemplateGenerate(template);
  }, [onTemplateGenerate, canvasRef]);

  return {
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    generateTemplate,
    currentColor,
    setCurrentColor,
    brushSize,
    setBrushSize,
  };
};