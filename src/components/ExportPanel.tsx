import React from 'react';
import { ExportSettings } from '../types';
import { Download, FileText, Image, Settings } from 'lucide-react';

interface ExportPanelProps {
  settings: ExportSettings;
  onSettingsChange: (settings: ExportSettings) => void;
  onExport: () => void;
  layerCount: number;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  settings,
  onSettingsChange,
  onExport,
  layerCount
}) => {
  const handleSettingChange = (key: keyof ExportSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const getFileSize = () => {
    // Rough estimate based on layer count and complexity
    const baseSize = 2; // KB
    const perLayer = layerCount * 0.5; // KB per layer
    return Math.round(baseSize + perLayer);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Export Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Export Status</h3>
          <div className="text-sm text-text-secondary">
            {layerCount} layer{layerCount !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Estimated file size:</span>
            <span className="text-text-secondary">{getFileSize()} KB</span>
          </div>
          <div className="flex justify-between">
            <span>Format:</span>
            <span className="text-text-secondary">SVG Vector</span>
          </div>
          <div className="flex justify-between">
            <span>Resolution:</span>
            <span className="text-text-secondary">Infinite (Vector)</span>
          </div>
        </div>
      </div>

      {/* Export Format */}
      <div className="card">
        <h4 className="text-sm font-medium mb-3">Export Format</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="format"
              value="svg"
              checked={settings.format === 'svg'}
              onChange={(e) => handleSettingChange('format', e.target.value)}
              className="text-primary"
            />
            <FileText size={16} />
            <span>SVG Vector (Recommended)</span>
          </label>
          
          <div className="text-xs text-text-secondary ml-6">
            Perfect for plotting, scalable, editable
          </div>
        </div>
      </div>

      {/* Canvas Size */}
      <div className="card">
        <h4 className="text-sm font-medium mb-3">Canvas Size</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-text-secondary mb-1">Width (px)</label>
            <input
              type="number"
              min="100"
              max="2000"
              value={settings.width}
              onChange={(e) => handleSettingChange('width', parseInt(e.target.value))}
              className="input"
            />
          </div>
          
          <div>
            <label className="block text-xs text-text-secondary mb-1">Height (px)</label>
            <input
              type="number"
              min="100"
              max="2000"
              value={settings.height}
              onChange={(e) => handleSettingChange('height', parseInt(e.target.value))}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="card">
        <h4 className="text-sm font-medium mb-3">Export Options</h4>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.includeMetadata}
              onChange={(e) => handleSettingChange('includeMetadata', e.target.checked)}
              className="text-primary"
            />
            <span>Include metadata</span>
          </label>
          
          <div className="text-xs text-text-secondary ml-6">
            Adds layer information and parameters as comments
          </div>
        </div>
      </div>

      {/* Quick Sizes */}
      <div className="card">
        <h4 className="text-sm font-medium mb-3">Quick Sizes</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'A4', width: 794, height: 1123 },
            { name: 'A3', width: 1123, height: 1587 },
            { name: 'Square', width: 800, height: 800 },
            { name: 'Wide', width: 1200, height: 600 }
          ].map((size) => (
            <button
              key={size.name}
              onClick={() => onSettingsChange({
                ...settings,
                width: size.width,
                height: size.height
              })}
              className="btn btn-secondary text-xs py-2"
            >
              {size.name}
            </button>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <div className="space-y-3">
        <button
          onClick={onExport}
          disabled={layerCount === 0}
          className="btn btn-primary w-full"
        >
          <Download size={16} />
          Export SVG
        </button>
        
        <div className="text-xs text-text-secondary text-center">
          <p>SVG files can be opened in:</p>
          <p>Inkscape, Illustrator, Plotter software</p>
        </div>
      </div>

      {/* Export Tips */}
      <div className="card">
        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Settings size={16} />
          Export Tips
        </h4>
        <div className="text-xs text-text-secondary space-y-2">
          <p>• SVG files are perfect for AxiDraw plotting</p>
          <p>• Use A4 size for standard paper</p>
          <p>• Include metadata for parameter reference</p>
          <p>• Vector format scales to any size</p>
        </div>
      </div>
    </div>
  );
}; 