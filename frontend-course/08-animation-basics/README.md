# 第8课：动画基础

## 学习目标

- 理解动画的基本原理和概念
- 掌握CSS动画和JavaScript动画技术
- 学会使用requestAnimationFrame
- 理解缓动函数和时间插值
- 为tessellation-evolved.tsx的动画系统做准备

## 动画基本概念

### 什么是动画？

动画是通过快速连续显示略有不同的静态图像来创造运动错觉的技术。在Web开发中，我们通过改变元素的属性值来实现动画效果。

### 动画的关键要素

1. **时间（Time）**：动画的持续时间
2. **位置（Position）**：对象在空间中的位置
3. **速度（Velocity）**：位置变化的速率
4. **加速度（Acceleration）**：速度变化的速率
5. **缓动（Easing）**：动画的速度曲线

### 帧率和流畅度

```javascript
// 理想帧率：60fps（每秒60帧）
const targetFPS = 60;
const frameInterval = 1000 / targetFPS; // ≈16.67ms

// 动画循环的基本结构
function animationLoop(timestamp) {
  // 计算时间差
  const deltaTime = timestamp - lastTimestamp;
  
  // 更新动画状态
  update(deltaTime);
  
  // 渲染画面
  render();
  
  // 记录时间戳
  lastTimestamp = timestamp;
  
  // 继续下一帧
  requestAnimationFrame(animationLoop);
}
```

## CSS动画

### CSS Transitions

```css
/* 基本过渡 */
.element {
  width: 100px;
  height: 100px;
  background: blue;
  transition: all 0.3s ease;
}

.element:hover {
  width: 200px;
  height: 200px;
  background: red;
  transform: rotate(45deg);
}

/* 复杂过渡 */
.button {
  background: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  
  /* 多个属性的不同过渡时间 */
  transition: 
    background-color 0.3s ease,
    transform 0.2s ease,
    box-shadow 0.3s ease;
}

.button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
```

### CSS Keyframes动画

```css
/* 定义关键帧 */
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 应用动画 */
.bouncing-ball {
  width: 50px;
  height: 50px;
  background: red;
  border-radius: 50%;
  animation: bounce 1s infinite;
}

.fade-in-element {
  animation: fadeInUp 0.6s ease-out;
}

.pulsing-button {
  animation: pulse 2s infinite;
}

/* 复杂动画序列 */
@keyframes complexAnimation {
  0% {
    opacity: 0;
    transform: translateX(-100px) rotate(0deg);
    background: red;
  }
  25% {
    opacity: 0.5;
    transform: translateX(-50px) rotate(90deg);
    background: yellow;
  }
  50% {
    opacity: 1;
    transform: translateX(0) rotate(180deg);
    background: green;
  }
  75% {
    opacity: 0.5;
    transform: translateX(50px) rotate(270deg);
    background: blue;
  }
  100% {
    opacity: 0;
    transform: translateX(100px) rotate(360deg);
    background: purple;
  }
}

.complex-element {
  animation: complexAnimation 4s ease-in-out infinite;
}
```

### 动画控制和优化

```css
/* 动画控制 */
.paused {
  animation-play-state: paused;
}

.delayed {
  animation-delay: 1s;
}

.reverse {
  animation-direction: reverse;
}

.alternate {
  animation-direction: alternate;
}

/* 性能优化 */
.optimized-animation {
  /* 启用硬件加速 */
  transform: translateZ(0);
  will-change: transform, opacity;
  
  /* 避免重排的属性 */
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

## JavaScript动画

### 基础动画循环

```javascript
class Animator {
  constructor() {
    this.animations = [];
    this.lastTime = 0;
    this.isRunning = false;
  }
  
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop();
  }
  
  stop() {
    this.isRunning = false;
  }
  
  loop(currentTime = performance.now()) {
    if (!this.isRunning) return;
    
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    // 更新所有动画
    this.animations.forEach(animation => {
      animation.update(deltaTime);
    });
    
    // 移除已完成的动画
    this.animations = this.animations.filter(anim => !anim.isComplete);
    
    requestAnimationFrame((time) => this.loop(time));
  }
  
  addAnimation(animation) {
    this.animations.push(animation);
  }
}

