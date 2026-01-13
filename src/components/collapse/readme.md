# zane-collapse



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute              | Description | Type                                               | Default     |
| -------------------- | ---------------------- | ----------- | -------------------------------------------------- | ----------- |
| `accordion`          | `accordion`            |             | `boolean`                                          | `undefined` |
| `beforeCollapse`     | --                     |             | `(name: CollapseActiveName) => Awaitable<boolean>` | `undefined` |
| `expandIconPosition` | `expand-icon-position` |             | `"left" \| "right"`                                | `'right'`   |
| `value`              | `value`                |             | `CollapseActiveName[] \| number \| string`         | `[]`        |


## Events

| Event     | Description | Type                                                    |
| --------- | ----------- | ------------------------------------------------------- |
| `zChange` |             | `CustomEvent<(string \| number)[] \| number \| string>` |
| `zUpdate` |             | `CustomEvent<(string \| number)[] \| number \| string>` |


## Methods

### `setActiveNames(_activeNames: CollapseActiveName[]) => Promise<void>`



#### Parameters

| Name           | Type                   | Description |
| -------------- | ---------------------- | ----------- |
| `_activeNames` | `CollapseActiveName[]` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
