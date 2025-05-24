# 第9课：图形数学

## 学习目标

- 掌握二维和三维空间的数学基础
- 理解向量、矩阵和变换的概念
- 学会使用三角函数创建动画效果
- 理解tessellation-evolved.tsx中的数学原理
- 为复杂图形编程打下基础

## 基础数学概念

### 坐标系统

```javascript
// 2D坐标系
class Point2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  
  // 距离计算
  distanceTo(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  // 中点计算
  midpointTo(other) {
    return new Point2D(
      (this.x + other.x) / 2,
      (this.y + other.y) / 2
    );
  }
  
  // 复制
  clone() {
    return new Point2D(this.x, this.y);
  }
  
  // 字符串表示
  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

// 极坐标系转换
function polarToCartesian(r, theta) {
  return new Point2D(
    r * Math.cos(theta),
    r * Math.sin(theta)
  );
}

function cartesianToPolar(x, y) {
  const r = Math.sqrt(x * x + y * y);
  const theta = Math.atan2(y, x);
  return { r, theta };
}

// 示例：创建圆形上的点
function createCirclePoints(centerX, centerY, radius, numPoints) {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const point = polarToCartesian(radius, angle);
    points.push(new Point2D(
      centerX + point.x,
      centerY + point.y
    ));
  }
  return points;
}
```

### 向量运算

```javascript
class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  
  // 向量加法
  add(other) {
    return new Vector2D(this.x + other.x, this.y + other.y);
  }
  
  // 向量减法
  subtract(other) {
    return new Vector2D(this.x - other.x, this.y - other.y);
  }
  
  // 标量乘法
  multiply(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }
  
  // 向量长度（模长）
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  
  // 向量归一化
  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return new Vector2D(0, 0);
    return new Vector2D(this.x / mag, this.y / mag);
  }
  
  // 点积
  dot(other) {
    return this.x * other.x + this.y * other.y;
  }
  
  // 叉积（2D中返回标量）
  cross(other) {
    return this.x * other.y - this.y * other.x;
  }
  
  // 向量夹角
  angleTo(other) {
    const dot = this.dot(other);
    const mags = this.magnitude() * other.magnitude();
    return Math.acos(dot / mags);
  }
  
  // 旋转向量
  rotate(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2D(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }
  
  // 反射向量
  reflect(normal) {
    // v - 2 * (v · n) * n
    const dot = this.dot(normal);
    return this.subtract(normal.multiply(2 * dot));
  }
  
  // 向量插值
  lerp(other, t) {
    return new Vector2D(
      this.x + (other.x - this.x) * t,
      this.y + (other.y - this.y) * t
    );
  }
  
  // 转换为极坐标
  toPolar() {
    return cartesianToPolar(this.x, this.y);
  }
  
  // 静态方法：从角度创建单位向量
  static fromAngle(angle) {
    return new Vector2D(Math.cos(angle), Math.sin(angle));
  }
  
  // 静态方法：随机单位向量
  static random() {
    const angle = Math.random() * Math.PI * 2;
    return Vector2D.fromAngle(angle);
  }
}

// 向量应用示例：物理模拟
class Particle {
  constructor(x, y) {
    this.position = new Vector2D(x, y);
    this.velocity = new Vector2D(0, 0);
    this.acceleration = new Vector2D(0, 0);
    this.mass = 1;
  }
  
  applyForce(force) {
    // F = ma, so a = F/m
    const accel = force.multiply(1 / this.mass);
    this.acceleration = this.acceleration.add(accel);
  }
  
  update(deltaTime) {
    // 更新速度
    this.velocity = this.velocity.add(this.acceleration.multiply(deltaTime));
    
    // 更新位置
    this.position = this.position.add(this.velocity.multiply(deltaTime));
    
    // 重置加速度
    this.acceleration = new Vector2D(0, 0);
  }
  
  bounceOffWalls(width, height) {
    if (this.position.x < 0 || this.position.x > width) {
      this.velocity.x *= -0.8; // 能量损失
    }
    if (this.position.y < 0 || this.position.y > height) {
      this.velocity.y *= -0.8;
    }
    
    this.position.x = Math.max(0, Math.min(width, this.position.x));
    this.position.y = Math.max(0, Math.min(height, this.position.y));
  }
}
```

