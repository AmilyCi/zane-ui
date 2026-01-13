import type { DefaultProps, Instance } from './types';

import { useNamespace } from '../../hooks';
import animateFill from './plugins/animateFill';
import followCursor from './plugins/followCursor';
import inlinePositioning from './plugins/inlinePositioning';
import sticky from './plugins/sticky';
import { render } from './utils/render';

const ns = useNamespace('tooltip');

export const ROUND_ARROW =
  '<svg width="16" height="6" xmlns="http://www.w3.org/2000/svg"><path d="M0 6s1.796-.013 4.67-3.615C5.851.9 6.93.006 8 0c1.07-.006 2.148.887 3.343 2.385C14.233 6.005 16 6 16 6H0z"></svg>';

export const DATASET_PREFIX = `data-${ns.b()}`;

export const BOX_CLASS = `${ns.b()}-box`;

export const CONTENT_CLASS = `${ns.b()}-content`;

export const BACKDROP_CLASS = `${ns.b()}-backdrop`;

export const ARROW_CLASS = `${ns.b()}-arrow`;

export const SVG_ARROW_CLASS = `${ns.b()}-svg-arrow`;

export const TOUCH_OPTIONS = { capture: true, passive: true };

export const TIPPY_DEFAULT_APPEND_TO = () => document.body;

export const mountedInstances: Instance[] = [];

export const pluginProps = {
  animateFill: false,
  followCursor: false,
  inlinePositioning: false,
  sticky: false,
};

export const renderProps = {
  allowHTML: false,
  animation: 'fade',
  arrow: true,
  content: '',
  inertia: false,
  maxWidth: 350,
  role: 'tooltip',
  theme: '',
  zIndex: 9999,
};

export const defaultProps: DefaultProps = {
  appendTo: TIPPY_DEFAULT_APPEND_TO,
  aria: {
    content: 'auto',
    expanded: 'auto',
  },
  delay: 0,
  duration: [300, 250],
  getReferenceClientRect: null,
  hideOnClick: true,
  ignoreAttributes: false,
  interactive: false,
  interactiveBorder: 2,
  interactiveDebounce: 0,
  moveTransition: '',
  offset: [0, 10],
  onAfterUpdate() {},
  onBeforeUpdate() {},
  onClickOutside() {},
  onCreate() {},
  onDestroy() {},
  onHidden() {},
  onHide() {
    return undefined;
  },
  onMount() {},
  onShow() {
    return undefined;
  },
  onShown() {},
  onTrigger() {},
  onUntrigger() {},
  placement: 'top',
  plugins: [animateFill, followCursor, inlinePositioning, sticky],
  popperOptions: {},
  render,
  showOnCreate: false,
  touch: true,
  trigger: 'mouseenter focus',
  triggerTarget: null,
  ...pluginProps,
  ...renderProps,
};

export const defaultKeys = Object.keys(defaultProps);
