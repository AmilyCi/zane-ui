import type { Plugin, Props, ReferenceElement } from '../types';

import { defaultKeys, defaultProps } from '../constants';
import { getExtendedPassedProps } from './getExtendedPassedProps';

export function getDataAttributeProps(
  reference: ReferenceElement,
  plugins: Plugin[],
): Record<string, unknown> {
  const propKeys = plugins
    ? Object.keys(getExtendedPassedProps({ ...defaultProps, plugins }))
    : defaultKeys;

  const props = propKeys.reduce(
    (acc: Partial<Props> & Record<string, unknown>, key) => {
      const valueAsString = (
        reference.getAttribute(`data-tippy-${key}`) || ''
      ).trim();

      if (!valueAsString) {
        return acc;
      }

      if (key === 'content') {
        acc[key] = valueAsString;
      } else {
        try {
          acc[key] = JSON.parse(valueAsString);
        } catch {
          acc[key] = valueAsString;
        }
      }

      return acc;
    },
    {},
  );

  return props;
}
