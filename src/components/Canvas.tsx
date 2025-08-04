import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Layer, CanvasSettings } from '../types';

interface CanvasProps {
  layers: Layer[];
  settings: CanvasSettings;
  onSettingsChange: (settings: CanvasSettings) => void;
}

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ layers, settings, onSettingsChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);

    // Combine refs
    const combinedRef = (node: HTMLCanvasElement) => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(node);
        } else {
          ref.current = node;
        }
      }
      canvasRef.current = node;
    };

        // Initialize canvas
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      console.log('Canvas rendering with layers:', layers.length);

      // Set canvas size
      canvas.width = settings.width;
      canvas.height = settings.height;

      // Clear canvas and fill with paper color
      console.log('Canvas paper color:', settings.paperColor);
      ctx.clearRect(0, 0, settings.width, settings.height);
      ctx.fillStyle = settings.paperColor;
      ctx.fillRect(0, 0, settings.width, settings.height);

      // Draw grid
      drawGrid(ctx, settings);

      // Draw layers
      drawLayers(ctx, layers, settings);
    }, [layers, settings, settings.paperColor]);

    // Separate effect for paper color changes
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      console.log('Paper color effect triggered:', settings.paperColor);
      
      // Clear and redraw background
      ctx.clearRect(0, 0, settings.width, settings.height);
      ctx.fillStyle = settings.paperColor;
      ctx.fillRect(0, 0, settings.width, settings.height);

      // Redraw grid and layers
      drawGrid(ctx, settings);
      drawLayers(ctx, layers, settings);
    }, [settings.paperColor]);

                    const drawGrid = (ctx: CanvasRenderingContext2D, settings: CanvasSettings) => {
                  const { width, height, centerX, centerY, scale } = settings;

                  ctx.save();
                  ctx.strokeStyle = '#cbd5e1';
                  ctx.lineWidth = 1;
                  ctx.globalAlpha = 0.4;

                  // Draw grid lines
                  const gridSize = 50 * scale;

                  // Vertical lines
                  for (let x = centerX % gridSize; x < width; x += gridSize) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, height);
                    ctx.stroke();
                  }

                  // Horizontal lines
                  for (let y = centerY % gridSize; y < height; y += gridSize) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                    ctx.stroke();
                  }

                  // Draw center cross
                  ctx.strokeStyle = '#2563eb';
                  ctx.lineWidth = 2;
                  ctx.globalAlpha = 0.6;

                  ctx.beginPath();
                  ctx.moveTo(centerX - 10, centerY);
                  ctx.lineTo(centerX + 10, centerY);
                  ctx.moveTo(centerX, centerY - 10);
                  ctx.lineTo(centerX, centerY + 10);
                  ctx.stroke();

                  ctx.restore();
                };

    const drawLayers = (ctx: CanvasRenderingContext2D, layers: Layer[], settings: CanvasSettings) => {
      const { scale } = settings;
      
      console.log('Drawing layers:', layers.length);
      
      ctx.save();
      ctx.scale(scale, scale);

      // Draw layers in order
      layers.forEach((layer, index) => {
        console.log(`Layer ${index}: visible=${layer.visible}, points=${layer.points.length}`);
        if (!layer.visible || layer.points.length < 2) return;

        ctx.save();
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = layer.strokeWidth;
        ctx.globalAlpha = layer.opacity / 100;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw path
        ctx.beginPath();
        ctx.moveTo(layer.points[0].x, layer.points[0].y);
        
        for (let i = 1; i < layer.points.length; i++) {
          ctx.lineTo(layer.points[i].x, layer.points[i].y);
        }
        
        ctx.stroke();
        ctx.restore();
      });

      ctx.restore();
    };

    // Mouse event handlers
    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      onSettingsChange({
        ...settings,
        centerX: settings.centerX + deltaX,
        centerY: settings.centerY + deltaY
      });

      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault();
      
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(0.1, Math.min(5, settings.scale * delta));
      
      onSettingsChange({
        ...settings,
        scale: newScale
      });
    };

    return (
      <div className="flex-1 relative bg-background">
        <canvas
          ref={combinedRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
        
        {/* Canvas Info Overlay */}
        <div className="absolute top-4 right-4 bg-surface border border-border rounded-lg p-3 text-sm">
          <div className="flex flex-col gap-1">
            <div>Scale: {(settings.scale * 100).toFixed(0)}%</div>
            <div>Center: ({Math.round(settings.centerX)}, {Math.round(settings.centerY)})</div>
            <div>Layers: {layers.filter(l => l.visible).length}</div>
          </div>
        </div>
      </div>
    );
  }
); 