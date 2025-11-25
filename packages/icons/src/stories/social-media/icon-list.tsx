import { SOCIAL_MEDIA_ICON_LIST as icons } from "../../types/social-media";
import synonyms from "./search-keys";
import { createIconList } from "../shared/icon-list";

export const IconList = createIconList({
  icons,
  synonyms,
  iconType: "social-media",
});