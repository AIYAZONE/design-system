import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";

vi.mock("@jackery/utils", () => {
  return {
    submit: (form: HTMLFormElement) => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    },
  };
});

import "../index";

function createButton(): HTMLElementTagNameMap["jds-button"] {
  const el = document.createElement("jds-button") as any;
  document.body.appendChild(el);
  return el as any;
}

async function getRoot(el: HTMLElementTagNameMap["jds-button"]) {
  // @ts-expect-error updateComplete is provided by LitElement
  if (el.updateComplete) await (el as any).updateComplete;
  return el.shadowRoot!;
}

describe("jds-button", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("fires jds-click on click when not disabled/loading", async () => {
    const el = createButton();
    const clicked = vi.fn();
    el.addEventListener("jds-click", clicked);
    const root = await getRoot(el);
    const btn = root.querySelector("button")!;
    await userEvent.click(btn);
    await userEvent.click(btn);
    expect(clicked).toHaveBeenCalledTimes(2);
  });

  it("does not fire jds-click when disabled or loading", async () => {
    const el = createButton();
    el.setAttribute("disabled", "");
    const clicked = vi.fn();
    el.addEventListener("jds-click", clicked);
    await getRoot(el);
    const root = await getRoot(el);
    const btn = root.querySelector("button")!;
    await userEvent.click(btn);
    expect(clicked).toHaveBeenCalledTimes(0);
  });

  it("renders anchor when href is set with target _blank", async () => {
    const el = createButton();
    el.setAttribute("href", "/docs");
    el.setAttribute("target", "_blank");
    const root = await getRoot(el);
    const anchor = root.querySelector("a")!;
    expect(anchor).toBeTruthy();
    expect(anchor.getAttribute("role")).toBe("button");
    expect(anchor.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("submits form when type=submit", async () => {
    const form = document.createElement("form");
    form.id = "test-form";
    document.body.appendChild(form);
    const submitSpy = vi.fn((e: Event) => e.preventDefault());
    form.addEventListener("submit", submitSpy);

    const el = createButton();
    el.setAttribute("type", "submit");
    // associate by nearest ancestor
    form.appendChild(el);
    const root = await getRoot(el);
    const btn = root.querySelector("button")!;
    await userEvent.click(btn);
    expect(submitSpy).toHaveBeenCalledTimes(1);
  });

  it("orders icon before text when iconPosition=start", async () => {
    const el = createButton();
    el.setAttribute("icon", "star-fill");
    el.setAttribute("iconPosition", "start");
    el.textContent = "Label";
    const root = await getRoot(el);
    const button = root.querySelector("button") || root.querySelector("a")!;
    const elements = Array.from(button.childNodes).filter((n) => n.nodeType === Node.ELEMENT_NODE) as Element[];
    const iconSlotIndex = elements.findIndex((n) => n.tagName.toLowerCase() === "slot" && n.getAttribute("name") === "icon");
    const labelIndex = elements.findIndex((n) => n.tagName.toLowerCase() === "span" && n.classList.contains("label"));
    expect(iconSlotIndex).toBeGreaterThan(-1);
    expect(labelIndex).toBeGreaterThan(-1);
    expect(iconSlotIndex).toBeLessThan(labelIndex);
  });
});
