// Shim legacy decorators for Lit to avoid TS Server interpreting them as new standard decorators
// within the @aiyazone/core package.

declare namespace LitDecoratorsLegacyShim {
  type LegacyPropertyDecorator = (protoOrDescriptor: object, name: PropertyKey) => void;
}

declare module 'lit/decorators.js' {
  export function property(options?: any): LitDecoratorsLegacyShim.LegacyPropertyDecorator;
  export function state(options?: any): LitDecoratorsLegacyShim.LegacyPropertyDecorator;
  export function query(selector: string, cache?: boolean): LitDecoratorsLegacyShim.LegacyPropertyDecorator;
  export function customElement(tagName: string): ClassDecorator;
}

export {};