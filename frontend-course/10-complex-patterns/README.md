# 第10课：复杂图案

## 学习目标

- 掌握几何图案生成算法
- 理解tessellation（镶嵌）的数学原理
- 学会创建参数化图案系统
- 深入分析tessellation-evolved.tsx的实现
- 为创建高级视觉效果打下基础

## 几何图案基础

### 对称性与重复

```javascript
// 对称变换基类
class SymmetryTransform {
  constructor() {
    this.transformations = [];
  }
  
  // 添加变换
  addTransform(transform) {
    this.transformations.push(transform);
    return this;
  }
  
  // 应用所有变换到点
  applyToPoint(point) {
    return this.transformations.reduce((p, transform) => {
      return transform.transformPoint(p);
    }, point.clone());
  }
  
  // 应用所有变换到点集
  applyToPoints(points) {
    return points.map(point => this.applyToPoint(point));
  }
}

// 旋转对称
class RotationalSymmetry {
  constructor(center, divisions) {
    this.center = center;
    this.divisions = divisions;
    this.angle = (Math.PI * 2) / divisions;
  }
  
  // 生成所有旋转副本
  generateCopies(shape) {
    const copies = [];
    for (let i = 0; i < this.divisions; i++) {
      const transform = new Transform2D();
      transform.translate(this.center.x, this.center.y)
               .rotate(this.angle * i)
               .translate(-this.center.x, -this.center.y);
      
      const transformedShape = transform.transformPoints(shape);
      copies.push(transformedShape);
    }
    return copies;
  }
}

// 镜像对称
class ReflectionSymmetry {
  constructor(axis) {
    this.axis = axis; // 对称轴：{point: Point2D, direction: Vector2D}
  }
  
  reflectPoint(point) {
    const { point: axisPoint, direction } = this.axis;
    
    // 将点转换到以轴上一点为原点的坐标系
    const relative = new Vector2D(
      point.x - axisPoint.x,
      point.y - axisPoint.y
    );
    
    // 计算点到轴的距离
    const axisNormal = new Vector2D(-direction.y, direction.x).normalize();
    const distance = relative.dot(axisNormal);
    
    // 反射
    const reflected = relative.subtract(axisNormal.multiply(2 * distance));
    
    return new Point2D(
      reflected.x + axisPoint.x,
      reflected.y + axisPoint.y
    );
  }
  
  generateCopies(shape) {
    const reflected = shape.map(point => this.reflectPoint(point));
    return [shape, reflected];
  }
}

// 平移对称（瓷砖模式）
class TranslationSymmetry {
  constructor(translation) {
    this.translation = translation; // Vector2D
  }
  
  generateGrid(shape, rows, cols) {
    const copies = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const offset = new Vector2D(
          col * this.translation.x,
          row * this.translation.y
        );
        
        const translatedShape = shape.map(point => 
          new Point2D(point.x + offset.x, point.y + offset.y)
        );
        
        copies.push(translatedShape);
      }
    }
    return copies;
  }
}
```

### 基础镶嵌图案

```javascript
// 正多边形镶嵌
class RegularTiling {
  constructor(sideLength) {
    this.sideLength = sideLength;
  }
  
  // 正三角形镶嵌
  triangleTiling(width, height) {
    const tiles = [];
    const h = this.sideLength * Math.sqrt(3) / 2; // 三角形高度
    const rows = Math.ceil(height / h);
    const cols = Math.ceil(width / this.sideLength);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols * 2; col++) {
        const isEvenRow = row % 2 === 0;
        const isEvenCol = col % 2 === 0;
        
        let x, y;
        if (isEvenRow) {
          x = col * this.sideLength / 2;
          y = row * h;
        } else {
          x = (col + 1) * this.sideLength / 2;
          y = row * h;
        }
        
        // 创建三角形顶点
        let vertices;
        if ((isEvenRow && isEvenCol) || (!isEvenRow && !isEvenCol)) {
          // 向上的三角形
          vertices = [
            new Point2D(x, y),
            new Point2D(x + this.sideLength, y),
            new Point2D(x + this.sideLength / 2, y + h)
          ];
        } else {
          // 向下的三角形
          vertices = [
            new Point2D(x, y + h),
            new Point2D(x + this.sideLength / 2, y),
            new Point2D(x + this.sideLength, y + h)
          ];
        }
        
        tiles.push(new Polygon(vertices));
      }
    }
    
    return tiles;
  }
  
  // 正方形镶嵌
  squareTiling(width, height) {
    const tiles = [];
    const rows = Math.ceil(height / this.sideLength);
    const cols = Math.ceil(width / this.sideLength);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * this.sideLength;
        const y = row * this.sideLength;
        
        const vertices = [
          new Point2D(x, y),
          new Point2D(x + this.sideLength, y),
          new Point2D(x + this.sideLength, y + this.sideLength),
          new Point2D(x, y + this.sideLength)
        ];
        
        tiles.push(new Polygon(vertices));
      }
    }
    
    return tiles;
  }
  
  // 正六边形镶嵌
  hexagonTiling(width, height) {
    const tiles = [];
    const radius = this.sideLength;
    const h = radius * Math.sqrt(3); // 六边形高度
    const w = radius * 3 / 2; // 六边形宽度
    
    const rows = Math.ceil(height / h);
    const cols = Math.ceil(width / w);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const isEvenRow = row % 2 === 0;
        const centerX = col * w + (isEvenRow ? radius : radius / 2);
        const centerY = row * h / 2 + radius * Math.sqrt(3) / 2;
        
        const vertices = [];
        for (let i = 0; i < 6; i++) {
          const angle = i * Math.PI / 3;
          vertices.push(new Point2D(
            centerX + radius * Math.cos(angle),
            centerY + radius * Math.sin(angle)
          ));
        }
        
        tiles.push(new Polygon(vertices));
      }
    }
    
    return tiles;
  }
}
```

