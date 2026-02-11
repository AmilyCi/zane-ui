import { selectContexts } from "./constants";

export const escapeStringRegexp = (str: string) => {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}

export const getSelectContext = (el: HTMLElement) => {
  let parent = el.parentElement;
  let context = null;
  while (parent) {
    if (parent.tagName === 'ZANE-SELECT') {
      context = selectContexts.get(parent);
      break;
    }
    parent = parent.parentElement;
  }
  return context;
}