// 基础动画类
class Animation {
  constructor(duration, startValue, endValue, element, property) {
    this.duration = duration;
    this.startValue = startValue;
    this.endValue = endValue;
    this.element = element;
    this.property = property;
    this.elapsed = 0;
    this.isComplete = false;
  }
  
  update(deltaTime) {
    this.elapsed += deltaTime;
    
    if (this.elapsed >= this.duration) {
      this.elapsed = this.duration;
      this.isComplete = true;
    }
    
    const progress = this.elapsed / this.duration;
    const currentValue = this.interpolate(progress);
    this.apply(currentValue);
  }
  
  interpolate(progress) {
    // 线性插值
    return this.startValue + (this.endValue - this.startValue) * progress;
  }
  
  apply(value) {
    this.element.style[this.property] = value + 'px';
  }
}

// 使用示例
const animator = new Animator();
const element = document.querySelector('.animated-element');

// 创建移动动画
const moveAnimation = new Animation(1000, 0, 300, element, 'left');
animator.addAnimation(moveAnimation);

animator.start();
```

### 高级动画系统

```javascript
// 缓动函数
const EasingFunctions = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: t => t * t * t,
  easeOutCubic: t => (--t) * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInElastic: t => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    const p = 0.3;
    const s = p / 4;
    return -(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
  },
  easeOutElastic: t => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    const p = 0.3;
    const s = p / 4;
    return Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
  },
  easeInBounce: t => 1 - EasingFunctions.easeOutBounce(1 - t),
  easeOutBounce: t => {
    if (t < (1 / 2.75)) {
      return (7.5625 * t * t);
    } else if (t < (2 / 2.75)) {
      return (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75);
    } else if (t < (2.5 / 2.75)) {
      return (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375);
    } else {
      return (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375);
    }
  }
};

// 高级动画类
class AdvancedAnimation {
  constructor(options) {
    this.target = options.target;
    this.duration = options.duration || 1000;
    this.delay = options.delay || 0;
    this.easing = options.easing || EasingFunctions.linear;
    this.properties = options.properties || {};
    this.onComplete = options.onComplete || (() => {});
    this.onUpdate = options.onUpdate || (() => {});
    
    this.startTime = null;
    this.isComplete = false;
    this.startValues = {};
    
    // 记录初始值
    Object.keys(this.properties).forEach(prop => {
      this.startValues[prop] = this.getCurrentValue(prop);
    });
  }
  
  getCurrentValue(property) {
    const computed = getComputedStyle(this.target);
    const value = computed[property];
    return parseFloat(value) || 0;
  }
  
  update(currentTime) {
    if (this.startTime === null) {
      this.startTime = currentTime + this.delay;
      return;
    }
    
    if (currentTime < this.startTime) return;
    
    const elapsed = currentTime - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1);
    const easedProgress = this.easing(progress);
    
    // 更新所有属性
    Object.keys(this.properties).forEach(prop => {
      const startValue = this.startValues[prop];
      const endValue = this.properties[prop];
      const currentValue = startValue + (endValue - startValue) * easedProgress;
      
      this.target.style[prop] = currentValue + 'px';
    });
    
    this.onUpdate(progress, easedProgress);
    
    if (progress >= 1) {
      this.isComplete = true;
      this.onComplete();
    }
  }
}

// 动画队列管理器
class AnimationQueue {
  constructor() {
    this.queue = [];
    this.current = null;
  }
  
  add(animation) {
    this.queue.push(animation);
    if (!this.current) {
      this.next();
    }
  }
  
  next() {
    if (this.queue.length === 0) {
      this.current = null;
      return;
    }
    
    this.current = this.queue.shift();
    this.current.onComplete = () => {
      this.next();
    };
    
    animator.addAnimation(this.current);
  }
}

// 使用示例
const element = document.querySelector('.box');

// 创建复杂动画序列
const queue = new AnimationQueue();

// 第一个动画：移动
queue.add(new AdvancedAnimation({
  target: element,
  duration: 1000,
  easing: EasingFunctions.easeOutElastic,
  properties: {
    left: 300,
    top: 100
  }
}));

// 第二个动画：缩放
queue.add(new AdvancedAnimation({
  target: element,
  duration: 500,
  easing: EasingFunctions.easeInOutQuad,
  properties: {
    width: 200,
    height: 200
  }
}));

