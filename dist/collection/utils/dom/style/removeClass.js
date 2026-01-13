export function removeClass(el, cls) {
    cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
}
