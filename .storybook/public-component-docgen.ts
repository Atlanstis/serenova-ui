import type { Plugin } from 'vite'

/** 示例是公共组件的消费代码，API 文档使用 meta.component 的元数据。 */
export function publicComponentDocgen(): Plugin {
  return {
    name: 'serenova:public-component-docgen',
    configResolved(config) {
      const docgen = config.plugins.find(
        (plugin) => plugin.name === 'storybook:vue-component-meta-plugin',
      )
      const transform = docgen?.transform
      if (!docgen || !transform) return

      const handler = typeof transform === 'function' ? transform : transform.handler
      docgen.transform = {
        ...(typeof transform === 'function' ? {} : transform),
        handler(...args) {
          // Storybook 的事件说明兼容解析器不支持示例使用的包名别名。
          // 保留公共组件元数据，只跳过开发示例，避免解析无关的示例 API。
          if (args[1].replaceAll('\\', '/').includes('/stories/examples/')) return
          return handler.apply(this, args)
        },
      }
    },
  }
}
