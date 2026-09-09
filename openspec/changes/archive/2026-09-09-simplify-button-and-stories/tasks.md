## 1. 公共契约收敛

- [x] 1.1 依据 Props 默认值、Slots、Events、渲染语义、交互状态、边界、源码类型和公共导出更新 Button 契约与验证说明，明确四层适用性；交付与增量规格一致的说明，记录鼠标、键盘和焦点沿用原生路径
- [x] 1.2 删除 block Prop、默认值、派生状态、class 和专用样式，更新相关单元与集成 Fixture；验证默认按钮及三档纯图标外观保持，普通按钮仍接受消费端宽度样式，旧 block 不再具有内置布局行为
- [x] 1.3 删除 ghostColorText 类型、登记和默认生成，保留其他有效覆盖；通过源码类型断言和文字／语义 Ghost 主题覆盖的可观察输出验证删除边界
- [x] 1.4 同步根入口、单组件公共出口测试及共享包消费 Fixture，验证 ButtonProps 不包含 block、ButtonThemeTokens 不包含 ghostColorText，原有导出和 nativeType 仍可消费

## 2. Storybook 展示重组

- [x] 2.1 删除 Form Story、其状态处理和专用 CSS，清理无用引用；通过源码检索与 Storybook 类型检查确认无表单展示残留，原生 submit/reset 集成用例仍存在
- [x] 2.2 建立六个中文展示主题，保留 Playground 和 Interaction 入口标识，整理类型／Ghost、尺寸、禁用／加载和图标矩阵；通过 Story 定义与模板核对确认恰有六个主题、Text Ghost 标注不适用、无 block 展示
- [x] 2.3 为 Playground 增加仅供展示的文案和图标输入，显式分离公共 Props 与辅助参数，并限制各 Story 的 Controls；通过类型检查和渲染分支核对确认纯图标必有图形、每个可编辑 Control 均被消费
- [x] 2.4 调整 Interaction 计数与 Actions 的统一回调以及 play 的增量断言，支持不可用状态和重复播放，加入小型浅色局部覆盖对照；通过源码核对和类型检查确认鼠标／键盘共用路径、play 无固定累计次数假设且不强行点击禁用按钮
- [x] 2.5 整理矩阵标签、文案和专用 CSS，保留窄视口对应关系与必要横向滚动，补充键盘和波纹使用说明；通过样式和模板审查确认不复制组件状态 CSS、不新增公共状态 Props，记录尚未手动浏览器验收的项目

## 3. 回归验证与迁移说明

- [x] 3.1 更新 Button、Icon、ThemeProvider 中引用 block 旧组合的验证说明，提供 block 到 class/style、删除 ghostColorText 配置及 Story 入口调整的迁移说明；检索当前文档确认无残留有效旧 API 声明，历史归档保持原样
- [x] 3.2 运行 pnpm type-check 和 pnpm test:unit，验证库、Storybook、测试类型以及受影响公共行为，修复失败并记录实际命令结果
- [x] 3.3 运行 pnpm test:integration，验证尺寸、主题覆盖、图标、鼠标与 Enter／Space 的一致业务结果、焦点、波纹及原生 submit/reset；记录结果，不以删除 Form 为由删除表单测试
- [x] 3.4 运行 pnpm test:e2e 和 pnpm test:package，验证当前 dist 的全量／按需消费、加载提交、局部覆盖以及 ESM/CJS、声明、CSS、插件、导出映射和文件边界；记录结果，不增加 Storybook E2E
- [x] 3.5 执行格式与 lint 检查并修复本次引入的问题，复核增量规格和实现范围；在变更目录记录四层适用性、质量结果及未执行的人工展示验证，确认未扩大到 Pressed 偏移、投影或其他主题字段清理
