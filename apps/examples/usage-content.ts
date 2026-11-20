export type UsageGuide = {
  when: string;
  choose: [string, string][];
  html: string;
  js?: string;
  css?: string;
  imports?: string[];
  lang?: string;
  notes: string[];
  api?: string;
};

/** Per-page guidance and tested, caller-owned examples. No specimen content is replaced. */
export const usageGuides: Record<string, UsageGuide> = {
  "index.html": {
    when: "先按任务找到组件，再比较三套主题和完整状态；接入前可以从一个最小示例开始。",
    choose: [
      [
        "单个操作或选择",
        "进入按钮、复选框、下拉或多选筛选，查看边界与键盘行为。",
      ],
      ["多个组件组成页面", "先看组件总览与状态边界，再试用账户设置完整页面。"],
      [
        "字体、排版或语言",
        "使用设计资源和多语言分类；站点明暗切换与 V1/V2/V3 组件主题相互独立。",
      ],
    ],
    html: '<zone-button>开始使用</zone-button>\n<zone-checkbox label="接收更新"></zone-checkbox>',
    notes: [
      "完整保留所有状态，页面上的小号、加载或禁用示例不代表默认推荐尺寸。",
      "平板不再按整张手机设计稿持续放大；布局按容器换行，触屏操作区域单独适配。",
      "文档对应当前仓库构建；安装已发布包时需核对所需功能是否已发布。",
    ],
  },
  "atoms/button.html": {
    when: "触发保存、确认、重试等操作；如果目的是前往另一个位置，使用带 href 的链接按钮。",
    choose: [
      ["primary", "当前区域最重要的操作，避免多个主操作竞争。"],
      [
        "secondary / text",
        "次要操作使用描边；低强调操作或工具入口使用文字样式。",
      ],
      [
        "loading / disabled / size",
        "异步等待时 loading 防止重复提交；disabled 表示当前不可操作；按空间和触屏需要选择尺寸。",
      ],
    ],
    html: '<zone-button id="save">保存资料</zone-button>\n<zone-button variant="secondary">取消</zone-button>\n<p id="save-result" role="status"></p>',
    js: "const button = document.querySelector('#save');\nbutton.addEventListener('zone-click', () => {\n  document.querySelector('#save-result').textContent = '演示：已触发保存操作';\n});",
    notes: [
      '表单提交明确设置 type="submit"，普通操作使用默认按钮行为。',
      "仅图标按钮通过 label 提供操作名称，不把重要信息只放在悬浮提示里。",
      "三套主题、全部现有尺寸与动效保留；小号按钮适合紧凑区域，触屏主操作优先选择较大尺寸。",
    ],
    api: "zone-button",
  },
  "atoms/checkbox.html": {
    when: "允许独立开关一个选项，或在一组项目中选择多个；整体部分选中时使用半选状态。",
    choose: [
      ["checked", "明确选中，可通过 name 和 value 参与原生表单。"],
      [
        "indeterminate",
        "表示部分子项已选；它不是第三种提交值，用户切换后回到确定状态。",
      ],
      ["disabled", "选项不可操作时使用；说明原因，而不是仅降低透明度。"],
    ],
    html: '<form id="services">\n  <zone-checkbox name="service" value="gift" checked label="礼品包装"></zone-checkbox>\n  <zone-checkbox name="service" value="card" label="祝福卡片"></zone-checkbox>\n  <button type="reset">重置选择</button>\n</form>\n<pre id="services-result" role="status"></pre>',
    js: "const form = document.querySelector('#services');\nform.addEventListener('change', () => {\n  document.querySelector('#services-result').textContent = JSON.stringify([...new FormData(form)]);\n});",
    notes: [
      "用可见标签说明选择结果；Tab 聚焦、空格切换，整行标签均可点击。",
      "复选框用于多选；互斥选择应使用单选模式或下拉选择。",
      "较长标签会换行；不要用固定高度裁切说明。",
    ],
    api: "zone-checkbox",
  },
  "atoms/badge.html": {
    when: "用简短文字表达状态、类别或数量；不要用徽章代替需要复杂操作的按钮。",
    choose: [
      [
        "soft / outline / solid",
        "浅底适合多数状态，描边减少填色，实色用于需要更强强调的状态。",
      ],
      ["kind", "按信息含义选择 success、warning、danger 等，并保留文字说明。"],
      ["count / href", "数量使用 count 与 max-count；确需导航时使用 href。"],
    ],
    html: '<zone-badge kind="success" icon="check-fill">已确认</zone-badge>\n<zone-badge kind="warning" variant="outline">待审核</zone-badge>\n<zone-badge count="120" max-count="99" aria-label-text="120 条未读消息"></zone-badge>',
    notes: [
      "颜色不能成为唯一的状态提示，文字应能独立说明含义。",
      "使用短标签；长文本虽能换行，详细解释更适合正文或提示。",
      "small 隐藏图标是既有设计；不要依赖小号徽章的图标传递唯一信息。",
    ],
    api: "zone-badge",
  },
  "atoms/dropdown.html": {
    when: "从多个选项中选择一个值，适合配送方式、产品规格和层级分类等需要节省空间的场景。",
    choose: [
      ["平面选项", "没有层级时传入简单数组，标签清晰、值保持唯一。"],
      [
        "树形 / 大数据",
        "分类使用 children；大列表使用已有虚拟滚动能力，并在真实数据下检查长标签。",
      ],
      [
        "clearable / required / disabled",
        "允许撤销时提供清空；必填与禁用状态应配合可理解的说明。",
      ],
    ],
    html: '<zone-dropdown id="shipping" label="配送方式" placeholder="请选择" clearable></zone-dropdown>\n<p id="shipping-result" role="status"></p>',
    js: "const select = document.querySelector('#shipping');\nselect.options = [\n  { value: 'standard', label: '标准配送' },\n  { value: 'express', label: '加急配送' },\n  { value: 'unavailable', label: '暂不可用', disabled: true },\n];\nselect.addEventListener('change', (event) => {\n  document.querySelector('#shipping-result').textContent = event.detail.pathLabels.join(' / ');\n});",
    notes: [
      "复杂 options 通过 JavaScript property 传入，不把对象数组写成普通 HTML 字符串。",
      "value 必须是非空且唯一的字符串；禁用父节点的可用性要和业务规则一起核对。",
      "方向键移动、Enter 确认、Escape 关闭；多选筛选应选择 FilterSelect。",
    ],
    api: "zone-dropdown",
  },
  "atoms/filter-select.html": {
    when: "在列表中选择多个筛选条件，适合一次勾选多个服务或规格，再统一确认。",
    choose: [
      ["默认确认模式", "面板中的勾选和清空只修改草稿，按确认后才更新 value。"],
      [
        'show-confirm="false"',
        "选项切换立即生效；适合无需批量提交的轻量筛选。",
      ],
      [
        "show-counter / show-clear",
        "按需要显示计数和清空；保持触发器标签可理解。",
      ],
    ],
    html: '<zone-filter-select id="service-filter" label="筛选服务"></zone-filter-select>\n<p id="filter-result" role="status"></p>',
    js: "const filter = document.querySelector('#service-filter');\nfilter.options = [\n  { value: 'gift', label: '礼品包装' },\n  { value: 'card', label: '祝福卡片' },\n  { value: 'later', label: '暂未开放', disabled: true },\n];\nfilter.addEventListener('zone-filter-select-change', (event) => {\n  document.querySelector('#filter-result').textContent = event.detail.value.join(', ');\n});",
    notes: [
      "关闭面板会丢弃未确认草稿；不要在普通选项点击时假定业务值已提交。",
      "options 与 value 通过 property 传入；不要把 JavaScript 数组直接放进 HTML attribute。",
      "方向键、Home、End 移动焦点，空格选择；列表内部滚动不会关闭面板。",
    ],
    api: "zone-filter-select",
  },
  "atoms/dialog.html": {
    when: "需要用户专注确认、填写或阅读一段独立内容时使用；低风险提示优先使用普通正文或通知。",
    choose: [
      [
        "large / extra",
        "普通确认用 large；更多内容用 extra，窄屏可呈现底部面板。",
      ],
      ["critical", "确实需要显式决策时使用，同时提供清晰的完成或取消入口。"],
      [
        "caption / header / footer",
        "纯文本标题用 caption，富标题用 header 插槽，操作放 footer 插槽。",
      ],
    ],
    html: '<zone-button id="open-confirm">检查配送信息</zone-button>\n<zone-dialog id="confirm-dialog" caption="确认配送信息">\n  <p>请核对收件信息，确认后再提交。</p>\n  <zone-button id="close-confirm" slot="footer">确认并关闭</zone-button>\n</zone-dialog>',
    js: "const dialog = document.querySelector('#confirm-dialog');\ndocument.querySelector('#open-confirm').addEventListener('zone-click', () => { dialog.open = true; });\ndocument.querySelector('#close-confirm').addEventListener('zone-click', () => { dialog.open = false; });",
    notes: [
      "caption 按纯文本处理；带格式的标题请放入 header 插槽。",
      "长内容从顶部开始，正文在弹窗内部滚动；重要信息不要只放在底部。",
      "默认支持 Escape 和焦点恢复；自定义 initial-focus 前检查键盘路径与长内容起始位置。",
    ],
    api: "zone-dialog",
  },
  "atoms/popover.html": {
    when: "与某个触发器紧密相关的补充信息或轻量操作，可以不打断整个页面。",
    choose: [
      ["Popover", "内容包含链接、按钮或需要停留阅读的信息时使用。"],
      ["Tooltip", "仅有简短的非交互说明时，改用 Tooltip。"],
      [
        "placement / manual",
        "placement 表达首选方向；manual 仅用于由外部逻辑接管触发的组合组件。",
      ],
    ],
    html: '<zone-button id="details-trigger" variant="secondary">配送说明</zone-button>\n<zone-popover target="details-trigger" placement="bottom-start">\n  <p>工作日安排配送，签收前会发送通知。</p>\n</zone-popover>',
    notes: [
      "target 必须指向实际存在的触发器；更换或移除触发器时检查关闭和焦点行为。",
      "方向只是首选，空间不足时浮层会翻转或位移，不应依赖绝对像素位置。",
      "长内容会在内部滚动；完整表单或必须确认的信息更适合对话框。",
    ],
    api: "zone-popover",
  },
  "atoms/tooltip.html": {
    when: "为图标或术语提供简短的非交互说明；触发器自身的操作仍应保持有效。",
    choose: [
      ["触发器插槽", "一般用 tooltip-trigger 插槽包住真实按钮或链接。"],
      [
        "target",
        "已有触发器需要关联说明时，使用元素 ID 或 JavaScript 元素引用。",
      ],
      ["placement", "按阅读路径选择首选方向，让组件处理视口边界。"],
    ],
    html: '<zone-tooltip placement="top">\n  <zone-button slot="tooltip-trigger" variant="secondary">了解配送</zone-button>\n  工作日安排配送，节假日可能顺延。\n</zone-tooltip>',
    notes: [
      "提示中不放按钮、链接或表单；需要交互内容时使用 Popover。",
      "重要说明应直接可见，不让用户必须悬停才能获知。",
      "键盘聚焦可查看、Escape 可关闭；触屏仍保留触发器的主操作。",
    ],
    api: "zone-tooltip",
  },
  "atoms/toast.html": {
    when: "操作后给出简短结果或下一步反馈，适合保存成功、可恢复错误等非阻断信息。",
    choose: [
      [
        "variant / icon",
        "按语义选择成功、警告、危险或信息，并结合文字和图标。",
      ],
      [
        "closable / countdown-time",
        "可关闭适合持续信息；倒计时只用于不需要长时间阅读的轻提示。",
      ],
      [
        "action / action-secondary",
        "确需立即处理时提供简短操作，较复杂流程转到页面或弹窗。",
      ],
    ],
    html: '<zone-button id="show-notice">显示保存结果</zone-button>\n<zone-toast id="saved-notice" variant="success" icon closable closed caption="资料已保存" description="你可以继续编辑其他信息。"></zone-toast>',
    js: "const notice = document.querySelector('#saved-notice');\ndocument.querySelector('#show-notice').addEventListener('zone-click', () => { notice.open(); });",
    notes: [
      "closed 才表示初始隐藏；不写 closed 时通知会显示。",
      "倒计时单位是秒；重要错误或带操作的信息应留足阅读和操作时间。",
      "通知宽度不超过父容器；长文本与操作会换行，避免手动固定高度。",
    ],
    api: "zone-toast",
  },
  "atoms/spinner.html": {
    when: "表达短暂且进度未知的等待状态；如果进度可量化，应另行提供进度信息。",
    choose: [
      ["行内加载", "与状态文字一起使用，字号和图标大小保持协调。"],
      ["overlay", "仅覆盖正在加载的局部容器，父容器需要 position: relative。"],
      ["按钮 loading", "按钮内等待直接使用 Button 的 loading，避免重复播报。"],
    ],
    html: '<div class="loading-region" aria-busy="true">\n  <p>正在加载配送信息</p>\n  <zone-spinner overlay size="24px" label="正在加载配送信息"></zone-spinner>\n</div>',
    css: ".loading-region { position: relative; min-height: 120px; padding: 20px; }",
    notes: [
      "独立加载区通过 label 提供名称；按钮内部无需重复设置相同名称。",
      "完成时移除加载状态，并将容器 aria-busy 改为 false。",
      "disabled 暂停旋转；减少动效设置下图标保持静止，状态文字仍需可见。",
    ],
    api: "zone-spinner",
  },
  "atoms/icons.html": {
    when: "给操作或信息补充熟悉的视觉线索；图标命名和尺寸应在同一页面中保持一致。",
    choose: [
      ["装饰图标", "旁边已有清晰文字时，图标作为补充，避免重复播报。"],
      ["仅图标操作", "优先使用带 label 的图标按钮，而非给裸图标绑定点击。"],
      [
        "尺寸与方向",
        "使用字号控制图标尺寸；方向图标需在多语言排版中核对含义。",
      ],
    ],
    html: '<p><zone-icon name="check-fill" aria-hidden="true"></zone-icon> 配送信息已确认</p>\n<zone-button icon="close" label="关闭面板" variant="text"></zone-button>',
    notes: [
      "name 必须使用图标库已有名称；图标目录可搜索和复制名称。",
      "只传达状态的图标应配合文字，不以颜色或形状作为唯一说明。",
      "裸图标不等于可操作控件；键盘和命名交给按钮或链接。",
    ],
  },
  "components/index.html": {
    when: "评估多个组件组合后的视觉和交互一致性，作为页面搭建前的快速核对入口。",
    choose: [
      ["动作与状态", "按钮触发操作，徽章说明静态状态，通知反馈操作结果。"],
      [
        "选择与筛选",
        "独立多选用复选框，单值选择用 Dropdown，批量筛选用 FilterSelect。",
      ],
      [
        "说明与确认",
        "简短说明用 Tooltip，轻量补充内容用 Popover，专注决策用 Dialog。",
      ],
    ],
    html: '<section aria-labelledby="delivery-title">\n  <h2 id="delivery-title">配送偏好</h2>\n  <zone-checkbox label="接收配送更新"></zone-checkbox>\n  <zone-badge kind="success">可配送</zone-badge>\n  <zone-button id="save-preferences">保存偏好</zone-button>\n  <p id="preferences-result" role="status"></p>\n</section>',
    js: "document.querySelector('#save-preferences').addEventListener('zone-click', () => {\n  document.querySelector('#preferences-result').textContent = '演示：偏好已保存';\n});",
    notes: [
      "总览用于比较组件，不代替各组件页的行为与属性说明。",
      "保持同一区域中的主题一致；不要混合不同主题的按钮与字体令牌。",
      "本站明暗主题只改变文档外框，V1/V2/V3 控制演示组件。",
    ],
  },
  "components/refinement.html": {
    when: "在正式接入前，核对长文本、半选、键盘操作、低高度窗口和触屏下的组件边界。",
    choose: [
      ["常规场景", "先用组件页选择合适变体，再回到这里检查边界。"],
      [
        "平板与触屏",
        "同时改变宽度和输入方式；较大的平板宽度不意味着应放大到手机设计稿字号。",
      ],
      ["组合交互", "连续使用选择器、弹窗和通知，核对关闭、提交与焦点返回。"],
    ],
    html: '<zone-checkbox indeterminate label="全部服务（部分已选）"></zone-checkbox>\n<zone-badge style="max-width: 180px">等待审核：配送说明需要补充</zone-badge>\n<zone-toast icon caption="资料已更新" description="较长说明会在容器内换行。"></zone-toast>',
    notes: [
      "本页故意包含长标识符和长列表，它们是边界检查内容，不是推荐业务文案。",
      "检查 1023px 和 1024px 两侧，以及短窗口、键盘和真实触屏。",
      "不要通过隐藏原场景或裁切页面来掩盖适配问题。",
    ],
  },
  "components/public-style.html": {
    when: "给组件周边的布局、文字和间距提供统一的样式基础，减少单页重复定义。",
    choose: [
      ["语义文字类", "正文和标题使用 .zone-b*、.zone-h* 等已有类。"],
      ["设计变量", "使用 --zone-* 调整组件，业务布局使用自己命名的 CSS 类。"],
      [
        "页面布局",
        "Grid / Flex 用于列和换行，不用根字号把整张页面按比例放大。",
      ],
    ],
    html: '<section class="delivery-panel">\n  <h2 class="zone-h5">配送服务</h2>\n  <p class="zone-b2">检查地址后选择配送方式。</p>\n  <zone-button>选择配送</zone-button>\n</section>',
    css: ".delivery-panel { display: grid; gap: 16px; padding: 24px; }\n.delivery-panel > * { margin: 0; }",
    notes: [
      "CSS 自定义属性中的 Less 运算需要确认编译结果；现有示例保留了正确与错误写法。",
      "业务样式不要依赖组件 Shadow DOM 的内部类名。",
      "根字号与设计稿 rem 换算是不同层次；不能为了平板布局把所有文字放大。",
    ],
  },
  "components/rte.html": {
    when: "为说明、文章和帮助内容提供一致的富文本排版，而不是把业务表单当作富文本。",
    choose: [
      [
        ".zone-rte 容器",
        "将经过清洗的文章内容放入容器，统一标题、段落、列表和表格。",
      ],
      ["语义标题", "按文档层级选择 h2/h3 等，不以标签级别代替字体大小设置。"],
      ["普通组件区域", "按钮、选择器等交互区域尽量保持在富文本容器之外。"],
    ],
    html: '<article class="zone-rte">\n  <h2>配送说明</h2>\n  <p>确认地址后，我们会发送配送通知。</p>\n  <h3>签收前请核对</h3>\n  <ul><li>收件人和电话</li><li>地址与配送时间</li></ul>\n</article>',
    notes: [
      "外部 HTML 必须先清洗，排版容器不会自动提供内容安全过滤。",
      "较宽表格应使用局部滚动容器，不把整个页面撑宽。",
      "保留标题层级、链接名称和图片说明，并检查长段落阅读节奏。",
    ],
  },
  "font/en.html": {
    when: "核对英文标题、正文、字重与混排效果，为页面建立清晰的文字层级。",
    lang: "en",
    choose: [
      ["标题", "h* / display 用于层级明确的标题，不用于普通控件标签。"],
      ["正文", "b1/b2/b3 按信息密度选择，避免同一段混用过多字重。"],
      ["辅助说明", "c1 用于辅助信息；重要信息不能通过极小字号弱化。"],
    ],
    html: '<section lang="en">\n  <h2 class="zone-h5">Delivery preferences</h2>\n  <p class="zone-b1">Choose how you receive updates.</p>\n  <p class="zone-b2">You can change this later.</p>\n</section>',
    notes: [
      "示例中的展示级标题故意较大，不是表单和按钮的默认字号。",
      "字体加载完成后再检查字宽、换行和布局；业务页面需考虑网络失败回退。",
      "手机、平板、桌面应保持层级比例，布局变化不依赖整页文字缩放。",
    ],
  },
  "font/ja.html": {
    when: "核对日文的字形、行距、字重与拉丁数字混排，避免直接照搬英文的文字密度。",
    lang: "ja",
    choose: [
      ["语言标记", '日文页面设置 html lang="ja"，局部日文内容设置对应 lang。'],
      ["V1 / V2", "使用现有日文字体适配，结合真实日文段落检查。"],
      [
        "V3",
        "保留比较入口，但 V3 未提供专门的日文字体适配，不作为日文默认方案。",
      ],
    ],
    html: '<section lang="ja">\n  <h2 class="zone-h5">配送について</h2>\n  <p class="zone-b1">お届け先と配送方法をご確認ください。</p>\n  <p class="zone-b2">通知設定は後から変更できます。</p>\n</section>',
    notes: [
      "语言代码使用 ja；jp 是国际化模块保留的兼容别名，不建议作为新页面语言标记。",
      "日本语需要检查标点、连续文本和实际断行，不能只看单字样张。",
      "三套主题的现有演示均保留；选择日文生产主题时优先核对 V1/V2。",
    ],
  },
  "i18n/index.html": {
    when: "同一页面需要切换语言，并更新组件标签、普通 DOM 文案和插值内容时使用。",
    imports: ["setCurrLanguage"],
    choose: [
      ["zone-i18n", "需要自动响应语言变化的文案，优先使用翻译组件。"],
      ["data-i18n-key", "已有静态 DOM 可使用声明式标记，由初始化过程绑定。"],
      [
        "t()",
        "即时获取字符串；JavaScript 自己管理的内容需在语言变化后重新计算。",
      ],
    ],
    html: '<zone-button id="switch-language">切换为日语</zone-button>\n<p><zone-i18n key="common.ok"></zone-i18n></p>\n<p><zone-i18n key="common.welcome" params=\'{"name":"Alex"}\'></zone-i18n></p>',
    js: "document.querySelector('#switch-language').addEventListener('zone-click', () => {\n  setCurrLanguage('ja');\n});",
    notes: [
      "先 initialize() 再使用翻译；不要在每次渲染时重复添加自己的监听。",
      "模板字符串写在静态 HTML 中不会自动执行，原页保留了错误写法用于对照。",
      "使用真实翻译键并核对插值参数；换语言后同时检查文字长度和控件布局。",
    ],
  },
  "i18n/all.html": {
    when: "查找已有翻译键、核对不同语言的覆盖情况，再把选中的键接入页面。",
    imports: ["t", "setCurrLanguage"],
    choose: [
      [
        "查找键",
        "先确认键的含义，再复用到业务位置；不要只按当前显示文字猜测。",
      ],
      ["变量文案", "包含占位符的键需要传递对应参数。"],
      [
        "新业务文案",
        "维护业务自己的语言资源，不随意修改组件内部的通用键含义。",
      ],
    ],
    html: '<p id="translated-result" role="status"></p>',
    js: "setCurrLanguage('en');\ndocument.querySelector('#translated-result').textContent = t('common.welcome', { name: 'Alex' });",
    notes: [
      "翻译表用于核对资源；真实页面仍要检查语境、占位符和换行。",
      "缺少翻译时可能显示键名，发布前应检查目标语言。",
      "导出的资源或表格需要经过内容审核，再更新到实际语言包。",
    ],
  },
};
