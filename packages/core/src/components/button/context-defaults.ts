// Keep authored attributes/properties distinct from Lit's reflected defaults.
// Composition must work even when a button upgrades before its parent Toast.
const configured = new WeakMap<object, Set<PropertyKey>>();
const applying = new WeakSet<object>();
const keys = new Set<PropertyKey>(["variant", "kind", "size"]);

export function recordButtonConfiguration(button: object, key?: PropertyKey) {
  if (key === undefined || !keys.has(key) || applying.has(button)) return;
  let values = configured.get(button);
  if (!values) configured.set(button, (values = new Set()));
  values.add(key);
}

export function applyButtonDefaults(
  button: HTMLElement,
  defaults: Record<"variant" | "kind" | "size", string>,
) {
  applying.add(button);
  try {
    for (const [key, value] of Object.entries(defaults)) {
      if (!configured.get(button)?.has(key)) {
        (button as unknown as Record<string, unknown>)[key] = value;
      }
    }
  } finally {
    applying.delete(button);
  }
}
