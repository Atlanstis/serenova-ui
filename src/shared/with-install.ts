import type { App, Component } from 'vue'

export type WithInstall<T extends Component> = T & {
  install(app: App): void
}

export function withInstall<T extends Component>(component: T, name?: string): WithInstall<T> {
  const componentName = name ?? (component as { name?: string }).name

  const install = (app: App) => {
    if (!componentName) {
      throw new Error('可安装组件必须提供组件名称。')
    }

    app.component(componentName, component)
  }

  return Object.assign(component, { install })
}
