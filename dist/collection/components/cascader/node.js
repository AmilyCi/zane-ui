import { isEmpty, isFunction, isUndefined } from "../../utils";
let uid = 0;
const calculatePathNodes = (node) => {
    const nodes = [node];
    let { parent } = node;
    while (parent) {
        nodes.unshift(parent);
        parent = parent.parent;
    }
    return nodes;
};
export class CascaderNode {
    get isDisabled() {
        const { config, data, parent } = this;
        const { checkStrictly, disabled } = config;
        const isDisabled = isFunction(disabled)
            ? disabled(data, this)
            : !!data[disabled];
        return isDisabled || (!checkStrictly && !!(parent === null || parent === void 0 ? void 0 : parent.isDisabled));
    }
    get isLeaf() {
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
    constructor(data, config, parent, root = false) {
        this.data = data;
        this.config = config;
        this.parent = parent;
        this.root = root;
        this.checked = false;
        this.indeterminate = false;
        this.loading = false;
        this.uid = uid++;
        const { label: labelKey, value: valueKey, children: childrenKey } = config;
        const childrenData = data[childrenKey];
        const pathNodes = calculatePathNodes(this);
        // eslint-disable-next-line unicorn/no-nested-ternary
        this.level = root ? 0 : parent ? parent.level + 1 : 1;
        this.value = data[valueKey];
        this.label = data[labelKey];
        this.pathNodes = pathNodes;
        this.pathValues = pathNodes.map((node) => node.value);
        this.pathLabels = pathNodes.map((node) => node.label);
        this.childrenData = childrenData;
        this.children = (childrenData || []).map((child) => new CascaderNode(child, config, this));
        this.loaded = !config.lazy || this.isLeaf || !isEmpty(childrenData);
        this.text = '';
    }
    appendChild(childData) {
        const { children, childrenData } = this;
        const node = new CascaderNode(childData, this.config, this);
        if (Array.isArray(childrenData)) {
            childrenData.push(childData);
        }
        else {
            this.childrenData = [childData];
        }
        children.push(node);
        return node;
    }
    broadcast(checked) {
        this.children.forEach((child) => {
            var _a;
            if (child) {
                // bottom up
                child.broadcast(checked);
                (_a = child.onParentCheck) === null || _a === void 0 ? void 0 : _a.call(child, checked);
            }
        });
    }
    calcText(allLevels, separator) {
        const text = allLevels ? this.pathLabels.join(separator) : this.label;
        this.text = text;
        return text;
    }
    doCheck(checked) {
        if (this.checked === checked)
            return;
        const { checkStrictly, multiple } = this.config;
        if (checkStrictly || !multiple) {
            this.checked = checked;
        }
        else {
            // bottom up to unify the calculation of the indeterminate state
            this.broadcast(checked);
            this.setCheckState(checked);
            this.emit();
        }
    }
    emit() {
        var _a;
        const { parent } = this;
        if (parent) {
            (_a = parent.onChildCheck) === null || _a === void 0 ? void 0 : _a.call(parent);
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
    onParentCheck(checked) {
        if (!this.isDisabled) {
            this.setCheckState(checked);
        }
    }
    setCheckState(checked) {
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
