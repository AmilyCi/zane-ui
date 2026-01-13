import type { PopperContext } from '../interfaces';
import type { PopperContentContext } from '../interfaces/PopperContentContext';

export const effects = ['light', 'dark'] as const;

export const triggers = ['click', 'contextmenu', 'hover', 'focus'] as const;

export const roleTypes = [
  'dialog',
  'grid',
  'group',
  'listbox',
  'menu',
  'navigation',
  'tooltip',
  'tree',
] as const;

export const popperContexts = new WeakMap<HTMLElement, PopperContext>();

export const popperContentContexts = new WeakMap<
  HTMLElement,
  PopperContentContext
>();
