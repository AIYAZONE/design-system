/**
 * 图标列表组件模块 - 提供图标展示、搜索和动态加载功能
 */

import React, { lazy, Suspense } from "react";
import debounce from "../../utils/debounce";
import flexsearch from "flexsearch";
import { IconCategory } from "@/types";

import "../IconList.css";

/**
 * BlInput组件的属性类型定义
 * @property {string} value - 输入框的值
 * @property {function} onInput - 输入事件处理函数
 * @property {React.CSSProperties} style - 自定义样式
 * @property {string} placeholder - 占位符文本
 * @property {string} type - 输入框类型
 */
type BlInputProps = {
  value: string;
  onInput?: (value: string) => void;
  style?: React.CSSProperties;
  placeholder?: string;
  type?: string;
};

/**
 * 自定义输入组件，封装了bl-input Web Component
 * 处理自定义输入事件并转发到标准的React事件处理
 */
function BlInput({ value, onInput, ...props }: BlInputProps) {
  const ref = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    const handleInput = (e: CustomEvent<string>) => {
      onInput?.(e.detail);
    };

    const { current } = ref;
    if (!current) return;

    current.addEventListener("bl-input", handleInput as EventListener);

    return () => current.removeEventListener("bl-input", handleInput as EventListener);
  }, [onInput]);

  return (
    // @ts-ignore 忽略自定义元素类型检查
    <bl-input
      ref={ref}
      placeholder="Search icons..."
      type="search"
      value={value}
      {...props}
    />
  );
}

/**
 * IconSvg组件的属性类型定义
 * @property {string} name - 图标名称
 * @property {IconCategory} iconType - 图标类别
 */
type IconSvgProps = {
  name: string;
  iconType: IconCategory;
};

/**
 * 用于缓存已加载的SVG组件的Map
 * 避免重复动态导入相同的SVG文件
 */
const SvgMap = new Map<string, React.LazyExoticComponent<React.ComponentType>>();

/**
 * 动态加载并渲染SVG图标组件
 * 使用React.lazy实现按需加载，并通过Map缓存已加载的组件
 */
export function IconSvg({ name, iconType }: IconSvgProps) {
  const Svg = SvgMap.has(name)
    ? SvgMap.get(name)
    : lazy(() => import(`@/icons/${iconType}/${name}.svg`));

  if (!SvgMap.has(name)) {
    if (Svg) {
      SvgMap.set(name, Svg);
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {Svg && React.createElement(Svg)}
    </Suspense>
  );
}

/**
 * 图标列表组件的属性类型定义
 * @property {string[]} icons - 图标名称数组
 * @property {Record<string, string>} synonyms - 图标同义词映射
 * @property {IconCategory} iconType - 图标类别
 */
type IconListProps = {
  icons: readonly string[];
  synonyms: Record<string, string>;
  iconType: IconCategory;
};

/**
 * 创建图标列表组件的工厂函数
 * 实现图标搜索、过滤和展示功能
 *
 * @example
 * const IconList = createIconList({
 *   icons: ["icon1", "icon2"],
 *   synonyms: { icon1: "first icon" },
 *   iconType: "system"
 * });
 */
export function createIconList({ icons, synonyms, iconType }: IconListProps) {
  // 创建搜索索引实例，使用全词匹配模式
  const searchIndex = new flexsearch.Index({
    tokenize: "full",
  });

  // 将图标名称及其同义词添加到搜索索引
  for (const icon of icons) {
    let searchable = icon;
    if (synonyms[icon]) {
      searchable += ` ${synonyms[icon]}`;
    }
    searchIndex.addAsync(icon, searchable);
  }

  return function IconList() {
    const [keys, setKeys] = React.useState<string[] | null>(null);
    const [query, setQuery] = React.useState<string>("");

    // 使用防抖处理搜索，避免频繁更新
    const updateSearchResults = React.useMemo(
      () =>
        debounce((value: string) => {
          if (value === "") {
            setKeys(null);
          } else {
            searchIndex.searchAsync(value, { limit: 3000 }).then((results) => {
              setKeys(results.map(id => id.toString()));
            });
          }
        }, 300),
      [],
    );

    // 根据搜索结果确定要显示的图标列表
    const listedIcons = React.useMemo(
      () => (keys === null ? icons : keys),
      [keys],
    );

    React.useEffect(() => {
      updateSearchResults(query);
      return () => {
        updateSearchResults.clear();
      };
    }, [query, updateSearchResults]);

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <BlInput
          value={query}
          onInput={setQuery}
          style={{
            width: "100%",
            maxWidth: "400px",
            margin: "var(--bl-size-s) auto var(--bl-size-2xl) auto",
          }}
        />

        <div className="icon-gallery">
          {listedIcons.map((iconName) => (
            <div key={iconName} className="icon-gallery__item">
              <div className="icon-gallery__icon">
                <IconSvg name={iconName} iconType={iconType} />
              </div>
              <div className="icon-gallery__name">{iconName}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };
}
