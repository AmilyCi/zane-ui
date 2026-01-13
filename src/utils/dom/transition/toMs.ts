export function toMs(s: string): number {
  if (s === 'auto') return 0;
  return Number(s.slice(0, -1).replace(',', '.')) * 1000;
}
