import { Point, SpirographParams } from '../types';

export class SpirographCalculator {
  static generatePoints(params: SpirographParams, centerX: number, centerY: number): Point[] {
    const { fixedRadius, movingRadius, penDistance, revolutions, stopOnOverlap } = params;
    const points: Point[] = [];
    
    // Calculate the actual number of revolutions needed
    let actualRevolutions = revolutions;
    if (stopOnOverlap) {
      actualRevolutions = this.calculateOverlapRevolutions(fixedRadius, movingRadius);
    }
    
    // Calculate the number of steps based on revolutions
    // Use more steps for higher revolutions to maintain smooth curves
    const totalSteps = Math.floor(actualRevolutions * 360 * Math.max(1, actualRevolutions / 10));
    
    for (let i = 0; i <= totalSteps; i++) {
      const t = (i / totalSteps) * actualRevolutions * 2 * Math.PI;
      
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
      revolutions: 2,
      stopOnOverlap: false
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
    const actualRevolutions = params.stopOnOverlap 
      ? this.calculateOverlapRevolutions(params.fixedRadius, params.movingRadius)
      : params.revolutions;
    return (actualRevolutions * 360) / 1000;
  }

  static calculateOverlapRevolutions(fixedRadius: number, movingRadius: number): number {
    // The number of revolutions needed to complete the pattern
    // is determined by the ratio of the radii
    const gcd = this.greatestCommonDivisor(fixedRadius, movingRadius);
    const simplifiedFixed = fixedRadius / gcd;
    const simplifiedMoving = movingRadius / gcd;
    
    // The pattern completes when the moving circle has rotated
    // by the least common multiple of the simplified radii
    const lcm = (simplifiedFixed * simplifiedMoving) / this.greatestCommonDivisor(simplifiedFixed, simplifiedMoving);
    
    return lcm / simplifiedMoving;
  }

  private static greatestCommonDivisor(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }
} 