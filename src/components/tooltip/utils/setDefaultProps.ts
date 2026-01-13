import type { DefaultProps, Tippy } from '../types';

import { defaultProps } from '../constants';

export const setDefaultProps: Tippy['setDefaultProps'] = (partialProps) => {
  const keys = Object.keys(partialProps) as Array<keyof DefaultProps>;
  keys.forEach((key) => {
    (defaultProps as any)[key] = partialProps[key];
  });
};
