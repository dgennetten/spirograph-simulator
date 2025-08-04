import React, { useState } from 'react';
import { Layer } from '../types';
import { Eye, EyeOff, Trash2, Palette, Edit3 } from 'lucide-react';

interface LayerPanelProps {
  layers: Layer[];
  onUpdateLayer: (id: string, updates: Partial<Layer>) => void;
  onDeleteLayer: (id: string) => void;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({
  layers,
  onUpdateLayer,
  onDeleteLayer
}) => {
  const [editingLayer, setEditingLayer] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const startEditing = (layer: Layer) => {
    setEditingLayer(layer.id);
    setEditingName(layer.name);
  };

  const saveEdit = () => {
    if (editingLayer && editingName.trim()) {
      onUpdateLayer(editingLayer, { name: editingName.trim() });
    }
    setEditingLayer(null);
    setEditingName('');
  };

  const cancelEdit = () => {
    setEditingLayer(null);
    setEditingName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  if (layers.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-text-secondary mb-4">
          <Palette size={48} className="mx-auto mb-4 opacity-50" />
          <p>No layers yet</p>
          <p className="text-sm">Generate some patterns to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Layers</h3>
            <p className="card-subtitle">Manage your patterns</p>
          </div>
          <span className="text-lg font-semibold text-primary">{layers.length}</span>
        </div>
      </div>

      <div className="space-y-3">
        {layers.map((layer, index) => (
          <div key={layer.id} className="card">
            {/* Layer Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateLayer(layer.id, { visible: !layer.visible })}
                  className="text-text-secondary hover:text-text transition-colors"
                >
                  {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                
                {editingLayer === layer.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    onBlur={saveEdit}
                    className="input text-sm py-1"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => startEditing(layer)}
                    className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {layer.name}
                    <Edit3 size={12} />
                  </button>
                )}
              </div>
              
              <button
                onClick={() => onDeleteLayer(layer.id)}
                className="text-error hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Color Picker */}
            <div className="mb-3">
              <label className="block text-xs text-text-secondary mb-1">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={layer.color}
                  onChange={(e) => onUpdateLayer(layer.id, { color: e.target.value })}
                  className="w-8 h-8 rounded border border-border cursor-pointer"
                />
                <span className="text-xs text-text-secondary">{layer.color}</span>
              </div>
            </div>

            {/* Stroke Width */}
            <div className="mb-3">
              <label className="block text-xs text-text-secondary mb-1">
                Stroke Width: {layer.strokeWidth}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={layer.strokeWidth}
                onChange={(e) => onUpdateLayer(layer.id, { strokeWidth: parseInt(e.target.value) })}
                className="slider"
              />
            </div>

            {/* Opacity */}
            <div className="mb-3">
              <label className="block text-xs text-text-secondary mb-1">
                Opacity: {layer.opacity}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={layer.opacity}
                onChange={(e) => onUpdateLayer(layer.id, { opacity: parseInt(e.target.value) })}
                className="slider"
              />
            </div>

            {/* Layer Info */}
            <div className="text-xs text-text-secondary space-y-1">
              <div>Points: {layer.points.length.toLocaleString()}</div>
              <div>Type: {layer.params.fixedRadius}/{layer.params.movingRadius}/{layer.params.penDistance}</div>
              <div>Revolutions: {layer.params.revolutions}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Layer Order Info */}
      <div className="text-xs text-text-secondary text-center p-3 bg-surface/50 rounded">
        <p>Layers are drawn from top to bottom</p>
        <p>Drag to reorder (coming soon)</p>
      </div>
    </div>
  );
}; 