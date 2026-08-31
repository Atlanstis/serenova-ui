export default {
  '*.{js,mjs,cjs,ts,mts,cts,tsx,vue}': ['eslint --fix --max-warnings=0', 'prettier --write'],
  '*.{css,scss,less,html,json,jsonc,yaml,yml,md,mdx}': 'prettier --write',
}
