/*
 * @Author: HB-BruceWang
 * @Date: 2025-03-11 11:24:02
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-03-11 11:27:42
 * @FilePath: \AIYAZONE-F2E-Team\zone-design-system\src\utils\common.ts
 * @Description: 公共方法 - 后续提取到 @zone/utils 中
 *
 * Copyright (c) 2025 by Hello Tech, All Rights Reserved.
 */

/**
 * 获取Cookie值
 * @param name Cookie名称
 * @returns 返回Cookie值或null
 */
export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * 设置Cookie
 * @param name Cookie名称
 * @param value Cookie值
 * @param days Cookie过期时间（天）
 */
export function setCookie(name: string, value: string, days = 7): void {
  const domain = window.location.hostname;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;domain=${domain}`;
}