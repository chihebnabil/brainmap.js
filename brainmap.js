/**
 * MindMap.js - Interactive Mindmap Library
 * Version 1.0.0
 * 
 * A beautiful, themeable, and interactive mindmap library for creating
 * hierarchical visualizations with editing capabilities.
 * 
 * @author GitHub Copilot
 * @license MIT
 */

class MindMap {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    
    if (!this.container) {
      throw new Error('MindMap: Container element not found');
    }

    // Default configuration
    this.config = {
      width: 800,
      height: 800,
      theme: 'default', // 'default', 'dark', 'compact'
      radiusStep: 120,
      editable: true,
      showControls: true,
      showStatus: true,
      exportFilename: 'mindmap-data.json',
      colors: {
        root: { fill: '#f97316', stroke: '#dc2626', text: '#ffffff' },
        branch: { fill: '#34d399', stroke: '#059669', text: '#065f46' },
        leaf: { fill: '#60a5fa', stroke: '#2563eb', text: '#1e40af' },
        link: 'rgba(255,255,255,0.6)'
      },
      ...options
    };

    // Initialize state
    this.treeData = null;
    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.isDragging = false;
    this.dragStart = null;
    this.isEditing = false;
    this.editingNode = null;
    this.contextMenu = null;
    this.nodeIdCounter = Date.now();

    // DOM elements
    this.svg = null;
    this.viewport = null;
    this.statusEl = null;
    this.controlsEl = null;

