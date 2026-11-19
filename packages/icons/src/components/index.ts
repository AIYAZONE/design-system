import { css, html, LitElement, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { customElement } from "@aiyazone/utils";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { event, EventDispatcher } from "../utils/event";
import { getIconPath, getIconCategory } from "../types";
const requestMap = new Map<string, Promise<string>>();

/**
 * @tag zone-icon
 * @summary AIYAZONE 图标组件
 *
 * @attr [name] 要显示的图标名称
 * @attr [hover-name] 鼠标悬停时要显示的图标名称
 * @cssproperty [font-size] 设置图标大小，默认为 DOM 中的当前字体大小
 * @cssproperty [color=currentColor] 设置图标颜色
 */
@customElement("zone-icon")
export default class ZoneIcon extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      width: max-content;
      cursor: inherit;
    }

    :host div {
      display: flex;
      align-items: stretch;
      width: 1em;
      height: 1em;
      min-width: 1em;
      min-height: 1em;
      overflow: hidden;
      transform: translateZ(0);
    }

    :host svg {
      width: 1em;
      height: 1em;
      transition: opacity 0.2s ease-in-out;
    }

    .icon-container {
      position: relative;
    }

    .hover-icon {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    }

    :host(:hover) .default-icon {
      opacity: 0;
    }

    :host(:hover) .hover-icon {
      opacity: 1;
    }
  `;

  private _loadVersion = 0;
  private _hoverVersion = 0;

  private _iconName!: string;
  private _hoverIconName?: string;

  /**
   * 要显示的图标名称
   */
  @property({ type: String, reflect: true })
  get name(): string {
    return this._iconName;
  }

  set name(value: string) {
    if (value !== this._iconName) {
      this._iconName = value;
      this.load();
    }
  }

  /**
   * 鼠标悬停时要显示的图标名称
   */
  @property({ type: String, reflect: true, attribute: "hover-name" })
  get hoverName(): string | undefined {
    return this._hoverIconName;
  }

  set hoverName(value: string | undefined) {
    if (value !== this._hoverIconName) {
      this._hoverIconName = value;
      this.loadHoverIcon();
    }
  }

  /**
   * 当 SVG 图标加载完成时触发
   */
  @event("zone-load")
  private onLoad!: EventDispatcher<string>;

  /**
   * 当 SVG 图标加载失败时触发
   */
  @event("zone-error")
  private onError!: EventDispatcher<string>;

  @state()
  private svg: string = "";

  @state()
  private hoverSvg: string = "";

  private async _readIcon(name: string): Promise<string> {
    const modules = import.meta.glob<string>("../icons/**/*.svg", {
      query: "?raw",
      import: "default",
    });
    const modulePath = getIconPath(getIconCategory(name), name);
    if (!modules[modulePath]) throw new Error(`图标 "${name}" 不存在`);
    if (!requestMap.has(modulePath))
      requestMap.set(modulePath, modules[modulePath]());
    try {
      const content = await requestMap.get(modulePath);
      if (!content) throw new Error("SVG content is empty");
      return content;
    } catch (error) {
      requestMap.delete(modulePath);
      throw error;
    }
  }

  async load() {
    const version = ++this._loadVersion;
    const name = this.name;
    if (!name) {
      this.svg = "";
      return;
    }
    try {
      const content = await this._readIcon(name);
      if (version !== this._loadVersion) return;
      this.svg = content;
      this.onLoad(`${name} 图标加载完成`);
    } catch (error) {
      if (version !== this._loadVersion) return;
      this.svg = "";
      this.onError(`${name} 图标加载失败 [${error}]`);
    }
  }

  async loadHoverIcon() {
    const version = ++this._hoverVersion;
    const name = this.hoverName;
    if (!name) {
      this.hoverSvg = "";
      return;
    }
    try {
      const content = await this._readIcon(name);
      if (version !== this._hoverVersion) return;
      this.hoverSvg = content;
    } catch (error) {
      if (version !== this._hoverVersion) return;
      this.hoverSvg = "";
      this.onError(`${name} 悬停图标加载失败 [${error}]`);
    }
  }

  render(): TemplateResult {
    if (this.hoverName && this.hoverSvg) {
      return html`
        <div class="icon-container" aria-hidden="true">
          <div class="default-icon">${unsafeSVG(this.svg)}</div>
          <div class="hover-icon">${unsafeSVG(this.hoverSvg)}</div>
        </div>
      `;
    }
    return html`<div aria-hidden="true">${unsafeSVG(this.svg)}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "zone-icon": ZoneIcon;
  }
}
