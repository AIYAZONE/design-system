/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-04 11:30:00
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-05 08:54:30
 * @FilePath: \Jackery-F2E-Team\jackery-design-system\src\decorators\i18n.ts
 * @Description: i18n装饰器实现
 */

import { I18N_LANGUAGE_CHANGE } from '../core/config'
/**
 * i18n装饰器，用于自动处理属性的国际化
 * @returns void
 */
export function i18n(): (protoOrDescriptor: any, name: PropertyKey) => void {
  return (protoOrDescriptor: any, name: PropertyKey): any => {
    // 在组件销毁时移除事件监听器
    const cleanup = function (this: any) {
      if (this[`__${String(name)}UpdateHandler`]) {
        window.removeEventListener(I18N_LANGUAGE_CHANGE, this[`__${String(name)}UpdateHandler`]);
        this[`__${String(name)}UpdateHandler`] = null;
      }
    };

    // 确保在组件断开连接时清理事件监听器
    if (protoOrDescriptor.disconnectedCallback) {
      const originalDisconnected = protoOrDescriptor.disconnectedCallback;
      protoOrDescriptor.disconnectedCallback = function () {
        cleanup.call(this);
        originalDisconnected.call(this);
      };
    } else {
      protoOrDescriptor.disconnectedCallback = function () {
        cleanup.call(this);
      };
    }

    const descriptor: PropertyDescriptor = {
      get(this: any) {
        const value = this[`__${String(name)}`];
        if (typeof value === 'string' && value.startsWith('i18n:')) {
          const key = value.slice(5);
          return window.i18n?.t(key) || key;
        }
        return value;
      },
      set(this: any, value: unknown) {
        const oldValue = this[`__${String(name)}`];
        this[`__${String(name)}`] = value;

        // 只有当新旧值不同时才触发更新
        if (oldValue !== value) {
          // 移除旧的监听器（如果存在）
          cleanup.call(this);

          // 创建新的监听器
          if (typeof value === 'string' && value.startsWith('i18n:')) {
            this[`__${String(name)}UpdateHandler`] = () => {
              this.requestUpdate(name, oldValue);
            };
            window.addEventListener(I18N_LANGUAGE_CHANGE, this[`__${String(name)}UpdateHandler`]);
          }

          this.requestUpdate(name, oldValue);
        }
      },
      configurable: true,
      enumerable: true
    };

    return descriptor;
  };
}