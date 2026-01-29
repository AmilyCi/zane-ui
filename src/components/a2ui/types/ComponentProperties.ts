import type { ComponentArrayReference } from "./ComponentArrayReference";

export type ComponentProperties = {
  children?: ComponentArrayReference;
  child?: string;
  [k: string]: unknown;
}