## 三角函数与周期运动

### 基础三角函数

```javascript
// 三角函数工具类
class Trigonometry {
  // 角度转弧度
  static degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  // 弧度转角度
  static radToDeg(radians) {
    return radians * (180 / Math.PI);
  }
  
  // 正弦波生成器
  static sineWave(time, amplitude = 1, frequency = 1, phase = 0) {
    return amplitude * Math.sin(frequency * time + phase);
  }
  
  // 余弦波生成器
  static cosineWave(time, amplitude = 1, frequency = 1, phase = 0) {
    return amplitude * Math.cos(frequency * time + phase);
  }
  
  // 锯齿波
  static sawtoothWave(time, period = 1) {
    return 2 * (time / period - Math.floor(time / period + 0.5));
  }
  
  // 方波
  static squareWave(time, period = 1) {
    return Math.sin(time * 2 * Math.PI / period) >= 0 ? 1 : -1;
  }
  
  // 三角波
  static triangleWave(time, period = 1) {
    const t = time / period;
    return 2 * Math.abs(2 * (t - Math.floor(t + 0.5))) - 1;
  }
}

// 周期运动示例
class OscillatingObject {
  constructor(x, y) {
    this.basePosition = new Vector2D(x, y);
    this.position = new Vector2D(x, y);
    this.time = 0;
    
    // 振荡参数
    this.amplitude = { x: 50, y: 30 };
    this.frequency = { x: 0.02, y: 0.03 };
    this.phase = { x: 0, y: Math.PI / 4 };
  }
  
  update(deltaTime) {
    this.time += deltaTime;
    
    // 使用三角函数创建振荡运动
    const offsetX = Trigonometry.sineWave(
      this.time, 
      this.amplitude.x, 
      this.frequency.x, 
      this.phase.x
    );
    
    const offsetY = Trigonometry.cosineWave(
      this.time, 
      this.amplitude.y, 
      this.frequency.y, 
      this.phase.y
    );
    
    this.position = new Vector2D(
      this.basePosition.x + offsetX,
      this.basePosition.y + offsetY
    );
  }
}

// 复杂波形组合
class ComplexWave {
  constructor() {
    this.waves = [
      { amplitude: 50, frequency: 0.01, phase: 0 },
      { amplitude: 25, frequency: 0.02, phase: Math.PI / 3 },
      { amplitude: 12, frequency: 0.04, phase: Math.PI / 2 }
    ];
  }
  
  getValue(time) {
    return this.waves.reduce((sum, wave) => {
      return sum + Trigonometry.sineWave(
        time, 
        wave.amplitude, 
        wave.frequency, 
        wave.phase
      );
    }, 0);
  }
  
  // 生成波形路径
  generatePath(startTime, endTime, steps) {
    const path = [];
    const timeStep = (endTime - startTime) / steps;
    
    for (let i = 0; i <= steps; i++) {
      const time = startTime + i * timeStep;
      const value = this.getValue(time);
      path.push(new Point2D(time, value));
    }
    
    return path;
  }
}
```

### 旋转与变换

