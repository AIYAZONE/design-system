import type { DropdownOption } from "./types";

/** 设计稿示例数据，特意保留重复名称和需要换行的长文本。 */
export const dropdownTreeOptions: DropdownOption[] = [
  {
    value: "station",
    label: "Power Station",
    children: [{ value: "explorer", label: "AIYAZONE Explorer 3000 Pro" }],
  },
  {
    value: "solar",
    label: "Solar PanelsSolar Panels",
    children: [
      {
        value: "solar-station",
        label: "Power StationPower Station",
        children: [
          { value: "sg1500", label: "SG1500(2*100W)" },
          { value: "panel60", label: "Solar PanelwSolar PanelwSolar Panel 60" },
          {
            value: "long",
            label:
              "Power SG1500(2*100W)Power SG1500(2*100W)Power SG1500(2*100W)Power SG1500(2*100W)1500(2*100W)",
          },
        ],
      },
      {
        value: "solar-other",
        label: "Power Station",
        children: [{ value: "panel100", label: "SolarSaga 100W" }],
      },
    ],
  },
  {
    value: "other",
    label: "Power Station",
    children: [{ value: "other-product", label: "Other product" }],
  },
];

export const dropdownMobileOptions: DropdownOption[] = [
  dropdownTreeOptions[0],
  {
    value: "solar",
    label: "Solar Panelsolar Panels",
    children: [
      {
        value: "solar-station",
        label: "AIYAZONE ExSolar Panelsackery ExSol",
        children: [
          { value: "sg1500", label: "AIYAZONE ExSolar Panelsackery" },
          {
            value: "long",
            label:
              "AIYAZONE Explorer 3000 sssxxxx Pro Portable Power Stationrtab",
          },
        ],
      },
      {
        value: "solar-other",
        label: "AIYAZONE ExSolar Panelsackery ExSol",
        children: [{ value: "panel100", label: "SolarSaga 100W" }],
      },
    ],
  },
  dropdownTreeOptions[2],
];

export const dropdownFlatOptions: DropdownOption[] = [
  { value: "power", label: "Power Station" },
  { value: "solar", label: "Solar Panels" },
  { value: "accessories", label: "Accessories" },
  { value: "unavailable", label: "Unavailable", disabled: true },
];
