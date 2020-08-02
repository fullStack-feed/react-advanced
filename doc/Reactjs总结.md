# React.js

## React 和 vue

react工作模式：UI=render(data);render函数是纯函数

学习曲线，代码风格，单文件组成，灵活性，工具，移动端支持，各自优缺点

## JSX
### createElement
### 不可变值
### this
- bind(能够传递参数)
- 匿名箭头函数（能够传递参数，但是没有bind语义强）
- class 新语法
### for 循环key值问题
### 受控组件和非受控组件
### 合成事件系统
- 抹平浏览器差异
- 事件委托到document
- NativeEvent

## 组件
### 状态流：setState
#### 异步或同步执行
**同步更新:**
- “自定义”事件
- 定时器
#### 异步更新（批量更新）

事件处理函数

#### 更新合并
- 对象批量更新会出现覆盖现象
- 函数式批量更新不会覆盖
- VS useState hooks
#### 不可变值
- 直接修改值的后果（UI不刷新）
- 原始值：覆盖
- 引用值：重建
  - 数组处理
  - 对象处理  
### 生命周期

#### 老版本
props 和 states 分的很清楚
#### 新版本
#### 为什么这样做
todo：
- 自己的笔记
- 珠峰讲义，课堂源码先不看
- react Fiber

**父组件更新子组件也更新(好意，你不需要你自己控制呗)**

### 逻辑复用
HOC高阶组件
Render Props
custorm Hooks


## 核心特性
### Suspense
### Portals
### ErrorBoudary
### React.lazy
### Fragment
### 异步加载组件
#### import()抱: webPack代码分割
#### 基本使用
#### 异步错误处理
####	- [ ] 配合React-router @官方文档
### context
#### 解决问题：props传值嵌套，最佳实践(三层以上组件时)
#### scu造成context短路
#### - [ ] useContext VS createContext
#### createContext VS contextTypes
				- [ ] contextTypes: 一对多
				- [ ] createContext：一对一
			@双越 + 官方文档
