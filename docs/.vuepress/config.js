module.exports = {
  title: 'Speckit 文档',
  description: 'Spec-Driven Development (SDD) 规范驱动开发完整指南',
  base: '/spec-kit/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '介绍', link: '/guide/' },
      { text: '最佳实践', link: '/best-practices/' },
      { text: '使用指南', link: '/usage/' },
      { text: 'GitHub', link: 'https://github.com/github/spec-kit' }
    ],
    sidebar: {
      '/guide/': [
        '',
        'what-is-sdd',
        'why-sdd',
        'core-concepts',
        'ai-acceleration'
      ],
      '/best-practices/': [
        '',
        'spec-writing',
        'team-collaboration',
        'implementation',
        'testing'
      ],
      '/usage/': [
        '',
        'getting-started',
        'examples',
        'tools'
      ]
    },
    sidebarDepth: 2,
    lastUpdated: '最后更新',
    smoothScroll: true
  },
  markdown: {
    lineNumbers: true
  }
}

