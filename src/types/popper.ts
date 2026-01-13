import type { Options, VirtualElement } from '@popperjs/core';

import type { effects, roleTypes, triggers } from '../constants';

export type RoleType = (typeof roleTypes)[number];

export type PopperEffect =
  | (typeof effects)[number]
  | (NonNullable<unknown> & string);

export type PopperTrigger = (typeof triggers)[number];

export type ReferenceElement = HTMLElement | undefined | VirtualElement;

export type PartialOptions = Partial<Options>;