// 第三个动画：旋转（使用transform）
queue.add(new AdvancedAnimation({
  target: element,
  duration: 800,
  easing: EasingFunctions.easeOutBounce,
  properties: {
    rotation: 360
  },
  onUpdate: (progress, easedProgress) => {
    const rotation = 360 * easedProgress;
    element.style.transform = `rotate(${rotation}deg)`;
  }
}));
```

## 粒子系统基础

### 简单粒子类

```javascript
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = (Math.random() - 0.5) * 10;
    this.life = 1.0;
    this.decay = Math.random() * 0.01 + 0.005;
    this.size = Math.random() * 5 + 2;
    this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
  }
  
  update(deltaTime) {
    // 更新位置
    this.x += this.vx * deltaTime * 0.1;
    this.y += this.vy * deltaTime * 0.1;
    
    // 应用重力
    this.vy += 0.5 * deltaTime * 0.1;
    
    // 更新生命值
    this.life -= this.decay;
    
    return this.life > 0;
  }
  
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// 粒子系统
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.lastTime = 0;
    
    this.setupCanvas();
    this.startAnimation();
  }
  
  setupCanvas() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // 鼠标交互
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.createParticles(x, y, 5);
    });
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles(x, y, count) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y));
    }
  }
  
  update(deltaTime) {
    // 更新所有粒子
    this.particles = this.particles.filter(particle => 
      particle.update(deltaTime)
    );
    
    // 限制粒子数量
    if (this.particles.length > 1000) {
      this.particles = this.particles.slice(-1000);
    }
  }
  
  render() {
    // 清除画布
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制所有粒子
    this.particles.forEach(particle => {
      particle.draw(this.ctx);
    });
  }
  
  animate(currentTime) {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    this.update(deltaTime);
    this.render();
    
    requestAnimationFrame((time) => this.animate(time));
  }
  
  startAnimation() {
    this.animate(0);
  }
}

// 使用粒子系统
const canvas = document.getElementById('particleCanvas');
const particleSystem = new ParticleSystem(canvas);
```

## React中的动画

### useAnimation Hook增强版

```jsx
import { useState, useEffect, useRef, useCallback } from 'react';

function useAdvancedAnimation({
  duration = 1000,
  delay = 0,
  easing = 'linear',
  autoStart = false
}) {
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const animationRef = useRef();
  const startTimeRef = useRef();
  
  // 缓动函数
  const easingFunctions = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInElastic: t => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      const p = 0.3;
      const s = p / 4;
      return -(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
    }
  };
  
  const start = useCallback(() => {
    setIsAnimating(true);
    setIsComplete(false);
    setProgress(0);
    
    const startTime = performance.now() + delay;
    startTimeRef.current = startTime;
    
    const animate = (currentTime) => {
      if (currentTime < startTime) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFunctions[easing](rawProgress);
      
      setProgress(easedProgress);
      
      if (rawProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setIsComplete(true);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, [duration, delay, easing]);
  
  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      setIsAnimating(false);
    }
  }, []);
  
  const reset = useCallback(() => {
    stop();
    setProgress(0);
    setIsComplete(false);
  }, [stop]);
  
  useEffect(() => {
    if (autoStart) {
      start();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoStart, start]);
  
  return {
    progress,
    isAnimating,
    isComplete,
    start,
    stop,
    reset
  };
}

