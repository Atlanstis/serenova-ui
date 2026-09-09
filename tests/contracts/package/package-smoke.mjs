import { build, createServer } from 'vite'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  stat,
  symlink,
  writeFile,
} from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageTestRoot = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(packageTestRoot, '../../..')
const packageJsonPath = resolve(repositoryRoot, 'package.json')
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))
const packageName = packageJson.name

assert.equal(typeof packageName, 'string', 'package.json 必须提供包名。')

function packageTarget(target) {
  assert.equal(typeof target, 'string', '导出映射必须是字符串路径。')
  return resolve(repositoryRoot, target)
}

async function assertNonEmptyFile(path, label) {
  const file = await stat(path)
  assert(file.isFile(), `${label} 必须是文件。`)
  assert(file.size > 0, `${label} 不得为空。`)
}

const rootExport = packageJson.exports?.['.']
assert(rootExport, '缺少包根导出映射。')

const esmPath = packageTarget(rootExport.import)
const cjsPath = packageTarget(rootExport.require)
const typePath = packageTarget(rootExport.types)

await Promise.all([
  assertNonEmptyFile(esmPath, 'ESM 产物'),
  assertNonEmptyFile(cjsPath, 'CommonJS 产物'),
  assertNonEmptyFile(typePath, 'TypeScript 声明入口'),
])

const require = createRequire(import.meta.url)
const resolvedEsmPath = fileURLToPath(import.meta.resolve(packageName))
const resolvedCjsPath = require.resolve(packageName)

assert.equal(resolvedEsmPath, esmPath, '包根 ESM 导出没有解析到约定产物。')
assert.equal(resolvedCjsPath, cjsPath, '包根 CommonJS 导出没有解析到约定产物。')

const esmFiles = await readdir(resolve(repositoryRoot, 'dist'), { recursive: true })
const esmSource = (
  await Promise.all(
    esmFiles
      .filter((name) => name.endsWith('.js'))
      .map((name) => readFile(resolve(repositoryRoot, 'dist', name), 'utf8')),
  )
).join('\n')
assert.match(esmSource, /from\s+["']vue["']/, 'ESM 产物没有外置 Vue。')
assert(packageJson.peerDependencies?.vue, 'Vue 必须声明为 peerDependency。')

const declarations = await readFile(typePath, 'utf8')
assert.doesNotMatch(declarations, /styles\/index\.css/, '声明入口包含无法发布的内部样式路径。')

const typeScriptCompiler = require.resolve('typescript/bin/tsc')
const sourceConsumerFixture = resolve(packageTestRoot, 'package-consumer.fixture.ts')
const packOutput = execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
  cwd: repositoryRoot,
  encoding: 'utf8',
})
const packResults = JSON.parse(packOutput)
const packedFiles = packResults[0]?.files

assert(Array.isArray(packedFiles), 'npm pack --dry-run 没有返回文件列表。')
assert(
  packedFiles.every(
    ({ path }) =>
      path === 'package.json' ||
      path === 'README.md' ||
      path === 'LICENSE' ||
      path.startsWith('dist/'),
  ),
  'npm 包包含约定范围以外的文件。',
)

assert.equal(packageJson.style, undefined)
assert.equal(packageJson.sideEffects, false)
assert(!esmFiles.some((name) => name.endsWith('.css')), '发布产物不得包含独立 CSS 文件')
assert.match(esmSource, /s-button/)
assert.doesNotMatch(esmSource, /:root|data-theme|button-story/)

const temporaryRoot = await mkdtemp(resolve(tmpdir(), 'serenova-ui-package-smoke-'))

