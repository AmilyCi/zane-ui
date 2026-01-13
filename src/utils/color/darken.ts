import type { TinyColor } from '@ctrl/tinycolor';

export function darken(color: TinyColor, amount = 20) {
  return color.mix('#141414', amount).toString();
}
