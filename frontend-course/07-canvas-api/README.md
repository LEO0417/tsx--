# 第7课：Canvas API - 2D图形绘制基础

## 课程概述

Canvas API是HTML5的核心功能之一，提供了在网页上绘制2D图形的能力。本课程将深入学习Canvas的各种绘图功能，为后续的动画和复杂图形编程打下坚实基础。

## 学习目标

- 掌握Canvas基本概念和API使用
- 理解坐标系统、变换和裁剪
- 学会绘制各种图形和路径
- 掌握文本渲染和图像处理
- 理解Canvas的性能优化方法
- 为复杂动画编程做准备

## 知识点详解

### 1. Canvas基础概念

#### 1.1 Canvas元素和上下文

```html
<!DOCTYPE html>
<html>
<head>
    <title>Canvas基础</title>
    <style>
        canvas {
            border: 1px solid #000;
            display: block;
            margin: 20px auto;
        }
    </style>
</head>
<body>
    <canvas id="myCanvas" width="800" height="600"></canvas>
    
    <script>
        // 获取Canvas元素和2D上下文
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');
        
        // 检查浏览器支持
        if (!ctx) {
            alert('您的浏览器不支持Canvas');
        }
        
        // 设置Canvas尺寸
        canvas.width = 800;
        canvas.height = 600;
        
        // 获取实际尺寸
        console.log('Canvas尺寸:', canvas.width, 'x', canvas.height);
        console.log('显示尺寸:', canvas.clientWidth, 'x', canvas.clientHeight);
    </script>
</body>
</html>
```

#### 1.2 坐标系统

```javascript
// Canvas坐标系统说明
// 原点(0,0)在左上角
// X轴向右为正，Y轴向下为正
// 单位是像素

// 绘制坐标参考线
function drawCoordinateSystem(ctx, width, height) {
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    // 绘制网格
    for (let x = 0; x <= width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // 绘制坐标轴
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // X轴
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.stroke();
    
    // Y轴
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height);
    ctx.stroke();
}
```

### 2. 基本绘图操作

#### 2.1 矩形绘制

```javascript
// 填充矩形
ctx.fillStyle = '#ff6b6b';
ctx.fillRect(50, 50, 200, 100);

// 描边矩形
ctx.strokeStyle = '#4ecdc4';
ctx.lineWidth = 3;
ctx.strokeRect(300, 50, 200, 100);

// 清除矩形区域
ctx.clearRect(375, 75, 50, 50);

// 复合矩形绘制函数
function drawRectangles(ctx) {
    // 渐变色矩形
    const gradient = ctx.createLinearGradient(50, 200, 250, 300);
    gradient.addColorStop(0, '#ff9a9e');
    gradient.addColorStop(1, '#fecfef');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(50, 200, 200, 100);
    
    // 圆角矩形（使用路径模拟）
    drawRoundedRect(ctx, 300, 200, 200, 100, 15);
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    ctx.fillStyle = '#a8e6cf';
    ctx.fill();
    ctx.strokeStyle = '#88d8a3';
    ctx.lineWidth = 2;
    ctx.stroke();
}
```

#### 2.2 圆形和弧形

```javascript
// 基本圆形
ctx.beginPath();
ctx.arc(150, 150, 80, 0, Math.PI * 2);
ctx.fillStyle = '#ffd93d';
ctx.fill();
ctx.strokeStyle = '#ffb74d';
ctx.lineWidth = 3;
ctx.stroke();

// 半圆和扇形
function drawArcs(ctx) {
    // 半圆
    ctx.beginPath();
    ctx.arc(350, 150, 60, 0, Math.PI);
    ctx.fillStyle = '#74b9ff';
    ctx.fill();
    
    // 扇形
    ctx.beginPath();
    ctx.moveTo(500, 150);
    ctx.arc(500, 150, 60, 0, Math.PI / 3);
    ctx.closePath();
    ctx.fillStyle = '#fd79a8';
    ctx.fill();
    
    // 空心圆环
    ctx.beginPath();
    ctx.arc(650, 150, 60, 0, Math.PI * 2);
    ctx.arc(650, 150, 30, 0, Math.PI * 2, true); // 逆时针
    ctx.fillStyle = '#00b894';
    ctx.fill();
}
```

### 3. 实践项目：绘图板应用

