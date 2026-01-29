import type { ComponentProperties } from "./ComponentProperties";

export interface ComponentInstance {
  id: string;
  weight?: number;
  component?: ComponentProperties;
}
