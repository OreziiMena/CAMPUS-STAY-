import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://campustent.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin-dashboard', '/agent-dashboard/settings', '/student-dashboard/settings', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
