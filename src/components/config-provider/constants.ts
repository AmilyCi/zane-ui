import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";
import type { ConfigProviderContext } from "./types";

export const configProviderContexts = new WeakMap<
  HTMLElement,
  ReactiveObject<ConfigProviderContext>
>();
