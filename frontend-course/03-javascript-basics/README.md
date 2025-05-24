# 第3课：JavaScript基础

## 学习目标

- 理解JavaScript的作用和特点
- 掌握变量、数据类型和函数
- 学会使用控制流程语句
- 理解作用域和闭包基础概念
- 掌握数组和对象操作

## JavaScript是什么？

JavaScript是一种编程语言，为网页添加**交互性**和**动态功能**。

### JavaScript的特点

- 解释型语言（不需要编译）
- 动态类型（变量类型可以改变）
- 基于原型的面向对象
- 事件驱动编程

## 变量和数据类型

### 声明变量

```javascript
// ES6+ 推荐语法
let name = "张三";        // 可变变量
const age = 25;          // 常量
var oldStyle = "不推荐"; // 旧语法（有作用域问题）
```

### 基本数据类型

```javascript
// 数字 (Number)
let score = 95;
let price = 19.99;

// 字符串 (String)
let message = "Hello World";
let template = `我的分数是 ${score}`;  // 模板字符串

// 布尔值 (Boolean)
let isActive = true;
let isCompleted = false;

// 未定义 (Undefined)
let unknown;

// 空值 (Null)
let data = null;

// 符号 (Symbol) - ES6新增
let id = Symbol('id');
```

### 复合数据类型

```javascript
// 数组 (Array)
let colors = ['red', 'green', 'blue'];
let numbers = [1, 2, 3, 4, 5];

// 对象 (Object)
let person = {
    name: '李四',
    age: 30,
    city: '北京'
};
```

## 函数

### 函数声明

```javascript
// 函数声明
function greet(name) {
    return "Hello, " + name + "!";
}

// 函数表达式
const calculateArea = function(width, height) {
    return width * height;
};

// 箭头函数 (ES6+)
const multiply = (a, b) => a * b;

// 立即执行函数
(function() {
    console.log("立即执行！");
})();
```

### 参数和返回值

```javascript
function processOrder(item, quantity = 1, discount = 0) {
    // 默认参数
    const subtotal = item.price * quantity;
    const total = subtotal * (1 - discount);
    
    return {
        item: item.name,
        quantity: quantity,
        subtotal: subtotal,
        total: total
    };
}
```

## 控制流程

### 条件语句

```javascript
// if...else
let weather = "sunny";
if (weather === "sunny") {
    console.log("去公园");
} else if (weather === "rainy") {
    console.log("待在家里");
} else {
    console.log("看情况决定");
}

// 三元运算符
let message = age >= 18 ? "成年人" : "未成年人";

// switch语句
switch (weather) {
    case "sunny":
        console.log("去公园");
        break;
    case "rainy":
        console.log("待在家里");
        break;
    default:
        console.log("看情况决定");
}
```

### 循环语句

```javascript
// for循环
for (let i = 0; i < 5; i++) {
    console.log(i);
}

// while循环
let count = 0;
while (count < 3) {
    console.log(count);
    count++;
}

// for...of (遍历值)
let fruits = ['apple', 'banana', 'orange'];
for (let fruit of fruits) {
    console.log(fruit);
}

// for...in (遍历键)
let person = {name: '王五', age: 28};
for (let key in person) {
    console.log(key + ": " + person[key]);
}
```

## 数组操作

```javascript
let numbers = [1, 2, 3, 4, 5];

// 添加元素
numbers.push(6);           // 末尾添加
numbers.unshift(0);        // 开头添加

// 删除元素
numbers.pop();             // 删除末尾
numbers.shift();           // 删除开头

// 查找元素
let index = numbers.indexOf(3);    // 查找索引
let exists = numbers.includes(4);  // 是否存在

// 数组方法
let doubled = numbers.map(n => n * 2);         // 映射
let evens = numbers.filter(n => n % 2 === 0);  // 过滤
let sum = numbers.reduce((a, b) => a + b, 0);  // 归约
```

## 对象操作

```javascript
let student = {
    name: '小明',
    age: 20,
    subjects: ['数学', '英语']
};

// 访问属性
console.log(student.name);        // 点记法
console.log(student['age']);      // 括号记法

// 添加/修改属性
student.grade = 'A';              // 添加新属性
student.age = 21;                 // 修改现有属性

// 删除属性
delete student.age;

// 遍历对象
for (let key in student) {
    console.log(key + ": " + student[key]);
}

// 对象方法
let keys = Object.keys(student);       // 获取所有键
let values = Object.values(student);   // 获取所有值
```

## 作用域和this

### 作用域

```javascript
let globalVar = "全局变量";

function example() {
    let localVar = "局部变量";
    
    if (true) {
        let blockVar = "块级变量";
        console.log(globalVar);  // 可以访问
        console.log(localVar);   // 可以访问
        console.log(blockVar);   // 可以访问
    }
    
    // console.log(blockVar);  // 错误！无法访问
}
```

### 闭包基础

```javascript
function createCounter() {
    let count = 0;
    
    return function() {
        count++;
        return count;
    };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

## 错误处理

```javascript
try {
    let result = riskyOperation();
    console.log(result);
} catch (error) {
    console.log("发生错误: " + error.message);
} finally {
    console.log("清理工作");
}

// 抛出自定义错误
function divide(a, b) {
    if (b === 0) {
        throw new Error("除数不能为零");
    }
    return a / b;
}
```

## 实践项目：互动计算器

创建一个具有以下功能的计算器：

1. 基本数学运算（加减乘除）
2. 历史记录功能
3. 清除功能
4. 错误处理

## 作业

1. 完成互动计算器项目
2. 实现至少5个不同的数组方法
3. 创建包含嵌套对象的数据结构
4. 添加输入验证和错误处理

## 下一课预告

第4课将学习DOM操作，让JavaScript与HTML页面交互。
