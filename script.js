// State variables for comparison tab
let shapeSize = 280;
let cornerRadius = 32;
let smoothness = 100;
let shapeColor = '#F59E0B';
let activeTab = 'comparison';
let activeCodeTab = 'svg';
let darkMode = false;

// State variables for generator tab
let width = 200;
let height = 200;
let genRadius = 20;
let genSmoothness = 100;
let isSquircle = false;
let fillColor = '#3B82F6';
let aspectRatioLocked = true;
let hasBorder = false;
let borderWidth = 2;
let borderColor = '#000000';
let activeFormatTab = 'svg';

// DOM Elements
// Tab navigation
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

// Comparison tab elements
const standardShape = document.getElementById('standard-shape');
const squircleShape = document.getElementById('squircle-shape');
const radiusValue = document.getElementById('radius-value');
const squircleRadiusValue = document.getElementById('squircle-radius-value');
const smoothingValue = document.getElementById('smoothing-value');
const cornerRadiusSlider = document.getElementById('corner-radius-slider');
const cornerRadiusDisplay = document.getElementById('corner-radius-display');
const smoothingSlider = document.getElementById('smoothing-slider');
const smoothingDisplay = document.getElementById('smoothing-display');
const shapeSizeSlider = document.getElementById('shape-size-slider');
const shapeSizeDisplay = document.getElementById('shape-size-display');
const standardAnnotation = document.getElementById('standard-annotation');
const squircleAnnotation = document.getElementById('squircle-annotation');
const colorSwatches = document.querySelectorAll('.color-swatch');
const curveVisualization = document.getElementById('curve-visualization');
const zoomStandard = document.getElementById('zoom-standard');
const zoomSquircle = document.getElementById('zoom-squircle');
const codeOutput = document.getElementById('code-output');
const copyBtn = document.getElementById('copy-btn');
const codeTabs = document.querySelectorAll('.code-tab');

// Generator tab elements
const shapePreview = document.getElementById('shape-preview');
const widthInput = document.getElementById('width-input');
const heightInput = document.getElementById('height-input');
const lockRatioBtn = document.getElementById('lock-ratio');
const resetDimensionsBtn = document.getElementById('reset-dimensions');
const cornerStyleRadios = document.querySelectorAll('input[name="corner-style"]');
const radiusControl = document.getElementById('radius-control');
const radiusDisplay = document.getElementById('radius-display');
const smoothnessControlRow = document.getElementById('smoothing-control-row');
const smoothnessControl = document.getElementById('smoothing-control');
const smoothnessControlDisplay = document.getElementById('smoothing-display');
const fillColorPicker = document.getElementById('fill-color');
const colorHex = document.getElementById('color-hex');
const borderToggle = document.getElementById('border-toggle');
const borderControls = document.getElementById('border-controls');
const borderWidthInput = document.getElementById('border-width');
const borderColorPicker = document.getElementById('border-color');
const borderHex = document.getElementById('border-hex');
const formatTabs = document.querySelectorAll('.format-tab');
const generatorCode = document.getElementById('generator-code');
const generatorCopyBtn = document.getElementById('generator-copy');

// Toast notification
const toast = document.getElementById('toast');

/**
 * Initialize the application
 */
