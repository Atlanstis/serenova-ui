import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  buttonNativeTypes,
  buttonSizes,
  buttonVariants,
  type ButtonEmits,
  type ButtonNativeType,
  type ButtonProps,
  type ButtonSize,
  type ButtonSlots,
  type ButtonVariant,
} from '@/components/button/src/public-types'

describe('Button 公共类型', () => {
  it('公开与运行时枚举一致的联合类型', () => {
    expect(buttonVariants).toEqual(['primary', 'warning', 'success', 'error', 'text'])
    expect(buttonSizes).toEqual(['small', 'medium', 'large'])
    expect(buttonNativeTypes).toEqual(['button', 'submit', 'reset'])

    expectTypeOf<ButtonVariant>().toEqualTypeOf<
      'primary' | 'warning' | 'success' | 'error' | 'text'
    >()
    expectTypeOf<ButtonSize>().toEqualTypeOf<'small' | 'medium' | 'large'>()
    expectTypeOf<ButtonNativeType>().toEqualTypeOf<'button' | 'submit' | 'reset'>()
    expectTypeOf<ButtonProps>().not.toHaveProperty('block')
    expectTypeOf<ButtonProps>().toHaveProperty('loading').toEqualTypeOf<boolean | undefined>()
    expectTypeOf<ButtonSlots>().toHaveProperty('icon')
    expectTypeOf<ButtonEmits>().toHaveProperty('click')
  })

  it('通过类型检查拒绝不支持的枚举值', () => {
    const acceptVariant = (value: ButtonVariant) => Boolean(value)
    const acceptSize = (value: ButtonSize) => Boolean(value)
    const acceptNativeType = (value: ButtonNativeType) => Boolean(value)

    // @ts-expect-error Button 不支持 ghost 视觉变体。
    expect(acceptVariant('ghost')).toBe(true)
    // @ts-expect-error Button 不支持 compact 尺寸。
    expect(acceptSize('compact')).toBe(true)
    // @ts-expect-error 原生 button 不支持 menu 类型。
    expect(acceptNativeType('menu')).toBe(true)
  })
})
