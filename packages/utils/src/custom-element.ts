/**
 * 同一页面混用总包与基础包时，复用已注册的构造器。
 * 应用仍需使用一致的设计系统版本。
 */
export function customElement(tagName: string): ClassDecorator {
  return constructor => {
    const registered = customElements.get(tagName);
    if (registered) return registered as unknown as typeof constructor;
    customElements.define(tagName, constructor as unknown as CustomElementConstructor);
    return constructor;
  };
}
