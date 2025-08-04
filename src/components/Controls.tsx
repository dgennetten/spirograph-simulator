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
  livePreview: boolean;
  onLivePreviewChange: (enabled: boolean) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  params,
  onParamsChange,
  onGenerate,
  isGenerating,
  validationError,
  paperColor,
  onPaperColorChange,
  livePreview,
  onLivePreviewChange
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
    // Generate "nice" ratios that result in up to 50 overlap revolutions
    const niceRatios = [
      { fixed: 100, moving: 50 },   // 2:1 ratio (Cardioid) - 2 revolutions
      { fixed: 90, moving: 30 },    // 3:1 ratio (Nephroid) - 3 revolutions
      { fixed: 120, moving: 30 },   // 4:1 ratio (Deltoid) - 4 revolutions
      { fixed: 100, moving: 20 },   // 5:1 ratio (Astroid) - 5 revolutions
      { fixed: 120, moving: 20 },   // 6:1 ratio - 6 revolutions
      { fixed: 140, moving: 20 },   // 7:1 ratio - 7 revolutions
      { fixed: 160, moving: 20 },   // 8:1 ratio - 8 revolutions
      { fixed: 180, moving: 20 },   // 9:1 ratio - 9 revolutions
      { fixed: 100, moving: 10 },   // 10:1 ratio - 10 revolutions
      { fixed: 110, moving: 10 },   // 11:1 ratio - 11 revolutions
      { fixed: 120, moving: 10 },   // 12:1 ratio - 12 revolutions
      { fixed: 130, moving: 10 },   // 13:1 ratio - 13 revolutions
      { fixed: 140, moving: 10 },   // 14:1 ratio - 14 revolutions
      { fixed: 150, moving: 10 },   // 15:1 ratio - 15 revolutions
      { fixed: 160, moving: 10 },   // 16:1 ratio - 16 revolutions
      { fixed: 170, moving: 10 },   // 17:1 ratio - 17 revolutions
      { fixed: 180, moving: 10 },   // 18:1 ratio - 18 revolutions
      { fixed: 190, moving: 10 },   // 19:1 ratio - 19 revolutions
      { fixed: 200, moving: 10 },   // 20:1 ratio - 20 revolutions
      { fixed: 210, moving: 10 },   // 21:1 ratio - 21 revolutions
      { fixed: 220, moving: 10 },   // 22:1 ratio - 22 revolutions
      { fixed: 230, moving: 10 },   // 23:1 ratio - 23 revolutions
      { fixed: 240, moving: 10 },   // 24:1 ratio - 24 revolutions
      { fixed: 250, moving: 10 },   // 25:1 ratio - 25 revolutions
      { fixed: 260, moving: 10 },   // 26:1 ratio - 26 revolutions
      { fixed: 270, moving: 10 },   // 27:1 ratio - 27 revolutions
      { fixed: 280, moving: 10 },   // 28:1 ratio - 28 revolutions
      { fixed: 290, moving: 10 },   // 29:1 ratio - 29 revolutions
      { fixed: 300, moving: 10 },   // 30:1 ratio - 30 revolutions
      { fixed: 310, moving: 10 },   // 31:1 ratio - 31 revolutions
      { fixed: 320, moving: 10 },   // 32:1 ratio - 32 revolutions
      { fixed: 330, moving: 10 },   // 33:1 ratio - 33 revolutions
      { fixed: 340, moving: 10 },   // 34:1 ratio - 34 revolutions
      { fixed: 350, moving: 10 },   // 35:1 ratio - 35 revolutions
      { fixed: 360, moving: 10 },   // 36:1 ratio - 36 revolutions
      { fixed: 370, moving: 10 },   // 37:1 ratio - 37 revolutions
      { fixed: 380, moving: 10 },   // 38:1 ratio - 38 revolutions
      { fixed: 390, moving: 10 },   // 39:1 ratio - 39 revolutions
      { fixed: 400, moving: 10 },   // 40:1 ratio - 40 revolutions
      { fixed: 410, moving: 10 },   // 41:1 ratio - 41 revolutions
      { fixed: 420, moving: 10 },   // 42:1 ratio - 42 revolutions
      { fixed: 430, moving: 10 },   // 43:1 ratio - 43 revolutions
      { fixed: 440, moving: 10 },   // 44:1 ratio - 44 revolutions
      { fixed: 450, moving: 10 },   // 45:1 ratio - 45 revolutions
      { fixed: 460, moving: 10 },   // 46:1 ratio - 46 revolutions
      { fixed: 470, moving: 10 },   // 47:1 ratio - 47 revolutions
      { fixed: 480, moving: 10 },   // 48:1 ratio - 48 revolutions
      { fixed: 490, moving: 10 },   // 49:1 ratio - 49 revolutions
      { fixed: 500, moving: 10 },   // 50:1 ratio - 50 revolutions
      { fixed: 80, moving: 16 },    // 5:1 ratio - 5 revolutions
      { fixed: 96, moving: 16 },    // 6:1 ratio - 6 revolutions
      { fixed: 112, moving: 16 },   // 7:1 ratio - 7 revolutions
      { fixed: 128, moving: 16 },   // 8:1 ratio - 8 revolutions
      { fixed: 144, moving: 16 },   // 9:1 ratio - 9 revolutions
      { fixed: 160, moving: 16 },   // 10:1 ratio - 10 revolutions
      { fixed: 176, moving: 16 },   // 11:1 ratio - 11 revolutions
      { fixed: 192, moving: 16 },   // 12:1 ratio - 12 revolutions
      { fixed: 208, moving: 16 },   // 13:1 ratio - 13 revolutions
      { fixed: 224, moving: 16 },   // 14:1 ratio - 14 revolutions
      { fixed: 240, moving: 16 },   // 15:1 ratio - 15 revolutions
      { fixed: 256, moving: 16 },   // 16:1 ratio - 16 revolutions
      { fixed: 272, moving: 16 },   // 17:1 ratio - 17 revolutions
      { fixed: 288, moving: 16 },   // 18:1 ratio - 18 revolutions
      { fixed: 304, moving: 16 },   // 19:1 ratio - 19 revolutions
      { fixed: 320, moving: 16 },   // 20:1 ratio - 20 revolutions
      { fixed: 336, moving: 16 },   // 21:1 ratio - 21 revolutions
      { fixed: 352, moving: 16 },   // 22:1 ratio - 22 revolutions
      { fixed: 368, moving: 16 },   // 23:1 ratio - 23 revolutions
      { fixed: 384, moving: 16 },   // 24:1 ratio - 24 revolutions
      { fixed: 400, moving: 16 },   // 25:1 ratio - 25 revolutions
      { fixed: 416, moving: 16 },   // 26:1 ratio - 26 revolutions
      { fixed: 432, moving: 16 },   // 27:1 ratio - 27 revolutions
      { fixed: 448, moving: 16 },   // 28:1 ratio - 28 revolutions
      { fixed: 464, moving: 16 },   // 29:1 ratio - 29 revolutions
      { fixed: 480, moving: 16 },   // 30:1 ratio - 30 revolutions
      { fixed: 496, moving: 16 },   // 31:1 ratio - 31 revolutions
      { fixed: 75, moving: 15 },    // 5:1 ratio - 5 revolutions
      { fixed: 90, moving: 15 },    // 6:1 ratio - 6 revolutions
      { fixed: 105, moving: 15 },   // 7:1 ratio - 7 revolutions
      { fixed: 120, moving: 15 },   // 8:1 ratio - 8 revolutions
      { fixed: 135, moving: 15 },   // 9:1 ratio - 9 revolutions
      { fixed: 150, moving: 15 },   // 10:1 ratio - 10 revolutions
      { fixed: 165, moving: 15 },   // 11:1 ratio - 11 revolutions
      { fixed: 180, moving: 15 },   // 12:1 ratio - 12 revolutions
      { fixed: 195, moving: 15 },   // 13:1 ratio - 13 revolutions
      { fixed: 210, moving: 15 },   // 14:1 ratio - 14 revolutions
      { fixed: 225, moving: 15 },   // 15:1 ratio - 15 revolutions
      { fixed: 240, moving: 15 },   // 16:1 ratio - 16 revolutions
      { fixed: 255, moving: 15 },   // 17:1 ratio - 17 revolutions
      { fixed: 270, moving: 15 },   // 18:1 ratio - 18 revolutions
      { fixed: 285, moving: 15 },   // 19:1 ratio - 19 revolutions
      { fixed: 300, moving: 15 },   // 20:1 ratio - 20 revolutions
      { fixed: 315, moving: 15 },   // 21:1 ratio - 21 revolutions
      { fixed: 330, moving: 15 },   // 22:1 ratio - 22 revolutions
      { fixed: 345, moving: 15 },   // 23:1 ratio - 23 revolutions
      { fixed: 360, moving: 15 },   // 24:1 ratio - 24 revolutions
      { fixed: 375, moving: 15 },   // 25:1 ratio - 25 revolutions
      { fixed: 390, moving: 15 },   // 26:1 ratio - 26 revolutions
      { fixed: 405, moving: 15 },   // 27:1 ratio - 27 revolutions
      { fixed: 420, moving: 15 },   // 28:1 ratio - 28 revolutions
      { fixed: 435, moving: 15 },   // 29:1 ratio - 29 revolutions
      { fixed: 450, moving: 15 },   // 30:1 ratio - 30 revolutions
      { fixed: 465, moving: 15 },   // 31:1 ratio - 31 revolutions
      { fixed: 480, moving: 15 },   // 32:1 ratio - 32 revolutions
      { fixed: 495, moving: 15 },   // 33:1 ratio - 33 revolutions
      { fixed: 510, moving: 15 },   // 34:1 ratio - 34 revolutions
      { fixed: 525, moving: 15 },   // 35:1 ratio - 35 revolutions
      { fixed: 540, moving: 15 },   // 36:1 ratio - 36 revolutions
      { fixed: 555, moving: 15 },   // 37:1 ratio - 37 revolutions
      { fixed: 570, moving: 15 },   // 38:1 ratio - 38 revolutions
      { fixed: 585, moving: 15 },   // 39:1 ratio - 39 revolutions
      { fixed: 600, moving: 15 },   // 40:1 ratio - 40 revolutions
      { fixed: 615, moving: 15 },   // 41:1 ratio - 41 revolutions
      { fixed: 630, moving: 15 },   // 42:1 ratio - 42 revolutions
      { fixed: 645, moving: 15 },   // 43:1 ratio - 43 revolutions
      { fixed: 660, moving: 15 },   // 44:1 ratio - 44 revolutions
      { fixed: 675, moving: 15 },   // 45:1 ratio - 45 revolutions
      { fixed: 690, moving: 15 },   // 46:1 ratio - 46 revolutions
      { fixed: 705, moving: 15 },   // 47:1 ratio - 47 revolutions
      { fixed: 720, moving: 15 },   // 48:1 ratio - 48 revolutions
      { fixed: 735, moving: 15 },   // 49:1 ratio - 49 revolutions
      { fixed: 750, moving: 15 },   // 50:1 ratio - 50 revolutions
    ];
    
    // Pick a random nice ratio
    const selectedRatio = niceRatios[Math.floor(Math.random() * niceRatios.length)];
    
    const randomParams: SpirographParams = {
      fixedRadius: selectedRatio.fixed,
      movingRadius: selectedRatio.moving,
      penDistance: Math.floor(Math.random() * 60) + 10,
      revolutions: Math.floor(Math.random() * 10) + 1,
      stopOnOverlap: true
    };
    
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
          <div className="flex items-center gap-3">
            <button
              onClick={onGenerate}
              disabled={isGenerating || !!validationError}
              className="btn btn-primary flex-1"
            >
              <Play size={16} />
              {isGenerating ? 'Generating...' : 'Generate Pattern'}
            </button>
            
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={livePreview}
                onChange={(e) => onLivePreviewChange(e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <span className="text-text-secondary">Live Preview</span>
            </label>
          </div>
          
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