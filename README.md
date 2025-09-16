# Brainmap.js 🧠

A beautiful, interactive, and themeable mindmap library for creating hierarchical visualizations with editing capabilities. Built with vanilla JavaScript and SVG, no dependencies required.

![Brinmap.js Demo](demo-screenshot.png)

## Features

- **Beautiful Themes**: Multiple built-in themes (default, dark, compact, professional, vibrant)
- **Interactive Editing**: Right-click context menus, double-click to rename, drag to pan, scroll to zoom
- **📱 Touch Support**: Full mobile support with pinch-to-zoom, touch pan, and optimized touch targets
- **Fully Customizable**: Colors, sizes, fonts, and behaviors can be configured
- **Responsive**: Works on desktop and mobile devices
- **Zero Dependencies**: Pure vanilla JavaScript, no external libraries required
- **Easy Integration**: Simple API, just include CSS and JS files
- **Data Export**: Export mindmap data as JSON
- **Dynamic Updates**: Add, remove, and modify nodes programmatically

## Quick Start

### 1. Include the Files

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="brainmap.css">
</head>
<body>
    <div id="mindmap"></div>
    
    <script src="brainmap.js"></script>
    <script>
        // Create a new mindmap
        const mindmap = new MindMap('#mindmap', {
            width: 800,
            height: 600,
            editable: true
        });
        
        // Set your data
        mindmap.setData({
            id: 'root',
            name: 'My Ideas',
            children: [
                { id: 'idea1', name: 'Idea 1' },
                { id: 'idea2', name: 'Idea 2', children: [
                    { id: 'detail1', name: 'Detail A' }
                ]}
            ]
        });
    </script>
</body>
</html>
```

### 2. Via CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/brainmap.js/brainmap.css">
<script src="https://cdn.jsdelivr.net/npm/brainmap.js/brainmap.js"></script>
```

### 3. Via NPM

```bash
npm install brainmap.js
```

## API Reference

### Constructor

```javascript
const mindmap = new MindMap(container, options);
```

**Parameters:**
- `container` (string|Element): CSS selector or DOM element
- `options` (object): Configuration options (see below)

### Configuration Options

```javascript
{
  width: 800,              // SVG width
  height: 800,             // SVG height
  theme: 'default',        // 'default', 'dark', 'compact', 'professional', 'vibrant'
  radiusStep: 120,         // Distance between levels
  editable: true,          // Enable editing features
  showControls: true,      // Show export/reset buttons
  showStatus: true,        // Show status messages
  exportFilename: 'mindmap-data.json',
  
  // Custom colors (overrides theme)
  colors: {
    root: { fill: '#f97316', stroke: '#dc2626', text: '#ffffff' },
    branch: { fill: '#34d399', stroke: '#059669', text: '#065f46' },
    leaf: { fill: '#60a5fa', stroke: '#2563eb', text: '#1e40af' },
    link: 'rgba(255,255,255,0.6)'
  }
}
```

### Methods

#### Data Management

```javascript
// Set mindmap data
mindmap.setData(data);

// Get current data
const data = mindmap.getData();

// Data structure example:
{
  id: 'unique-id',
  name: 'Node Name',
  children: [
    { id: 'child1', name: 'Child 1' },
    { id: 'child2', name: 'Child 2', children: [...] }
  ]
}
```

#### Node Operations

```javascript
// Add child node
mindmap.addChild(parentId, 'New Child Name');

// Add sibling node
mindmap.addSibling(nodeId, 'New Sibling Name');

// Delete node
mindmap.deleteNode(nodeId);

// Rename node
mindmap.renameNode(nodeId, 'New Name');
```

#### View Control

```javascript
// Reset view to center
mindmap.resetView();

// Export data as JSON
mindmap.exportData();

// Update configuration
mindmap.updateConfig({ theme: 'dark', editable: false });

// Destroy mindmap
mindmap.destroy();
```

#### Utility Methods

```javascript
// Find node by ID
const node = mindmap.findNodeById(mindmap.getData(), 'node-id');

// Find parent of node
const parent = mindmap.findParentById(mindmap.getData(), 'child-id');
```

## Themes

### Built-in Themes

- **default**: Colorful gradient theme with orange root, green branches, blue leaves
- **dark**: Dark theme with muted colors
- **compact**: Smaller nodes and tighter spacing
- **professional**: Professional grayscale theme
- **vibrant**: High-contrast colorful theme

### Using Themes

```javascript
// Set theme during initialization
const mindmap = new MindMap('#container', { theme: 'dark' });

// Change theme after creation
mindmap.updateConfig({ theme: 'professional' });

// Use predefined theme configurations
mindmap.updateConfig(MindMapThemes.vibrant);
```

