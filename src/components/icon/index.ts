import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { getIconPath } from "../../utils/asset-paths";
import { event, EventDispatcher } from "../../utils/event";
import { JackeryIcon } from "./icon-list";

const requestMap = new Map<string, Promise<Response>>();

/**
 * @tag jds-icon
 * @summary Jackery 图标组件
 *
 * @attr [name] 要显示的图标名称
 * @cssproperty [font-size] 设置图标大小，默认为 DOM 中的当前字体大小
 * @cssproperty [color=currentColor] 设置图标颜色
 */
@customElement("jds-icon")
export default class JdsIcon extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
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
    }
  `;

  private _iconName!: JackeryIcon;

  /**
   * 要显示的图标名称
   */
  @property({ type: String, reflect: true })
  get name(): JackeryIcon {
    return this._iconName;
  }

  set name(value: JackeryIcon) {
    if (value !== this._iconName) {
      this._iconName = value;
      this.load();
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
  private svg!: string;

  async load() {
    const iconPath = getIconPath();
    const fileUrl = `${iconPath}/${this.name}.svg`;

    if (!requestMap.has(fileUrl)) {
      requestMap.set(fileUrl, fetch(fileUrl));
    }

    try {
      const iconRequest = await requestMap.get(fileUrl);
      const res = iconRequest?.clone();

      if (res?.ok) {
        this.svg = await res.text();
        this.onLoad(`${this.name} 图标加载完成`);
      } else {
        this.onError(`${this.name} 图标加载失败`);
      }
    } catch (error) {
      this.onError(`${this.name} 图标加载失败 [${error}]`);
    }
  }

  render(): TemplateResult {
    return html`<div aria-hidden="true">${unsafeSVG(this.svg)}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jds-icon": JdsIcon;
  }
}
