import { afterEach, describe, expect, it, vi } from "vitest";
import axe from "axe-core";
import "../index";
import type { ZoneDropdown } from "../index";
import { buildDropdownTree } from "../tree-utils";
import type { DropdownOption } from "../types";
import "../../dialog";
import { RowHeights } from "../row-heights";
import { setCurrLanguage, getCurrLanguage, t, SUPPORTED_LANGUAGES } from "@aiyazone/i18n";
import { getDropdownLanguage } from "../locale";

const originalHtmlLang = document.documentElement.getAttribute("lang");

vi.mock("@floating-ui/dom", () => ({
  autoUpdate: vi.fn((_trigger, _panel, update) => {
    update();
    return vi.fn();
  }),
  computePosition: vi.fn(async () => ({ x: 0, y: 48 })),
  flip: vi.fn(),
  shift: vi.fn(),
  size: vi.fn(),
}));

const flat: DropdownOption[] = [
  { value: "a", label: "Alpha" },
  { value: "disabled", label: "Disabled", disabled: true },
  { value: "b", label: "Beta" },
];
const tree: DropdownOption[] = [
  {
    value: "root",
    label: "Category",
    children: [
      {
        value: "parent",
        label: "Product",
        children: [
          { value: "leaf", label: "Model" },
          { value: "leaf2", label: "Model" },
        ],
      },
      { value: "other", label: "Other" },
    ],
  },
  {
    value: "disabled-parent",
    label: "Unavailable",
    disabled: true,
    children: [{ value: "disabled-child", label: "Hidden" }],
  },
];
async function mount(options = flat, value = "") {
  const el = document.createElement("zone-dropdown") as ZoneDropdown;
  el.options = options;
  el.value = value;
  el.label = "Issue Type";
  document.body.append(el);
  await el.updateComplete;
  return el;
}
function key(el: ZoneDropdown, key: string) {
  el.shadowRoot!.querySelector(".trigger")!.dispatchEvent(
    new KeyboardEvent("keydown", {
      key,
      code: key,
      bubbles: true,
      composed: true,
      cancelable: true,
    }),
  );
  return el.updateComplete;
}
async function click(el: ZoneDropdown, label: string) {
  const node = [...el.shadowRoot!.querySelectorAll("[aria-label]")].find(
    (node) => node.getAttribute("aria-label") === label,
  );
  (node!.querySelector(".option") as HTMLElement).click();
  await el.updateComplete;
}
afterEach(() => {
  document.body.replaceChildren();
  if (originalHtmlLang === null) document.documentElement.removeAttribute("lang");
  else document.documentElement.setAttribute("lang", originalHtmlLang);
  setCurrLanguage("en");
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe("zone-dropdown", () => {
  it("点击字段标签及必填标记不打开面板，只有触发按钮切换面板", async () => {
    const el = await mount();
    el.required = true;
    await el.updateComplete;
    const label = el.shadowRoot!.querySelector("label")!;
    label.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
    (label.querySelector(".required") as HTMLElement).click();
    await el.updateComplete;
    expect(el.open).toBe(false);
    (el.shadowRoot!.querySelector(".trigger") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    label.click();
    (label.querySelector(".required") as HTMLElement).click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    (el.shadowRoot!.querySelector(".trigger") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it("组件禁用或由表单禁用时，点击字段标签不会打开或聚焦", async () => {
    const el = await mount();
    const focus = vi.spyOn(el, "focus");
    el.disabled = true;
    await el.updateComplete;
    el.shadowRoot!.querySelector("label")!.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
    el.disabled = false;
    el.formDisabledCallback(true);
    await el.updateComplete;
    el.shadowRoot!.querySelector("label")!.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(focus).not.toHaveBeenCalled();
  });
  it("优先使用 html lang，动态切换同步校验文案，且不修改全局语言", async () => {
    setCurrLanguage("ja");
    document.documentElement.lang = "zh-CN";
    const el = await mount([]);
    expect(el.placeholder).toBe("请选择");
    const internals = {
      validationMessage: "",
      setFormValue: vi.fn(),
      setValidity: vi.fn((_flags, message) => { internals.validationMessage = message; }),
    };
    Object.defineProperty(el, "_internals", { value: internals });
    el.required = true;
    await el.updateComplete;
    el.dispatchEvent(new Event("invalid"));
    await el.updateComplete;
    document.documentElement.lang = "en-US";
    // 等待属性观察器通知组件，再等待 Lit 更新。
    await Promise.resolve();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".value")!.textContent).toBe("Select an option");
    expect(el.shadowRoot!.querySelector("#error")!.textContent).toContain("Please select an option.");
    expect(getCurrLanguage()).toBe("ja");
    document.documentElement.removeAttribute("lang");
    await Promise.resolve();
    await el.updateComplete;
    expect(el.placeholder).toBe("選択してください");
    expect(el.shadowRoot!.querySelector(".value")!.textContent).toBe("選択してください");
  });

  it.each([
    [" ZH-cn ", "zh-CN"], ["zh", "zh-CN"], ["zh-Hans-SG", "zh-CN"],
    ["zh-Hant", "zh-TW"], ["zh-HK", "zh-TW"], ["fr-CA", "fr"],
    ["unsupported", "ja"], ["", "ja"], ["constructor", "ja"],
  ])("页面语言 %s 映射为 %s", (lang, expected) => {
    setCurrLanguage("ja");
    document.documentElement.lang = lang;
    expect(getDropdownLanguage(document)).toBe(expected);
  });

  it("页面语言监听在卸载时释放，重新挂载后恢复，自定义文案保持优先", async () => {
    document.documentElement.lang = "en";
    const el = await mount([]);
    el.placeholder = "业务占位文案";
    await el.updateComplete;
    const update = vi.spyOn(el, "requestUpdate");
    el.remove();
    update.mockClear();
    document.documentElement.lang = "zh-CN";
    await Promise.resolve();
    expect(update).not.toHaveBeenCalled();
    document.body.append(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".value")!.textContent).toBe("业务占位文案");
    el.placeholder = undefined;
    await el.updateComplete;
    expect(el.placeholder).toBe("请选择");
    document.documentElement.lang = "en";
    await Promise.resolve();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".value")!.textContent).toBe("Select an option");
  });
  it("默认文案随语言切换，并更新已显示的必填校验提示", async () => {
    setCurrLanguage("en");
    const el = await mount([]);
    const internals = {
      validationMessage: "",
      setFormValue: vi.fn(),
      setValidity: vi.fn((_flags, message) => {
        internals.validationMessage = message;
      }),
    };
    Object.defineProperty(el, "_internals", { value: internals });
    el.required = true;
    await el.updateComplete;
    el.dispatchEvent(new Event("invalid"));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("#error")!.textContent).toContain(
      "Please select an option.",
    );
    setCurrLanguage("zh-CN");
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".value")!.textContent).toBe("请选择");
    expect(el.shadowRoot!.querySelector(".empty")!.textContent).toBe("暂无选项");
    expect(el.validationMessage).toBe("请选择一个选项。");
    expect(el.shadowRoot!.querySelector("#error")!.textContent).toContain("请选择一个选项。");
    el.options = flat;
    el.value = "a";
    el.clearable = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".clear")!.getAttribute("aria-label")).toBe("清空选择");
    el.setCustomValidity("业务校验错误");
    setCurrLanguage("fr");
    await el.updateComplete;
    expect(el.validationMessage).toBe("业务校验错误");
  });

  it("显式文案保持优先，移除特性或恢复 undefined 后使用翻译", async () => {
    const el = await mount([]);
    el.setAttribute("placeholder", "业务占位文案");
    el.emptyText = "业务空状态";
    el.requiredMessage = "业务必填提示";
    el.clearLabel = "业务清空提示";
    setCurrLanguage("zh-TW");
    await el.updateComplete;
    expect([el.placeholder, el.emptyText, el.requiredMessage, el.clearLabel]).toEqual([
      "业务占位文案", "业务空状态", "业务必填提示", "业务清空提示",
    ]);
    el.removeAttribute("placeholder");
    el.emptyText = undefined;
    el.clearLabel = "";
    await el.updateComplete;
    expect(el.placeholder).toBe("請選擇");
    expect(el.emptyText).toBe("暫無選項");
    expect(el.clearLabel).toBe("");
  });

  it("卸载时释放语言监听，重新挂载时恢复当前语言和后续更新", async () => {
    const el = await mount([]);
    const update = vi.spyOn(el, "requestUpdate");
    el.remove();
    update.mockClear();
    setCurrLanguage("zh-CN");
    expect(update).not.toHaveBeenCalled();
    document.body.append(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".value")!.textContent).toBe("请选择");
    setCurrLanguage("en");
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".value")!.textContent).toBe("Select an option");
  });

  it("所有支持语言都提供完整的 Dropdown 默认文案", () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      setCurrLanguage(lang);
      for (const key of ["placeholder", "emptyText", "requiredMessage", "clearLabel"]) {
        const translationKey = `components.dropdown.${key}`;
        expect(t(translationKey)).not.toBe(translationKey);
        expect(t(translationKey)).not.toBe("");
      }
    }
  });
  it("Escape 优先关闭当前下拉，再交由外层 Dialog 处理", async () => {
    const dialog = document.createElement("zone-dialog");
    const el = await mount();
    dialog.append(el);
    document.body.append(dialog);
    dialog.open = true;
    await dialog.updateComplete;
    el.show();
    await el.updateComplete;
    await key(el, "Escape");
    await dialog.updateComplete;
    expect(el.open).toBe(false);
    expect(dialog.open).toBe(true);
    await key(el, "Escape");
    await dialog.updateComplete;
    expect(dialog.open).toBe(false);
  });

  it("5000 项数据关闭时不生成选项，打开及导航时仅渲染当前窗口", async () => {
    const options = Array.from({ length: 5000 }, (_, i) => ({
      value: `v${i}`,
      label: `Option ${i}`,
    }));
    const el = await mount(options);
    expect(el.shadowRoot!.querySelectorAll("[role=option]")).toHaveLength(0);
    el.show();
    await el.updateComplete;
    expect(
      el.shadowRoot!.querySelectorAll("[role=option]").length,
    ).toBeLessThan(40);
    await key(el, "End");
    const active = el
      .shadowRoot!.querySelector(".trigger")!
      .getAttribute("aria-activedescendant");
    expect(
      el.shadowRoot!.getElementById(active!)!.getAttribute("aria-label"),
    ).toBe("Option 4999");
    await key(el, "Enter");
    expect(el.value).toBe("v4999");
    expect(el.shadowRoot!.querySelectorAll("[role=option]")).toHaveLength(0);
    el.show();
    await el.updateComplete;
    await key(el, "Home");
    await key(el, "Enter");
    expect(el.value).toBe("v0");
  });

  it("虚拟树保留层级、同级位置及禁用节点的导航语义", async () => {
    const options = [
      {
        value: "root",
        label: "Root",
        children: Array.from({ length: 300 }, (_, i) => ({
          value: `c${i}`,
          label: `Child ${i}`,
          disabled: i === 299,
        })),
      },
    ];
    const el = await mount(options, "c298");
    el.show();
    await el.updateComplete;
    await key(el, "End");
    const row = el.shadowRoot!.getElementById(
      el
        .shadowRoot!.querySelector(".trigger")!
        .getAttribute("aria-activedescendant")!,
    )!;
    expect(row.getAttribute("aria-label")).toBe("Child 298");
    expect(row.getAttribute("aria-level")).toBe("2");
    expect(row.getAttribute("aria-posinset")).toBe("299");
    expect(row.getAttribute("aria-setsize")).toBe("300");
    await key(el, "ArrowLeft");
    await key(el, "ArrowLeft");
    expect(el.shadowRoot!.querySelectorAll("[role=treeitem]")).toHaveLength(1);
  });

  it("动态行高的累计偏移和定位保持一致", () => {
    const heights = new RowHeights([40, 40, 40, 40]);
    expect(heights.offset(4)).toBe(160);
    expect(heights.indexAt(79)).toBe(1);
    heights.set(0, 100);
    expect(heights.offset(4)).toBe(220);
    expect(heights.indexAt(99)).toBe(0);
    expect(heights.indexAt(100)).toBe(1);
    expect(heights.indexAt(10000)).toBe(3);
  });

  it("动态行高与面板尺寸变化后仍可导航，关闭时释放所有观察器", async () => {
    const observers: Array<{
      callback: ResizeObserverCallback;
      elements: Set<Element>;
      disconnect: () => void;
    }> = [];
    vi.stubGlobal(
      "ResizeObserver",
      class {
        elements = new Set<Element>();
        disconnect = vi.fn(() => this.elements.clear());
        constructor(public callback: ResizeObserverCallback) {
          observers.push(this);
        }
        observe(element: Element) {
          this.elements.add(element);
        }
        unobserve(element: Element) {
          this.elements.delete(element);
        }
      },
    );
    const el = await mount(
      Array.from({ length: 5000 }, (_, i) => ({
        value: `v${i}`,
        label: `Option ${i}`,
      })),
    );
    el.show();
    await el.updateComplete;
    const panel = el.shadowRoot!.querySelector(".panel")!;
    const panelObserver = observers.find((observer) =>
      observer.elements.has(panel),
    )!;
    panelObserver.callback(
      [
        { target: panel, contentRect: { width: 311, height: 180 } },
      ] as unknown as ResizeObserverEntry[],
      {} as ResizeObserver,
    );
    await el.updateComplete;
    const row = el.shadowRoot!.querySelector("[data-virtual-row]")!;
    const rowObserver = observers.find((observer) =>
      observer.elements.has(row),
    )!;
    rowObserver.callback(
      [
        {
          target: row,
          borderBoxSize: [{ blockSize: 120, inlineSize: 311 }],
          contentRect: { height: 120 },
        },
      ] as unknown as ResizeObserverEntry[],
      {} as ResizeObserver,
    );
    await el.updateComplete;
    await key(el, "End");
    expect(
      el
        .shadowRoot!.getElementById(
          el
            .shadowRoot!.querySelector(".trigger")!
            .getAttribute("aria-activedescendant")!,
        )!
        .getAttribute("aria-label"),
    ).toBe("Option 4999");
    el.hide();
    await el.updateComplete;
    for (const observer of observers) {
      expect(observer.disconnect).toHaveBeenCalled();
      expect(observer.elements.size).toBe(0);
    }
  });
  it("uses a listbox for flat data and selects a leaf with a composed change event", async () => {
    const el = await mount();
    const change = vi.fn();
    document.body.addEventListener("change", change, { once: true });
    el.show();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("[role=listbox]")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".branch-icon")).toBeNull();
    await click(el, "Beta");
    expect(el.value).toBe("b");
    expect(el.open).toBe(false);
    expect(change).toHaveBeenCalledOnce();
    const event = change.mock.calls[0][0];
    expect(event.composed).toBe(true);
    expect(event.detail).toEqual({
      value: "b",
      option: flat[2],
      pathValues: ["b"],
      pathLabels: ["Beta"],
    });
  });

  it("expands parents without selecting and supports repeated labels with distinct values", async () => {
    const el = await mount(tree);
    const change = vi.fn();
    el.addEventListener("change", change);
    el.show();
    await el.updateComplete;
    await click(el, "Category");
    await click(el, "Product");
    expect(el.value).toBe("");
    expect(change).not.toHaveBeenCalled();
    expect(
      el.shadowRoot!.querySelectorAll("[role=treeitem][aria-label=Model]"),
    ).toHaveLength(2);
    await key(el, "ArrowRight");
    await key(el, "Enter");
    expect(el.value).toBe("leaf");
    expect(change.mock.calls[0][0].detail.pathValues).toEqual([
      "root",
      "parent",
      "leaf",
    ]);
    el.show();
    await el.updateComplete;
    expect(
      el.shadowRoot!.querySelectorAll("[aria-expanded=true][role=treeitem]"),
    ).toHaveLength(2);
  });

  it("navigates flat options, skips disabled nodes, and Escape preserves the committed value", async () => {
    const el = await mount(flat, "a");
    await key(el, "ArrowDown");
    await key(el, "ArrowDown");
    const activeId = el
      .shadowRoot!.querySelector(".trigger")!
      .getAttribute("aria-activedescendant");
    expect(
      el.shadowRoot!.getElementById(activeId!)!.getAttribute("aria-label"),
    ).toBe("Beta");
    await key(el, "Escape");
    expect(el.value).toBe("a");
    expect(el.open).toBe(false);
    await key(el, "ArrowDown");
    await key(el, "End");
    await key(el, "Enter");
    expect(el.value).toBe("b");
  });

  it("supports Left/Right tree navigation and Home/End", async () => {
    const el = await mount(tree);
    await key(el, "ArrowDown");
    await key(el, "ArrowRight");
    await key(el, "ArrowRight");
    await key(el, "ArrowRight");
    await key(el, "ArrowRight");
    expect(
      el
        .shadowRoot!.querySelector(".trigger")!
        .getAttribute("aria-activedescendant"),
    ).toBe("option-2");
    await key(el, "ArrowLeft");
    await key(el, "ArrowLeft");
    expect(
      el
        .shadowRoot!.querySelector("[aria-label=Product]")!
        .getAttribute("aria-expanded"),
    ).toBe("false");
    await key(el, "Home");
    await key(el, "End");
    await key(el, "Enter");
    expect(el.value).toBe("other");
  });

  it("does not select disabled parents or descendants", async () => {
    const el = await mount(tree);
    el.show();
    await el.updateComplete;
    await click(el, "Unavailable");
    expect(el.value).toBe("");
    expect(el.shadowRoot!.querySelector("[aria-label=Hidden]")).toBeNull();
    el.value = "disabled-child";
    await el.updateComplete;
    expect(el.value).toBe("");
  });

  it("programmatic value updates do not emit change and can display full paths", async () => {
    const el = await mount(tree);
    const change = vi.fn();
    el.addEventListener("change", change);
    el.value = "leaf";
    el.showPath = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".value")!.textContent).toBe(
      "Category / Product / Model",
    );
    expect(change).not.toHaveBeenCalled();
  });

  it("clears selection and keeps input focus", async () => {
    const el = await mount(flat, "a");
    el.clearable = true;
    await el.updateComplete;
    const change = vi.fn();
    el.addEventListener("change", change);
    (el.shadowRoot!.querySelector(".clear") as HTMLElement).click();
    await el.updateComplete;
    expect(el.value).toBe("");
    expect(change.mock.calls[0][0].detail.option).toBeNull();
    expect(el.shadowRoot!.activeElement).toBe(
      el.shadowRoot!.querySelector(".trigger"),
    );
  });

  it("closes on outside pointer and Tab but treats nested Shadow DOM clicks as internal", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const shadow = host.attachShadow({ mode: "open" });
    const el = await mount();
    shadow.append(el);
    await el.updateComplete;
    el.show();
    await el.updateComplete;
    el.shadowRoot!.querySelector(".option")!.dispatchEvent(
      new Event("pointerdown", { bubbles: true, composed: true }),
    );
    expect(el.open).toBe(true);
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);
    el.show();
    await el.updateComplete;
    await key(el, "Tab");
    expect(el.open).toBe(false);
  });

  it("closes and blocks opening when disabled directly or by a fieldset", async () => {
    const el = await mount();
    el.show();
    await el.updateComplete;
    el.disabled = true;
    await el.updateComplete;
    expect(el.open).toBe(false);
    el.show();
    expect(el.open).toBe(false);
    el.disabled = false;
    el.formDisabledCallback(true);
    await el.updateComplete;
    el.show();
    expect(el.open).toBe(false);
    expect(
      (el.shadowRoot!.querySelector(".trigger") as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it("updates labels and removes a selection no longer in data", async () => {
    const el = await mount(flat, "a");
    el.options = [{ value: "a", label: "Renamed" }];
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".value")!.textContent).toBe("Renamed");
    el.options = [{ value: "new", label: "New" }];
    await el.updateComplete;
    expect(el.value).toBe("");
  });

  it("handles empty data and data arriving after a value", async () => {
    const el = await mount([], "a");
    el.show();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("[role=status]")!.textContent).toBe(
      "No options",
    );
    el.options = flat;
    await el.updateComplete;
    expect(el.value).toBe("a");
    expect(el.shadowRoot!.querySelector(".value")!.textContent).toBe("Alpha");
  });

  it("restores initial value on reset and accepts restored form state", async () => {
    const el = await mount(flat, "a");
    el.value = "b";
    el.show();
    await el.updateComplete;
    el.formResetCallback();
    await el.updateComplete;
    expect(el.value).toBe("a");
    expect(el.open).toBe(false);
    el.formStateRestoreCallback("b");
    await el.updateComplete;
    expect(el.value).toBe("b");
  });

  it("rejects duplicate and empty values", () => {
    expect(() => buildDropdownTree([{ value: "", label: "Empty" }])).toThrow(
      /unique/,
    );
    expect(() => buildDropdownTree([...flat, flat[0]])).toThrow(/unique/);
  });

  it("switches popup semantics when options change and treats empty children as a leaf", async () => {
    const el = await mount([{ value: "a", label: "Alpha", children: [] }]);
    el.show();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("[role=listbox]")).toBeTruthy();
    await click(el, "Alpha");
    expect(el.value).toBe("a");
    el.options = tree;
    el.show();
    await el.updateComplete;
    expect(el.value).toBe("");
    expect(el.shadowRoot!.querySelector("[role=tree]")).toBeTruthy();
    el.options = flat;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("[role=listbox]")).toBeTruthy();
  });

  it("removes document listeners on detach and reconnects while open", async () => {
    const el = await mount();
    el.show();
    await el.updateComplete;
    el.remove();
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    expect(el.open).toBe(true);
    document.body.append(el);
    await el.updateComplete;
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it("has no axe violations for flat and hierarchical open/closed controls", async () => {
    for (const options of [flat, tree]) {
      const el = await mount(options, options === tree ? "leaf" : "a");
      for (const open of [false, true]) {
        el.open = open;
        await el.updateComplete;
        const result = await axe.run(el, {
          rules: { "color-contrast": { enabled: false } },
        });
        expect(
          result.violations.map((item) => `${item.id}: ${item.description}`),
        ).toEqual([]);
      }
      el.remove();
    }
  });
});