```javascript
// 2D变换矩阵
class Matrix2D {
  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    this.a = a;   // 缩放X
    this.b = b;   // 倾斜Y
    this.c = c;   // 倾斜X
    this.d = d;   // 缩放Y
    this.tx = tx; // 平移X
    this.ty = ty; // 平移Y
  }
  
  // 矩阵乘法
  multiply(other) {
    return new Matrix2D(
      this.a * other.a + this.b * other.c,
      this.a * other.b + this.b * other.d,
      this.c * other.a + this.d * other.c,
      this.c * other.b + this.d * other.d,
      this.tx * other.a + this.ty * other.c + other.tx,
      this.tx * other.b + this.ty * other.d + other.ty
    );
  }
  
  // 应用变换到点
  transformPoint(point) {
    return new Point2D(
      this.a * point.x + this.c * point.y + this.tx,
      this.b * point.x + this.d * point.y + this.ty
    );
  }
  
  // 平移变换
  static translate(x, y) {
    return new Matrix2D(1, 0, 0, 1, x, y);
  }
  
  // 旋转变换
  static rotate(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Matrix2D(cos, sin, -sin, cos, 0, 0);
  }
  
  // 缩放变换
  static scale(sx, sy = sx) {
    return new Matrix2D(sx, 0, 0, sy, 0, 0);
  }
  
  // 单位矩阵
  static identity() {
    return new Matrix2D();
  }
  
  // 逆矩阵
  invert() {
    const det = this.a * this.d - this.b * this.c;
    if (Math.abs(det) < 1e-10) {
      throw new Error('Matrix is not invertible');
    }
    
    return new Matrix2D(
      this.d / det,
      -this.b / det,
      -this.c / det,
      this.a / det,
      (this.c * this.ty - this.d * this.tx) / det,
      (this.b * this.tx - this.a * this.ty) / det
    );
  }
}

// 变换序列管理器
class Transform2D {
  constructor() {
    this.matrix = Matrix2D.identity();
  }
  
  translate(x, y) {
    this.matrix = this.matrix.multiply(Matrix2D.translate(x, y));
    return this;
  }
  
  rotate(angle) {
    this.matrix = this.matrix.multiply(Matrix2D.rotate(angle));
    return this;
  }
  
  scale(sx, sy = sx) {
    this.matrix = this.matrix.multiply(Matrix2D.scale(sx, sy));
    return this;
  }
  
  reset() {
    this.matrix = Matrix2D.identity();
    return this;
  }
  
  transformPoint(point) {
    return this.matrix.transformPoint(point);
  }
  
  transformPoints(points) {
    return points.map(point => this.transformPoint(point));
  }
}
```

## 几何形状与路径

### 基本几何形状

```javascript
// 圆形
class Circle {
  constructor(center, radius) {
    this.center = center;
    this.radius = radius;
  }
  
  // 检查点是否在圆内
  contains(point) {
    return this.center.distanceTo(point) <= this.radius;
  }
  
  // 获取圆周上的点
  getPointAt(angle) {
    return new Point2D(
      this.center.x + this.radius * Math.cos(angle),
      this.center.y + this.radius * Math.sin(angle)
    );
  }
  
  // 生成圆形路径
  generatePath(segments = 32) {
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(this.getPointAt(angle));
    }
    return points;
  }
  
  // 圆与圆的碰撞检测
  intersects(other) {
    const distance = this.center.distanceTo(other.center);
    return distance <= (this.radius + other.radius);
  }
}

// 矩形
class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  
  // 获取中心点
  get center() {
    return new Point2D(
      this.x + this.width / 2,
      this.y + this.height / 2
    );
  }
  
  // 检查点是否在矩形内
  contains(point) {
    return point.x >= this.x && 
           point.x <= this.x + this.width &&
           point.y >= this.y && 
           point.y <= this.y + this.height;
  }
  
  // 矩形与矩形的碰撞检测
  intersects(other) {
    return !(this.x + this.width < other.x ||
             other.x + other.width < this.x ||
             this.y + this.height < other.y ||
             other.y + other.height < this.y);
  }
  
  // 获取矩形的四个顶点
  getVertices() {
    return [
      new Point2D(this.x, this.y),
      new Point2D(this.x + this.width, this.y),
      new Point2D(this.x + this.width, this.y + this.height),
      new Point2D(this.x, this.y + this.height)
    ];
  }
}

// 多边形
class Polygon {
  constructor(vertices) {
    this.vertices = vertices || [];
  }
  
  // 添加顶点
  addVertex(point) {
    this.vertices.push(point);
  }
  
  // 计算多边形面积
  getArea() {
    if (this.vertices.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < this.vertices.length; i++) {
      const j = (i + 1) % this.vertices.length;
      area += this.vertices[i].x * this.vertices[j].y;
      area -= this.vertices[j].x * this.vertices[i].y;
    }
    return Math.abs(area) / 2;
  }
  
  // 计算重心
  getCentroid() {
    if (this.vertices.length === 0) return new Point2D(0, 0);
    
    let x = 0, y = 0;
    for (const vertex of this.vertices) {
      x += vertex.x;
      y += vertex.y;
    }
    
    return new Point2D(
      x / this.vertices.length,
      y / this.vertices.length
    );
  }
  
  // 点是否在多边形内（射线法）
  contains(point) {
    let inside = false;
    for (let i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
      if (((this.vertices[i].y > point.y) !== (this.vertices[j].y > point.y)) &&
          (point.x < (this.vertices[j].x - this.vertices[i].x) * 
           (point.y - this.vertices[i].y) / (this.vertices[j].y - this.vertices[i].y) + this.vertices[i].x)) {
        inside = !inside;
      }
    }
    return inside;
  }
  
  // 创建正多边形
  static regular(center, radius, sides) {
    const vertices = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      vertices.push(new Point2D(
        center.x + radius * Math.cos(angle),
        center.y + radius * Math.sin(angle)
      ));
    }
    return new Polygon(vertices);
  }
}
```

