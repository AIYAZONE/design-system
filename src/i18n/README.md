# Jackery Design System - i18n 国际化方案

## 目录结构说明

```md
src/i18n/
├── locales/          # 语言资源文件
│   ├── en.json       # 英文语言包
│   ├── zh.json       # 中文语言包
│   └── ja.json       # 日文语言包
├── components/       # i18n相关组件
│   └── index.ts      # 导出所有i18n组件
├── core/             # 核心实现
│   ├── controller.ts # i18n控制器
│   ├── core.ts      # 核心功能实现
│   ├── dom.ts       # DOM相关操作
│   └── index.ts     # 核心功能导出
├── decorators/      # i18n装饰器
│   └── index.ts     # 装饰器实现
├── types/           # 类型定义
│   └── index.ts     # 类型声明文件
└── index.ts         # 统一导出文件
```

## 重构说明

1. **目录结构优化**
   - 将所有i18n相关文件统一迁移到src/i18n目录下
   - 按照功能模块划分子目录，提高代码的可维护性
   - 统一导出接口，简化引用路径

2. **模块化设计**
   - core: 核心功能实现，包含控制器、DOM操作等
   - components: i18n相关组件，如语言切换器等
   - decorators: i18n装饰器实现
   - types: 类型定义文件

3. **优化理由**
   - 提高代码的可维护性和可读性
   - 便于团队协作和代码review
   - 减少代码冗余和重复
   - 统一管理i18n相关功能
   - 简化模块间的依赖关系

4. **使用示例**

```typescript
// 导入i18n功能
import { I18nController, useI18n } from '@jackery/design-system/i18n';

// 在组件中使用
@customElement('my-component')
export class MyComponent extends LitElement {
  private i18n = new I18nController(this);

  render() {
    return html`
      <div>${this.i18n.t('common.title')}</div>
    `;
  }
}

// 使用装饰器
import { i18n } from '@jackery/design-system/i18n/decorators';

@customElement('my-component')
export class MyComponent extends LitElement {
  @i18n()
  title = 'i18n:common.title';
}
```

## 注意事项

1. 迁移后需要更新所有import路径
2. 确保向后兼容性
3. 更新相关文档和示例代码
4. 运行测试确保功能正常