function init() {
  // Check for user preference for dark mode
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    toggleDarkMode();
  }
  
  // Initialize comparison UI
  updateComparisonShapes();
  createCurveVisualization();
  updateZoomViews();
  updateComparisonCode();
  
  // Initialize generator UI
  updateShapePreview();
  updateGeneratorCode();
  
  // Set up event listeners
  setupEventListeners();
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Theme toggle
  themeToggleBtn.addEventListener('click', toggleDarkMode);
  
  // Tab navigation
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      setActiveTab(tab);
    });
  });
  
  // Comparison tab listeners
  cornerRadiusSlider.addEventListener('input', () => {
    cornerRadius = parseInt(cornerRadiusSlider.value);
    cornerRadiusDisplay.textContent = cornerRadius;
    radiusValue.textContent = cornerRadius;
    squircleRadiusValue.textContent = cornerRadius;
    updateComparisonShapes();
    createCurveVisualization();
    updateZoomViews();
    updateComparisonCode();
  });
  
  smoothingSlider.addEventListener('input', () => {
    smoothness = parseInt(smoothingSlider.value);
    smoothingDisplay.textContent = `${smoothness}%`;
    smoothingValue.textContent = smoothness;
    updateComparisonShapes();
    createCurveVisualization();
    updateZoomViews();
    updateComparisonCode();
  });
  
  shapeSizeSlider.addEventListener('input', () => {
    shapeSize = parseInt(shapeSizeSlider.value);
    shapeSizeDisplay.textContent = shapeSize;
    updateComparisonShapes();
    updateComparisonCode();
  });
  
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      shapeColor = swatch.dataset.color;
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      updateComparisonShapes();
      updateComparisonCode();
    });
  });
  
  // Code tab listeners
  codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activeCodeTab = tab.dataset.code;
      codeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      updateComparisonCode();
    });
  });
  
  // Copy button
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(codeOutput.textContent)
      .then(() => {
        showToast();
      });
  });
  
  // Generator tab listeners
  widthInput.addEventListener('input', () => {
    width = parseInt(widthInput.value) || 200;
    
    if (aspectRatioLocked) {
      const ratio = height / width;
      height = Math.round(width * ratio);
      heightInput.value = height;
    }
    
    updateShapePreview();
    updateGeneratorCode();
  });
  
  heightInput.addEventListener('input', () => {
    height = parseInt(heightInput.value) || 200;
    
    if (aspectRatioLocked) {
      const ratio = width / height;
      width = Math.round(height * ratio);
      widthInput.value = width;
    }
    
    updateShapePreview();
    updateGeneratorCode();
  });
  
  lockRatioBtn.addEventListener('click', () => {
    aspectRatioLocked = !aspectRatioLocked;
    lockRatioBtn.classList.toggle('active', aspectRatioLocked);
  });
  
  resetDimensionsBtn.addEventListener('click', () => {
    width = 200;
    height = 200;
    widthInput.value = width;
    heightInput.value = height;
    updateShapePreview();
    updateGeneratorCode();
  });
  
  cornerStyleRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      isSquircle = radio.value === 'squircle';
      smoothnessControlRow.classList.toggle('hidden', !isSquircle);
      updateShapePreview();
      updateGeneratorCode();
    });
  });
  
  radiusControl.addEventListener('input', () => {
    genRadius = parseInt(radiusControl.value);
    radiusDisplay.textContent = genRadius;
    updateShapePreview();
    updateGeneratorCode();
  });
  
  smoothnessControl.addEventListener('input', () => {
    genSmoothness = parseInt(smoothnessControl.value);
    smoothnessControlDisplay.textContent = `${genSmoothness}%`;
    updateShapePreview();
    updateGeneratorCode();
  });
  
  fillColorPicker.addEventListener('input', () => {
    fillColor = fillColorPicker.value;
    colorHex.value = fillColor.toUpperCase();
    updateShapePreview();
    updateGeneratorCode();
  });
  
  colorHex.addEventListener('input', () => {
    if (/^#[0-9A-F]{6}$/i.test(colorHex.value)) {
      fillColor = colorHex.value;
      fillColorPicker.value = fillColor;
      updateShapePreview();
      updateGeneratorCode();
    }
  });
  
  borderToggle.addEventListener('change', () => {
    hasBorder = borderToggle.checked;
    borderControls.classList.toggle('hidden', !hasBorder);
    updateShapePreview();
    updateGeneratorCode();
  });
  
  borderWidthInput.addEventListener('input', () => {
    borderWidth = parseInt(borderWidthInput.value) || 1;
    updateShapePreview();
    updateGeneratorCode();
  });
  
  borderColorPicker.addEventListener('input', () => {
    borderColor = borderColorPicker.value;
    borderHex.value = borderColor.toUpperCase();
    updateShapePreview();
    updateGeneratorCode();
  });
  
  borderHex.addEventListener('input', () => {
    if (/^#[0-9A-F]{6}$/i.test(borderHex.value)) {
      borderColor = borderHex.value;
      borderColorPicker.value = borderColor;
      updateShapePreview();
      updateGeneratorCode();
    }
  });
  
  formatTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activeFormatTab = tab.dataset.format;
      formatTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      updateGeneratorCode();
    });
  });
  
  generatorCopyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(generatorCode.textContent)
      .then(() => {
        showToast();
      });
  });
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode', darkMode);
}

