import type { ComponentInstance } from "./ComponentInstance";

export interface SurfaceUpdateMessage {
  surfaceId: string;
  components: ComponentInstance[];
}
