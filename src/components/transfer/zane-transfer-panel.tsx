import { Component, Event, h, Prop, State, Watch, Element, type EventEmitter, type VNode, Method, Host } from '@stencil/core';
import type { TransferDataItem, TransferFormat, TransferKey, TransferPanelState, TransferPropsAlias } from './types';
import { useNamespace } from '../../hooks';
import state from '../../global/store';
import { isEmpty, isFunction } from '../../utils';
import type { CheckboxGroupValueType, CheckboxValueType } from '../checkbox/types';
import isEqual from 'lodash-es/isEqual';
import classNames from 'classnames';

const { t } = state.i18n;

const ns = useNamespace('transfer');

const OptionContent = ({ option }: { option?: VNode | VNode[] }) => option;

@Component({
  tag: 'zane-transfer-panel',
})
export class ZaneTransferPanel {
  @Element() el: HTMLElement;

  @Prop() data: TransferDataItem[] = [];

  @Prop() optionRender: (option: TransferDataItem) => VNode | VNode[];

  @Prop() placeholder: string;

  @Prop({ attribute: 'title' }) zTitle: string;

  @Prop() filterable: boolean = false;

  @Prop() filterMethod: (query: string, item: TransferDataItem) => boolean;

  @Prop() format: TransferFormat = {};

  @Prop() defaultChecked: TransferKey[] = [];

  @Prop() props: TransferPropsAlias = {
    label: 'label',
    key: 'key',
    disabled: 'disabled'
  };

  @Event({ eventName: 'zCheckedChange', bubbles: false })
  checkedChangeEvent: EventEmitter<{
    value: TransferKey[];
    movedKeys?: TransferKey[];
  }>;

  @State() panelState: TransferPanelState = {
    checked: [],
    allChecked: false,
    query: '',
    checkChangeByUser: true
  }

  @State() propsAlias: TransferPropsAlias = {
    label: 'label',
    key: 'key',
    disabled: 'disabled'
  };

  @State() filteredData: TransferDataItem[] = [];

  @State() checkableData: TransferDataItem[] = [];

  @State() checkedSummary: string = '';

  @State() isIndeterminate: boolean = false;

  @State() hasNoMatch: boolean = false;

  private hasFooter: boolean = false;

  @Watch('props')
  watchProps() {
    this.propsAlias = {
      label: this.props.label || 'label',
      key: this.props.key || 'key',
      disabled: this.props.disabled || 'disabled'
    };
  }

  @Watch('data')
  @Watch('filterMethod')
  @Watch('propsAlias')
  handleUpdateFilteredData() {
    this.filteredData = this.data.filter((item) => {
      if (isFunction(this.filterMethod)) {
        return this.filterMethod(this.panelState.query, item);
      } else {
        const label = String(item[this.propsAlias.label] || item[this.propsAlias.key]);
        return label.toLowerCase().includes(this.panelState.query.toLowerCase());
      }
    });
  }

  @Watch('filteredData')
  @Watch('propsAlias')
  handleUpdateCheckableData() {
    this.checkableData = this.filteredData.filter(item => !item[this.propsAlias.disabled]);
  }

  @Watch('checkableData')
  handleCheckableDataChange() {
    this.updateAllChecked();
  }

  @Watch('panelState')
  @Watch('format')
  @Watch('data')
  handleUpdateCheckedSummary() {
    const checkedCount = this.panelState.checked.length;
    const dataCount = this.data.length;
    const { noChecked, hasChecked } = this.format;

    if (noChecked && hasChecked) {
      this.checkedSummary = checkedCount > 0
        ? hasChecked.replace(/\${checked}/g, String(checkedCount)).replace(/\${total}/g, String(dataCount))
        : noChecked.replace(/\${total}/g, String(dataCount));
    } else {
      this.checkedSummary = `${checkedCount}/${dataCount}`;
    }
  }

  @Watch('panelState')
  handleUpdateIsIndeterminate() {
    const checkedCount = this.panelState.checked.length;
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkableData.length;
  }

  @Watch('filteredData')
  handleFilteredDataChange() {
    const checked: TransferKey[] = [];
    const filteredDataKeys = this.filteredData.map(item => item[this.propsAlias.key]);
    this.panelState.checked.forEach(key => {
      if (filteredDataKeys.includes(key)) {
        checked.push(key);
      }
    });
    this.panelState = {
      ...this.panelState,
      checked,
      checkChangeByUser: false
    }
  }

