import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://campustent.com';

  const staticRoutes = [
    '',
    '/landing',
    '/explore',
    '/about',
    '/roommates',
    '/landlord-hub',
    '/tenant-guide',
    '/support',
    '/privacy',
    '/terms',
    '/auth/login',
    '/auth/rolepick',
    '/auth/student-signup',
    '/auth/agent-signup',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' || route === '/landing' || route === '/explore' ? 1.0 : 0.8,
  }));

  let propertyRoutes: MetadataRoute.Sitemap = [];
  try {
    const properties = await prisma.property.findMany({
      where: { isVerified: true },
      select: { id: true, updatedAt: true },
      take: 100,
    });

    propertyRoutes = properties.map((prop) => ({
      url: `${baseUrl}/apartment-details?id=${prop.id}`,
      lastModified: prop.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {
    // Database fallback
  }

  return [...staticRoutes, ...propertyRoutes];
}
