import { h, Host } from "@stencil/core";
import { rowContexts } from "../../constants";
import { useNamespace } from "../../hooks";
import { mutable } from "../../types";
import { isNumber, isObject } from "../../utils";
const ns = useNamespace('col');
export class ZaneRow {
    constructor() {
        this.gutter = 0;
        this.lg = mutable({});
        this.md = mutable({});
        this.offset = 0;
        this.pull = 0;
        this.push = 0;
        this.sm = mutable({});
        this.span = 24;
        this.xl = mutable({});
        this.xs = mutable({});
    }
    get colKls() {
        const classes = [];
        const pos = ['span', 'offset', 'pull', 'push'];
        pos.forEach((prop) => {
            const size = this[prop];
            if (isNumber(size)) {
                if (prop === 'span')
                    classes.push(ns.b(`${this[prop]}`));
                else if (size > 0)
                    classes.push(ns.b(`${prop}-${this[prop]}`));
            }
        });
        const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
        sizes.forEach((size) => {
            if (isNumber(this[size])) {
                classes.push(ns.b(`${size}-${this[size]}`));
            }
            else if (isObject(this[size])) {
                Object.entries(this[size]).forEach(([prop, sizeProp]) => {
                    classes.push(prop === 'span'
                        ? ns.b(`${size}-${sizeProp}`)
                        : ns.b(`${size}-${prop}-${sizeProp}`));
                });
            }
        });
        // this is for the fix
        if (this.gutter) {
            classes.push(ns.is('guttered'));
        }
        return [ns.b(), ...classes].join(' ');
    }
    get rowContext() {
        let parent = this.el.parentElement;
        let context = null;
        while (parent) {
            if (parent.tagName === 'ZANE-ROW') {
                context = rowContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    get style() {
        const styles = {};
        if (this.gutter) {
            styles.paddingLeft = styles.paddingRight = `${this.gutter / 2}px`;
        }
        return styles;
    }
    componentWillLoad() {
        var _a, _b;
        this.gutter = (_b = (_a = this.rowContext) === null || _a === void 0 ? void 0 : _a.gutter) !== null && _b !== void 0 ? _b : 0;
    }
    render() {
        return (h(Host, { key: '37050db21715a5c395e98433a1f0bd965cb28094', class: this.colKls, style: this.style }, h("slot", { key: '8f201803130cad709408f82bef81492a85c90f29' })));
    }
    static get is() { return "zane-col"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-col.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-col.css"]
        };
    }
    static get properties() {
        return {
            "lg": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "ColSize",
                    "resolved": "number | { offset?: number; pull?: number; push?: number; span?: number; }",
                    "references": {
                        "ColSize": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::ColSize",
                            "referenceLocation": "ColSize"
                        },
                        "const": {
                            "location": "global",
                            "id": "global::const"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "lg",
                "defaultValue": "mutable({} as const)"
            },
            "md": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "ColSize",
                    "resolved": "number | { offset?: number; pull?: number; push?: number; span?: number; }",
                    "references": {
                        "ColSize": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::ColSize",
                            "referenceLocation": "ColSize"
                        },
                        "const": {
                            "location": "global",
                            "id": "global::const"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "md",
                "defaultValue": "mutable({} as const)"
            },
            "offset": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "number",
                    "resolved": "number",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": true,
                "attribute": "offset",
                "defaultValue": "0"
            },
            "pull": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "number",
                    "resolved": "number",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": true,
                "attribute": "pull",
                "defaultValue": "0"
            },
            "push": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "number",
                    "resolved": "number",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": true,
                "attribute": "push",
                "defaultValue": "0"
            },
            "sm": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "ColSize",
                    "resolved": "number | { offset?: number; pull?: number; push?: number; span?: number; }",
                    "references": {
                        "ColSize": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::ColSize",
                            "referenceLocation": "ColSize"
                        },
                        "const": {
                            "location": "global",
                            "id": "global::const"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "sm",
                "defaultValue": "mutable({} as const)"
            },
            "span": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "number",
                    "resolved": "number",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": true,
                "attribute": "span",
                "defaultValue": "24"
            },
            "xl": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "ColSize",
                    "resolved": "number | { offset?: number; pull?: number; push?: number; span?: number; }",
                    "references": {
                        "ColSize": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::ColSize",
                            "referenceLocation": "ColSize"
                        },
                        "const": {
                            "location": "global",
                            "id": "global::const"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "xl",
                "defaultValue": "mutable({} as const)"
            },
            "xs": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "ColSize",
                    "resolved": "number | { offset?: number; pull?: number; push?: number; span?: number; }",
                    "references": {
                        "ColSize": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::ColSize",
                            "referenceLocation": "ColSize"
                        },
                        "const": {
                            "location": "global",
                            "id": "global::const"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "xs",
                "defaultValue": "mutable({} as const)"
            }
        };
    }
    static get states() {
        return {
            "gutter": {}
        };
    }
    static get elementRef() { return "el"; }
}
