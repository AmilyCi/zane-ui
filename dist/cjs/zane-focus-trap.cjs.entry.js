'use strict';

var index = require('./index-ziNpORbs.js');
require('./uuid-avdvDRhA.js');

const isHidden = (element, container) => {
    if (getComputedStyle(element).visibility === 'hidden')
        return true;
    let currentElement = element;
    while (currentElement) {
        if (container && currentElement === container)
            return false;
        if (getComputedStyle(currentElement).display === 'none')
            return true;
        currentElement = currentElement.parentElement;
    }
    return false;
};

const getVisibleElement = (elements, container) => {
    for (const element of elements) {
        if (!isHidden(element, container))
            return element;
    }
    return null;
};

const isSelectable = (element) => {
    return element instanceof HTMLInputElement && 'select' in element;
};

const obtainAllFocusableElements = (element) => {
    const nodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (node) => {
            const isHiddenInput = node.tagName === 'INPUT' && node.type === 'hidden';
            if (node.disabled || node.hidden || isHiddenInput) {
                return NodeFilter.FILTER_SKIP;
            }
            return node.tabIndex >= 0 || node === document.activeElement
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_SKIP;
        },
    });
    while (walker.nextNode()) {
        nodes.push(walker.currentNode);
    }
    return nodes;
};

const FOCUS_AFTER_TRAPPED = 'focusAfterTrapped';
const FOCUS_AFTER_RELEASED = 'focusAfterReleased';

let focusReason;
let lastUserFocusTimestamp = 0;
let lastAutomatedFocusTimestamp = 0;
let focusReasonUserCount = 0;
const notifyFocusReasonPointer = () => {
    focusReason = 'pointer';
    lastUserFocusTimestamp = window.performance.now();
};
const notifyFocusReasonKeydown = () => {
    focusReason = 'keyboard';
    lastUserFocusTimestamp = window.performance.now();
};
const useFocusReason = () => {
    const connect = () => {
        if (focusReasonUserCount === 0) {
            document.addEventListener('mousedown', notifyFocusReasonPointer);
            document.addEventListener('touchstart', notifyFocusReasonPointer);
            document.addEventListener('keydown', notifyFocusReasonKeydown);
        }
        focusReasonUserCount++;
    };
    const disconnect = () => {
        focusReasonUserCount--;
        if (focusReasonUserCount <= 0) {
            document.removeEventListener('mousedown', notifyFocusReasonPointer);
            document.removeEventListener('touchstart', notifyFocusReasonPointer);
            document.removeEventListener('keydown', notifyFocusReasonKeydown);
        }
    };
    const isFocusCausedByUserEvent = () => {
        return lastUserFocusTimestamp > lastAutomatedFocusTimestamp;
    };
    const tryFocus = (element, shouldSelect) => {
        if (element && 'focus' in element) {
            const prevFocusedElement = document.activeElement;
            element.focus({ preventScroll: true });
            lastAutomatedFocusTimestamp = window.performance.now();
            if (element !== prevFocusedElement &&
                isSelectable(element) &&
                shouldSelect) {
                element.select();
            }
        }
    };
    return {
        connect,
        disconnect,
        getFocusReason: () => focusReason,
        getLastAutomatedFocusTimestamp: () => lastAutomatedFocusTimestamp,
        getLastUserFocusTimestamp: () => lastUserFocusTimestamp,
        isFocusCausedByUserEvent,
        tryFocus,
    };
};

const zaneFocusTrapCss = () => `@charset "UTF-8";:host{display:contents;}`;

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
const ElFocusTrap = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.zaneFocusAfterReleased = index.createEvent(this, "zFocusAfterReleased", 7);
        this.zaneFocusAfterTrapped = index.createEvent(this, "zFocusAfterTrapped", 7);
        this.zaneFocusin = index.createEvent(this, "zFocusIn", 7);
        this.zaneFocusout = index.createEvent(this, "zFocusOut", 7);
        this.zaneFocusoutPrevented = index.createEvent(this, "zFocusOutPrevented", 7);
        this.zaneReleaseRequested = index.createEvent(this, "zReleaseRequested", 7);
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
        return index.h("slot", { key: 'c8878bbe0a33f352afd34d1559eb25ca1ef3410e' });
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
    get el() { return index.getElement(this); }
    static get watchers() { return {
        "focusTrapEl": [{
                "onFocusTrapElChange": 0
            }],
        "trapped": [{
                "onTrappedChange": 0
            }]
    }; }
};
ElFocusTrap.style = zaneFocusTrapCss();

exports.zane_focus_trap = ElFocusTrap;
