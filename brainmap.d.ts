/**
 * TypeScript definitions for brainmap.js
 * Version: 1.0.9
 * 
 * A beautiful, interactive, and themeable mindmap library for creating
 * hierarchical visualizations with editing capabilities.
 */

declare module 'brainmap.js' {
  export default MindMap;
}

/**
 * Color configuration for nodes
 */
export interface NodeColors {
  /** Fill color for the node */
  fill?: string;
  /** Stroke/border color for the node */
  stroke?: string;
  /** Text color for the node */
  text?: string;
}

/**
 * Color scheme configuration
 */
export interface ColorScheme {
  /** Colors for the root node */
  root?: NodeColors;
  /** Colors for branch nodes */
  branch?: NodeColors;
  /** Colors for leaf nodes */
  leaf?: NodeColors;
  /** Color for connecting links */
  link?: string;
}

/**
 * Configuration options for the MindMap
 */
export interface MindMapConfig {
  /** Width of the SVG canvas in pixels (default: 800) */
  width?: number;
  /** Height of the SVG canvas in pixels (default: 800) */
  height?: number;
  /** Theme name: 'default', 'dark', or 'compact' (default: 'default') */
  theme?: 'default' | 'dark' | 'compact';
  /** Distance between radius levels (default: 120) */
  radiusStep?: number;
  /** Whether the mindmap is editable (default: true) */
  editable?: boolean;
  /** Whether to show control buttons (default: true) */
  showControls?: boolean;
  /** Whether to show status bar (default: true) */
  showStatus?: boolean;
  /** Filename for exported JSON data (default: 'mindmap-data.json') */
  exportFilename?: string;
  /** Color scheme configuration */
  colors?: ColorScheme;
}

/**
 * Represents a node in the mindmap tree structure
 */
export interface MindMapNode {
  /** Unique identifier for the node */
  id: string;
  /** Display name/text of the node */
  name: string;
  /** Child nodes (optional) */
  children?: MindMapNode[];
}

/**
 * Context menu item definition
 */
export interface ContextMenuItem {
  /** Display text for the menu item */
  text: string;
  /** Action to execute when clicked */
  action: () => void;
}

/**
 * Touch/gesture state for mobile interactions
 */
interface TouchState {
  x: number;
  y: number;
  ox: number;
  oy: number;
  zoom?: number;
  svgX?: number;
  svgY?: number;
}

/**
 * Point coordinates
 */
interface Point {
  x: number;
  y: number;
}

/**
 * Main MindMap class for creating interactive mindmaps
 */
export declare class MindMap {
  /** The DOM container element */
  readonly container: HTMLElement;
  /** Current configuration */
  readonly config: Required<MindMapConfig>;
  /** Current tree data */
  treeData: MindMapNode | null;
  /** Current zoom level */
  zoom: number;
  /** X offset for panning */
  offsetX: number;
  /** Y offset for panning */
  offsetY: number;
  /** Whether currently dragging/panning */
  readonly isDragging: boolean;
  /** Whether currently editing a node */
  readonly isEditing: boolean;
  /** ID of the node being edited */
  readonly editingNode: string | null;
  /** SVG element */
  readonly svg: SVGSVGElement | null;
  /** Viewport group element */
  readonly viewport: SVGGElement | null;
  /** Status element */
  readonly statusEl: HTMLElement | null;
  /** Controls element */
  readonly controlsEl: HTMLElement | null;

  /**
   * Create a new MindMap instance
   * @param container - DOM element or CSS selector for the container
   * @param options - Configuration options
   */
  constructor(container: string | HTMLElement, options?: MindMapConfig);

  /**
   * Initialize the mindmap
   */
  init(): void;

  /**
   * Set up the DOM structure
   */
  setupDOM(): void;

  /**
   * Apply custom colors to CSS variables
   */
  applyCustomColors(): void;

  /**
   * Set up event listeners for interactions
   */
  setupEventListeners(): void;

  /**
   * Remove event listeners
   */
  removeEventListeners(): void;

  /**
   * Set the mindmap data
   * @param data - Tree data structure
   */
  setData(data: MindMapNode): void;

  /**
   * Get the current mindmap data
   * @returns Deep clone of the current tree data
   */
  getData(): MindMapNode | null;

  /**
   * Generate a unique node ID
   * @returns Unique identifier string
   */
  generateId(): string;

  /**
   * Set status message
   * @param message - Status message to display
   */
  setStatus(message: string): void;

  /**
   * Convert screen coordinates to SVG coordinates
   * @param screenX - Screen X coordinate
   * @param screenY - Screen Y coordinate
   * @returns SVG coordinates
   */
  screenToSvg(screenX: number, screenY: number): Point;

