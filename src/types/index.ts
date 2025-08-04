export interface Point {
  x: number;
  y: number;
}

export interface SpirographParams {
  fixedRadius: number;
  movingRadius: number;
  penDistance: number;
  revolutions: number;
}

export interface Layer {
  id: string;
  name: string;
  color: string;
  strokeWidth: number;
  opacity: number;
  visible: boolean;
  points: Point[];
  params: SpirographParams;
}

export interface CanvasSettings {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  scale: number;
}

export interface ExportSettings {
  format: 'svg' | 'png';
  width: number;
  height: number;
  includeMetadata: boolean;
} 