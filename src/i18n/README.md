# Jackery Design System - i18n 国际化方案

## 概述

Jackery Design System 提供了一套完整、高性能的国际化（i18n）解决方案。该方案基于 Lit 框架设计，同时支持普通 DOM 环境，为开发者提供了灵活且强大的多语言支持能力。

## 目录结构

```md
src/i18n/
├── locales/                     # 语言资源文件
│   ├── i18n-translations.xlsx   # 多语言翻译清单表格
│   ├── en.json                  # 英文语言包
│   ├── ja.json                  # 日文语言包
│   ├── de.json                  # 德文语言包
│   ├── it.json                  # 意大利文语言包
│   ├── fr.json                  # 法文语言包
│   ├── es.json                  # 西班牙文语言包
│   ├── ko.json                  # 韩文语言包
│   ├── zh-CN.json               # 简体中文语言包
│   └── zh-TW.json               # 繁体中文语言包
├── core/                        # 核心实现
│   ├── config.ts                # 配置常量
│   ├── dom.ts                   # DOM相关操作
│   ├── languages.ts             # 语言资源管理
│   ├── controller.ts            # i18n控制器
│   └── index.ts                 # 核心功能导出
├── decorators/                  # i18n装饰器
│   └── index.ts                 # 装饰器实现
├── scripts/                     # 工具脚本
│   ├── convert-to-excel.js      # JSON转Excel工具
│   ├── excel-to-json.js         # Excel转JSON工具
│   └── i18n-utils.js            # 工具函数
├── types/                       # 类型定义
│   └── index.ts                 # 类型声明文件
├── utils/                       # 通用工具函数
└── index.ts                     # 统一导出文件
```

## 核心特性

1. 多语言支持
   - 支持英语(en)、中文(zh)、日语(ja)等多语言切换
   - 智能的语言检测和自动切换机制
   - 完善的语言回退策略

2. DOM 自动更新
   - 支持声明式和命令式的翻译方式
   - 自动监听 DOM 变化并更新翻译
   - 支持动态参数传递

3. 开发友好
   - 支持参数替换和复杂文本格式化
   - TypeScript 类型支持
   - 支持 IDE 智能提示

4. 框架集成
   - 原生支持 Lit 组件
   - 支持普通 DOM 环境
   - 提供响应式的语言切换能力

## 使用示例

### 在 Lit 组件中使用

```typescript
import { I18nController } from '@jackery/design-system/i18n';

@customElement('my-component')
export class MyComponent extends LitElement {
  private i18n = new I18nController(this);

  render() {
    return html`
      <div>${this.i18n.t('common.title')}</div>
      <p>${this.i18n.t('common.welcome', { name: 'World' })}</p>
    `;
  }
}
```

### 在普通 HTML 中使用

```html
<!-- 使用声明式翻译 -->
<h1 data-i18n-key="common.title"></h1>
<p data-i18n-key="common.welcome" data-i18n-params='{"name":"World"}'></p>

<!-- 使用模板字符串形式 -->
<div>这是一个${window.i18n.t('common.example')}示例</div>

<!-- 使用命令式翻译 -->
<script>
  const title = window.i18n.t('common.title');
  const welcome = window.i18n.t('common.welcome', { name: 'World' });
</script>
```

### 全局 API

```typescript
import { t, setLanguage, getCurrentLanguage } from '@jackery/design-system/i18n';

// 基础翻译
const text = t('common.title');

// 带参数翻译
const welcome = t('common.welcome', { name: 'World' });

// 切换语言
setLanguage('zh');

// 获取当前语言
const currentLang = getCurrentLanguage();

// 监听语言变化
window.addEventListener('i18n-language-change', (event) => {
  console.log(`Language changed to ${event.detail.language}`);
});
```

## API 参考

### 核心 API

```typescript
// 翻译函数
t(key: string, params?: Record<string, any>): string;

// 语言控制
setLanguage(lang: Language): Promise<void>;
getCurrentLanguage(): Language;

// Lit 控制器
class I18nController {
  constructor(host: HTMLElement);
  t(key: string, params?: Record<string, any>): string;
  get currentLanguage(): Language;
  setLanguage(lang: Language): Promise<void>;
}
```

## 最佳实践

1. 翻译键命名规范
   - 使用点号分隔的命名空间（如：'page.section.element'）
   - 保持键名语义化和一致性
   - 避免过深的嵌套层级（建议不超过3层）

2. DOM 更新优化
   - 优先使用声明式翻译（data-i18n-key）
   - 合理使用参数传递（data-i18n-params）
   - 避免不必要的动态内容更新

3. 类型安全
   - 使用 TypeScript 类型定义翻译键
   - 确保参数类型正确性
   - 利用 IDE 智能提示

4. 错误处理
   - 实现完整的错误处理策略
   - 记录并监控翻译缺失
   - 提供合适的降级显示

## Excel/JSON 转换工具

为了方便翻译管理，我们提供了Excel和JSON格式之间的转换工具：

### JSON转Excel

```bash
# 将所有语言包转换为Excel文件
node src/i18n/scripts/convert-to-excel.js
```

转换后将在locales目录下生成`i18n-translations.xlsx`文件，包含所有语言的翻译。

### Excel转JSON

```bash
# 将Excel文件转换回JSON语言包
node src/i18n/scripts/excel-to-json.js
```

转换后将在locales目录下生成对应的语言JSON文件。

## 更新日志

### v0.0.1

- 初始版本发布
- 支持基础的多语言切换
- 提供 Lit 组件集成
- 支持 DOM 自动更新
- 支持模板字符串形式的翻译
- 优化 DOM 更新性能
- 增强错误处理机制
- 添加Excel/JSON转换工具
