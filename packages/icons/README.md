# Jackery Design System - Icons 图标库

Jackery Design System 提供了一套完整、高性能的图标库。该库基于 Lit 框架设计，同时支持普通 DOM 环境，为开发者提供了灵活且强大的图标管理能力。

- 所有图标均以SVG格式提供。
- 所有图标包括单色和彩色（单色支持自定义色设置，彩色不支持）。
- 所有图标均带有正方形画布（默认尺寸为32x32）。
- 这些图标仅用于装饰目的。请勿在文档中将它们用作数据（如指示性图像）。

## 图标列表分类

1. [ ] 系统图标
2. [ ] 会员系统图标
3. [x] 社媒图标
4. [ ] 电器图标

## 图标命名规则

- 图标名称采用 [kebab-case](https://developer.mozilla.org/zh-CN/docs/Glossary/Kebab_case) 命名法。
- 图标名称应简短且具描述性
- 避免使用缩写、数字和特殊字符
- 彩色图标以`-color`后缀命名不支持自定义颜色配置

## 开发指南

### 安装

使用npm安装图标库：

```bash
npm install @jackery/icons
```

CDN引入：

```html
<script src="https://f2e-cdn.jackery.com/@jackery/icons/latest/index.umd.js"></script>

<!-- 或者 -->

<script type="module" src="https://f2e-cdn.jackery.com/@jackery/icons/latest/index.es.js"></script>
```

### 使用

在Lit框架中引入图标组件：

```javascript
import '@jackery/icons';
```

在HTML中使用图标：

```html
<jds-icon name="alert-fill"></jds-icon>
```