/**
 * Set active tab
 */
function setActiveTab(tab) {
  activeTab = tab;
  
  // Update button states
  tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  
  // Update content visibility
  tabContents.forEach(content => {
    content.classList.toggle('active', content.id === `${tab}-content`);
  });
  
  // Refresh visuals to ensure they render correctly when tab becomes visible
  if (tab === 'comparison') {
    updateComparisonShapes();
    createCurveVisualization();
    updateZoomViews();
    updateComparisonCode();
  } else if (tab === 'generator') {
    updateShapePreview();
    updateGeneratorCode();
  }
}

/**
 * Update comparison shapes based on current settings
 */
function updateComparisonShapes() {
  // Update dimensions
  standardShape.style.width = `${shapeSize}px`;
  standardShape.style.height = `${shapeSize}px`;
  squircleShape.style.width = `${shapeSize}px`;
  squircleShape.style.height = `${shapeSize}px`;
  
  // Update colors
  standardShape.style.backgroundColor = shapeColor;
  squircleShape.style.backgroundColor = shapeColor;
  squircleAnnotation.querySelector('.annotation-box').style.backgroundColor = shapeColor;
  
  // Update border radius for standard shape
  standardShape.style.borderRadius = `${cornerRadius}px`;
  
  // Update squircle shape using clip-path
  const squircleClipPath = generateSquirclePath(shapeSize, shapeSize, cornerRadius, smoothness / 100);
  squircleShape.style.borderRadius = '0';
  squircleShape.style.clipPath = squircleClipPath;
  
  // Update annotation positions
  const annotationDistance = 80;
  standardAnnotation.style.right = `-${annotationDistance}px`;
  squircleAnnotation.style.right = `-${annotationDistance}px`;
  
  // Update annotation points
  const annotationPoints = document.querySelectorAll('.annotation-point');
  annotationPoints.forEach(point => {
    if (point.classList.contains('top-right')) {
      point.style.top = `${cornerRadius}px`;
      point.style.right = `${cornerRadius}px`;
    } else if (point.classList.contains('bottom-right')) {
      point.style.bottom = `${cornerRadius}px`;
      point.style.right = `${cornerRadius}px`;
    } else if (point.classList.contains('bottom-left')) {
      point.style.bottom = `${cornerRadius}px`;
      point.style.left = `${cornerRadius}px`;
    } else if (point.classList.contains('top-left')) {
      point.style.top = `${cornerRadius}px`;
      point.style.left = `${cornerRadius}px`;
    }
  });
}

/**
 * Generate a squircle path based on dimensions, radius and smoothness
 */
function generateSquirclePath(width, height, radius, smoothnessValue) {
  // Prevent radius from being larger than half the smallest dimension
  const maxRadius = Math.min(width, height) / 2;
  radius = Math.min(radius, maxRadius);
  
  // Smoothness should be a value between 0 and 1
  // Map it to control points that create the squircle effect
  
  // For a perfect squircle, the control points should be about 12% of the width/height
  // For more square corners, increase this percentage
  // For more circular corners, decrease this percentage
  
  // Map smoothness (0-1) to control points (24%-6%)
  const controlPointFactor = (1 - smoothnessValue) * 18 + 6;
  
  // Calculate control points as percentage of the radius
  const cpDistance = radius * (controlPointFactor / 100);
  
  // Create the path using cubic bezier curves for each corner
  const path = `
    M ${radius}, 0
    L ${width - radius}, 0
    C ${width - cpDistance}, 0, ${width}, ${cpDistance}, ${width}, ${radius}
    L ${width}, ${height - radius}
    C ${width}, ${height - cpDistance}, ${width - cpDistance}, ${height}, ${width - radius}, ${height}
    L ${radius}, ${height}
    C ${cpDistance}, ${height}, 0, ${height - cpDistance}, 0, ${height - radius}
    L 0, ${radius}
    C 0, ${cpDistance}, ${cpDistance}, 0, ${radius}, 0
    Z
  `;
  
  // Clean up the path string to remove extra whitespace
  const cleanPath = path.replace(/\s+/g, ' ').trim();
  
  return `path('${cleanPath}')`;
}

