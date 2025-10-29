import { SYSTEM_ICON_LIST as icons } from "../../types/system";
import synonyms from "./search-keys";
import { createIconList } from "../shared/icon-list.tsx";

export const IconList = createIconList({
  icons,
  synonyms,
  iconType: "system",
});
