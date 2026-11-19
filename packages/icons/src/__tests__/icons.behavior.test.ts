// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import ZoneIcon from "../components";
import "../components";
afterEach(() => {
  document.body.replaceChildren();
});
it("reports unknown icons without leaving a rejected load promise", async () => {
  const icon = document.createElement("zone-icon") as ZoneIcon;
  const error = vi.fn();
  icon.addEventListener("zone-error", error);
  document.body.append(icon);
  icon.name = "missing-contract-icon";
  await icon.load();
  await icon.updateComplete;
  expect(error).toHaveBeenCalled();
  expect(icon.shadowRoot?.querySelector("svg")).toBeNull();
});
it("keeps the most recent icon when requested names change quickly", async () => {
  const icon = document.createElement("zone-icon") as ZoneIcon;
  document.body.append(icon);
  icon.name = "arrow-right";
  const first = icon.load();
  icon.name = "close";
  const latest = icon.load();
  await Promise.all([first, latest]);
  await icon.updateComplete;
  expect(icon.name).toBe("close");
  expect(icon.shadowRoot?.querySelector("svg")).toBeTruthy();
  icon.name = "missing-contract-icon";
  await icon.load();
  await icon.updateComplete;
  expect(icon.shadowRoot?.querySelector("svg")).toBeNull();
});
