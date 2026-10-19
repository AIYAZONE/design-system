import {
  html,
  LitElement,
  nothing,
  unsafeCSS,
  CSSResultGroup,
  TemplateResult,
  PropertyValues,
} from "lit";
import { customElement, property, query, state } from "../../decorators";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import {
  autoUpdate,
  computePosition,
  flip,
  offset as offsetMiddleware,
  Placement,
  shift,
  size,
} from "@floating-ui/dom";
import { I18nController, t } from "@jackery/i18n";

import styles from "./index.less?inline";
import { adoptInternalStyles } from "../../styles/internal-shared";

/**
 * 下拉筛选项
 */
export interface FilterSelectOption {
  /** 选项值 */
  value: string;
  /** 选项文案 */
  label: string;
  /** 是否禁用 */
  disabled?: boolean;
}

let uid = 0;

/**
 * 宽松布尔属性转换器
 *
 * HTML 布尔属性按规范是「存在即为真」，但本组件中 show-confirm / show-clear /
 * show-counter / close-on-scroll 默认值为 true，若沿用标准语义，
 * 纯 HTML 环境下将永远无法关闭（省略属性即取默认 true）。
 * 因此这里额外支持 `attr="false"` / `attr="0"` 表示关闭：
 * - `<jds-filter-select>`                → true（默认）
 * - `<jds-filter-select show-confirm>`   → true
 * - `<jds-filter-select show-confirm="false">` → false
 */
const looseBooleanConverter = {
  fromAttribute: (value: string | null): boolean =>
    value !== null && value !== "false" && value !== "0",
  toAttribute: (value: boolean): string | null => (value ? "" : "false"),
};

/**
 * JDS FilterSelect 组件
 * 下拉筛选多选：触发器 + 浮层面板（已选计数 / 清空 / 多选列表 / 确认按钮）
 *
 * 默认采用「草稿 + 确认」语义：面板内的勾选只更新草稿，点击确认后才提交到 `value`。
 * 当 `show-confirm` 为 false 时切换为「即时生效」模式。
 */
@customElement("jds-filter-select")
export class JdsFilterSelect extends LitElement {
  static styles = [unsafeCSS(styles)] as CSSResultGroup;

  protected firstUpdated(): void {
    if (this.shadowRoot) adoptInternalStyles(this.shadowRoot);
  }

  /**
   * 触发器文案。未设置时取内置多语言 `components.filterSelect.label`。
   */
  @property()
  label?: string;

  /**
   * 可选项列表
   */
  @property({
    type: Array,
    converter: {
      fromAttribute: (raw: string | null): FilterSelectOption[] => {
        if (!raw) return [];
        try {
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? (parsed as FilterSelectOption[]) : [];
        } catch {
          return [];
        }
      },
    },
  })
  options: FilterSelectOption[] = [];

  /**
   * 已提交的选中值
   */
  @property({
    type: Array,
    converter: {
      fromAttribute: (raw: string | null): string[] =>
        raw ? raw.split(",").map((item) => item.trim()).filter(Boolean) : [],
    },
  })
  value: string[] = [];

  /**
   * 面板是否展开
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * 是否禁用
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * 浮层位置
   */
  @property()
  placement: Placement = "bottom-start";

  /**
   * 浮层与触发器的间距
   */
  @property({ type: Number })
  offset = 4;

  /**
   * 是否展示底部确认按钮（false 时为即时生效模式）
   */
  @property({ type: Boolean, converter: looseBooleanConverter, attribute: "show-confirm" })
  showConfirm = true;

  /**
   * 是否展示右上角清空按钮
   */
  @property({ type: Boolean, converter: looseBooleanConverter, attribute: "show-clear" })
  showClear = true;

  /**
   * 是否展示「已选 n/总数」计数
   */
  @property({ type: Boolean, converter: looseBooleanConverter, attribute: "show-counter" })
  showCounter = true;

