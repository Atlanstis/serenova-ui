import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import { DOMParser, XMLSerializer } from '@xmldom/xmldom'
import { format } from 'prettier'
import prettierConfig from '../prettier.config.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const allowed = new Set(['svg', 'g', 'path'])
const attributes = new Set([
  'viewBox',
  'fill',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'd',
  'opacity',
  'fill-opacity',
  'stroke-opacity',
  'fill-rule',
  'clip-rule',
  'xmlns',
])

/** 仅转换已审核的单色图标；未知结构必须显式失败。 */
export function normalizeSvg(source) {
  const doc = new DOMParser({
    onError(level, message) {
      throw new Error(`SVG XML 解析失败（${level}）：${message}`)
    },
  }).parseFromString(source, 'image/svg+xml')
  const svg = doc.documentElement
  if (!svg || svg.tagName !== 'svg' || svg.getAttribute('viewBox') !== '0 0 24 24' || doc.doctype)
    throw new Error('图标必须使用 24×24 SVG 画布')
  // MCP 整节点导出的画布背景不属于图标；来源节点 fills 已确认为空。
  for (const child of Array.from(svg.childNodes)) {
    if (child.nodeType === 1 && child.tagName === 'rect') {
      const entries = Array.from(child.attributes)
        .map((a) => `${a.name}=${a.value}`)
        .sort()
        .join(';')
      if (entries !== 'fill=#F5F5F5;height=24;width=24') throw new Error('不支持的背景矩形')
      svg.removeChild(child)
    }
  }
  function visit(node) {
    if (node.nodeType === 3 && !node.textContent.trim()) return
    if (node.nodeType !== 1 || !allowed.has(node.tagName)) throw new Error('不支持的 SVG 节点')
    for (const attr of Array.from(node.attributes)) {
      if (attr.name === 'id' || (node === svg && ['width', 'height'].includes(attr.name))) {
        node.removeAttribute(attr.name)
        continue
      }
      if (
        !attributes.has(attr.name) ||
        (/url\(|javascript:|https?:/i.test(attr.value) && attr.name !== 'xmlns')
      )
        throw new Error(`不支持的 SVG 属性：${attr.name}`)
      if (['fill', 'stroke'].includes(attr.name) && attr.value !== 'none') {
        if (attr.value !== 'currentColor' && !/^#[0-9a-f]{6}$/i.test(attr.value))
          throw new Error('仅支持单色图标')
        node.setAttribute(attr.name, 'currentColor')
      }
    }
    for (const child of Array.from(node.childNodes)) visit(child)
  }
  visit(svg)
  // 未声明填充时，SVG 默认黑色；改为继承外部 color。
  if (!svg.hasAttribute('fill')) svg.setAttribute('fill', 'currentColor')
  return new XMLSerializer().serializeToString(svg)
}

export async function generateIcons(check = false) {
  const manifest = JSON.parse(await readFile(resolve(root, 'assets/icons/manifest.json'), 'utf8'))
  const output = resolve(root, 'src/components/icon/src/generated')
  await mkdir(output, { recursive: true })
  for (const icon of manifest.icons) {
    const source = await readFile(resolve(root, 'assets/icons', `${icon.name}.svg`), 'utf8')
    if (createHash('sha256').update(source).digest('hex') !== icon.sha256)
      throw new Error(`${icon.name} 原始资源校验失败`)
    const svg = normalizeSvg(source).replace(
      '<svg ',
      '<svg :width="dimension" :height="dimension" :style="{ color: props.color }" ',
    )
    const code = await format(
      `<!-- 此文件由 scripts/generate-icons.mjs 生成，请修改原始资源后重新生成。 -->\n<script setup lang="ts">\nimport { computed } from 'vue'\nimport type { IconProps } from '../public-types'\ndefineOptions({ name: 'SIcon${icon.name}' })\nconst props = withDefaults(defineProps<IconProps>(), { size: 24 })\nconst dimension = computed(() => typeof props.size === 'number' ? props.size + 'px' : props.size)\n</script>\n<template>${svg}</template>`,
      { ...prettierConfig, parser: 'vue' },
    )
    const path = resolve(output, `SIcon${icon.name}.vue`)
    if (check) {
      if ((await readFile(path, 'utf8')) !== code) throw new Error(`${icon.name} 生成结果未同步`)
    } else await writeFile(path, code)
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await generateIcons(process.argv.includes('--check'))
