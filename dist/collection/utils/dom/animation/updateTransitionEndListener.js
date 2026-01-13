export function updateTransitionEndListener(box, action, listener) {
    if (listener) {
        const method = `${action}EventListener`;
        // some browsers apparently support `transition` (unprefixed) but only fire
        // `webkitTransitionEnd`...
        ['transitionend', 'webkitTransitionEnd'].forEach((event) => {
            box[method](event, listener);
        });
    }
}
