## MODIFIED Requirements

### Requirement: 覆盖 Button 关键状态

Storybook SHALL 展示 `SButton` 的基础用法、五种变体、三档尺寸、禁用、加载、块级布局、Ghost、前后图标、纯图标、事件、键盘焦点及点击波纹，并 SHALL 支持检查浅色自定义覆盖、RTL 与常见视口。工作台 MUST 移除内置 dark 切换及暗色示例。

#### Scenario: 检查 Button 状态矩阵

- **WHEN** 维护者打开 Button 预览
- **THEN** 可以查看 Figma 对应状态及图标组合，并观察业务事件及反馈

#### Scenario: 检查不同显示环境

- **WHEN** 维护者调整浅色覆盖、RTL 或预览视口
- **THEN** Button Story 在所选环境中重新呈现，无需修改组件源码，且不存在内置暗色切换选项

## ADDED Requirements

### Requirement: 展示独立图标组件

Storybook SHALL 从包根公共入口展示六个图标组件，说明 size、color、颜色继承和 Button 插槽使用，文档 SHALL 说明包根与 icons 两种公共导入方式，不展示单图标子路径。图标预览 SHALL 遵循现有工作台职责，不代替自动化测试。

#### Scenario: 查阅图标用法

- **WHEN** 使用者打开图标 Docs
- **THEN** 能查看六个真实图形、调整尺寸颜色，并找到独立使用和按钮组合示例