### 曲线和路径

```javascript
// 贝塞尔曲线
class BezierCurve {
  constructor(p0, p1, p2, p3) {
    this.p0 = p0; // 起点
    this.p1 = p1; // 控制点1
    this.p2 = p2; // 控制点2
    this.p3 = p3; // 终点
  }
  
  // 获取曲线上t位置的点（t从0到1）
  getPointAt(t) {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;
    
    return new Point2D(
      mt3 * this.p0.x + 3 * mt2 * t * this.p1.x + 3 * mt * t2 * this.p2.x + t3 * this.p3.x,
      mt3 * this.p0.y + 3 * mt2 * t * this.p1.y + 3 * mt * t2 * this.p2.y + t3 * this.p3.y
    );
  }
  
  // 获取t位置的切线向量
  getTangentAt(t) {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const t2 = t * t;
    
    return new Vector2D(
      3 * mt2 * (this.p1.x - this.p0.x) + 6 * mt * t * (this.p2.x - this.p1.x) + 3 * t2 * (this.p3.x - this.p2.x),
      3 * mt2 * (this.p1.y - this.p0.y) + 6 * mt * t * (this.p2.y - this.p1.y) + 3 * t2 * (this.p3.y - this.p2.y)
    );
  }
  
  // 生成曲线路径
  generatePath(segments = 50) {
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      points.push(this.getPointAt(t));
    }
    return points;
  }
  
  // 二次贝塞尔曲线
  static quadratic(p0, p1, p2, t) {
    const mt = 1 - t;
    return new Point2D(
      mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
      mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
    );
  }
}

// 路径管理器
class Path {
  constructor() {
    this.points = [];
    this.closed = false;
  }
  
  moveTo(x, y) {
    this.points = [new Point2D(x, y)];
    return this;
  }
  
  lineTo(x, y) {
    this.points.push(new Point2D(x, y));
    return this;
  }
  
  quadraticCurveTo(cp1x, cp1y, x, y, segments = 20) {
    if (this.points.length === 0) return this;
    
    const start = this.points[this.points.length - 1];
    const control = new Point2D(cp1x, cp1y);
    const end = new Point2D(x, y);
    
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const point = BezierCurve.quadratic(start, control, end, t);
      this.points.push(point);
    }
    
    return this;
  }
  
  arc(centerX, centerY, radius, startAngle, endAngle, segments = 20) {
    const angleStep = (endAngle - startAngle) / segments;
    
    for (let i = 0; i <= segments; i++) {
      const angle = startAngle + i * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      this.points.push(new Point2D(x, y));
    }
    
    return this;
  }
  
  closePath() {
    this.closed = true;
    if (this.points.length > 0) {
      this.points.push(this.points[0].clone());
    }
    return this;
  }
  
  getLength() {
    let length = 0;
    for (let i = 1; i < this.points.length; i++) {
      length += this.points[i - 1].distanceTo(this.points[i]);
    }
    return length;
  }
  
  // 获取路径上距离为distance的点
  getPointAtDistance(distance) {
    let currentDistance = 0;
    
    for (let i = 1; i < this.points.length; i++) {
      const segmentLength = this.points[i - 1].distanceTo(this.points[i]);
      
      if (currentDistance + segmentLength >= distance) {
        const t = (distance - currentDistance) / segmentLength;
        return new Point2D(
          this.points[i - 1].x + t * (this.points[i].x - this.points[i - 1].x),
          this.points[i - 1].y + t * (this.points[i].y - this.points[i - 1].y)
        );
      }
      
      currentDistance += segmentLength;
    }
    
    return this.points[this.points.length - 1].clone();
  }
}
```

## 噪声与随机性

### 柏林噪声（简化版）