## 参数化图案系统

### 基础参数化模式

```javascript
// 参数化图案生成器
class ParametricPattern {
  constructor() {
    this.parameters = {};
    this.functions = new Map();
  }
  
  // 设置参数
  setParameter(name, value, min = 0, max = 1) {
    this.parameters[name] = {
      value: Math.max(min, Math.min(max, value)),
      min,
      max
    };
    return this;
  }
  
  // 获取参数值
  getParameter(name) {
    return this.parameters[name]?.value || 0;
  }
  
  // 添加生成函数
  addFunction(name, func) {
    this.functions.set(name, func);
    return this;
  }
  
  // 生成图案
  generate(name, ...args) {
    const func = this.functions.get(name);
    if (!func) {
      throw new Error(`Pattern function '${name}' not found`);
    }
    return func.call(this, ...args);
  }
}

// 波浪图案生成器
class WavePattern extends ParametricPattern {
  constructor() {
    super();
    
    // 设置默认参数
    this.setParameter('amplitude', 50, 0, 200);
    this.setParameter('frequency', 1, 0.1, 10);
    this.setParameter('phase', 0, 0, Math.PI * 2);
    this.setParameter('octaves', 1, 1, 8);
    this.setParameter('persistence', 0.5, 0, 1);
    
    // 添加生成函数
    this.addFunction('sine', this.generateSineWave);
    this.addFunction('noise', this.generateNoiseWave);
    this.addFunction('composite', this.generateCompositeWave);
  }
  
  generateSineWave(width, height, resolution = 2) {
    const points = [];
    const amplitude = this.getParameter('amplitude');
    const frequency = this.getParameter('frequency');
    const phase = this.getParameter('phase');
    
    for (let x = 0; x < width; x += resolution) {
      const y = height / 2 + amplitude * Math.sin(frequency * x * 0.01 + phase);
      points.push(new Point2D(x, y));
    }
    
    return points;
  }
  
  generateNoiseWave(width, height, resolution = 2) {
    const points = [];
    const amplitude = this.getParameter('amplitude');
    const frequency = this.getParameter('frequency');
    const octaves = this.getParameter('octaves');
    const persistence = this.getParameter('persistence');
    
    const noise = new SimplexNoise();
    
    for (let x = 0; x < width; x += resolution) {
      const noiseValue = noise.fractalNoise(x * frequency * 0.01, 0, octaves, persistence);
      const y = height / 2 + amplitude * noiseValue;
      points.push(new Point2D(x, y));
    }
    
    return points;
  }
  
  generateCompositeWave(width, height, resolution = 2) {
    const sineWave = this.generateSineWave(width, height, resolution);
    const noiseWave = this.generateNoiseWave(width, height, resolution);
    
    const composite = [];
    for (let i = 0; i < sineWave.length && i < noiseWave.length; i++) {
      composite.push(new Point2D(
        sineWave[i].x,
        (sineWave[i].y + noiseWave[i].y) / 2
      ));
    }
    
    return composite;
  }
}

// 螺旋图案生成器
class SpiralPattern extends ParametricPattern {
  constructor() {
    super();
    
    this.setParameter('innerRadius', 10, 0, 100);
    this.setParameter('spacing', 5, 1, 50);
    this.setParameter('turns', 5, 1, 20);
    this.setParameter('growth', 1, 0.1, 5);
    
    this.addFunction('archimedean', this.generateArchimedeanSpiral);
    this.addFunction('logarithmic', this.generateLogarithmicSpiral);
    this.addFunction('fermat', this.generateFermatSpiral);
  }
  
  generateArchimedeanSpiral(centerX, centerY, resolution = 0.1) {
    const points = [];
    const innerRadius = this.getParameter('innerRadius');
    const spacing = this.getParameter('spacing');
    const turns = this.getParameter('turns');
    
    for (let t = 0; t <= turns * Math.PI * 2; t += resolution) {
      const r = innerRadius + spacing * t / (Math.PI * 2);
      const x = centerX + r * Math.cos(t);
      const y = centerY + r * Math.sin(t);
      points.push(new Point2D(x, y));
    }
    
    return points;
  }
  
  generateLogarithmicSpiral(centerX, centerY, resolution = 0.1) {
    const points = [];
    const innerRadius = this.getParameter('innerRadius');
    const growth = this.getParameter('growth');
    const turns = this.getParameter('turns');
    
    for (let t = 0; t <= turns * Math.PI * 2; t += resolution) {
      const r = innerRadius * Math.exp(growth * t / (Math.PI * 2));
      const x = centerX + r * Math.cos(t);
      const y = centerY + r * Math.sin(t);
      points.push(new Point2D(x, y));
    }
    
    return points;
  }
  
  generateFermatSpiral(centerX, centerY, maxRadius = 200) {
    const points = [];
    const spacing = this.getParameter('spacing');
    const turns = this.getParameter('turns');
    
    for (let i = 0; i < turns * 100; i++) {
      const angle = i * 0.618034 * Math.PI * 2; // 黄金角
      const r = spacing * Math.sqrt(i);
      
      if (r > maxRadius) break;
      
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      points.push(new Point2D(x, y));
    }
    
    return points;
  }
}
```

