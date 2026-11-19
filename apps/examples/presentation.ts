import { exampleGroups } from "./navigation";

/** Shared document chrome. Components and specimen typography keep their theme. */
export function mountPresentation(theme: string) {
  const main = document.querySelector<HTMLElement>("main.example-preview");
  const preview = new URLSearchParams(location.search).get("view");
  if (
    !main ||
    document.body.hasAttribute("data-view") ||
    (location.pathname.endsWith("/atoms/dropdown.html") &&
      ["pc", "mb"].includes(preview ?? ""))
  )
    return;
  const container = document.querySelector<HTMLElement>(".container")!;
  const workspace = document.querySelector<HTMLElement>(".examples-workspace")!;
  const base = location.pathname.startsWith("/examples/") ? "/examples/" : "/";
  const suffix = location.pathname.split("/pages/")[1];
  const sidebar = document.createElement("aside");
  sidebar.className = "examples-sidebar";
  const menu = document.createElement("details");
  menu.className = "examples-navigation";
  menu.open = matchMedia("(min-width: 1100px)").matches;
  const summary = document.createElement("summary");
  summary.textContent = "浏览示例";
  menu.append(summary);
  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "示例页面");
  for (const group of exampleGroups) {
    const label = document.createElement("p");
    label.className = "examples-nav-label";
    label.textContent = group.title;
    nav.append(label);
    for (const [path, name, english] of group.items) {
      const a = document.createElement("a");
      a.href = `${base}pages/${path}?theme=${theme}`;
      const text = document.createElement("span");
      text.textContent = name;
      const sub = document.createElement("small");
      sub.textContent = english;
      a.append(text, sub);
      if (suffix === path) a.setAttribute("aria-current", "page");
      nav.append(a);
    }
  }
  menu.append(nav);
  sidebar.append(menu);
  container.prepend(sidebar);
  const item = exampleGroups
    .flatMap((group) => group.items)
    .find(([path]) => path === suffix);
  const title = document.querySelector(".header .content");
  if (title && item) {
    const eyebrow = document.createElement("p");
    eyebrow.className = "examples-eyebrow";
    eyebrow.textContent = item[2];
    title.prepend(eyebrow);
  }
  const headings = [
    ...main.querySelectorAll<HTMLElement>(".example-section__title"),
  ];
  if (suffix === "components/rte.html") {
    main.querySelectorAll<HTMLElement>(".zone-rte > h3").forEach((heading, index) => {
      if (heading.closest("zone-dialog")) return;
      if (!heading.id) heading.id = `rte-section-${index + 1}`;
      heading.classList.add("example-anchor");
      headings.push(heading);
    });
  }
  if (headings.length) {
    const toc = document.createElement("aside");
    toc.className = "examples-toc";
    const details = document.createElement("details");
    details.open = matchMedia("(min-width: 1360px)").matches;
    const summary = document.createElement("summary");
    summary.textContent = "本页内容";
    details.append(summary);
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "本页内容");
    headings.forEach((heading) => {
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      link.addEventListener("click", () => {
        if (innerWidth < 1360) details.open = false;
      });
      nav.append(link);
    });
    details.append(nav);
    toc.append(details);
    container.append(toc);
    const tocMedia = matchMedia("(min-width: 1360px)");
    const resizeToc = () => {
      details.open = tocMedia.matches;
    };
    tocMedia.addEventListener("change", resizeToc);
    addEventListener(
      "pagehide",
      () => tocMedia.removeEventListener("change", resizeToc),
      { once: true },
    );
    const activate = (id: string) =>
      nav.querySelectorAll("a").forEach((link) => {
        if (link.hash === `#${id}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) activate(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0 },
    );
    headings.forEach((heading) => observer.observe(heading));
    activate(location.hash.slice(1) || headings[0].id);
    addEventListener("pagehide", () => observer.disconnect(), { once: true });
  }
  workspace
    .querySelectorAll<HTMLButtonElement>("[data-replay-toast]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        const toast = workspace.querySelector<HTMLElement & { open(): void }>(
          `#${button.dataset.replayToast}`,
        );
        toast?.open();
      }),
    );
  workspace
    .querySelectorAll<HTMLElement>("[data-demo-dropdown]")
    .forEach((element) => {
      (element as HTMLElement & { options: unknown[] }).options = [
        { value: "standard", label: "标准配送" },
        { value: "express", label: "加急配送" },
      ];
    });
  workspace
    .querySelectorAll<HTMLElement>("[data-demo-filter]")
    .forEach((element) => {
      (element as HTMLElement & { options: unknown[] }).options = [
        { value: "solar", label: "太阳能板" },
        { value: "battery", label: "便携电源" },
      ];
    });
  const media = matchMedia("(min-width: 1100px)");
  const resize = () => {
    menu.open = media.matches;
  };
  media.addEventListener("change", resize);
  addEventListener(
    "pagehide",
    () => media.removeEventListener("change", resize),
    { once: true },
  );
}
