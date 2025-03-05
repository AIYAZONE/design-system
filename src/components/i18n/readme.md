# Jackery Design System - i18n 国际化方案

## 概述

Jackery Design System 提供了一套完整、高性能的国际化（i18n）解决方案。该方案基于 Lit 框架设计，同时支持普通 DOM 环境，为开发者提供了灵活且强大的多语言支持能力。

## 核心特性

1. **多语言支持**
   - 支持英语(en)、中文(zh)、日语(ja)等多语言切换
   - 智能的语言检测和自动切换机制
   - 完善的语言回退策略

2. **高性能设计**
   - LRU 缓存机制，优化翻译性能
   - 智能的 DOM 更新策略，避免不必要的重渲染
   - 异步加载语言包，优化首屏加载

3. **开发友好**
   - 支持参数替换和复杂文本格式化
   - TypeScript 类型支持
   - 支持 IDE 智能提示

4. **框架集成**
   - 原生支持 Lit 组件
   - 支持普通 DOM 环境
   - 提供响应式的语言切换能力

## 目录结构

```
src/i18n/
  ├── locales/        # 语言资源文件
  │   ├── en.json     # 英文语言包
  │   ├── zh.json     # 中文语言包
  │   └── ja.json     # 日文语言包
  ├── index.ts        # 核心实现
  └── types/          # 类型定义
```

语言资源文件采用JSON格式，按语言代码命名（如：en.json、zh.json、ja.json），存放在 `src/i18n/locales` 目录下。每个语言文件包含该语言的所有翻译内容，使用层级结构组织，便于管理和维护。

## 快速开始

### 1. 在 Lit 组件中使用

```typescript
import { I18nController } from '@jackery/design-system';

@customElement('my-component')
export class MyComponent extends LitElement {
  private i18n = new I18nController(this);

  render() {
    return html`
      <div>${this.i18n.t('common.title')}</div>
      <p>
        ${this.i18n.t('common.welcome', { 
          name: 'World',
          date: new Date().toLocaleDateString() 
        })}
      </p>
    `;
  }
}
```

### 2. 在普通 HTML 中使用

```html
<!-- 使用声明式翻译 -->
<h1 data-i18n-key="common.title"></h1>
<p data-i18n-key="common.welcome" 
   data-i18n-params='{"name":"World","date":"2024-01-01"}'>
</p>

<!-- 使用命令式翻译 -->
<script>
  const title = window.i18n.t('common.title');
  const welcome = window.i18n.t('common.welcome', {
    name: 'World',
    date: new Date().toLocaleDateString()
  });
</script>
```

### 3. 全局 API

```typescript
import { 
  t, 
  setLanguage, 
  getCurrentLanguage,
  onLanguageChange 
} from '@jackery/design-system';

// 基础翻译
const text = t('common.title');

// 带参数翻译
const welcome = t('common.welcome', { 
  name: 'World',
  date: new Date().toLocaleDateString()
});

// 切换语言
await setLanguage('zh');

// 获取当前语言
const currentLang = getCurrentLanguage();

// 监听语言变化
onLanguageChange((newLang, oldLang) => {
  console.log(`Language changed from ${oldLang} to ${newLang}`);
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
onLanguageChange(callback: LanguageChangeCallback): () => void;

// Lit 控制器
class I18nController {
  constructor(host: HTMLElement, config?: I18nConfig);
  t(key: string, params?: Record<string, any>): string;
  get currentLanguage(): Language;
  setLanguage(lang: Language): Promise<void>;
}
```

### 配置选项

```typescript
interface I18nConfig {
  // 默认语言
  defaultLanguage?: Language;
  // 备用语言，当翻译缺失时使用
  fallbackLanguage?: Language;
  // LRU 缓存大小
  cacheSize?: number;
  // 错误处理函数
  errorHandler?: (error: I18nError) => void;
  // 调试模式
  debug?: boolean;
  // 异步加载语言包的基础路径
  baseUrl?: string;
}
```

## 高级特性

### 1. 智能的语言持久化

```typescript
// 配置持久化选项
const config: I18nConfig = {
  defaultLanguage: 'en',
  storage: {
    type: 'localStorage', // 或 'sessionStorage'
    key: 'app-language'
  }
};
```

### 2. LRU 缓存优化

```typescript
// 配置缓存大小
const config: I18nConfig = {
  cacheSize: 1000, // 默认值
  debug: true // 开启调试模式查看缓存命中率
};
```

### 3. 错误处理

```typescript
const config: I18nConfig = {
  errorHandler: (error: I18nError) => {
    if (error.type === 'MISSING_KEY') {
      console.warn(`Translation missing: ${error.key}`);
    } else if (error.type === 'INVALID_PARAMS') {
      console.error(`Invalid params for key: ${error.key}`);
    }
  }
};
```

### 4. 动态内容更新

```typescript
// 监听 DOM 变化自动更新翻译
const config: I18nConfig = {
  observeDom: true, // 默认开启
  observeOptions: {
    subtree: true,
    childList: true
  }
};
```

## 最佳实践

1. **翻译键命名规范**
   - 使用点号分隔的命名空间（如：'page.section.element'）
   - 保持键名语义化和一致性
   - 避免过深的嵌套层级（建议不超过3层）

2. **性能优化**
   - 合理配置 LRU 缓存大小
   - 使用异步加载优化大型语言包
   - 避免频繁的语言切换操作

3. **类型安全**
   - 使用 TypeScript 类型定义翻译键
   - 利用类型系统确保参数正确性
   - 配置 IDE 智能提示

4. **错误处理**
   - 实现完整的错误处理策略
   - 记录并监控翻译缺失
   - 提供合适的降级显示

## 完整示例

```typescript
@customElement('jds-i18n-demo')
export class JdsI18nDemo extends LitElement {
  private i18n = new I18nController(this, {
    defaultLanguage: 'en',
    fallbackLanguage: 'en',
    cacheSize: 1000,
    debug: true,
    errorHandler: (error) => {
      console.warn('Translation error:', error);
    }
  });

  @state()
  private name = 'Jackery';

  render() {
    return html`
      <div class="demo-container">
        <h1>${this.i18n.t('demo.title')}</h1>
        
        <p>${this.i18n.t('demo.welcome', { 
          name: this.name,
          date: new Date().toLocaleDateString()
        })}</p>
        
        <div class="language-switcher">
          <button @click=${() => this.i18n.setLanguage('en')}>English</button>
          <button @click=${() => this.i18n.setLanguage('zh')}>中文</button>
          <button @click=${() => this.i18n.setLanguage('ja')}>日本語</button>
        </div>

        <div data-i18n-key="demo.footer"></div>
      </div>
    `;
  }
}
```

## 常见问题

1. **如何处理复杂的文本格式？**
   - 使用参数替换而不是字符串拼接
   - 利用 HTML 标记处理富文本
   - 考虑使用模板字符串处理复杂格式

2. **如何优化大型应用的性能？**
   - 实施语言包分割策略
   - 使用异步加载机制
   - 合理配置缓存参数

3. **如何确保翻译的完整性？**
   - 使用翻译键检查工具
   - 实现完整的错误处理
   - 建立翻译审查流程

## 更新日志

### v0.0.1

- 初始版本发布
- 支持基础的多语言切换
- 提供 Lit 组件集成
- 添加 LRU 缓存优化
- 改进错误处理机制
- 支持异步语言包加载
- 增强类型系统支持
- 优化 DOM 更新性能
- 添加调试工具支持
