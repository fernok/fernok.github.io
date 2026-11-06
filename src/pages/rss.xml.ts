import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../config';
import { byDateDesc, postHref } from '../lib/content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(byDateDesc);

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postHref(post.id),
      categories: post.data.tags,
    })),
    customData: `<language>zh-cn</language><copyright>© ${new Date().getFullYear()} ${SITE.name}</copyright>`,
  });
}
