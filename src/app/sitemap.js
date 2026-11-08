import { getServices, getZones, getPosts, absUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const [services, zones, posts] = await Promise.all([getServices(), getZones(), getPosts()]);
  const now = new Date();
  const fixed = ['/', '/services', '/professionnels-stations-de-ski', '/zones', '/blog', '/faq', '/contact'].map((p) => ({
    url: absUrl(p),
    lastModified: now,
    changeFrequency: p === '/' ? 'weekly' : 'monthly',
    priority: p === '/' ? 1 : 0.8,
  }));
  return [
    ...fixed,
    ...services.map((s) => ({ url: absUrl(`/services/${s.slug}`), lastModified: now, changeFrequency: 'monthly', priority: 0.9 })),
    ...zones.map((z) => ({ url: absUrl(`/zones/${z.slug}`), lastModified: now, changeFrequency: 'monthly', priority: 0.7 })),
    ...posts.map((p) => ({ url: absUrl(`/blog/${p.slug}`), lastModified: p.published_at ? new Date(p.published_at) : now, changeFrequency: 'yearly', priority: 0.6 })),
    { url: absUrl('/mentions-legales'), lastModified: now, priority: 0.2 },
    { url: absUrl('/confidentialite'), lastModified: now, priority: 0.2 },
    { url: absUrl('/cgv'), lastModified: now, priority: 0.2 },
  ];
}
