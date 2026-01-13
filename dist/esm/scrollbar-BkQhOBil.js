const GAP = 4;
const BAR_MAP = {
    horizontal: {
        axis: 'X',
        client: 'clientX',
        direction: 'left',
        key: 'horizontal',
        offset: 'offsetWidth',
        scroll: 'scrollLeft',
        scrollSize: 'scrollWidth',
        size: 'width',
    },
    vertical: {
        axis: 'Y',
        client: 'clientY',
        direction: 'top',
        key: 'vertical',
        offset: 'offsetHeight',
        scroll: 'scrollTop',
        scrollSize: 'scrollHeight',
        size: 'height',
    },
};
const scrollbarContexts = new WeakMap();

export { BAR_MAP as B, GAP as G, scrollbarContexts as s };