// 动画组件示例
function AnimatedBox() {
  const animation = useAdvancedAnimation({
    duration: 2000,
    easing: 'easeInOutQuad'
  });
  
  const boxStyle = {
    width: '100px',
    height: '100px',
    backgroundColor: '#4CAF50',
    transform: `translateX(${animation.progress * 300}px) rotate(${animation.progress * 360}deg)`,
    opacity: 1 - animation.progress * 0.5,
    transition: 'none'
  };
  
  return (
    <div>
      <div style={boxStyle}></div>
      <div>
        <button onClick={animation.start} disabled={animation.isAnimating}>
          开始动画
        </button>
        <button onClick={animation.stop} disabled={!animation.isAnimating}>
          停止动画
        </button>
        <button onClick={animation.reset}>
          重置
        </button>
      </div>
      <p>进度: {Math.round(animation.progress * 100)}%</p>
      <p>状态: {animation.isAnimating ? '动画中' : animation.isComplete ? '已完成' : '等待开始'}</p>
    </div>
  );
}
```

## 实践项目：动画展示器

创建一个综合的动画展示应用：

### HTML结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>动画展示器</title>
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
        
        button:disabled {
            background: #666;
            cursor: not-allowed;
        }
        
        .demo-area {
            width: 100%;
            height: 400px;
            border: 2px solid #333;
            position: relative;
            overflow: hidden;
            background: #2a2a2a;
        }
        
        .animated-element {
            position: absolute;
            width: 50px;
            height: 50px;
            background: #ff6b6b;
            border-radius: 50%;
            top: 50%;
            left: 50px;
            transform: translateY(-50%);
        }
        
        canvas {
            border: 2px solid #333;
            background: #000;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 动画展示器</h1>
        
        <div class="controls">
            <button onclick="demo.bounceAnimation()">弹跳动画</button>
            <button onclick="demo.rotateAnimation()">旋转动画</button>
            <button onclick="demo.elasticAnimation()">弹性动画</button>
            <button onclick="demo.pathAnimation()">路径动画</button>
            <button onclick="demo.particleDemo()">粒子效果</button>
            <button onclick="demo.reset()">重置</button>
        </div>
        
        <div class="demo-area" id="demo-area">
            <div class="animated-element" id="animated-element"></div>
        </div>
        
        <canvas id="particle-canvas" width="800" height="400"></canvas>
    </div>

    <script>
        // 动画展示器类
        class AnimationDemo {
            constructor() {
                this.element = document.getElementById('animated-element');
                this.canvas = document.getElementById('particle-canvas');
                this.ctx = this.canvas.getContext('2d');
                this.isAnimating = false;
                this.currentAnimation = null;
                this.particles = [];
                
                this.setupCanvas();
            }
            
            setupCanvas() {
                this.canvas.width = 800;
                this.canvas.height = 400;
                
                this.canvas.addEventListener('click', (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    this.createExplosion(x, y);
                });
            }
            
            reset() {
                if (this.currentAnimation) {
                    cancelAnimationFrame(this.currentAnimation);
                }
                this.element.style.transform = 'translateY(-50%)';
                this.element.style.left = '50px';
                this.element.style.background = '#ff6b6b';
                this.isAnimating = false;
                this.particles = [];
                this.clearCanvas();
            }
            
            bounceAnimation() {
                if (this.isAnimating) return;
                this.reset();
                this.isAnimating = true;
                
                const duration = 2000;
                const startTime = performance.now();
                
                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // 弹跳缓动函数
                    const bounceEasing = (t) => {
                        if (t < (1 / 2.75)) {
                            return (7.5625 * t * t);
                        } else if (t < (2 / 2.75)) {
                            return (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75);
                        } else if (t < (2.5 / 2.75)) {
                            return (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375);
                        } else {
                            return (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375);
                        }
                    };
                    
                    const easedProgress = bounceEasing(progress);
                    const x = 50 + easedProgress * 700;
                    
                    this.element.style.left = x + 'px';
                    this.element.style.background = `hsl(${progress * 360}, 70%, 60%)`;
                    
                    if (progress < 1) {
                        this.currentAnimation = requestAnimationFrame(animate);
                    } else {
                        this.isAnimating = false;
                    }
                };
                
                this.currentAnimation = requestAnimationFrame(animate);
            }
            
            rotateAnimation() {
                if (this.isAnimating) return;
                this.reset();
                this.isAnimating = true;
                
                const duration = 3000;
                const startTime = performance.now();
                
                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    const rotation = progress * 720; // 两圈
                    const x = 50 + progress * 600;
                    const scale = 1 + Math.sin(progress * Math.PI * 4) * 0.5;
                    
                    this.element.style.transform = `translateY(-50%) rotate(${rotation}deg) scale(${scale})`;
                    this.element.style.left = x + 'px';
                    this.element.style.background = `hsl(${progress * 360}, 70%, 60%)`;
                    
                    if (progress < 1) {
                        this.currentAnimation = requestAnimationFrame(animate);
                    } else {
                        this.isAnimating = false;
                    }
                };
                
                this.currentAnimation = requestAnimationFrame(animate);
            }
            
            elasticAnimation() {
                if (this.isAnimating) return;
                this.reset();
                this.isAnimating = true;
                
                const duration = 2500;
                const startTime = performance.now();
                
                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // 弹性缓动函数
                    const elasticEasing = (t) => {
                        if (t === 0) return 0;
                        if (t === 1) return 1;
                        const p = 0.3;
                        const s = p / 4;
                        return Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
                    };
                    
                    const easedProgress = elasticEasing(progress);
                    const x = 50 + easedProgress * 500;
                    const y = 200 + Math.sin(progress * Math.PI * 3) * 100;
                    
                    this.element.style.left = x + 'px';
                    this.element.style.top = y + 'px';
                    this.element.style.transform = 'none';
                    this.element.style.background = `hsl(${progress * 360}, 70%, 60%)`;
                    
                    if (progress < 1) {
                        this.currentAnimation = requestAnimationFrame(animate);
                    } else {
                        this.isAnimating = false;
                    }
                };
                
                this.currentAnimation = requestAnimationFrame(animate);
            }
            
            pathAnimation() {
                if (this.isAnimating) return;
                this.reset();
                this.isAnimating = true;
                
                const duration = 4000;
                const startTime = performance.now();
                
                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // 心形路径
                    const t = progress * Math.PI * 2;
                    const x = 300 + 100 * (16 * Math.sin(t) ** 3);
                    const y = 200 + 100 * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) / 16;
                    
                    this.element.style.left = x + 'px';
                    this.element.style.top = y + 'px';
                    this.element.style.transform = `rotate(${t}rad)`;
                    this.element.style.background = `hsl(${progress * 360}, 70%, 60%)`;
                    
                    if (progress < 1) {
                        this.currentAnimation = requestAnimationFrame(animate);
                    } else {
                        this.isAnimating = false;
                    }
                };
                
                this.currentAnimation = requestAnimationFrame(animate);
            }
            
            createExplosion(x, y) {
                for (let i = 0; i < 20; i++) {
                    this.particles.push({
                        x: x,
                        y: y,
                        vx: (Math.random() - 0.5) * 10,
                        vy: (Math.random() - 0.5) * 10,
                        life: 1,
                        decay: Math.random() * 0.02 + 0.01,
                        size: Math.random() * 5 + 2,
                        color: `hsl(${Math.random() * 360}, 70%, 60%)`
                    });
                }
            }
            
            particleDemo() {
                this.particles = [];
                this.animateParticles();
                
                // 自动创建粒子
                const interval = setInterval(() => {
                    if (this.particles.length < 100) {
                        this.createExplosion(
                            Math.random() * this.canvas.width,
                            Math.random() * this.canvas.height
                        );
                    }
                }, 200);
                
                setTimeout(() => {
                    clearInterval(interval);
                }, 5000);
            }
            
            updateParticles(deltaTime) {
                this.particles = this.particles.filter(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.vy += 0.3; // 重力
                    particle.life -= particle.decay;
                    return particle.life > 0;
                });
            }
            
            drawParticles() {
                this.particles.forEach(particle => {
                    this.ctx.save();
                    this.ctx.globalAlpha = particle.life;
                    this.ctx.fillStyle = particle.color;
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();
                });
            }
            
            clearCanvas() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            
            animateParticles() {
                const animate = () => {
                    this.clearCanvas();
                    this.updateParticles();
                    this.drawParticles();
                    
                    if (this.particles.length > 0) {
                        requestAnimationFrame(animate);
                    }
                };
                
                animate();
            }
        }
        
        // 初始化演示
        const demo = new AnimationDemo();
        
        console.log('动画展示器已加载！');
        console.log('点击按钮体验不同的动画效果');
        console.log('点击画布创建粒子爆炸效果');
    </script>
</body>
</html>
```

## 作业

1. 完成动画展示器项目
2. 实现自定义缓动函数
3. 创建复杂的路径动画（如贝塞尔曲线）
4. 开发简单的物理动画系统
5. 分析tessellation-evolved.tsx中的动画原理

## 下一课预告

第9课将学习图形数学，掌握动画和图形编程中的数学基础。