### Custom Themes

```javascript
const customTheme = {
  theme: 'default',
  colors: {
    root: { fill: '#your-color', stroke: '#border-color', text: '#text-color' },
    branch: { fill: '#branch-color', stroke: '#border', text: '#text' },
    leaf: { fill: '#leaf-color', stroke: '#border', text: '#text' },
    link: 'rgba(255,255,255,0.5)'
  },
  radiusStep: 100,
  nodeRadius: { root: 15, branch: 8, leaf: 6 }
};

mindmap.updateConfig(customTheme);
```

## 🖱️ User Interactions

### Desktop
- **Scroll**: Zoom in/out
- **Drag**: Pan around the mindmap
- **Right-click**: Open context menu (add child/sibling, rename, delete)
- **Double-click**: Start inline editing of node name
- **Export button**: Download mindmap data as JSON
- **Reset button**: Reset view to center

### Mobile & Touch Devices
- **Pinch**: Zoom in/out with two fingers
- **Single finger drag**: Pan around the mindmap
- **Tap**: Select node
- **Long press**: Open context menu (add child/sibling, rename, delete)
- **Double tap**: Start inline editing of node name
- **Touch-optimized**: Larger touch targets and improved responsiveness

## Data Format

The mindmap uses a simple hierarchical JSON structure:

```javascript
{
  id: 'root',                    // Unique identifier (required)
  name: 'Root Node',             // Display name (required)
  children: [                    // Array of child nodes (optional)
    {
      id: 'child1',
      name: 'Child Node 1',
      children: [
        { id: 'grandchild1', name: 'Grandchild 1' }
      ]
    },
    { id: 'child2', name: 'Child Node 2' }
  ]
}
```

## Examples

### Basic Usage

```javascript
const mindmap = new MindMap('#mindmap-container');
mindmap.setData({
  id: 'root',
  name: 'My Project',
  children: [
    { id: 'planning', name: 'Planning' },
    { id: 'development', name: 'Development' },
    { id: 'testing', name: 'Testing' }
  ]
});
```

### Read-only Mindmap

```javascript
const mindmap = new MindMap('#readonly-mindmap', {
  editable: false,
  showControls: false,
  theme: 'professional'
});
```

### Programmatic Node Management

```javascript
// Add nodes programmatically
mindmap.addChild('root', 'New Category');
mindmap.addChild('new-category-id', 'Subcategory');

// Listen for changes
mindmap.updateConfig({
  onNodeAdd: (parent, newNode) => {
    console.log(`Added ${newNode.name} to ${parent.name}`);
  },
  onNodeDelete: (deletedNode) => {
    console.log(`Deleted ${deletedNode.name}`);
  }
});
```

### Custom Styling

```javascript
const mindmap = new MindMap('#styled-mindmap', {
  width: 1200,
  height: 800,
  radiusStep: 150,
  colors: {
    root: { fill: '#6366f1', stroke: '#4f46e5', text: '#ffffff' },
    branch: { fill: '#8b5cf6', stroke: '#7c3aed', text: '#ffffff' },
    leaf: { fill: '#06b6d4', stroke: '#0891b2', text: '#ffffff' },
    link: 'rgba(139, 92, 246, 0.3)'
  }
});
```

### Mobile-Optimized Setup

```javascript
// Mobile-friendly configuration
const mindmap = new MindMap('#mobile-mindmap', {
  width: window.innerWidth,
  height: window.innerHeight,
  theme: 'compact',
  radiusStep: 100, // Tighter spacing for mobile
  editable: true,
  showControls: true
});

// Handle orientation changes
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    mindmap.updateConfig({
      width: window.innerWidth,
      height: window.innerHeight
    });
    mindmap.resetView();
  }, 100);
});
```

### Touch Event Handling

```javascript
// Optional: Listen for touch-specific events
mindmap.updateConfig({
  onTouchStart: (e) => {
    console.log('Touch started:', e.touches.length, 'fingers');
  },
  onPinchZoom: (scale) => {
    console.log('Pinch zoom scale:', scale);
  }
});
```

## Development

### File Structure

```
brainmap-js-library/
├── brainmap.js          # Main library file
├── brainmap.css         # Styling and themes
├── brainmap-config.js   # Configuration options and themes
├── index.html           # Interactive demo
├── package.json         # NPM package configuration
└── README.md           # This documentation
```

### Local Development

1. Clone the repository
2. Open `index.html` in your browser
3. Modify the library files as needed
4. Test changes in the demo

### Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT License - feel free to use in personal and commercial projects.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## Support

For questions and support, please open an issue on GitHub.

---

Made with ❤️ by Chiheb Nabil