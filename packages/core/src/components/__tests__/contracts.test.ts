import { afterEach, describe, expect, it, vi } from "vitest";
import "../button";
import "../checkbox";
import "../dialog";
import "../popover";
import "../tooltip";
import "../toast";
import "../spinner";
import "../badge";
import "../filter-select";

async function create(tag: string, content = "") {
  const el = document.createElement(tag) as any;
  el.innerHTML = content;
  document.body.append(el);
  await el.updateComplete;
  return el;
}
afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.lang = "";
  vi.useRealTimers();
});

describe("component contracts", () => {
  it("resets the associated outer form and leaves links as links", async () => {
    const form = document.createElement("form");
    form.id = "contract-form";
    form.innerHTML = '<input name="name" value="initial">';
    document.body.append(form);
    const input = form.querySelector("input")!;
    input.value = "edited";
    const button = await create("zone-button", "Reset");
    button.type = "reset";
    button.form = form.id;
    await button.updateComplete;
    button.shadowRoot.querySelector("button").click();
    expect(input.value).toBe("initial");
    button.href = "#example";
    await button.updateComplete;
    expect(
      button.shadowRoot.querySelector("a").getAttribute("role"),
    ).toBeNull();
  });
  it("bridges checkbox value, disabled fieldsets and reset to form internals", async () => {
    const checkbox = document.createElement("zone-checkbox") as any;
    const setFormValue = vi.fn();
    checkbox._internals = { setFormValue, form: null };
    checkbox.checked = true;
    checkbox.value = "gift";
    document.body.append(checkbox);
    await checkbox.updateComplete;
    expect(setFormValue).toHaveBeenLastCalledWith("gift", "true");
    checkbox.formDisabledCallback(true);
    await checkbox.updateComplete;
    expect(setFormValue).toHaveBeenLastCalledWith(null, "true");
    expect(checkbox.shadowRoot.querySelector("input").disabled).toBe(true);
    checkbox.formDisabledCallback(false);
    checkbox.checked = false;
    await checkbox.updateComplete;
    checkbox.formResetCallback();
    await checkbox.updateComplete;
    expect(checkbox.checked).toBe(true);
  });
  it("rebinds popover element targets and releases target and global listeners on detach", async () => {
    const first = document.createElement("button");
    const second = document.createElement("button");
    document.body.append(first, second);
    const popover = await create("zone-popover", "Content");
    popover.target = first;
    await popover.updateComplete;
    first.click();
    expect(popover.visible).toBe(true);
    popover.hide();
    popover.target = second;
    await popover.updateComplete;
    first.click();
    expect(popover.visible).toBe(false);
    second.click();
    expect(popover.visible).toBe(true);
    popover.remove();
    expect(popover.visible).toBe(false);
    expect(second.hasAttribute("aria-expanded")).toBe(false);
    first.remove();
    second.remove();
  });
  it("provides a resolvable tooltip description without consuming the trigger action", async () => {
    const tooltip = await create(
      "zone-tooltip",
      '<button slot="tooltip-trigger">Help</button>Delivery takes two days',
    );
    await Promise.resolve();
    const trigger = tooltip.querySelector("button");
    const id = trigger.getAttribute("aria-describedby");
    expect(id).toBeTruthy();
    expect(document.getElementById(id)?.textContent).toContain("Delivery");
    const touch = new Event("touchend", { bubbles: true, cancelable: true });
    trigger.dispatchEvent(touch);
    expect(touch.defaultPrevented).toBe(false);
    tooltip.show();
    expect(tooltip.visible).toBe(true);
    tooltip.remove();
    expect(document.getElementById(id)).toBeNull();
  });
  it("restarts toast countdown and clears all timers after closing", async () => {
    vi.useFakeTimers();
    const toast = await create("zone-toast", "Saved");
    toast.countdownTime = 2;
    await toast.updateComplete;
    vi.advanceTimersByTime(2000);
    await toast.updateComplete;
    expect(toast.closed).toBe(true);
    expect(toast.countdownTime).toBe(2);
    expect(vi.getTimerCount()).toBe(0);
    toast.open();
    await toast.updateComplete;
    vi.advanceTimersByTime(1000);
    expect(toast.closed).toBe(false);
    toast.close();
    await toast.updateComplete;
    expect(vi.getTimerCount()).toBe(0);
  });
  it("keeps arbitrary toast action content and explicit button choices intact", async () => {
    const toast = await create(
      "zone-toast",
      '<a slot="action" href="#undo">Undo</a><zone-button slot="action-secondary" kind="danger" icon="check">Retry</zone-button>',
    );
    await Promise.resolve();
    await toast.updateComplete;
    expect(toast.querySelector("a")).toBeTruthy();
    expect(toast.querySelector("zone-button").getAttribute("kind")).toBe(
      "danger",
    );
    expect(toast.querySelector("zone-button").getAttribute("icon")).toBe(
      "check",
    );
    expect(toast.shadowRoot.querySelector('[role="status"]')).toBeTruthy();
  });
  it("closes dialog once, escapes caption markup and restores original background inertness", async () => {
    const background = document.createElement("button");
    document.body.append(background);
    const dialog = await create("zone-dialog", "<button>Confirm</button>");
    dialog.caption = "<img src=x onerror=alert(1)>";
    dialog.open = true;
    await dialog.updateComplete;
    expect(background.hasAttribute("inert")).toBe(true);
    expect(dialog.shadowRoot.querySelector("h2 img")).toBeNull();
    const close = vi.fn();
    dialog.addEventListener("zone-dialog-close", close);
    dialog.shadowRoot.querySelector('[part="dialog-close"]').click();
    await dialog.updateComplete;
    expect(close).toHaveBeenCalledTimes(1);
    expect(close.mock.calls[0][0].detail.reason).toBe("close-button");
    expect(background.hasAttribute("inert")).toBe(false);
  });
  it("keeps only the top dialog active and restores a previously inert sibling", async () => {
    const background = document.createElement("div");
    background.setAttribute("inert", "");
    document.body.append(background);
    const first = await create("zone-dialog", "First");
    first.open = true;
    await first.updateComplete;
    const second = await create("zone-dialog", "Second");
    second.open = true;
    await second.updateComplete;
    expect(first.hasAttribute("inert")).toBe(true);
    expect(second.hasAttribute("inert")).toBe(false);
    second.open = false;
    await second.updateComplete;
    expect(first.hasAttribute("inert")).toBe(false);
    first.open = false;
    await first.updateComplete;
    expect(background.hasAttribute("inert")).toBe(true);
  });
  it("distinguishes decorative and standalone loading announcements", async () => {
    const spinner = await create("zone-spinner");
    expect(spinner.shadowRoot.querySelector('[role="status"]')).toBeNull();
    spinner.label = "Loading orders";
    await spinner.updateComplete;
    expect(
      spinner.shadowRoot
        .querySelector('[role="status"]')
        .getAttribute("aria-label"),
    ).toBe("Loading orders");
  });
  it("updates count labels with page language and accepts a business label", async () => {
    document.documentElement.lang = "en";
    const badge = await create("zone-badge");
    badge.count = 3;
    await badge.updateComplete;
    expect(
      badge.shadowRoot.querySelector(".badge").getAttribute("aria-label"),
    ).toBe("Count：3");
    badge.ariaLabelText = "3 unread messages";
    await badge.updateComplete;
    expect(
      badge.shadowRoot.querySelector(".badge").getAttribute("aria-label"),
    ).toBe("3 unread messages");
  });
  it("accepts documented attributes and retains legacy HTML spellings", async () => {
    const button = await create("zone-button", "Previous");
    button.setAttribute("icon-position", "prev");
    await button.updateComplete;
    expect(button.iconPosition).toBe("prev");
    button.setAttribute("iconposition", "next");
    await button.updateComplete;
    expect(button.iconPosition).toBe("next");
    const badge = await create("zone-badge");
    badge.setAttribute("maxcount", "9");
    await badge.updateComplete;
    expect(badge.maxCount).toBe(9);
    const dialog = await create("zone-dialog");
    dialog.setAttribute("aria-label-text", "Edit details");
    await dialog.updateComplete;
    expect(dialog.ariaLabelText).toBe("Edit details");
    const toast = await create("zone-toast", "Saved");
    toast.setAttribute("countdown-time", "5");
    await toast.updateComplete;
    expect(toast.countdownTime).toBe(5);
    toast.removeAttribute("countdown-time");
    toast.setAttribute("countdowntime", "3");
    await toast.updateComplete;
    expect(toast.countdownTime).toBe(3);
  });
  it("keeps nested popover Escape dismissal limited to the top layer", async () => {
    const first = document.createElement("button");
    const second = document.createElement("button");
    document.body.append(first, second);
    const outer = await create("zone-popover");
    outer.target = first;
    outer.show();
    await outer.updateComplete;
    const inner = await create("zone-popover");
    inner.target = second;
    inner.show();
    await inner.updateComplete;
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(inner.visible).toBe(false);
    expect(outer.visible).toBe(true);
    first.remove();
    second.remove();
  });
  it("keeps filter-select externally controlled open and disabled state consistent", async () => {
    const select = await create("zone-filter-select");
    select.options = [{ value: "a", label: "A" }];
    select.open = true;
    await select.updateComplete;
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(select.open).toBe(false);
    select.open = true;
    await select.updateComplete;
    select.disabled = true;
    await select.updateComplete;
    await select.updateComplete;
    expect(select.open).toBe(false);
  });
});
