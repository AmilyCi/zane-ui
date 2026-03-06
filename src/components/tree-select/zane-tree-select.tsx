import { Component, Element, h, Prop } from '@stencil/core';
import type { OptionType, Props as SelectProps } from '../select/types';
import { Props, type Placement } from 'tippy.js';
import type { ComponentSize } from 'src/types';


@Component({
  tag: 'zane-tree-select',
  styleUrl: 'zane-tree-select.scss'
})
export class ZaneTreeSelect {
  @Element() el: HTMLElement;

  @Prop() allowCreate: boolean;

  @Prop() autocomplete: 'none' | 'list' | 'both' | 'inline' = 'none';

  @Prop() automaticDropdown: boolean;

  @Prop() clearable: boolean;

  @Prop() clearIcon: string = 'close-circle-line';

  @Prop() popperTheme: string;

  @Prop() collapseTags: boolean;

  @Prop() collapseTagsTooltip: boolean;

  @Prop() maxCollapseTags: number = 1;

  @Prop() defaultFirstOption: boolean;

  @Prop() disabled: boolean = undefined;

  @Prop() estimatedOptionHeight: number = undefined;

  @Prop() filterable: boolean;

  @Prop() filterMethod: (query: string) => boolean;

  @Prop() height: number = 274;

  @Prop() itemHeight: number = 34;

  @Prop({ mutable: true }) zId: string;

  @Prop() loading: boolean;

  @Prop() loadingText: string;

  @Prop({ mutable: true }) value: any[] | string | number | Record<string, any> | any = undefined;

  @Prop() multiple: boolean;

  @Prop() multipleLimit: number = 0;

  @Prop() name: string;

  @Prop() noDataText: string;

  @Prop() noMatchText: string;

  @Prop() remoteMethod: (query: string) => any;

  @Prop() reserveKeyword: boolean = true;

  @Prop() options: OptionType[];

  @Prop() placeholder: string;

  @Prop() popperOptions: Props['popperOptions'] = {};

  @Prop() remote: boolean;

  @Prop() debounce: number = 300;

  @Prop() size: ComponentSize;

  @Prop() props: SelectProps = {
    label: 'label',
    value: 'value',
    disabled: 'disabled',
    options: 'options'
  };

  @Prop() valueKey: string = 'value';

  @Prop() scrollbarAlwaysOn: boolean;

  @Prop() validateEvent: boolean = true;

  @Prop() offset: Props['offset'] = [0, 0];

  @Prop() remoteShowSuffix: boolean;

  @Prop() showArrow: boolean = false;

  @Prop() placement: Placement = 'bottom-start';

  @Prop() tagType: 'primary' | 'success' | 'warning' | 'danger' | 'info' = 'info';

  @Prop() tagEffect: 'dark' | 'light' | 'plain' = 'light';

  @Prop({ attribute: 'tabindex' }) zTabindex: number = 0;

  @Prop() fitInputWidth: boolean | number = true;

  @Prop() suffixIcon: string = 'arrow-down-s-line';

  @Prop() emptyValues: any[];

  @Prop() valueOnClear: any = undefined;

  @Prop() label: string;

  @Prop() ariaLabel: string;

  @Prop() tagRender: () => HTMLElement;

  @Prop() tagLabelRender: (label: string, value: string, index: number) => HTMLElement;

  render() {
    return (
      <p>My name is Stencil</p>
    );
  }
}