## 分形图案

### 经典分形实现

```javascript
// 分形生成器基类
class FractalGenerator {
  constructor() {
    this.maxIterations = 100;
    this.threshold = 2;
  }
  
  setMaxIterations(iterations) {
    this.maxIterations = iterations;
    return this;
  }
  
  setThreshold(threshold) {
    this.threshold = threshold;
    return this;
  }
}

// Mandelbrot集
class MandelbrotSet extends FractalGenerator {
  constructor() {
    super();
    this.zoom = 1;
    this.centerX = -0.5;
    this.centerY = 0;
  }
  
  setView(centerX, centerY, zoom) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.zoom = zoom;
    return this;
  }
  
  // 计算点是否在Mandelbrot集中
  isInSet(x, y) {
    let zx = 0;
    let zy = 0;
    let iterations = 0;
    
    while (zx * zx + zy * zy < this.threshold * this.threshold && iterations < this.maxIterations) {
      const newZx = zx * zx - zy * zy + x;
      const newZy = 2 * zx * zy + y;
      zx = newZx;
      zy = newZy;
      iterations++;
    }
    
    return iterations;
  }
  
  // 生成Mandelbrot集图像
  generate(width, height) {
    const data = [];
    const xMin = this.centerX - 2 / this.zoom;
    const xMax = this.centerX + 2 / this.zoom;
    const yMin = this.centerY - 2 / this.zoom;
    const yMax = this.centerY + 2 / this.zoom;
    
    for (let py = 0; py < height; py++) {
      data[py] = [];
      for (let px = 0; px < width; px++) {
        const x = xMin + (px / width) * (xMax - xMin);
        const y = yMin + (py / height) * (yMax - yMin);
        data[py][px] = this.isInSet(x, y);
      }
    }
    
    return data;
  }
}

// Julia集
class JuliaSet extends FractalGenerator {
  constructor(cX = -0.7, cY = 0.27015) {
    super();
    this.cX = cX;
    this.cY = cY;
    this.zoom = 1;
    this.centerX = 0;
    this.centerY = 0;
  }
  
  setConstant(cX, cY) {
    this.cX = cX;
    this.cY = cY;
    return this;
  }
  
  setView(centerX, centerY, zoom) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.zoom = zoom;
    return this;
  }
  
  isInSet(x, y) {
    let zx = x;
    let zy = y;
    let iterations = 0;
    
    while (zx * zx + zy * zy < this.threshold * this.threshold && iterations < this.maxIterations) {
      const newZx = zx * zx - zy * zy + this.cX;
      const newZy = 2 * zx * zy + this.cY;
      zx = newZx;
      zy = newZy;
      iterations++;
    }
    
    return iterations;
  }
  
  generate(width, height) {
    const data = [];
    const xMin = this.centerX - 2 / this.zoom;
    const xMax = this.centerX + 2 / this.zoom;
    const yMin = this.centerY - 2 / this.zoom;
    const yMax = this.centerY + 2 / this.zoom;
    
    for (let py = 0; py < height; py++) {
      data[py] = [];
      for (let px = 0; px < width; px++) {
        const x = xMin + (px / width) * (xMax - xMin);
        const y = yMin + (py / height) * (yMax - yMin);
        data[py][px] = this.isInSet(x, y);
      }
    }
    
    return data;
  }
}

// L-System分形
class LSystem {
  constructor() {
    this.axiom = '';
    this.rules = new Map();
    this.iterations = 0;
    this.angle = Math.PI / 2;
    this.length = 10;
  }
  
  setAxiom(axiom) {
    this.axiom = axiom;
    return this;
  }
  
  addRule(symbol, replacement) {
    this.rules.set(symbol, replacement);
    return this;
  }
  
  setIterations(iterations) {
    this.iterations = iterations;
    return this;
  }
  
  setAngle(angle) {
    this.angle = angle;
    return this;
  }
  
  setLength(length) {
    this.length = length;
    return this;
  }
  
  // 生成字符串
  generate() {
    let current = this.axiom;
    
    for (let i = 0; i < this.iterations; i++) {
      let next = '';
      for (const char of current) {
        next += this.rules.get(char) || char;
      }
      current = next;
    }
    
    return current;
  }
  
  // 解释字符串为几何路径
  interpret(string, startX = 0, startY = 0, startAngle = 0) {
    const path = [];
    const stack = [];
    let x = startX;
    let y = startY;
    let angle = startAngle;
    
    path.push(new Point2D(x, y));
    
    for (const char of string) {
      switch (char) {
        case 'F':
        case 'G':
          // 向前移动并画线
          x += this.length * Math.cos(angle);
          y += this.length * Math.sin(angle);
          path.push(new Point2D(x, y));
          break;
        case 'f':
          // 向前移动不画线
          x += this.length * Math.cos(angle);
          y += this.length * Math.sin(angle);
          break;
        case '+':
          // 左转
          angle += this.angle;
          break;
        case '-':
          // 右转
          angle -= this.angle;
          break;
        case '[':
          // 保存状态
          stack.push({ x, y, angle });
          break;
        case ']':
          // 恢复状态
          if (stack.length > 0) {
            const state = stack.pop();
            x = state.x;
            y = state.y;
            angle = state.angle;
          }
          break;
      }
    }
    
    return path;
  }
  
  // 预定义的L-System模式
  static koch() {
    return new LSystem()
      .setAxiom('F')
      .addRule('F', 'F+F-F-F+F')
      .setAngle(Math.PI / 2)
      .setIterations(4);
  }
  
  static sierpinski() {
    return new LSystem()
      .setAxiom('F-G-G')
      .addRule('F', 'F-G+F+G-F')
      .addRule('G', 'GG')
      .setAngle(Math.PI * 2 / 3)
      .setIterations(5);
  }
  
  static dragon() {
    return new LSystem()
      .setAxiom('FX')
      .addRule('X', 'X+YF+')
      .addRule('Y', '-FX-Y')
      .setAngle(Math.PI / 2)
      .setIterations(10);
  }
  
  static plant() {
    return new LSystem()
      .setAxiom('X')
      .addRule('X', 'F+[[X]-X]-F[-FX]+X')
      .addRule('F', 'FF')
      .setAngle(Math.PI / 8)
      .setIterations(5);
  }
}
```

