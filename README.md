# Spirograph Simulator

A beautiful, interactive spirograph simulation app built with React and TypeScript. Create intricate geometric patterns and export them as SVG files perfect for plotting with an AxiDraw or other pen plotters.

## ✨ Features

- **Interactive Controls**: Real-time parameter adjustment with instant visual feedback
- **Layer System**: Stack multiple patterns with individual colors, stroke widths, and opacity
- **Pattern Recognition**: Automatically detects classic spirograph patterns (Cardioid, Nephroid, Deltoid, etc.)
- **SVG Export**: High-quality vector exports with metadata preservation
- **Canvas Navigation**: Zoom and pan to explore your creations
- **Quick Presets**: Pre-configured patterns for instant inspiration
- **Responsive Design**: Works beautifully on desktop and tablet

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### DreamHost Deployment

```bash
# Build the project
npm run build

# Upload the `dist/` folder to your DreamHost web directory
```

## 🎨 Usage

### Creating Patterns

1. **Adjust Parameters**: Use the sliders in the Controls panel to set:
   - **Fixed Radius**: The outer circle size
   - **Moving Radius**: The inner circle size
   - **Pen Distance**: Distance from the moving circle center
   - **Revolutions**: Number of complete rotations
   - **Speed**: Generation density

2. **Generate**: Click "Generate Pattern" to create a new layer

3. **Experiment**: Try the Random button or Quick Presets for inspiration

### Managing Layers

- **Visibility**: Toggle layers on/off with the eye icon
- **Colors**: Click the color picker to change layer colors
- **Stroke Width**: Adjust line thickness (1-10px)
- **Opacity**: Control transparency (10-100%)
- **Rename**: Click layer names to edit them
- **Delete**: Remove unwanted layers

### Exporting

1. **Configure Export**: Set canvas size and options in the Export panel
2. **Export SVG**: Download vector files ready for plotting
3. **Use**: Open in Inkscape, Illustrator, or plotter software

## 🛠️ Technical Details

### Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Custom CSS with CSS variables for theming
- **Icons**: Lucide React for beautiful, consistent icons
- **Canvas**: HTML5 Canvas for high-performance rendering
- **Export**: Custom SVG generation with metadata

### Key Components

- `Canvas`: High-performance rendering with zoom/pan
- `Controls`: Interactive parameter adjustment
- `LayerPanel`: Layer management and styling
- `ExportPanel`: SVG export configuration
- `SpirographCalculator`: Mathematical pattern generation
- `SVGExporter`: Vector file generation

### Pattern Types

The app automatically detects classic spirograph patterns:

- **Cardioid**: Fixed radius = 2 × Moving radius
- **Nephroid**: Fixed radius = 3 × Moving radius  
- **Deltoid**: Fixed radius = 4 × Moving radius
- **Astroid**: Fixed radius = 5 × Moving radius
- **Hypocycloid**: Fixed radius = 6 × Moving radius

## 🎯 Perfect for AxiDraw

This app is specifically designed for pen plotting:

- **Vector Output**: SVG files scale to any size
- **Stroke Order**: Preserved for optimal plotting
- **Metadata**: Layer information included for reference
- **Paper Sizes**: A4, A3, and custom dimensions
- **Plotter Ready**: Direct compatibility with AxiDraw software

## 📁 Project Structure

```
spirograph-simulator/
├── src/
│   ├── components/          # React components
│   │   ├── Canvas.tsx      # Main canvas renderer
│   │   ├── Controls.tsx    # Parameter controls
│   │   ├── LayerPanel.tsx  # Layer management
│   │   └── ExportPanel.tsx # Export configuration
│   ├── types/              # TypeScript definitions
│   ├── utils/              # Utility functions
│   │   ├── spirograph.ts   # Pattern calculations
│   │   └── svgExport.ts    # SVG generation
│   ├── App.tsx             # Main application
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── dist/                   # Production build
├── index.html              # HTML template
└── package.json            # Dependencies
```

## 🎨 Customization

### Themes

The app uses CSS variables for easy theming:

```css
:root {
  --primary: #667eea;      /* Primary accent color */
  --secondary: #764ba2;    /* Secondary accent */
  --background: #0f0f23;   /* Main background */
  --surface: #1a1a2e;      /* Card backgrounds */
  --text: #ffffff;         /* Primary text */
  --border: #2a2a3e;       /* Border colors */
}
```

### Adding New Patterns

Extend the `SpirographCalculator` class to add new pattern types:

```typescript
static getPatternType(params: SpirographParams): string {
  const ratio = params.fixedRadius / params.movingRadius;
  
  // Add your custom patterns here
  if (ratio === 7) return 'Heptagon';
  
  return 'Spirograph';
}
```

## 🚀 Deployment

### DreamHost Shared Hosting

1. Build the project: `npm run build`
2. Upload the `dist/` folder contents to your web directory
3. Ensure your `.htaccess` file handles client-side routing:

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Other Hosting

The app builds to static files that work on any web server:
- Netlify
- Vercel  
- GitHub Pages
- AWS S3
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own creative endeavors!

## 🙏 Acknowledgments

- Inspired by classic spirograph toys
- Built for the pen plotting community
- Special thanks to Evil Mad Scientist for AxiDraw inspiration

---

**Happy Plotting! 🎨✏️** 