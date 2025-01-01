export interface DrawingPosition {
    x: number;
    y: number;
  }
  
  export interface CanvasProps {
    onTemplateGenerate: (template: string) => void;
  }
  
  export interface ToolBarProps {
    onToolSelect: (tool: string) => void;
    currentTool: string;
  }
  
  export interface TemplatePreviewProps {
    template: string | null;
  }
  
  export type DrawEvent = MouseEvent | TouchEvent;
  export type TemplateGenerateCallback = (template: string) => void;

  export const isTouchEvent = (event: DrawEvent): event is TouchEvent => {
    return 'touches' in event;
  };