## Tessellation-Evolved 深度分析

### 核心动画系统

```javascript
// 基于tessellation-evolved.tsx的核心概念重建
class TessellationEvolved {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    
    // 动画状态
    this.time = 0;
    this.phase = 0;
    this.isAnimating = false;
    
    // 图案参数
    this.params = {
      complexity: 0.5,
      density: 0.3,
      evolution: 0,
      colorShift: 0,
      scale: 1,
      rotation: 0
    };
    
    // 演化阶段
    this.evolutionStages = [
      { name: 'birth', duration: 2000, color: '#ff6b6b' },
      { name: 'growth', duration: 3000, color: '#4ecdc4' },
      { name: 'maturity', duration: 4000, color: '#ffe66d' },
      { name: 'dissolution', duration: 2000, color: '#a8e6cf' }
    ];
    
    this.currentStage = 0;
    this.stageProgress = 0;
    
    this.setupGeometry();
  }
  
  setupGeometry() {
    // 创建基础几何形状
    this.baseShapes = [];
    
    // 六边形基础
    const hexRadius = 30;
    const hexCenter = new Point2D(this.width / 2, this.height / 2);
    
    for (let ring = 0; ring < 5; ring++) {
      const hexagons = this.createHexRing(hexCenter, hexRadius * (ring + 1), ring + 1);
      this.baseShapes.push(...hexagons);
    }
  }
  
  createHexRing(center, radius, ringIndex) {
    const hexagons = [];
    const hexCount = ringIndex === 0 ? 1 : 6 * ringIndex;
    
    if (ringIndex === 0) {
      // 中心六边形
      hexagons.push(this.createHexagon(center, radius));
    } else {
      // 环形六边形
      for (let i = 0; i < hexCount; i++) {
        const angle = (i / hexCount) * Math.PI * 2;
        const hexCenter = new Point2D(
          center.x + radius * Math.cos(angle),
          center.y + radius * Math.sin(angle)
        );
        hexagons.push(this.createHexagon(hexCenter, radius * 0.8));
      }
    }
    
    return hexagons;
  }
  
  createHexagon(center, radius) {
    const vertices = [];
    for (let i = 0; i < 6; i++) {
      const angle = i * Math.PI / 3;
      vertices.push(new Point2D(
        center.x + radius * Math.cos(angle),
        center.y + radius * Math.sin(angle)
      ));
    }
    
    return {
      center,
      radius,
      vertices,
      phase: Math.random() * Math.PI * 2,
      amplitude: Math.random() * 20 + 10
    };
  }
  
  // 演化函数
  evolve(deltaTime) {
    this.time += deltaTime;
    
    // 更新演化阶段
    const currentStageData = this.evolutionStages[this.currentStage];
    this.stageProgress += deltaTime / currentStageData.duration;
    
    if (this.stageProgress >= 1) {
      this.stageProgress = 0;
      this.currentStage = (this.currentStage + 1) % this.evolutionStages.length;
    }
    
    // 更新参数基于当前阶段
    this.updateParameters();
    
    // 变形几何图形
    this.morphShapes();
  }
  
  updateParameters() {
    const stage = this.evolutionStages[this.currentStage];
    const progress = this.stageProgress;
    
    switch (stage.name) {
      case 'birth':
        this.params.complexity = progress * 0.3;
        this.params.density = progress * 0.5;
        this.params.scale = 0.5 + progress * 0.5;
        break;
        
      case 'growth':
        this.params.complexity = 0.3 + progress * 0.4;
        this.params.density = 0.5 + progress * 0.3;
        this.params.scale = 1 + progress * 0.5;
        break;
        
      case 'maturity':
        this.params.complexity = 0.7 + Math.sin(progress * Math.PI * 4) * 0.2;
        this.params.density = 0.8 + Math.cos(progress * Math.PI * 3) * 0.1;
        this.params.rotation = progress * Math.PI * 2;
        break;
        
      case 'dissolution':
        this.params.complexity = 0.9 - progress * 0.7;
        this.params.density = 0.9 - progress * 0.6;
        this.params.scale = 1.5 - progress * 1;
        break;
    }
    
    this.params.colorShift = this.time * 0.001;
  }
  
  morphShapes() {
    const time = this.time * 0.001;
    
    this.baseShapes.forEach((shape, index) => {
      const phaseOffset = shape.phase + index * 0.1;
      
      // 应用各种变形
      const scale = 1 + Math.sin(time * 2 + phaseOffset) * this.params.complexity * 0.3;
      const rotation = time * 0.5 + phaseOffset + this.params.rotation;
      const pulse = Math.sin(time * 3 + phaseOffset) * shape.amplitude * this.params.density;
      
      // 重新计算顶点
      shape.morphedVertices = shape.vertices.map((vertex, vIndex) => {
        const angle = vIndex * Math.PI / 3 + rotation;
        const distance = (shape.radius + pulse) * scale * this.params.scale;
        
        return new Point2D(
          shape.center.x + distance * Math.cos(angle),
          shape.center.y + distance * Math.sin(angle)
        );
      });
    });
  }
  
  render() {
    // 清除画布
    this.ctx.fillStyle = '#000011';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // 渲染形状
    this.baseShapes.forEach((shape, index) => {
      this.renderShape(shape, index);
    });
    
    // 渲染连接线
    this.renderConnections();
    
    // 渲染粒子效果
    this.renderParticles();
    
    // 渲染信息
    this.renderInfo();
  }
  
  renderShape(shape, index) {
    if (!shape.morphedVertices) return;
    
    const stage = this.evolutionStages[this.currentStage];
    const progress = this.stageProgress;
    
    // 计算颜色
    const hue = (index * 30 + this.params.colorShift * 60) % 360;
    const saturation = 70 + Math.sin(this.time * 0.002 + index) * 20;
    const lightness = 40 + progress * 30;
    const alpha = 0.6 + Math.sin(this.time * 0.003 + index) * 0.3;
    
    this.ctx.save();
    
    // 绘制填充
    this.ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
    this.ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness + 20}%, 0.8)`;
    this.ctx.lineWidth = 1 + this.params.complexity * 2;
    
    this.ctx.beginPath();
    shape.morphedVertices.forEach((vertex, i) => {
      if (i === 0) {
        this.ctx.moveTo(vertex.x, vertex.y);
      } else {
        this.ctx.lineTo(vertex.x, vertex.y);
      }
    });
    this.ctx.closePath();
    
    this.ctx.fill();
    this.ctx.stroke();
    
    // 添加光晕效果
    if (this.params.complexity > 0.5) {
      this.ctx.shadowColor = `hsla(${hue}, 100%, 60%, 0.5)`;
      this.ctx.shadowBlur = 10 * this.params.complexity;
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }
  
  renderConnections() {
    if (this.params.density < 0.3) return;
    
    this.ctx.strokeStyle = `rgba(255, 255, 255, ${this.params.density * 0.3})`;
    this.ctx.lineWidth = 0.5;
    
    // 连接相邻的形状中心
    for (let i = 0; i < this.baseShapes.length; i++) {
      for (let j = i + 1; j < this.baseShapes.length; j++) {
        const shape1 = this.baseShapes[i];
        const shape2 = this.baseShapes[j];
        const distance = shape1.center.distanceTo(shape2.center);
        
        if (distance < 100 * this.params.scale) {
          const alpha = 1 - distance / (100 * this.params.scale);
          this.ctx.globalAlpha = alpha * this.params.density;
          
          this.ctx.beginPath();
          this.ctx.moveTo(shape1.center.x, shape1.center.y);
          this.ctx.lineTo(shape2.center.x, shape2.center.y);
          this.ctx.stroke();
        }
      }
    }
    
    this.ctx.globalAlpha = 1;
  }
  
  renderParticles() {
    if (this.params.evolution < 0.7) return;
    
    const particleCount = Math.floor(this.params.complexity * 50);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + this.time * 0.001;
      const radius = 100 + Math.sin(this.time * 0.002 + i) * 50;
      
      const x = this.width / 2 + radius * Math.cos(angle);
      const y = this.height / 2 + radius * Math.sin(angle);
      
      const size = 2 + Math.sin(this.time * 0.005 + i) * 3;
      const hue = (i * 20 + this.params.colorShift * 30) % 360;
      
      this.ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.7)`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  renderInfo() {
    const stage = this.evolutionStages[this.currentStage];
    
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.font = '16px Arial';
    this.ctx.fillText(`Stage: ${stage.name}`, 20, 30);
    this.ctx.fillText(`Progress: ${Math.round(this.stageProgress * 100)}%`, 20, 50);
    this.ctx.fillText(`Complexity: ${Math.round(this.params.complexity * 100)}%`, 20, 70);
  }
  
  // 动画循环
  animate(currentTime) {
    if (!this.isAnimating) return;
    
    const deltaTime = currentTime - (this.lastTime || currentTime);
    this.lastTime = currentTime;
    
    this.evolve(deltaTime);
    this.render();
    
    requestAnimationFrame((time) => this.animate(time));
  }
  
  start() {
    this.isAnimating = true;
    this.animate(0);
  }
  
  stop() {
    this.isAnimating = false;
  }
}
```

