import { Component, Event, h, Prop, State, Element, type EventEmitter, Watch, Method } from '@stencil/core';
import type {
  TransferCheckedState,
  TransferDataItem,
  TransferDirection,
  TransferFormat,
  TransferKey,
  TransferPropsAlias
} from './types';
import { useNamespace } from '../../hooks';
import { isEmpty, debugWarn, type ReactiveObject, isUndefined } from '../../utils';
import type { FormItemContext } from '../form/types';
import { getFormItemContext } from '../form/utils';
import state from '../../global/store';
import classNames from 'classnames';

const { t } = state.i18n;

const ns = useNamespace('transfer');

@Component({
  tag: 'zane-transfer',
  styleUrl: 'zane-transfer.scss'
})
export class ZaneTransfer {
  @Element() el: HTMLElement;

  @Prop() data: TransferDataItem[] = [];

  @Prop() titles: [string, string] = [] as unknown as [string, string];

  @Prop() buttonTexts: [string, string] = [] as unknown as [string, string];

  @Prop() filterPlaceholder: string;

  @Prop() filterMethod: (query: string, item: TransferDataItem) => boolean;

  @Prop() leftDefaultChecked: TransferKey[] = [];

  @Prop() rightDefaultChecked: TransferKey[] = [];

  @Prop() renderContent: Function;

  @Prop({ mutable: true }) value: TransferKey[] = [];

  @Prop() format: TransferFormat = {};

  @Prop() filterable: boolean = false;

  @Prop() props: TransferPropsAlias = {
    label: 'label',
    key: 'key',
    disabled: 'disabled'
  };

  @Prop() targetOrder: 'push' | 'unshift' | 'original' = 'original';

  @Prop() validateEvent: boolean = true;

  @Event({ eventName: 'zChange', bubbles: false })
  changeEvent: EventEmitter<{
    value: TransferKey[];
    direction: 'left' | 'right';
    movedKeys: TransferKey[];
  }>;

  @Event({ eventName: 'zLeftCheckChange', bubbles: false })
  leftCheckChangeEvent: EventEmitter<{
    value: TransferKey[];
    movedKeys?: TransferKey[];
  }>;

  @Event({ eventName: 'zRightCheckChange', bubbles: false })
  rightCheckChangeEvent: EventEmitter<{
    value: TransferKey[];
    movedKeys?: TransferKey[];
  }>;

  @State() checkedState: TransferCheckedState = {
    leftChecked: [],
    rightChecked: []
  };

  @State() propsAlias: TransferPropsAlias = {
    label: 'label',
    key: 'key',
    disabled: 'disabled'
  };

  @State() hasButtonTexts: boolean = false;

  @State() leftPanelTitle: string = '';

  @State() rightPanelTitle: string = '';

  @State() panelFilterPlaceholder: string = '';

  @State() dataObj: TransferDataItem = {};

  @State() sourceData: TransferDataItem[] = [];

  @State() targetData: TransferDataItem[] = [];

  private formItemContext: ReactiveObject<FormItemContext>;

  private leftPanelRef: HTMLZaneTransferPanelElement;

  private rightPanelRef: HTMLZaneTransferPanelElement;

  @Watch('props')
  watchProps() {
    this.propsAlias = {
      label: this.props.label || 'label',
      key: this.props.key || 'key',
      disabled: this.props.disabled || 'disabled'
    };
  }

  @Watch('data')
  @Watch('propsAlias')
  handleUpdateDataObj() {
    this.dataObj = this.data.reduce((obj, item) => (obj[item[this.propsAlias.key]] = item) && obj, {});
  }

  @Watch('value')
  @Watch('data')
  @Watch('dataObj')
  @Watch('targetOrder')
  handleUpdateSourceTargetData() {
    this.sourceData = this.data.filter(item => !this.value.includes(item[this.propsAlias.key]));
    if (this.targetOrder === 'original') {
      this.targetData = this.data.filter(item => this.value.includes(item[this.propsAlias.key]));
    } else {
      this.targetData = this.value.reduce(
        (arr: TransferDataItem[], key: TransferKey) => {
          const item = this.dataObj[key];
          if (item) {
            arr.push(item);
          }
          return arr;
        },
        []
      );
    }
  }

  @Watch('buttonTexts')
  watchButtonTexts() {
    this.hasButtonTexts = this.buttonTexts?.length === 2;
  }

  @Watch('titles')
  watchTitles() {
    this.leftPanelTitle = this.titles?.[0] || t('transfer.title1');
    this.rightPanelTitle = this.titles?.[1] || t('transfer.title2');
  }

  @Watch('filterPlaceholder')
  watchFilterPlaceholder() {
    this.panelFilterPlaceholder = this.filterPlaceholder || t('transfer.filterPlaceholder');
  }

  @Watch('value')
  watchValue() {
    if (this.validateEvent) {
      this.formItemContext?.value.validate('change').catch((err) => debugWarn(err));
    }
  }

  @Method()
  async getLeftPanelRef() {
    return this.leftPanelRef;
  }

  @Method()
  async clearQuery(which: TransferDirection) {
    switch (which) {
      case 'left':
        this.leftPanelRef.updateQuery('');
        break;
      case 'right':
        this.rightPanelRef.updateQuery('');
        break;
    }
  }

