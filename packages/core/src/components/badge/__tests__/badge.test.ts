import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "../index";

function createBadge(): HTMLElementTagNameMap["jds-badge"] {
  const el = document.createElement("jds-badge") as any;
  document.body.appendChild(el);
  return el as any;
}

async function getBadgeRoot(el: HTMLElementTagNameMap["jds-badge"]) {
  // wait for Lit to render
  // @ts-expect-error updateComplete is provided by LitElement
  if (el.updateComplete) await (el as any).updateComplete;
  return el.shadowRoot!;
}

describe("jds-badge", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("shows maxCount+ when count exceeds maxCount", async () => {
    const el = createBadge();
    (el as any).count = 120;
    (el as any).maxCount = 99;
    const root = await getBadgeRoot(el);
    const count = root.querySelector(".count")!;
    expect(count.textContent).toBe("99+");
  });

});
