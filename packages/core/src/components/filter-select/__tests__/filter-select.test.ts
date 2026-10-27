import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { html, render } from "lit";

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

describe("jds-filter-select", () => {
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

  it("renders the trigger label and keeps the panel closed by default", async () => {
    const { el, root } = await setup({ label: "筛选参数", options: OPTIONS });

    expect(q(root, ".trigger__text").textContent?.trim()).toBe("筛选参数");
    expect(q(root, ".trigger").getAttribute("aria-expanded")).toBe("false");
    expect(root.querySelector(".panel")).toBeNull();
    expect(el.open).toBe(false);
  });

  it("shows the panel with counter, options and confirm button on open", async () => {
    const { el, root } = await setup({ label: "筛选参数", options: OPTIONS });
    await open(el);

    expect(root.querySelector(".panel")).toBeTruthy();
    expect(q(root, ".trigger").getAttribute("aria-expanded")).toBe("true");
    expect(qa(root, ".option")).toHaveLength(OPTIONS.length);
    expect(q(root, ".counter__current").textContent).toBe("0");
    expect(q(root, ".counter__total").textContent).toBe(String(OPTIONS.length));
    // 「已选」与数量之间有一个空格，「/」两侧不留空格
    expect(q(root, ".counter").textContent?.trim()).toBe(
      `Selected 0/${OPTIONS.length}`
    );
    expect(q(root, ".clear").textContent?.trim()).toBe("Clear");
    expect(q(root, ".confirm").textContent?.trim()).toBe("Confirm");
  });

  it("keeps the panel selection as a draft until confirm", async () => {
    const { el, root } = await setup({ options: OPTIONS });
    const onChange = vi.fn();
    const onConfirm = vi.fn();
    el.addEventListener("jds-filter-select-change", onChange);
    el.addEventListener("jds-filter-select-confirm", onConfirm);

    await open(el);
    qa(root, ".option")[0].click();
    await waitUpdate(el);

    expect(el._draft).toEqual(["a"]);
    expect(el.value).toEqual([]);
    expect(onChange).not.toHaveBeenCalled();
    expect(q(root, ".counter__current").textContent).toBe("1");

    q(root, ".confirm").click();
    await waitUpdate(el);

    expect(el.value).toEqual(["a"]);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(el.open).toBe(false);
  });

  it("discards the draft when the panel closes without confirming", async () => {
    const { el, root } = await setup({ options: OPTIONS });

    await open(el);
    qa(root, ".option")[1].click();
    await waitUpdate(el);
    expect(el._draft).toEqual(["b"]);

    el.hide();
    await waitUpdate(el);

    expect(el._draft).toEqual([]);
    expect(el.value).toEqual([]);
  });

  it("clears the draft on the clear button in confirm mode without committing", async () => {
    const { el, root } = await setup({ options: OPTIONS, value: ["a", "b"] });
    const onClear = vi.fn();
    el.addEventListener("jds-filter-select-clear", onClear);
    const onChange = vi.fn();
    el.addEventListener("jds-filter-select-change", onChange);

    await open(el);
    expect(q(root, ".counter__current").textContent).toBe("2");

    q(root, ".clear").click();
    await waitUpdate(el);

    // 草稿被清空，但已提交 value 不变
    expect(el._draft).toEqual([]);
    expect(el.value).toEqual(["a", "b"]);
    // 确认模式下不应派发已提交的 clear / change 事件
    expect(onClear).toHaveBeenCalledTimes(0);
    expect(onChange).toHaveBeenCalledTimes(0);

    // 点击确认后才会真正清空并派发事件
    el.confirm();
    await waitUpdate(el);
    expect(el.value).toEqual([]);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("applies the selection immediately when show-confirm is false", async () => {
    const { el, root } = await setup({ options: OPTIONS, showConfirm: false });
    const onChange = vi.fn();
    el.addEventListener("jds-filter-select-change", onChange);

    await open(el);
    expect(root.querySelector(".confirm")).toBeNull();

    qa(root, ".option")[1].click();
    await waitUpdate(el);

    expect(q(root, ".counter").textContent?.trim()).toBe("Selected 1/4");
    expect(el.value).toEqual(["b"]);
    expect(onChange).toHaveBeenCalledTimes(1);

    q(root, ".clear").click();
    await waitUpdate(el);
    expect(el.value).toEqual([]);
  });

  it("deselects an option when it is clicked twice", async () => {
    const { el, root } = await setup({ options: OPTIONS, showConfirm: false });

    await open(el);
    const option = qa(root, ".option")[0];
    option.click();
    await waitUpdate(el);
    expect(el.value).toEqual(["a"]);

    option.click();
    await waitUpdate(el);
    expect(el.value).toEqual([]);
  });

  it("ignores clicks on disabled options", async () => {
    const { el, root } = await setup({ options: OPTIONS, showConfirm: false });

    await open(el);
    qa(root, ".option")[3].click();
    await waitUpdate(el);

    expect(el.value).toEqual([]);
    expect(qa(root, ".option")[3].getAttribute("aria-disabled")).toBe("true");
  });

  it("does not open when disabled", async () => {
    const { el, root } = await setup({ options: OPTIONS, disabled: true });
    el.show();
    await waitUpdate(el);

    expect(el.open).toBe(false);
    expect(root.querySelector(".panel")).toBeNull();
  });

  it.each([
    ["show-confirm", "confirm", ".confirm"],
    ["show-clear", "clear", ".clear"],
    ["show-counter", "counter", ".counter"],
  ])(
    "hides %s when the attribute is set to false",
    async (attr, _name, selector) => {
      const el = document.createElement("jds-filter-select") as any;
      el.setAttribute(attr, "false");
      el.setAttribute("options", JSON.stringify(OPTIONS));
      document.body.appendChild(el);
      await waitUpdate(el);
      await open(el);

      expect(el.shadowRoot!.querySelector(selector)).toBeNull();
    }
  );

  it.each(["show-confirm", "show-clear", "show-counter"])(
    "keeps %s visible when the attribute is present without a value",
    async (attr) => {
      const el = document.createElement("jds-filter-select") as any;
      el.setAttribute(attr, "");
      el.setAttribute("options", JSON.stringify(OPTIONS));
      document.body.appendChild(el);
      await waitUpdate(el);
      await open(el);

      expect(el.showConfirm).toBe(true);
      expect(el.showClear).toBe(true);
      expect(el.showCounter).toBe(true);
    }
  );

  it("treats close-on-scroll='false' as disabled", async () => {
    const el = document.createElement("jds-filter-select") as any;
    el.setAttribute("close-on-scroll", "false");
    el.setAttribute("options", JSON.stringify(OPTIONS));
    document.body.appendChild(el);
    await waitUpdate(el);

    expect(el.closeOnScroll).toBe(false);
  });

  it("treats 0 as false for the loose boolean attributes", async () => {
    const el = document.createElement("jds-filter-select") as any;
    el.setAttribute("show-confirm", "0");
    document.body.appendChild(el);
    await waitUpdate(el);

    expect(el.showConfirm).toBe(false);
  });

  it("keeps the default true when no boolean attribute is present", async () => {
    const el = document.createElement("jds-filter-select") as any;
    document.body.appendChild(el);
    await waitUpdate(el);

    expect(el.showConfirm).toBe(true);
    expect(el.showClear).toBe(true);
    expect(el.showCounter).toBe(true);
    expect(el.closeOnScroll).toBe(true);
  });

  it("honours a false value bound via lit-html property binding", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    render(
      html`<jds-filter-select
        .showConfirm=${false}
        .showClear=${false}
        .showCounter=${false}
        .options=${OPTIONS}
      ></jds-filter-select>`,
      container
    );
    const el = container.querySelector("jds-filter-select") as any;
    await waitUpdate(el);

    expect(el.showConfirm).toBe(false);
    expect(el.showClear).toBe(false);
    expect(el.showCounter).toBe(false);

    el.show();
    await waitUpdate(el);
    expect(el.shadowRoot!.querySelector(".confirm")).toBeNull();
    expect(el.shadowRoot!.querySelector(".clear")).toBeNull();
    expect(el.shadowRoot!.querySelector(".counter")).toBeNull();
    expect(el.shadowRoot!.querySelector(".panel__header")).toBeNull();
    expect(el.shadowRoot!.querySelector(".panel__divider")).toBeNull();
  });

  it("still shows everything when bound true via property binding", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    render(
      html`<jds-filter-select
        .showConfirm=${true}
        .showClear=${true}
        .showCounter=${true}
        .options=${OPTIONS}
      ></jds-filter-select>`,
      container
    );
    const el = container.querySelector("jds-filter-select") as any;
    await waitUpdate(el);
    el.show();
    await waitUpdate(el);

    expect(el.shadowRoot!.querySelector(".confirm")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".clear")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".counter")).toBeTruthy();
  });

  it("documents why ?show-confirm=${false} cannot work on first render", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    render(
      html`<jds-filter-select
        ?show-confirm=${false}
        .options=${OPTIONS}
      ></jds-filter-select>`,
      container
    );
    const el = container.querySelector("jds-filter-select") as any;
    await waitUpdate(el);

    // lit-html 的布尔绑定传 false 时执行 removeAttribute；属性本就不存在 -> 空操作，
    // attributeChangedCallback 不触发，于是保持默认 true。这就是 Immediate /
    // WithoutCounter 两个 story 失效的原因，需改用 .showConfirm=${false} 属性绑定。
    expect(el.hasAttribute("show-confirm")).toBe(false);
    expect(el.showConfirm).toBe(true);
  });

  it("parses options and value from attributes", async () => {
    const el = document.createElement("jds-filter-select") as any;
    el.setAttribute("options", JSON.stringify(OPTIONS));
    el.setAttribute("value", "a,b");
    document.body.appendChild(el);
    await waitUpdate(el);

    expect(el.options).toHaveLength(OPTIONS.length);
    expect(el.value).toEqual(["a", "b"]);
  });

  it("falls back to an empty list for invalid options attributes", async () => {
    const el = document.createElement("jds-filter-select") as any;
    el.setAttribute("options", "{not-json}");
    document.body.appendChild(el);
    await waitUpdate(el);
    await open(el);

    expect(el.options).toEqual([]);
    expect(q(el.shadowRoot!, ".empty").textContent?.trim()).toBe("No Options");
    expect(el.shadowRoot!.querySelector(".options")).toBeNull();
  });

  it("toggles the panel when the trigger is clicked", async () => {
    const { el, root } = await setup({ options: OPTIONS });

    q(root, ".trigger").click();
    await waitUpdate(el);
    expect(el.open).toBe(true);

    q(root, ".trigger").click();
    await waitUpdate(el);
    expect(el.open).toBe(false);
  });

  it("renders the selection summary on the trigger", async () => {
    const { el, root } = await setup({ label: "筛选参数", options: OPTIONS, value: ["a", "b"] });

    expect(q(root, ".trigger__text").textContent?.trim()).toBe("2 Filters Selected");

    el.selectedSummary = "{label}（{count}）";
    await waitUpdate(el);
    expect(q(root, ".trigger__text").textContent?.trim()).toBe("筛选参数（2）");

    el.selectedSummary = "";
    await waitUpdate(el);
    expect(q(root, ".trigger__text").textContent?.trim()).toBe("筛选参数");
  });

  it("falls back to the label when nothing is selected", async () => {
    const { root } = await setup({ label: "筛选参数", options: OPTIONS });

    expect(q(root, ".trigger__text").textContent?.trim()).toBe("筛选参数");
  });

  it("updates the trigger in real time while the panel is open", async () => {
    const { el, root } = await setup({ label: "筛选参数", options: OPTIONS });

    await open(el);
    expect(q(root, ".trigger__text").textContent?.trim()).toBe("筛选参数");

    qa(root, ".option")[0].click();
    await waitUpdate(el);
    expect(q(root, ".trigger__text").textContent?.trim()).toBe("1 Filters Selected");

    qa(root, ".option")[1].click();
    await waitUpdate(el);
    expect(q(root, ".trigger__text").textContent?.trim()).toBe("2 Filters Selected");

    qa(root, ".option")[0].click();
    await waitUpdate(el);
    expect(q(root, ".trigger__text").textContent?.trim()).toBe("1 Filters Selected");
  });

  it("reverts the trigger when the panel closes without confirming", async () => {
    const { el, root } = await setup({ label: "筛选参数", options: OPTIONS });

    await open(el);
    qa(root, ".option")[0].click();
    qa(root, ".option")[1].click();
    await waitUpdate(el);
    expect(q(root, ".trigger__text").textContent?.trim()).toBe("2 Filters Selected");

    el.hide();
    await waitUpdate(el);
    expect(q(root, ".trigger__text").textContent?.trim()).toBe("筛选参数");
  });

  it("keeps the trigger summary after confirming", async () => {
    const { el, root } = await setup({ label: "筛选参数", options: OPTIONS });

    await open(el);
    qa(root, ".option")[0].click();
    await waitUpdate(el);

    q(root, ".confirm").click();
    await waitUpdate(el);

    expect(q(root, ".trigger__text").textContent?.trim()).toBe("1 Filters Selected");
    expect(el.value).toEqual(["a"]);
  });

  it("clears the trigger summary with the clear button", async () => {
    const { el, root } = await setup({ label: "筛选参数", options: OPTIONS, value: ["a", "b"] });

    await open(el);
    expect(q(root, ".trigger__text").textContent?.trim()).toBe("2 Filters Selected");

    q(root, ".clear").click();
    await waitUpdate(el);
    expect(q(root, ".trigger__text").textContent?.trim()).toBe("筛选参数");
  });

  it("exposes listbox / option aria wiring", async () => {
    const { el, root } = await setup({ label: "筛选参数", options: OPTIONS, value: ["a"] });
    await open(el);

    const trigger = q(root, ".trigger");
    const listbox = q(root, ".options");

    expect(trigger.getAttribute("aria-haspopup")).toBe("listbox");
    expect(trigger.getAttribute("aria-controls")).toBe(listbox.id);
    expect(listbox.getAttribute("role")).toBe("listbox");
    expect(listbox.getAttribute("aria-multiselectable")).toBe("true");

    const options = qa(root, ".option");
    expect(options[0].getAttribute("role")).toBe("option");
    expect(options[0].getAttribute("aria-selected")).toBe("true");
    expect(options[1].getAttribute("aria-selected")).toBe("false");
  });
});
