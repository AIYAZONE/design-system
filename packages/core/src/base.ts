// AIYAZONE Design System - Base Classes

import { LitElement, css } from 'lit';

/**
 * ZONE 基础组件类
 * 所有 ZONE 组件都应该继承这个类
 */
export class ZoneBaseElement extends LitElement {
  /**
   * 创建组件实例
   */
  constructor() {
    super();
  }

  /**
   * 定义组件的样式
   */
  static get styles() {
    return css`
      :host {
        display: inline-block;
      }
    `;
  }

  /**
   * 创建渲染根元素
   */
  createRenderRoot() {
    const root = super.createRenderRoot();
    // 将基础类名添加到宿主元素，避免对 ShadowRoot 进行 classList 操作
    this.classList.add('zone-component');
    return root;
  }

  /**
   * 派发自定义事件
   */
  emit(eventName: string, detail?: any, options?: CustomEventInit) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true,
      ...options
    });
    return this.dispatchEvent(event);
  }

  /**
   * 获取组件的 variant 类名
   */
  getVariantClass(variant: string, prefix = 'zone'): string {
    return `${prefix}-${variant}`;
  }

  /**
   * 获取组件的大小类名
   */
  getSizeClass(size: string, prefix = 'zone'): string {
    return `${prefix}-${size}`;
  }
}