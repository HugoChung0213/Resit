import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 获取根元素
const rootElement = document.getElementById('root');

// 使用 createRoot 方法创建根
const root = ReactDOM.createRoot(rootElement);

// 使用 root.render 方法渲染 App 组件
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
