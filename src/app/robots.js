import { absUrl, isIndexable } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default function robots() {
  if (!isIndexable()) return { rules: [{ userAgent: '*', disallow: '/' }] };
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/d/'] }],
    sitemap: absUrl('/sitemap.xml'),
  };
}
