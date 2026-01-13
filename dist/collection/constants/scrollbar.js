export const GAP = 4;
export const BAR_MAP = {
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
export const scrollbarContexts = new WeakMap();
