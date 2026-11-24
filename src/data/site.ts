import { VISIT } from './visit.ts'

export const SITE = {
  url: 'https://nillu.cafe/',
  name: 'Nillu Cafe',
  title: 'Nillu Cafe | Smoothie Bowls & Fresh Hot Cookies in HSR Layout, Bengaluru',
  description: `Smoothie bowls and fresh hot cookies are the specialties at Nillu Cafe, a 2D café in Sector 2, HSR Layout, Bengaluru. Opening in ${VISIT.openingMonth}.`,
  image: 'https://nillu.cafe/social-preview.png',
  imageAlt: 'Nillu Cafe logo with “Smoothie bowls & fresh hot cookies” and “HSR Layout, Bengaluru.”',
}

export const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE.url}#organization`,
      name: SITE.name,
      alternateName: ['Nillu', 'ನಿಲ್ಲು'],
      url: SITE.url,
      description: SITE.description,
      sameAs: [VISIT.instagramUrl, VISIT.facebookUrl].filter(Boolean),
      logo: { '@type': 'ImageObject', url: `${SITE.url}brand/nillu-logo.png` },
    },
    {
      '@type': 'CafeOrCoffeeShop',
      '@id': `${SITE.url}#cafe`,
      name: SITE.name,
      url: SITE.url,
      parentOrganization: { '@id': `${SITE.url}#organization` },
      description: SITE.description,
      image: SITE.image,
      address: {
        '@type': 'PostalAddress',
        streetAddress: `${VISIT.street}, ${VISIT.locality}`,
        addressLocality: VISIT.city,
        addressRegion: VISIT.region,
        postalCode: VISIT.postalCode,
        addressCountry: VISIT.country,
      },
      areaServed: { '@type': 'Place', name: 'HSR Layout, Bengaluru' },
      knowsLanguage: ['en-IN', 'kn'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}#website`,
      url: SITE.url,
      name: SITE.name,
      publisher: { '@id': `${SITE.url}#organization` },
      inLanguage: 'en-IN',
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE.url}#webpage`,
      url: SITE.url,
      name: SITE.title,
      description: SITE.description,
      isPartOf: { '@id': `${SITE.url}#website` },
      about: { '@id': `${SITE.url}#cafe` },
      primaryImageOfPage: { '@type': 'ImageObject', url: SITE.image, width: 1200, height: 630 },
      inLanguage: 'en-IN',
    },
  ],
}
