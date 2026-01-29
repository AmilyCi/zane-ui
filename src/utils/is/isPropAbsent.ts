import { isNil } from "./isNil";

export const isPropAbsent = (prop: unknown): prop is null | undefined =>
  isNil(prop)
