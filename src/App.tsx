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
    scale: 1,
    paperColor: '#fff8dc'
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
    // Use canvas paper color for export
    const exportSettingsWithPaper = {
      ...exportSettings,
      paperColor: canvasSettings.paperColor
    };
    const svgContent = SVGExporter.exportToSVG(layers, canvasSettings, exportSettingsWithPaper);
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
          
          <div className="flex items-center gap-3">
            <button
              onClick={clearLayers}
              className="bg-surface border border-border rounded-lg px-6 py-3 text-sm font-medium transition-all hover:border-primary hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={layers.length === 0}
            >
              Clear All
            </button>
            <button
              onClick={exportSVG}
              className="bg-primary text-white border border-primary rounded-lg px-6 py-3 text-sm font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={layers.length === 0}
            >
              <Download size={16} className="inline mr-2" />
              Export SVG
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 main-layout">
        {/* Sidebar */}
        <aside className="w-80 bg-surface border-r border-border flex flex-col sidebar">
          {/* Panel Tabs */}
          <div className="flex gap-2 p-4 bg-surface border-b border-border panel-tabs">
            <button
              onClick={() => setActivePanel('controls')}
              className={`flex-1 py-4 px-10 text-sm font-medium transition-all rounded-lg ${
                activePanel === 'controls' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-text-secondary hover:text-text hover:bg-border/50'
              }`}
            >
              <Palette size={18} className={`inline mr-2 ${activePanel === 'controls' ? 'text-white' : 'text-text-secondary'}`} />
              Controls
            </button>
            <button
              onClick={() => setActivePanel('layers')}
              className={`flex-1 py-4 px-10 text-sm font-medium transition-all rounded-lg ${
                activePanel === 'layers' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-text-secondary hover:text-text hover:bg-border/50'
              }`}
            >
              <Layers size={18} className={`inline mr-2 ${activePanel === 'layers' ? 'text-white' : 'text-text-secondary'}`} />
              Layers
            </button>
            <button
              onClick={() => setActivePanel('export')}
              className={`flex-1 py-4 px-10 text-sm font-medium transition-all rounded-lg ${
                activePanel === 'export' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-text-secondary hover:text-text hover:bg-border/50'
              }`}
            >
              <Settings size={18} className={`inline mr-2 ${activePanel === 'export' ? 'text-white' : 'text-text-secondary'}`} />
              Export
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activePanel === 'controls' && (
              <Controls
                params={currentParams}
                onParamsChange={setCurrentParams}
                onGenerate={generateLayer}
                isGenerating={isGenerating}
                validationError={validationError}
                paperColor={canvasSettings.paperColor}
                onPaperColorChange={(color) => {
                  console.log('App: Paper color changing to:', color);
                  setCanvasSettings(prev => {
                    const newSettings = { ...prev, paperColor: color };
                    console.log('App: New canvas settings:', newSettings);
                    return newSettings;
                  });
                }}
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
        <main className="flex-1 flex flex-col canvas-container">
          <Canvas
            ref={canvasRef}
            layers={layers}
            settings={canvasSettings}
            onSettingsChange={setCanvasSettings}
            key={`canvas-${canvasSettings.paperColor}`}
          />
        </main>
      </div>
    </div>
  );
}

export default App; 