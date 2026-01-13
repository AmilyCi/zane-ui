export function setVisibilityState(els, state) {
    els.forEach((el) => {
        if (el) {
            el.dataset.state = state;
        }
    });
}
