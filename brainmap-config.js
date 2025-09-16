/**
 * MindMap.js Configuration Options
 * 
 * This file documents all available configuration options for the MindMap library.
 */

const MindMapDefaults = {
  // Display dimensions
  width: 800,
  height: 800,

  // Visual theme
  theme: 'default', // 'default', 'dark', 'compact'

  // Layout settings
  radiusStep: 120, // Distance between levels

  // Feature toggles
  editable: true,     // Allow editing (right-click menu, double-click rename)
  showControls: true, // Show export/reset buttons
  showStatus: true,   // Show status messages

  // Export settings
  exportFilename: 'mindmap-data.json',

  // Custom colors (overrides theme)
  colors: {
    root: {
      fill: '#f97316',    // Orange gradient start
      stroke: '#dc2626',  // Red border
      text: '#ffffff'     // White text
    },
    branch: {
      fill: '#34d399',    // Green gradient start
      stroke: '#059669',  // Green border
      text: '#065f46'     // Dark green text
    },
    leaf: {
      fill: '#60a5fa',    // Blue gradient start
      stroke: '#2563eb',  // Blue border
      text: '#1e40af'     // Dark blue text
    },
    link: 'rgba(255,255,255,0.6)' // Semi-transparent white lines
  },

  // Animation settings
  animationDuration: 200, // ms for transitions

  // Interaction settings
  zoomSensitivity: 0.1,   // How fast zooming happens
  minZoom: 0.1,           // Minimum zoom level
  maxZoom: 5,             // Maximum zoom level

  // Node sizing
  nodeRadius: {
    root: 12,
    branch: 7,
    leaf: 8
  },

  // Font settings
  fontSize: {
    root: 14,
    branch: 12,
    leaf: 11
  },

  // Event callbacks
  onNodeClick: null,       // (node, event) => {}
  onNodeDoubleClick: null, // (node, event) => {}
  onNodeAdd: null,         // (parentNode, newNode) => {}
  onNodeDelete: null,      // (deletedNode, parentNode) => {}
  onNodeRename: null,      // (node, oldName, newName) => {}
  onDataChange: null       // (newData) => {}
};

// Example theme configurations
const MindMapThemes = {
  default: {
    theme: 'default',
    colors: {
      root: { fill: '#f97316', stroke: '#b45309', text: '#ffffff' }, // Orange with good white contrast
      branch: { fill: '#34d399', stroke: '#059669', text: '#064e3b' }, // Green, dark text
      leaf: { fill: '#60a5fa', stroke: '#2563eb', text: '#0c1e48' }, // Blue, strong dark text
      link: 'rgba(55,65,81,0.5)' // softer gray
    }
  },

  dark: {
    theme: 'dark',
    colors: {
      root: { fill: '#dc2626', stroke: '#7f1d1d', text: '#ffffff' }, // Red with white contrast
      branch: { fill: '#059669', stroke: '#065f46', text: '#ffffff' }, // Emerald
      leaf: { fill: '#2563eb', stroke: '#1e40af', text: '#ffffff' }, // Blue
      link: 'rgba(209,213,219,0.5)' // light gray for dark bg
    }
  },

  compact: {
    theme: 'compact',
    radiusStep: 80,
    nodeRadius: { root: 8, branch: 5, leaf: 6 },
    fontSize: { root: 12, branch: 10, leaf: 9 },
    colors: {
      root: { fill: '#8b5cf6', stroke: '#6d28d9', text: '#ffffff' }, // Purple
      branch: { fill: '#06b6d4', stroke: '#0e7490', text: '#083344' }, // Cyan with dark text
      leaf: { fill: '#84cc16', stroke: '#4d7c0f', text: '#1a2e05' }, // Lime with dark text
      link: 'rgba(75,85,99,0.4)' // neutral gray
    }
  },

  professional: {
    theme: 'professional',
    colors: {
      root: { fill: '#1f2937', stroke: '#111827', text: '#f9fafb' }, // Dark slate
      branch: { fill: '#374151', stroke: '#1f2937', text: '#f9fafb' }, // Gray
      leaf: { fill: '#6b7280', stroke: '#374151', text: '#f9fafb' }, // Muted gray
      link: 'rgba(156,163,175,0.5)'
    }
  },

  vibrant: {
    theme: 'vibrant',
    colors: {
      root: { fill: '#ec4899', stroke: '#be185d', text: '#ffffff' }, // Pink
      branch: { fill: '#f59e0b', stroke: '#b45309', text: '#1c1917' }, // Amber with dark text
      leaf: { fill: '#10b981', stroke: '#047857', text: '#064e3b' }, // Green with dark text
      link: 'rgba(251,146,60,0.6)' // orange link
    }
  }
};


// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MindMapDefaults, MindMapThemes };
} else if (typeof window !== 'undefined') {
  window.MindMapDefaults = MindMapDefaults;
  window.MindMapThemes = MindMapThemes;
}