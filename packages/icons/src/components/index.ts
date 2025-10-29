import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { event, EventDispatcher } from "../utils/event";
import { getIconPath, getIconCategory } from "../types";
const requestMap = new Map<string, Promise<string>>();

/**
 * @tag jds-icon
 * @summary Jackery 图标组件
 *
 * @attr [name] 要显示的图标名称
 * @attr [hover-name] 鼠标悬停时要显示的图标名称
 * @cssproperty [font-size] 设置图标大小，默认为 DOM 中的当前字体大小
 * @cssproperty [color=currentColor] 设置图标颜色
 */
@customElement("jds-icon")
export default class JdsIcon extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      width: max-content;
      cursor: pointer;
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
  @property({ type: String, reflect: true, attribute: 'hover-name' })
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
  @event("jds-load")
  private onLoad!: EventDispatcher<string>;

  /**
   * 当 SVG 图标加载失败时触发
   */
  @event("jds-error")
  private onError!: EventDispatcher<string>;

  @state()
  private svg: string = '';

  @state()
  private hoverSvg: string = '';

  async load() {
    const svgModules = import.meta.glob<string>('../icons/**/*.svg', { query: '?raw', import: 'default' });
    const category = getIconCategory(this.name);
    const modulePath = getIconPath(category, this.name);

    // 检查模块路径是否存在于 svgModules 中
    if (!svgModules[modulePath]) {
      throw new Error(`图标 "${this.name}" 不存在`);
    }

    // 如果请求未缓存，则创建新的请求并缓存
    if (!requestMap.has(modulePath)) {
      requestMap.set(modulePath, svgModules[modulePath]());
    }
    try {
      const svgContent = await requestMap.get(modulePath);
      if (!svgContent) {
        throw new Error('SVG content is empty');
      }
      this.svg = svgContent;
      this.onLoad(`${this.name} 图标加载完成`);
    } catch (error) {
      this.onError(`${this.name} 图标加载失败 [${error}]`);
      requestMap.delete(modulePath);
    }
  }

  async loadHoverIcon() {
    if (!this.hoverName) {
      this.hoverSvg = '';
      return;
    }

    const svgModules = import.meta.glob<string>('../icons/**/*.svg', { query: '?raw', import: 'default' });
    const category = getIconCategory(this.hoverName);
    const modulePath = getIconPath(category, this.hoverName);

    // 检查模块路径是否存在于 svgModules 中
    if (!svgModules[modulePath]) {
      console.warn(`悬停图标 "${this.hoverName}" 不存在`);
      return;
    }

    // 如果请求未缓存，则创建新的请求并缓存
    if (!requestMap.has(modulePath)) {
      requestMap.set(modulePath, svgModules[modulePath]());
    }
    try {
      const svgContent = await requestMap.get(modulePath);
      if (!svgContent) {
        throw new Error('SVG content is empty');
      }
      this.hoverSvg = svgContent;
    } catch (error) {
      console.warn(`悬停图标 "${this.hoverName}" 加载失败 [${error}]`);
      requestMap.delete(modulePath);
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
    "jds-icon": JdsIcon;
  }
}
