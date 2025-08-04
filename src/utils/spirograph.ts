import { Point, SpirographParams } from '../types';

export class SpirographCalculator {
  static generatePoints(params: SpirographParams, centerX: number, centerY: number): Point[] {
    const { fixedRadius, movingRadius, penDistance, revolutions } = params;
    const points: Point[] = [];
    
    // Calculate the number of steps based on revolutions
    // Use more steps for higher revolutions to maintain smooth curves
    const totalSteps = Math.floor(revolutions * 360 * Math.max(1, revolutions / 10));
    
    for (let i = 0; i <= totalSteps; i++) {
      const t = (i / totalSteps) * revolutions * 2 * Math.PI;
      
      // Spirograph formula
      const x = (fixedRadius - movingRadius) * Math.cos(t) + 
                penDistance * Math.cos((fixedRadius - movingRadius) * t / movingRadius);
      const y = (fixedRadius - movingRadius) * Math.sin(t) - 
                penDistance * Math.sin((fixedRadius - movingRadius) * t / movingRadius);
      
      points.push({
        x: centerX + x,
        y: centerY + y
      });
    }
    
    return points;
  }
  
  static getDefaultParams(): SpirographParams {
    return {
      fixedRadius: 100,
      movingRadius: 50,
      penDistance: 30,
      revolutions: 2
    };
  }
  
  static validateParams(params: SpirographParams): string | null {
    if (params.fixedRadius <= 0) return 'Fixed radius must be positive';
    if (params.movingRadius <= 0) return 'Moving radius must be positive';
    if (params.penDistance < 0) return 'Pen distance cannot be negative';
    if (params.revolutions <= 0) return 'Revolutions must be positive';
    if (params.movingRadius >= params.fixedRadius) return 'Moving radius must be smaller than fixed radius';
    
    return null;
  }
  
  static getPatternType(params: SpirographParams): string {
    const ratio = params.fixedRadius / params.movingRadius;
    
    if (ratio === 2) return 'Cardioid';
    if (ratio === 3) return 'Nephroid';
    if (ratio === 4) return 'Deltoid';
    if (ratio === 5) return 'Astroid';
    if (ratio === 6) return 'Hypocycloid';
    if (ratio === 8) return 'Octagon';
    if (ratio === 10) return 'Decagon';
    
    return 'Spirograph';
  }
  
  static getEstimatedTime(params: SpirographParams): number {
    // Rough estimate in seconds
    return (params.revolutions * 360) / 1000;
  }
} 