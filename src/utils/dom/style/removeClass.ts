export function removeClass(el: Element, cls: string) {
  cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
}
