export function addClass(el, cls) {
    cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
}
