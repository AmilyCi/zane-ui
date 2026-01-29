import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";
import type { CascaderConfig, CascaderPanelContext } from "./types";

export const cascaderPanelContexts = new WeakMap<
  HTMLElement,
  ReactiveObject<CascaderPanelContext>
>();

export const defaultProps: CascaderConfig = {
  /**
   * @description trigger mode of expanding options
   */
  expandTrigger: 'click',
  /**
   * @description whether multiple selection is enabled
   */
  multiple: false,
  /**
   * @description whether checked state of a node not affects its parent and child nodes
   */
  checkStrictly: false, // whether all nodes can be selected
  /**
   * @description when checked nodes change, whether to emit an array of node's path, if false, only emit the value of node.
   */
  emitPath: true, // wether to emit an array of all levels value in which node is located
  /**
   * @description whether to dynamic load child nodes, use with `lazyload` attribute
   */
  lazy: false,
  /**
   * @description method for loading child nodes data, only works when `lazy` is true
   */
  lazyLoad: () => {},
  /**
   * @description specify which key of node object is used as the node's value
   */
  value: 'value',
  /**
   * @description specify which key of node object is used as the node's label
   */
  label: 'label',
  /**
   * @description specify which key of node object is used as the node's children
   */
  children: 'children',
  /**
   * @description specify which key of node object is used as the node's leaf
   */
  leaf: 'leaf',
  /**
   * @description specify which key of node object is used as the node's disabled
   */
  disabled: 'disabled',
  /**
   * @description hover threshold of expanding options
   */
  hoverThreshold: 500,
  /**
   * @description whether to check or uncheck node when clicking on the node
   */
  checkOnClickNode: false,
  /**
   * @description whether to check or uncheck node when clicking on leaf node (last children).
   */
  checkOnClickLeaf: true,
  /**
   * @description whether to show the radio or checkbox prefix
   */
  showPrefix: true,
}