## 实践项目：图案生成器

### 创建交互式图案生成工具

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>复杂图案生成器</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: #1a1a1a;
            color: white;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .controls {
            margin-bottom: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            background: #2a2a2a;
            padding: 20px;
            border-radius: 8px;
        }
        
        .control-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        label {
            font-size: 12px;
            opacity: 0.8;
        }
        
        input[type="range"] {
            width: 100%;
        }
        
        button {
            padding: 8px 16px;
            border: none;
            background: #4CAF50;
            color: white;
            border-radius: 4px;
            cursor: pointer;
        }
        
        button:hover {
            background: #45a049;
        }
        
        canvas {
            border: 2px solid #333;
            background: #000;
            display: block;
            margin: 0 auto;
        }
        
        .info {
            margin-top: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .info-panel {
            background: #2a2a2a;
            padding: 15px;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌀 复杂图案生成器</h1>
        
        <div class="controls">
            <div class="control-group">
                <label>图案类型</label>
                <select id="patternType">
                    <option value="tessellation">镶嵌图案</option>
                    <option value="mandelbrot">Mandelbrot集</option>
                    <option value="julia">Julia集</option>
                    <option value="lsystem">L-System</option>
                    <option value="spiral">螺旋图案</option>
                </select>
            </div>
            
            <div class="control-group">
                <label>复杂度: <span id="complexity-value">50</span>%</label>
                <input type="range" id="complexity" min="0" max="100" value="50">
            </div>
            
            <div class="control-group">
                <label>密度: <span id="density-value">30</span>%</label>
                <input type="range" id="density" min="0" max="100" value="30">
            </div>
            
            <div class="control-group">
                <label>颜色偏移: <span id="color-value">0</span></label>
                <input type="range" id="colorShift" min="0" max="360" value="0">
            </div>
            
            <div class="control-group">
                <label>缩放: <span id="scale-value">100</span>%</label>
                <input type="range" id="scale" min="10" max="300" value="100">
            </div>
            
            <div class="control-group">
                <label>动画速度: <span id="speed-value">50</span>%</label>
                <input type="range" id="animSpeed" min="0" max="100" value="50">
            </div>
            
            <div class="control-group">
                <button onclick="generator.regenerate()">重新生成</button>
                <button onclick="generator.toggleAnimation()" id="animBtn">开始动画</button>
            </div>
            
            <div class="control-group">
                <button onclick="generator.exportImage()">导出图片</button>
                <button onclick="generator.randomize()">随机参数</button>
            </div>
        </div>
        
        <canvas id="canvas" width="1000" height="600"></canvas>
        
        <div class="info">
            <div class="info-panel">
                <h3>当前设置</h3>
                <p>图案: <span id="current-pattern">镶嵌图案</span></p>
                <p>渲染时间: <span id="render-time">0</span>ms</p>
                <p>图形数量: <span id="shape-count">0</span></p>
            </div>
            
            <div class="info-panel">
                <h3>操作说明</h3>
                <ul>
                    <li>调整滑块改变图案参数</li>
                    <li>选择不同的图案类型</li>
                    <li>点击画布缩放视图</li>
                    <li>使用鼠标滚轮缩放</li>
                </ul>
            </div>
            
            <div class="info-panel">
                <h3>性能监控</h3>
                <p>FPS: <span id="fps">0</span></p>
                <p>内存使用: <span id="memory">0</span>MB</p>
                <p>GPU加速: <span id="gpu">检测中...</span></p>
            </div>
        </div>
    </div>

    <script>
        class PatternGenerator {
            constructor(canvas) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
                this.width = canvas.width;
                this.height = canvas.height;
                
                this.isAnimating = false;
                this.frameCount = 0;
                this.lastFpsTime = performance.now();
                
                this.patterns = {
                    tessellation: new TessellationEvolved(canvas),
                    mandelbrot: new MandelbrotSet(),
                    julia: new JuliaSet(),
                    lsystem: LSystem.koch(),
                    spiral: new SpiralPattern()
                };
                
                this.currentPattern = 'tessellation';
                this.setupControls();
                this.setupInteraction();
            }
            
            setupControls() {
                const controls = ['complexity', 'density', 'colorShift', 'scale', 'animSpeed'];
                
                controls.forEach(control => {
                    const slider = document.getElementById(control);
                    const display = document.getElementById(control + '-value');
                    
                    slider.addEventListener('input', (e) => {
                        const value = e.target.value;
                        display.textContent = control === 'scale' ? value + '%' : 
                                            control === 'colorShift' ? value : value + '%';
                        this.updateParameters();
                    });
                });
                
                document.getElementById('patternType').addEventListener('change', (e) => {
                    this.currentPattern = e.target.value;
                    document.getElementById('current-pattern').textContent = 
                        e.target.options[e.target.selectedIndex].text;
                    this.regenerate();
                });
            }
            
            setupInteraction() {
                this.canvas.addEventListener('click', (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    this.handleCanvasClick(x, y);
                });
                
                this.canvas.addEventListener('wheel', (e) => {
                    e.preventDefault();
                    const zoom = e.deltaY > 0 ? 0.9 : 1.1;
                    this.updateZoom(zoom);
                });
            }
            
            updateParameters() {
                const params = {
                    complexity: document.getElementById('complexity').value / 100,
                    density: document.getElementById('density').value / 100,
                    colorShift: document.getElementById('colorShift').value,
                    scale: document.getElementById('scale').value / 100,
                    animSpeed: document.getElementById('animSpeed').value / 100
                };
                
                const pattern = this.patterns[this.currentPattern];
                if (pattern.setParameters) {
                    pattern.setParameters(params);
                }
            }
            
            regenerate() {
                const startTime = performance.now();
                
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(0, 0, this.width, this.height);
                
                const pattern = this.patterns[this.currentPattern];
                
                switch (this.currentPattern) {
                    case 'tessellation':
                        pattern.setupGeometry();
                        pattern.render();
                        break;
                        
                    case 'mandelbrot':
                        this.renderFractal(pattern);
                        break;
                        
                    case 'julia':
                        this.renderFractal(pattern);
                        break;
                        
                    case 'lsystem':
                        this.renderLSystem(pattern);
                        break;
                        
                    case 'spiral':
                        this.renderSpiral(pattern);
                        break;
                }
                
                const renderTime = performance.now() - startTime;
                document.getElementById('render-time').textContent = Math.round(renderTime);
            }
            
            renderFractal(fractal) {
                const data = fractal.generate(this.width / 2, this.height / 2);
                const imageData = this.ctx.createImageData(this.width, this.height);
                
                for (let y = 0; y < data.length; y++) {
                    for (let x = 0; x < data[y].length; x++) {
                        const iterations = data[y][x];
                        const pixelIndex = (y * this.width + x) * 4;
                        
                        if (iterations === fractal.maxIterations) {
                            imageData.data[pixelIndex] = 0;
                            imageData.data[pixelIndex + 1] = 0;
                            imageData.data[pixelIndex + 2] = 0;
                        } else {
                            const hue = (iterations * 10 + parseInt(document.getElementById('colorShift').value)) % 360;
                            const [r, g, b] = this.hslToRgb(hue / 360, 0.7, 0.5);
                            imageData.data[pixelIndex] = r;
                            imageData.data[pixelIndex + 1] = g;
                            imageData.data[pixelIndex + 2] = b;
                        }
                        imageData.data[pixelIndex + 3] = 255;
                    }
                }
                
                this.ctx.putImageData(imageData, 0, 0);
            }
            
            hslToRgb(h, s, l) {
                let r, g, b;
                
                if (s === 0) {
                    r = g = b = l;
                } else {
                    const hue2rgb = (p, q, t) => {
                        if (t < 0) t += 1;
                        if (t > 1) t -= 1;
                        if (t < 1/6) return p + (q - p) * 6 * t;
                        if (t < 1/2) return q;
                        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                        return p;
                    };
                    
                    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    const p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1/3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1/3);
                }
                
                return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
            }
            
            toggleAnimation() {
                this.isAnimating = !this.isAnimating;
                const btn = document.getElementById('animBtn');
                btn.textContent = this.isAnimating ? '停止动画' : '开始动画';
                
                if (this.isAnimating) {
                    this.animate();
                }
            }
            
            animate() {
                if (!this.isAnimating) return;
                
                this.frameCount++;
                const now = performance.now();
                if (now - this.lastFpsTime >= 1000) {
                    document.getElementById('fps').textContent = this.frameCount;
                    this.frameCount = 0;
                    this.lastFpsTime = now;
                }
                
                if (this.currentPattern === 'tessellation') {
                    this.patterns.tessellation.animate(now);
                } else {
                    this.regenerate();
                }
                
                if (this.isAnimating) {
                    requestAnimationFrame(() => this.animate());
                }
            }
            
            randomize() {
                document.getElementById('complexity').value = Math.random() * 100;
                document.getElementById('density').value = Math.random() * 100;
                document.getElementById('colorShift').value = Math.random() * 360;
                document.getElementById('scale').value = 50 + Math.random() * 150;
                
                // 更新显示值
                ['complexity', 'density', 'colorShift', 'scale'].forEach(control => {
                    const slider = document.getElementById(control);
                    const display = document.getElementById(control + '-value');
                    const value = slider.value;
                    display.textContent = control === 'scale' ? value + '%' : 
                                        control === 'colorShift' ? value : value + '%';
                });
                
                this.updateParameters();
                this.regenerate();
            }
            
            exportImage() {
                const link = document.createElement('a');
                link.download = `pattern-${this.currentPattern}-${Date.now()}.png`;
                link.href = this.canvas.toDataURL();
                link.click();
            }
        }
        
        // 初始化生成器
        const canvas = document.getElementById('canvas');
        const generator = new PatternGenerator(canvas);
        generator.regenerate();
        
        console.log('复杂图案生成器已加载！');
        console.log('尝试不同的图案类型和参数组合');
    </script>
</body>
</html>
```

## 作业

1. 完成复杂图案生成器项目
2. 实现自定义L-System规则编辑器
3. 创建交互式分形缩放查看器
4. 分析并重构tessellation-evolved.tsx
5. 设计自己的演化图案算法

## 课程总结

通过这10课的学习，你已经掌握了：

- 完整的前端开发技术栈
- Canvas API和动画编程
- React和现代JavaScript开发
- 数学图形编程基础
- 复杂图案生成算法

现在你具备了理解和创建类似tessellation-evolved.tsx这样复杂动画项目的能力！
