// 图标类型定义
export type IconCategory = 'system' | 'social-media';

// 从各个图标类型文件中导入图标列表
import { SystemIcon, SYSTEM_ICON_LIST } from './system';
import { SocialMediaIcon, SOCIAL_MEDIA_ICON_LIST } from './social-media';

// 图标类型和路径映射
export interface IconTypeMap {
  "system": SystemIcon;
  'social-media': SocialMediaIcon;
}

// 图标名称到类别的映射
const iconCategoryMap = new Map<string, IconCategory>();

// 初始化映射表
SYSTEM_ICON_LIST.forEach(name => iconCategoryMap.set(name, 'system'));
SOCIAL_MEDIA_ICON_LIST.forEach(name => iconCategoryMap.set(name, 'social-media'));

// 根据图标名称获取类别
export function getIconCategory(name: string): IconCategory {
  const category = iconCategoryMap.get(name);
  if (!category) {
    throw new Error(`未找到图标 "${name}" 对应的类别`);
  }
  return category;
}

// 获取图标路径
export function getIconPath(category: IconCategory, name: string): string {
  return `../icons/${category}/${name}.svg`;
}