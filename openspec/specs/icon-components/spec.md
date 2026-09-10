# icon-components Specification

## Purpose

定义 Serenova UI 可在按钮内部及外部独立消费的六个 SVG 图标组件，约束真实设计来源、尺寸与颜色继承、原生属性透传及自包含的内联 SVG 使用方式，使设计资产与公共组件接口保持一致且可验证。

## Requirements

### Requirement: 提供真实矢量图标组件

组件库 MUST 提供 `SIconAdd`、`SIconDelete`、`SIconEdit`、`SIconSearch`、`SIconArrowRight`、`SIconLoading`，外观来自 Figma 对应真实矢量。每个组件 MUST 渲染内联 SVG，保留 24×24 viewBox 和路径几何；图形 MUST 由组件内声明的 SVG 节点与路径直接构成。Loading SHALL 提供单个静态图形，其在 Button 内的旋转由 Button 加载状态决定。

#### Scenario: 独立渲染图标

- **WHEN** 消费端挂载任意图标并直接使用默认配置
- **THEN** 仅凭图标自身的内联 SVG 内容显示对应图形

#### Scenario: 多实例同时存在

- **WHEN** 页面同时渲染同一个图标的多个实例
- **THEN** 各实例图形完整，SVG 标识符引用在多实例场景下保持正确且相互隔离

### Requirement: 支持尺寸颜色及原生属性

图标 MUST 公开 `IconProps`，包含 `size?: number | string` 和 `color?: string`。size 默认 SHALL 为 24，数字按 px 解释，字符串作为 CSS 尺寸，宽高相等；缺省 color SHALL 使用 currentColor 继承父级文字颜色，显式 color SHALL 控制图形颜色。class、style、data 及调用方提供的原生 SVG 属性 SHALL 透传至根 SVG。组件 SHALL 仅通过上述 Props 和原生属性提供静态图形能力，焦点与鼠标键盘事件 SHALL 沿用原生 SVG 行为。

#### Scenario: 设置尺寸并响应变化

- **WHEN** 使用者将 size 从 16 改为 `2em`
- **THEN** 图标宽高响应更新，viewBox 和比例保持一致

#### Scenario: 继承及覆盖颜色

- **WHEN** 图标在带文字颜色的容器中渲染，并随后提供显式 color
- **THEN** 缺省时继承容器颜色，显式设置后使用指定颜色；移除 color 后恢复继承

#### Scenario: 透传业务属性

- **WHEN** 使用者提供 class、style 和 data 属性
- **THEN** 根 SVG 保留这些属性，消费端可按原生规则设置样式
