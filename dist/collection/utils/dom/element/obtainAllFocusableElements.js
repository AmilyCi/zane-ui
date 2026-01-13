export const obtainAllFocusableElements = (element) => {
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
