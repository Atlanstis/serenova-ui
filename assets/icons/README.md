# 图标与设计来源

SVG 来自 Figma MCP 的整节点导出，文件 key 与节点、日期、SHA-256 见 manifest.json（sha256 为清理后资源，figmaExportSha256 为清理前导出内容）。六个来源组件均无 fills；导出加入的 24×24 #F5F5F5 画布矩形已从仓库资源中去除，真实路径保持不变。Loading 保留原 Phase=0 图形，Figma 现已收敛为单一 Icon/Loading 组件（20:2），不使用裁剪为 20×20 的路径层导出。

Button 页面 3:60；状态矩阵 7:2；图标用法 75:307。高度 28/34/40，最小宽度 64/80/96，水平内边距 12/16/20，间距 8，圆角 6，文字 14/500/20。Ghost 与 GhostPressed 均保持透明背景和同色描边；加载使用对应禁用色。波纹 600ms/5px，旋转 800ms。

仓库资源已移除固定颜色和无用导出元数据，fill/stroke 使用 currentColor，保留 none、透明度和路径几何。组件通过 color 属性或继承外部 CSS color 着色。解析使用开发依赖 @xmldom/xmldom，XML 警告与错误均终止转换。

执行 pnpm icons:generate 生成具名 Vue 组件，pnpm icons:check 校验同步。更新资源时同步来源清单；转换器拒绝未知结构，禁止手工改写生成文件。
