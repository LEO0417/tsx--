# 第1课：HTML基础

## 学习目标

- 理解HTML的作用和基本结构
- 掌握常用HTML标签
- 学会创建语义化的网页结构
- 理解HTML5的新特性

## HTML是什么？

HTML (HyperText Markup Language) 是用于创建网页的标准标记语言。它描述了网页的**结构**和**内容**。

### HTML的特点

- 不是编程语言，是标记语言
- 使用标签（tags）来标记内容
- 浏览器解释HTML并显示网页

## HTML文档基本结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题</title>
</head>
<body>
    <!-- 页面内容 -->
</body>
</html>
```

### 结构说明

- `<!DOCTYPE html>` - 声明这是HTML5文档
- `<html>` - 根元素
- `<head>` - 包含元数据（不显示在页面上）
- `<body>` - 包含可见的页面内容

## 常用HTML标签

### 文本标签

- `<h1>` 到 `<h6>` - 标题
- `<p>` - 段落
- `<span>` - 行内文本
- `<strong>` - 重要文本（粗体）
- `<em>` - 强调文本（斜体）

### 结构标签

- `<div>` - 块级容器
- `<section>` - 文档节
- `<article>` - 独立内容
- `<header>` - 页头
- `<footer>` - 页脚
- `<nav>` - 导航

### 列表标签

- `<ul>` - 无序列表
- `<ol>` - 有序列表
- `<li>` - 列表项

### 链接和图片

- `<a href="url">` - 超链接
- `<img src="url" alt="描述">` - 图片

### 表单标签

- `<form>` - 表单容器
- `<input>` - 输入框
- `<button>` - 按钮
- `<select>` - 下拉菜单
- `<textarea>` - 文本域

## 语义化HTML

语义化意味着使用正确的标签来描述内容的含义：

```html
<!-- 好的例子 -->
<nav>
    <ul>
        <li><a href="#home">首页</a></li>
        <li><a href="#about">关于</a></li>
    </ul>
</nav>

<!-- 不好的例子 -->
<div class="navigation">
    <div class="list">
        <div class="item"><a href="#home">首页</a></div>
    </div>
</div>
```

## 实践项目：个人简历页面

创建一个包含以下内容的个人简历页面：

1. 页面标题和个人信息
2. 教育背景（使用列表）
3. 工作经验（使用语义化标签）
4. 技能列表
5. 联系方式（使用表单）

## 作业

1. 完成个人简历页面
2. 使用至少10种不同的HTML标签
3. 确保页面语义化
4. 添加适当的注释

## 下一课预告

第2课将学习CSS，让你的HTML页面变得美观。