```javascript
class SimplexNoise {
  constructor(seed = Math.random()) {
    this.p = [];
    this.permutation = [];
    
    // 初始化排列表
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i;
    }
    
    // 根据种子打乱
    let random = this.seededRandom(seed);
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
    }
    
    // 复制排列表
    for (let i = 0; i < 512; i++) {
      this.p[i] = this.permutation[i & 255];
    }
  }
  
  seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return () => {
      x = Math.sin(x) * 10000;
      return x - Math.floor(x);
    };
  }
  
  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  
  lerp(a, b, t) {
    return a + t * (b - a);
  }
  
  grad(hash, x, y) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
  
  noise(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    
    const u = this.fade(x);
    const v = this.fade(y);
    
    const a = this.p[X] + Y;
    const aa = this.p[a];
    const ab = this.p[a + 1];
    const b = this.p[X + 1] + Y;
    const ba = this.p[b];
    const bb = this.p[b + 1];
    
    return this.lerp(
      this.lerp(
        this.grad(this.p[aa], x, y),
        this.grad(this.p[ba], x - 1, y),
        u
      ),
      this.lerp(
        this.grad(this.p[ab], x, y - 1),
        this.grad(this.p[bb], x - 1, y - 1),
        u
      ),
      v
    );
  }
  
  // 分形噪声
  fractalNoise(x, y, octaves = 4, persistence = 0.5) {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;
    
    for (let i = 0; i < octaves; i++) {
      value += this.noise(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }
    
    return value / maxValue;
  }
}

// 噪声应用示例
class NoiseField {
  constructor(width, height, scale = 0.01) {
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.noise = new SimplexNoise();
    this.field = [];
    
    this.generateField();
  }
  
  generateField() {
    this.field = [];
    for (let y = 0; y < this.height; y++) {
      this.field[y] = [];
      for (let x = 0; x < this.width; x++) {
        const noiseValue = this.noise.fractalNoise(x * this.scale, y * this.scale);
        this.field[y][x] = noiseValue;
      }
    }
  }
  
  getValueAt(x, y) {
    x = Math.max(0, Math.min(this.width - 1, Math.floor(x)));
    y = Math.max(0, Math.min(this.height - 1, Math.floor(y)));
    return this.field[y][x];
  }
  
  getVectorAt(x, y) {
    const angle = this.getValueAt(x, y) * Math.PI * 2;
    return Vector2D.fromAngle(angle);
  }
}
```

## 实践项目：数学图形可视化器

