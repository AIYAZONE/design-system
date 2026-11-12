// AIYAZONE Design System - Core Types

export interface ZoneComponent {
  connectedCallback?(): void;
  disconnectedCallback?(): void;
  attributeChangedCallback?(name: string, oldValue: string, newValue: string): void;
}

export type ZoneVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

export type ZoneSize = 'small' | 'medium' | 'large';

export type ZonePlacement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';

export interface ZoneIconConfig {
  name: string;
  size?: number;
  color?: string;
}

export interface ZoneToastConfig {
  variant?: ZoneVariant;
  description: string;
  caption?: string;
  icon?: string | boolean;
  closable?: boolean;
  countdownTime?: number;
}

export interface ZoneDialogConfig {
  title?: string;
  width?: string | number;
  height?: string | number;
  closable?: boolean;
  maskClosable?: boolean;
  showClose?: boolean;
}

export interface ZonePopoverConfig {
  placement?: ZonePlacement;
  trigger?: 'hover' | 'click' | 'focus';
  showArrow?: boolean;
  offset?: number;
}