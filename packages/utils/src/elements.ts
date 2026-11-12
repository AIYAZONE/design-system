/**
 *  获取元素的中心坐标
 */
export function getMiddleOfElement(element: Element) {
  const { x, y, width, height } = element.getBoundingClientRect();

  return {
    // 计算元素中心的 x 坐标
    x: Math.floor(x + window.pageXOffset + width / 2),
    // 计算元素中心的 y 坐标
    y: Math.floor(y + window.pageYOffset + height / 2),
  };
}

// 获取目标元素
export function getTarget(value: string | Element): Element | null {
  // 如果传入的是字符串，尝试获取对应的 DOM 元素
  if (typeof value === "string") {
    return document.getElementById(value) as Element;
  }
  // 如果传入的是 Element，直接返回该元素
  else if (value instanceof Element) {
    return value;
  }

  // 否则返回 null
  return null;
}
