<div style="text-align:center;">
  <img src="./src/assets/jds-logo.svg">
</div>

## 1. 简介

- **全称：** Jackery Design System - Jackery设计系统
- **简写：** JDS
- **介绍：** 作为全球官网中心前端设计系统，按照前端规范，基于Web Components + Vite + Lit + Storybook设计实现跨技术栈的Web端基础库。
- **目标：** Shoelace/Spectrum/Baklava
- **仓库：** [http://192.168.30.241/global-website/jackery-design-system](http://192.168.30.241/global-website/jackery-design-system)
- **设计：** [Figma - 基础UED](https://www.figma.com/design/LI5xCizwANfYUQC0kub9B6/%E5%9F%BA%E7%A1%80UED%E8%A7%84%E8%8C%83) 和 [Figma - UED控件库](https://www.figma.com/design/xRSdg9dwrFbNMQz1zQVaaE/UED%E6%8E%A7%E4%BB%B6%E5%BA%93)
- **文档：** [前端知识库 - Jackery Design System](https://alidocs.dingtalk.com/i/nodes/o14dA3GK8g5nRwgwHoanD4XgV9ekBD76)

## 2. 目标

- 兼容所有框架
- CDN部署
- 可通过CSS完全自定义
- 包含深浅两个主题
- 无障碍优先

## 3. 部署

- 公司内网npm私仓：`http://192.168.30.224:8081/repository/npm-private/`
- 名称： `@jackery/design-system`

## 4. 使用

### 4.1 依赖引用

1. 前端项目根目录新增 `.npmrc` 文件，内容如下：

  ```text
  # 默认使用npm公网仓库
  registry=https://registry.npmjs.com/

  # @jackery前缀组件库，使用公司 npm 仓库
  @jackery:registry=http://192.168.30.224:8081/repository/npm-private/
  ```
  
2. 命令安装：

  ```cmd
  npm i @jackery/design-system -d --save
  ```

### 4.2 CDN引用

1. 最新版本：
  
  ```html
  <link rel="stylesheet" crossorigin href="https://f2e-cdn.jackery.com/@jackery/design-system/latest/dist/styles/index.css">
  <script type="module" crossorigin src="https://f2e-cdn.jackery.com/@jackery/design-system/latest/dist/index.js"></script>
  ```

2. 特定版本：

  ```html
  <link rel="stylesheet" crossorigin href="https://f2e-cdn.jackery.com/@jackery/design-system/0.0.1/dist/styles/index.css">
  <script type="module" crossorigin src="https://f2e-cdn.jackery.com/@jackery/design-system/0.0.1/dist/index.js"></script>
  ```

## 5. 业界优秀实践

站在巨人的肩膀上看世界，业界优秀实践参考：

![优秀实践参考](./public/design-system.png)
