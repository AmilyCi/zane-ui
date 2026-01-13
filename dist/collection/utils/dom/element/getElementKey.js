export function getElementKey(el) {
    if (el.getAttribute('key')) {
        return el.getAttribute('key');
    }
    const key = `${el.tagName}-transition-${Math.random().toString(36).slice(2, 11)}`;
    el.setAttribute('key', key);
    return key;
}