/**
 * Create the curve visualization SVG
 */
function createCurveVisualization() {
  // Create an SVG to show the difference between the curve profiles
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 200 200');
  
  // Create a grid
  const grid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
  // Add grid lines
  for (let i = 0; i <= 200; i += 20) {
    const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hLine.setAttribute('x1', '0');
    hLine.setAttribute('y1', i.toString());
    hLine.setAttribute('x2', '200');
    hLine.setAttribute('y2', i.toString());
    hLine.setAttribute('stroke', '#e5e7eb');
    hLine.setAttribute('stroke-width', '1');
    grid.appendChild(hLine);
    
    const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    vLine.setAttribute('x1', i.toString());
    vLine.setAttribute('y1', '0');
    vLine.setAttribute('x2', i.toString());
    vLine.setAttribute('y2', '200');
    vLine.setAttribute('stroke', '#e5e7eb');
    vLine.setAttribute('stroke-width', '1');
    grid.appendChild(vLine);
  }
  
  svg.appendChild(grid);
  
  // Radius to use in visualization (scaled for visibility)
  const vizRadius = 100;
  
  // Create a standard corner curve
  const standardCurve = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  standardCurve.setAttribute('d', `M 0,${vizRadius} A ${vizRadius},${vizRadius} 0 0 1 ${vizRadius},0`);
  standardCurve.setAttribute('stroke', '#6366F1');
  standardCurve.setAttribute('stroke-width', '3');
  standardCurve.setAttribute('fill', 'none');
  
  // Create a squircle corner curve
  const squircleCurve = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  
  // Calculate control points for squircle
  const controlPointFactor = (1 - smoothness / 100) * 18 + 6;
  const controlPoint = vizRadius * (controlPointFactor / 100);
  
  squircleCurve.setAttribute('d', `M 0,${vizRadius} C 0,${controlPoint} ${controlPoint},0 ${vizRadius},0`);
  squircleCurve.setAttribute('stroke', '#F59E0B');
  squircleCurve.setAttribute('stroke-width', '3');
  squircleCurve.setAttribute('fill', 'none');
  
  svg.appendChild(standardCurve);
  svg.appendChild(squircleCurve);
  
  // Clear and append SVG
  curveVisualization.innerHTML = '';
  curveVisualization.appendChild(svg);
}

/**
 * Update the corner zoom views
 */
function updateZoomViews() {
  // Create zoomed views of the corners
  
  // Standard corner zoom
  zoomStandard.innerHTML = '';
  const standardZoom = document.createElement('div');
  standardZoom.style.width = '300px';
  standardZoom.style.height = '300px';
  standardZoom.style.backgroundColor = shapeColor;
  standardZoom.style.borderRadius = `${cornerRadius * 2}px`;
  standardZoom.style.transform = 'scale(0.5)';
  standardZoom.style.transformOrigin = 'top left';
  zoomStandard.appendChild(standardZoom);
  
  // Squircle corner zoom
  zoomSquircle.innerHTML = '';
  const squircleZoom = document.createElement('div');
  squircleZoom.style.width = '300px';
  squircleZoom.style.height = '300px';
  squircleZoom.style.backgroundColor = shapeColor;
  
  // Generate clip path for the squircle
  const squircleClipPath = generateSquirclePath(300, 300, cornerRadius * 2, smoothness / 100);
  squircleZoom.style.clipPath = squircleClipPath;
  
  squircleZoom.style.transform = 'scale(0.5)';
  squircleZoom.style.transformOrigin = 'top left';
  zoomSquircle.appendChild(squircleZoom);
}

/**
 * Update the comparison code output
 */
