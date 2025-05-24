# 第6课：React Hooks

## 学习目标

- 深入理解React Hooks的设计理念
- 掌握常用Hooks的使用方法
- 学会创建自定义Hooks
- 理解tessellation-evolved.tsx中的Hooks使用
- 为高级动画开发做准备

## Hooks简介

React Hooks是React 16.8引入的新特性，让你可以在函数组件中使用状态和其他React特性。Hooks解决了类组件的复杂性问题，让代码更简洁、可复用。

### Hooks的优势

1. **更简洁的代码**：无需使用类组件
2. **更好的逻辑复用**：通过自定义Hooks
3. **更细粒度的状态管理**：避免复杂的状态合并
4. **更好的性能优化**：精确控制重渲染

## useState - 状态管理

### 基本用法

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  // 函数式更新
  const increment = () => {
    setCount(prevCount => prevCount + 1);
  };
  
  // 直接更新
  const reset = () => {
    setCount(0);
  };
  
  return (
    <div>
      <p>当前计数: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={reset}>重置</button>
    </div>
  );
}
```

### 复杂状态管理

```jsx
function UserProfile() {
  // 对象状态
  const [user, setUser] = useState({
    name: '',
    email: '',
    preferences: {
      theme: 'light',
      notifications: true
    }
  });
  
  // 嵌套状态更新
  const updateName = (newName) => {
    setUser(prevUser => ({
      ...prevUser,
      name: newName
    }));
  };
  
  const updateTheme = (theme) => {
    setUser(prevUser => ({
      ...prevUser,
      preferences: {
        ...prevUser.preferences,
        theme
      }
    }));
  };
  
  // 数组状态
  const [todos, setTodos] = useState([]);
  
  const addTodo = (text) => {
    setTodos(prevTodos => [
      ...prevTodos,
      { id: Date.now(), text, completed: false }
    ]);
  };
  
  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  return (
    <div>
      <input 
        value={user.name}
        onChange={(e) => updateName(e.target.value)}
        placeholder="姓名"
      />
      <button onClick={() => updateTheme('dark')}>
        切换到暗黑主题
      </button>
    </div>
  );
}
```

## useEffect - 副作用处理

### useEffect基本用法

```jsx
import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);
  
  // 组件挂载和更新时执行
  useEffect(() => {
    document.title = `计时器: ${seconds}秒`;
  });
  
  // 只在挂载时执行一次
  useEffect(() => {
    console.log('组件已挂载');
  }, []); // 空依赖数组
  
  // 依赖特定值
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    
    // 清理函数
    return () => {
      clearInterval(interval);
    };
  }, []); // 只在挂载时设置，卸载时清理
  
  return (
    <div>
      <p>已运行 {seconds} 秒</p>
    </div>
  );
}
```

### 数据获取

```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        const userData = await response.json();
        
        if (!cancelled) {
          setUsers(userData);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    
    fetchUsers();
    
    // 清理函数：防止内存泄漏
    return () => {
      cancelled = true;
    };
  }, []); // 只在挂载时获取
  
  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 监听依赖变化

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    
    const searchTimeout = setTimeout(async () => {
      const response = await fetch(`/api/search?q=${query}`);
      const data = await response.json();
      setResults(data);
    }, 300); // 防抖
    
    return () => {
      clearTimeout(searchTimeout);
    };
  }, [query]); // 依赖query变化
  
  return (
    <div>
      {results.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

## useContext - 上下文传递

### useContext基本用法

```jsx
import { createContext, useContext, useState } from 'react';

// 创建上下文
const ThemeContext = createContext();
const UserContext = createContext();

// 提供者组件
function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState({ name: '张三', role: 'admin' });
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Header />
        <Main />
        <Footer />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

// 消费上下文
function Header() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  
  return (
    <header className={`header-${theme}`}>
      <h1>欢迎, {user.name}</h1>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        切换主题
      </button>
    </header>
  );
}

// 自定义Hook简化上下文使用
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme必须在ThemeProvider中使用');
  }
  return context;
}

function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser必须在UserProvider中使用');
  }
  return context;
}
```

## useReducer - 复杂状态管理

### useReducer基本用法

```jsx
import { useReducer } from 'react';

// 定义状态和动作类型
const initialState = {
  todos: [],
  filter: 'all'
};

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false
          }
        ]
      };
      
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
      
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
      
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };
      
    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };
      
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  
  const addTodo = (text) => {
    dispatch({ type: 'ADD_TODO', payload: text });
  };
  
  const toggleTodo = (id) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };
  
  const deleteTodo = (id) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };
  
  const setFilter = (filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };
  
  const clearCompleted = () => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  };
  
  const filteredTodos = state.todos.filter(todo => {
    switch (state.filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });
  
  return (
    <div>
      <TodoForm onAddTodo={addTodo} />
      <FilterButtons 
        currentFilter={state.filter}
        onFilterChange={setFilter}
      />
      <TodoList
        todos={filteredTodos}
        onToggleTodo={toggleTodo}
        onDeleteTodo={deleteTodo}
      />
      <TodoStats
        todos={state.todos}
        onClearCompleted={clearCompleted}
      />
    </div>
  );
}
```

## useRef - 引用和DOM访问

### DOM引用

```jsx
import { useRef, useEffect } from 'react';

function FocusInput() {
  const inputRef = useRef(null);
  
  useEffect(() => {
    // 组件挂载时自动聚焦
    inputRef.current.focus();
  }, []);
  
  const handleClick = () => {
    inputRef.current.focus();
    inputRef.current.select();
  };
  
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>聚焦输入框</button>
    </div>
  );
}
```

### 保存可变值

```jsx
function Timer() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);
  const countRef = useRef(0);
  
  const start = () => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      countRef.current += 1;
      setCount(countRef.current);
    }, 1000);
  };
  
  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  const reset = () => {
    stop();
    countRef.current = 0;
    setCount(0);
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return (
    <div>
      <p>计时: {count}秒</p>
      <button onClick={start}>开始</button>
      <button onClick={stop}>停止</button>
      <button onClick={reset}>重置</button>
    </div>
  );
}
```

## useMemo 和 useCallback - 性能优化

### useMemo - 缓存计算结果

```jsx
import { useState, useMemo } from 'react';

function ExpensiveList({ items, filter }) {
  // 缓存过滤后的结果
  const filteredItems = useMemo(() => {
    console.log('重新过滤数据'); // 只在items或filter变化时执行
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);
  
  // 缓存统计数据
  const stats = useMemo(() => {
    return {
      total: filteredItems.length,
      completed: filteredItems.filter(item => item.completed).length
    };
  }, [filteredItems]);
  
  return (
    <div>
      <p>显示 {stats.completed}/{stats.total} 项</p>
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### useCallback - 缓存函数

```jsx
import { useState, useCallback, memo } from 'react';

// 子组件使用React.memo优化
const TodoItem = memo(function TodoItem({ todo, onToggle, onDelete }) {
  console.log('TodoItem渲染:', todo.text);
  
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>删除</button>
    </li>
  );
});

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('');
  
  // 缓存回调函数，避免子组件不必要的重渲染
  const handleToggle = useCallback((id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []); // 不依赖任何值
  
  const handleDelete = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);
  
  const filteredTodos = useMemo(() => {
    return todos.filter(todo =>
      todo.text.toLowerCase().includes(filter.toLowerCase())
    );
  }, [todos, filter]);
  
  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="搜索任务..."
      />
      <ul>
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}
```

## 自定义Hooks

### 通用状态管理Hook

```jsx
function useLocalStorage(key, initialValue) {
  // 从localStorage读取初始值
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });
  
  // 设置值的函数
  const setValue = (value) => {
    try {
      // 允许值是函数，支持函数式更新
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };
  
  return [storedValue, setValue];
}

