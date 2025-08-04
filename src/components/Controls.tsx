import React from 'react';
import { SpirographParams } from '../types';
import { SpirographCalculator } from '../utils/spirograph';
import { Play, RotateCcw, Sparkles } from 'lucide-react';

interface ControlsProps {
  params: SpirographParams;
  onParamsChange: (params: SpirographParams) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  validationError: string | null;
  paperColor: string;
  onPaperColorChange: (color: string) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  params,
  onParamsChange,
  onGenerate,
  isGenerating,
  validationError,
  paperColor,
  onPaperColorChange
}) => {
  const patternType = SpirographCalculator.getPatternType(params);
  const estimatedTime = SpirographCalculator.getEstimatedTime(params);
  const overlapRevolutions = SpirographCalculator.calculateOverlapRevolutions(params.fixedRadius, params.movingRadius);

  const handleParamChange = (key: keyof SpirographParams, value: number) => {
    onParamsChange({
      ...params,
      [key]: value
    });
  };

  const resetToDefaults = () => {
    onParamsChange(SpirographCalculator.getDefaultParams());
  };

  const generateRandomParams = () => {
    const randomParams: SpirographParams = {
      fixedRadius: Math.floor(Math.random() * 150) + 50,
      movingRadius: Math.floor(Math.random() * 80) + 20,
      penDistance: Math.floor(Math.random() * 60) + 10,
      revolutions: Math.floor(Math.random() * 10) + 1,
      stopOnOverlap: false
    };
    
    // Ensure moving radius is smaller than fixed radius
    if (randomParams.movingRadius >= randomParams.fixedRadius) {
      randomParams.movingRadius = Math.floor(randomParams.fixedRadius * 0.6);
    }
    
    onParamsChange(randomParams);
  };

  return (
    <div className="space-y-4">
      {/* Pattern Type Display */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Pattern Type</h3>
            <p className="card-subtitle">Current configuration</p>
          </div>
          <span className="text-sm text-text-secondary bg-primary/10 px-2 py-1 rounded">{patternType}</span>
        </div>
        
        {validationError && (
          <div className="bg-error/10 border border-error/20 rounded p-3 mb-4">
            <p className="text-error text-sm">{validationError}</p>
          </div>
        )}
        
        <div className="text-sm text-text-secondary">
          Estimated time: {estimatedTime.toFixed(1)}s
        </div>
      </div>

      {/* Fixed Radius */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Fixed Radius</h3>
            <p className="card-subtitle">Outer circle size</p>
          </div>
          <span className="text-lg font-semibold text-primary">{params.fixedRadius}</span>
        </div>
        <input
          type="range"
          min="20"
          max="200"
          value={params.fixedRadius}
          onChange={(e) => handleParamChange('fixedRadius', parseInt(e.target.value))}
          className="slider"
        />
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>20</span>
          <span>200</span>
        </div>
      </div>

      {/* Moving Radius */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Moving Radius</h3>
            <p className="card-subtitle">Inner circle size</p>
          </div>
          <span className="text-lg font-semibold text-primary">{params.movingRadius}</span>
        </div>
        <input
          type="range"
          min="10"
          max={params.fixedRadius - 10}
          value={params.movingRadius}
          onChange={(e) => handleParamChange('movingRadius', parseInt(e.target.value))}
          className="slider"
        />
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>10</span>
          <span>{params.fixedRadius - 10}</span>
        </div>
      </div>

      {/* Pen Distance */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Pen Distance</h3>
            <p className="card-subtitle">Distance from center</p>
          </div>
          <span className="text-lg font-semibold text-primary">{params.penDistance}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={params.penDistance}
          onChange={(e) => handleParamChange('penDistance', parseInt(e.target.value))}
          className="slider"
        />
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>0</span>
          <span>100</span>
        </div>
      </div>

      {/* Revolutions */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Revolutions</h3>
            <p className="card-subtitle">Number of rotations</p>
          </div>
          <span className="text-lg font-semibold text-primary">
            {params.stopOnOverlap ? overlapRevolutions.toFixed(1) : params.revolutions.toFixed(1)}
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={params.stopOnOverlap}
              onChange={(e) => onParamsChange({ ...params, stopOnOverlap: e.target.checked })}
              className="text-primary"
            />
            <span>Stop on overlap</span>
          </label>
        </div>
        
        {!params.stopOnOverlap && (
          <>
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={Math.log10(params.revolutions + 1) * 33.33}
              onChange={(e) => {
                const logValue = parseFloat(e.target.value) / 33.33;
                const revolutions = Math.pow(10, logValue) - 1;
                handleParamChange('revolutions', revolutions);
              }}
              className="slider"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>1</span>
              <span>1000</span>
            </div>
          </>
        )}
        
        {params.stopOnOverlap && (
          <div className="text-xs text-text-secondary mt-1">
            <div>Auto-calculated: {overlapRevolutions.toFixed(1)} revolutions</div>
            <div>Ratio: {params.fixedRadius}:{params.movingRadius}</div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Actions</h3>
          <p className="card-subtitle">Generate and control</p>
        </div>
        <div className="space-y-3">
          <button
            onClick={onGenerate}
            disabled={isGenerating || !!validationError}
            className="btn btn-primary w-full"
          >
            <Play size={16} />
            {isGenerating ? 'Generating...' : 'Generate Pattern'}
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={resetToDefaults}
              className="btn btn-secondary flex-1"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            
            <button
              onClick={generateRandomParams}
              className="btn btn-secondary flex-1"
            >
              <Sparkles size={16} />
              Random
            </button>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Presets</h3>
          <p className="card-subtitle">Pre-configured patterns</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'Cardioid', params: { fixedRadius: 100, movingRadius: 50, penDistance: 30, revolutions: 2, stopOnOverlap: false } },
            { name: 'Nephroid', params: { fixedRadius: 90, movingRadius: 30, penDistance: 25, revolutions: 3, stopOnOverlap: false } },
            { name: 'Deltoid', params: { fixedRadius: 120, movingRadius: 30, penDistance: 20, revolutions: 4, stopOnOverlap: false } },
            { name: 'Astroid', params: { fixedRadius: 100, movingRadius: 20, penDistance: 15, revolutions: 5, stopOnOverlap: false } }
          ].map((preset) => (
            <button
              key={preset.name}
              onClick={() => onParamsChange(preset.params)}
              className="btn btn-secondary text-xs py-2"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Paper Color */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Paper Color</h3>
            <p className="card-subtitle">Background color</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={paperColor}
              onChange={(e) => {
                console.log('Paper color changed to:', e.target.value);
                onPaperColorChange(e.target.value);
              }}
              className="w-8 h-8 rounded border border-border cursor-pointer"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: 'Cornsilk', color: '#fff8dc' },
            { name: 'White', color: '#ffffff' },
            { name: 'Cream', color: '#f5f5dc' },
            { name: 'Ivory', color: '#fffff0' },
            { name: 'Beige', color: '#f5f5dc' },
            { name: 'Parchment', color: '#f0e68c' }
          ].map((paper) => (
            <button
              key={paper.name}
              onClick={() => {
                console.log('Paper preset clicked:', paper.name, paper.color);
                onPaperColorChange(paper.color);
              }}
              className="btn btn-secondary text-xs py-1"
            >
              {paper.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 