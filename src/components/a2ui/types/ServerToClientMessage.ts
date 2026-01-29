import type { BeginRenderingMessage } from "./BeginRenderingMessage";
import type { DataModelUpdate } from "./DataModelUpdate";
import type { DeleteSurfaceMessage } from "./DeleteSurfaceMessage";
import type { SurfaceUpdateMessage } from "./SurfaceUpdateMessage";

export interface ServerToClientMessage {
  beginRendering?: BeginRenderingMessage;
  surfaceUpdate?: SurfaceUpdateMessage;
  dataModelUpdate?: DataModelUpdate;
  deleteSurface?: DeleteSurfaceMessage;
}
