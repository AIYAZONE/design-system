// Shim legacy decorators to avoid TS Server misinterpreting Lit's decorators as new standard decorators.
// This file provides minimal ambient declarations that align with classic decorator usage.

declare namespace LitDecoratorsLegacyShim {
  // Match legacy property decorator shape
  type LegacyPropertyDecorator = (protoOrDescriptor: object, name: PropertyKey) => void;
}

declare module 'lit/decorators.js' {
  export function property(options?: any): LitDecoratorsLegacyShim.LegacyPropertyDecorator;
  export function state(options?: any): LitDecoratorsLegacyShim.LegacyPropertyDecorator;
  export function query(selector: string, cache?: boolean): LitDecoratorsLegacyShim.LegacyPropertyDecorator;
  export function customElement(tagName: string): ClassDecorator;
}

// Ensure TS doesn't try to use new decorator signatures for these imports within the IDE
export {};