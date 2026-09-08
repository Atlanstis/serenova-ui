import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
// 开发脚本不属于公共发布类型；按真实输入输出验证转换。
// @ts-expect-error 开发脚本为原生 ESM。
import { normalizeSvg, generateIcons } from '../../../scripts/generate-icons.mjs'

describe('图标生成', () => {
  it('保留真实路径几何并可重复校验', async () => {
    for (const name of ['Add', 'Delete', 'Edit', 'Search', 'ArrowRight', 'Loading']) {
      const source = await readFile(`assets/icons/${name}.svg`, 'utf8')
      const result = normalizeSvg(source)
      const paths = (svg: string) => [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1])
      expect(paths(result)).toEqual(paths(source))
      expect(result).not.toContain('<rect')
      expect(result).toContain('currentColor')
      expect(source).not.toMatch(/(?:fill|stroke)="(?!none"|currentColor")[^"]+"/)
      expect(source).not.toContain('<rect')
      expect(normalizeSvg(result)).toBe(result)
    }
    await generateIcons(true)
    await generateIcons(true)
  })
  it('将内部颜色交由外部 color 控制，保留无填充和透明度', () => {
    const result = normalizeSvg(
      '<svg viewBox="0 0 24 24" fill="none"><g stroke="#6D28D9" opacity="0.5"><path d="M0 0H24" fill="#FFFFFF" fill-opacity="0.4" stroke-opacity="0.6"/></g></svg>',
    )
    expect(result).not.toMatch(/#[0-9a-f]{6}/i)
    expect(result).toContain('fill="none"')
    expect(result).toContain('fill="currentColor"')
    expect(result).toContain('stroke="currentColor"')
    expect(result).toContain('opacity="0.5"')
    expect(result).toContain('fill-opacity="0.4"')
    expect(result).toContain('stroke-opacity="0.6"')
    expect(normalizeSvg('<svg viewBox="0 0 24 24"><path d="M0 0H24"/></svg>')).toContain(
      'fill="currentColor"',
    )
  })
  it.each([
    '<svg viewBox="0 0 24 24"><path></svg>',
    '<svg viewBox="0 0 24 24"><path fill=#FFFFFF /></svg>',
    '<svg viewBox="0 0 24 24"><path d="&unknown;"/></svg>',
    '<!DOCTYPE svg><svg viewBox="0 0 24 24"/>',
  ])('拒绝非法或不支持的 XML %s', (source) => {
    expect(() => normalizeSvg(source)).toThrow()
  })
  it.each([
    '<script/>',
    '<image href="https://example.com/a"/>',
    '<defs/>',
    '<path onload="alert(1)"/>',
    '<path stroke="url(#x)"/>',
  ])('拒绝未知结构 %s', (child) => {
    expect(() => normalizeSvg(`<svg viewBox="0 0 24 24">${child}</svg>`)).toThrow()
  })
})
