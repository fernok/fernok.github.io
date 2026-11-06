import type { CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;
export type DocEntry = CollectionEntry<'docs'>;
export type ProjectEntry = CollectionEntry<'projects'>;

export function byDateDesc<T extends { data: { pubDate: Date } }>(a: T, b: T) {
  return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
}

export function formatDate(date: Date, style: 'short' | 'long' = 'short') {
  const options: Intl.DateTimeFormatOptions =
    style === 'long'
      ? { year: 'numeric', month: 'long', day: 'numeric' }
      : { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Intl.DateTimeFormat('zh-CN', options)
    .format(date)
    .replace(/\//g, style === 'short' ? '.' : ' / ');
}

export function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function readingTime(body?: string) {
  const length = body?.replace(/\s+/g, ' ').length ?? 0;
  return Math.max(1, Math.ceil(length / 380));
}

export function tagCounts(posts: BlogPost[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'));
}

export function groupDocs(docs: DocEntry[]) {
  const groups = new Map<string, DocEntry[]>();
  for (const doc of [...docs].sort((a, b) => a.data.order - b.data.order)) {
    const list = groups.get(doc.data.section) ?? [];
    list.push(doc);
    groups.set(doc.data.section, list);
  }
  return [...groups.entries()].map(([section, items]) => ({ section, items }));
}

export function adjacentDocs(docs: DocEntry[], currentId: string) {
  const sorted = [...docs].sort((a, b) => a.data.order - b.data.order);
  const index = sorted.findIndex((doc) => doc.id === currentId);
  return {
    previous: index > 0 ? sorted[index - 1] : undefined,
    next: index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : undefined,
  };
}

export function docHref(id: string) {
  return `/docs/${id}`;
}

export function projectHref(id: string) {
  return `/projects/${id}`;
}

export function postHref(id: string) {
  return `/blog/${id}`;
}
