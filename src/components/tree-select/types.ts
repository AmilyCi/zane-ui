import type { Instance, Props } from "tippy.js";

export type TreeNodeData = Record<string, any>;

export type TreeKey = string | number;

export type TreeData = TreeNodeData[];

export type TreeNode = {
  key: TreeKey;
  level: number;
  parent?: TreeNode;
  children?: TreeNode[];
  data: TreeNodeData;
  disabled?: boolean;
  label?: string;
  isLeaf?: boolean;
  expanded?: boolean;
  isEffectivelyChecked?: boolean;
}

export type TreeSelectOptionValue = string | number | boolean | Record<string, any>;

export interface TagTooltipProps {
  appendTo?: Props['appendTo'];
  placement?: Props['placement'];
  theme?: Props['theme'];
  popperOptions?: Props['popperOptions'];
  offset?: Props['offset']
  onShow?: (event: CustomEvent<Instance<Props>>) => void;
  onHide?: (event: CustomEvent<Instance<Props>>) => void;
}

export type TreeSelectOptionProps = {
  children?: string;
  label?: string;
  value?: string;
  disabled?: string;
  isLeaf?: string;
  class?: string
}

export type FilterMethod = (
  query: string,
  data: TreeNodeData,
  node: TreeNode
) => boolean;


export type TreeCallback<T extends TreeNodeData, R> = (
  data: T,
  index: number,
  array: T[],
  parent?: T
) => R

export type TreeFindCallback<T extends TreeNodeData> = TreeCallback<T, boolean>
