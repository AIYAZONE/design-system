我将在 `packages/core` 包中实现 `jds-checkbox` 核心组件。

### 实现计划

1.  **创建目录**: `packages/core/src/components/checkbox`
2.  **样式 (`index.less`)**:
    *   定义复选框容器、隐藏输入框和视觉指示器的样式。
    *   使用提供的“选中”和“未选中”状态的 SVG 路径，确保与 Figma 设计像素级匹配。
    *   使用 CSS 变量定义颜色（例如：选中状态使用 `var(--jds-color-primary)`）。
    *   支持 `disabled`（禁用）状态样式。
3.  **组件逻辑 (`index.ts`)**:
    *   创建 `JdsCheckbox` 类，继承自 `LitElement`（参考 `Button` 组件的实现）。
    *   属性：`checked`（选中）、`disabled`（禁用）、`value`（值）、`name`（名称）、`label`（标签）、`indeterminate`（不确定状态）。
    *   使用 SVG 路径渲染复选框图标。
    *   处理点击事件以切换状态并触发 `change` 事件。
    *   确保无障碍访问（a11y），使用正确的 ARIA 属性和标签关联。
4.  **Storybook (`jds-checkbox.stories.ts`)**:
    *   添加默认、选中、禁用和带标签的 Story 用例，方便测试和预览。
5.  **导出**:
    *   在 `packages/core/src/index.ts` 中添加 `export * from './components/checkbox';`。

### 技术细节
*   **图标**: 我将直接在组件渲染方法中嵌入 SVG 路径，因为 `jds-icon` 的可用性不确定，且这些是特定的状态指示器。
    *   选中图标：橙色背景，透明对勾（镂空）。
    *   未选中图标：深色边框。
*   **颜色**:
    *   选中：`#FD5000` (Jackery Orange)
    *   未选中/文本：`#242F20` (Dark Grey)
*   **尺寸**: 图标容器 24x24px，间距 8px。
