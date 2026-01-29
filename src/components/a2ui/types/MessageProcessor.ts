import type { AnyComponentNode } from "./node/AnyComponentNode";
import type { DataValue } from "./DataValue";
import type { ServerToClientMessage } from "./ServerToClientMessage";
import type { Surface } from "./Surface";

export type MessageProcessor = {
  getSurfaces(): ReadonlyMap<string, Surface>;
  clearSurfaces(): void;
  processMessages(messages: ServerToClientMessage[]): void;
  getData(
    node: AnyComponentNode,
    relativePath: string,
    surfaceId: string,
  ): DataValue | null;
  setData(
    node: AnyComponentNode | null,
    relativePath: string,
    value: DataValue,
    surfaceId: string,
  ): void;
  resolvePath(path: string, dataContextPath?: string): string;
};
