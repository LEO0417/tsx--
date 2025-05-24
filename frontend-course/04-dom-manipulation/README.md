# 第4课：DOM操作

## 学习目标

- 理解DOM树结构和节点概念
- 掌握元素选择和操作方法
- 学会事件处理和事件委托
- 为React学习打好基础

## DOM是什么？

DOM (Document Object Model) 文档对象模型，是HTML文档的编程接口。它将网页转换为JavaScript可以操作的对象树。

### DOM树结构

```text
document
└── html
    ├── head
    │   ├── title
    │   └── meta
    └── body
        ├── header
        ├── main
        └── footer
```

## 元素选择

### 基本选择方法

```javascript
// 通过ID选择
const element = document.getElementById('myId');

// 通过类名选择
const elements = document.getElementsByClassName('myClass');

// 通过标签名选择
const divs = document.getElementsByTagName('div');

// 通过CSS选择器选择
const element = document.querySelector('.myClass');
const elements = document.querySelectorAll('p.highlight');
```

### 现代选择器（推荐）

```javascript
// 选择单个元素
const header = document.querySelector('header');
const firstButton = document.querySelector('button');

// 选择多个元素
const allButtons = document.querySelectorAll('button');
const menuItems = document.querySelectorAll('.menu-item');

// 复杂选择器
const activeLinks = document.querySelectorAll('nav a.active');
const formInputs = document.querySelectorAll('form input[type="text"]');
```

## 元素操作

### 内容操作

```javascript
const element = document.querySelector('#content');

// 获取/设置文本内容
console.log(element.textContent);
element.textContent = '新的文本内容';

// 获取/设置HTML内容
console.log(element.innerHTML);
element.innerHTML = '<p>新的HTML内容</p>';

// 安全的文本设置（防止XSS）
element.textContent = userInput; // 推荐
```

### 属性操作

```javascript
const img = document.querySelector('img');

// 获取/设置属性
const src = img.getAttribute('src');
img.setAttribute('src', 'new-image.jpg');

// 删除属性
img.removeAttribute('alt');

// 常用属性的直接访问
img.src = 'direct-access.jpg';
img.alt = '图片描述';

// 数据属性
element.dataset.userId = '123';
console.log(element.dataset.userId);
```

### 样式操作

```javascript
const box = document.querySelector('.box');

// 直接设置样式
box.style.backgroundColor = '#ff6b6b';
box.style.width = '200px';
box.style.transform = 'rotate(45deg)';

// 批量设置样式
Object.assign(box.style, {
    backgroundColor: '#4ecdc4',
    borderRadius: '10px',
    padding: '20px'
});

// CSS类操作
box.classList.add('active');
box.classList.remove('hidden');
box.classList.toggle('highlight');
box.classList.contains('visible');
```

## 创建和插入元素

### 创建元素

```javascript
// 创建新元素
const newDiv = document.createElement('div');
newDiv.textContent = '这是新创建的div';
newDiv.className = 'new-element';

// 创建文本节点
const textNode = document.createTextNode('纯文本节点');

// 克隆元素
const original = document.querySelector('.template');
const clone = original.cloneNode(true); // true表示深克隆
```

### 插入元素

```javascript
const container = document.querySelector('#container');
const newElement = document.createElement('p');

// 插入到末尾
container.appendChild(newElement);

// 插入到开头
container.insertBefore(newElement, container.firstChild);

// 现代插入方法
container.prepend(newElement);        // 插入到开头
container.append(newElement);         // 插入到末尾
container.before(newElement);         // 插入到容器前面
container.after(newElement);          // 插入到容器后面

// 插入HTML字符串
container.insertAdjacentHTML('beforeend', '<p>新段落</p>');
```

### 删除元素

```javascript
const element = document.querySelector('.to-remove');

// 传统方法
element.parentNode.removeChild(element);

// 现代方法（推荐）
element.remove();

// 清空容器
container.innerHTML = '';
// 或者
while (container.firstChild) {
    container.removeChild(container.firstChild);
}
```

## 事件处理

### 基本事件监听

```javascript
const button = document.querySelector('#myButton');

// 添加事件监听器
button.addEventListener('click', function(event) {
    console.log('按钮被点击了！');
    console.log('事件对象:', event);
});

// 箭头函数写法
button.addEventListener('click', (event) => {
    event.preventDefault(); // 阻止默认行为
    event.stopPropagation(); // 阻止事件冒泡
});

// 移除事件监听器
function handleClick(event) {
    console.log('处理点击');
}
button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick);
```

