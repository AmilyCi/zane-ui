import { h, } from "@stencil/core";
import { FOCUS_AFTER_RELEASED, FOCUS_AFTER_TRAPPED } from "../../constants";
import { useFocusReason } from "../../hooks";
import { getVisibleElement, obtainAllFocusableElements } from "../../utils";
const createFocusOutPreventedEvent = (detail) => {
    return new CustomEvent('focusout-prevented', {
        bubbles: false,
        cancelable: true,
        detail,
    });
};
function removeFromStack(list, item) {
    const copy = [...list];
    const idx = list.indexOf(item);
    if (idx !== -1) {
        copy.splice(idx, 1);
    }
    return copy;
}
const createFocusableStack = () => {
    let stack = [];
    const push = (layer) => {
        const currentLayer = stack[0];
        if (currentLayer && layer !== currentLayer) {
            currentLayer.pause();
        }
        stack = removeFromStack(stack, layer);
        stack.unshift(layer);
    };
    const remove = (layer) => {
        var _a, _b;
        stack = removeFromStack(stack, layer);
        (_b = (_a = stack[0]) === null || _a === void 0 ? void 0 : _a.resume) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    return { push, remove };
};
const getEdges = (container) => {
    const focusable = obtainAllFocusableElements(container);
    const first = getVisibleElement(focusable, container);
    const last = getVisibleElement(focusable.reverse(), container);
    return [first, last];
};
const focusableStack = createFocusableStack();
export class ElFocusTrap {
    constructor() {
        this.focusStartEl = 'first';
        this.loop = false;
        this.trapOnFocusIn = true;
        this.trapped = false;
        this.focusLayer = {
            pause: () => {
                this.focusLayer.paused = true;
            },
            paused: false,
            resume: () => {
                this.focusLayer.paused = false;
            },
        };
        this.focusReason = useFocusReason();
        this.lastFocusAfterTrapped = null;
        this.lastFocusBeforeTrapped = null;
        this.focusFirstDescendant = (elements, shouldSelect = false) => {
            const prevFocusedElement = document.activeElement;
            for (const element of elements) {
                this.focusReason.tryFocus(element, shouldSelect);
                if (document.activeElement !== prevFocusedElement)
                    return;
            }
        };
        this.onFocusIn = (e) => {
            const trapContainer = this.getTrapContainer();
            if (!trapContainer)
                return;
            const target = e.target;
            const relatedTarget = e.relatedTarget;
            const isFocusedInTrap = target && trapContainer.contains(target);
            if (!this.trapped) {
                const isPrevFocusedInTrap = relatedTarget && trapContainer.contains(relatedTarget);
                if (!isPrevFocusedInTrap) {
                    this.lastFocusBeforeTrapped = relatedTarget;
                }
            }
            if (isFocusedInTrap) {
                this.zaneFocusin.emit(e);
            }
            if (this.focusLayer.paused)
                return;
            if (this.trapped) {
                if (isFocusedInTrap) {
                    this.lastFocusAfterTrapped = target;
                }
                else {
                    this.focusReason.tryFocus(this.lastFocusAfterTrapped, true);
                }
            }
        };
        this.onFocusOut = (e) => {
            const trapContainer = this.getTrapContainer();
            if (this.focusLayer.paused || !trapContainer)
                return;
            if (this.trapped) {
                const relatedTarget = e.relatedTarget;
                if (relatedTarget && !trapContainer.contains(relatedTarget)) {
                    setTimeout(() => {
                        if (!this.focusLayer.paused && this.trapped) {
                            const focusoutPreventedEvent = createFocusOutPreventedEvent({
                                focusReason: this.focusReason.getFocusReason(),
                            });
                            this.zaneFocusoutPrevented.emit(focusoutPreventedEvent);
                            if (!focusoutPreventedEvent.defaultPrevented) {
                                this.focusReason.tryFocus(this.lastFocusAfterTrapped, true);
                            }
                        }
                    }, 0);
                }
            }
            else {
                const target = e.target;
                const isFocusedInTrap = target && trapContainer.contains(target);
                if (!isFocusedInTrap) {
                    this.zaneFocusout.emit(e);
                }
            }
        };
        this.onKeydown = (e) => {
            if (!this.loop && !this.trapped)
                return;
            if (this.focusLayer.paused)
                return;
            const { altKey, ctrlKey, currentTarget, metaKey, shiftKey } = e;
            const { loop } = this;
            const code = e.code || e.key;
            const isTabbing = code === 'Tab' && !altKey && !ctrlKey && !metaKey;
            const currentFocusingEl = document.activeElement;
            if (isTabbing && currentFocusingEl) {
                const container = currentTarget;
                const [first, last] = getEdges(container);
                const isTabbable = first && last;
                if (isTabbable) {
                    if (!shiftKey && currentFocusingEl === last) {
                        const focusoutPreventedEvent = createFocusOutPreventedEvent({
                            focusReason: this.focusReason.getFocusReason(),
                        });
                        this.zaneFocusoutPrevented.emit(focusoutPreventedEvent);
                        if (!focusoutPreventedEvent.defaultPrevented) {
                            e.preventDefault();
                            if (loop)
                                this.focusReason.tryFocus(first, true);
                        }
                    }
                    else if (shiftKey && [container, first].includes(currentFocusingEl)) {
                        const focusoutPreventedEvent = createFocusOutPreventedEvent({
                            focusReason: this.focusReason.getFocusReason(),
                        });
                        this.zaneFocusoutPrevented.emit(focusoutPreventedEvent);
                        if (!focusoutPreventedEvent.defaultPrevented) {
                            e.preventDefault();
                            if (loop)
                                this.focusReason.tryFocus(last, true);
                        }
                    }
                }
                else {
                    if (currentFocusingEl === container) {
                        const focusoutPreventedEvent = createFocusOutPreventedEvent({
                            focusReason: this.focusReason.getFocusReason(),
                        });
                        this.zaneFocusoutPrevented.emit(focusoutPreventedEvent);
                        if (!focusoutPreventedEvent.defaultPrevented) {
                            e.preventDefault();
                        }
                    }
                }
            }
            // Handle Escape key for release requested
            if (code === 'Escape' && this.trapped && !this.focusLayer.paused) {
                this.zaneReleaseRequested.emit(e);
            }
        };
    }
    componentDidLoad() {
        this.initializeFocusTrap();
        this.focusReason.connect();
    }
    disconnectedCallback() {
        this.cleanupEventListeners();
        this.focusReason.disconnect();
        if (this.trapped) {
            this.stopTrap();
        }
    }
    onFocusTrapElChange() {
        this.cleanupEventListeners();
        this.initializeFocusTrap();
    }
    onTrappedChange(newValue, oldValue) {
        if (newValue !== oldValue) {
            if (newValue) {
                this.startTrap();
            }
            else {
                this.stopTrap();
            }
        }
    }
    render() {
        return h("slot", { key: 'c8878bbe0a33f352afd34d1559eb25ca1ef3410e' });
    }
    async updateFocusTrap() {
        if (this.trapped) {
            this.startTrap();
        }
    }
    cleanupEventListeners() {
        const trapContainer = this.getTrapContainer();
        if (trapContainer) {
            trapContainer.removeEventListener('keydown', this.onKeydown);
            trapContainer.removeEventListener('focusin', this.onFocusIn);
            trapContainer.removeEventListener('focusout', this.onFocusOut);
        }
    }
    getTrapContainer() {
        return this.focusTrapEl || this.el;
    }
    initializeFocusTrap() {
        const trapContainer = this.getTrapContainer();
        if (trapContainer) {
            trapContainer.addEventListener('keydown', this.onKeydown);
            trapContainer.addEventListener('focusin', this.onFocusIn);
            trapContainer.addEventListener('focusout', this.onFocusOut);
        }
        if (this.trapped) {
            this.startTrap();
        }
    }
    async startTrap() {
        await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for next tick
        const trapContainer = this.getTrapContainer();
        if (trapContainer) {
            focusableStack.push(this.focusLayer);
            const prevFocusedElement = trapContainer.contains(document.activeElement)
                ? this.lastFocusBeforeTrapped
                : document.activeElement;
            this.lastFocusBeforeTrapped = prevFocusedElement;
            const isPrevFocusContained = trapContainer.contains(prevFocusedElement);
            if (!isPrevFocusContained) {
                const focusEvent = new CustomEvent(FOCUS_AFTER_TRAPPED, {
                    bubbles: false,
                    cancelable: true,
                });
                const handleTrapped = (e) => {
                    this.zaneFocusAfterTrapped.emit(e);
                    trapContainer.removeEventListener(FOCUS_AFTER_TRAPPED, handleTrapped);
                };
                trapContainer.addEventListener(FOCUS_AFTER_TRAPPED, handleTrapped);
                trapContainer.dispatchEvent(focusEvent);
                if (!focusEvent.defaultPrevented) {
                    setTimeout(() => {
                        let focusStartEl = this.focusStartEl;
                        if (typeof focusStartEl !== 'string') {
                            this.focusReason.tryFocus(focusStartEl);
                            if (document.activeElement !== focusStartEl) {
                                focusStartEl = 'first';
                            }
                        }
                        if (focusStartEl === 'first') {
                            this.focusFirstDescendant(obtainAllFocusableElements(trapContainer), true);
                        }
                        if (document.activeElement === prevFocusedElement ||
                            focusStartEl === 'container') {
                            this.focusReason.tryFocus(trapContainer);
                        }
                    }, 0);
                }
            }
        }
    }
    stopTrap() {
        var _a;
        const trapContainer = this.getTrapContainer();
        if (trapContainer) {
            const releasedEvent = new CustomEvent(FOCUS_AFTER_RELEASED, {
                bubbles: false,
                cancelable: true,
                detail: {
                    focusReason: this.focusReason.getFocusReason(),
                },
            });
            const handleReleased = (e) => {
                this.zaneFocusAfterReleased.emit(e);
                trapContainer.removeEventListener(FOCUS_AFTER_RELEASED, handleReleased);
            };
            trapContainer.addEventListener(FOCUS_AFTER_RELEASED, handleReleased);
            trapContainer.dispatchEvent(releasedEvent);
            if (!releasedEvent.defaultPrevented) {
                const focusReason = this.focusReason.getFocusReason();
                if (focusReason === 'keyboard' ||
                    !this.focusReason.isFocusCausedByUserEvent() ||
                    trapContainer.contains(document.activeElement)) {
                    this.focusReason.tryFocus((_a = this.lastFocusBeforeTrapped) !== null && _a !== void 0 ? _a : document.body);
                }
            }
            focusableStack.remove(this.focusLayer);
            this.lastFocusBeforeTrapped = null;
            this.lastFocusAfterTrapped = null;
        }
    }
    static get is() { return "zane-focus-trap"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-focus-trap.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-focus-trap.css"]
        };
    }
    static get properties() {
        return {
            "focusStartEl": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'container' | 'first' | HTMLElement",
                    "resolved": "\"container\" | \"first\" | HTMLElement",
                    "references": {
                        "HTMLElement": {
                            "location": "global",
                            "id": "global::HTMLElement"
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
                "attribute": "focus-start-el",
                "defaultValue": "'first'"
            },
            "focusTrapEl": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "HTMLElement",
                    "resolved": "HTMLElement",
                    "references": {
                        "HTMLElement": {
                            "location": "global",
                            "id": "global::HTMLElement"
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
                "setter": false
            },
            "loop": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
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
                "reflect": false,
                "attribute": "loop",
                "defaultValue": "false"
            },
            "trapOnFocusIn": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
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
                "reflect": false,
                "attribute": "trap-on-focus-in",
                "defaultValue": "true"
            },
            "trapped": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
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
                "reflect": false,
                "attribute": "trapped",
                "defaultValue": "false"
            }
        };
    }
    static get events() {
        return [{
                "method": "zaneFocusAfterReleased",
                "name": "zFocusAfterReleased",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "Event",
                    "resolved": "Event",
                    "references": {
                        "Event": {
                            "location": "import",
                            "path": "@stencil/core",
                            "id": "node_modules::Event",
                            "referenceLocation": "Event"
                        }
                    }
                }
            }, {
                "method": "zaneFocusAfterTrapped",
                "name": "zFocusAfterTrapped",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "Event",
                    "resolved": "Event",
                    "references": {
                        "Event": {
                            "location": "import",
                            "path": "@stencil/core",
                            "id": "node_modules::Event",
                            "referenceLocation": "Event"
                        }
                    }
                }
            }, {
                "method": "zaneFocusin",
                "name": "zFocusIn",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "FocusEvent",
                    "resolved": "FocusEvent",
                    "references": {
                        "FocusEvent": {
                            "location": "global",
                            "id": "global::FocusEvent"
                        }
                    }
                }
            }, {
                "method": "zaneFocusout",
                "name": "zFocusOut",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "FocusEvent",
                    "resolved": "FocusEvent",
                    "references": {
                        "FocusEvent": {
                            "location": "global",
                            "id": "global::FocusEvent"
                        }
                    }
                }
            }, {
                "method": "zaneFocusoutPrevented",
                "name": "zFocusOutPrevented",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "CustomEvent",
                    "resolved": "CustomEvent<any>",
                    "references": {
                        "CustomEvent": {
                            "location": "global",
                            "id": "global::CustomEvent"
                        }
                    }
                }
            }, {
                "method": "zaneReleaseRequested",
                "name": "zReleaseRequested",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "Event",
                    "resolved": "Event",
                    "references": {
                        "Event": {
                            "location": "import",
                            "path": "@stencil/core",
                            "id": "node_modules::Event",
                            "referenceLocation": "Event"
                        }
                    }
                }
            }];
    }
    static get methods() {
        return {
            "updateFocusTrap": {
                "complexType": {
                    "signature": "() => Promise<void>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "",
                    "tags": []
                }
            }
        };
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "focusTrapEl",
                "methodName": "onFocusTrapElChange"
            }, {
                "propName": "trapped",
                "methodName": "onTrappedChange"
            }];
    }
}
