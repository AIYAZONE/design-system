import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { join } from "node:path";

vi.mock("@aiyazone/utils", () => {
  return {
    submit: (form: HTMLFormElement) => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    },
  };
});

import "../index";

function createButton(): HTMLElementTagNameMap["zone-button"] {
  const el = document.createElement("zone-button") as any;
  document.body.appendChild(el);
  return el as any;
}

async function getRoot(el: HTMLElementTagNameMap["zone-button"]) {
  // @ts-expect-error updateComplete is provided by LitElement
  if (el.updateComplete) await (el as any).updateComplete;
  return el.shadowRoot!;
}

const buttonStyleSource = readFileSync(join(process.cwd(), "src/components/button/index.less"), "utf8");

describe("zone-button", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("fires zone-click on click when not disabled/loading", async () => {
    const el = createButton();
    const clicked = vi.fn();
    el.addEventListener("zone-click", clicked);
    const root = await getRoot(el);
    const btn = root.querySelector("button")!;
    await userEvent.click(btn);
    await userEvent.click(btn);
    expect(clicked).toHaveBeenCalledTimes(2);
  });

  it("does not fire zone-click when disabled or loading", async () => {
    const el = createButton();
    el.setAttribute("disabled", "");
    const clicked = vi.fn();
    el.addEventListener("zone-click", clicked);
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

  it("orders icon before text when iconPosition=prev", async () => {
    const el = createButton();
    el.setAttribute("icon", "star-fill");
    el.setAttribute("iconPosition", "prev");
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

  it("uses default interaction and reflects shine interaction", async () => {
    const el = createButton() as any;
    await getRoot(el);
    expect(el.interaction).toBe("default");
    expect(el.getAttribute("interaction")).toBe("default");

    el.interaction = "shine";
    await getRoot(el);
    expect(el.getAttribute("interaction")).toBe("shine");
  });

  it("keeps primary button clickable when shine interaction is enabled", async () => {
    const el = createButton();
    el.setAttribute("interaction", "shine");
    const clicked = vi.fn();
    el.addEventListener("zone-click", clicked);
    const root = await getRoot(el);
    const btn = root.querySelector("button")!;
    await userEvent.click(btn);
    expect(clicked).toHaveBeenCalledTimes(1);
  });

  it("keeps inline icon mode by default", async () => {
    const el = createButton() as any;
    el.setAttribute("icon", "arrow-right-long");
    el.textContent = "SHOP NOW";
    const root = await getRoot(el);
    const btn = root.querySelector("button")!;
    expect(el.getAttribute("icon-mode")).toBe("inline");
    expect(btn.querySelector("slot[name='icon']")).toBeTruthy();
    expect(btn.querySelector(".capsule-icon")).toBeNull();
  });

  it("renders a decorative capsule icon internally when iconMode is capsule", async () => {
    const el = createButton() as any;
    el.setAttribute("icon", "arrow-right-long");
    el.setAttribute("icon-mode", "capsule");
    el.textContent = "SHOP NOW";
    const root = await getRoot(el);
    const btn = root.querySelector("button")!;
    const capsuleIcon = btn.querySelector(".capsule-icon");
    expect(el.getAttribute("icon-mode")).toBe("capsule");
    expect(root.querySelectorAll("button")).toHaveLength(1);
    expect(capsuleIcon).toBeTruthy();
    expect(capsuleIcon?.getAttribute("aria-hidden")).toBe("true");
    expect(btn.querySelector("slot[name='icon']")).toBeNull();
  });

  it("positions the capsule icon absolutely so hover does not expand button width", () => {
    expect(buttonStyleSource).toContain(".capsule-icon {");
    expect(buttonStyleSource).toContain("position: absolute;");
    expect(buttonStyleSource).toContain("right: var(--zone-btn-capsule-end-inset, 0px);");
    expect(buttonStyleSource).toContain("transform: translate3d(calc(100% + var(--zone-btn-capsule-gap, var(--zone-size-8))), -50%, 0) scale(0.6);");
  });

  it("shifts the label left when the capsule icon is revealed", () => {
    expect(buttonStyleSource).toContain(".button.has-capsule-icon .label");
    expect(buttonStyleSource).toContain("transform: translateX(calc(var(--zone-btn-capsule-shift, 0px) * -1));");
  });

  it("keeps the main button background unchanged on capsule hover", () => {
    expect(buttonStyleSource).toContain(":host([icon-mode=\"capsule\"]:hover:not([variant=\"secondary\"]):not([variant=\"text\"]):not([loading]):not([disabled])) .button.has-capsule-icon:not([aria-disabled=\"true\"]) {");
    expect(buttonStyleSource).toContain("background-color: var(--zone-btn-current-bg);");
    expect(buttonStyleSource).toContain("border-color: var(--zone-btn-current-border);");
  });

  it("keeps capsule spacing aligned with the legacy margin-left values", () => {
    expect(buttonStyleSource).toMatch(/:host\(\[size="extra"\]\) \.button \{[\s\S]*?--zone-btn-capsule-shift: var\(--zone-size-8\);/);
    expect(buttonStyleSource).toMatch(/:host\(\[size="large"\]\) \.button \{[\s\S]*?--zone-btn-capsule-shift: var\(--zone-size-8\);/);
    expect(buttonStyleSource).toMatch(/:host\(\[size="medium"\]\) \.button \{[\s\S]*?--zone-btn-capsule-shift: var\(--zone-size-8\);/);
    expect(buttonStyleSource).toMatch(/:host\(\[size="small"\]\) \.button \{[\s\S]*?--zone-btn-capsule-shift: var\(--zone-size-4\);/);
  });

  it("keeps the capsule icon parked inside the button using per-size end insets", () => {
    expect(buttonStyleSource).toMatch(/:host\(\[size="extra"\]\) \.button \{[\s\S]*?--zone-btn-capsule-end-inset: var\(--zone-size-8\);/);
    expect(buttonStyleSource).toMatch(/:host\(\[size="large"\]\) \.button \{[\s\S]*?--zone-btn-capsule-end-inset: var\(--zone-size-8\);/);
    expect(buttonStyleSource).toMatch(/:host\(\[size="medium"\]\) \.button \{[\s\S]*?--zone-btn-capsule-end-inset: var\(--zone-size-4\);/);
    expect(buttonStyleSource).toMatch(/:host\(\[size="small"\]\) \.button \{[\s\S]*?--zone-btn-capsule-end-inset: var\(--zone-size-2\);/);
  });

  it("does not rotate the shine carrier geometry anymore", () => {
    expect(buttonStyleSource).not.toContain("rotate(var(--zone-btn-shine-angle))");
  });

  it("uses a continuous linear sweep animation for shine", () => {
    expect(buttonStyleSource).toContain("linear infinite");
    expect(buttonStyleSource).toContain("animation: zone-button-shine var(--zone-btn-shine-duration, 3.8s) linear infinite;");
    expect(buttonStyleSource).not.toContain("14% {");
  });

  it("matches the shine gradient stops", () => {
    expect(buttonStyleSource).toContain("linear-gradient(283.37deg");
    expect(buttonStyleSource).toContain("rgba(254, 139, 45, 0) 11.45%");
    expect(buttonStyleSource).toContain("rgba(255, 152, 70, 1) 45.8%");
    expect(buttonStyleSource).toContain("rgba(255, 137, 44, 0) 86.76%");
  });

  it("adds a subtle halo layer without blurring the core stripe", () => {
    expect(buttonStyleSource).toContain("--zone-btn-shine-halo-gradient");
    expect(buttonStyleSource).toContain("rgba(255, 152, 70, 0.35) 45.8%");
    expect(buttonStyleSource).toContain("blur(var(--zone-btn-shine-blur, 0px))");
  });

  it("uses staggered shine layers to avoid any visible gap between loops", () => {
    expect(buttonStyleSource).toContain(".button::after");
    expect(buttonStyleSource).toContain(
      "animation-delay: calc(var(--zone-btn-shine-duration, 3.8s) / -2);",
    );
  });

  it("starts the incoming shine inside the button for a continuous handoff", () => {
    expect(buttonStyleSource).toContain("--zone-btn-shine-start-x: -45%");
    expect(buttonStyleSource).toContain("--zone-btn-shine-end-x: 140%");
    expect(buttonStyleSource).toContain("var(--zone-btn-shine-duration, 3.8s)");
  });

  it("extends the visible sweep window past 50% to guarantee a continuous loop", () => {
    expect(buttonStyleSource).toContain("58% {");
    expect(buttonStyleSource).toContain("72% {");
    expect(buttonStyleSource).toContain("72.01%");
  });

  it("eases the shine in with a short fade-in ramp", () => {
    expect(buttonStyleSource).toContain("0% {");
    expect(buttonStyleSource).toContain("opacity: 0;");
    expect(buttonStyleSource).toContain("12% {");
    expect(buttonStyleSource).toContain("opacity: var(--zone-btn-shine-opacity, 0.82);");
  });

  it("avoids an abrupt speed jump when the shine fades in", () => {
    expect(buttonStyleSource).toContain("+ 38%)");
  });
});
