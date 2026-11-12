import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "../index";

function createBadge(): HTMLElementTagNameMap["zone-badge"] {
  const el = document.createElement("zone-badge") as any;
  document.body.appendChild(el);
  return el as any;
}

async function getBadgeRoot(el: HTMLElementTagNameMap["zone-badge"]) {
  // wait for Lit to render
  // @ts-expect-error updateComplete is provided by LitElement
  if (el.updateComplete) await (el as any).updateComplete;
  return el.shadowRoot!;
}

describe("zone-badge", () => {
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

  it("renders icon after text by default (iconPosition=next)", async () => {
    const el = createBadge();
    el.setAttribute("icon", "info-fill");
    el.textContent = "Badge";
    const root = await getBadgeRoot(el);
    const badge = root.querySelector(".badge")!;
    const slots = Array.from(badge.querySelectorAll("slot"));
    expect(slots[0]?.getAttribute("name")).toBe(null);
    expect(slots[1]?.getAttribute("name")).toBe("icon");
  });

  it("renders icon before text when iconPosition=prev", async () => {
    const el = createBadge();
    el.setAttribute("icon", "info-fill");
    el.setAttribute("iconPosition", "prev");
    el.textContent = "Badge";
    const root = await getBadgeRoot(el);
    const badge = root.querySelector(".badge")!;
    const slots = Array.from(badge.querySelectorAll("slot"));
    expect(slots[0]?.getAttribute("name")).toBe("icon");
    expect(slots[1]?.getAttribute("name")).toBe(null);
  });

  it("maps legacy iconPosition start/end to prev/next", async () => {
    const prevEl = createBadge();
    prevEl.setAttribute("icon", "info-fill");
    prevEl.setAttribute("iconPosition", "start");
    prevEl.textContent = "Badge";
    const prevRoot = await getBadgeRoot(prevEl);
    const prevBadge = prevRoot.querySelector(".badge")!;
    const prevSlots = Array.from(prevBadge.querySelectorAll("slot"));
    expect(prevSlots[0]?.getAttribute("name")).toBe("icon");

    const nextEl = createBadge();
    nextEl.setAttribute("icon", "info-fill");
    nextEl.setAttribute("iconPosition", "end");
    nextEl.textContent = "Badge";
    const nextRoot = await getBadgeRoot(nextEl);
    const nextBadge = nextRoot.querySelector(".badge")!;
    const nextSlots = Array.from(nextBadge.querySelectorAll("slot"));
    expect(nextSlots[0]?.getAttribute("name")).toBe(null);
  });

});