  /**
   * 有选中项时触发器展示的文案模板，支持 {count}（已选数量）与 {label}（label 属性）占位符。
   * 未设置时取内置多语言 `components.filterSelect.selectedSummary`。
   */
  @property({ attribute: "selected-summary" })
  selectedSummary?: string;

  /**
   * 「已选 n/总数」中的「已选」文案。
   * 未设置时取内置多语言 `components.filterSelect.counter`。
   */
  @property({ attribute: "selected-text" })
  selectedText?: string;

  /**
   * 「清空」文案。未设置时取内置多语言 `components.filterSelect.clear`。
   */
  @property({ attribute: "clear-text" })
  clearText?: string;

  /**
   * 底部确认按钮文案。未设置时取内置多语言 `components.filterSelect.confirm`。
   */
  @property({ attribute: "confirm-text" })
  confirmText?: string;

  /**
   * 无选项时的占位文案。未设置时取内置多语言 `components.filterSelect.empty`。
   */
  @property({ attribute: "empty-text" })
  emptyText?: string;

  /**
   * 页面滚动时是否自动收起面板。
   * 面板内部（选项列表）滚动不会收起。
   */
  @property({ type: Boolean, converter: looseBooleanConverter, attribute: "close-on-scroll" })
  closeOnScroll = true;

  /**
   * 面板内草稿选中值
   */
  @state()
  private _draft: string[] = [];

  /**
   * 键盘高亮项索引
   */
  @state()
  private _activeIndex = -1;

  @query(".trigger")
  private _triggerEl?: HTMLButtonElement;

  @query(".panel")
  private _panelEl?: HTMLElement;

  private readonly _idBase = `jds-filter-select-${++uid}`;

  private _cleanupPosition?: () => void;

  private readonly _viewportPadding = 8;

  /** i18n 控制器：语言切换时自动触发重渲染 */
  private _i18n?: I18nController;

  /** 内置多语言 key 前缀 */
  private static readonly I18N_PREFIX = "components.filterSelect.";

  /**
   * 取文案：显式设置优先，否则回退到内置多语言
   */
  private _text(override: string | undefined, key: string): string {
    return override ?? t(JdsFilterSelect.I18N_PREFIX + key);
  }

  private get _resolvedLabel(): string {
    return this._text(this.label, "label");
  }

  private get _listboxId(): string {
    return `${this._idBase}-listbox`;
  }

  /**
   * 触发器文案：跟随草稿实时更新，未选中时回退到 label
   */
  private get _triggerText(): string {
    const count = this._draft.length;
    const summary = this._text(this.selectedSummary, "selectedSummary");
    if (count > 0 && summary) {
      return summary
        .replace(/\{count\}/g, String(count))
        .replace(/\{label\}/g, this._resolvedLabel);
    }
    return this._resolvedLabel;
  }

  private _optionId(index: number): string {
    return `${this._idBase}-option-${index}`;
  }

  connectedCallback(): void {
    super.connectedCallback?.();
    this._i18n = new I18nController(this);
    this._draft = [...(this.value ?? [])];

    // 展开中被重新挂载（如被框架移动 DOM）时恢复监听与定位
    if (this.open) {
      this._attachListeners();
      void this.updateComplete.then(() => this._syncPosition());
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    this._i18n?.hostDisconnected();
    this._i18n = undefined;
    this._cleanupPosition?.();
    this._cleanupPosition = undefined;
    this._detachListeners();
  }

  private _attachListeners(): void {
    document.addEventListener("click", this._handleClickOutside);
    document.addEventListener("keydown", this._handleKeydown);
    if (this.closeOnScroll) {
      document.addEventListener("scroll", this._handleScroll, {
        capture: true,
        passive: true,
      });
    }
  }

  private _detachListeners(): void {
    document.removeEventListener("click", this._handleClickOutside);
    document.removeEventListener("keydown", this._handleKeydown);
    document.removeEventListener("scroll", this._handleScroll, { capture: true });
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has("value") && !this.open) {
      this._draft = [...(this.value ?? [])];
    }
  }

