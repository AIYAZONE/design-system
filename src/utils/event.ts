export interface EventOptions {
  bubbles?: boolean; // 是否允许事件冒泡
  cancelable?: boolean; // 是否可以取消事件的默认行为
  composed?: boolean; // 是否允许事件穿透到 shadow DOM
}

export interface EventDispatcher<T> {
  (value: T, options?: EventOptions): CustomEvent<T>; // 事件派发器接口，接受值和选项并返回自定义事件
}

// 创建事件派发器函数
function dispatcher<T>(
  target: HTMLElement, // 事件目标元素
  eventName: string // 事件名称
): EventDispatcher<T> {
  return function (value: T, options?: EventOptions) {
    // 创建自定义事件
    const customEvent = new CustomEvent<T>(eventName, {
      detail: value, // 事件的详细信息
      bubbles: true, // 默认允许冒泡
      cancelable: false, // 默认不可取消
      composed: true, // 默认允许穿透到 shadow DOM
      ...options, // 允许覆盖默认选项
    });

    target.dispatchEvent(customEvent); // 派发事件

    return customEvent; // 返回创建的自定义事件
  };
}

// 装饰器函数，用于创建自定义事件
export function event(customName?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (protoOrDescriptor: any, name: string): any => {
    const descriptor = {
      get(this: HTMLElement) {
        // 返回事件派发器
        return dispatcher(this, customName || name); // 使用自定义名称或属性名称作为事件名称
      },
      enumerable: true, // 使属性可枚举
      configurable: true, // 使属性可配置
    };

    Object.defineProperty(protoOrDescriptor, name, descriptor); // 定义属性描述符
  };
}
