# 第5课：React入门

## 学习目标

- 理解React的核心概念和设计思想
- 掌握组件化开发思维
- 学会创建和使用React组件
- 理解props和state的概念
- 为学习tessellation-evolved.tsx打基础

## 什么是React？

React是Facebook开发的用于构建用户界面的JavaScript库。它采用组件化的开发方式，让复杂的UI可以被拆分成独立、可复用的组件。

### React的核心特点

1. **组件化**：将UI拆分成独立的组件
2. **声明式**：描述UI应该是什么样子，而不是如何操作DOM
3. **虚拟DOM**：高效的DOM更新机制
4. **单向数据流**：数据从父组件流向子组件

## 环境搭建

### 使用Vite创建React项目

```bash
# 创建新项目
npm create vite@latest my-react-app -- --template react

# 进入项目目录
cd my-react-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 项目结构

```text
my-react-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

## JSX语法

JSX是JavaScript的语法扩展，让我们可以在JavaScript中写类似HTML的代码。

### 基本JSX语法

```jsx
// 基本元素
const element = <h1>Hello, React!</h1>;

// 包含JavaScript表达式
const name = 'World';
const greeting = <h1>Hello, {name}!</h1>;

// 多行JSX
const element = (
  <div>
    <h1>标题</h1>
    <p>这是一段文字</p>
  </div>
);

// 条件渲染
const isLoggedIn = true;
const element = (
  <div>
    {isLoggedIn ? <h1>欢迎回来！</h1> : <h1>请登录</h1>}
  </div>
);

// 列表渲染
const items = ['苹果', '香蕉', '橙子'];
const listElement = (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);
```

### JSX规则

```jsx
// 1. 必须有一个根元素
// 错误
const element = (
  <h1>标题</h1>
  <p>段落</p>
);

// 正确 - 使用div包装
const element = (
  <div>
    <h1>标题</h1>
    <p>段落</p>
  </div>
);

// 正确 - 使用React.Fragment
const element = (
  <React.Fragment>
    <h1>标题</h1>
    <p>段落</p>
  </React.Fragment>
);

// 正确 - 使用空标签
const element = (
  <>
    <h1>标题</h1>
    <p>段落</p>
  </>
);

// 2. 属性名使用驼峰命名
<div className="container" onClick={handleClick}>
  <label htmlFor="input">标签</label>
  <input id="input" />
</div>

// 3. 自闭合标签必须闭合
<img src="image.jpg" alt="图片" />
<input type="text" />
<br />
```

## 函数组件

### 基本函数组件

```jsx
// 简单组件
function Welcome() {
  return <h1>欢迎使用React！</h1>;
}

// 箭头函数组件
const Welcome = () => {
  return <h1>欢迎使用React！</h1>;
};

// 使用组件
function App() {
  return (
    <div>
      <Welcome />
      <Welcome />
    </div>
  );
}
```

### 带参数的组件（Props）

```jsx
// 接收props的组件
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// 使用解构语法
function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>你今年 {age} 岁了</p>
    </div>
  );
}

// 使用组件并传递props
function App() {
  return (
    <div>
      <Greeting name="张三" age={25} />
      <Greeting name="李四" age={30} />
    </div>
  );
}

// 默认props
function Greeting({ name = "访客", age = 18 }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>你今年 {age} 岁了</p>
    </div>
  );
}
```

### Props类型和验证

```jsx
import PropTypes from 'prop-types';

function UserCard({ name, email, avatar, isOnline }) {
  return (
    <div className={`user-card ${isOnline ? 'online' : 'offline'}`}>
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
      <span className="status">
        {isOnline ? '在线' : '离线'}
      </span>
    </div>
  );
}

// Props类型验证
UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  isOnline: PropTypes.bool
};

// 默认props
UserCard.defaultProps = {
  avatar: '/default-avatar.png',
  isOnline: false
};
```

## 状态管理 (useState)

### 基本状态使用

```jsx
import { useState } from 'react';

function Counter() {
  // 声明状态变量
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div>
      <h2>计数器: {count}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </div>
  );
}
```

### 复杂状态管理