function updateComparisonCode() {
  let code = '';
  
  if (activeCodeTab === 'svg') {
    code = generateComparisonSvgCode();
  } else if (activeCodeTab === 'css') {
    code = generateComparisonCssCode();
  }
  
  codeOutput.textContent = code;
}

/**
 * Generate SVG code for the comparison
 */
function generateComparisonSvgCode() {
  if (smoothness < 100) {
    // Generate squircle SVG
    const path = generateSquirclePathSvg(shapeSize, shapeSize, cornerRadius, smoothness / 100);
    
    let svg = `<svg width="${shapeSize}" height="${shapeSize}" viewBox="0 0 ${shapeSize} ${shapeSize}" xmlns="http://www.w3.org/2000/svg">\n`;
    svg += `  <path d="${path}" fill="${shapeColor}" />\n`;
    svg += `</svg>`;
    
    return svg;
  } else {
    // Generate normal rounded rectangle SVG
    let svg = `<svg width="${shapeSize}" height="${shapeSize}" viewBox="0 0 ${shapeSize} ${shapeSize}" xmlns="http://www.w3.org/2000/svg">\n`;
    svg += `  <rect width="${shapeSize}" height="${shapeSize}" rx="${cornerRadius}" fill="${shapeColor}" />\n`;
    svg += `</svg>`;
    
    return svg;
  }
}

/**
 * Generate a clean SVG path for squircle
 */
function generateSquirclePathSvg(width, height, radius, smoothnessValue) {
  // Prevent radius from being larger than half the smallest dimension
  const maxRadius = Math.min(width, height) / 2;
  radius = Math.min(radius, maxRadius);
  
  // Map smoothness (0-1) to control points (24%-6%)
  const controlPointFactor = (1 - smoothnessValue) * 18 + 6;
  
  // Calculate control points as percentage of the radius
  const cpDistance = radius * (controlPointFactor / 100);
  
  // Create the path using cubic bezier curves for each corner
  const path = `
    M ${radius} 0
    L ${width - radius} 0
    C ${width - cpDistance} 0 ${width} ${cpDistance} ${width} ${radius}
    L ${width} ${height - radius}
    C ${width} ${height - cpDistance} ${width - cpDistance} ${height} ${width - radius} ${height}
    L ${radius} ${height}
    C ${cpDistance} ${height} 0 ${height - cpDistance} 0 ${height - radius}
    L 0 ${radius}
    C 0 ${cpDistance} ${cpDistance} 0 ${radius} 0
    Z
  `;
  
  // Clean up the path string to remove extra whitespace
  return path.replace(/\s+/g, ' ').trim();
}

/**
 * Generate CSS code for the comparison
 */
function generateComparisonCssCode() {
  let css = `.shape {\n`;
  css += `  width: ${shapeSize}px;\n`;
  css += `  height: ${shapeSize}px;\n`;
  css += `  background-color: ${shapeColor};\n`;
  
  if (smoothness < 100) {
    // Generate squircle CSS with clip-path
    const cleanPath = generateSquirclePathSvg(shapeSize, shapeSize, cornerRadius, smoothness / 100);
    
    css += `  clip-path: path('${cleanPath}');\n`;
  } else {
    css += `  border-radius: ${cornerRadius}px;\n`;
  }
  
  css += `}`;
  
  return css;
}

/**
 * Update the shape preview in the generator tab
 */
function updateShapePreview() {
  // Update dimensions
  shapePreview.style.width = `${width}px`;
  shapePreview.style.height = `${height}px`;
  
  // Update fill color
  shapePreview.style.backgroundColor = fillColor;
  
  // Apply shape type
  if (isSquircle) {
    // Generate squircle shape using clip-path
    const squircleClipPath = generateSquirclePath(width, height, genRadius, genSmoothness / 100);
    shapePreview.style.borderRadius = '0';
    shapePreview.style.clipPath = squircleClipPath;
  } else {
    // Use standard border-radius
    shapePreview.style.borderRadius = `${genRadius}px`;
    shapePreview.style.clipPath = 'none';
  }
  
  // Apply border if enabled
  if (hasBorder) {
    shapePreview.style.border = `${borderWidth}px solid ${borderColor}`;
  } else {
    shapePreview.style.border = 'none';
  }
}

