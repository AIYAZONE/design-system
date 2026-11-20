import type {
  ZoneDropdown,
  ZoneFilterSelect,
  ZoneDialog,
  ZoneToast,
  ZoneBadge,
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
  const form = document.querySelector<HTMLFormElement>("#composition-form")!;
  const shipping = document.querySelector<ZoneDropdown>(
    "#composition-shipping",
  )!;
  shipping.options = options.slice(0, 3);
  const services = document.querySelector<ZoneFilterSelect>(
    "#composition-services",
  )!;
  services.options = [
    { value: "gift", label: "礼品包装" },
    { value: "tracking", label: "配送进度提醒" },
    { value: "contact", label: "送达前联系" },
  ];
  const confirm = document.querySelector<ZoneDialog>("#composition-dialog")!;
  const result = document.querySelector<ZoneToast>("#composition-result")!;
  const state = document.querySelector<ZoneBadge>("#composition-state")!;
  const feedback = document.getElementById("composition-feedback")!;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    confirm.open = true;
  });
  document
    .getElementById("composition-cancel")!
    .addEventListener("click", () => {
      confirm.open = false;
    });
  document
    .getElementById("composition-confirm")!
    .addEventListener("click", () => {
      confirm.open = false;
      const selected = options.find(
        (option) => option.value === new FormData(form).get("shipping"),
      );
      document.getElementById("composition-summary")!.textContent =
        `${selected?.label ?? "标准配送"}，已选择 ${services.value.length} 项附加服务。`;
      state.kind = "success";
      state.textContent = "已保存";
      feedback.textContent = "演示：偏好已更新，可以查看记录或撤销。";
      result.open();
    });
  form.addEventListener("reset", () => {
    services.value = [];
    state.kind = "neutral";
    state.textContent = "待保存";
    result.close();
    feedback.textContent = "演示：已恢复初始偏好。";
  });
  document.getElementById("composition-undo")!.addEventListener("click", () => {
    form.reset();
  });
  document
    .getElementById("composition-record")!
    .addEventListener("click", () => {
      feedback.textContent = `演示记录：${document.getElementById("composition-summary")!.textContent}`;
    });
}
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", mount, { once: true });
else mount();
