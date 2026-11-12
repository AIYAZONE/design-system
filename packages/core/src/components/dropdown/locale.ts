import { getCurrLanguage } from "@aiyazone/i18n";
import en from "../../../../i18n/src/locales/en.json";
import ja from "../../../../i18n/src/locales/ja.json";
import de from "../../../../i18n/src/locales/de.json";
import it from "../../../../i18n/src/locales/it.json";
import fr from "../../../../i18n/src/locales/fr.json";
import es from "../../../../i18n/src/locales/es.json";
import ko from "../../../../i18n/src/locales/ko.json";
import zhCN from "../../../../i18n/src/locales/zh-CN.json";
import zhTW from "../../../../i18n/src/locales/zh-TW.json";

// 复用项目语言资源，组件读取页面语言时不修改全局 i18n 状态。
const messages = {
  en: en.components.dropdown,
  ja: ja.components.dropdown,
  de: de.components.dropdown,
  it: it.components.dropdown,
  fr: fr.components.dropdown,
  es: es.components.dropdown,
  ko: ko.components.dropdown,
  "zh-CN": zhCN.components.dropdown,
  "zh-TW": zhTW.components.dropdown,
};

export function getDropdownLanguage(document: Document): keyof typeof messages {
  const lang = document.documentElement.lang.trim().toLowerCase();
  const exact = Object.keys(messages).find((key) => key.toLowerCase() === lang);
  if (exact) return exact as keyof typeof messages;
  const [base, ...subtags] = lang.split("-");
  if (base === "zh") {
    if (subtags.includes("hant")) return "zh-TW";
    if (subtags.includes("hans")) return "zh-CN";
    return subtags.includes("tw") || subtags.includes("hk") || subtags.includes("mo")
      ? "zh-TW"
      : "zh-CN";
  }
  if (Object.prototype.hasOwnProperty.call(messages, base)) return base as keyof typeof messages;
  const current = getCurrLanguage();
  return Object.prototype.hasOwnProperty.call(messages, current)
    ? current as keyof typeof messages
    : "en";
}

export function dropdownText(document: Document, key: keyof typeof messages.en): string {
  return messages[getDropdownLanguage(document)][key];
}
