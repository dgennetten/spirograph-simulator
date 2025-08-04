import React, { useState, useRef, useEffect } from 'react';
import { Layer, SpirographParams, CanvasSettings, ExportSettings } from './types';
import { SpirographCalculator } from './utils/spirograph';
import { SVGExporter } from './utils/svgExport';
import { Canvas } from './components/Canvas';
import { Controls } from './components/Controls';
import { LayerPanel } from './components/LayerPanel';
import { ExportPanel } from './components/ExportPanel';
import { Download, Palette, Layers, Settings } from 'lucide-react';

function App() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [currentParams, setCurrentParams] = useState<SpirographParams>(
    SpirographCalculator.getDefaultParams()
  );
  const [canvasSettings, setCanvasSettings] = useState<CanvasSettings>({
    width: 800,
    height: 600,
    centerX: 400,
    centerY: 300,
    scale: 1
  });
  const [exportSettings, setExportSettings] = useState<ExportSettings>(
    SVGExporter.getDefaultExportSettings()
  );
  const [activePanel, setActivePanel] = useState<'controls' | 'layers' | 'export'>('controls');
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate a new layer with current parameters
  const generateLayer = () => {
    setIsGenerating(true);
    
    // Simulate generation delay for better UX
    setTimeout(() => {
      const points = SpirographCalculator.generatePoints(
        currentParams,
        canvasSettings.centerX,
        canvasSettings.centerY
      );
      
      const newLayer: Layer = {
        id: Date.now().toString(),
        name: `Layer ${layers.length + 1}`,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        strokeWidth: 2,
        opacity: 100,
        visible: true,
        points,
        params: { ...currentParams }
      };
      
      setLayers(prev => [...prev, newLayer]);
      setIsGenerating(false);
    }, 100);
  };

  // Update layer
  const updateLayer = (id: string, updates: Partial<Layer>) => {
    setLayers(prev => prev.map(layer => 
      layer.id === id ? { ...layer, ...updates } : layer
    ));
  };

  // Delete layer
  const deleteLayer = (id: string) => {
    setLayers(prev => prev.filter(layer => layer.id !== id));
  };

  // Export SVG
  const exportSVG = () => {
    const svgContent = SVGExporter.exportToSVG(layers, canvasSettings, exportSettings);
    const filename = `spirograph-${Date.now()}.svg`;
    SVGExporter.downloadSVG(svgContent, filename);
  };

  // Clear all layers
  const clearLayers = () => {
    setLayers([]);
  };

  // Validate current parameters
  const validationError = SpirographCalculator.validateParams(currentParams);

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Header */}
      <header className="bg-surface border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Spirograph Simulator</h1>
            <span className="text-sm text-text-secondary">
              {layers.length} layer{layers.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={clearLayers}
              className="btn btn-secondary"
              disabled={layers.length === 0}
            >
              Clear All
            </button>
            <button
              onClick={exportSVG}
              className="btn btn-primary"
              disabled={layers.length === 0}
            >
              <Download size={16} />
              Export SVG
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-80 bg-surface border-r border-border flex flex-col">
          {/* Panel Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActivePanel('controls')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activePanel === 'controls' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              <Palette size={16} className="inline mr-2" />
              Controls
            </button>
            <button
              onClick={() => setActivePanel('layers')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activePanel === 'layers' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              <Layers size={16} className="inline mr-2" />
              Layers
            </button>
            <button
              onClick={() => setActivePanel('export')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activePanel === 'export' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              <Settings size={16} className="inline mr-2" />
              Export
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto">
            {activePanel === 'controls' && (
              <Controls
                params={currentParams}
                onParamsChange={setCurrentParams}
                onGenerate={generateLayer}
                isGenerating={isGenerating}
                validationError={validationError}
              />
            )}
            
            {activePanel === 'layers' && (
              <LayerPanel
                layers={layers}
                onUpdateLayer={updateLayer}
                onDeleteLayer={deleteLayer}
              />
            )}
            
            {activePanel === 'export' && (
              <ExportPanel
                settings={exportSettings}
                onSettingsChange={setExportSettings}
                onExport={exportSVG}
                layerCount={layers.length}
              />
            )}
          </div>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 flex flex-col">
          <Canvas
            ref={canvasRef}
            layers={layers}
            settings={canvasSettings}
            onSettingsChange={setCanvasSettings}
          />
        </main>
      </div>
    </div>
  );
}

export default App; 