  protected updated(changedProperties: PropertyValues<this>): void {
    if (
      changedProperties.has("open") ||
      changedProperties.has("placement") ||
      changedProperties.has("offset")
    ) {
      if (this.open) {
        void this.updateComplete.then(() => this._syncPosition());
      } else {
        this._cleanupPosition?.();
        this._cleanupPosition = undefined;
      }
    }

    const changed = changedProperties as unknown as Map<PropertyKey, unknown>;
    if (changed.has("_activeIndex") && this._activeIndex >= 0) {
      const activeEl = this.renderRoot?.querySelector<HTMLElement>(
        `[data-index="${this._activeIndex}"]`
      );
      activeEl?.scrollIntoView?.({ block: "nearest" });
    }
  }

  /** 展开面板 */
  show(): void {
    if (this.disabled || this.open) return;

    this.open = true;
    this._draft = [...(this.value ?? [])];
    this._activeIndex = -1;

    this._attachListeners();

    this.dispatchEvent(new CustomEvent("jds-filter-select-open", { bubbles: true, composed: true }));
  }

  /** 收起面板，未确认时丢弃草稿 */
  hide(confirmed = false): void {
    if (!this.open) return;

    this.open = false;
    this._activeIndex = -1;
    if (!confirmed) {
      this._draft = [...(this.value ?? [])];
    }

    this._detachListeners();

    this.dispatchEvent(
      new CustomEvent("jds-filter-select-close", {
        detail: { confirmed },
        bubbles: true,
        composed: true,
      })
    );
  }

  /** 切换展开 / 收起 */
  toggle(): void {
    if (this.open) {
      this.hide();
    } else {
      this.show();
    }
  }

  /** 提交草稿并收起面板 */
  confirm(): void {
    this._commitDraft();
    this.dispatchEvent(
      new CustomEvent("jds-filter-select-confirm", {
        detail: { value: [...this._draft] },
        bubbles: true,
        composed: true,
      })
    );
    this.hide(true);
  }

