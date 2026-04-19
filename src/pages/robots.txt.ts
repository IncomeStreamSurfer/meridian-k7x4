import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.toString().replace(/\/$/, '') || 'https://meridian-k7x4.vercel.app';
  const body = `User-agent: *
Allow: /
Disallow: /api/
Sitemap: ${siteUrl}/sitemap-index.xml
`;
  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
};