创建一个功能完整的绘图板应用：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Canvas绘图板</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: 'Microsoft YaHei', sans-serif;
            background-color: #f5f6fa;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .toolbar {
            display: flex;
            align-items: center;
            padding: 15px 20px;
            background: #2f3542;
            color: white;
            flex-wrap: wrap;
            gap: 15px;
        }
        
        .tool-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .tool-group label {
            font-size: 14px;
            font-weight: 500;
        }
        
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            background: #3742fa;
            color: white;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        }
        
        .btn:hover {
            background: #2f32e2;
        }
        
        .btn.active {
            background: #ff3838;
        }
        
        input[type="range"] {
            width: 100px;
        }
        
        input[type="color"] {
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            cursor: pointer;
        }
        
        .canvas-container {
            position: relative;
            display: flex;
            justify-content: center;
            background: #ecf0f1;
            padding: 20px;
        }
        
        canvas {
            border: 2px solid #ddd;
            border-radius: 5px;
            background: white;
            cursor: crosshair;
        }
        
        .info {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="toolbar">
            <div class="tool-group">
                <label>工具:</label>
                <button class="btn active" data-tool="brush">画笔</button>
                <button class="btn" data-tool="line">直线</button>
                <button class="btn" data-tool="rect">矩形</button>
                <button class="btn" data-tool="circle">圆形</button>
                <button class="btn" data-tool="eraser">橡皮擦</button>
            </div>
            
            <div class="tool-group">
                <label>粗细:</label>
                <input type="range" id="brushSize" min="1" max="50" value="5">
                <span id="sizeDisplay">5px</span>
            </div>
            
            <div class="tool-group">
                <label>颜色:</label>
                <input type="color" id="colorPicker" value="#000000">
            </div>
            
            <div class="tool-group">
                <label>透明度:</label>
                <input type="range" id="opacity" min="0.1" max="1" step="0.1" value="1">
                <span id="opacityDisplay">100%</span>
            </div>
            
            <div class="tool-group">
                <button class="btn" id="clearCanvas">清空</button>
                <button class="btn" id="saveCanvas">保存</button>
                <button class="btn" id="loadImage">加载图片</button>
                <input type="file" id="imageInput" accept="image/*" style="display: none;">
            </div>
        </div>
        
        <div class="canvas-container">
            <canvas id="drawingCanvas" width="800" height="600"></canvas>
            <div class="info" id="info">坐标: (0, 0)</div>
        </div>
    </div>

    <script>
        class DrawingApp {
            constructor() {
                this.canvas = document.getElementById('drawingCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.isDrawing = false;
                this.currentTool = 'brush';
                this.startX = 0;
                this.startY = 0;
                this.currentPath = [];
                
                // 设置Canvas高DPI支持
                this.setupHighDPI();
                
                // 绑定事件
                this.bindEvents();
                
                // 初始化工具栏
                this.initializeToolbar();
                
                // 设置默认样式
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
            }
            
            setupHighDPI() {
                const rect = this.canvas.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                
                this.canvas.width = rect.width * dpr;
                this.canvas.height = rect.height * dpr;
                this.ctx.scale(dpr, dpr);
                
                this.canvas.style.width = rect.width + 'px';
                this.canvas.style.height = rect.height + 'px';
            }
            
            bindEvents() {
                // 鼠标事件
                this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
                this.canvas.addEventListener('mousemove', this.draw.bind(this));
                this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
                this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
                
                // 触摸事件支持
                this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
                this.canvas.addEventListener('touchmove', this.handleTouch.bind(this));
                this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));
                
                // 工具栏事件
                document.querySelectorAll('[data-tool]').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        this.selectTool(e.target.dataset.tool);
                    });
                });
                
                // 控件事件
                document.getElementById('brushSize').addEventListener('input', this.updateBrushSize.bind(this));
                document.getElementById('opacity').addEventListener('input', this.updateOpacity.bind(this));
                document.getElementById('clearCanvas').addEventListener('click', this.clearCanvas.bind(this));
                document.getElementById('saveCanvas').addEventListener('click', this.saveCanvas.bind(this));
                document.getElementById('loadImage').addEventListener('click', () => {
                    document.getElementById('imageInput').click();
                });
                document.getElementById('imageInput').addEventListener('change', this.loadImage.bind(this));
                
                // 坐标显示
                this.canvas.addEventListener('mousemove', this.updateCoordinates.bind(this));
            }
            
            initializeToolbar() {
                this.updateBrushSize();
                this.updateOpacity();
            }
            
            getMousePos(e) {
                const rect = this.canvas.getBoundingClientRect();
                return {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            }
            
            handleTouch(e) {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 'mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                this.canvas.dispatchEvent(mouseEvent);
            }
            
            startDrawing(e) {
                this.isDrawing = true;
                const pos = this.getMousePos(e);
                this.startX = pos.x;
                this.startY = pos.y;
                
                if (this.currentTool === 'brush' || this.currentTool === 'eraser') {
                    this.ctx.beginPath();
                    this.ctx.moveTo(pos.x, pos.y);
                    this.currentPath = [pos];
                }
                
                // 保存当前状态用于图形绘制
                this.saveCanvasState();
            }
            
            draw(e) {
                if (!this.isDrawing) return;
                
                const pos = this.getMousePos(e);
                
                switch (this.currentTool) {
                    case 'brush':
                        this.drawBrush(pos);
                        break;
                    case 'eraser':
                        this.erase(pos);
                        break;
                    case 'line':
                        this.drawLine(pos);
                        break;
                    case 'rect':
                        this.drawRect(pos);
                        break;
                    case 'circle':
                        this.drawCircle(pos);
                        break;
                }
            }
            
            stopDrawing() {
                if (!this.isDrawing) return;
                this.isDrawing = false;
                this.currentPath = [];
            }
            
            drawBrush(pos) {
                this.ctx.globalCompositeOperation = 'source-over';
                this.ctx.lineTo(pos.x, pos.y);
                this.ctx.stroke();
                this.currentPath.push(pos);
            }
            
            erase(pos) {
                this.ctx.globalCompositeOperation = 'destination-out';
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, this.ctx.lineWidth / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            drawLine(pos) {
                this.restoreCanvasState();
                this.ctx.globalCompositeOperation = 'source-over';
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(pos.x, pos.y);
                this.ctx.stroke();
            }
            
            drawRect(pos) {
                this.restoreCanvasState();
                this.ctx.globalCompositeOperation = 'source-over';
                const width = pos.x - this.startX;
                const height = pos.y - this.startY;
                this.ctx.beginPath();
                this.ctx.rect(this.startX, this.startY, width, height);
                this.ctx.stroke();
            }
            
            drawCircle(pos) {
                this.restoreCanvasState();
                this.ctx.globalCompositeOperation = 'source-over';
                const radius = Math.sqrt(
                    Math.pow(pos.x - this.startX, 2) + 
                    Math.pow(pos.y - this.startY, 2)
                );
                this.ctx.beginPath();
                this.ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
                this.ctx.stroke();
            }
            
            selectTool(tool) {
                this.currentTool = tool;
                document.querySelectorAll('[data-tool]').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector(`[data-tool="${tool}"]`).classList.add('active');
                
                // 更新光标
                const cursors = {
                    brush: 'crosshair',
                    line: 'crosshair',
                    rect: 'crosshair',
                    circle: 'crosshair',
                    eraser: 'grab'
                };
                this.canvas.style.cursor = cursors[tool] || 'crosshair';
            }
            
            updateBrushSize() {
                const size = document.getElementById('brushSize').value;
                this.ctx.lineWidth = size;
                document.getElementById('sizeDisplay').textContent = size + 'px';
            }
            
            updateOpacity() {
                const opacity = document.getElementById('opacity').value;
                this.ctx.globalAlpha = opacity;
                document.getElementById('opacityDisplay').textContent = 
                    Math.round(opacity * 100) + '%';
            }
            
            updateCoordinates(e) {
                const pos = this.getMousePos(e);
                document.getElementById('info').textContent = 
                    `坐标: (${Math.round(pos.x)}, ${Math.round(pos.y)})`;
            }
            
            saveCanvasState() {
                this.savedImageData = this.ctx.getImageData(
                    0, 0, this.canvas.width, this.canvas.height
                );
            }
            
            restoreCanvasState() {
                if (this.savedImageData) {
                    this.ctx.putImageData(this.savedImageData, 0, 0);
                }
            }
            
            clearCanvas() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            
            saveCanvas() {
                const link = document.createElement('a');
                link.download = `drawing-${Date.now()}.png`;
                link.href = this.canvas.toDataURL();
                link.click();
            }
            
            loadImage(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                        this.ctx.drawImage(img, 0, 0);
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
        
        // 初始化应用
        document.addEventListener('DOMContentLoaded', () => {
            new DrawingApp();
            
            // 颜色选择器变化事件
            document.getElementById('colorPicker').addEventListener('change', (e) => {
                const canvas = document.getElementById('drawingCanvas');
                const ctx = canvas.getContext('2d');
                ctx.strokeStyle = e.target.value;
                ctx.fillStyle = e.target.value;
            });
        });
    </script>
</body>
</html>
```

## 课程总结

### 核心知识点回顾

1. **Canvas基础**: 元素创建、上下文获取、坐标系统
2. **绘图操作**: 矩形、圆形、路径、贝塞尔曲线
3. **样式控制**: 颜色、渐变、图案、线条样式
4. **变换操作**: 平移、旋转、缩放、矩阵变换
5. **文本处理**: 字体设置、对齐、测量、特效
6. **图像处理**: 绘制、缩放、裁剪、像素操作
7. **性能优化**: 离屏渲染、批量绘制、脏矩形更新

### 实践技能

- 创建交互式绘图应用
- 实现各种绘图工具
- 处理鼠标和触摸事件
- 优化Canvas性能
- 导入导出图像数据

### 下一步学习

第8课将学习动画基础，包括：

- 动画循环原理
- 缓动函数和插值
- 粒子系统
- 物理模拟基础
- requestAnimationFrame的使用

通过本课学习，你已经掌握了Canvas 2D图形绘制的完整知识体系，为后续的动画和复杂图形编程打下了坚实基础。
</rewritten_file>