```jsx
import { useState } from 'react';

function UserForm() {
  // 对象状态
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 18
  });

  // 数组状态
  const [hobbies, setHobbies] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const addHobby = (hobby) => {
    setHobbies(prevHobbies => [...prevHobbies, hobby]);
  };

  const removeHobby = (index) => {
    setHobbies(prevHobbies => 
      prevHobbies.filter((_, i) => i !== index)
    );
  };

  return (
    <form>
      <input
        name="name"
        value={user.name}
        onChange={handleInputChange}
        placeholder="姓名"
      />
      <input
        name="email"
        value={user.email}
        onChange={handleInputChange}
        placeholder="邮箱"
      />
      <input
        name="age"
        type="number"
        value={user.age}
        onChange={handleInputChange}
      />
      
      <div>
        <h3>爱好列表:</h3>
        {hobbies.map((hobby, index) => (
          <div key={index}>
            {hobby}
            <button onClick={() => removeHobby(index)}>删除</button>
          </div>
        ))}
      </div>
    </form>
  );
}
```

## 事件处理

### 基本事件处理

```jsx
function Button() {
  const handleClick = (e) => {
    e.preventDefault();
    console.log('按钮被点击了！');
  };

  const handleMouseOver = () => {
    console.log('鼠标悬停');
  };

  return (
    <button 
      onClick={handleClick}
      onMouseOver={handleMouseOver}
    >
      点击我
    </button>
  );
}
```

### 传递参数的事件处理

```jsx
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: '学习React', completed: false },
    { id: 2, text: '做项目', completed: false }
  ]);

  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id 
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.filter(todo => todo.id !== id)
    );
  };

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <span 
            style={{ 
              textDecoration: todo.completed ? 'line-through' : 'none' 
            }}
            onClick={() => toggleTodo(todo.id)}
          >
            {todo.text}
          </span>
          <button onClick={() => deleteTodo(todo.id)}>删除</button>
        </li>
      ))}
    </ul>
  );
}
```

## 条件渲染

### 不同的条件渲染方式

```jsx
function UserProfile({ user, isLoading, error }) {
  // 1. 三元操作符
  if (isLoading) {
    return <div>加载中...</div>;
  }

  // 2. && 操作符
  if (error) {
    return <div>错误: {error.message}</div>;
  }

  return (
    <div>
      {user && (
        <div>
          <h1>{user.name}</h1>
          {user.avatar && <img src={user.avatar} alt={user.name} />}
          {user.isVip && <span className="vip-badge">VIP</span>}
        </div>
      )}
      
      {!user && <div>未找到用户</div>}
    </div>
  );
}

// 复杂条件渲染
function StatusIndicator({ status }) {
  const renderStatus = () => {
    switch (status) {
      case 'loading':
        return <span className="loading">⏳ 加载中</span>;
      case 'success':
        return <span className="success">✅ 成功</span>;
      case 'error':
        return <span className="error">❌ 错误</span>;
      default:
        return <span className="unknown">❓ 未知状态</span>;
    }
  };

  return <div>{renderStatus()}</div>;
}
```

## 列表渲染

### 基本列表渲染

```jsx
function ProductList({ products }) {
  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p className="price">¥{product.price}</p>
          <p className="description">{product.description}</p>
        </div>
      ))}
    </div>
  );
}

// 带筛选的列表
function FilterableProductList() {
  const [products] = useState([
    { id: 1, name: 'iPhone', price: 6999, category: 'phone' },
    { id: 2, name: 'iPad', price: 3999, category: 'tablet' },
    { id: 3, name: 'MacBook', price: 12999, category: 'laptop' }
  ]);
  
  const [filter, setFilter] = useState('all');

  const filteredProducts = products.filter(product => 
    filter === 'all' || product.category === filter
  );

  return (
    <div>
      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          全部
        </button>
        <button 
          className={filter === 'phone' ? 'active' : ''}
          onClick={() => setFilter('phone')}
        >
          手机
        </button>
        <button 
          className={filter === 'tablet' ? 'active' : ''}
          onClick={() => setFilter('tablet')}
        >
          平板
        </button>
      </div>
      
      <ProductList products={filteredProducts} />
    </div>
  );
}
```

## 表单处理

