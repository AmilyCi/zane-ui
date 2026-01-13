export function setTransitionDuration(els, value) {
    els.forEach((el) => {
        if (el) {
            el.style.transitionDuration = `${value}ms`;
        }
    });
}
