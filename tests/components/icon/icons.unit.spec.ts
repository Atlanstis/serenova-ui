import { mount } from '@vue/test-utils'
import { createApp } from 'vue'
import { describe, expect, expectTypeOf, it } from 'vitest'
import * as icons from '@/components/icon'
import * as root from '@/index'
import type { IconProps } from '@/components/icon'

for (const [name, Icon] of Object.entries(icons)) {
  describe(name, () => {
    it('渲染独立 SVG、默认尺寸并透传属性', () => {
      const wrapper = mount(Icon, {
        attrs: { class: 'consumer', 'data-icon': name, style: 'margin: 2px' },
      })
      expect(wrapper.element.tagName.toLowerCase()).toBe('svg')
      expect(wrapper.attributes('viewBox')).toBe('0 0 24 24')
      expect(wrapper.attributes('width')).toBe('24px')
      expect(wrapper.attributes('height')).toBe('24px')
      expect(wrapper.classes()).toContain('consumer')
      expect(wrapper.attributes('data-icon')).toBe(name)
      expect(wrapper.attributes('style')).toContain('margin: 2px')
      expect(wrapper.find('path').attributes('stroke')).toBe('currentColor')
      expect(wrapper.find('img, rect, [id], [tabindex]').exists()).toBe(false)
    })
    it('响应尺寸与颜色变化，移除颜色后恢复继承', async () => {
      const wrapper = mount(Icon, { props: { size: 16, color: '#123456' } })
      expect(wrapper.attributes('width')).toBe('16px')
      expect((wrapper.element as SVGElement).style.color).toBe('#123456')
      await wrapper.setProps({ size: '2em', color: undefined })
      expect(wrapper.attributes('height')).toBe('2em')
      expect((wrapper.element as SVGElement).style.color).toBe('')
    })
    it('根与集合出口一致，支持全量及单组件安装', () => {
      expect(root[name as keyof typeof root]).toBe(Icon)
      for (const plugin of [Icon, root.default]) {
        const app = createApp({})
        app.use(plugin)
        expect(app.component(name)).toBe(Icon)
      }
    })
  })
}
it('公开精简的类型契约', () => {
  expectTypeOf<IconProps>().toEqualTypeOf<{ size?: number | string; color?: string }>()
  expect(Object.keys(icons).sort()).toEqual([
    'SIconAdd',
    'SIconArrowRight',
    'SIconDelete',
    'SIconEdit',
    'SIconLoading',
    'SIconSearch',
  ])
})
