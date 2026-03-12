# 字体 - Font

## 概述

Jackery 设计系统的字体规范是为了在全球化产品中实现一致的文字视觉效果。我们采用 Poppins 作为默认字体，并为日本市场特别优化使用 Noto Sans JP 字体。系统通过精心设计的字重、字号体系，结合响应式设计方案，确保了跨设备、跨语言环境下的最佳阅读体验。

字体系统的核心特点：

- 1.采用 CSS 变量实现灵活配置
- 2.支持多语言字体适配
- 3.响应式字号自适应
- 4.标准化的字重管理

## 介绍

### 字体名 - Font Family

设计系统中使用的字体命名：

- 默认字体：**Poppins**
- 日站字体：**Noto Sans JP**

### 字重与字体关系

| W3C标准字体字重对应 | 公司UED v2.1规范对应关系 |
| --- | --- |
| **常见粗细值名称和数值对应：** <br>`400` Normal/Regular<br>`500` Medium<br>`600` Semi Bold (Demi Bold)<br>`700` Bold | **Poppins**<br>`400` Regular<br>`500` Medium<br>`600` Semi Bold<br>`700` Bold - 设计系统保留，但常规高保设计稿中不推荐使用<br><br>**Noto Sans JP**<br>`400` `500` Regular<br>`600` `700` Bold |

**说明：**

- 1.开发中可通过设置字重自动匹配对应字体。
- 2.字体族切换实现见：`src/styles/jds/font.css`；字重/字号变量定义见：`src/styles/jds/tokens.base.less`

### 字号 - Font Size

遵循 Jackery 设计系统响应式设计方案，以CSS 根节点`font-size`为基准，使用rem进行换算，实现跨设备的字号大小自适应。

## 变量

### 字体族变量

``` css
  /* ========================================
  * 字体族设置 (Font Family Configuration)
  * ======================================== */

  /**
  * 日语站点字体设置
  * @description 为日语内容优化的字体族，使用Noto Sans JP确保日文字符显示效果
  */
  :root[lang="ja"] {
    --jds-font-family: "Noto Sans JP", sans-serif;
  }

  /**
  * 非日语站点字体设置
  * @description 国际化字体族，使用Poppins作为主要英文字体
  */
  :root:not([lang="ja"]) {
    --jds-font-family: "Poppins", sans-serif;
  }
```

### 字重变量

```css
  /* ----------------------------------------
   * 字体权重系统 (Font Weight System)
   * ---------------------------------------- */

  --jds-font-regular: 400;                                       /* 常规字重：400，正文内容 */
  --jds-font-medium: 500;                                         /* 中等字重：500，次要标题 */
  --jds-font-semibold: 600;                                     /* 半粗字重：600，重要内容 */
  --jds-font-bold: 700;                                             /* 粗体字重：700，主要标题 */
  --jds-font-extrabold: 800;                                     /* 特粗字重：800，强调/展示 */

```

### 字号变量

```css
/**
 * 字体大小生成Mixin
 * @param {number} @rem-base - rem基准值，用于响应式字体大小计算
 * @description 生成完整的字体大小变量，确保最小字体为12px，支持响应式缩放
 */
.generate-font-sizes(@rem-base) {
  --jds-font-size-12: 12px;                        /* 最小字体：12px */
  --jds-font-size-14: max(12px, 14 * @rem-base);   /* 小字体：14px */
  --jds-font-size-16: max(12px, 16 * @rem-base);   /* 基础字体：16px */
  --jds-font-size-18: max(12px, 18 * @rem-base);   /* 正文字体：18px */
  --jds-font-size-20: max(12px, 20 * @rem-base);   /* 小标题：20px */
  --jds-font-size-24: max(12px, 24 * @rem-base);   /* 中标题：24px */
  --jds-font-size-28: max(12px, 28 * @rem-base);   /* 大标题：28px */
  --jds-font-size-32: max(12px, 32 * @rem-base);   /* 特大标题：32px */
  --jds-font-size-36: max(12px, 36 * @rem-base);   /* 超大标题：36px */
  --jds-font-size-40: max(12px, 40 * @rem-base);   /* 巨大标题：40px */
  --jds-font-size-44: max(12px, 44 * @rem-base);   /* 特大标题：44px */
  --jds-font-size-48: max(12px, 48 * @rem-base);   /* 展示标题：48px */
  --jds-font-size-56: max(12px, 56 * @rem-base);   /* 大展示标题：56px */
  --jds-font-size-64: max(12px, 64 * @rem-base);   /* 超大展示标题：64px */
  --jds-font-size-72: max(12px, 72 * @rem-base);   /* 巨型展示标题：72px */
  --jds-font-size-80: max(12px, 80 * @rem-base);   /* 特大展示标题：80px */
  --jds-font-size-88: max(12px, 88 * @rem-base);   /* 超特大展示标题：88px */
  --jds-font-size-96: max(12px, 96 * @rem-base);   /* 超特大展示标题：96px */
}

@media screen and (min-width: 1024px) {
  @rem: (1rem / 16);  /* 桌面端rem基准：1rem = 16px */
  :root {
    /* 生成桌面端字体大小变量 */
    .generate-font-sizes(@rem);
  }
}

@media screen and (max-width: 1023.98px) {
  @rem: (1rem / 32);  /* 移动端rem基准：1rem = 32px */
  :root {
    /* 生成移动端字体大小变量 */
    .generate-font-sizes(@rem);
  }
}

/* --- 编译后 --- */
@media screen and (min-width: 1024px) {
  :root {
    --jds-font-size-12: 12px;
    --jds-font-size-14: max(12px, 0.875rem);
    --jds-font-size-16: max(12px, 1rem);
    --jds-font-size-18: max(12px, 1.125rem);
    --jds-font-size-20: max(12px, 1.25rem);
    --jds-font-size-24: max(12px, 1.5rem);
    --jds-font-size-28: max(12px, 1.75rem);
    --jds-font-size-32: max(12px, 2rem);
    --jds-font-size-36: max(12px, 2.25rem);
    --jds-font-size-40: max(12px, 2.5rem);
    --jds-font-size-44: max(12px, 2.75rem);
    --jds-font-size-48: max(12px, 3rem);
    --jds-font-size-56: max(12px, 3.5rem);
    --jds-font-size-64: max(12px, 4rem);
    --jds-font-size-72: max(12px, 4.5rem);
    --jds-font-size-80: max(12px, 5rem);
    --jds-font-size-88: max(12px, 5.5rem);
    --jds-font-size-96: max(12px, 6rem);
  }
}
@media screen and (max-width: 1023.98px) {
  :root {
    --jds-font-size-12: 12px;
    --jds-font-size-14: max(12px, 0.4375rem);
    --jds-font-size-16: max(12px, 0.5rem);
    --jds-font-size-18: max(12px, 0.5625rem);
    --jds-font-size-20: max(12px, 0.625rem);
    --jds-font-size-24: max(12px, 0.75rem);
    --jds-font-size-28: max(12px, 0.875rem);
    --jds-font-size-32: max(12px, 1rem);
    --jds-font-size-36: max(12px, 1.125rem);
    --jds-font-size-40: max(12px, 1.25rem);
    --jds-font-size-44: max(12px, 1.375rem);
    --jds-font-size-48: max(12px, 1.5rem);
    --jds-font-size-56: max(12px, 1.75rem);
    --jds-font-size-64: max(12px, 2rem);
    --jds-font-size-72: max(12px, 2.25rem);
    --jds-font-size-80: max(12px, 2.5rem);
    --jds-font-size-88: max(12px, 2.75rem);
    --jds-font-size-96: max(12px, 3rem);
  }
}
```
