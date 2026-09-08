## 1. 设计依据与契约准备

- [x] 1.1 复核 Figma Button 状态、Ghost、Loading 和六个图标来源节点，保存 token/节点映射说明；以规格数值和真实 SVG 来源记录完整为验收
- [x] 1.2 为 Button 与六个图标分析 Props/默认值、Slots、Events、渲染语义、边界、类型及出口，形成共置契约与验证说明；明确四层测试适用性且覆盖组合边界

## 2. SVG 资产与图标组件

- [x] 2.1 获取六个真实原始 SVG，建立节点、日期和内容校验值清单；核对 24×24 viewBox、路径和描边与 Figma 来源一致，Loading 仅取初始帧
- [x] 2.2 实现确定性 SVG 到 Vue SFC 的转换及检查模式，规范化 currentColor 和根尺寸并拒绝不支持结构；验证几何保持、重复生成无差异和异常输入明确失败
- [x] 2.3 生成六个具名内联 SVG 组件及 IconProps，实现 size/color/attrs 和独立安装；逐个通过黑盒 unit 验证默认值、动态更新、图形语义、公共类型及出口
- [x] 2.4 添加共置最小图标 integration Fixture；验证无组件 CSS 时独立显示、数字与 em 尺寸、currentColor/显式颜色、多实例及无新增焦点行为

## 3. Button 与浅色主题

- [x] 3.1 迁移变体为 primary/warning/success/error/text、默认 primary，新增 ghost/iconOnly/suffixIcon；更新公共类型、变体常量及源码出口测试，验证旧 default/danger 类型不再接受
- [x] 3.2 对齐 lightPreset 与 Button token 的尺寸、字体、圆角、状态颜色、焦点和阴影，将 Danger 字段迁移 Error 并同步白名单；通过类型检查和计算样式测试验证规格数值及覆盖优先级
- [x] 3.3 实现前后图标、纯图标及 Loading 替换，Button 内部仅引用 Loading；验证三槽顺序、缺省不占位、16 px 图标、800 ms 旋转、iconOnly+block 和 text+ghost 规则
- [x] 3.4 实现 focus-visible 与语义点击外环，统一原生鼠标/Enter/Space 激活路径；通过 integration 验证一次业务 click、600 ms/5 px 波纹、连续重启、禁用加载清理及布局不变
- [x] 3.5 完善 Button unit 与原生表单 integration 回归；验证 disabled/loading 组合、状态恢复、attrs、submit/reset、空槽和三档尺寸，断言基于公共可观察输出

## 4. 公共发布与移除 dark

- [x] 4.1 增加包根及 icons 集合导出、默认插件图标注册和 ESM/CJS/声明构建入口，不增加单图标子路径或 CSS 入口；通过源码出口测试及共享包消费 Fixture 验证六个组件和 IconProps
- [x] 4.2 删除 dark 预设、构建与导出映射、测试类型路径和源码引用；构建后验证 themes/dark 无法解析，light 与 Provider 仍可独立消费
- [x] 4.3 将 Provider 暗色用例改为浅色自定义覆盖；验证嵌套、重置、响应式、输入不变、Teleport、SSR/hydration 和请求隔离契约继续通过
- [x] 4.4 扩展 package 契约测试；验证两个图标入口的 ESM/CJS/类型、单图标子路径拒绝、图标无 CSS 依赖、根及集合具名导入 tree shaking、Button 仅保留必要 Loading、npm 边界及已有样式契约

## 5. 文档、预览与消费链路

- [x] 5.1 更新 Button Story 状态矩阵、图标组合与独立图标 Docs，移除暗色工具栏和别名；通过 Storybook 类型检查及公共入口检查验证新 API 示例完整
- [x] 5.2 更新 README 和主题文档，写明 default/danger/Error token/dark 迁移与两种图标导入；检索确认当前文档无旧 API 使用示例、单图标子路径推荐或暗色支持承诺
- [x] 5.3 更新最小 dist 消费应用及代表性 E2E，覆盖全量安装、按需按钮+图标、加载提交和浅色覆盖；运行 Chromium 消费测试验证公共 JS/CSS 入口与业务结果

## 6. 综合验收

- [x] 6.1 运行图标生成检查及 `pnpm type-check`（含 `type-check:test`）、`pnpm lint`、`pnpm format:check`；修复失败并记录实际命令结果
- [x] 6.2 运行 `pnpm test:unit`、`pnpm test:integration`、`pnpm test:e2e`、`pnpm test:package`；记录四层适用原因、通过结果及实际限制，不用 Storybook 替代自动化验收
- [x] 6.3 复核本变更实现与五份规格、迁移说明及发布边界一致，完成变更说明；确认无 default/danger/dark 遗留公共入口、无单图标子路径、无远程图标依赖

## 7. 用户补充调整

- [x] 7.1 使用 @xmldom/xmldom 严格解析 SVG，补充非法 XML 测试
- [x] 7.2 清理 assets 固定颜色与画布背景，使用 currentColor 并更新来源校验和生成文件
- [x] 7.3 Figma Loading 收敛为单一组件，保留原节点与实例引用并验证
- [x] 7.4 运行完整质量检查并同步说明文档
