<!-- Git Repository: https://github.com/rick-peng-li/project_mern_memories_web.git -->

# project_mern_memories_web

`project_mern_memories_web` 是一个围绕 Memory 内容发布与管理的 MERN 全栈项目，支持前后端完整联调，能够完成创建、浏览、筛选、详情查看、编辑、点赞、删除等完整业务流程。

当前项目已经从早期教程式代码整理为更适合展示、交付和继续扩展的工程化版本：

- 前端页面统一收拢到 `client/src/page`
- 前端升级到 React 18、React Router 6、Redux Toolkit
- 后端升级到 Express 5、Mongoose 8
- 后端支持真实 MongoDB 与内存 MongoDB 双模式启动
- README、`.gitignore`、环境变量、接口设计和启动方式已同步整理

## 项目介绍

本项目的主题是一个名为 `Memories` 的内容分享应用，用户可以记录生活片段、活动经历、学习总结或旅行见闻，并通过卡片和详情页进行浏览与管理。

项目核心目标：

- 提供完整的 MERN 前后端闭环能力
- 保持适合继续扩展的模块结构
- 保持本地开发可以低成本直接启动
- 保持页面、接口、状态管理和数据模型之间清晰对应

## 页面设计

当前项目一共包含 8 个页面，其中 5 个为本次补充的内容扩展页面。

### 1. 首页 `/`

首页是整个系统的核心工作台，主要包含以下区域：

- 顶部导航区：展示项目名称与首页入口
- 项目说明区：简要说明系统的当前用途
- 统计区：展示当前可见内容数量、总点赞数、标签数量
- 列表区：展示所有 Memory 卡片
- 筛选区：支持关键字搜索与标签筛选
- 表单区：支持创建和编辑 Memory

首页支持的功能：

- 查看所有 Memory 列表
- 根据关键字搜索内容
- 根据标签精确筛选内容
- 创建新 Memory
- 点击 Edit 进入当前内容编辑状态
- 点击 Details 跳转详情页
- 点击 Like 进行点赞
- 点击 Delete 删除内容

### 2. Discover 页面 `/discover`

Discover 页面用于展示内容发现视图，主要能力如下：

- 展示精选内容 `featured`
- 展示最近发布内容 `recent`
- 展示趋势内容 `trending`
- 支持直接进入详情页

### 3. Bookmarks 页面 `/bookmarks`

Bookmarks 页面用于展示收藏内容：

- 查看所有已收藏的 Memory
- 支持取消收藏
- 支持回到详情页继续查看

### 4. Tags 页面 `/tags`

Tags 页面用于标签聚合展示：

- 展示所有标签及对应帖子数量
- 查看每个标签最近对应的内容
- 一键回到首页按标签筛选

### 5. Creators 页面 `/creators`

Creators 页面用于作者榜单展示：

- 展示作者发帖数量
- 展示作者累计点赞数
- 展示作者最近一条内容
- 支持跳回首页按作者搜索

### 6. Timeline 页面 `/timeline`

Timeline 页面用于时间线聚合展示：

- 按月份查看内容分组
- 查看每个时间段的帖子数量与累计点赞
- 查看每个时间段的代表内容

### 7. 详情页 `/posts/:id`

详情页用于展示单条 Memory 的完整信息，主要能力如下：

- 展示标题、作者、发布时间、图片、正文、标签
- 支持点赞当前内容
- 支持删除当前内容
- 支持返回首页
- 当内容不存在时展示兜底提示

### 8. 404 页面

- 用于处理不存在的路由
- 提供返回首页入口

## 模块设计

### 前端模块

前端位于 `client/`，主要模块如下：

- `src/page/`：页面级组件
- `src/components/`：通用展示和表单组件
- `src/api/`：接口请求封装
- `src/actions/`：异步动作逻辑
- `src/reducers/`：全局状态管理
- `src/constants/`：动作常量

页面文件：

- `client/src/page/HomePage.js`
- `client/src/page/DiscoverPage.js`
- `client/src/page/BookmarksPage.js`
- `client/src/page/TagsPage.js`
- `client/src/page/CreatorsPage.js`
- `client/src/page/TimelinePage.js`
- `client/src/page/PostDetailsPage.js`
- `client/src/page/NotFoundPage.js`

核心组件：

- `client/src/components/Header.js`
- `client/src/components/Form/Form.js`
- `client/src/components/Posts/Posts.js`
- `client/src/components/Posts/Post/Post.js`

### 后端模块

后端位于 `server/`，主要模块如下：

- `server/index.js`：服务启动入口、数据库连接、CORS、路由挂载
- `server/routes/posts.js`：帖子路由定义
- `server/controllers/posts.js`：帖子业务逻辑
- `server/models/postMessage.js`：帖子数据模型

## 接口设计

后端统一以 `/api` 为主业务前缀。

### 健康检查

- `GET /health`
- 功能：检查服务是否正常启动

### 帖子列表

- `GET /api/posts`
- 功能：获取帖子列表
- 支持查询参数：
  - `search`：按 `title`、`message`、`creator` 模糊搜索
  - `tag`：按标签精确筛选

示例：

```bash
GET /api/posts?search=travel&tag=summer
```

### 帖子详情

- `GET /api/posts/:id`
- 功能：获取单条帖子详情

### Discover 数据

- `GET /api/posts/discover`
- 功能：获取发现页所需的 `featured`、`recent`、`trending` 数据

