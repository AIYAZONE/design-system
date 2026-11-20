import type {
  ZoneDropdown,
  ZoneFilterSelect,
  ZoneDialog,
} from "@aiyazone/design-system";

function mount() {
  const options = [
    { value: "standard", label: "标准配送" },
    { value: "unavailable", label: "暂不可用的配送方式", disabled: true },
    { value: "express", label: "加急配送：工作日优先送达，并发送配送通知" },
    ...Array.from({ length: 16 }, (_, index) => ({
      value: `service-${index}`,
      label: `附加服务 ${index + 1}：配送进度与签收确认`,
    })),
  ];
  document.querySelector<ZoneDropdown>("#refined-dropdown")!.options = options;
  document.querySelector<ZoneFilterSelect>("#refined-filter")!.options =
    options;
  for (const id of ["popover-copy", "dialog-copy"]) {
    const root = document.getElementById(id)!;
    for (let index = 0; index < 14; index++) {
      const paragraph = document.createElement("p");
      paragraph.textContent = `${index + 1}. 配送说明：确认收件信息，检查服务范围，再保存通知偏好。LongUnbrokenIdentifierWithoutSpacesForContentWrapping。`;
      root.append(paragraph);
    }
  }
  const dialog = document.querySelector<ZoneDialog>("#refined-dialog")!;
  document.getElementById("dialog-trigger")!.addEventListener("click", () => {
    dialog.open = true;
  });
  document.getElementById("dialog-confirm")!.addEventListener("click", () => {
    dialog.open = false;
  });
}
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", mount, { once: true });
else mount();
