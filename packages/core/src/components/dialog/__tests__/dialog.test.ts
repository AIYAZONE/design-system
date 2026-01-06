import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "../index";

function createDialog(): HTMLElementTagNameMap["jds-dialog"] {
  const el = document.createElement("jds-dialog") as any;
  document.body.appendChild(el);
  return el as any;
}

async function getRoot(el: HTMLElementTagNameMap["jds-dialog"]) {
  // @ts-expect-error lit
  if ((el as any).updateComplete) await (el as any).updateComplete;
  return el.shadowRoot!;
}

describe("jds-dialog", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders when open=true and closes via ESC", async () => {
    const el = createDialog();
    el.setAttribute("open", "");
    const root = await getRoot(el);
    const polyfill = root.querySelector(".dialog-polyfill") as HTMLElement;
    expect(polyfill).toBeTruthy();
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Escape" }));
    const root2 = await getRoot(el);
    expect(root2.querySelector(".dialog-polyfill")).toBeTruthy();
  });

  it("closes when clicking overlay if allowed", async () => {
    const el = createDialog();
    el.setAttribute("open", "");
    const root = await getRoot(el);
    const overlay = root.querySelector(".dialog-polyfill") as HTMLElement;
    overlay.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(el.open).toBe(false);
  });

  it("emits jds-open and jds-close events", async () => {
    const el = createDialog();
    const opened = vi.fn();
    const closed = vi.fn();
    el.addEventListener("jds-open", opened);
    el.addEventListener("jds-close", closed);
    el.open = true;
    await getRoot(el);
    el.open = false;
    await getRoot(el);
    expect(opened).toHaveBeenCalled();
    expect(closed).toHaveBeenCalled();
  });
});

