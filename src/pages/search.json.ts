import { getCollection } from 'astro:content';
import { byDateDesc, docHref, postHref, projectHref } from '../lib/content';
import { STATUS_LABELS } from '../config';

export async function GET() {
  const [posts, docs, projects] = await Promise.all([
    getCollection('blog', ({ data }) => !data.draft),
    getCollection('docs', ({ data }) => !data.draft),
    getCollection('projects', ({ data }) => !data.draft),
  ]);

  const items = [
    ...posts.sort(byDateDesc).map((post) => ({
      type: 'post',
      title: post.data.title,
      description: post.data.description,
      href: postHref(post.id),
      tags: post.data.tags,
      date: post.data.pubDate.toISOString(),
    })),
    ...docs
      .sort((a, b) => a.data.order - b.data.order)
      .map((doc) => ({
        type: 'doc',
        title: doc.data.title,
        description: doc.data.description,
        href: docHref(doc.id),
        tags: [doc.data.section, ...doc.data.tags],
      })),
    ...projects
      .sort((a, b) => a.data.order - b.data.order)
      .map((project) => ({
        type: 'project',
        title: project.data.title,
        description: project.data.description,
        href: projectHref(project.id),
        tags: [...project.data.stack, STATUS_LABELS[project.data.status]],
      })),
  ];

  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
