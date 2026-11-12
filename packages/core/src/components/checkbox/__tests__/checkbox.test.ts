import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "../index";

function createCheckbox(): HTMLElementTagNameMap["zone-checkbox"] {
  const el = document.createElement("zone-checkbox") as any;
  document.body.appendChild(el);
  return el as any;
}

async function getRoot(el: HTMLElementTagNameMap["zone-checkbox"]) {
  // @ts-expect-error lit
  if (el.updateComplete) await (el as any).updateComplete;
  return el.shadowRoot!;
}

describe("zone-checkbox", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("toggles checked and fires change on input change", async () => {
    const el = createCheckbox();
    const root = await getRoot(el);
    const input = root.querySelector("input") as HTMLInputElement;
    const handler = vi.fn();
    el.addEventListener("change", handler);
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(el.checked).toBe(true);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0]).toBeTruthy();
  });

  it("does not change when disabled", async () => {
    const el = createCheckbox();
    el.setAttribute("disabled", "");
    const root = await getRoot(el);
    const input = root.querySelector("input") as HTMLInputElement;
    const handler = vi.fn();
    el.addEventListener("change", handler);
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(el.checked).toBe(false);
    expect(handler).toHaveBeenCalledTimes(0);
  });

  it("renders slot text when provided", async () => {
    const el = createCheckbox();
    el.textContent = "Accept Terms";
    const root = await getRoot(el);
    const slot = root.querySelector(".label slot") as HTMLSlotElement;
    const assigned = slot?.assignedNodes()?.[0] as Text | HTMLElement | undefined;
    const text = (assigned as any)?.textContent?.trim() ?? "";
    expect(text).toBe("Accept Terms");
  });
});
