export const inLabel = (el: HTMLElement) => {
  let parent = el.parentElement;
  while (parent) {
    if (parent.tagName === 'ZANE-FORM-ITEM') {
      return false;
    }
    if (parent.tagName === 'ZANE-FORM-LABEL-WRAP') {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
}
