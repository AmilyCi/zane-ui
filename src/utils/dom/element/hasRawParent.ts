
export function hasRawParent(el: HTMLElement) {
  let parent: any = el.parentElement;
  let result = false;
  while (parent) {
    if (parent.rawParent) {
      result = true;
      break;
    }
    parent = parent.parentElement;
  }
  return result;
}
