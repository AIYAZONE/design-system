import { afterEach, describe, expect, it } from "vitest";
import "../../button";
import "../index";
import type { ZoneButton } from "../../button";
import type { ZoneToast } from "../index";

async function settle(toast: ZoneToast) {
  await toast.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
  await Promise.all(
    [...toast.querySelectorAll<ZoneButton>("zone-button")].map(
      (b) => b.updateComplete,
    ),
  );
}

afterEach(() => document.body.replaceChildren());

describe("Toast action defaults", () => {
  it("applies medium primary/secondary actions to buttons already upgraded before Toast", async () => {
    const primary = document.createElement("zone-button") as ZoneButton;
    const secondary = document.createElement("zone-button") as ZoneButton;
    primary.slot = "action";
    secondary.slot = "action-secondary";
    document.body.append(primary, secondary);
    await Promise.all([primary.updateComplete, secondary.updateComplete]);
    expect(secondary.getAttribute("variant")).toBe("primary");
    const toast = document.createElement("zone-toast") as ZoneToast;
    toast.append(primary, secondary);
    document.body.append(toast);
    await settle(toast);
    expect([primary.variant, secondary.variant]).toEqual([
      "primary",
      "secondary",
    ]);
    expect([primary.size, secondary.size]).toEqual(["medium", "medium"]);
    expect([primary.kind, secondary.kind]).toEqual(["neutral", "neutral"]);
  });

  it("preserves explicit attributes even when they match standalone defaults", async () => {
    document.body.innerHTML =
      '<zone-toast><zone-button slot="action-secondary" variant="primary" kind="default" size="large">Keep choices</zone-button></zone-toast>';
    const toast = document.querySelector("zone-toast") as ZoneToast;
    await settle(toast);
    const button = toast.querySelector("zone-button") as ZoneButton;
    expect([button.variant, button.kind, button.size]).toEqual([
      "primary",
      "default",
      "large",
    ]);
  });

  it("preserves property configuration, including explicit default values", async () => {
    const button = document.createElement("zone-button") as ZoneButton;
    button.variant = "primary";
    button.kind = "default";
    button.size = "large";
    button.slot = "action-secondary";
    const toast = document.createElement("zone-toast") as ZoneToast;
    toast.append(button);
    document.body.append(toast);
    await settle(toast);
    expect([button.variant, button.kind, button.size]).toEqual([
      "primary",
      "default",
      "large",
    ]);
  });

  it("updates implicit defaults when semantic state or action slot changes", async () => {
    document.body.innerHTML =
      '<zone-toast variant="success"><zone-button slot="action">Continue</zone-button></zone-toast>';
    const toast = document.querySelector("zone-toast") as ZoneToast;
    await settle(toast);
    const button = toast.querySelector("zone-button") as ZoneButton;
    expect(button.kind).toBe("success");
    toast.variant = "danger";
    button.slot = "action-secondary";
    await settle(toast);
    expect([button.variant, button.kind]).toEqual(["secondary", "danger"]);
    button.variant = "text";
    toast.variant = "info";
    await settle(toast);
    expect([button.variant, button.kind]).toEqual(["text", "neutral"]);
  });
});
