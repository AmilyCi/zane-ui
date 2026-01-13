import type { CascaderNode } from './node';
export type CascaderNodeValue = number | Record<string, any> | string;
export type CascaderNodePathValue = CascaderNodeValue[];
export interface CascaderOption extends Record<string, unknown> {
    children?: CascaderOption[];
    disabled?: boolean;
    label?: string;
    leaf?: boolean;
    value?: CascaderNodeValue;
}
export type isDisabled = (data: CascaderOption, node: CascaderNode) => boolean;
export type isLeaf = (data: CascaderOption, node: CascaderNode) => boolean;
export type Resolve = (dataList?: CascaderOption[]) => void;
export type ExpandTrigger = 'click' | 'hover';
export type LazyLoad = (node: CascaderNode, resolve: Resolve, reject: () => void) => void;
export interface CascaderProps {
    checkOnClickLeaf?: boolean;
    checkOnClickNode?: boolean;
    checkStrictly?: boolean;
    children?: string;
    disabled?: isDisabled | string;
    emitPath?: boolean;
    expandTrigger?: ExpandTrigger;
    hoverThreshold?: number;
    label?: string;
    lazy?: boolean;
    lazyLoad?: LazyLoad;
    leaf?: isLeaf | string;
    multiple?: boolean;
    showPrefix?: boolean;
    value?: string;
}
export type CascaderConfig = Required<CascaderProps>;
export interface Tag {
    closable: boolean;
    hitState?: boolean;
    key: number;
    node?: CascaderNode;
    text: string;
}
