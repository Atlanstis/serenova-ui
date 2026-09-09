import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { relative } from 'node:path'
import type { Plugin } from 'vite'

const runtime = fileURLToPath(new URL('../src/shared/component-styles.ts', import.meta.url))

/** 复用 Vue 编译后的 style 请求；inline 获得经过 scoped 和资源处理的 CSS。 */
export function autoComponentStyles(): Plugin {
  let building = false
  let root = ''
  return {
    name: 'serenova-auto-component-styles',
    enforce: 'post',
    configResolved(config) {
      building = config.command === 'build'
      root = config.root
    },
    transform(code, id) {
      if (!id.endsWith('.vue')) return
      const styles: { name: string; request: string; id: string }[] = []
      const transformed = code.replace(
        /import\s+["']([^"']+\?vue&type=style[^"']*)["'];?/g,
        (_statement, request: string) => {
          const name = `__serenova_css_${styles.length}`
          const key = createHash('sha256')
            .update(relative(root, id) + request.slice(request.indexOf('?')))
            .digest('hex')
            .slice(0, 16)
          const inline = request.replace('?vue&', '?vue&inline&')
          styles.push({ name, request: inline, id: key })
          return `import ${name} from ${JSON.stringify(inline)};`
        },
      )
      if (!styles.length) return
      const exported = /export default ([\s\S]*?);?\s*$/.exec(transformed)
      if (!exported) this.error(`无法关联组件默认导出与样式：${id}`)
      const definitions = styles
        .map(
          (style, index) =>
            `const __serenova_style_${index} = { id: ${JSON.stringify(style.id)}, css: ${style.name}${building ? '' : ', dev: true'} };`,
        )
        .join('\n')
      const hot = building
        ? ''
        : styles
            .map(
              (style, index) =>
                `if (import.meta.hot) import.meta.hot.accept(${JSON.stringify(style.request)}, (mod) => { if (mod) __serenova_update(__serenova_style_${index}, mod.default); });`,
            )
            .join('\n')
      const expression = exported[1]!.replace(/;\s*$/, '')
      return {
        code:
          transformed.slice(0, exported.index) +
          `\nimport { withComponentStyles as __serenova_withStyles, updateComponentStyle as __serenova_update } from ${JSON.stringify(runtime)};\n` +
          definitions +
          '\n' +
          hot +
          `\nexport default /*@__PURE__*/ __serenova_withStyles(${expression}, [${styles.map((_, i) => `__serenova_style_${i}`).join(',')}]);\n`,
        map: null,
      }
    },
  }
}
