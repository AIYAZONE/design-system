import "../../../../packages/core/src/components/dropdown";
import "../../../../packages/core/src/components/dialog";
import {
  dropdownFlatOptions,
  dropdownTreeOptions,
  dropdownMobileOptions,
} from "../../../../packages/core/src/components/dropdown/demo-data";
import type { ZoneDropdown } from "../../../../packages/core/src/components/dropdown";

async function initializeDemo() {
  const params = new URLSearchParams(location.search);
  const theme = params.get("theme");
  if (theme === "v1")
    await import("../../../../src/styles/themes/v1/index.less");
  else if (theme === "v3")
    await import("../../../../src/styles/themes/v3/index.less");
  else await import("../../../../src/styles/themes/v2/index.less");

  const tree = document.querySelector<ZoneDropdown>("#tree")!;
  const flat = document.querySelector<ZoneDropdown>("#flat")!;
  const accessory = document.querySelector<ZoneDropdown>("#fieldset-dropdown")!;
  const clipped = document.querySelector<ZoneDropdown>("#clipped")!;
  const form = document.querySelector<HTMLFormElement>("#form")!;
  const fieldset = document.querySelector<HTMLFieldSetElement>("#fieldset")!;
  const view = params.get("view");
  const large = document.querySelector<ZoneDropdown>("#large")!;
  const dialog = document.querySelector("zone-dialog")!;
  const dialogDropdown =
    document.querySelector<ZoneDropdown>("#dialog-dropdown")!;
  large.options = Array.from({ length: 5000 }, (_, i) => ({
    value: `large-${i}`,
    label:
      i % 5 === 0
        ? `Option ${i} — 长文本换行检查：AIYAZONE Explorer 3000 Pro Portable Power Station, Solar Panels and accessories`
        : `Option ${i}`,
  }));
  dialogDropdown.options = dropdownFlatOptions;
  document.querySelector("#open-dialog")!.addEventListener("click", () => {
    dialog.open = true;
  });
  if (view === "pc" || view === "mb") document.body.dataset.view = view;
  tree.options = view === "mb" ? dropdownMobileOptions : dropdownTreeOptions;
  if (view === "mb") {
    tree.label = "";
    tree.required = false;
  }
  flat.options = dropdownFlatOptions;
  accessory.options = dropdownFlatOptions;
  clipped.options = dropdownTreeOptions;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector("#form-result")!.textContent = JSON.stringify(
      Object.fromEntries(new FormData(form)),
    );
  });
  form.addEventListener("reset", () => {
    document.querySelector("#form-result")!.textContent = "";
  });
  document.querySelector("#toggle-disabled")!.addEventListener("click", () => {
    fieldset.disabled = !fieldset.disabled;
  });

  // 展开设计稿中的两个分支，保持未选择状态。
  await tree.updateComplete;
  tree.show();
  await tree.updateComplete;
  for (const label of [
    tree.options[1].label,
    tree.options[1].children![0].label,
  ]) {
    const row = [
      ...tree.shadowRoot!.querySelectorAll<HTMLElement>("[role=treeitem]"),
    ].find((row) => row.getAttribute("aria-label") === label);
    (row?.querySelector(".option") as HTMLElement)?.click();
    await tree.updateComplete;
  }
  // 设计稿预览模式保持面板打开；普通示例默认关闭，便于交互体验。
  if (!view) tree.hide();

  document.querySelector("#run-checks")!.addEventListener("click", async () => {
    const result = document.querySelector("#checks-result")!;
    const passed: string[] = [];
    const assert = (condition: boolean, message: string) => {
      if (!condition) throw new Error(message);
      passed.push(message);
    };
    const settle = async (el: ZoneDropdown) => {
      await el.updateComplete;
      await el.updateComplete;
    };
    const initial = {
      flat: flat.value,
      accessory: accessory.value,
      disabled: fieldset.disabled,
    };
    try {
      fieldset.disabled = false;
      flat.value = "";
      await settle(flat);
      assert(!form.checkValidity(), "Required field prevents empty submission");
      flat.value = "power";
      await settle(flat);
      assert(form.checkValidity(), "Selected value passes native validity");
      assert(
        new FormData(form).get("category") === "power",
        "FormData includes selected leaf value",
      );
      flat.setCustomValidity("Custom validation");
      assert(
        !flat.checkValidity(),
        "Custom validity participates in native validation",
      );
      flat.setCustomValidity("");
      assert(flat.checkValidity(), "Custom validity can be cleared");
      accessory.value = "solar";
      await settle(accessory);
      fieldset.disabled = true;
      await settle(accessory);
      assert(
        !new FormData(form).has("accessory"),
        "Disabled fieldset excludes value from FormData",
      );
      assert(
        (accessory.shadowRoot!.querySelector(".trigger") as HTMLButtonElement)
          .disabled,
        "Disabled fieldset disables internal trigger",
      );
      form.reset();
      await settle(flat);
      assert(flat.value === "", "Form reset restores initial value");
      tree.value = "sg1500";
      await settle(tree);
      tree.show();
      await settle(tree);
      await new Promise(requestAnimationFrame);
      const trigger = tree
        .shadowRoot!.querySelector(".trigger")!
        .getBoundingClientRect();
      const panel = tree
        .shadowRoot!.querySelector(".panel")!
        .getBoundingClientRect();
      assert(
        Math.abs(trigger.width - panel.width) < 1,
        "Popup matches trigger width",
      );
      assert(panel.width > 0 && panel.height > 0, "Popup has visible geometry");
      assert(
        [...tree.shadowRoot!.querySelectorAll<SVGSVGElement>("svg")].length >
          0 &&
          [...tree.shadowRoot!.querySelectorAll<SVGSVGElement>("svg")].every(
            (svg) =>
              svg.querySelector("path[d]") &&
              svg.getBoundingClientRect().width > 0,
          ),
        "Shared icon SVGs render",
      );
      assert(
        tree.shadowRoot!.querySelector(".panel")!.scrollWidth <=
          panel.width + 1,
        "Long labels do not cause horizontal overflow",
      );
      tree.hide();
      await settle(tree);
      await settle(large);
      assert(
        large.shadowRoot!.querySelectorAll("[role=option]").length === 0,
        "关闭时 5000 项不生成选项 DOM",
      );
      large.show();
      await settle(large);
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      assert(
        large.shadowRoot!.querySelectorAll("[role=option]").length < 60,
        "打开时仅渲染视口附近的选项",
      );
      const navigate = async (el: ZoneDropdown, key: string) => {
        el.shadowRoot!.querySelector(".trigger")!.dispatchEvent(
          new KeyboardEvent("keydown", {
            key,
            code: key,
            bubbles: true,
            composed: true,
            cancelable: true,
          }),
        );
        await settle(el);
        await new Promise(requestAnimationFrame);
        await settle(el);
      };
      const pageScroll = window.scrollY;
      await navigate(large, "End");
      await new Promise(requestAnimationFrame);
      await settle(large);
      const active = large
        .shadowRoot!.querySelector(".trigger")!
        .getAttribute("aria-activedescendant");
      assert(
        large
          .shadowRoot!.getElementById(active!)
          ?.getAttribute("aria-label") === "Option 4999",
        "End 可定位未渲染的最后一项",
      );
      assert(
        window.scrollY === pageScroll,
        "键盘导航只滚动面板，不滚动外层页面",
      );
      await navigate(large, "Enter");
      assert(large.value === "large-4999", "虚拟列表可正确选择末项");
      large.show();
      await settle(large);
      await navigate(large, "Home");
      await new Promise(requestAnimationFrame);
      await settle(large);
      const visibleRows = [
        ...large.shadowRoot!.querySelectorAll<HTMLElement>(
          "[data-virtual-row]",
        ),
      ];
      assert(
        visibleRows.length > 0 &&
          visibleRows.some((row) => row.getBoundingClientRect().height > 48),
        "虚拟列表保留长文本的动态行高",
      );
      large.hide();
      await settle(large);
      dialog.open = true;
      await dialog.updateComplete;
      await new Promise(requestAnimationFrame);
      dialogDropdown.focus();
      dialogDropdown.show();
      await settle(dialogDropdown);
      await navigate(dialogDropdown, "Escape");
      assert(!dialogDropdown.open && dialog.open, "首次 Escape 只关闭下拉框");
      await navigate(dialogDropdown, "Escape");
      await dialog.updateComplete;
      assert(!dialog.open, "再次 Escape 关闭外层 Dialog");
      assert(
        document.documentElement.scrollWidth <= innerWidth,
        "Page has no horizontal overflow",
      );
      result.textContent = `${passed.length} passed: ${passed.join(" · ")}`;
    } catch (error) {
      result.textContent = `FAILED after ${passed.length}: ${String(error)}`;
    } finally {
      flat.value = initial.flat;
      accessory.value = initial.accessory;
      fieldset.disabled = initial.disabled;
      tree.value = "";
      large.hide();
      large.value = "";
      dialogDropdown.hide();
      dialog.open = false;
    }
  });
  document.querySelector<HTMLButtonElement>('#run-checks')!.disabled = false;
}

void initializeDemo();
