import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  buttonSizes,
  buttonVariants,
  type ButtonEmits,
  type ButtonProps,
  type ButtonSize,
  type ButtonSlots,
  type ButtonVariant,
} from '@/components/button/src/public-types'

describe('Button 公共类型', () => {
  it('公开与运行时枚举一致的联合类型', () => {
    expect(buttonVariants).toEqual(['primary', 'warning', 'success', 'error'])
    expect(buttonSizes).toEqual(['small', 'medium', 'large'])

    expectTypeOf<ButtonVariant>().toEqualTypeOf<'primary' | 'warning' | 'success' | 'error'>()
    expectTypeOf<ButtonSize>().toEqualTypeOf<'small' | 'medium' | 'large'>()
    expectTypeOf<ButtonProps>().not.toHaveProperty('block')
    expectTypeOf<ButtonProps>().not.toHaveProperty('nativeType')
    expectTypeOf<ButtonProps>().not.toHaveProperty('type')
    expectTypeOf<ButtonProps>().toHaveProperty('loading').toEqualTypeOf<boolean | undefined>()
    expectTypeOf<ButtonSlots>().toHaveProperty('icon')
    expectTypeOf<ButtonEmits>().toHaveProperty('click')
  })

  it('通过类型检查拒绝不支持的枚举值', () => {
    const acceptVariant = (value: ButtonVariant) => Boolean(value)
    const acceptSize = (value: ButtonSize) => Boolean(value)

    // @ts-expect-error Button 不支持 ghost 视觉变体。
    expect(acceptVariant('ghost')).toBe(true)
    // @ts-expect-error Button 不支持 compact 尺寸。
    expect(acceptSize('compact')).toBe(true)
  })
})

it('text 是独立布尔属性，旧 text 变体被类型拒绝', () => {
  expectTypeOf<ButtonProps>().toHaveProperty('text').toEqualTypeOf<boolean | undefined>()
  // @ts-expect-error text 已迁移为独立属性。
  const legacy: ButtonVariant = 'text'
  expect(legacy).toBe('text')
})
