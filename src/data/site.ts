import { VISIT } from './visit.ts'

/** Public, verified facts only. Planned hours are deliberately not operating hours. */
export const SITE = {
  url: 'https://nillu.cafe/',
  name: 'Nillu Cafe',
  title: 'Nillu Cafe | 2D Café in HSR Layout, Bengaluru',
  description: 'Nillu Cafe is opening soon in HSR Layout, Bengaluru. Discover a café designed like a drawing, with coffee, fresh juices, smoothie bowls, snacks and desserts.',
  image: 'https://nillu.cafe/social-preview.png',
  imageAlt: 'Nillu Cafe. A 2D cafe opening soon in HSR Layout, Bengaluru. Step into a sketch. Make a real moment.',
}

// CafeOrCoffeeShop is a LocalBusiness subtype of Organization, so the stable
// #business @id is kept. Opening hours are intentionally absent until the cafe
// actually opens; publishing them now would present a closed business as trading.
export const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CafeOrCoffeeShop',
      '@id': `${SITE.url}#business`,
      name: SITE.name,
      alternateName: ['Nillu', 'ನಿಲ್ಲು'],
      url: SITE.url,
      description: SITE.description,
      sameAs: [VISIT.instagramUrl, VISIT.facebookUrl].filter(Boolean),
      logo: { '@type': 'ImageObject', url: `${SITE.url}brand/nillu-logo.png` },
      image: SITE.image,
      address: {
        '@type': 'PostalAddress',
        streetAddress: VISIT.street,
        addressLocality: `${VISIT.locality}, ${VISIT.city}`,
        addressRegion: VISIT.region,
        postalCode: VISIT.postalCode,
        addressCountry: VISIT.country,
      },
      areaServed: { '@type': 'Place', name: 'HSR Layout, Bengaluru' },
      servesCuisine: ['Coffee', 'Juices', 'Desserts', 'Snacks'],
      knowsLanguage: ['en-IN', 'kn'],
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
