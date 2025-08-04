import { Layer, CanvasSettings, ExportSettings } from '../types';

export class SVGExporter {
  static exportToSVG(layers: Layer[], settings: CanvasSettings, exportSettings: ExportSettings): string {
    const { width, height, centerX, centerY } = settings;
    const { includeMetadata } = exportSettings;
    
    // Filter visible layers
    const visibleLayers = layers.filter(layer => layer.visible);
    
    // Generate SVG content
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add metadata if requested
    if (includeMetadata) {
      svg += `
  <defs>
    <style>
      .spirograph-layer { stroke-linecap: round; stroke-linejoin: round; }
    </style>
  </defs>`;
    }
    
    // Add layers
    visibleLayers.forEach(layer => {
      if (layer.points.length < 2) return;
      
      const pathData = this.generatePathData(layer.points);
      const opacity = layer.opacity / 100;
      
      svg += `
  <path d="${pathData}" 
        stroke="${layer.color}" 
        stroke-width="${layer.strokeWidth}" 
        fill="none" 
        opacity="${opacity}"
        class="spirograph-layer" />`;
    });
    
    // Add metadata as comments if requested
    if (includeMetadata) {
      svg += `
  <!-- Spirograph Simulator Export -->
  <!-- Generated: ${new Date().toISOString()} -->
  <!-- Layers: ${visibleLayers.length} -->
  <!-- Canvas: ${width}x${height} -->`;
      
      visibleLayers.forEach((layer, index) => {
        svg += `
  <!-- Layer ${index + 1}: ${layer.name} -->
  <!-- Params: fixedRadius=${layer.params.fixedRadius}, movingRadius=${layer.params.movingRadius}, penDistance=${layer.params.penDistance}, revolutions=${layer.params.revolutions} -->`;
      });
    }
    
    svg += `
</svg>`;
    
    return svg;
  }
  
  private static generatePathData(points: { x: number; y: number }[]): string {
    if (points.length === 0) return '';
    
    let pathData = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }
    
    return pathData;
  }
  
  static downloadSVG(svgContent: string, filename: string = 'spirograph.svg'): void {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
  
  static getDefaultExportSettings(): ExportSettings {
    return {
      format: 'svg',
      width: 800,
      height: 600,
      includeMetadata: true
    };
  }
} 