import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const essays = await getCollection('essays', ({ data }) => !data.draft);
  return rss({
    title: 'Ifeyi Batindek — Writing',
    description:
      'Essays on AI governance, digital sovereignty, banking modernization, and the political economy of the technologies we adopt.',
    site: context.site!,
    items: essays
      .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
      .map((e) => ({
        title: e.data.title,
        description: e.data.description,
        pubDate: e.data.pubDate,
        link: `/writing/${e.id}/`
      }))
  });
}
