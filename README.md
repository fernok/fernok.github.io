# 编程小蕨 Fernok

> 把想法编译成可运行的产品。

个人站点，包含 **博客 / 文档 / 项目** 三块内容。视觉参考 [NVIDIA Build 模型目录](https://build.nvidia.com/models)，评论使用 [Giscus](https://giscus.app)，构建与部署全部交给 **Bun** 和 **GitHub Actions**。

- 线上站点：<https://fernok.github.io>
- 内容仓库：<https://github.com/fernok/fernok.github.io>

## 技术栈

| 层 | 选择 |
| --- | --- |
| 框架 | [Astro 7](https://astro.build)（静态输出，默认零客户端 JS） |
| 内容 | Markdown + MDX + Astro Content Collections |
| 样式 | 原生 CSS 设计系统（无 Tailwind） |
| 运行时 / 包管理 | [Bun](https://bun.sh) 1.4.4 |
| 评论 | Giscus + GitHub Discussions |
| 部署 | GitHub Pages + GitHub Actions |
| 字体 | Inter Variable / JetBrains Mono Variable / 系统中文字体 |

## 功能

- NVIDIA Build 风格的深色模型目录式布局
- 博客：标签筛选、精选文章、阅读时长、上一篇 / 下一篇
- 文档：分组侧边栏、页内目录、移动端折叠导航
- 项目：状态卡片、详情页、技术栈与仓库链接
- Giscus 评论（滚动到评论区附近才加载）
- 客户端全站搜索（⌘K / Ctrl+K / `/`）
- RSS、sitemap、robots、JSON-LD、Open Graph 分享图
- 响应式布局、键盘可访问、`prefers-reduced-motion`
- Bun 构建 + GitHub Pages 自动部署

## 本地开发

```bash
git clone https://github.com/fernok/fernok.github.io.git
cd fernok.github.io
bun install
bun run dev
```

打开 <http://localhost:4321>。

```bash
bun run build      # 构建到 dist/
bun run preview    # 预览构建产物
bun run og         # 重新生成 public/og.png 与 apple-touch-icon.png
```

## 内容结构

```text
src/content/
├── blog/       # 博客文章（.md 或 .mdx）
├── docs/       # 文档（.mdx）
└── projects/   # 项目介绍（.md）
```

frontmatter 由 `src/content.config.ts` 中的 Zod schema 校验。字段说明见站点内的 **文档 → 写作与内容**，或直接看：

- [`src/content/blog/hello-fernok.mdx`](src/content/blog/hello-fernok.mdx)
- [`src/content/docs/getting-started.mdx`](src/content/docs/getting-started.mdx)
- [`src/content/projects/fernok-site.md`](src/content/projects/fernok-site.md)

## Giscus 评论配置

仓库默认配置已经写进 `src/config.ts`，但 Giscus 需要一次性授权：

1. 仓库 **Settings → General → Features → Discussions** 已开启；
2. 打开 <https://github.com/apps/giscus>，把 Giscus App 安装到本仓库；
3. 在 [giscus.app](https://giscus.app) 填入 `fernok/fernok.github.io`，复制 `repo-id` 与 `category-id`；
4. 如果 ID 有变化，修改 `src/config.ts`，或在构建环境中设置：

```bash
PUBLIC_GISCUS_REPO=fernok/fernok.github.io
PUBLIC_GISCUS_REPO_ID=R_kgDO...
PUBLIC_GISCUS_CATEGORY=General
PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDO...
```

GitHub Actions 会读取仓库 Variables：`PUBLIC_GISCUS_REPO_ID`、`PUBLIC_GISCUS_CATEGORY_ID`。

评论映射使用 `pathname`，因此发布后尽量不要修改文章 URL。

## 部署

`.github/workflows/deploy.yml` 使用 `oven-sh/setup-bun@v2`：

1. `bun install --frozen-lockfile`
2. `bun run build`
3. `actions/upload-pages-artifact@v3`
4. `actions/deploy-pages@v4`

仓库 **Settings → Pages → Source** 需要选择 **GitHub Actions**。

## 目录

```text
.
├── .github/workflows/deploy.yml
├── public/                      # favicon、OG、robots、.nojekyll
├── scripts/generate-og.mjs      # 用 sharp 生成分享图
├── src/
│   ├── components/              # Header、Footer、卡片、Toc、Giscus…
│   ├── content/{blog,docs,projects}
│   ├── layouts/BaseLayout.astro
│   ├── lib/content.ts
│   ├── pages/                   # 路由
│   ├── scripts/site.js          # 搜索 / 筛选 / 复制 / 目录 / 动效
│   ├── styles/global.css        # 设计系统
│   └── content.config.ts
├── astro.config.mjs
└── package.json
```

## 设计说明

视觉参考 [build.nvidia.com/models](https://build.nvidia.com/models)：

- 近黑背景 `#0c0c0c`，卡片 `#151515`，1px 边框分层
- 品牌绿 `#76b900` 只用于状态、链接与关键数字
- 卡片底部贯穿式分隔线、紧促标题、等宽字体徽章
- 8px 卡片圆角、14px 面板圆角
- 中文回退系统字体，避免加载巨大的 CJK 字体包

设计变量集中在 `src/styles/global.css` 的 `:root`。

## License

内容与代码均为个人项目，除特别说明外使用 MIT License。转载请注明出处。
