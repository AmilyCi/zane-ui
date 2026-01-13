import type { Props } from '../types';

import { defaultProps } from '../constants';

export function getExtendedPassedProps(
  passedProps: Partial<Props> & Record<string, unknown>,
): Partial<Props> {
  const plugins = passedProps.plugins || [];
  const pluginProps = plugins.reduce<Record<string, unknown>>((acc, plugin) => {
    const { defaultValue, name } = plugin;

    if (name) {
      acc[name] =
        passedProps[name] === undefined
          ? ((defaultProps as any)[name] ?? defaultValue)
          : passedProps[name];
    }

    return acc;
  }, {});

  return {
    ...passedProps,
    ...pluginProps,
  };
}
