import { VISIT } from './visit.ts'

/** Public, verified facts only. Planned hours are deliberately not operating hours. */
export const SITE = {
  url: 'https://nillu.cafe/',
  name: 'Nillu Cafe',
  title: 'Nillu Cafe | 2D Cafe in HSR Layout — Opening Soon',
  description: 'A playful 2D cafe is coming to HSR Layout, Bengaluru. Discover Nillu Cafe: coffee, fresh juices, bowls, bites, desserts and cakes with a warm welcome.',
  image: 'https://nillu.cafe/social-preview.png',
  imageAlt: 'Nillu Cafe — a playful 2D cafe coming soon to HSR Layout, Bengaluru. Step into a sketch. Make a real moment.',
}

// Organization is appropriate before a complete street address is confirmed.
// Switch to CafeOrCoffeeShop with the full address when local-business data is ready.
export const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE.url}#business`,
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      sameAs: [VISIT.instagramUrl, VISIT.facebookUrl].filter(Boolean),
      logo: { '@type': 'ImageObject', url: `${SITE.url}brand/nillu-logo.png` },
      location: { '@type': 'Place', name: 'HSR Layout, Bengaluru' },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}#website`,
      url: SITE.url,
      name: SITE.name,
      publisher: { '@id': `${SITE.url}#business` },
      inLanguage: 'en-IN',
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE.url}#webpage`,
      url: SITE.url,
      name: SITE.title,
      description: SITE.description,
      isPartOf: { '@id': `${SITE.url}#website` },
      about: { '@id': `${SITE.url}#business` },
      primaryImageOfPage: { '@type': 'ImageObject', url: SITE.image, width: 1200, height: 630 },
      inLanguage: 'en-IN',
    },
  ],
}