### 常用事件类型

```javascript
// 鼠标事件
element.addEventListener('click', handleClick);
element.addEventListener('dblclick', handleDoubleClick);
element.addEventListener('mousedown', handleMouseDown);
element.addEventListener('mouseup', handleMouseUp);
element.addEventListener('mouseover', handleMouseOver);
element.addEventListener('mouseout', handleMouseOut);

// 键盘事件
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// 表单事件
form.addEventListener('submit', handleSubmit);
input.addEventListener('input', handleInput);
input.addEventListener('change', handleChange);
input.addEventListener('focus', handleFocus);
input.addEventListener('blur', handleBlur);

// 窗口事件
window.addEventListener('load', handleLoad);
window.addEventListener('resize', handleResize);
window.addEventListener('scroll', handleScroll);
```

### 事件对象详解

```javascript
button.addEventListener('click', function(event) {
    // 事件类型
    console.log('事件类型:', event.type);
    
    // 触发事件的元素
    console.log('目标元素:', event.target);
    
    // 绑定事件的元素
    console.log('当前元素:', event.currentTarget);
    
    // 鼠标位置
    console.log('鼠标坐标:', event.clientX, event.clientY);
    
    // 键盘事件
    console.log('按键码:', event.keyCode);
    console.log('按键:', event.key);
    
    // 修饰键
    console.log('Ctrl键:', event.ctrlKey);
    console.log('Shift键:', event.shiftKey);
});
```

### 事件委托

```javascript
// 事件委托：在父元素上监听子元素的事件
const list = document.querySelector('#task-list');

list.addEventListener('click', function(event) {
    // 检查点击的是否是删除按钮
    if (event.target.classList.contains('delete-btn')) {
        const taskItem = event.target.closest('.task-item');
        taskItem.remove();
    }
    
    // 检查点击的是否是任务文本
    if (event.target.classList.contains('task-text')) {
        event.target.classList.toggle('completed');
    }
});
```

## 表单处理

### 表单验证

```javascript
const form = document.querySelector('#user-form');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止表单默认提交
    
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // 验证逻辑
    if (!isValidEmail(email)) {
        showError('请输入有效的邮箱地址');
        return;
    }
    
    if (password.length < 8) {
        showError('密码至少需要8个字符');
        return;
    }
    
    // 提交数据
    submitForm(formData);
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
```

### 动态表单

```javascript
// 动态添加输入字段
function addInputField() {
    const container = document.querySelector('#input-container');
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.name = 'dynamic-field[]';
    newInput.placeholder = '输入内容...';
    
    container.appendChild(newInput);
}

// 实时输入验证
const emailInput = document.querySelector('#email');
emailInput.addEventListener('input', function(event) {
    const email = event.target.value;
    const isValid = isValidEmail(email);
    
    event.target.classList.toggle('valid', isValid);
    event.target.classList.toggle('invalid', !isValid);
});
```

## 实践项目：待办事项列表

创建一个功能完整的待办事项应用：

### HTML结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>待办事项列表</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>待办事项</h1>
        
        <form id="todo-form">
            <input type="text" id="todo-input" placeholder="添加新任务..." required>
            <button type="submit">添加</button>
        </form>
        
        <div class="filters">
            <button class="filter-btn active" data-filter="all">全部</button>
            <button class="filter-btn" data-filter="active">进行中</button>
            <button class="filter-btn" data-filter="completed">已完成</button>
        </div>
        
        <ul id="todo-list"></ul>
        
        <div class="stats">
            <span id="todo-count">0 个任务</span>
            <button id="clear-completed">清除已完成</button>
        </div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>
```

### 功能实现

1. 添加新任务
2. 标记任务完成/未完成
3. 删除任务
4. 筛选任务（全部/进行中/已完成）
5. 统计任务数量
6. 清除所有已完成任务
7. 数据持久化（localStorage）

## 作业

1. 完成待办事项列表项目
2. 添加编辑任务功能
3. 实现任务拖拽排序
4. 添加任务优先级设置

## 下一课预告

第5课将学习React入门，理解现代前端框架的组件化思维。
