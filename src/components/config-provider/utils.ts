import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";
import type { ConfigProviderContext } from "./types";
import { configProviderContexts } from "./constants";

export const getConfigProviderContext = (el: HTMLElement): ReactiveObject<ConfigProviderContext> | null => {
  let parent = el.parentElement;
  let context = null;
  while (parent) {
    if (parent.tagName === 'ZANE-CONFIG-PROVIDER') {
      context = configProviderContexts.get(parent);
      break;
    }
    parent = parent.parentElement;
  }
  return context;
}