try {
  const splitOutput = resolve(temporaryRoot, 'split')
  const splitBuild = await build({
    configFile: resolve(packageTestRoot, 'fixtures/style-splitting/vite.config.ts'),
    logLevel: 'silent',
    build: { outDir: splitOutput },
  })
  const splitResults = Array.isArray(splitBuild) ? splitBuild : [splitBuild]
  const selectedEntry = splitResults
    .flatMap((result) => result.output)
    .find((item) => item.type === 'chunk' && item.isEntry && item.name === 'selected')
  assert.ok(selectedEntry)
  const consumerEntry = resolve(temporaryRoot, 'consume.js')
  // 默认消费不导入 CSS：发布 JS 自身包含所需规则且未被 tree shaking 丢弃。
  await writeFile(
    consumerEntry,
    `import { SButton } from './split/${selectedEntry.fileName}';\nglobalThis.selectedButton = SButton;`,
  )
  const automatic = await build({
    configFile: false,
    logLevel: 'silent',
    build: { write: false, rolldownOptions: { input: consumerEntry, external: ['vue'] } },
  })
  const automaticOutput = (Array.isArray(automatic) ? automatic : [automatic]).flatMap(
    (result) => result.output,
  )
  const automaticCode = automaticOutput
    .filter((item) => item.type === 'chunk')
    .map((item) => item.code)
    .join('\n')
  assert.match(automaticCode, /s-button/)
  assert.match(automaticCode, /fixture-shared/)
  assert.match(automaticCode, /data:image\/svg\+xml/)
  assert.doesNotMatch(automaticCode, /url\([^)]*marker\.svg/)
  assert.match(automaticCode, /data-serenova-style/)
  assert.match(automaticCode, /@keyframes/)
  assert.match(automaticCode, /data-v-/)
  assert.doesNotMatch(automaticCode, /fixture-unrelated/)
  assert.equal(
    automaticOutput.filter((item) => item.type === 'asset' && item.fileName.endsWith('.css'))
      .length,
    0,
  )

  const installedPackageRoot = resolve(temporaryRoot, 'node_modules', packageName)
  await mkdir(installedPackageRoot, { recursive: true })

  for (const { path } of packedFiles) {
    const targetPath = resolve(installedPackageRoot, path)
    assert(targetPath.startsWith(installedPackageRoot + sep), `npm 包文件路径越界：${path}`)
    await mkdir(dirname(targetPath), { recursive: true })
    await copyFile(resolve(repositoryRoot, path), targetPath)
  }

  const vueTarget = await realpath(resolve(repositoryRoot, 'node_modules/vue'))
  const vueLink = resolve(temporaryRoot, 'node_modules/vue')
  await symlink(vueTarget, vueLink, 'dir')

  const packageSpecifier = JSON.stringify(packageName)
  execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '--eval',
      `
        import assert from 'node:assert/strict'
        import { createApp } from 'vue'
        import SerenovaUI, {
          buttonSizes,
          buttonVariants,
          SButton,
        } from ${packageSpecifier}
        import * as library from ${packageSpecifier}

        assert.equal(typeof SerenovaUI.install, 'function')
        assert.equal(typeof SButton.install, 'function')
        assert.equal('components' in library, false)
        for (const sub of ['button', 'theme-provider', 'themes/light', 'icons']) {
          const entry = await import(${packageSpecifier} + '/' + sub)
          assert.ok(Object.keys(entry).length > 0)
        }
        const { SThemeProvider } = await import(${packageSpecifier} + '/theme-provider')
        assert.equal(SThemeProvider, library.SThemeProvider)
        assert.equal((await import(${packageSpecifier} + '/button')).SButton, SButton)
        assert.deepEqual(buttonVariants, ['primary', 'warning', 'success', 'error'])
        assert.deepEqual(buttonSizes, ['small', 'medium', 'large'])
        assert.equal('buttonNativeTypes' in library, false)
        assert.equal('buttonNativeTypes' in (await import(${packageSpecifier} + '/button')), false)

        const app = createApp({})
        app.use(SerenovaUI)
        assert.equal(app.component('SButton'), SButton)
        assert.equal(app.component('SThemeProvider'), library.SThemeProvider)
      `,
    ],
    { cwd: temporaryRoot, stdio: 'inherit' },
  )

  execFileSync(
    process.execPath,
    [
      '--eval',
      `
        const assert = require('node:assert/strict')
        const library = require(${packageSpecifier})

        assert.equal(typeof library.default.install, 'function')
        assert.equal(typeof library.SButton.install, 'function')
        assert.equal('components' in library, false)
        assert.equal('buttonNativeTypes' in library, false)
        assert.equal('buttonNativeTypes' in require(${packageSpecifier} + '/button'), false)
        assert.deepEqual(library.buttonSizes, ['small', 'medium', 'large'])
        for (const sub of ['button', 'theme-provider', 'themes/light', 'icons']) {
          assert.ok(Object.keys(require(${packageSpecifier} + '/' + sub)).length > 0)
        }
        assert.equal(require(${packageSpecifier} + '/theme-provider').SThemeProvider, library.SThemeProvider)

      `,
    ],
    { cwd: temporaryRoot, stdio: 'inherit' },
  )

  const presetBuild = await build({
    configFile: false,
    logLevel: 'silent',
    build: {
      write: false,
      lib: { entry: resolve(installedPackageRoot, 'dist/themes/light.js'), formats: ['es'] },
    },
  })
  for (const result of Array.isArray(presetBuild) ? presetBuild : [presetBuild]) {
    for (const item of result.output) {
      assert.equal(item.type, 'chunk', '预设不应生成样式资产')
      assert.doesNotMatch(item.code, /s-button|createElement|defineComponent|from ["']vue["']/)
    }
  }

  const iconNames = [
    'SIconAdd',
    'SIconDelete',
    'SIconEdit',
    'SIconSearch',
    'SIconArrowRight',
    'SIconLoading',
  ]
  const installedRequire = createRequire(resolve(temporaryRoot, 'consumer.cjs'))
  const rootLibrary = installedRequire(packageName)
  const iconLibrary = installedRequire(`${packageName}/icons`)
  assert.deepEqual(Object.keys(iconLibrary).sort(), [...iconNames].sort())
  for (const name of iconNames) {
    assert.equal(iconLibrary[name], rootLibrary[name])
    assert.equal(typeof iconLibrary[name].install, 'function')
  }
  for (const subpath of ['themes/dark', 'icons/add', 'style.css', 'button/style.css', 'ssr']) {
    assert.throws(() => installedRequire.resolve(`${packageName}/${subpath}`), {
      code: 'ERR_PACKAGE_PATH_NOT_EXPORTED',
    })
  }
  assert.equal(packageJson.exports['./icons/*'], undefined)
  for (const [entry, symbol] of [
    [packageName, 'SIconAdd'],
    [`${packageName}/icons`, 'SIconAdd'],
    [`${packageName}/button`, 'SButton'],
  ]) {
    const path = resolve(temporaryRoot, 'tree-shake.js')
    await writeFile(path, `import { ${symbol} } from '${entry}'; globalThis.selected = ${symbol};`)
    const result = await build({
      configFile: false,
      logLevel: 'silent',
      build: { write: false, minify: false, rolldownOptions: { input: path, external: ['vue'] } },
    })
    const output = (Array.isArray(result) ? result : [result]).flatMap((r) => r.output)
    assert(
      output.every((item) => item.type === 'chunk'),
      'JS 图标入口不应引入 CSS',
    )
    const code = output.map((item) => item.code).join('\n')
    assert.doesNotMatch(code, /SIconDelete|SIconEdit|SIconSearch|SIconArrowRight|SThemeProvider/)
    if (symbol === 'SIconAdd') {
      assert.match(code, /M12 3V21M3 12H21/)
      assert.doesNotMatch(code, /SButton|SIconLoading|s-button/)
    } else {
      assert.match(code, /SIconLoading/)
      assert.doesNotMatch(code, /SIconAdd/)
    }
  }

  const consumerFixture = resolve(temporaryRoot, 'package-consumer.ts')
  await copyFile(sourceConsumerFixture, consumerFixture)
  execFileSync(
    process.execPath,
    [
      typeScriptCompiler,
      '--ignoreConfig',
      '--noEmit',
      '--strict',
      '--skipLibCheck',
      'false',
      '--target',
      'ES2022',
      '--module',
      'ESNext',
      '--moduleResolution',
      'Bundler',
      '--lib',
      'ES2022,DOM',
      consumerFixture,
    ],
    {
      cwd: temporaryRoot,
      stdio: 'inherit',
    },
  )
} finally {
  await rm(temporaryRoot, { recursive: true, force: true })
}

console.log(
  'dist 包级冒烟检查通过：包名解析、ESM、CommonJS、插件、SButton、自动样式、声明和 Vue external 均可消费。',
)

// 通过开发服务模块转换验证 inline 样式和 HMR 关联，无需打开页面。
const development = await createServer({
  configFile: resolve(repositoryRoot, 'vite.config.ts'),
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true, include: [] },
  logLevel: 'silent',
})
try {
  const result = await development.transformRequest('/src/components/button/src/Button.vue')
  assert.ok(result)
  assert.match(result.code, /__serenova_withStyles/)
  assert.match(result.code, /import\.meta\.hot\.accept/)
  const request = result.code.match(/import __serenova_css_0 from ["']([^"']+)["']/)?.[1]
  assert.ok(request)
  assert.match(request, /inline/)
  const style = await development.transformRequest(request)
  assert.ok(style)
  assert.match(style.code, /s-button/)
  assert.match(style.code, /data-v-/)
  assert.doesNotMatch(style.code, /__vite__updateStyle/)
} finally {
  await development.close()
}
