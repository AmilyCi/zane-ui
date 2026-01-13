import type {
  HideAll,
  HideAllOptions,
  Instance,
  Props,
  Targets,
} from './types';

import { isElement } from '../../utils';
import { defaultProps, mountedInstances } from './constants';
import {
  bindGlobalEventListeners,
  createTippy,
  currentInput,
  getArrayOfElements,
  isReferenceElement,
  setDefaultProps,
} from './utils';

export const hideAll: HideAll = ({
  duration,
  exclude: excludedReferenceOrInstance,
}: HideAllOptions = {}) => {
  mountedInstances.forEach((instance) => {
    let isExcluded = false;

    if (excludedReferenceOrInstance) {
      isExcluded = isReferenceElement(excludedReferenceOrInstance)
        ? instance.reference === excludedReferenceOrInstance
        : instance.popper === (excludedReferenceOrInstance as Instance).popper;
    }

    if (!isExcluded) {
      const originalDuration = instance.props.duration;

      instance.setProps({ duration });
      instance.hide();

      if (!instance.state.isDestroyed) {
        instance.setProps({ duration: originalDuration });
      }
    }
  });
};

function tippy(
  targets: Targets,
  optionalProps: Partial<Props> = {},
): Instance | Instance[] {
  const plugins = defaultProps.plugins.concat(optionalProps.plugins || []);

  bindGlobalEventListeners();

  const passedProps: Partial<Props> = { ...optionalProps, plugins };

  const elements = getArrayOfElements(targets);

  const instances = elements.reduce<Instance[]>(
    (acc, reference): Instance[] => {
      const instance = reference && createTippy(reference, passedProps);

      if (instance) {
        acc.push(instance);
      }

      return acc;
    },
    [],
  );

  return isElement(targets) ? instances[0] : instances;
}

tippy.defaultProps = defaultProps;
tippy.setDefaultProps = setDefaultProps;
tippy.currentInput = currentInput;

export default tippy;
