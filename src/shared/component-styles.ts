import { onBeforeMount } from 'vue'
import type { ComponentOptions } from 'vue'

export interface ComponentStyle {
  id: string
  css: string
  dev?: boolean
}

function findStyle(style: ComponentStyle): HTMLStyleElement | undefined {
  return Array.from(
    document.head.querySelectorAll<HTMLStyleElement>('style[data-serenova-style]'),
  ).find(
    (node) =>
      node.dataset.serenovaStyle === style.id && (style.dev || node.textContent === style.css),
  )
}

/** 只在客户端挂载前写入 DOM；保留规则供同文档其他应用和后续实例复用。 */
export function withComponentStyles<T extends ComponentOptions>(
  component: T,
  styles: ComponentStyle[],
): T {
  const setup = component.setup
  component.setup = (props, context) => {
    onBeforeMount(() => {
      for (const style of styles) {
        const existing = findStyle(style)
        if (existing) {
          // Vue 开发热更新可能重新加载组件模块，仍替换同一开发规则。
          if (existing.textContent !== style.css) existing.textContent = style.css
          continue
        }
        const node = document.createElement('style')
        node.dataset.serenovaStyle = style.id
        node.textContent = style.css
        document.head.append(node)
      }
    })
    return setup?.(props, context)
  }
  return component
}

/** 开发热更新只替换已经挂载的规则，不让尚未使用的组件提前加载样式。 */
export function updateComponentStyle(style: ComponentStyle, css: string): void {
  const node = findStyle(style)
  style.css = css
  if (node) node.textContent = css
}
