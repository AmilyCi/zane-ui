# zane-focus-trap



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute          | Description | Type                                    | Default     |
| --------------- | ------------------ | ----------- | --------------------------------------- | ----------- |
| `focusStartEl`  | `focus-start-el`   |             | `"container" \| "first" \| HTMLElement` | `'first'`   |
| `focusTrapEl`   | --                 |             | `HTMLElement`                           | `undefined` |
| `loop`          | `loop`             |             | `boolean`                               | `false`     |
| `trapOnFocusIn` | `trap-on-focus-in` |             | `boolean`                               | `true`      |
| `trapped`       | `trapped`          |             | `boolean`                               | `false`     |


## Events

| Event                 | Description | Type                            |
| --------------------- | ----------- | ------------------------------- |
| `zFocusAfterReleased` |             | `CustomEvent<Event>`            |
| `zFocusAfterTrapped`  |             | `CustomEvent<Event>`            |
| `zFocusIn`            |             | `CustomEvent<FocusEvent>`       |
| `zFocusOut`           |             | `CustomEvent<FocusEvent>`       |
| `zFocusOutPrevented`  |             | `CustomEvent<CustomEvent<any>>` |
| `zReleaseRequested`   |             | `CustomEvent<Event>`            |


## Methods

### `updateFocusTrap() => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