  /** 清空当前选中 */
  clear(): void {
    this._draft = [];
    if (!this.showConfirm) {
      this._commitDraft();
    }
    this.dispatchEvent(
      new CustomEvent("jds-filter-select-clear", {
        detail: { value: [] },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _commitDraft(): void {
    const next = [...this._draft];
    this.value = next;
    this.dispatchEvent(
      new CustomEvent("jds-filter-select-change", {
        detail: { value: next },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _toggleOption(index: number): void {
    const option = this.options[index];
    if (!option || option.disabled) return;

    const next = this._draft.includes(option.value)
      ? this._draft.filter((item) => item !== option.value)
      : [...this._draft, option.value];

    this._draft = next;

    if (!this.showConfirm) {
      this._commitDraft();
    }
  }

  private _firstEnabledIndex(): number {
    return this.options.findIndex((option) => !option.disabled);
  }

  private _lastEnabledIndex(): number {
    for (let index = this.options.length - 1; index >= 0; index--) {
      if (!this.options[index]?.disabled) return index;
    }
    return -1;
  }

  private _moveActive(delta: number): void {
    const count = this.options.length;
    if (!count) return;

    if (this._activeIndex < 0) {
      this._activeIndex = delta > 0 ? this._firstEnabledIndex() : this._lastEnabledIndex();
      return;
    }

    let index = this._activeIndex;
    for (let step = 0; step < count; step++) {
      index = (index + delta + count) % count;
      if (!this.options[index]?.disabled) break;
    }
    this._activeIndex = index;
  }

  private _handleTriggerClick = (): void => {
    if (this.disabled) return;
    this.toggle();
  };

  private _handleTriggerKeydown = (event: KeyboardEvent): void => {
    if (this.disabled) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!this.open) {
        this.show();
        void this.updateComplete.then(() => {
          this._activeIndex = event.key === "ArrowDown" ? this._firstEnabledIndex() : this._lastEnabledIndex();
          this._focusListbox();
        });
      }
    }
  };

  private _handleClickOutside = (event: Event): void => {
    if (!this.open) return;
    if (event.composedPath().includes(this)) return;
    this.hide();
  };

  /**
   * scroll 事件不冒泡，必须用捕获阶段才能收到任意滚动容器的滚动
   */
  private _handleScroll = (event: Event): void => {
    if (!this.open) return;

    // 面板内滚动（选项列表滚动）保持展开
    const panel = this._panelEl;
    if (panel) {
      if (panel.contains(event.target as Node)) return;
      if (event.composedPath().includes(panel)) return;
    }

    this.hide();
  };

  private _handleKeydown = (event: KeyboardEvent): void => {
    if (event.key !== "Escape") return;
    event.stopPropagation();
    this.hide();
  };

  /** 键盘打开面板：收起时把焦点还给触发器 */
  private _closeWithFocusRestore(): void {
    const hadFocusInside = !!(this.renderRoot as ShadowRoot | null)?.activeElement;
    this.hide();
    if (hadFocusInside) this._focusTrigger();
  }

  private _handleOptionsKeydown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this._moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        this._moveActive(-1);
        break;
      case "Home":
        event.preventDefault();
        this._activeIndex = this._firstEnabledIndex();
        break;
      case "End":
        event.preventDefault();
        this._activeIndex = this._lastEnabledIndex();
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (this._activeIndex >= 0) {
          this._toggleOption(this._activeIndex);
        }
        break;
      case "Escape":
        event.preventDefault();
        this._closeWithFocusRestore();
        break;
      default:
        break;
    }
  };

  private _handleOptionClick = (event: Event): void => {
    const target = event.currentTarget as HTMLElement;
    const index = Number(target.dataset.index);
    if (Number.isNaN(index)) return;
    this._activeIndex = index;
    this._toggleOption(index);
  };

  private _handleClearClick = (event: Event): void => {
    event.stopPropagation();
    this.clear();
  };

  private _handleConfirmClick = (event: Event): void => {
    event.stopPropagation();
    this.confirm();
  };

  private _focusTrigger(): void {
    this._triggerEl?.focus?.({ preventScroll: true });
  }

  private _focusListbox(): void {
    this.renderRoot
      ?.querySelector<HTMLElement>(".options")
      ?.focus?.({ preventScroll: true });
  }

  private _syncPosition(): void {
    if (!this._triggerEl || !this._panelEl) return;

    this._cleanupPosition?.();

    this._cleanupPosition = autoUpdate(this._triggerEl, this._panelEl, () => {
      if (!this._triggerEl || !this._panelEl) return;

      void computePosition(this._triggerEl, this._panelEl, {
        placement: this.placement,
        middleware: [
          offsetMiddleware(this.offset),
          flip({ padding: this._viewportPadding }),
          shift({ padding: this._viewportPadding }),
          size({
            apply({ rects, elements }) {
              Object.assign(elements.floating.style, {
                width: `${rects.reference.width}px`,
              });
            },
          }),
        ],
        strategy: "fixed",
      }).then(({ x, y, placement }) => {
        if (!this._panelEl) return;
        Object.assign(this._panelEl.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
        this._panelEl.setAttribute("data-placement", placement);
      });
    });
  }

  private _renderUncheckedIcon(): TemplateResult {
    return html`
      <svg
        class="option__icon"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <rect
          class="option__icon-box"
          x="0.5"
          y="0.5"
          width="15"
          height="15"
          stroke="currentColor"
          stroke-width="1"
        />
      </svg>
    `;
  }

  private _renderCheckedIcon(): TemplateResult {
    return html`
      <svg
        class="option__icon option__icon--checked"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <rect class="option__icon-fill" width="16" height="16" />
        <path
          class="option__icon-check"
          d="M3.16016 7.56004L6.68016 11.08L12.8402 4.92004"
          stroke="currentColor"
          stroke-width="1.76"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `;
  }

  private _renderTrigger(): TemplateResult {
    return html`
      <button
        type="button"
        class="trigger"
        part="trigger"
        ?disabled=${this.disabled}
        aria-haspopup="listbox"
        aria-expanded=${this.open ? "true" : "false"}
        aria-controls=${this._listboxId}
        @click=${this._handleTriggerClick}
        @keydown=${this._handleTriggerKeydown}
      >
        <span class="trigger__label" part="label">
          <span class="trigger__text">${this._triggerText}</span>
        </span>
        <span class="trigger__arrow" part="arrow">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M14.7734 12.5L9.77344 7.5L4.77344 12.5"
              stroke="currentColor"
              stroke-width="1.25"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </button>
    `;
  }

  private _renderPanel(): TemplateResult {
    const showHeader = this.showCounter || this.showClear;
    const total = this.options.length;
    const draftCount = this._draft.length;
    const activeId =
      this._activeIndex >= 0 ? this._optionId(this._activeIndex) : undefined;

    const list = this.options.length
      ? html`
          <div
            id=${this._listboxId}
            class="options"
            part="options"
            role="listbox"
            tabindex="0"
            aria-label=${this._text(this.selectedText, "counter")}
            aria-multiselectable="true"
            aria-activedescendant=${ifDefined(activeId)}
            @keydown=${this._handleOptionsKeydown}
          >
            ${this.options.map((option, index) => {
              const selected = this._draft.includes(option.value);
              const isDisabled = !!option.disabled;
              const classes = classMap({
                option: true,
                "option--selected": selected,
                "option--active": this._activeIndex === index,
                "option--disabled": isDisabled,
              });

              return html`
                <div
                  id=${this._optionId(index)}
                  class=${classes}
                  part="option"
                  role="option"
                  aria-selected=${selected ? "true" : "false"}
                  aria-disabled=${isDisabled ? "true" : "false"}
                  data-index=${index}
                  @click=${this._handleOptionClick}
                >
                  <span class="option__checkbox" part="checkbox" aria-hidden="true">
                    ${selected ? this._renderCheckedIcon() : this._renderUncheckedIcon()}
                  </span>
                  <span class="option__label" part="option-label">${option.label}</span>
                </div>
              `;
            })}
          </div>
        `
      : html`<div class="empty" part="empty">${this._text(this.emptyText, "empty")}</div>`;

    return html`
      <div class="panel" part="panel">
        ${showHeader
          ? html`
              <div class="panel__header" part="header">
                ${this.showCounter
                  ? html`
                      <span class="counter" part="counter"
                        ><span class="counter__label">${this._text(this.selectedText, "counter")}</span> <span
                          class="counter__current"
                          >${draftCount}</span
                        ><span class="counter__sep">/</span
                        ><span class="counter__total">${total}</span></span
                      >
                    `
                  : html`<span class="panel__spacer"></span>`}
                ${this.showClear
                  ? html`
                      <button
                        type="button"
                        class="clear"
                        part="clear"
                        @click=${this._handleClearClick}
                      >
                        ${this._text(this.clearText, "clear")}
                      </button>
                    `
                  : nothing}
              </div>
              <div class="panel__divider" part="divider"></div>
            `
          : nothing}
        ${list}
        ${this.showConfirm
          ? html`
              <button
                type="button"
                class="confirm"
                part="confirm"
                @click=${this._handleConfirmClick}
              >
                ${this._text(this.confirmText, "confirm")}
              </button>
            `
          : nothing}
      </div>
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="filter-select" part="base">
        ${this._renderTrigger()} ${this.open ? this._renderPanel() : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jds-filter-select": JdsFilterSelect;
  }
}
