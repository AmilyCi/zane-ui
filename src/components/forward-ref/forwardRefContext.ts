import type { ForwardRefSetter } from '../../types';

import { ForwardRefContext as IForwardRefContext } from '../../interfaces';

export class ForwardRefContext implements IForwardRefContext {
  public setForwardRef: ForwardRefSetter;
}
