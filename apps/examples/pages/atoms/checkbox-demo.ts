import type { ZoneCheckbox } from "@aiyazone/design-system";
function mount() {
  const form = document.querySelector<HTMLFormElement>("#checkbox-form")!;
  const fieldset =
    document.querySelector<HTMLFieldSetElement>("#checkbox-fieldset")!;
  const output = document.querySelector<HTMLElement>("#checkbox-result")!;
  const show = () => {
    output.textContent = JSON.stringify(
      [...new FormData(form).entries()],
      null,
      2,
    );
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    show();
  });
  form.addEventListener("change", show);
  form.addEventListener("reset", () => {
    void Promise.all(
      [...form.querySelectorAll<ZoneCheckbox>("zone-checkbox")].map(
        (el) => el.updateComplete,
      ),
    ).then(show);
  });
  document.querySelector("#checkbox-disable")!.addEventListener("click", () => {
    fieldset.disabled = !fieldset.disabled;
    queueMicrotask(show);
  });
}
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", mount, { once: true });
else mount();
