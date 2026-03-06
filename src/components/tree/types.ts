export type TreeNodeData = Record<string, any>;

export type TreeData = TreeNodeData[];

export type TreeKey = string | number;

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

export type TreeOptionProps = {
  children?: string;
  label?: string;
  value?: string;
  disabled?: string;
  class?:
    | ((
      data: TreeNodeData,
      node: TreeNode,
    ) => string | { [key: string]: boolean })
    | string
}

export type FilterMethod = (
  query: string,
  data: TreeNodeData,
  node: TreeNode
) => boolean;

export interface CheckedInfo {
  checkedKeys: TreeKey[];
  checkedNodes: TreeData;
  halfCheckedKeys: TreeKey[];
  halfCheckedNodes: TreeData;
}

export interface Tree {
  treeNodeMap: Map<TreeKey, TreeNode>;
  levelTreeNodeMap: Map<number, TreeNode[]>;
  treeNodes: TreeNode[];
  maxLevel: number;
}

export interface TreeContext {
  treeProps: TreeOptionProps;
  indent: number;
  icon: string;
}