    this.init();
  }

  /**
   * Initialize the mindmap
   */
  init() {
    this.setupDOM();
    this.setupEventListeners();
    
    // Add default data if none provided
    if (!this.treeData) {
      this.setData({
        id: 'root',
        name: 'My Mind Map',
        children: [
          { id: 'node1', name: 'Idea 1', children: [{ id: 'node1-1', name: 'Detail A' }] },
          { id: 'node2', name: 'Idea 2' },
          { id: 'node3', name: 'Idea 3', children: [{ id: 'node3-1', name: 'Detail B' }, { id: 'node3-2', name: 'Detail C' }] }
        ]
      });
    }
  }

  /**
   * Set up the DOM structure
   */
  setupDOM() {
    // Clear container
    this.container.innerHTML = '';
    
    // Add theme class
    this.container.className = `mindmap-container ${this.config.theme}`;
    
    // Create controls
    if (this.config.showControls) {
      this.controlsEl = document.createElement('div');
      this.controlsEl.className = 'mindmap-controls';
      this.controlsEl.innerHTML = `
        <button class="mindmap-control-btn" data-action="export">Export JSON</button>
        <button class="mindmap-control-btn" data-action="reset">Reset View</button>
      `;
      this.container.appendChild(this.controlsEl);
    }

    // Create status
    if (this.config.showStatus) {
      this.statusEl = document.createElement('div');
      this.statusEl.className = 'mindmap-status';
      this.statusEl.textContent = this.config.editable ? 
        'Right-click nodes to edit • Double-click to rename' : 
        'Interactive Mind Map';
      this.container.appendChild(this.statusEl);
    }

    // Create SVG
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('class', 'mindmap-svg');
    this.svg.setAttribute('viewBox', `0 0 ${this.config.width} ${this.config.height}`);
    this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // Create gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <linearGradient id="mindmapRootGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f97316;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#dc2626;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="mindmapBranchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#34d399;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="mindmapLeafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
      </linearGradient>
    `;
    this.svg.appendChild(defs);

    // Create viewport group
    this.viewport = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.svg.appendChild(this.viewport);

    this.container.appendChild(this.svg);
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Remove existing event listeners if they exist
    this.removeEventListeners();
    
    // Store bound event handlers for cleanup
    this.boundHandlers = {
      wheel: (e) => this.handleWheel(e),
      mousedown: (e) => this.handleMouseDown(e),
      mousemove: (e) => this.handleMouseMove(e),
      mouseup: (e) => this.handleMouseUp(e),
      mouseleave: (e) => this.handleMouseLeave(e),
      hideContextMenu: () => this.hideContextMenu()
    };

    // Controls
    if (this.controlsEl) {
      this.controlsEl.addEventListener('click', (e) => {
        if (!e.target.matches('.mindmap-control-btn')) return;
        const action = e.target.dataset.action;
        if (action === 'export') this.exportData();
        if (action === 'reset') this.resetView();
      });
    }

    // Zoom and pan
    if (this.svg) {
      this.svg.addEventListener('wheel', this.boundHandlers.wheel);
      this.svg.addEventListener('mousedown', this.boundHandlers.mousedown);
      this.svg.addEventListener('mousemove', this.boundHandlers.mousemove);
      this.svg.addEventListener('mouseup', this.boundHandlers.mouseup);
      this.svg.addEventListener('mouseleave', this.boundHandlers.mouseleave);
    }

    // Global click to hide context menu
    document.addEventListener('click', this.boundHandlers.hideContextMenu);
  }

  /**
   * Remove event listeners
   */
  removeEventListeners() {
    if (this.boundHandlers && this.svg) {
      this.svg.removeEventListener('wheel', this.boundHandlers.wheel);
      this.svg.removeEventListener('mousedown', this.boundHandlers.mousedown);
      this.svg.removeEventListener('mousemove', this.boundHandlers.mousemove);
      this.svg.removeEventListener('mouseup', this.boundHandlers.mouseup);
      this.svg.removeEventListener('mouseleave', this.boundHandlers.mouseleave);
    }
    
    if (this.boundHandlers) {
      document.removeEventListener('click', this.boundHandlers.hideContextMenu);
    }
  }

  /**
   * Set the mindmap data
   */
  setData(data) {
    this.treeData = JSON.parse(JSON.stringify(data)); // Deep clone
    this.render();
    this.setStatus('Data loaded successfully');
  }

  /**
   * Get the mindmap data
   */
  getData() {
    return JSON.parse(JSON.stringify(this.treeData)); // Deep clone
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return 'node_' + (++this.nodeIdCounter);
  }

  /**
   * Set status message
   */
  setStatus(message) {
    if (!this.statusEl) return;
    this.statusEl.textContent = message;
    setTimeout(() => {
      if (this.statusEl) {
        this.statusEl.textContent = this.config.editable ? 
          'Right-click nodes to edit • Double-click to rename' : 
          'Interactive Mind Map';
      }
    }, 3000);
  }

  /**
   * Convert screen coordinates to SVG coordinates
   */
  screenToSvg(screenX, screenY) {
    const rect = this.svg.getBoundingClientRect();
    const svgX = (screenX - rect.left) / rect.width * this.config.width;
    const svgY = (screenY - rect.top) / rect.height * this.config.height;
    return { x: svgX, y: svgY };
  }

  /**
   * Handle mouse wheel for zooming
   */
  handleWheel(e) {
    if (this.isEditing) return;
    e.preventDefault();
    
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = this.zoom * scaleFactor;
    
    const centerPoint = this.screenToSvg(
      this.svg.getBoundingClientRect().left + this.svg.getBoundingClientRect().width / 2,
      this.svg.getBoundingClientRect().top + this.svg.getBoundingClientRect().height / 2
    );
    
    const fixedX = (centerPoint.x - this.offsetX) / this.zoom;
    const fixedY = (centerPoint.y - this.offsetY) / this.zoom;
    
    this.zoom = newZoom;
    this.offsetX = centerPoint.x - fixedX * this.zoom;
    this.offsetY = centerPoint.y - fixedY * this.zoom;
    
    this.updateTransform();
  }

  /**
   * Handle mouse down for panning
   */
  handleMouseDown(e) {
    if (this.isEditing) return;
    this.isDragging = true;
    this.dragStart = {x: e.clientX, y: e.clientY, ox: this.offsetX, oy: this.offsetY};
    this.svg.style.cursor = 'grabbing';
  }

  /**
   * Handle mouse move for panning
   */
  handleMouseMove(e) {
    if (!this.isDragging || this.isEditing) return;
    this.offsetX = this.dragStart.ox + (e.clientX - this.dragStart.x);
    this.offsetY = this.dragStart.oy + (e.clientY - this.dragStart.y);
    this.updateTransform();
  }

  /**
   * Handle mouse up
   */
  handleMouseUp() {
    this.isDragging = false;
    this.svg.style.cursor = this.isEditing ? 'default' : 'grab';
  }

  /**
   * Handle mouse leave
   */
  handleMouseLeave() {
    this.isDragging = false;
    this.svg.style.cursor = this.isEditing ? 'default' : 'grab';
  }

  /**
   * Update viewport transform
   */
  updateTransform() {
    this.viewport.setAttribute('transform', `translate(${this.offsetX},${this.offsetY}) scale(${this.zoom})`);
  }

  /**
   * Find node by ID in tree
   */
  findNodeById(tree, id) {
    if (tree.id === id) return tree;
    if (!tree.children) return null;
    for (const child of tree.children) {
      const found = this.findNodeById(child, id);
      if (found) return found;
    }
    return null;
  }

  /**
   * Find parent node by child ID
   */
  findParentById(tree, childId) {
    if (!tree.children) return null;
    for (const child of tree.children) {
      if (child.id === childId) return tree;
      const found = this.findParentById(child, childId);
      if (found) return found;
    }
    return null;
  }

  /**
   * Add child node
   */
  addChild(parentId, name) {
    if (!this.config.editable) return false;
    
    const parent = this.findNodeById(this.treeData, parentId);
    if (!parent) return false;
    
    if (!parent.children) parent.children = [];
    parent.children.push({
      id: this.generateId(),
      name: name || 'New Node'
    });
    
    this.render();
    this.setStatus(`Added child "${name || 'New Node'}" to "${parent.name}"`);
    return true;
  }

  /**
   * Add sibling node
   */
  addSibling(nodeId, name) {
    if (!this.config.editable) return false;
    
    const parent = this.findParentById(this.treeData, nodeId);
    if (!parent) return false;
    
    const newNode = {
      id: this.generateId(),
      name: name || 'New Node'
    };
    
    const siblingIndex = parent.children.findIndex(c => c.id === nodeId);
    parent.children.splice(siblingIndex + 1, 0, newNode);
    
    this.render();
    this.setStatus(`Added sibling "${name || 'New Node'}"`);
    return true;
  }

  /**
   * Delete node
   */
  deleteNode(nodeId) {
    if (!this.config.editable) return false;
    
    if (nodeId === this.treeData.id) {
      this.setStatus('Cannot delete root node');
      return false;
    }
    
    const parent = this.findParentById(this.treeData, nodeId);
    if (!parent) return false;
    
    const nodeIndex = parent.children.findIndex(c => c.id === nodeId);
    const nodeName = parent.children[nodeIndex].name;
    parent.children.splice(nodeIndex, 1);
    
    this.render();
    this.setStatus(`Deleted "${nodeName}"`);
    return true;
  }

  /**
   * Rename node
   */
  renameNode(nodeId, newName) {
    if (!this.config.editable) return false;
    
    const node = this.findNodeById(this.treeData, nodeId);
    if (!node) return false;
    
    const oldName = node.name;
    node.name = newName || 'Unnamed';
    
    this.render();
    this.setStatus(`Renamed "${oldName}" to "${node.name}"`);
    return true;
  }

  /**
   * Show context menu
   */
  showContextMenu(x, y, nodeId) {
    if (!this.config.editable) return;
    
    this.hideContextMenu();
    
    const node = this.findNodeById(this.treeData, nodeId);
    const isRoot = nodeId === this.treeData.id;
    
    this.contextMenu = document.createElement('div');
    this.contextMenu.className = 'mindmap-context-menu';
    this.contextMenu.style.left = x + 'px';
    this.contextMenu.style.top = y + 'px';
    
    const items = [
      { text: `Rename "${node.name}"`, action: () => this.startEdit(nodeId) },
      { text: 'Add Child', action: () => this.addChild(nodeId, prompt('Child name:')) },
      !isRoot && { text: 'Add Sibling', action: () => this.addSibling(nodeId, prompt('Sibling name:')) },
      !isRoot && { text: `Delete "${node.name}"`, action: () => this.deleteNode(nodeId), dangerous: true }
    ].filter(Boolean);
    
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = `mindmap-context-menu-item ${item.dangerous ? 'dangerous' : ''}`;
      div.textContent = item.text;
      div.addEventListener('click', () => {
        item.action();
        this.hideContextMenu();
      });
      this.contextMenu.appendChild(div);
    });
    
    document.body.appendChild(this.contextMenu);
    
    // Position adjustment if menu goes off screen
    const rect = this.contextMenu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      this.contextMenu.style.left = (x - rect.width) + 'px';
    }
    if (rect.bottom > window.innerHeight) {
      this.contextMenu.style.top = (y - rect.height) + 'px';
    }
  }

  /**
   * Hide context menu
   */
  hideContextMenu() {
    if (this.contextMenu) {
      this.contextMenu.remove();
      this.contextMenu = null;
    }
  }

  /**
   * Start inline editing
   */
  startEdit(nodeId) {
    if (!this.config.editable || this.isEditing) return;
    
    const node = this.findNodeById(this.treeData, nodeId);
    if (!node) return;
    
    this.isEditing = true;
    this.editingNode = nodeId;
    this.svg.setAttribute('class', this.svg.getAttribute('class') + ' editing');
    
    // Find the node element and its position
    const nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (!nodeElement) return;
    
    // Add editing class for visual feedback
    const currentClass = nodeElement.getAttribute('class') || '';
    if (!currentClass.includes('editing')) {
      nodeElement.setAttribute('class', currentClass + ' editing');
    }
    
    // Get text element position
    const textElement = nodeElement.querySelector('text');
    const rect = textElement.getBoundingClientRect();
    
    // Create input
    const input = document.createElement('input');
    input.className = 'mindmap-edit-input';
    input.value = node.name;
    input.style.left = (rect.left - 50) + 'px';
    input.style.top = (rect.top - 15) + 'px';
    input.style.width = '100px';
    
    document.body.appendChild(input);
    input.select();
    input.focus();
    
    const finishEdit = (save = true) => {
      if (!this.isEditing) return;
      
      if (save && input.value.trim()) {
        this.renameNode(nodeId, input.value.trim());
      } else {
        this.render(); // Re-render to remove editing class
      }
      
      input.remove();
      this.isEditing = false;
      this.editingNode = null;
      const svgClass = this.svg.getAttribute('class') || '';
      this.svg.setAttribute('class', svgClass.replace(' editing', '').replace('editing', ''));
    };
    
    input.addEventListener('blur', () => finishEdit(true));
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') finishEdit(true);
      if (e.key === 'Escape') finishEdit(false);
    });
  }

  /**
   * Count leaves in subtree
   */
  countLeaves(node) {
    if (!node.children || node.children.length === 0) {
      node._leafCount = 1;
      node._isLeaf = true;
      return 1;
    }
    node._isLeaf = false;
    let sum = 0;
    for (const c of node.children) sum += this.countLeaves(c);
    node._leafCount = sum;
    return sum;
  }

  /**
   * Layout algorithm for positioning nodes
   */
  layout(node, startAngle, endAngle, depth = 0) {
    const mid = (startAngle + endAngle) / 2;
    const r = depth * this.config.radiusStep;
    const centerX = this.config.width / 2;
    const centerY = this.config.height / 2;
    
    node._x = centerX + r * Math.cos(mid);
    node._y = centerY + r * Math.sin(mid);
    node._angle = mid;
    node._depth = depth;
    
    if (!node.children || node.children.length === 0) return;
    
    let angle = startAngle;
    for (const c of node.children) {
      const span = (endAngle - startAngle) * (c._leafCount / node._leafCount);
      this.layout(c, angle, angle + span, depth + 1);
      angle += span;
    }
  }

  /**
   * Layout root node
   */
  layoutRoot(root) {
    const gap = 0.0001;
    const start = -Math.PI/2 + gap;
    const end = -Math.PI/2 + Math.PI*2 - gap;
    const centerX = this.config.width / 2;
    const centerY = this.config.height / 2;
    
    root._x = centerX;
    root._y = centerY;
    root._angle = 0;
    root._depth = 0;
    root._isRoot = true;
    
    if (!root.children) return;
    
    let angle = start;
    for (const c of root.children) {
      const span = (end - start) * (c._leafCount / root._leafCount);
      this.layout(c, angle, angle + span, 1);
      angle += span;
    }
  }

  /**
   * Draw the mindmap
   */
  draw(root) {
    // Clear viewport
    while (this.viewport.firstChild) {
      this.viewport.removeChild(this.viewport.firstChild);
    }

    const gLinks = document.createElementNS('http://www.w3.org/2000/svg','g');
    const gNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
    this.viewport.appendChild(gLinks);
    this.viewport.appendChild(gNodes);

    // Draw links
    const drawLinks = (node) => {
      if (!node.children) return;
      for (const c of node.children) {
        const line = document.createElementNS('http://www.w3.org/2000/svg','path');
        const px = node._x, py = node._y;
        const cx1 = px + (this.config.radiusStep * 0.4) * Math.cos(node._angle);
        const cy1 = py + (this.config.radiusStep * 0.4) * Math.sin(node._angle);
        const cx2 = c._x - (this.config.radiusStep * 0.4) * Math.cos(c._angle);
        const cy2 = c._y - (this.config.radiusStep * 0.4) * Math.sin(c._angle);
        const d = `M ${px} ${py} C ${cx1} ${cy1} ${cx2} ${cy2} ${c._x} ${c._y}`;
        line.setAttribute('d', d);
        line.setAttribute('class', 'mindmap-link');
        gLinks.appendChild(line);
        drawLinks(c);
      }
    };

    // Draw nodes
    const drawNodes = (node) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg','g');
      let nodeClasses = 'mindmap-node';
      g.setAttribute('data-node-id', node.id);
      
      // Add specific classes for styling
      if (node._isRoot) {
        nodeClasses += ' root';
      } else if (node._isLeaf) {
        nodeClasses += ' leaf';
      } else {
        nodeClasses += ' branch';
      }
      
      // Add editing class if this node is being edited
      if (this.editingNode === node.id) {
        nodeClasses += ' editing';
      }
      
      g.setAttribute('class', nodeClasses);
      g.setAttribute('transform', `translate(${node._x},${node._y})`);
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
      let r;
      if (node._isRoot) {
        r = 12;
      } else if (node._isLeaf) {
        r = 8;
      } else {
        r = 7;
      }
      circle.setAttribute('r', r);
      g.appendChild(circle);
      
      const text = document.createElementNS('http://www.w3.org/2000/svg','text');
      text.textContent = node.name || '';
      
      if (node._depth > 0) {
        const textOffset = r + (node._isLeaf ? 20 : 18);
        const dx = Math.cos(node._angle) * textOffset;
        const dy = Math.sin(node._angle) * textOffset;
        text.setAttribute('x', dx);
        text.setAttribute('y', dy);
        const angleDeg = (node._angle * 180 / Math.PI + 360) % 360;
        if (angleDeg > 90 && angleDeg < 270) {
          text.setAttribute('text-anchor','end');
        }
      }
      
      g.appendChild(text);
      
      // Event handlers
      if (this.config.editable) {
        g.addEventListener('contextmenu', e => {
          e.preventDefault();
          this.showContextMenu(e.clientX, e.clientY, node.id);
        });
        
        g.addEventListener('dblclick', e => {
          e.preventDefault();
          this.startEdit(node.id);
        });
      }
      
      g.style.cursor = 'pointer';
      gNodes.appendChild(g);
      
      if (node.children) {
        for (const c of node.children) drawNodes(c);
      }
    };

    drawLinks(root);
    drawNodes(root);
  }

  /**
   * Render the mindmap
   */
  render() {
    if (!this.treeData) return;
    
    this.countLeaves(this.treeData);
    this.layoutRoot(this.treeData);
    this.draw(this.treeData);
    this.updateTransform();
  }

  /**
   * Export data as JSON
   */
  exportData() {
    const dataStr = JSON.stringify(this.treeData, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.config.exportFilename;
    a.click();
    URL.revokeObjectURL(url);
    this.setStatus(`Data exported to ${this.config.exportFilename}`);
  }

  /**
   * Reset view to center
   */
  resetView() {
    this.offsetX = 0;
    this.offsetY = 0;
    this.zoom = 1;
    this.updateTransform();
    this.setStatus('View reset to center');
  }

  /**
   * Destroy the mindmap and clean up
   */
  destroy() {
    this.hideContextMenu();
    this.removeEventListeners();
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.setupDOM();
    this.setupEventListeners();
    this.render();
  }
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MindMap;
} else if (typeof window !== 'undefined') {
  window.MindMap = MindMap;
}