  /**
   * Handle mouse wheel events for zooming
   * @param e - Wheel event
   */
  handleWheel(e: WheelEvent): void;

  /**
   * Handle mouse down events for panning
   * @param e - Mouse event
   */
  handleMouseDown(e: MouseEvent): void;

  /**
   * Handle mouse move events for panning
   * @param e - Mouse event
   */
  handleMouseMove(e: MouseEvent): void;

  /**
   * Handle mouse up events
   */
  handleMouseUp(): void;

  /**
   * Handle mouse leave events
   */
  handleMouseLeave(): void;

  /**
   * Get distance between two touch points
   * @param touches - Touch list
   * @returns Distance in pixels
   */
  getTouchDistance(touches: TouchList): number;

  /**
   * Get center point between two touches
   * @param touches - Touch list
   * @returns Center point coordinates
   */
  getTouchCenter(touches: TouchList): Point;

  /**
   * Handle touch start events
   * @param e - Touch event
   */
  handleTouchStart(e: TouchEvent): void;

  /**
   * Handle touch move events
   * @param e - Touch event
   */
  handleTouchMove(e: TouchEvent): void;

  /**
   * Handle touch end events
   * @param e - Touch event
   */
  handleTouchEnd(e: TouchEvent): void;

  /**
   * Update the SVG transform based on current zoom and offset
   */
  updateTransform(): void;

  /**
   * Count leaves in the tree for layout calculations
   * @param node - Root node to count from
   * @returns Number of leaf nodes
   */
  countLeaves(node: MindMapNode): number;

  /**
   * Calculate layout positions for all nodes
   * @param root - Root node to layout
   */
  layoutRoot(root: MindMapNode): void;

  /**
   * Layout nodes in a radial pattern
   * @param node - Node to layout
   * @param parentX - Parent X coordinate
   * @param parentY - Parent Y coordinate
   * @param startAngle - Starting angle in radians
   * @param endAngle - Ending angle in radians
   * @param radius - Distance from parent
   */
  layoutNode(
    node: MindMapNode,
    parentX: number,
    parentY: number,
    startAngle: number,
    endAngle: number,
    radius: number
  ): void;

  /**
   * Find a node by its ID in the tree
   * @param tree - Root node to search from
   * @param id - Node ID to find
   * @returns Found node or null
   */
  findNodeById(tree: MindMapNode, id: string): MindMapNode | null;

  /**
   * Find parent node by child ID
   * @param tree - Root node to search from
   * @param childId - Child node ID
   * @returns Parent node or null
   */
  findParentById(tree: MindMapNode, childId: string): MindMapNode | null;

  /**
   * Add a child node to a parent
   * @param parentId - ID of the parent node
   * @param name - Name for the new child node
   * @returns Success status
   */
  addChild(parentId: string, name?: string): boolean;

  /**
   * Add a sibling node
   * @param nodeId - ID of the node to add sibling to
   * @param name - Name for the new sibling node
   * @returns Success status
   */
  addSibling(nodeId: string, name?: string): boolean;

  /**
   * Delete a node from the tree
   * @param nodeId - ID of the node to delete
   * @returns Success status
   */
  deleteNode(nodeId: string): boolean;

  /**
   * Rename a node
   * @param nodeId - ID of the node to rename
   * @param newName - New name for the node
   * @returns Success status
   */
  renameNode(nodeId: string, newName: string): boolean;

  /**
   * Show context menu at specified position
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param nodeId - ID of the node the menu is for
   */
  showContextMenu(x: number, y: number, nodeId: string): void;

  /**
   * Hide the context menu
   */
  hideContextMenu(): void;

  /**
   * Show custom input modal
   * @param title - Modal title
   * @param placeholder - Input placeholder text
   * @param defaultValue - Default input value
   * @returns Promise that resolves with the input value
   */
  showInputModal(title: string, placeholder?: string, defaultValue?: string): Promise<string>;

  /**
   * Start editing a node
   * @param nodeId - ID of the node to edit
   */
  startEdit(nodeId: string): void;

  /**
   * Stop editing and save changes
   * @param save - Whether to save the changes
   */
  stopEdit(save?: boolean): void;

  /**
   * Draw the complete mindmap visualization
   * @param root - Root node to draw
   */
  draw(root: MindMapNode): void;

  /**
   * Render the complete mindmap
   */
  render(): void;

  /**
   * Export the mindmap data as JSON file
   */
  exportData(): void;

  /**
   * Reset the view to center and default zoom
   */
  resetView(): void;

  /**
   * Destroy the mindmap and clean up resources
   */
  destroy(): void;

  /**
   * Update the mindmap configuration
   * @param newConfig - New configuration options
   */
  updateConfig(newConfig: Partial<MindMapConfig>): void;
}

export default MindMap;