  @Method()
  async getRightPanelRef() {
    return this.rightPanelRef;
  }

  componentWillLoad() {
    this.formItemContext = getFormItemContext(this.el);

    this.watchProps();
    this.handleUpdateDataObj();
    this.watchButtonTexts();
    this.watchTitles();
    this.watchFilterPlaceholder();
  }

  private onSourceCheckedChange = (
    event: CustomEvent<{
      value: TransferKey[];
      movedKeys?: TransferKey[];
    }>
  ) => {
    const { value, movedKeys } = event.detail;
    this.checkedState = {
      ...this.checkedState,
      leftChecked: value,
    }

    if (!movedKeys) {
      return;
    }

    this.leftCheckChangeEvent.emit({
      value,
      movedKeys
    });
  }

  private onTargetCheckedChange = (
    event: CustomEvent<{
      value: TransferKey[];
      movedKeys?: TransferKey[];
    }>
  ) => {
    const { value, movedKeys } = event.detail;
    this.checkedState = {
      ...this.checkedState,
      rightChecked: value,
    }

    if (!movedKeys) {
      return;
    }

    this.rightCheckChangeEvent.emit({
      value,
      movedKeys
    });
  }

  private addToLeft = () => {
    const currentValue = this.value.slice();

    this.checkedState.rightChecked.forEach((item) => {
      const index = currentValue.indexOf(item);
      if (index !== -1) {
        currentValue.splice(index, 1);
      }
    });
    this.value = currentValue;
    this.changeEvent.emit({
      value: currentValue,
      direction: 'left',
      movedKeys: this.checkedState.rightChecked
    });
  }

  private addToRight = () => {
    let currentValue = this.value.slice();

    const itemsToBeMoved = this.data.filter((item: TransferDataItem) => {
      const key = item[this.propsAlias.key];
      return (
        this.checkedState.leftChecked.includes(key) && !this.value.includes(key)
       );
    }).map((item) => item[this.propsAlias.key]);

    currentValue = this.targetOrder === 'unshift'
      ? itemsToBeMoved.concat(currentValue)
      : currentValue.concat(itemsToBeMoved);

    if (this.targetOrder === 'original') {
      currentValue = this.data
        .filter(item => currentValue.includes(item[this.propsAlias.key]))
        .map(item => item[this.propsAlias.key]);
    }

    this.value = currentValue;
    this.changeEvent.emit({
      value: currentValue,
      direction: 'right',
      movedKeys: this.checkedState.leftChecked
    });
  }

  private optionRender = (option: TransferDataItem) => {
    if (this.renderContent) {
      return this.renderContent(h, option);
    }
    return (<span>{option[this.propsAlias.label] || option[this.propsAlias.key]}</span>);
  }

  render() {
    return (
      <div class={ns.b()}>
        <zane-transfer-panel
          ref={(el) => (this.leftPanelRef = el)}
          data={this.sourceData}
          placeholder={this.panelFilterPlaceholder}
          title={this.leftPanelTitle}
          filterable={this.filterable}
          format={this.format}
          filterMethod={this.filterMethod}
          defaultChecked={this.leftDefaultChecked}
          props={this.props}
          optionRender={this.optionRender}
          onZCheckedChange={this.onSourceCheckedChange}
        >
          <span slot="empty">
            <slot name="left-empty"></slot>
          </span>
          <slot name="left-footer"></slot>
        </zane-transfer-panel>
        <div class={ns.e('buttons')}>
          <span>
            <zane-button
              type="primary"
              class={classNames(
                ns.e('button'),
                ns.is('with-texts', this.hasButtonTexts)
              )}
              disabled={isEmpty(this.checkedState.rightChecked)}
              onClick={this.addToLeft}
            >
              <zane-icon name="arrow-left-line"></zane-icon>
              {
                !isUndefined(this.buttonTexts?.[0]) && (
                  <span>{this.buttonTexts[0]}</span>
                )
              }
            </zane-button>
          </span>
          <span>
            <zane-button
              type="primary"
              class={classNames(
                ns.e('button'),
                ns.is('with-texts', this.hasButtonTexts)
              )}
              disabled={isEmpty(this.checkedState.leftChecked)}
              onClick={this.addToRight}
            >
              {
                !isUndefined(this.buttonTexts?.[1]) && (
                  <span>{this.buttonTexts[1]}</span>
                )
              }
              <zane-icon name="arrow-right-line"></zane-icon>
            </zane-button>
          </span>
        </div>
        <zane-transfer-panel
          ref={(el) => (this.rightPanelRef = el)}
          data={this.targetData}
          placeholder={this.panelFilterPlaceholder}
          title={this.rightPanelTitle}
          filterable={this.filterable}
          format={this.format}
          filterMethod={this.filterMethod}
          defaultChecked={this.rightDefaultChecked}
          props={this.props}
          optionRender={this.optionRender}
          onZCheckedChange={this.onTargetCheckedChange}
        >
          <span slot="empty">
            <slot name="right-empty"></slot>
          </span>
          <slot name="right-footer"></slot>
        </zane-transfer-panel>
      </div>
    );
  }
}
