import * as litDecorators from 'lit/decorators.js';

// Provide legacy-style typings while preserving runtime behavior from Lit.
type LegacyPropertyDecorator = (protoOrDescriptor: object, name: PropertyKey) => void;

export const property: (options?: any) => LegacyPropertyDecorator = (litDecorators.property as unknown as (options?: any) => LegacyPropertyDecorator);
export const state: (options?: any) => LegacyPropertyDecorator = (litDecorators.state as unknown as (options?: any) => LegacyPropertyDecorator);
export const query: (selector: string, cache?: boolean) => LegacyPropertyDecorator = (litDecorators.query as unknown as (selector: string, cache?: boolean) => LegacyPropertyDecorator);
export const customElement: (tagName: string) => ClassDecorator = (litDecorators.customElement as unknown as (tagName: string) => ClassDecorator);

export default {
  property,
  state,
  query,
  customElement,
};