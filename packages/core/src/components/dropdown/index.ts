import {
  html,
  LitElement,
  nothing,
  unsafeCSS,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { repeat } from "lit/directives/repeat.js";
import { I18nController } from "@jackery/i18n";
import { dropdownText, getDropdownLanguage } from "./locale";
import { RowHeights } from "./row-heights";
import {
  autoUpdate,
  computePosition,
  flip,
  shift,
  size,
} from "@floating-ui/dom";
import { customElement, property, query, state } from "../../decorators";
import { adoptInternalStyles } from "../../styles/internal-shared";
import {
  buildDropdownTree,
  getDropdownPath,
  getVisibleDropdownNodes,
  type DropdownNode,
} from "./tree-utils";
import type { DropdownOption, DropdownChangeDetail } from "./types";
import styles from "./index.less?inline";
import arrowDown from "../../../../icons/src/icons/system/arrow-down.svg?raw";
import arrowRight from "../../../../icons/src/icons/system/arrow-right.svg?raw";

export type { DropdownOption, DropdownChangeDetail } from "./types";

/**
 * @tag jds-dropdown
 * @summary 单选下拉框；数据包含子节点时自动启用树形列表。
 * @event change - 用户选择或清空时触发，详情类型为 DropdownChangeDetail；支持冒泡并穿透 Shadow DOM。
 * @event jds-dropdown-show - 下拉面板已打开。
 * @event jds-dropdown-hide - 下拉面板已关闭。
 * @csspart trigger - 下拉框触发控件。
 * @csspart panel - 可滚动的选项面板。
 * @csspart option - 选项行。
 * @csspart label - 字段标签。
 */
@customElement("jds-dropdown")
export class JdsDropdown extends LitElement {
  static styles = unsafeCSS(styles);
  static formAssociated = true;

  /** 通过 JavaScript 属性赋值，例如 element.options = [...]。 */
  @property({ attribute: false }) options: DropdownOption[] = [];
  @property() value = "";
  @property() name = "";
  @property() label = "";
  private _placeholder?: string;
  private _emptyText?: string;
  private _requiredMessage?: string;
  private _clearLabel?: string;

  /** 未指定文案时使用当前语言；传入空字符串时保留空字符串。 */
  @property()
  get placeholder(): string {
    return this._placeholder ?? dropdownText(this.ownerDocument, "placeholder");
  }
  set placeholder(value: string | undefined | null) {
    this._placeholder = value ?? undefined;
  }
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean }) clearable = false;
  /** 默认显示所选叶子节点的名称；开启后显示完整路径。 */
  @property({ type: Boolean, attribute: "show-path" }) showPath = false;
  @property({ attribute: "empty-text" })
  get emptyText(): string {
    return this._emptyText ?? dropdownText(this.ownerDocument, "emptyText");
  }
  set emptyText(value: string | undefined | null) {
    this._emptyText = value ?? undefined;
  }
  @property({ attribute: "required-message" })
  get requiredMessage(): string {
    return this._requiredMessage ?? dropdownText(this.ownerDocument, "requiredMessage");
  }
  set requiredMessage(value: string | undefined | null) {
    this._requiredMessage = value ?? undefined;
  }
  @property({ attribute: "clear-label" })
  get clearLabel(): string {
    return this._clearLabel ?? dropdownText(this.ownerDocument, "clearLabel");
  }
  set clearLabel(value: string | undefined | null) {
    this._clearLabel = value ?? undefined;
  }
  @property({ attribute: "error-message" }) errorMessage = "";

  @state() private _expanded = new Set<string>();
  @state() private _active = "";
  @state() private _keyboardNavigation = false;
  @state() private _formDisabled = false;
  @state() private _invalid = false;
  @state() private _scrollTop = 0;
  @state() private _viewportHeight = 360;
  @state() private _layoutVersion = 0;
  @query(".trigger") private _trigger!: HTMLButtonElement;
  @query(".panel") private _panel!: HTMLElement;

  private _i18n?: I18nController;
  private _language = getDropdownLanguage(this.ownerDocument);
  private _languageObserver?: MutationObserver;
  private _tree = buildDropdownTree([]);
  private _internals = this.attachInternals?.();
  private _cleanup?: () => void;
  private _positionVersion = 0;
  private _defaultValue = "";
  private _customValidity = "";
  private _typeahead = "";
  private _typeaheadTime = 0;
  private _visibleCache: DropdownNode[] = [];
  private _enabled: DropdownNode[] = [];
  private _enabledIndices = new Map<string, number>();
  private _visibleIndices = new Map<string, number>();
  private _cachedTree?: typeof this._tree;
  private _cachedExpanded?: Set<string>;
  private _heights = new RowHeights([]);
  private _measuredHeights = new Map<string, number>();
  private _rowObserver?: ResizeObserver;
  private _panelObserver?: ResizeObserver;
  private _observedRows = new Set<Element>();
  private _panelWidth = 0;

  get form() {
    return this._internals?.form ?? null;
  }
  get validity() {
    return this._internals?.validity;
  }
  get validationMessage() {
    return this._internals?.validationMessage ?? "";
  }
  get willValidate() {
    return this._internals?.willValidate ?? false;
  }
  private get _disabled() {
    return this.disabled || this._formDisabled;
  }
  private get _selected() {
    return this._tree.index.get(this.value);
  }
  private get _visible() {
    this._refreshVisible();
    return this._visibleCache;
  }

  private _refreshVisible() {
    if (
      this._cachedTree !== this._tree ||
      this._cachedExpanded !== this._expanded
    ) {
      this._visibleCache = getVisibleDropdownNodes(
        this._tree.roots,
        this._expanded,
      );
      this._enabled = this._visibleCache.filter((node) => !node.disabled);
      this._enabledIndices = new Map(
        this._enabled.map((node, index) => [node.option.value, index]),
      );
      this._visibleIndices = new Map(
        this._visibleCache.map((node, index) => [node.option.value, index]),
      );
      this._heights = new RowHeights(
        this._visibleCache.map(
          (node) => this._measuredHeights.get(node.option.value) ?? 40,
        ),
      );
      this._cachedTree = this._tree;
      this._cachedExpanded = this._expanded;
    }
  }

  private get _virtual() {
    return this._visible.length > 200;
  }
  private get _window() {
    const count = this._visible.length;
    return {
      start: Math.max(0, this._heights.indexAt(this._scrollTop) - 8),
      end: Math.min(
        count,
        this._heights.indexAt(this._scrollTop + this._viewportHeight) + 9,
      ),
    };
  }

  private _activeId() {
    if (!this.open) return undefined;
    if (this._virtual) {
      const index = this._visibleIndices.get(this._active) ?? -1;
      const { start, end } = this._window;
      if (index < start || index >= end) return undefined;
    }
    return this._tree.index.get(this._active)?.id;
  }

  connectedCallback() {
    super.connectedCallback?.();
    this._i18n = new I18nController(this);
    this._languageObserver = new MutationObserver(() => {
      if (getDropdownLanguage(this.ownerDocument) !== this._language)
        this.requestUpdate();
    });
    this._languageObserver.observe(this.ownerDocument.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });
    this.requestUpdate();
    this.addEventListener("invalid", this._onInvalid);
    // 已打开的组件移除后重新挂载时，需要重新绑定浮层定位和外部事件监听。
    void this.updateComplete.then(() => {
      if (this.isConnected && this.open && !this._cleanup)
        this._startPositioning();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this._i18n?.hostDisconnected();
    this._i18n = undefined;
    this._languageObserver?.disconnect();
    this._languageObserver = undefined;
    this._stopPositioning();
    this.removeEventListener("invalid", this._onInvalid);
  }

  protected firstUpdated() {
    if (this.shadowRoot) adoptInternalStyles(this.shadowRoot);
    this._defaultValue = this.getAttribute("value") ?? this.value;
  }

  protected willUpdate(changed: PropertyValues) {
    const language = getDropdownLanguage(this.ownerDocument);
    if (language !== this._language) {
      this._language = language;
      // 渲染错误提示前同步原生校验文案，避免保留上一种语言。
      if (this.hasUpdated) this._syncForm();
    }
    if (changed.has("options")) {
      this._measuredHeights.clear();
      this._tree = buildDropdownTree(this.options);
      this._expanded = new Set(
        [...this._expanded].filter((value) => this._tree.index.has(value)),
      );
    }
    if (changed.has("options") || changed.has("value")) {
      const selected = this._selected;
      // 数据为空时保留尚未匹配的值，以支持异步赋值；
      // 未匹配、已禁用及父节点的值均不参与表单提交。
      if (
        this.options.length &&
        this.value &&
        (!selected || selected.disabled || selected.children.length)
      ) {
        this.value = "";
      }
      if (this.open) this._expandSelection();
    }
    if (this._disabled) this.open = false;
    if (changed.has("open") && this.open) {
      this._expandSelection();
      this._refreshVisible();
      this._active =
        this._selected?.option.value ?? this._enabled[0]?.option.value ?? "";
    }
    if (this.open) this._refreshVisible();
    if (this.open && !this._enabledIndices.has(this._active)) {
      this._active = this._enabled[0]?.option.value ?? "";
    }
    if (
      this.open &&
      this._virtual &&
      (changed.has("_active") ||
        changed.has("open") ||
        changed.has("_expanded") ||
        changed.has("options") ||
        changed.has("_viewportHeight") ||
        (changed.has("_layoutVersion") && this._keyboardNavigation))
    ) {
      const index = this._visibleIndices.get(this._active);
      if (index !== undefined) {
        const top = this._heights.offset(index);
        const bottom = this._heights.offset(index + 1);
        if (top < this._scrollTop || bottom - top > this._viewportHeight)
          this._scrollTop = top;
        else if (bottom > this._scrollTop + this._viewportHeight)
          this._scrollTop = Math.max(0, bottom - this._viewportHeight);
      }
    }
  }

  protected updated(changed: PropertyValues) {
    if (
      [
        "value",
        "options",
        "disabled",
        "_formDisabled",
        "required",
        "requiredMessage",
      ].some((key) => changed.has(key))
    )
      this._syncForm();
    if (changed.has("open")) {
      if (this.open) this._startPositioning();
      else this._stopPositioning();
      if (changed.get("open") !== undefined || this.open) {
        this.dispatchEvent(
          new CustomEvent(
            this.open ? "jds-dropdown-show" : "jds-dropdown-hide",
            {
              bubbles: true,
              composed: true,
            },
          ),
        );
      }
    }
    if (
      this.open &&
      (changed.has("_active") ||
        changed.has("open") ||
        changed.has("_expanded") ||
        changed.has("_viewportHeight") ||
        changed.has("_layoutVersion"))
    ) {
      if (this._virtual) this._panel.scrollTop = this._scrollTop;
      else {
        const row = this.shadowRoot
          ?.getElementById(this._tree.index.get(this._active)?.id ?? "")
          ?.querySelector(".option");
        if (row) {
          const bounds = row.getBoundingClientRect();
          const panel = this._panel.getBoundingClientRect();
          if (bounds.top < panel.top)
            this._panel.scrollTop += bounds.top - panel.top;
          else if (bounds.bottom > panel.bottom)
            this._panel.scrollTop += bounds.bottom - panel.bottom;
        }
      }
    }
    if (changed.has("options")) {
      this._rowObserver?.disconnect();
      this._observedRows.clear();
    }
    if (this.open && this._virtual) this._observeVirtualRows();
    else if (this._rowObserver) {
      this._rowObserver.disconnect();
      this._observedRows.clear();
    }
  }

  private _expandSelection() {
    const ancestors = getDropdownPath(this._selected).slice(0, -1);
    if (ancestors.some((node) => !this._expanded.has(node.option.value))) {
      this._expanded = new Set([
        ...this._expanded,
        ...ancestors.map((node) => node.option.value),
      ]);
    }
  }

  private _syncForm() {
    const selected = this._selected;
    const validSelection =
      !!selected && !selected.disabled && !selected.children.length;
    this._internals?.setFormValue?.(
      !this._disabled && validSelection ? this.value : null,
      this.value,
    );
    const message =
      this._customValidity ||
      (this.required && !validSelection ? this.requiredMessage : "");
    this._internals?.setValidity?.(
      this._disabled
        ? {}
        : {
            customError: !!this._customValidity,
            valueMissing: this.required && !validSelection,
          },
      this._disabled ? "" : message,
      this._trigger,
    );
    if (!message || this._disabled) this._invalid = false;
  }

  checkValidity() {
    this._syncForm();
    return this._internals?.checkValidity?.() ?? true;
  }
  reportValidity() {
    this._syncForm();
    return this._internals?.reportValidity?.() ?? true;
  }
  setCustomValidity(message: string) {
    this._customValidity = message;
    this._syncForm();
  }
  formDisabledCallback(disabled: boolean) {
    this._formDisabled = disabled;
  }
  formResetCallback() {
    this.value = this._defaultValue;
    this._invalid = false;
    this.hide();
  }
  formStateRestoreCallback(value: string | File | FormData | null) {
    this.value = typeof value === "string" ? value : "";
  }
  private _onInvalid = () => {
    this._invalid = true;
  };

  show() {
    if (!this._disabled) this.open = true;
  }
  hide() {
    this.open = false;
  }
  focus(options?: FocusOptions) {
    this._trigger?.focus(options);
  }

  private _startPositioning() {
    this._stopPositioning();
    if (!this._trigger || !this._panel || !this.isConnected) return;
    // 浏览器支持时使用顶层浮层，避免被溢出容器裁切或受到对话框层叠上下文限制。
    this._panel.showPopover?.();
    document.addEventListener("pointerdown", this._onOutside, true);
    document.addEventListener("focusin", this._onOutside, true);
    this._cleanup = autoUpdate(this._trigger, this._panel, () => {
      void this._position();
    });
    if (typeof ResizeObserver !== "undefined") {
      this._panelObserver = new ResizeObserver((entries) => {
        const rect = entries[0]?.contentRect;
        if (!rect || !this.open) return;
        if (rect.height > 0) this._viewportHeight = rect.height;
        if (rect.width > 0 && rect.width !== this._panelWidth) {
          this._panelWidth = rect.width;
          this._measuredHeights.clear();
          this._rowObserver?.disconnect();
          this._observedRows.clear();
          this._cachedTree = undefined;
          this._layoutVersion++;
        }
      });
      this._panelObserver.observe(this._panel);
    }
  }

  private _stopPositioning() {
    this._positionVersion++;
    this._cleanup?.();
    this._cleanup = undefined;
    this._rowObserver?.disconnect();
    this._rowObserver = undefined;
    this._panelObserver?.disconnect();
    this._panelObserver = undefined;
    this._observedRows.clear();
    this._panel?.hidePopover?.();
    document.removeEventListener("pointerdown", this._onOutside, true);
    document.removeEventListener("focusin", this._onOutside, true);
  }

  private async _position() {
    const version = ++this._positionVersion;
    const result = await computePosition(this._trigger, this._panel, {
      strategy: "fixed",
      placement: "bottom-start",
      middleware: [
        flip({ padding: 8 }),
        shift({ padding: 8 }),
        size({
          padding: 8,
          apply: ({ availableHeight, availableWidth, rects, elements }) => {
            if (!this.open || !this.isConnected) return;
            Object.assign(elements.floating.style, {
              width: `${Math.max(0, Math.min(rects.reference.width, availableWidth))}px`,
              maxHeight: `min(var(--jds-dropdown-max-height, 360px), ${Math.max(0, availableHeight)}px)`,
            });
          },
        }),
      ],
    });
    if (version !== this._positionVersion || !this.open || !this.isConnected)
      return;
    Object.assign(this._panel.style, {
      left: `${result.x}px`,
      top: `${result.y}px`,
    });
  }

  private _onOutside = (event: Event) => {
    if (!event.composedPath().includes(this)) this.hide();
  };

  private _observeVirtualRows() {
    if (typeof ResizeObserver === "undefined") return;
    if (!this._rowObserver)
      this._rowObserver = new ResizeObserver((entries) => {
        if (!this.open) return;
        const anchor = this._heights.indexAt(this._scrollTop);
        const before = this._heights.offset(anchor);
        let changed = false;
        for (const entry of entries) {
          const value = (entry.target as HTMLElement).dataset.value!;
          const index = this._visibleIndices.get(value);
          const height =
            entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
          if (index !== undefined && this._heights.set(index, height)) {
            this._measuredHeights.set(value, height);
            changed = true;
          }
        }
        if (changed) {
          this._scrollTop += this._heights.offset(anchor) - before;
          this._panel.scrollTop = this._scrollTop;
          this._layoutVersion++;
        }
      });
    const rows = new Set(
      this.shadowRoot!.querySelectorAll("[data-virtual-row]"),
    );
    for (const row of this._observedRows)
      if (!rows.has(row)) this._rowObserver.unobserve(row);
    for (const row of rows)
      if (!this._observedRows.has(row)) this._rowObserver.observe(row);
    this._observedRows = rows;
  }

  private _renderOptions() {
    if (!this.open) return nothing;
    if (!this._virtual) return this._renderNodes(this._tree.roots);
    const { start, end } = this._window;
    return html`
      <div
        role="none"
        aria-hidden="true"
        style=${styleMap({ height: `${this._heights.offset(start)}px` })}
      ></div>
      ${repeat(
        this._visible.slice(start, end),
        (node) => node.option.value,
        (node) => this._renderNodes([node], false),
      )}
      <div
        role="none"
        aria-hidden="true"
        style=${styleMap({
          height: `${this._heights.offset(this._visible.length) - this._heights.offset(end)}px`,
        })}
      ></div>
    `;
  }

  private _activate(node: DropdownNode, keyboard = false) {
    if (this._disabled || node.disabled) return;
    this._keyboardNavigation = keyboard;
    this._active = node.option.value;
    if (node.children.length) {
      const expanded = new Set(this._expanded);
      if (expanded.has(node.option.value)) expanded.delete(node.option.value);
      else expanded.add(node.option.value);
      this._expanded = expanded;
    } else {
      const changed = this.value !== node.option.value;
      this.value = node.option.value;
      this._invalid = false;
      this._syncForm();
      this.hide();
      this.focus();
      if (changed) this._emitChange();
    }
  }

  private _emitChange() {
    const path = getDropdownPath(this._selected);
    const detail: DropdownChangeDetail = {
      value: this.value,
      option: this._selected?.option ?? null,
      pathValues: path.map((node) => node.option.value),
      pathLabels: path.map((node) => node.option.label),
    };
    this.dispatchEvent(
      new CustomEvent<DropdownChangeDetail>("change", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _clear = () => {
    if (this._disabled || !this.value) return;
    this.value = "";
    this._syncForm();
    this.focus();
    this._emitChange();
  };

  private _onKeydown = (event: KeyboardEvent) => {
    if (this._disabled) return;
    if (event.key === "Tab") {
      this.hide();
      return;
    }
    if (event.key === "Escape") {
      if (this.open) {
        event.preventDefault();
        event.stopPropagation();
        this.hide();
      }
      return;
    }
    if (
      !this.open &&
      ["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)
    ) {
      event.preventDefault();
      this._keyboardNavigation = true;
      this.show();
      if (event.key === "ArrowUp")
        void this.updateComplete.then(() => {
          this._refreshVisible();
          this._active = this._enabled.at(-1)?.option.value ?? "";
        });
      return;
    }
    if (!this.open) return;
    this._keyboardNavigation = true;
    this._refreshVisible();
    const visible = this._enabled;
    const current = this._enabledIndices.get(this._active) ?? -1;
    const node = this._tree.index.get(this._active);
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        const next = Math.max(
          0,
          Math.min(
            visible.length - 1,
            current + (event.key === "ArrowDown" ? 1 : -1),
          ),
        );
        this._active = visible[next]?.option.value ?? "";
        break;
      }
      case "Home":
        this._active = visible[0]?.option.value ?? "";
        break;
      case "End":
        this._active = visible.at(-1)?.option.value ?? "";
        break;
      case "ArrowRight":
        if (node?.children.length) {
          if (!this._expanded.has(node.option.value))
            this._activate(node, true);
          else
            this._active =
              node.children.find((child) => !child.disabled)?.option.value ??
              this._active;
        }
        break;
      case "ArrowLeft":
        if (node?.children.length && this._expanded.has(node.option.value))
          this._activate(node, true);
        else if (node?.parent) this._active = node.parent.option.value;
        break;
      case "Enter":
      case " ":
        if (node) this._activate(node, true);
        break;
      default: {
        if (
          event.key.length !== 1 ||
          event.ctrlKey ||
          event.metaKey ||
          event.altKey ||
          event.isComposing
        )
          return;
        const now = Date.now();
        this._typeahead =
          now - this._typeaheadTime > 700
            ? event.key
            : this._typeahead + event.key;
        this._typeaheadTime = now;
        const query = this._typeahead.toLocaleLowerCase();
        const match = [
          ...visible.slice(current + 1),
          ...visible.slice(0, current + 1),
        ].find((item) =>
          item.option.label.toLocaleLowerCase().startsWith(query),
        );
        if (match) this._active = match.option.value;
      }
    }
    event.preventDefault();
  };

  private _renderNodes(nodes: DropdownNode[], nested = true): TemplateResult[] {
    return nodes.map((node) => {
      const branch = node.children.length > 0;
      const expanded = this._expanded.has(node.option.value);
      const tree = this._tree.hierarchical;
      return html` <div
        role=${tree ? "treeitem" : "option"}
        id=${node.id}
        aria-label=${node.option.label}
        aria-expanded=${ifDefined(branch ? String(expanded) : undefined)}
        aria-selected=${ifDefined(
          branch ? undefined : String(this.value === node.option.value),
        )}
        aria-disabled=${String(node.disabled)}
        aria-level=${ifDefined(tree ? String(node.depth + 1) : undefined)}
        aria-posinset=${String(node.position)}
        aria-setsize=${String(node.siblings)}
        data-virtual-row=${ifDefined(nested ? undefined : "")}
        data-value=${ifDefined(nested ? undefined : node.option.value)}
      >
        <div
          part="option"
          class="option ${node.depth === 0 ? "root-option" : ""} ${tree
            ? "tree-option"
            : ""} ${branch ? "branch" : "leaf"}"
          data-active=${String(
            this._keyboardNavigation && this._active === node.option.value,
          )}
          data-selected=${String(this.value === node.option.value)}
          data-disabled=${String(node.disabled)}
          style=${styleMap({ "--depth": String(node.depth) })}
          @pointerdown=${(event: PointerEvent) => {
            if (event.button === 0) event.preventDefault();
          }}
          @click=${() => this._activate(node)}
        >
          ${branch
            ? html`<span
                class="branch-icon ${expanded ? "expanded" : ""}"
                aria-hidden="true"
              >
                ${unsafeSVG(arrowRight)}
              </span>`
            : nothing}
          <span class="option-text">${node.option.label}</span>
        </div>
        ${nested && branch && expanded
          ? html`<div role="group">${this._renderNodes(node.children)}</div>`
          : nothing}
      </div>`;
    });
  }

  render() {
    const selected = this._selected;
    const text = selected
      ? this.showPath
        ? getDropdownPath(selected)
            .map((node) => node.option.label)
            .join(" / ")
        : selected.option.label
      : this.placeholder;
    const error =
      this.errorMessage || (this._invalid ? this.validationMessage : "");
    return html`
      ${this.label
        ? html`<label id="label" part="label" class="label" for="trigger"
            >${this.label}${this.required
              ? html`<span class="required" aria-hidden="true">*</span>`
              : nothing}</label
          >`
        : nothing}
      <div
        class="control ${this.clearable && this.value ? "has-clear" : ""}"
        data-invalid=${String(!!error || this._invalid)}
      >
        <button
          id="trigger"
          type="button"
          class="trigger"
          part="trigger"
          role="combobox"
          aria-label=${ifDefined(
            this.label
              ? undefined
              : this.getAttribute("aria-label") || this.placeholder,
          )}
          aria-labelledby=${ifDefined(this.label ? "label" : undefined)}
          aria-haspopup=${this._tree.hierarchical ? "tree" : "listbox"}
          aria-expanded=${String(this.open)}
          aria-controls="options"
          aria-activedescendant=${ifDefined(this._activeId())}
          aria-required=${String(this.required)}
          aria-invalid=${String(!!error || this._invalid)}
          aria-describedby=${ifDefined(error ? "error" : undefined)}
          ?disabled=${this._disabled}
          @click=${() => {
            this._keyboardNavigation = false;
            if (this.open) this.hide();
            else this.show();
          }}
          @keydown=${this._onKeydown}
        >
          <span
            class="value ${selected ? "" : "placeholder"}"
            title=${selected ? text : ""}
            >${text}</span
          >
          <span
            class="trigger-icon ${this.open ? "expanded" : ""}"
            aria-hidden="true"
          >
            ${unsafeSVG(arrowDown)}
          </span>
        </button>
        ${this.clearable && this.value
          ? html`<button
              type="button"
              class="clear"
              part="clear"
              aria-label=${this.clearLabel}
              ?disabled=${this._disabled}
              @click=${this._clear}
            >
              ×
            </button>`
          : nothing}
      </div>
      <div
        class="panel"
        part="panel"
        popover="manual"
        ?hidden=${!this.open}
        @keydown=${this._onKeydown}
        @scroll=${() => {
          if (
            this.open &&
            this._virtual &&
            Math.abs(this._scrollTop - this._panel.scrollTop) > 0.5
          ) {
            this._keyboardNavigation = false;
            this._scrollTop = this._panel.scrollTop;
          }
        }}
      >
        <div
          id="options"
          role=${this._tree.hierarchical ? "tree" : "listbox"}
          aria-label=${this.label ||
          this.getAttribute("aria-label") ||
          this.placeholder}
        >
          ${this._renderOptions()}
        </div>
        ${this.options.length
          ? nothing
          : html`<div class="empty" role="status">${this.emptyText}</div>`}
      </div>
      ${error
        ? html`<div id="error" class="error" part="error" aria-live="polite">
            ${error}
          </div>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jds-dropdown": JdsDropdown;
  }
}
