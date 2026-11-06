const env = import.meta.env;

export const SITE = {
  title: '编程小蕨 Fernok',
  shortTitle: 'FERNOK',
  name: '编程小蕨',
  latin: 'Fernok',
  description:
    '编程小蕨 Fernok 的个人站点：写 Astro、TypeScript 与工具链，也记录那些让复杂变简单的瞬间。',
  url: 'https://fernok.github.io',
  repo: 'https://github.com/fernok/fernok.github.io',
  github: 'https://github.com/fernok',
  locale: 'zh-CN',
  timezone: 'Asia/Shanghai',
  buildYear: 2026,
};

export const NAV = [
  { href: '/', label: '首页', key: 'home' },
  { href: '/blog', label: '博客', key: 'blog' },
  { href: '/docs', label: '文档', key: 'docs' },
  { href: '/projects', label: '项目', key: 'projects' },
  { href: '/about', label: '关于', key: 'about' },
] as const;

export const GISCUS = {
  enabled: true,
  repo: env.PUBLIC_GISCUS_REPO || 'fernok/fernok.github.io',
  repoId: env.PUBLIC_GISCUS_REPO_ID || 'R_kgDOVg_Rnw',
  category: env.PUBLIC_GISCUS_CATEGORY || 'General',
  categoryId: env.PUBLIC_GISCUS_CATEGORY_ID || 'DIC_kwDOVg_Rn84DKfTv',
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top',
  theme: env.PUBLIC_GISCUS_THEME || 'dark',
  lang: 'zh-CN',
};

export const STATUS_LABELS = {
  shipped: '已上线',
  building: '构建中',
  concept: '构思中',
} as const;

export const STATUS_TONES = {
  shipped: 'green',
  building: 'amber',
  concept: 'blue',
} as const;
