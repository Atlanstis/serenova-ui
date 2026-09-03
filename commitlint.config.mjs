const bodyListFormat = ({ body }) => {
  if (!body) {
    return [true]
  }

  const invalidLines = body.split('\n').filter((line) => line.trim() && !line.startsWith('- '))

  return [invalidLines.length === 0, '提交正文的每条非空信息必须以 "- " 开头']
}

export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'body-list-format': bodyListFormat,
      },
    },
  ],
  rules: {
    'body-leading-blank': [2, 'always'],
    'body-list-format': [2, 'always'],
  },
}
