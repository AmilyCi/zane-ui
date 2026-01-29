import { isEqual } from "lodash-es";
import type { Nullable } from "../../types";
import { CascaderNode } from "./node";
import { isPropAbsent } from "../../utils/is/isPropAbsent";
import type {
  CascaderConfig,
  CascaderNodePathValue,
  CascaderNodeValue,
  CascaderOption,
} from "./types";

const flatNodes = (nodes: CascaderNode[], leafOnly: boolean) => {
  return nodes.reduce((res, node) => {
    if (node.isLeaf) {
      res.push(node);
    } else {
      !leafOnly && res.push(node);
      res = res.concat(flatNodes(node.children, leafOnly));
    }
    return res;
  }, [] as CascaderNode[]);
};

export default class Store {
  readonly nodes: CascaderNode[];
  readonly allNodes: CascaderNode[];
  readonly leafNodes: CascaderNode[];

  constructor(data: CascaderOption[], readonly config: CascaderConfig) {
    const nodes = (data || []).map(
      (nodeData) => new CascaderNode(nodeData, this.config)
    );
    this.nodes = nodes;
    this.allNodes = flatNodes(nodes, false);
    this.leafNodes = flatNodes(nodes, true);
  }

  getNodes() {
    return this.nodes;
  }

  getFlattedNodes(leafOnly: boolean) {
    return leafOnly ? this.leafNodes : this.allNodes;
  }

  appendNode(nodeData: CascaderOption, parentNode?: CascaderNode) {
    const node = parentNode
      ? parentNode.appendChild(nodeData)
      : new CascaderNode(nodeData, this.config);

    if (!parentNode) this.nodes.push(node);

    this.appendAllNodesAndLeafNodes(node);
  }

  appendNodes(nodeDataList: CascaderOption[], parentNode: CascaderNode) {
    if (nodeDataList.length > 0) {
      nodeDataList.forEach((nodeData) => this.appendNode(nodeData, parentNode));
    } else {
      parentNode && parentNode.isLeaf && this.leafNodes.push(parentNode);
    }
  }

  appendAllNodesAndLeafNodes(node: CascaderNode) {
    this.allNodes.push(node);
    node.isLeaf && this.leafNodes.push(node);
    if (node.children) {
      node.children.forEach((subNode) => {
        this.appendAllNodesAndLeafNodes(subNode);
      });
    }
  }

  // when checkStrictly, leaf node first
  getNodeByValue(
    value: CascaderNodeValue | CascaderNodePathValue,
    leafOnly = false
  ): Nullable<CascaderNode> {
    if (isPropAbsent(value)) return null;

    const node = this.getFlattedNodes(leafOnly).find(
      (node) => isEqual(node.value, value) || isEqual(node.pathValues, value)
    );

    return node || null;
  }

  getSameNode(node: CascaderNode): Nullable<CascaderNode> {
    if (!node) return null;

    const node_ = this.getFlattedNodes(false).find(
      ({ value, level }) => isEqual(node.value, value) && node.level === level
    );

    return node_ || null;
  }
}
