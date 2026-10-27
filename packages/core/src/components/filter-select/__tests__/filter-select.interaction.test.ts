import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const { autoUpdateSpy, computePositionSpy } = vi.hoisted(() => ({
  autoUpdateSpy: vi.fn((_: Element, __: Element, update: () => void) => {
    update();
    return () => {};
  }),
  computePositionSpy: vi.fn(),
}));

vi.mock("@floating-ui/dom", async () => {
  const actual =
    await vi.importActual<typeof import("@floating-ui/dom")>("@floating-ui/dom");
  return {
    ...actual,
    autoUpdate: autoUpdateSpy,
    computePosition: computePositionSpy,
  };
});

import { waitUpdate } from "../../../../test/utils";
import "../index";

const OPTIONS = [
  { value: "a", label: "Solar Panels" },
  { value: "b", label: "SG1500(2*100W)" },
  { value: "c", label: "SG1500(4*100W)" },
  { value: "d", label: "Disabled Panel", disabled: true },
];

function q(root: ParentNode, selector: string): HTMLElement {
  return root.querySelector(selector) as HTMLElement;
}

function qa(root: ParentNode, selector: string): HTMLElement[] {
  return Array.from(root.querySelectorAll(selector)) as HTMLElement[];
}

async function setup(props: Record<string, unknown> = {}) {
  const el = document.createElement("jds-filter-select") as any;
  Object.assign(el, props);
  document.body.appendChild(el);
  const root = await waitUpdate(el);
  return { el, root };
}

async function open(el: any) {
  el.show();
  await waitUpdate(el);
  // 位置计算在 updateComplete 之后的微任务中完成，这里冲刷全部微任务
  await new Promise((resolve) => setTimeout(resolve, 0));
}

function press(target: Element, key: string) {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
}

