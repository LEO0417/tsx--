# 第12课：部署与优化

## 学习目标

- 掌握前端项目打包流程
- 学会性能优化技巧
- 理解部署到生产环境的完整流程
- 为Vibe Coding实战做好准备

## 项目打包

### 1. 创建React项目

```bash
npx create-react-app tessellation-project --template typescript
cd tessellation-project
```

### 2. 集成tessellation-evolved组件

```typescript
// src/components/TessellationEvolved.tsx
import React, { useEffect, useRef } from 'react';

const EvolvingTessellationPatterns: React.FC = () => {
  // 原有代码
};

export default EvolvingTessellationPatterns;
```

### 3. 应用入口

```typescript
// src/App.tsx
import TessellationEvolved from './components/TessellationEvolved';

function App() {
  return (
    <div className="App">
      <header>
        <h1>进化几何图案展示</h1>
      </header>
      <main>
        <TessellationEvolved />
      </main>
    </div>
  );
}

export default App;
```

## 性能优化

### 1. 代码分割

```typescript
// 懒加载组件
const TessellationEvolved = React.lazy(() => import('./components/TessellationEvolved'));

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <TessellationEvolved />
    </Suspense>
  );
}
```

### 2. Canvas优化

```typescript
// 使用Web Workers进行复杂计算
const worker = new Worker('/workers/tessellation-worker.js');

// 离屏Canvas
const offscreenCanvas = new OffscreenCanvas(800, 600);
const offscreenCtx = offscreenCanvas.getContext('2d');
```

### 3. 内存优化

```typescript
// 对象池模式
class TilePool {
  private pool: Tile[] = [];
  
  acquire(): Tile {
    return this.pool.pop() || new Tile();
  }
  
  release(tile: Tile): void {
    tile.reset();
    this.pool.push(tile);
  }
}
```

### 4. 渲染优化

```typescript
// 帧率控制
let lastTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

function animate(currentTime: number) {
  if (currentTime - lastTime >= frameInterval) {
    // 渲染逻辑
    lastTime = currentTime;
  }
  requestAnimationFrame(animate);
}
```

## 部署配置

### 1. 环境变量

```bash
# .env.production
REACT_APP_API_URL=https://api.production.com
REACT_APP_CANVAS_QUALITY=high
REACT_APP_ANIMATION_FPS=60
```

### 2. 构建优化

```json
// package.json
{
  "scripts": {
    "build": "react-scripts build",
    "build:analyze": "npm run build && npx bundle-analyzer build/static/js/*.js"
  }
}
```

### 3. Webpack配置优化

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        canvas: {
          test: /canvas|animation/,
          name: 'canvas',
          chunks: 'all',
        }
      }
    }
  }
};
```

## 部署方案

### 1. 静态托管 (Vercel)

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录并部署
vercel login
vercel --prod
```

```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 2. CDN部署 (Netlify)

```toml
# netlify.toml
[build]
  publish = "build"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  REACT_APP_CANVAS_QUALITY = "high"
```

### 3. 容器化部署 (Docker)

```dockerfile
# Dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Vibe Coding 项目配置

### 1. 项目结构

```text
tessellation-vibe/
├── src/
│   ├── components/
│   │   └── TessellationEvolved.tsx
│   ├── workers/
│   │   └── tessellation-worker.ts
│   ├── utils/
│   │   └── performance.ts
│   └── config/
│       └── animation.ts
├── public/
├── docs/
│   └── API.md
├── package.json
├── tsconfig.json
└── vibe.config.json
```

### 2. Vibe配置文件

```json
// vibe.config.json
{
  "project": {
    "name": "tessellation-evolved",
    "version": "1.0.0",
    "type": "frontend-animation",
    "framework": "react-typescript"
  },
  "tasks": {
    "setup": {
      "description": "项目初始化",
      "command": "npm install",
      "timeout": 300,
      "requirements": ["node>=16"]
    },
    "build": {
      "description": "构建生产版本",
      "command": "npm run build",
      "timeout": 600,
      "dependencies": ["setup"]
    },
    "test": {
      "description": "运行测试",
      "command": "npm test -- --coverage",
      "timeout": 300,
      "dependencies": ["setup"]
    },
    "deploy": {
      "description": "部署到生产环境",
      "command": "vercel --prod",
      "timeout": 900,
      "dependencies": ["build", "test"]
    }
  },
  "performance": {
    "bundle_size_limit": "2MB",
    "lighthouse_score": 90,
    "core_web_vitals": {
      "LCP": 2.5,
      "FID": 100,
      "CLS": 0.1
    }
  },
  "monitoring": {
    "error_tracking": true,
    "performance_monitoring": true,
    "user_analytics": false
  }
}
```

### 3. 任务节点说明

```yaml
# 任务流程图
setup: 环境准备
  ↓
build: 代码构建
  ↓
test: 质量检查
  ↓
deploy: 生产部署
  ↓
monitor: 性能监控
```

## 性能监控

### 1. 监控指标

```typescript
// src/utils/performance.ts
export class PerformanceMonitor {
  private frameCount = 0;
  private lastFPSUpdate = 0;
  private fps = 0;

  updateFPS() {
    this.frameCount++;
    const now = performance.now();
    
    if (now - this.lastFPSUpdate >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFPSUpdate = now;
      
      console.log(`FPS: ${this.fps}`);
    }
  }

  measureMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }
}
```

### 2. 错误边界

```typescript
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Canvas animation error:', error, errorInfo);
    // 发送到监控服务
  }

  render() {
    if (this.state.hasError) {
      return <div>动画渲染出错，请刷新页面</div>;
    }

    return this.props.children;
  }
}
```

## 质量保证

### 1. 自动化测试

```typescript
// src/__tests__/TessellationEvolved.test.tsx
import { render, screen } from '@testing-library/react';
import TessellationEvolved from '../components/TessellationEvolved';

describe('TessellationEvolved', () => {
  test('renders canvas element', () => {
    render(<TessellationEvolved />);
    const canvas = screen.getByRole('img');
    expect(canvas).toBeInTheDocument();
  });

  test('animation starts on mount', async () => {
    const { container } = render(<TessellationEvolved />);
    const canvas = container.querySelector('canvas');
    
    // 验证canvas尺寸
    expect(canvas).toHaveAttribute('width', '550');
    expect(canvas).toHaveAttribute('height', '550');
  });
});
```

### 2. 端到端测试

```typescript
// e2e/tessellation.spec.ts
import { test, expect } from '@playwright/test';

test('tessellation animation loads and runs', async ({ page }) => {
  await page.goto('/');
  
  // 等待canvas加载
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  
  // 验证动画运行
  await page.waitForTimeout(2000);
  
  // 截图对比
  await expect(page).toHaveScreenshot('tessellation-animation.png');
});
```

## 总结

完成这个部署流程后，你将掌握：

### 技术能力

- ✅ React + TypeScript 项目开发
- ✅ Canvas动画性能优化
- ✅ 现代前端构建工具使用
- ✅ 生产环境部署配置

### Vibe Coding 技能

- ✅ 项目需求分析和评估
- ✅ 任务节点规划和执行
- ✅ 性能指标监控和优化
- ✅ 自动化测试和质量保证

### 实战经验

- ✅ 复杂动画系统的设计
- ✅ 大型前端项目的架构
- ✅ 团队协作和代码规范
- ✅ 持续集成和部署(CI/CD)

现在你已经具备了在 Vibe Coding 中高效工作的所有技能！🚀
