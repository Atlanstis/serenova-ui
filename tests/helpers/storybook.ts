export const buttonStoryIds = {
  playground: 'components-button--playground',
  variants: 'components-button--variants',
  sizesAndStates: 'components-button--sizes-and-states',
  slots: 'components-button--slots',
  form: 'components-button--form',
  interaction: 'components-button--interaction',
} as const

interface StoryQuery {
  args?: string
  globals?: string
}

export function storyUrl(storyId: string, query: StoryQuery = {}) {
  const search = new URLSearchParams({
    id: storyId,
    viewMode: 'story',
  })

  if (query.args) search.set('args', query.args)
  if (query.globals) search.set('globals', query.globals)

  return '/iframe.html?' + search.toString()
}
