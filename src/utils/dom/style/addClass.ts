export function addClass(el: Element, cls: string) {
  cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
}
