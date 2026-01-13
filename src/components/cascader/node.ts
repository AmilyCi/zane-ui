import type {
  CascaderConfig,
  CascaderNodePathValue,
  CascaderNodeValue,
  CascaderOption,
} from './types';

import { isEmpty, isFunction, isUndefined } from '../../utils';

type ChildrenData = CascaderOption[] | undefined;

let uid = 0;

const calculatePathNodes = (node: CascaderNode) => {
  const nodes = [node];
  let { parent } = node;

  while (parent) {
    nodes.unshift(parent);
    parent = parent.parent;
  }

  return nodes;
};

export class CascaderNode {
  checked = false;
  children: CascaderNode[];
  childrenData: ChildrenData;
  indeterminate = false;
  readonly label: string;
  readonly level: number;
  loaded: boolean;
  loading = false;
  readonly pathLabels: string[];
  readonly pathNodes: CascaderNode[];
  readonly pathValues: CascaderNodePathValue;
  text: string;
  readonly uid: number = uid++;
  readonly value: CascaderNodeValue;

  get isDisabled(): boolean {
    const { config, data, parent } = this;
    const { checkStrictly, disabled } = config;
    const isDisabled = isFunction(disabled)
      ? disabled(data, this)
      : !!data[disabled];
    return isDisabled || (!checkStrictly && !!parent?.isDisabled);
  }

  get isLeaf(): boolean {
    const { config, data, loaded, childrenData } = this;
    const { lazy, leaf } = config;
    const isLeaf = isFunction(leaf) ? leaf(data, this) : data[leaf];

    return isUndefined(isLeaf)
      ? // eslint-disable-next-line unicorn/no-nested-ternary
        lazy && !loaded
        ? false
        : !(Array.isArray(childrenData) && childrenData.length)
      : !!isLeaf;
  }

  get valueByOption() {
    return this.config.emitPath ? this.pathValues : this.value;
  }

  constructor(
    readonly data: CascaderOption,
    readonly config: CascaderConfig,
    readonly parent?: CascaderNode,
    readonly root = false,
  ) {
    const { label: labelKey, value: valueKey, children: childrenKey } = config;

    const childrenData = data[childrenKey] as ChildrenData;
    const pathNodes = calculatePathNodes(this);

    // eslint-disable-next-line unicorn/no-nested-ternary
    this.level = root ? 0 : parent ? parent.level + 1 : 1;
    this.value = data[valueKey] as CascaderNodeValue;
    this.label = data[labelKey] as string;
    this.pathNodes = pathNodes;
    this.pathValues = pathNodes.map((node) => node.value);
    this.pathLabels = pathNodes.map((node) => node.label);
    this.childrenData = childrenData;
    this.children = (childrenData || []).map(
      (child) => new CascaderNode(child, config, this),
    );
    this.loaded = !config.lazy || this.isLeaf || !isEmpty(childrenData);
    this.text = '';
  }

  appendChild(childData: CascaderOption) {
    const { children, childrenData } = this;
    const node = new CascaderNode(childData, this.config, this);

    if (Array.isArray(childrenData)) {
      childrenData.push(childData);
    } else {
      this.childrenData = [childData];
    }

    children.push(node);

    return node;
  }

  broadcast(checked: boolean) {
    this.children.forEach((child) => {
      if (child) {
        // bottom up
        child.broadcast(checked);
        child.onParentCheck?.(checked);
      }
    });
  }

  calcText(allLevels: boolean, separator: string) {
    const text = allLevels ? this.pathLabels.join(separator) : this.label;
    this.text = text;
    return text;
  }

  doCheck(checked: boolean) {
    if (this.checked === checked) return;

    const { checkStrictly, multiple } = this.config;

    if (checkStrictly || !multiple) {
      this.checked = checked;
    } else {
      // bottom up to unify the calculation of the indeterminate state
      this.broadcast(checked);
      this.setCheckState(checked);
      this.emit();
    }
  }

  emit() {
    const { parent } = this;
    if (parent) {
      parent.onChildCheck?.();
      parent.emit();
    }
  }

  onChildCheck() {
    const { children } = this;
    const validChildren = children.filter((child) => !child.isDisabled);
    const checked = validChildren.length
      ? validChildren.every((child) => child.checked)
      : false;

    this.setCheckState(checked);
  }

  onParentCheck(checked: boolean) {
    if (!this.isDisabled) {
      this.setCheckState(checked);
    }
  }

  setCheckState(checked: boolean) {
    const totalNum = this.children.length;
    const checkedNum = this.children.reduce((c, p) => {
      // eslint-disable-next-line unicorn/no-nested-ternary
      const num = p.checked ? 1 : p.indeterminate ? 0.5 : 0;
      return c + num;
    }, 0);

    this.checked =
      this.loaded &&
      this.children
        .filter((child) => !child.isDisabled)
        .every((child) => child.loaded && child.checked) &&
      checked;
    this.indeterminate =
      this.loaded && checkedNum !== totalNum && checkedNum > 0;
  }
}