// 使用示例
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'zh');
  
  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        切换主题: {theme}
      </button>
      <button onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}>
        切换语言: {language}
      </button>
    </div>
  );
}
```

### 数据获取Hook

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      cancelled = true;
    };
  }, [url]);
  
  return { data, loading, error };
}

// 使用示例
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);
  
  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  
  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
    </div>
  );
}
```

### 动画Hook（为tessellation项目准备）

```jsx
function useAnimation(duration = 1000) {
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef();
  const startTimeRef = useRef();
  
  const start = useCallback(() => {
    setIsAnimating(true);
    startTimeRef.current = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      setProgress(progress);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, [duration]);
  
  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      setIsAnimating(false);
    }
  }, []);
  
  const reset = useCallback(() => {
    stop();
    setProgress(0);
  }, [stop]);
  
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return {
    progress,
    isAnimating,
    start,
    stop,
    reset
  };
}

// 使用示例
function AnimatedProgress() {
  const { progress, isAnimating, start, stop, reset } = useAnimation(2000);
  
  return (
    <div>
      <div 
        style={{
          width: '300px',
          height: '20px',
          backgroundColor: '#f0f0f0',
          borderRadius: '10px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            backgroundColor: '#4caf50',
            transition: 'width 0.1s ease'
          }}
        />
      </div>
      <p>进度: {Math.round(progress * 100)}%</p>
      <button onClick={start} disabled={isAnimating}>
        开始动画
      </button>
      <button onClick={stop} disabled={!isAnimating}>
        停止动画
      </button>
      <button onClick={reset}>
        重置
      </button>
    </div>
  );
}
```

### Canvas绘制Hook

```jsx
function useCanvas() {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      setContext(ctx);
    }
  }, []);
  
  const clearCanvas = useCallback(() => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [context]);
  
  const resizeCanvas = useCallback(() => {
    if (canvasRef.current) {
      const { offsetWidth, offsetHeight } = canvasRef.current.parentElement;
      canvasRef.current.width = offsetWidth;
      canvasRef.current.height = offsetHeight;
    }
  }, []);
  
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas]);
  
  return {
    canvasRef,
    context,
    clearCanvas,
    resizeCanvas
  };
}

// 使用示例
function DrawingCanvas() {
  const { canvasRef, context, clearCanvas } = useCanvas();
  const [isDrawing, setIsDrawing] = useState(false);
  
  const startDrawing = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  };
  
  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ border: '1px solid #ccc', display: 'block' }}
      />
      <button onClick={clearCanvas}>清除画布</button>
    </div>
  );
}
```

## 作业

1. 重构React待办事项，使用useReducer管理状态
2. 创建useToggle自定义Hook
3. 实现useDebounce Hook用于搜索优化
4. 创建useInterval Hook用于定时器功能
5. 尝试分析tessellation-evolved.tsx中的Hooks使用

## 下一课预告

第7课将学习Canvas API，为理解复杂图形绘制和动画奠定基础。
