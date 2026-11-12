# AIYAZONE Design System - Icons 图标库

AIYAZONE Design System 提供了一套完整、高性能的图标库。该库基于 Lit 框架设计，同时支持普通 DOM 环境，为开发者提供了灵活且强大的图标管理能力。

- 所有图标均以SVG格式提供。
- 所有图标包括单色和彩色（单色支持自定义色设置，彩色不支持）。
- 所有图标均带有正方形画布（默认尺寸为32x32）。
- 这些图标仅用于装饰目的。请勿在文档中将它们用作数据（如指示性图像）。

## 图标列表分类

1. [ ] 系统图标
2. [x] 社媒图标

## 图标命名规则

- 图标名称采用 [kebab-case](https://developer.mozilla.org/zh-CN/docs/Glossary/Kebab_case) 命名法。
- 图标名称应简短且具描述性
- 避免使用缩写、数字和特殊字符
- 彩色图标以`-color`后缀命名不支持自定义颜色配置

## 开发指南

### 安装

使用npm安装图标库：

```bash
npm install @zone/icons
```

CDN引入：

```html
<script src="https://cdn.aiyazone.com/@zone/icons/latest/index.umd.js"></script>

<!-- 或者 -->

<script type="module" src="https://cdn.aiyazone.com/@zone/icons/latest/index.es.js"></script>
```

### 使用

在Lit框架中引入图标组件：

```javascript
import '@zone/icons';
```

在HTML中使用图标：

```html
<zone-icon name="alert-fill"></zone-icon>
```