### 受控组件

```jsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: 'general',
    subscribe: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 清除相关错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '姓名是必填项';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '邮箱是必填项';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = '消息是必填项';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    console.log('提交表单:', formData);
    // 处理表单提交
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-group">
        <label htmlFor="name">姓名:</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">邮箱:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="category">类别:</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="general">一般咨询</option>
          <option value="support">技术支持</option>
          <option value="business">商务合作</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="message">消息:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className={errors.message ? 'error' : ''}
        />
        {errors.message && <span className="error-text">{errors.message}</span>}
      </div>

      <div className="form-group">
        <label>
          <input
            name="subscribe"
            type="checkbox"
            checked={formData.subscribe}
            onChange={handleChange}
          />
          订阅邮件通知
        </label>
      </div>

      <button type="submit">提交</button>
    </form>
  );
}
```

## 实践项目：React版待办事项

将之前的待办事项列表用React重写：

### 组件结构

```jsx
import { useState } from 'react';
import './TodoApp.css';

// 主应用组件
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date()
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const editTodo = (id, newText) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text: newText.trim() } : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  return (
    <div className="todo-app">
      <h1>📝 React 待办事项</h1>
      
      <TodoForm onAddTodo={addTodo} />
      
      <FilterButtons 
        currentFilter={filter}
        onFilterChange={setFilter}
      />
      
      <TodoList
        todos={filteredTodos}
        onToggleTodo={toggleTodo}
        onDeleteTodo={deleteTodo}
        onEditTodo={editTodo}
      />
      
      <TodoStats
        totalCount={todos.length}
        activeCount={activeCount}
        completedCount={completedCount}
        onClearCompleted={clearCompleted}
      />
    </div>
  );
}

// 添加任务表单组件
function TodoForm({ onAddTodo }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTodo(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="添加新任务..."
        className="todo-input"
      />
      <button type="submit" className="add-button">添加</button>
    </form>
  );
}

// 筛选按钮组件
function FilterButtons({ currentFilter, onFilterChange }) {
  const filters = [
    { key: 'all', label: '全部' },
    { key: 'active', label: '进行中' },
    { key: 'completed', label: '已完成' }
  ];

  return (
    <div className="filter-buttons">
      {filters.map(filter => (
        <button
          key={filter.key}
          className={currentFilter === filter.key ? 'active' : ''}
          onClick={() => onFilterChange(filter.key)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

// 任务列表组件
function TodoList({ todos, onToggleTodo, onDeleteTodo, onEditTodo }) {
  if (todos.length === 0) {
    return <div className="empty-state">暂无任务</div>;
  }

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggleTodo(todo.id)}
          onDelete={() => onDeleteTodo(todo.id)}
          onEdit={(newText) => onEditTodo(todo.id, newText)}
        />
      ))}
    </ul>
  );
}

// 单个任务项组件
function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(editText);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
        className="todo-checkbox"
      />
      
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="edit-input"
          autoFocus
        />
      ) : (
        <span className="todo-text" onClick={onToggle}>
          {todo.text}
        </span>
      )}
      
      <div className="todo-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="save-button">保存</button>
            <button onClick={handleCancel} className="cancel-button">取消</button>
          </>
        ) : (
          <>
            <button onClick={handleEdit} className="edit-button">编辑</button>
            <button onClick={onDelete} className="delete-button">删除</button>
          </>
        )}
      </div>
    </li>
  );
}

// 统计信息组件
function TodoStats({ totalCount, activeCount, completedCount, onClearCompleted }) {
  return (
    <div className="todo-stats">
      <span className="count-info">
        总共 {totalCount} 个任务，{activeCount} 个进行中
      </span>
      
      {completedCount > 0 && (
        <button onClick={onClearCompleted} className="clear-button">
          清除已完成 ({completedCount})
        </button>
      )}
    </div>
  );
}

export default TodoApp;
```

## 作业

1. 完成React版待办事项列表
2. 添加任务优先级功能
3. 实现任务搜索功能
4. 添加任务分类功能
5. 尝试将其他项目改写为React版本

## 下一课预告

第6课将学习React Hooks，掌握更高级的状态管理和副作用处理技术。
