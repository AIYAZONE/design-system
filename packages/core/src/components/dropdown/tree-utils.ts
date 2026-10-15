import type { DropdownOption } from "./types";

export interface DropdownNode {
  option: DropdownOption;
  parent?: DropdownNode;
  depth: number;
  disabled: boolean;
  children: DropdownNode[];
  id: string;
  position: number;
  siblings: number;
}

export function buildDropdownTree(options: DropdownOption[]) {
  const index = new Map<string, DropdownNode>();
  const visit = (
    items: DropdownOption[],
    parent?: DropdownNode,
  ): DropdownNode[] =>
    items.map((option, position) => {
      if (!option.value || index.has(option.value)) {
        throw new Error(
          "jds-dropdown: option values must be non-empty and globally unique.",
        );
      }
      const node: DropdownNode = {
        option,
        parent,
        depth: parent ? parent.depth + 1 : 0,
        disabled: !!(parent?.disabled || option.disabled),
        children: [],
        id: `option-${index.size}`,
        position: position + 1,
        siblings: items.length,
      };
      index.set(option.value, node);
      node.children = visit(option.children ?? [], node);
      return node;
    });
  const roots = visit(options);
  return {
    roots,
    index,
    hierarchical: roots.some((node) => node.children.length > 0),
  };
}

export function getDropdownPath(node?: DropdownNode): DropdownNode[] {
  const path: DropdownNode[] = [];
  while (node) {
    path.push(node);
    node = node.parent;
  }
  return path.reverse();
}

export function getVisibleDropdownNodes(
  roots: DropdownNode[],
  expanded: Set<string>,
): DropdownNode[] {
  const result: DropdownNode[] = [];
  const stack = [...roots].reverse();
  while (stack.length) {
    const node = stack.pop()!;
    result.push(node);
    if (expanded.has(node.option.value)) {
      for (let i = node.children.length - 1; i >= 0; i--)
        stack.push(node.children[i]);
    }
  }
  return result;
}
