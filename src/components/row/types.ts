import type { RowAlign, RowJustify } from "./constants";

export interface RowContext {
  gutter: number;
}

export type RowJustifyType = (typeof RowJustify)[number];

export type RowAlignType = (typeof RowAlign)[number];