describe("jds-filter-select interaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    computePositionSpy.mockResolvedValue({
      x: 0,
      y: 36,
      placement: "bottom-start",
      middlewareData: {},
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("closes on an outside click and discards the draft", async () => {
    const { el, root } = await setup({ options: OPTIONS });

    await open(el);
    qa(root, ".option")[0].click();
    await waitUpdate(el);
    expect(el._draft).toEqual(["a"]);

    document.body.click();
    await waitUpdate(el);

    expect(el.open).toBe(false);
    expect(el.value).toEqual([]);
  });

  it("closes on Escape", async () => {
    const { el } = await setup({ options: OPTIONS });
    await open(el);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await waitUpdate(el);

    expect(el.open).toBe(false);
  });

  it("positions the panel with the floating middleware", async () => {
    const { el, root } = await setup({ options: OPTIONS });
    await open(el);

    const panel = q(root, ".panel");
    expect(autoUpdateSpy).toHaveBeenCalled();
    expect(computePositionSpy).toHaveBeenCalled();
    expect(panel.style.left).toBe("0px");
    expect(panel.style.top).toBe("36px");
    expect(panel.getAttribute("data-placement")).toBe("bottom-start");
  });

  it("moves the active option with arrow keys, skipping disabled ones", async () => {
    const { el, root } = await setup({ options: OPTIONS });
    await open(el);

    const listbox = q(root, ".options");

    press(listbox, "ArrowDown");
    await waitUpdate(el);
    expect(el._activeIndex).toBe(0);

    press(listbox, "ArrowDown");
    await waitUpdate(el);
    expect(el._activeIndex).toBe(1);

    press(listbox, "ArrowUp");
    await waitUpdate(el);
    expect(el._activeIndex).toBe(0);

    press(listbox, "ArrowUp");
    await waitUpdate(el);
    expect(el._activeIndex).toBe(2);

    press(listbox, "End");
    await waitUpdate(el);
    expect(el._activeIndex).toBe(2);

    press(listbox, "Home");
    await waitUpdate(el);
    expect(el._activeIndex).toBe(0);
  });

  it("toggles the active option with Enter and Space", async () => {
    const { el, root } = await setup({ options: OPTIONS, showConfirm: false });
    await open(el);

    const listbox = q(root, ".options");

    press(listbox, "ArrowDown");
    await waitUpdate(el);
    press(listbox, "Enter");
    await waitUpdate(el);
    expect(el.value).toEqual(["a"]);

    press(listbox, " ");
    await waitUpdate(el);
    expect(el.value).toEqual([]);
  });

  it("drives aria-activedescendant from the active option", async () => {
    const { el, root } = await setup({ options: OPTIONS });
    await open(el);

    const listbox = q(root, ".options");
    expect(listbox.getAttribute("aria-activedescendant")).toBeNull();

    press(listbox, "ArrowDown");
    await waitUpdate(el);

    const activeId = listbox.getAttribute("aria-activedescendant");
    expect(activeId).toBeTruthy();
    expect(root.querySelector(`#${activeId}`)).toBe(qa(root, ".option")[0]);
  });

  it("opens from the trigger with ArrowDown and puts focus in the list", async () => {
    const { el, root } = await setup({ options: OPTIONS });

    press(q(root, ".trigger"), "ArrowDown");
    await waitUpdate(el);
    await waitUpdate(el);

    expect(el.open).toBe(true);
    expect(el._activeIndex).toBe(0);
  });

  it("closes with Escape from inside the list", async () => {
    const { el, root } = await setup({ options: OPTIONS });
    await open(el);

    press(q(root, ".options"), "Escape");
    await waitUpdate(el);

    expect(el.open).toBe(false);
  });

  it("tears down the floating update loop while open", async () => {
    const { el } = await setup({ options: OPTIONS });
    await open(el);
    expect(autoUpdateSpy).toHaveBeenCalled();

    el.remove();
    await waitUpdate(el);

    expect(el.open).toBe(true);
    expect(() => document.body.click()).not.toThrow();
  });

  it("closes when the page scrolls", async () => {
    const { el } = await setup({ options: OPTIONS });
    await open(el);

    document.dispatchEvent(new Event("scroll"));
    await waitUpdate(el);

    expect(el.open).toBe(false);
  });

  it("closes when an outer scroll container scrolls", async () => {
    const { el, root } = await setup({ options: OPTIONS });
    await open(el);

    // 组件所在的祖先容器滚动
    const outer = document.createElement("div");
    document.body.appendChild(outer);
    outer.appendChild(el);
    outer.dispatchEvent(new Event("scroll"));
    await waitUpdate(el);

    expect(el.open).toBe(false);
    expect(root.querySelector(".panel")).toBeNull();
  });

  it("keeps the panel open while scrolling the options list", async () => {
    const { el, root } = await setup({ options: OPTIONS });
    await open(el);

    q(root, ".options").dispatchEvent(new Event("scroll", { composed: true }));
    await waitUpdate(el);

    expect(el.open).toBe(true);
  });

  it("keeps the panel open while scrolling the panel itself", async () => {
    const { el, root } = await setup({ options: OPTIONS });
    await open(el);

    q(root, ".panel").dispatchEvent(new Event("scroll", { composed: true }));
    await waitUpdate(el);

    expect(el.open).toBe(true);
  });

  it("does not close on scroll when close-on-scroll is false", async () => {
    const { el } = await setup({ options: OPTIONS, closeOnScroll: false });
    await open(el);

    document.dispatchEvent(new Event("scroll"));
    await waitUpdate(el);

    expect(el.open).toBe(true);
  });

  it("stops closing on scroll after the panel is closed", async () => {
    const { el } = await setup({ options: OPTIONS });
    await open(el);
    el.hide();
    await waitUpdate(el);

    // 关闭后不应再抛错 / 不应改变状态
    expect(() => document.dispatchEvent(new Event("scroll"))).not.toThrow();
    expect(el.open).toBe(false);
  });

  it("removes the scroll listener on disconnect", async () => {
    const { el } = await setup({ options: OPTIONS });
    await open(el);

    el.remove();
    await waitUpdate(el);

    expect(() => document.dispatchEvent(new Event("scroll"))).not.toThrow();
    expect(el.open).toBe(true);
  });
});
