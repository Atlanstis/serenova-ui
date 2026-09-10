import { addons } from 'storybook/manager-api'

addons.setConfig({
  toolbar: {
    // 网格与背景颜色由同一个工具提供。
    'storybook/background': { hidden: true },
    'storybook/viewport/tool': { hidden: true },
    'open-in-editor': { hidden: true },
  },
})
