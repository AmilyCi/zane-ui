# Timeline 时间线

用于展示一系列信息在时间维度上的进展或流程，样式和 API 与 Element Plus [Timeline](https://element-plus.org/zh-CN/component/timeline) 保持一致。

## 基础用法

基础时间线展示，默认左对齐。

```html
<zane-timeline>
  <zane-timeline-item timestamp="2018-04-15">Event start</zane-timeline-item>
  <zane-timeline-item timestamp="2018-04-13">Approved</zane-timeline-item>
  <zane-timeline-item timestamp="2018-04-11">Success</zane-timeline-item>
</zane-timeline>
```

## Mode 模式

通过 `mode` 属性控制时间线与内容的相对位置，支持四种模式：

| 模式 | 说明 |
|------|------|
| `start` | 左对齐（默认） |
| `end` | 右对齐 |
| `alternate` | 左右交替 |
| `alternate-reverse` | 左右交替（反向起始） |

```html
<zane-timeline mode="alternate">
  <zane-timeline-item timestamp="2018-04-15">Event start</zane-timeline-item>
  <zane-timeline-item timestamp="2018-04-13">Approved</zane-timeline-item>
  <zane-timeline-item timestamp="2018-04-11">Success</zane-timeline-item>
</zane-timeline>
```

## 自定义节点样式

通过以下属性自定义节点外观：

| 属性 | 说明 |
|------|------|
| `type` | 节点类型：`primary` / `success` / `warning` / `danger` / `info` |
| `color` | 自定义颜色 |
| `size` | 节点尺寸：`normal`(12px) / `large`(14px) |
| `icon` | 自定义图标名称（@zanejs/icons） |
| `hollow` | 是否空心节点 |

```html
<zane-timeline>
  <zane-timeline-item type="primary" icon="more-fill" size="large" timestamp="2018-04-12">
    Custom icon
  </zane-timeline-item>
  <zane-timeline-item color="#0bbd87" timestamp="2018-04-03">
    Custom color
  </zane-timeline-item>
  <zane-timeline-item size="large" timestamp="2018-04-03">
    Custom size
  </zane-timeline-item>
  <zane-timeline-item type="primary" hollow timestamp="2018-04-03">
    Custom hollow
  </zane-timeline-item>
</zane-timeline>
```

## 自定义时间戳位置

通过 `placement` 属性控制时间戳显示位置：

```html
<zane-timeline>
  <zane-timeline-item placement="top" timestamp="2018/4/12">
    Update Github template
  </zane-timeline-item>
  <zane-timeline-item placement="top" timestamp="2018/4/3">
    Update Github template
  </zane-timeline-item>
</zane-timeline>
```

## 垂直居中

设置 `center` 属性让节点与内容垂直居中对齐：

```html
<zane-timeline>
  <zane-timeline-item center placement="top" timestamp="2018/4/12">
    Event start
  </zane-timeline-item>
  <zane-timeline-item center placement="top" timestamp="2018/4/3">
    Event end
  </zane-timeline-item>
</zane-timeline>
```

## 反向排序

设置 `reverse` 属性反转时间线顺序：

```html
<zane-timeline id="timelineReverse" reverse>
  <zane-timeline-item timestamp="2018-04-15">Event start</zane-timeline-item>
  <zane-timeline-item timestamp="2018-04-13">Approved</zane-timeline-item>
  <zane-timeline-item timestamp="2018-04-11">Success</zane-timeline-item>
</zane-timeline>

<script>
document.getElementById('timelineReverse').reverse = true;
</script>
```

## 自定义 Dot 节点插槽

使用 `slot="dot"` 插槽完全自定义节点内容：

```html
<zane-timeline>
  <zane-timeline-item timestamp="2018-04-15">
    <span slot="dot"
      style="display:flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:50%;background:#409eff;color:#fff;font-size:10px;position:absolute;left:-2px;">
      <zane-icon name="check-line" style="font-size:10px;"></zane-icon>
    </span>
    Custom dot with icon
  </zane-timeline-item>
  <zane-timeline-item timestamp="2018-04-13">
    <span slot="dot"
      style="display:flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:#f56c6c;color:#fff;position:absolute;left:-3px;">
      <zane-icon name="close-line"></zane-icon>
    </span>
    Custom red dot
  </zane-timeline-item>
  <zane-timeline-item timestamp="2018-04-11">
    <span slot="dot" style="display:flex;align-items:center;justify-content:center;position:absolute;left:-5px;">
      <img src="avatar.png" style="width:22px;height:22px;border-radius:50%;" />
    </span>
    Custom image dot
  </zane-timeline-item>
</zane-timeline>
```

## 所有类型节点

```html
<zane-timeline>
  <zane-timeline-item type="primary" timestamp="Primary">Primary</zane-timeline-item>
  <zane-timeline-item type="success" timestamp="Success">Success</zane-timeline-item>
  <zane-timeline-item type="warning" timestamp="Warning">Warning</zane-timeline-item>
  <zane-timeline-item type="danger" timestamp="Danger">Danger</zane-timeline-item>
  <zane-timeline-item type="info" timestamp="Info">Info</zane-timeline-item>
  <zane-timeline-item timestamp="Default">Default</zane-timeline-item>
</zane-timeline>
```

## 隐藏时间戳

```html
<zane-timeline>
  <zane-timeline-item hide-timestamp>No timestamp 1</zane-timeline-item>
  <zane-timeline-item hide-timestamp>No timestamp 2</zane-timeline-item>
</zane-timeline>
```

---

## API 参考

### zane-timeline (容器组件)

| 属性 | Attribute | 说明 | 类型 | 默认值 |
|------|-----------|------|------|--------|
| mode | mode | 时间线模式：`start` / `end` / `alternate` / `alternate-reverse` | `'start' \| 'alternate' \| 'alternate-reverse' \| 'end'` | `'start'` |
| reverse | reverse | 是否逆序排序 | `boolean` | `false` |

### zane-timeline-item (子项组件)

| 属性 | Attribute | 说明 | 类型 | 默认值 |
|------|-----------|------|------|--------|
| timestamp | timestamp | 时间戳文本 | `string` | `''` |
| hideTimestamp | hide-timestamp | 是否隐藏时间戳 | `boolean` | `false` |
| center | center | 是否垂直居中 | `boolean` | `false` |
| placement | placement | 时间戳位置：`'top'` / `'bottom'` | `'top' \| 'bottom'` | `'bottom'` |
| type | type | 节点类型：`''` / `'primary'` / `'success'` / `'warning'` / `'danger'` / `'info'` | `TimelineItemType` | `''` |
| color | color | 节点颜色（覆盖 type） | `string` | `''` |
| size | size | 节点尺寸：`'normal'`(12px) / `'large'`(14px) | `'normal' \| 'large'` | `'normal'` |
| icon | icon | 自定义图标名称（@zanejs/icons） | `string` | `undefined` |
| hollow | hollow | 是否空心点 | `boolean` | `false` |

### 插槽

| 名称 | 说明 |
|------|------|
| （默认） | 内容区域 |
| dot | 自定义节点（优先于默认圆点渲染） |

### 依赖

- [zane-icon](../icon) — 图标组件
