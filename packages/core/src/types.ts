// Jackery Design System - Core Types

export interface JdsComponent {
  connectedCallback?(): void;
  disconnectedCallback?(): void;
  attributeChangedCallback?(name: string, oldValue: string, newValue: string): void;
}

export type JdsVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

export type JdsSize = 'small' | 'medium' | 'large';

export type JdsPlacement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';

export interface JdsIconConfig {
  name: string;
  size?: number;
  color?: string;
}

export interface JdsToastConfig {
  variant?: JdsVariant;
  description: string;
  caption?: string;
  icon?: string | boolean;
  closable?: boolean;
  countdownTime?: number;
}

export interface JdsDialogConfig {
  title?: string;
  width?: string | number;
  height?: string | number;
  closable?: boolean;
  maskClosable?: boolean;
  showClose?: boolean;
}

export interface JdsPopoverConfig {
  placement?: JdsPlacement;
  trigger?: 'hover' | 'click' | 'focus';
  showArrow?: boolean;
  offset?: number;
}