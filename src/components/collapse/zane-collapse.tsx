import type {
  Awaitable,
  CollapseActiveName,
  CollapseIconPositionType,
  CollapseModelValue,
} from '../../types';

import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import { collapseContexts } from '../../constants';
import { useNamespace } from '../../hooks';
import {
  castArray,
  debugWarn,
  isBoolean,
  isPromise,
  throwError,
} from '../../utils';
import { CollapseContext } from './collapse-context';

const ns = useNamespace('collapse');

const SCOPE = 'zane-collapse';

@Component({
  styleUrl: 'zane-collapse.scss',
  tag: 'zane-collapse',
})
export class ZaneCollapse {
  @Prop() accordion: boolean;

  @State() activeNames: (number | string)[];

  @Prop() beforeCollapse: (name: CollapseActiveName) => Awaitable<boolean>;

  @Element() el: HTMLElement;

  @Prop() expandIconPosition: CollapseIconPositionType = 'right';

  @Prop() value: CollapseModelValue = [];

  @Event({ eventName: 'zChange' })
  zaneChange: EventEmitter<(number | string)[] | number | string>;

  @Event({ eventName: 'zUpdate' })
  zaneUpdate: EventEmitter<(number | string)[] | number | string>;

  get rootKls() {
    return [ns.b(), ns.b(`icon-position-${this.expandIconPosition}`)].join(' ');
  }

  componentWillLoad() {
    this.activeNames = castArray(this.value);
    const context = new CollapseContext();
    context.handleItemClick = this.handleItemClick;
    context.updateActiveNames(this.activeNames);
    collapseContexts.set(this.el, context);
  }

  disconnectedCallback() {
    collapseContexts.delete(this.el);
  }

  handleChange = (name: CollapseActiveName) => {
    if (this.accordion) {
      this.setActiveNames([this.activeNames[0] === name ? '' : name]);
    } else {
      const _activeNames = [...this.activeNames];
      const index = _activeNames.indexOf(name);

      if (index === -1) {
        _activeNames.push(name);
      } else {
        _activeNames.splice(index, 1);
      }
      this.setActiveNames(_activeNames);
    }
  };

  handleItemClick = async (name: CollapseActiveName) => {
    if (!this.beforeCollapse) {
      this.handleChange(name);
      return;
    }

    const shouldChange = this.beforeCollapse(name);
    const isPromiseOrBool = [
      isBoolean(shouldChange),
      isPromise(shouldChange),
    ].includes(true);
    if (!isPromiseOrBool) {
      throwError(
        SCOPE,
        'beforeCollapse must return type `Promise<boolean>` or `boolean`',
      );
    }

    if (isPromise(shouldChange)) {
      shouldChange
        .then((result) => {
          if (result !== false) {
            this.handleChange(name);
          }
        })
        .catch((error) => {
          debugWarn(SCOPE, `some error occurred: ${error}`);
        });
    } else if (shouldChange) {
      this.handleChange(name);
    }
  };

  @Watch('value')
  onModelValueChange() {
    this.activeNames = castArray(this.value);
    collapseContexts.get(this.el)?.updateActiveNames(this.activeNames);
  }

  render() {
    return (
      <Host class={this.rootKls}>
        <slot></slot>
      </Host>
    );
  }

  @Method()
  async setActiveNames(_activeNames: CollapseActiveName[]) {
    this.activeNames = _activeNames;
    const value = this.accordion ? this.activeNames[0] : this.activeNames;
    this.zaneUpdate.emit(value);
    this.zaneChange.emit(value);
    collapseContexts.get(this.el)?.updateActiveNames(this.activeNames);
  }
}
