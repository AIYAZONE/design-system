export const SOCIAL_MEDIA_ICON_LIST = [
  "facebook",
  "facebook-fill",
  "facebook-color",
  "facebook-color-fill",
  "twitter",
  "twitter-fill",
  "twitter-color",
  "twitter-color-fill",
  "instagram",
  "instagram-fill",
  "instagram-color",
  "instagram-color-fill",
  "pinterest",
  "pinterest-fill",
  "pinterest-color",
  "pinterest-color-fill",
  "youtube",
  "youtube-fill",
  "youtube-color",
  "youtube-color-fill",
  "reddit",
  "reddit-fill",
  "reddit-color",
  "reddit-color-fill",
  "line",
  "line-fill",
  "line-color",
  "line-color-fill",
  "whatsapp",
  "whatsapp-fill",
  "whatsapp-color",
  "whatsapp-color-fill",
  "tiktok",
  "tiktok-fill",
  "tiktok-color",
  "tiktok-color-fill",
  "email",
  "email-fill",
  "email-color",
  "email-color-fill",
  "link",
  "link-big",
  "link-fill",
  "link-color",
  "link-color-fill",
  "telegram",
  "telegram-fill",
  "telegram-color",
  "telegram-color-fill",
  "refer-a-friend",
  "refer-a-friend-fill",
  "refer-a-friend-color",
  "refer-a-friend-color-fill",
] as const;

export type SocialMediaIcon = typeof SOCIAL_MEDIA_ICON_LIST[number];

// 图标样式类型定义
export type IconVariant = 'line' | 'fill' | 'color' | 'color-fill';

// 社交媒体平台基础名称
export type SocialPlatform = 
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'youtube'
  | 'pinterest'
  | 'reddit'
  | 'line'
  | 'whatsapp'
  | 'tiktok'
  | 'email'
  | 'link'
  | 'telegram'
  | 'refer-a-friend';
