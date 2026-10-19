import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getCurrLanguage, setCurrLanguage } from "@jackery/i18n";

import { waitUpdate } from "../../../../test/utils";
import "../index";

const OPTIONS = [
  { value: "a", label: "Solar Panels" },
  { value: "b", label: "SG1500(2*100W)" },
];

type ExpectedTexts = {
  label: string;
  counter: string;
  clear: string;
  confirm: string;
  empty: string;
  summary: (count: number) => string;
};

const EXPECTED: Record<string, ExpectedTexts> = {
  en: {
    label: "Filter Parameters",
    counter: "Selected",
    clear: "Clear",
    confirm: "Confirm",
    empty: "No Options",
    summary: (count) => `${count} Filters Selected`,
  },
  de: {
    label: "Filterparameter",
    counter: "Ausgewählt",
    clear: "Zurücksetzen",
    confirm: "Bestätigen",
    empty: "Keine Optionen",
    summary: (count) => `${count} Filter ausgewählt`,
  },
  jp: {
    label: "絞り込み条件",
    counter: "選択中",
    clear: "クリア",
    confirm: "確定",
    empty: "選択肢がありません",
    summary: (count) => `${count}件の条件を選択中`,
  },
  fr: {
    label: "Paramètres de filtre",
    counter: "Sélectionné",
    clear: "Effacer",
    confirm: "Confirmer",
    empty: "Aucune option",
    summary: (count) => `${count} filtres sélectionnés`,
  },
  es: {
    label: "Parámetros de filtro",
    counter: "Seleccionado",
    clear: "Vaciar",
    confirm: "Confirmar",
    empty: "Sin opciones",
    summary: (count) => `${count} filtros seleccionados`,
  },
  nl: {
    label: "Filterparameters",
    counter: "Geselecteerd",
    clear: "Wissen",
    confirm: "Bevestigen",
    empty: "Geen opties",
    summary: (count) => `${count} filters geselecteerd`,
  },
  ko: {
    label: "필터 조건",
    counter: "선택됨",
    clear: "초기화",
    confirm: "확인",
    empty: "옵션 없음",
    summary: (count) => `${count}개 필터 선택됨`,
  },
  "zh-CN": {
    label: "筛选参数",
    counter: "已选",
    clear: "清空",
    confirm: "确定",
    empty: "暂无选项",
    summary: (count) => `已选择筛选${count}个参数`,
  },
  "zh-TW": {
    label: "篩選參數",
    counter: "已選",
    clear: "清空",
    confirm: "確定",
    empty: "暫無選項",
    summary: (count) => `已選擇篩選${count}個參數`,
  },
};

function q(root: ParentNode, selector: string): HTMLElement {
  return root.querySelector(selector) as HTMLElement;
}

async function setup(props: Record<string, unknown> = {}) {
  const el = document.createElement("jds-filter-select") as any;
  Object.assign(el, props);
  document.body.appendChild(el);
  const root = await waitUpdate(el);
  return { el, root };
}

async function open(el: any) {
  el.show();
  await waitUpdate(el);
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("jds-filter-select i18n", () => {
  const initialLanguage = getCurrLanguage();

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    document.body.innerHTML = "";
    if (getCurrLanguage() !== initialLanguage) setCurrLanguage(initialLanguage);
  });

  it.each(Object.keys(EXPECTED))("renders built-in texts in %s", async (lang) => {
    setCurrLanguage(lang as any);
    const expected = EXPECTED[lang];

    const { el, root } = await setup({ options: OPTIONS, value: ["a"] });

    // 触发器：未选中 → label；已选中 → 汇总文案
    expect(q(root, ".trigger__text").textContent?.trim()).toBe(expected.summary(1));

    await open(el);

    expect(q(root, ".counter__label").textContent?.trim()).toBe(expected.counter);
    expect(q(root, ".clear").textContent?.trim()).toBe(expected.clear);
    expect(q(root, ".confirm").textContent?.trim()).toBe(expected.confirm);
  });

  it.each(["en", "de", "jp", "fr", "es", "nl", "ko", "zh-CN", "zh-TW"])(
    "supports %s as a language code",
    async (lang) => {
      setCurrLanguage(lang as any);
      expect(getCurrLanguage()).toBe(lang);
    }
  );

  it("treats jp as an alias of ja", async () => {
    setCurrLanguage("jp");
    const { el, root } = await setup({ options: OPTIONS });
    await open(el);

    setCurrLanguage("ja");
    await waitUpdate(el);

    const jaLabel = q(root, ".confirm").textContent?.trim();

    setCurrLanguage("jp");
    await waitUpdate(el);

    expect(q(root, ".confirm").textContent?.trim()).toBe(jaLabel);
  });

  it("updates a live element when the language changes", async () => {
    setCurrLanguage("en");
    const { el, root } = await setup({ options: OPTIONS });
    await open(el);
    expect(q(root, ".confirm").textContent?.trim()).toBe("Confirm");

    setCurrLanguage("de");
    await waitUpdate(el);
    expect(q(root, ".confirm").textContent?.trim()).toBe("Bestätigen");
    expect(q(root, ".clear").textContent?.trim()).toBe("Zurücksetzen");
    expect(q(root, ".trigger__text").textContent?.trim()).toBe("Filterparameter");

    setCurrLanguage("nl");
    await waitUpdate(el);
    expect(q(root, ".confirm").textContent?.trim()).toBe("Bevestigen");
    expect(q(root, ".trigger__text").textContent?.trim()).toBe("Filterparameters");
  });

  it("re-renders the selection summary in the new language", async () => {
    setCurrLanguage("en");
    const { el, root } = await setup({ options: OPTIONS, value: ["a", "b"] });
    await waitUpdate(el);
    expect(q(root, ".trigger__text").textContent?.trim()).toBe("2 Filters Selected");

    setCurrLanguage("fr");
    await waitUpdate(el);
    expect(q(root, ".trigger__text").textContent?.trim()).toBe("2 filtres sélectionnés");
  });

  it("renders the empty state in the current language", async () => {
    setCurrLanguage("es");
    const { el, root } = await setup({ options: [] });
    await open(el);

    expect(q(root, ".empty").textContent?.trim()).toBe("Sin opciones");
  });

  it("lets explicit props override the built-in texts", async () => {
    setCurrLanguage("de");
    const { el, root } = await setup({
      options: OPTIONS,
      label: "产品类型",
      clearText: "重置",
      confirmText: "应用",
      selectedText: "已选",
      emptyText: "无数据",
    });
    await open(el);

    expect(q(root, ".clear").textContent?.trim()).toBe("重置");
    expect(q(root, ".confirm").textContent?.trim()).toBe("应用");
    expect(q(root, ".counter__label").textContent?.trim()).toBe("已选");

    el.clearText = undefined;
    el.confirmText = undefined;
    await waitUpdate(el);

    // 属性被清空后重新回退到内置多语言
    expect(q(root, ".clear").textContent?.trim()).toBe("Zurücksetzen");
    expect(q(root, ".confirm").textContent?.trim()).toBe("Bestätigen");
  });
});
