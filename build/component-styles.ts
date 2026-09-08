import type { Plugin } from 'vite'

/** 从入口的 CSS 依赖闭包生成稳定样式子路径，与 JS 模块格式无关。 */
export function componentStyles(entries: Record<string, string>): Plugin {
  return {
    name: 'serenova-component-styles',
    enforce: 'post',
    generateBundle(_, bundle) {
      const allCss = new Set<string>()
      for (const [entryName, cssPath] of Object.entries(entries)) {
        const entry = Object.values(bundle).find(
          (item) => item.type === 'chunk' && item.isEntry && item.name === entryName,
        )
        if (!entry) this.error(`缺少组件入口：${entryName}`)
        const visited = new Set<string>()
        const css = new Set<string>()
        const visit = (fileName: string) => {
          if (visited.has(fileName)) return
          visited.add(fileName)
          const item = bundle[fileName]
          if (item?.type !== 'chunk') return
          item.imports.forEach(visit)
          item.viteMetadata?.importedCss.forEach((name) => css.add(name))
        }
        visit(entry.fileName)
        if (!css.size) this.error(`组件入口没有样式：${entryName}`)
        const imports = [...css].map((name) => {
          allCss.add(name)
          // 公共组件 CSS 位于组件目录，内部资产统一从 dist 根相对引用。
          return `@import "${'../'.repeat(cssPath.split('/').length - 1)}${name}";`
        })
        this.emitFile({ type: 'asset', fileName: cssPath, source: imports.join('\n') })
      }
      this.emitFile({
        type: 'asset',
        fileName: 'serenova-ui.css',
        source: [...allCss].map((name) => `@import "./${name}";`).join('\n'),
      })
    },
  }
}
