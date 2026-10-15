/** 节点值必须为非空字符串，且在整棵树中唯一；节点名称允许重复。 */
export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  children?: DropdownOption[];
}

export interface DropdownChangeDetail {
  value: string;
  option: DropdownOption | null;
  pathValues: string[];
  pathLabels: string[];
}