### Bookmarks 列表

- `GET /api/posts/bookmarks`
- 功能：获取所有已收藏内容

### Tags 聚合

- `GET /api/posts/tags`
- 功能：获取标签统计与最新内容引用

### Creators 聚合

- `GET /api/posts/creators`
- 功能：获取作者榜单统计

### Timeline 聚合

- `GET /api/posts/timeline`
- 功能：获取按月份分组的时间线数据

### 创建帖子

- `POST /api/posts`
- 功能：创建新的 Memory

### 更新帖子

- `PATCH /api/posts/:id`
- 功能：更新指定 Memory

### 点赞帖子

- `PATCH /api/posts/:id/like`
- 功能：为指定内容点赞

### 收藏帖子

- `PATCH /api/posts/:id/bookmark`
- 功能：切换指定内容的收藏状态

### 删除帖子

- `DELETE /api/posts/:id`
- 功能：删除指定内容

### 创建 / 更新请求体示例

```json
{
  "creator": "Rick",
  "title": "Trip to Hangzhou",
  "message": "A relaxing weekend with friends.",
  "tags": ["travel", "weekend"],
  "selectedFile": "base64-image-string"
}
```

## 数据与校验设计

当前帖子模型包含以下字段：

- `creator`
- `title`
- `message`
- `tags`
- `selectedFile`
- `likeCount`
- `bookmarked`
- `createdAt`
- `updatedAt`

服务端基础校验规则：

- `creator`、`title`、`message` 为必填
- `tags` 自动清洗空值和多余空格
- 图片内容允许传入 Base64 字符串
- 对图片内容大小做基础限制，避免过大的请求体

## 技术架构

### 前端技术栈

- React 18
- React Router 6
- Redux Toolkit
- React Redux 9
- Axios 1
- Create React App 5
- 原生 CSS 组件化布局
- React File Base64

### 后端技术栈

- Node.js
- Express 5
- Mongoose 8
- dotenv
- cors
- mongodb-memory-server
- nodemon

### 架构说明

项目整体采用典型前后端分离结构：

1. 前端负责页面渲染、路由跳转、表单收集、状态管理
2. 前端通过 Axios 调用后端 REST API
3. 后端负责参数处理、业务校验、数据读写、错误响应
4. 数据持久化优先使用外部 MongoDB
5. 若未配置外部 MongoDB，则自动退回到内存 MongoDB，保证本地可直接跑通

## 目录结构

```text
project_mern_memories_web/
├── client/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── actions/
│       ├── api/
│       ├── components/
│       ├── constants/
│       ├── page/
│       ├── reducers/
│       ├── App.js
│       ├── index.css
│       └── index.js
├── server/
│   ├── .env.example
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
├── .gitignore
└── README.md
```

## 启动方式

### 1. 安装依赖

```bash
cd server
npm install

cd ../client
npm install
```

### 2. 配置环境变量

#### 后端环境变量

复制环境文件：

```bash
cp server/.env.example server/.env
```

示例内容：

```env
PORT=5050
MONGODB_URI=mongodb://127.0.0.1:27017/mern_memories
CLIENT_ORIGIN=http://localhost:3000
```

说明：

- 如果配置了 `MONGODB_URI`，优先连接真实 MongoDB
- 如果没有配置 `MONGODB_URI`，后端会自动启用内存 MongoDB

#### 前端环境变量

复制环境文件：

```bash
cp client/.env.example client/.env
```

示例内容：

```env
REACT_APP_API_URL=/api
```

说明：

- 开发环境下默认通过 `client/package.json` 的 `proxy` 转发到 `http://localhost:5050`
- 如果部署到独立后端域名，可以把 `REACT_APP_API_URL` 改成完整地址

### 3. 启动后端

```bash
cd server
npm start
```

开发热更新模式：

```bash
npm run dev
```

### 4. 启动前端

```bash
cd client
npm start
```

### 5. 构建前端

```bash
cd client
npm run build
```

## 默认联调流程

项目当前推荐联调方式如下：

1. 启动后端服务
2. 启动前端服务
3. 打开首页
4. 创建一条新的 Memory
5. 在列表查看卡片信息
6. 进入详情页查看完整内容
7. 点赞、删除或返回首页继续筛选
8. 点击 Edit 回到首页表单区域修改内容

## 当前工程整理结果

当前版本已经完成以下整理：

- 更新根目录 `.gitignore`
- 删除无用图片、异常 Procfile、旧样式文件等历史残留
- 前端页面全部集中到 `client/src/page`
- 接口补齐详情、搜索、健康检查等能力
- 额外补齐 Discover、Bookmarks、Tags、Creators、Timeline 五组页面接口
- 后端去除硬编码数据库连接
- 增加环境变量示例文件
- 增加无 MongoDB 配置时的内存数据库兜底
- 升级主要技术栈到较新的可运行方案
- 默认后端端口调整为 `5050`，规避本地 `5000` 端口冲突
- 确认前端可正常构建

## 适用场景

本项目适合作为：

- MERN 全栈项目基础模板
- Memory / 动态卡片类应用原型
- React + Express + MongoDB 联调演示项目
- 课程作业、项目展示、功能扩展起点

## 补充说明

- README 使用中文，便于项目说明与交付
- 项目界面主体文案保持英文，不额外混入中文界面内容
- 若继续扩展，建议优先补充登录鉴权、评论系统、分页、对象存储上传、标签聚合统计等能力
