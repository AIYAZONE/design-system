import { t } from "@aiyazone/i18n";
import { getDropdownLanguage } from "./dropdown/locale";

/** Read page language without changing the application's global language. */
export function componentText(
  document: Document,
  key: "close" | "loading" | "count",
): string {
  return t(`common.${key}`, undefined, getDropdownLanguage(document));
}