  @Watch('defaultChecked')
  watchDefaultChecked(val?: TransferKey[], oldVal?: TransferKey[]) {
    val = val || this.defaultChecked;
    if (oldVal
      && val.length === oldVal.length
      && val.every(key => oldVal.includes(key))) {
      return;
    }

    const checked: TransferKey[] = [];
    const filteredDataKeys = this.filteredData.map(item => item[this.propsAlias.key]);
    val.forEach(key => {
      if (filteredDataKeys.includes(key)) {
        checked.push(key);
      }
    });
    this.panelState = {
      ...this.panelState,
      checked,
      checkChangeByUser: false
    }
  }

  @Watch('panelState')
  handlePanelStateChange(newValue: TransferPanelState, oldValue: TransferPanelState) {
    const { checked: newChecked } = newValue;
    const { checked: oldChecked } = oldValue;
    if (!isEqual(newChecked, oldChecked)) {
      this.updateAllChecked();

      if (newValue.checkChangeByUser) {
        const moveKeys = newChecked.concat(oldChecked)
          .filter(key => !newValue.checked.includes(key) || !oldValue.checked.includes(key));
        this.checkedChangeEvent.emit({
          value: newChecked,
          movedKeys: moveKeys
        });
      } else {
        this.panelState.checkChangeByUser = true;
        this.checkedChangeEvent.emit({
          value: newChecked
        });
      }
    }
  }

  @Watch('panelState')
  @Watch('filteredData')
  handleUpdateHasNoMatch() {
    this.hasNoMatch = !isEmpty(this.panelState.query) && isEmpty(this.filteredData);
  }

  @Method()
  async updateQuery(query: string) {
    this.panelState = {
      ...this.panelState,
      query
    }
  }

  private updateAllChecked = () => {
    const checkableKeys = this.checkableData.map(item => item[this.propsAlias.key]);
    this.panelState = {
      ...this.panelState,
      allChecked: checkableKeys.length > 0 && checkableKeys.every(key => this.panelState.checked.includes(key))
    }
  }

  private handleCheckedChange = (value: CheckboxGroupValueType) => {
    this.panelState = {
      ...this.panelState,
      checked: value as TransferKey[]
    }
  }

  private handleAllCheckedChange = (value: CheckboxValueType) => {
    this.panelState = {
      ...this.panelState,
      checked: value ? this.checkableData.map(item => item[this.propsAlias.key]) : [],
    }
  }

  componentWillLoad() {
    this.hasFooter = this.el.childNodes.length > 0;
    this.watchProps();
    this.watchDefaultChecked();
    this.handleUpdateFilteredData();
    this.handleUpdateCheckedSummary();
    this.handleUpdateIsIndeterminate();
    this.handleUpdateHasNoMatch();
  }

  render() {
    const { allChecked, checked, query } = this.panelState;
    return (
      <Host class={ns.b('panel')}>
        <p class={ns.be('panel', 'header')}>
          <zane-checkbox
            value={allChecked}
            indeterminate={this.isIndeterminate}
            validateEvent={false}
            onZChange={(e) => this.handleAllCheckedChange(e.detail)}
          >
            <span class={ns.be('panel', 'header-title')}>{this.zTitle}</span>
            <span class={ns.be('panel', 'header-count')}>{this.checkedSummary}</span>
          </zane-checkbox>
        </p>
        <div
          class={classNames(
            ns.be('panel', 'body'),
            ns.is('with-footer', this.hasFooter)
          )}
        >
          {
            this.filterable && (
              <zane-input
                value={query}
                class={ns.be('panel', 'filter')}
                size='default'
                placeholder={this.placeholder}
                prefixIcon='search-line'
                validateEvent={false}
                clearable
              ></zane-input>
            )
          }
            <zane-scrollbar
              class={classNames(
                ns.is('filterable', this.filterable),
                ns.be('panel', 'list')
              )}
            >
              <zane-checkbox-group
                value={checked}
                style={{
                  display: !this.hasNoMatch && !isEmpty(this.data) ? 'block' : 'none'
                }}
                validateEvent={false}
                onZChange={(e) => this.handleCheckedChange(e.detail)}
              >
                {
                  this.filteredData.map(item => (<zane-checkbox
                    key={item[this.propsAlias.key]}
                    class={ns.be('panel', 'item')}
                    value={item[this.propsAlias.key]}
                    disabled={item[this.propsAlias.disabled]}
                    validateEvent={false}
                  >
                    <OptionContent option={this.optionRender?.(item)} />
                  </zane-checkbox>))
                }
              </zane-checkbox-group>
            </zane-scrollbar>
          <div>
            <slot name="empty">
              {this.hasNoMatch ? t('transfer.noMatch') : t('transfer.noData') }
            </slot>
          </div>
        </div>
        {
          this.hasFooter && (<p class={ns.be('panel', 'footer')}>
            <slot></slot>
          </p>)
        }
      </Host>
    );
  }
}
