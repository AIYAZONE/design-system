import type { ComplexAttributeConverter } from "lit";

/**
 * 字符串与布尔值之间的转换器
 *
 * 这个转换器将字符串属性的值转换为布尔值或字符串。
 * 可用于处理 HTML 属性中布尔值的表示，例如在自定义元素中。
 */
export const stringBooleanConverter = (): ComplexAttributeConverter<
  string | boolean
> => {
  return {
    /**
     * 从属性值转换为对应的 JavaScript 类型
     *
     * @param value - HTML 属性的字符串值
     * @returns 返回布尔值或原始字符串
     */
    fromAttribute: (value: string): string | boolean => {
      // 如果属性值为空或为 "true"，则返回 true
      if (!value || value === "true") return true;
      // 如果属性值为 "false"，则返回 false
      if (value === "false") return false;
      // 否则返回原始字符串值
      return value;
    },
  };
};