/**
 * Update the generator code output
 */
function updateGeneratorCode() {
  let code = '';
  
  if (activeFormatTab === 'svg') {
    code = generateGeneratorSvgCode();
  } else if (activeFormatTab === 'css') {
    code = generateGeneratorCssCode();
  } else if (activeFormatTab === 'react') {
    code = generateGeneratorReactCode();
  }
  
  generatorCode.textContent = code;
}

/**
 * Generate SVG code for the generator
 */
function generateGeneratorSvgCode() {
  if (isSquircle) {
    // Generate squircle SVG
    const path = generateSquirclePathSvg(width, height, genRadius, genSmoothness / 100);
    
    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">\n`;
    svg += `  <path d="${path}" fill="${fillColor}"`;
    
    if (hasBorder) {
      svg += ` stroke="${borderColor}" stroke-width="${borderWidth}"`;
    }
    
    svg += ` />\n`;
    svg += `</svg>`;
    
    return svg;
  } else {
    // Generate standard rounded rectangle SVG
    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">\n`;
    svg += `  <rect width="${width}" height="${height}" rx="${genRadius}" fill="${fillColor}"`;
    
    if (hasBorder) {
      svg += ` stroke="${borderColor}" stroke-width="${borderWidth}"`;
    }
    
    svg += ` />\n`;
    svg += `</svg>`;
    
    return svg;
  }
}

/**
 * Generate CSS code for the generator
 */
function generateGeneratorCssCode() {
  let css = `.shape {\n`;
  css += `  width: ${width}px;\n`;
  css += `  height: ${height}px;\n`;
  css += `  background-color: ${fillColor};\n`;
  
  if (isSquircle) {
    // Generate squircle CSS with clip-path
    const cleanPath = generateSquirclePathSvg(width, height, genRadius, genSmoothness / 100);
    
    css += `  clip-path: path('${cleanPath}');\n`;
  } else {
    css += `  border-radius: ${genRadius}px;\n`;
  }
  
  if (hasBorder) {
    css += `  border: ${borderWidth}px solid ${borderColor};\n`;
  }
  
  css += `}`;
  
  return css;
}

/**
 * Generate React code for the generator
 */
function generateGeneratorReactCode() {
  if (isSquircle) {
    // Generate React component with SVG path
    const path = generateSquirclePathSvg(width, height, genRadius, genSmoothness / 100);
    
    let code = `import React from 'react';\n\n`;
    code += `const SquircleComponent = () => {\n`;
    code += `  return (\n`;
    code += `    <svg\n`;
    code += `      width="${width}"\n`;
    code += `      height="${height}"\n`;
    code += `      viewBox="0 0 ${width} ${height}"\n`;
    code += `      xmlns="http://www.w3.org/2000/svg"\n`;
    code += `    >\n`;
    code += `      <path\n`;
    code += `        d="${path}"\n`;
    code += `        fill="${fillColor}"\n`;
    
    if (hasBorder) {
      code += `        stroke="${borderColor}"\n`;
      code += `        strokeWidth="${borderWidth}"\n`;
    }
    
    code += `      />\n`;
    code += `    </svg>\n`;
    code += `  );\n`;
    code += `};\n\n`;
    code += `export default SquircleComponent;`;
    
    return code;
  } else {
    // Generate React component with div and border-radius
    let code = `import React from 'react';\n\n`;
    code += `const RoundedRectangle = () => {\n`;
    code += `  return (\n`;
    code += `    <div\n`;
    code += `      style={{\n`;
    code += `        width: ${width},\n`;
    code += `        height: ${height},\n`;
    code += `        backgroundColor: '${fillColor}',\n`;
    code += `        borderRadius: ${genRadius},\n`;
    
    if (hasBorder) {
      code += `        border: '${borderWidth}px solid ${borderColor}',\n`;
    }
    
    code += `      }}\n`;
    code += `    />\n`;
    code += `  );\n`;
    code += `};\n\n`;
    code += `export default RoundedRectangle;`;
    
    return code;
  }
}

/**
 * Show toast notification
 */
function showToast() {
  toast.classList.remove('hidden');
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
