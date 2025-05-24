# 第2课：CSS基础

## 学习目标

- 理解CSS的作用和语法
- 掌握CSS选择器
- 学会使用盒模型
- 掌握Flexbox和Grid布局
- 理解响应式设计基础

## CSS是什么？

CSS (Cascading Style Sheets) 层叠样式表，用于控制网页的**视觉呈现**。

### CSS的作用

- 控制布局
- 设置颜色和字体
- 添加动画效果
- 实现响应式设计

## CSS语法

```css
选择器 {
    属性: 值;
    属性: 值;
}
```

### 添加CSS的三种方式

1. **内联样式**

```html
<p style="color: red;">红色文字</p>
```

1. **内部样式表**

```html
<style>
    p { color: red; }
</style>
```

1. **外部样式表**（推荐）

```html
<link rel="stylesheet" href="style.css">
```

## CSS选择器

### 基本选择器

```css
/* 元素选择器 */
p { color: blue; }

/* 类选择器 */
.highlight { background: yellow; }

/* ID选择器 */
#header { font-size: 24px; }

/* 通用选择器 */
* { margin: 0; }
```

### 组合选择器

```css
/* 后代选择器 */
article p { line-height: 1.6; }

/* 子选择器 */
nav > ul { list-style: none; }

/* 相邻兄弟选择器 */
h1 + p { font-size: 18px; }

/* 属性选择器 */
input[type="text"] { border: 1px solid #ccc; }
```

## 盒模型 (Box Model)

每个HTML元素都是一个盒子，包含：

- **Content** - 内容
- **Padding** - 内边距
- **Border** - 边框
- **Margin** - 外边距

```css
.box {
    width: 300px;
    padding: 20px;
    border: 2px solid #333;
    margin: 10px;
}
```

## 常用CSS属性

### 文本样式

```css
.text {
    color: #333;
    font-size: 16px;
    font-family: Arial, sans-serif;
    font-weight: bold;
    text-align: center;
    line-height: 1.5;
    text-decoration: underline;
}
```

### 背景

```css
.background {
    background-color: #f0f0f0;
    background-image: url('image.jpg');
    background-size: cover;
    background-position: center;
}
```

### 定位

```css
.positioned {
    position: relative; /* 或 absolute, fixed, sticky */
    top: 10px;
    left: 20px;
    z-index: 10;
}
```

## Flexbox布局

Flexbox是一维布局方式，适合创建灵活的布局。

```css
.container {
    display: flex;
    justify-content: center;  /* 主轴对齐 */
    align-items: center;      /* 交叉轴对齐 */
    flex-direction: row;      /* 方向 */
    flex-wrap: wrap;          /* 换行 */
}

.item {
    flex: 1;  /* 弹性增长 */
}
```

## Grid布局

Grid是二维布局方式，适合创建复杂的网格布局。

```css
.grid-container {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-rows: 100px auto;
    gap: 20px;
}

.grid-item {
    grid-column: 1 / 3;  /* 跨列 */
    grid-row: 1 / 2;     /* 跨行 */
}
```

## 响应式设计

使用媒体查询创建适应不同屏幕的设计：

```css
/* 移动设备优先 */
.container {
    width: 100%;
}

/* 平板 */
@media (min-width: 768px) {
    .container {
        width: 750px;
    }
}

/* 桌面 */
@media (min-width: 1200px) {
    .container {
        width: 1170px;
    }
}
```

## 实践项目：美化简历页面

使用CSS美化第1课创建的简历页面：

1. 创建专业的配色方案
2. 使用Flexbox或Grid创建布局
3. 添加悬停效果
4. 实现响应式设计
5. 优化排版

## 作业

1. 为简历页面创建完整的CSS样式
2. 使用至少3种不同的选择器
3. 实现响应式布局
4. 添加简单的过渡动画

## 下一课预告

第3课将学习JavaScript，为网页添加交互功能。
