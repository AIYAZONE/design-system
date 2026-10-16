# jds-dropdown 下拉选择组件

基于 Web Components 的单选下拉框。传入单层 `options` 时显示普通列表；数据包含非空 `children` 时，自动显示可展开的树形列表。父节点只负责展开和收起，只有未禁用的叶子节点可以选中。

节点的 `value` 必须为非空字符串，且在整棵树中唯一；`label` 可以重复。禁用父节点会同时禁用其所有子节点。

## 使用示例

```html
<jds-dropdown
  id="issue"
  name="issueType"
  label="问题类型"
  placeholder="请选择问题类型"
  required
  clearable
></jds-dropdown>
```

```ts
import { type DropdownOption } from "@jackery/design-system";
import "@jackery/design-system";
import "@jackery/design-system/index.css";

const dropdown = document.querySelector("jds-dropdown")!;
const options: DropdownOption[] = [
  { value: "power", label: "储能电源" },
  {
    value: "solar",
    label: "太阳能板",
    children: [
      { value: "solar100", label: "SolarSaga 100W" },
      { value: "solar200", label: "SolarSaga 200W", disabled: true },
    ],
  },
];
dropdown.options = options;
dropdown.addEventListener("change", (event) => {
  // 事件类型为 CustomEvent<DropdownChangeDetail>。
  console.log((event as CustomEvent).detail);
  // 详情包含所选值、节点数据、路径值和路径名称：{ value, option, pathValues, pathLabels }。
});
```

## 组件库入口

引入 `@jackery/design-system` 会自动注册 `jds-dropdown`。根包同时导出 `JdsDropdown`、`DropdownOption` 和 `DropdownChangeDetail`，其他项目安装包含此组件的新版本后即可使用。

组件源码入口为 `packages/core/src/components/dropdown/index.ts`。项目内专属示例与 Storybook 直接引入源码；发布时沿用现有根包入口，不新增独立 npm 子路径。

## 数据与选中值

通过 JavaScript 属性传入数据，Lit 中使用 `.options=${options}`，不要使用字符串形式的 HTML 特性。更新数据时应替换整个选项数组。

将 `value` 设置为叶子节点的标识即可通过代码选中，该操作不会触发 `change` 事件。数据为空时会保留尚未匹配的值，便于随后异步传入数据，但该值不会参与表单提交。数据非空时，未匹配的值、父节点值和已禁用节点值会被清空。

默认回填叶子节点的名称；设置 `show-path` 后显示完整路径。

## 事件

用户选择或清空时触发 `change` 事件，支持冒泡并穿透 Shadow DOM。事件详情包含 `value`、`option`、`pathValues` 和 `pathLabels`。

清空时返回 `value: ''`、`option: null` 及空路径数组。再次选择当前已选中的节点会关闭面板，不会重复触发变更事件。

`jds-dropdown-show` 和 `jds-dropdown-hide` 分别在面板打开和关闭时触发。

## 属性与方法

其他属性包括 `disabled`、`open`、`empty-text`、`clear-label`、`required-message` 和 `error-message`。业务应用可传入对应语言的文案。

`error-message` 用于控制错误信息的显示；需要参与原生表单校验的自定义错误，应使用 `setCustomValidity(message)`。

公开方法：`show()`、`hide()`、`focus()`、`checkValidity()`、`reportValidity()`、`setCustomValidity()`。

## 表单集成

组件通过表单关联自定义元素和 `ElementInternals` 接入原生表单。`FormData` 使用 `name` 作为字段名，提交所选叶子节点的标识。支持必填校验、表单重置、`fieldset` 禁用及表单状态恢复。

不支持 `ElementInternals` 表单接口的浏览器，需要由业务应用自行收集和提交组件值。

## 键盘操作

- 上下方向键：在当前可见且未禁用的选项间移动。
- 左右方向键：收起或展开节点，或移动到父节点、子节点。
- Home / End：移动到首个或最后一个可操作选项。
- Enter / Space：展开父节点或确认叶子节点的选择。
- Escape：关闭面板，保留已确认的选中值。
- Tab：关闭面板并移出控件。

面板打开时输入字母，可定位名称匹配的可见选项。键盘定位与已确认选择分别维护状态，DOM 焦点保持在下拉框触发控件上。

面板打开时 Escape 只关闭当前下拉框，不会同时关闭外层 Dialog；面板关闭后再次按 Escape，事件交由外层处理。

## 大数据量与性能

关闭面板时不生成选项 DOM。可见节点、可操作节点及节点索引仅在数据或展开状态变化时重建，方向键导航复用缓存。超过 200 个可见节点时自动使用虚拟列表，只生成视口附近的选项。

虚拟列表通过 ResizeObserver 测量换行后的实际行高，并用树状数组维护累计高度；定位及行高更新为 O(log n)。树形虚拟列表通过 `aria-level`、`aria-posinset` 和 `aria-setsize` 保留层级语义。滚动仅调整面板自身，不滚动外层页面。关闭和卸载时会释放定位、行高及面板尺寸观察器。

## 响应式布局与浮层

沿用项目的 1024px 断点。PC 输入框高度为 48px，根节点字号为 20px，子节点字号为 16px；移动端输入框高度为 44px，根节点字号为 16px，子节点字号为 14px。

箭头直接复用 `packages/icons` 中的 `arrow-down.svg` 和 `arrow-right.svg`，继承文字颜色，并随展开状态旋转。

面板宽度跟随触发控件，接近视口边缘时自动翻转位置，内容超高时纵向滚动。浏览器支持时使用原生 Popover 顶层浮层，避免溢出裁切和层叠上下文限制；旧浏览器回退为固定定位面板。

## 样式定制

CSS 自定义属性：`--jds-dropdown-width`、`--jds-dropdown-height`、`--jds-dropdown-font-size`、`--jds-dropdown-child-font-size`、`--jds-dropdown-indent`、`--jds-dropdown-max-height`、`--jds-dropdown-border-color`、`--jds-dropdown-radius`、`--jds-dropdown-shadow`、`--jds-dropdown-focus-color`、`--jds-dropdown-option-background`、`--jds-dropdown-index`。

可通过 CSS Parts 定制的部位：`label`、`trigger`、`panel`、`option`、`clear`、`error`。

## 示例与设计稿

示例页面：`apps/examples/pages/atoms/dropdown.html`，包含普通列表、树形列表、原生表单、溢出容器和浏览器检查。添加 `?view=pc` 或 `?view=mb` 可查看设计稿预览模式；通过 `?theme=v1|v2|v3` 切换主题。

Storybook 路径：`03 基础组件/jds-dropdown`。

- [PC 设计稿，节点 80:200](https://www.figma.com/design/jYGpYU79cIYqoHgI0SZ7B9?node-id=80-200)
- [移动端设计稿，节点 80:233](https://www.figma.com/design/jYGpYU79cIYqoHgI0SZ7B9?node-id=80-233)
