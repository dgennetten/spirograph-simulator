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
}

export const Controls: React.FC<ControlsProps> = ({
  params,
  onParamsChange,
  onGenerate,
  isGenerating,
  validationError
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
    <div className="p-6 space-y-6">
      {/* Pattern Type Display */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Pattern Type</h3>
          <span className="text-sm text-text-secondary">{patternType}</span>
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
        <label className="block text-sm font-medium mb-2">
          Fixed Radius: {params.fixedRadius}
        </label>
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
        <label className="block text-sm font-medium mb-2">
          Moving Radius: {params.movingRadius}
        </label>
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
        <label className="block text-sm font-medium mb-2">
          Pen Distance: {params.penDistance}
        </label>
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
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">
            Revolutions: {params.stopOnOverlap ? overlapRevolutions.toFixed(1) : params.revolutions.toFixed(1)}
          </label>
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

      {/* Quick Presets */}
      <div className="card">
        <h4 className="text-sm font-medium mb-3">Quick Presets</h4>
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
    </div>
  );
}; 