### 创建交互式数学图形演示

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>数学图形可视化器</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: #1a1a1a;
            color: white;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .controls {
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: center;
        }
        
        button {
            padding: 10px 20px;
            border: none;
            background: #4CAF50;
            color: white;
            border-radius: 4px;
            cursor: pointer;
        }
        
        button:hover {
            background: #45a049;
        }
        
        input[type="range"] {
            width: 100px;
        }
        
        label {
            margin-left: 10px;
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
        <h1>🔢 数学图形可视化器</h1>
        
        <div class="controls">
            <button onclick="demo.drawSineWave()">正弦波</button>
            <button onclick="demo.drawLissajous()">李萨如图形</button>
            <button onclick="demo.drawSpiral()">螺旋线</button>
            <button onclick="demo.drawRose()">玫瑰曲线</button>
            <button onclick="demo.drawFractal()">分形图案</button>
            <button onclick="demo.drawVectorField()">向量场</button>
            <button onclick="demo.clear()">清除</button>
            
            <label>
                频率: <input type="range" id="frequency" min="0.1" max="5" step="0.1" value="1">
                <span id="freq-value">1</span>
            </label>
            
            <label>
                振幅: <input type="range" id="amplitude" min="10" max="100" step="5" value="50">
                <span id="amp-value">50</span>
            </label>
        </div>
        
        <canvas id="canvas" width="800" height="600"></canvas>
        
        <div class="info">
            <div class="info-panel">
                <h3>当前参数</h3>
                <p>频率: <span id="current-freq">1</span></p>
                <p>振幅: <span id="current-amp">50</span></p>
                <p>鼠标位置: <span id="mouse-pos">(0, 0)</span></p>
            </div>
            
            <div class="info-panel">
                <h3>数学公式</h3>
                <p id="formula">y = A × sin(f × x)</p>
            </div>
            
            <div class="info-panel">
                <h3>说明</h3>
                <p id="description">正弦波是最基本的周期函数</p>
            </div>
        </div>
    </div>

    <script>
        class MathVisualization {
            constructor(canvas) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
                this.width = canvas.width;
                this.height = canvas.height;
                this.centerX = this.width / 2;
                this.centerY = this.height / 2;
                
                this.setupControls();
                this.setupMouseTracking();
            }
            
            setupControls() {
                const freqSlider = document.getElementById('frequency');
                const ampSlider = document.getElementById('amplitude');
                
                freqSlider.addEventListener('input', (e) => {
                    document.getElementById('freq-value').textContent = e.target.value;
                    document.getElementById('current-freq').textContent = e.target.value;
                });
                
                ampSlider.addEventListener('input', (e) => {
                    document.getElementById('amp-value').textContent = e.target.value;
                    document.getElementById('current-amp').textContent = e.target.value;
                });
            }
            
            setupMouseTracking() {
                this.canvas.addEventListener('mousemove', (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    document.getElementById('mouse-pos').textContent = `(${x}, ${y})`;
                });
            }
            
            clear() {
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(0, 0, this.width, this.height);
                this.drawAxes();
            }
            
            drawAxes() {
                this.ctx.strokeStyle = '#333';
                this.ctx.lineWidth = 1;
                
                // X轴
                this.ctx.beginPath();
                this.ctx.moveTo(0, this.centerY);
                this.ctx.lineTo(this.width, this.centerY);
                this.ctx.stroke();
                
                // Y轴
                this.ctx.beginPath();
                this.ctx.moveTo(this.centerX, 0);
                this.ctx.lineTo(this.centerX, this.height);
                this.ctx.stroke();
                
                // 网格
                this.ctx.strokeStyle = '#222';
                for (let x = 0; x < this.width; x += 50) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, 0);
                    this.ctx.lineTo(x, this.height);
                    this.ctx.stroke();
                }
                
                for (let y = 0; y < this.height; y += 50) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, y);
                    this.ctx.lineTo(this.width, y);
                    this.ctx.stroke();
                }
            }
            
            drawSineWave() {
                this.clear();
                
                const frequency = parseFloat(document.getElementById('frequency').value);
                const amplitude = parseFloat(document.getElementById('amplitude').value);
                
                this.ctx.strokeStyle = '#ff6b6b';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                
                for (let x = 0; x < this.width; x++) {
                    const angle = (x - this.centerX) * 0.02 * frequency;
                    const y = this.centerY + amplitude * Math.sin(angle);
                    
                    if (x === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }
                
                this.ctx.stroke();
                
                document.getElementById('formula').textContent = `y = ${amplitude} × sin(${frequency} × x)`;
                document.getElementById('description').textContent = '正弦波：周期性振荡的基本形式';
            }
            
            drawLissajous() {
                this.clear();
                
                const frequency = parseFloat(document.getElementById('frequency').value);
                const amplitude = parseFloat(document.getElementById('amplitude').value);
                
                this.ctx.strokeStyle = '#4ecdc4';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                
                for (let t = 0; t <= Math.PI * 4; t += 0.01) {
                    const x = this.centerX + amplitude * Math.sin(frequency * t);
                    const y = this.centerY + amplitude * Math.cos((frequency + 0.5) * t);
                    
                    if (t === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }
                
                this.ctx.stroke();
                
                document.getElementById('formula').textContent = `x = A×sin(${frequency}t), y = A×cos(${frequency + 0.5}t)`;
                document.getElementById('description').textContent = '李萨如图形：两个正交简谐振动的合成';
            }
            
            drawSpiral() {
                this.clear();
                
                const frequency = parseFloat(document.getElementById('frequency').value);
                
                this.ctx.strokeStyle = '#ffe66d';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                
                for (let t = 0; t <= Math.PI * 8; t += 0.01) {
                    const r = t * frequency * 5;
                    const x = this.centerX + r * Math.cos(t);
                    const y = this.centerY + r * Math.sin(t);
                    
                    if (t === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                    
                    if (x < 0 || x > this.width || y < 0 || y > this.height) break;
                }
                
                this.ctx.stroke();
                
                document.getElementById('formula').textContent = `r = ${frequency} × t`;
                document.getElementById('description').textContent = '阿基米德螺旋：半径随角度线性增长';
            }
            
            drawRose() {
                this.clear();
                
                const frequency = parseFloat(document.getElementById('frequency').value);
                const amplitude = parseFloat(document.getElementById('amplitude').value);
                const k = Math.round(frequency * 2); // 花瓣数量因子
                
                this.ctx.strokeStyle = '#ff6b9d';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                
                for (let t = 0; t <= Math.PI * 2; t += 0.01) {
                    const r = amplitude * Math.cos(k * t);
                    const x = this.centerX + r * Math.cos(t);
                    const y = this.centerY + r * Math.sin(t);
                    
                    if (t === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }
                
                this.ctx.stroke();
                
                document.getElementById('formula').textContent = `r = ${amplitude} × cos(${k}θ)`;
                document.getElementById('description').textContent = `玫瑰曲线：${k}瓣玫瑰花的极坐标方程`;
            }
            
            drawFractal() {
                this.clear();
                
                const frequency = parseFloat(document.getElementById('frequency').value);
                
                // 简单的分形树
                this.ctx.strokeStyle = '#95e1d3';
                this.ctx.lineWidth = 1;
                
                this.drawBranch(this.centerX, this.height - 50, -Math.PI / 2, 100, 8);
                
                document.getElementById('formula').textContent = 'L(n) = L(n-1) × 0.7';
                document.getElementById('description').textContent = '分形树：自相似的递归结构';
            }
            
            drawBranch(x, y, angle, length, depth) {
                if (depth === 0 || length < 2) return;
                
                const endX = x + length * Math.cos(angle);
                const endY = y + length * Math.sin(angle);
                
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(endX, endY);
                this.ctx.stroke();
                
                const newLength = length * 0.7;
                this.drawBranch(endX, endY, angle - 0.5, newLength, depth - 1);
                this.drawBranch(endX, endY, angle + 0.5, newLength, depth - 1);
            }
            
            drawVectorField() {
                this.clear();
                
                const frequency = parseFloat(document.getElementById('frequency').value);
                
                this.ctx.strokeStyle = '#a8e6cf';
                this.ctx.lineWidth = 1;
                
                const step = 30;
                for (let x = step; x < this.width; x += step) {
                    for (let y = step; y < this.height; y += step) {
                        const fieldX = (x - this.centerX) * 0.01;
                        const fieldY = (y - this.centerY) * 0.01;
                        
                        // 向量场函数
                        const vx = Math.sin(fieldY * frequency) * 15;
                        const vy = Math.cos(fieldX * frequency) * 15;
                        
                        this.ctx.beginPath();
                        this.ctx.moveTo(x, y);
                        this.ctx.lineTo(x + vx, y + vy);
                        this.ctx.stroke();
                        
                        // 箭头
                        const angle = Math.atan2(vy, vx);
                        const arrowLength = 5;
                        this.ctx.beginPath();
                        this.ctx.moveTo(x + vx, y + vy);
                        this.ctx.lineTo(
                            x + vx - arrowLength * Math.cos(angle - 0.3),
                            y + vy - arrowLength * Math.sin(angle - 0.3)
                        );
                        this.ctx.moveTo(x + vx, y + vy);
                        this.ctx.lineTo(
                            x + vx - arrowLength * Math.cos(angle + 0.3),
                            y + vy - arrowLength * Math.sin(angle + 0.3)
                        );
                        this.ctx.stroke();
                    }
                }
                
                document.getElementById('formula').textContent = `F(x,y) = (sin(${frequency}y), cos(${frequency}x))`;
                document.getElementById('description').textContent = '向量场：空间中每点的向量分布';
            }
        }
        
        // 初始化演示
        const canvas = document.getElementById('canvas');
        const demo = new MathVisualization(canvas);
        demo.clear();
        
        console.log('数学图形可视化器已加载！');
        console.log('点击按钮体验不同的数学图形');
    </script>
</body>
</html>
```

## 作业

1. 完成数学图形可视化器项目
2. 实现贝塞尔曲线编辑器
3. 创建简单的物理引擎（重力、碰撞）
4. 研究tessellation-evolved.tsx中的数学公式
5. 设计自己的分形图案

## 下一课预告

第10课将学习复杂图案生成，结合前面的数学知识创建高级视觉效果。
