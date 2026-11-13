# AI 使用规范：用 ZDS 生成前端页面

> 这份文档是给 AI（以及给 AI 写提示词的人）看的。目标只有一个：**AI 生成的页面，开箱即符合 ZDS 规范**。

## 一、三条硬约束

1. **只用令牌**：颜色、字号、间距、圆角、阴影、层级一律用 `--zone-*` CSS 变量，禁止出现 `#FD5000`、`16px`（间距）、`z-index: 9999` 这类硬编码。
2. **只用组件**：按钮、弹窗、下拉、提示等交互元素用 `zone-*` 自定义元素，**禁止用 `div`/`span` 模拟**。
3. **只从外部定制**：样式覆盖只允许通过公开属性与 `--zone-*` 变量，禁止选择 shadow DOM 内部类名。

违反任意一条，生成的代码视为**不合格**，即使视觉看起来正确。

## 二、令牌使用规则

| 需求 | 正确写法 | 禁止写法 |
|------|----------|----------|
| 主色 | `color: var(--zone-color-primary)` | `color: #FF6727` |
| 正文文字 | `color: var(--zone-color-text-l1)` | `color: #242F20` |
| 间距 | `padding: var(--zone-size-16)` | `padding: 16px` |
| 字号 | `font-size: var(--zone-font-size-14)` | `font-size: 14px` |
| 标题排版 | `font: var(--zone-font-h2)` | 手写 `font-size` + `font-weight` + `line-height` |
| 圆角 | `border-radius: var(--zone-rounded-8)` | `border-radius: 8px` |
| 层级 | `z-index: var(--zone-index-dialog)` | `z-index: 9999` |
| 遮罩 | `background: var(--zone-color-overlay-50)` | `rgba(0,0,0,.5)` |

字号与尺寸令牌已内置响应式缩放（桌面 1rem/16、移动 1rem/32），**不要自己写 media query 调整数值**，直接用令牌即可。

## 三、组件选择指南

| 页面需求 | 使用组件 |
|----------|----------|
| 提交 / 取消 / 次要操作 | `<zone-button>`（variant 三变体见文档） |
| 状态标记 | `<zone-badge>` |
| 多选 / 勾选 | `<zone-checkbox>` |
| 模态确认、表单弹窗 | `<zone-dialog>` |
| 下拉选择、级联选择 | `<zone-dropdown>` / `<zone-filter-select>` |
| 气泡提示、二次确认 | `<zone-popover>` / `<zone-tooltip>` |
| 加载中 | `<zone-spinner>` |
| 操作结果反馈 | `<zone-toast>` |

完整 API（属性 / 事件 / 插槽 / 可覆盖变量）见 `docs/api/<tag>.md`。

## 四、生成页面的提示词模板

```text
你是 AIYAZONE 前端工程师。请用 ZDS 设计系统生成【页面描述】。

硬约束：
1. 颜色/字号/间距/圆角/层级只用 --zone-* 令牌，禁止硬编码数值；
2. 交互元素只用 zone-* 组件（button/dialog/dropdown/toast 等），禁止 div 模拟；
3. 样式覆盖只用公开属性与 --zone-* 变量；
4. 交互元素必须键盘可达，图标按钮必须有 aria-label；
5. 响应式使用令牌自动缩放，不写数值 media query。

输出要求：单文件 HTML + 原生 JS；引入 @aiyazone/design-system（总包，组件+主题），
<link rel="stylesheet" href="@aiyazone/design-system/index-v3.css"> + <script type="module">import '@aiyazone/design-system';</script>。
参考：llms.txt（索引）、llms-full.txt（全量 API）、docs/api/*.md（组件规格）。
```

## 五、正例与反例

```html
<!-- ✅ 合格：组件 + 令牌 + 语义 -->
<zone-button variant="primary" label="提交订单">
  提交订单
</zone-button>

<section style="padding: var(--zone-size-24); background: var(--zone-color-card-white);">
  <h2 style="font: var(--zone-font-h3); color: var(--zone-color-text-l1);">订单详情</h2>
</section>
```

```html
<!-- ❌ 不合格：div 模拟按钮 + 硬编码颜色与间距 -->
<div onclick="submit()" style="background:#FF6727; color:#fff; padding:16px; border-radius:8px;">
  提交订单
</div>
```

## 六、验收清单（生成后逐条自检）

- [ ] 全文搜索 `#` 十六进制色值：0 处（除组件内部）
- [ ] 全文搜索 `px`：仅允许出现在 `border-width` 等无法令牌化的边线场景
- [ ] 所有交互元素都是 `zone-*` 组件，且带 `label` 或 `aria-label`
- [ ] 弹层类组件（dialog/dropdown/popover/toast）的层级来自 `--zone-index-*`
- [ ] 移动端（<1024px）布局不溢出，字号随令牌自动缩小
- [ ] 深色/自定义主题下只需切换主题变量即可适配，无需改页面代码

## 七、AI 不可自行发明的东西

- 新的颜色值、新的间距刻度、新的字号档位；
- 组件的内部结构（如自行拼装 dialog 的遮罩层）；
- 新的交互模式（ZDS 未覆盖的交互应先提出需求，再补组件）。

规范未覆盖的场景，正确做法是**先补 ZDS（组件或令牌），再生成页面**，而不是在页面里绕过规范。
