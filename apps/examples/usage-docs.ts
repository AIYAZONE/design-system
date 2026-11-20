import { usageGuides, type UsageGuide } from "./usage-content";
import "./styles/usage-docs.less";

function node<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = "",
  text = "",
) {
  const element = document.createElement(tag);
  element.className = className;
  if (text) element.textContent = text;
  return element;
}
function section(id: string, title: string) {
  const root = node("section", "example-section usage-section");
  root.dataset.exampleDoc = id;
  const header = node("div", "example-section__heading");
  const heading = node("h2", "example-section__title", title);
  heading.id = id;
  header.append(heading);
  root.append(header);
  return root;
}
async function copy(
  text: string,
  feedback: HTMLOutputElement,
  target: HTMLElement,
) {
  try {
    if (!navigator.clipboard?.writeText)
      throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(text);
    feedback.textContent = "已复制，可粘贴到项目中。";
  } catch {
    const range = document.createRange();
    range.selectNodeContents(target);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    feedback.textContent = "未能自动复制，代码已选中，请手动复制。";
  }
}
function codeBlock(title: string, code: string, kind: string) {
  const root = node("div", "usage-code-block");
  const head = node("div", "usage-code-heading");
  head.append(node("h3", "", title));
  const button = node("button", "usage-copy", `复制 ${kind}`);
  button.type = "button";
  button.setAttribute("aria-label", `复制 ${kind} 代码`);
  const feedback = node("output", "usage-copy-feedback");
  feedback.setAttribute("role", "status");
  const pre = node("pre");
  const source = node("code", "", code.trim());
  source.dataset.codeKind = kind;
  pre.append(source);
  button.addEventListener("click", () => {
    void copy(code.trim(), feedback, source);
  });
  head.append(button);
  root.append(head, pre, feedback);
  return root;
}
export function getExampleSource(guide: UsageGuide, theme: string) {
  const cssFile =
    theme === "v2"
      ? "index-v2.css"
      : theme === "v3"
        ? "index-v3.css"
        : "index.css";
  const imports = ["initialize", ...(guide.imports ?? [])].join(", ");
  const js = `import { ${imports} } from '@aiyazone/design-system';\nimport '@aiyazone/design-system/${cssFile}';\n\ninitialize();${guide.js ? `\n\n${guide.js}` : ""}`;
  const css = `.demo-shell { max-width: 960px; margin: auto; padding: 24px; font: 16px/1.6 var(--zone-font-family, system-ui); }\n.demo-shell > * { max-width: 100%; }${guide.css ? `\n${guide.css}` : ""}`;
  const html = `<!doctype html>\n<html lang="${guide.lang ?? "zh-CN"}">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>AIYAZONE 使用示例</title>\n  <style>\n${css}\n  </style>\n</head>\n<body>\n<main class="demo-shell">\n${guide.html}\n</main>\n<script type="module">\n${js}\n</script>\n</body>\n</html>`;
  return { js, css, html };
}
export function mountUsageDocs(theme: string) {
  const main = document.querySelector<HTMLElement>("main.example-preview");
  const view = new URLSearchParams(location.search).get("view");
  if (
    !main ||
    document.body.hasAttribute("data-view") ||
    (location.pathname.endsWith("/atoms/dropdown.html") &&
      ["pc", "mb"].includes(view ?? ""))
  )
    return;
  const path = location.pathname.split("/pages/")[1];
  if (!path) return;
  const guide = usageGuides[path];
  if (!guide || main.querySelector("[data-example-doc]")) return;
  const source = getExampleSource(guide, theme);
  const intro = section("usage-intro", "使用指南");
  const jumps = node("nav", "usage-jumps");
  jumps.setAttribute("aria-label", "使用文档快捷入口");
  for (const [href, text] of [
    ["#usage-code", "查看代码 ↓"],
    ["#usage-demos", "查看演示 ↓"],
  ]) {
    const link = node("a", "", text);
    link.href = href;
    jumps.append(link);
  }
  intro.append(jumps);
  const when = node("div", "usage-when");
  when.append(node("h3", "", "何时使用"), node("p", "", guide.when));
  const choices = node("div", "usage-choices");
  choices.append(node("h3", "", "如何选择"));
  const list = node("dl");
  for (const [name, advice] of guide.choose) {
    const row = node("div");
    row.append(node("dt", "", name), node("dd", "", advice));
    list.append(row);
  }
  choices.append(list);
  intro.append(when, choices);
  const quick = section("usage-code", "可复制的代码");
  quick.append(
    node(
      "p",
      "usage-lede",
      "HTML 放入页面，JavaScript 放入项目入口；复制完整页可得到已配好当前组件主题的 HTML。",
    ),
  );
  const setup = node("details", "usage-details");
  setup.append(node("summary", "", "首次接入：安装、运行与版本"));
  setup.append(
    node(
      "p",
      "",
      "用于 Vite 等支持 npm 模块导入的项目。先安装组件包和 Lit，再用开发服务运行；下面的完整页不是可直接双击打开的 CDN 页面。",
    ),
  );
  setup.append(
    codeBlock("项目依赖", "pnpm add @aiyazone/design-system lit", "安装命令"),
  );
  setup.append(
    node(
      "p",
      "",
      "文档对应当前仓库构建。对外安装请使用已发布且包含所需功能的版本；V1/V2/V3 是组件主题，站点深浅色不影响复制结果。",
    ),
  );
  const setupLink = node("a", "", "查看接入与版本说明 →");
  setupLink.href =
    "https://github.com/AIYAZONE/design-system/blob/master/docs/usage.md";
  setup.append(setupLink);
  quick.append(setup, codeBlock("HTML · 页面内容", guide.html, "HTML"));
  const jsDetails = node("details", "usage-details");
  jsDetails.append(
    node("summary", "", "JavaScript · 初始化与交互（必需）"),
    codeBlock("src/main.js", source.js, "JavaScript"),
  );
  quick.append(jsDetails);
  if (guide.css) quick.append(codeBlock("CSS · 布局样式", guide.css, "CSS"));
  const complete = node("details", "usage-details");
  complete.append(node("summary", "", "完整 HTML 页 · 包含初始化与当前主题"));
  complete.append(
    codeBlock(`完整 HTML · ${theme.toUpperCase()}`, source.html, "完整 HTML"),
  );
  quick.append(complete);
  const notes = section("usage-notes", "注意事项");
  const ul = node("ul", "usage-notes");
  for (const text of guide.notes) ul.append(node("li", "", text));
  notes.append(ul);
  if (guide.api) {
    const link = node("a", "usage-api", "查看属性、事件与方法 →");
    link.href = `/storybook/?path=${encodeURIComponent(`/docs/03-基础组件-${guide.api}--document`)}`;
    notes.append(link);
  }
  const demoLabel = node(
    "p",
    "usage-demo-label",
    "交互与状态演示 · 原有场景完整保留",
  );
  demoLabel.id = "usage-demos";
  main.prepend(intro, quick, demoLabel);
  main.append(notes);
}
